import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { transcodeVideo, generateThumbnail } from '@/lib/ffmpegUtils';
import { randomUUID } from 'crypto';
import { createServiceSupabaseClient } from '@/lib/supabaseServer';

const ADMIN_HEADER = 'x-admin-key';
const DEFAULT_MAX_BYTES = 200 * 1024 * 1024; // 200 MB for zip
const ALLOWED_EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.kml': 'application/vnd.google-earth.kml+xml'
};

function sanitizeFileName(name: string): string {
  return (name || 'file').replace(/[^a-zA-Z0-9-_.]/g, '_').slice(0, 180);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return NextResponse.json({ error: 'ADMIN_API_KEY not configured' }, { status: 500 });
  const provided = req.headers.get(ADMIN_HEADER) || '';
  if (provided !== adminKey) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const propertyId = body?.property_id;
    const zipObj = body?.zip;
    if (!propertyId) return NextResponse.json({ error: 'property_id is required' }, { status: 400 });
    if (!zipObj || !zipObj.base64) return NextResponse.json({ error: 'zip file required' }, { status: 400 });

    const estimatedBytes = Math.floor((String(zipObj.base64).length * 3) / 4);
    const MAX_BYTES = Number(process.env.ADMIN_MAX_UPLOAD_BYTES || DEFAULT_MAX_BYTES);
    if (estimatedBytes > MAX_BYTES) return NextResponse.json({ error: `ZIP exceeds max size of ${Math.round(MAX_BYTES / (1024 * 1024))}MB` }, { status: 400 });

    const svc = createServiceSupabaseClient();
    const buffer = Buffer.from(zipObj.base64, 'base64');
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();
    interface UploadResult {
      name?: string;
      publicUrl?: string;
      thumbnail?: string;
      path?: string;
      error?: string;
      placeholderId?: string;
    }

    const uploads: UploadResult[] = [];

    for (const entry of entries) {
      if (entry.isDirectory) continue;
      const entryName = entry.entryName;
      const ext = path.extname(entryName || '').toLowerCase();
      const mime = ALLOWED_EXT_TO_MIME[ext];
      if (!mime) {
        uploads.push({ name: entryName, error: 'Unsupported file extension' });
        continue;
      }

    try {
        const folder = `properties/${propertyId}`;
        const baseFileName = `${Date.now()}_${Math.random().toString(36).slice(2,8)}_${sanitizeFileName(path.basename(entryName))}`;
        const pathKey = `${folder}/${baseFileName}`;
        const content = entry.getData();

        // If this is a video, transcode a web-friendly MP4 and generate a thumbnail
        if (mime.startsWith('video/')) {
          // Write source to temp file
          const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'admin-zip-'));
          const srcPath = path.join(tmpDir, baseFileName + path.extname(entryName));
          await fs.writeFile(srcPath, content);

          const outFile = path.join(tmpDir, baseFileName + '.mp4');
          const thumbFile = path.join(tmpDir, baseFileName + '.jpg');

          // Transcode to MP4 H.264 (compatible targets) using modern ffmpeg utils
          await transcodeVideo(srcPath, outFile, { maxHeight: 720, preset: 'veryfast', crf: 23 });

          // Generate a thumbnail
          await generateThumbnail(outFile, thumbFile, { width: 640 });

          // Upload transcoded video
          const videoBuffer = await fs.readFile(outFile);
          const { error: upErr } = await svc.storage.from('property-photos').upload(`${pathKey}.mp4`, videoBuffer, { contentType: 'video/mp4', upsert: false });
          if (upErr) { uploads.push({ name: entryName, error: upErr.message }); await fs.remove(tmpDir); continue; }
          const { data: dataVideo } = svc.storage.from('property-photos').getPublicUrl(`${pathKey}.mp4`);

          // Upload thumbnail
          const thumbBuffer = await fs.readFile(thumbFile);
          const { error: upErr2 } = await svc.storage.from('property-photos').upload(`${pathKey}_thumb.jpg`, thumbBuffer, { contentType: 'image/jpeg', upsert: false });
          if (upErr2) { uploads.push({ name: entryName, error: upErr2.message }); await fs.remove(tmpDir); continue; }
          const { data: dataThumb } = svc.storage.from('property-photos').getPublicUrl(`${pathKey}_thumb.jpg`);

          uploads.push({ name: entryName, publicUrl: dataVideo.publicUrl, thumbnail: dataThumb.publicUrl, path: `${pathKey}.mp4` });
          await fs.remove(tmpDir);
          continue;
        }

        // Non-video: upload directly
        const { error: upErr } = await svc.storage.from('property-photos').upload(pathKey, content, { contentType: mime, upsert: false });
        if (upErr) { uploads.push({ name: entryName, error: upErr.message }); continue; }
        const { data } = svc.storage.from('property-photos').getPublicUrl(pathKey);
        uploads.push({ name: entryName, publicUrl: data.publicUrl, path: pathKey });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        uploads.push({ name: entryName, error: msg });
      }
    }

    const USE_PLACEHOLDERS = process.env.FEATURE_MEDIA_PLACEHOLDERS === 'true';
    const successful = uploads.filter((u) => !!u.publicUrl);
    for (const u of successful) {
      try {
        if (USE_PLACEHOLDERS) {
          const placeholderId = randomUUID();
          await svc.from('media').insert({
            resource_type: 'property',
            resource_id: propertyId,
            placeholder_id: placeholderId,
            url: u.publicUrl,
            thumbnail_url: u.thumbnail || null,
            caption_pt: u.name || null,
            status: 'processing',
            display_order: 0,
            is_cover: false
          });
          u.placeholderId = placeholderId;
        } else {
          await svc.from('property_photos').insert({ property_id: propertyId, url: u.publicUrl, thumbnail_url: null, caption: u.name || null, display_order: 0, is_cover: false });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Failed to insert property_photos/media row', msg);
      }
    }
    try {
      await svc.from('property_media_audit').insert({ property_id: propertyId, uploads, changed_by: req.headers.get('x-admin-user') || 'admin-zip' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Failed to write property_media_audit', msg);
    }

    return NextResponse.json({ ok: true, uploads });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('admin zip upload error', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
