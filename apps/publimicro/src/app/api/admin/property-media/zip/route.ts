import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import path from 'path';
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

function sanitizeFileName(name: string) {
  return (name || 'file').replace(/[^a-zA-Z0-9-_.]/g, '_').slice(0, 180);
}

export async function POST(req: NextRequest) {
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
    const uploads: any[] = [];

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
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2,8)}_${sanitizeFileName(path.basename(entryName))}`;
        const pathKey = `${folder}/${fileName}`;
        const content = entry.getData();
        const { error: upErr } = await svc.storage.from('property-photos').upload(pathKey, content, { contentType: mime, upsert: false });
        if (upErr) { uploads.push({ name: entryName, error: upErr.message }); continue; }
        const { data } = svc.storage.from('property-photos').getPublicUrl(pathKey);
        uploads.push({ name: entryName, publicUrl: data.publicUrl, path: pathKey });
      } catch (err: any) {
        uploads.push({ name: entryName, error: err.message || String(err) });
      }
    }

    const successful = uploads.filter((u: any) => u.publicUrl);
    for (const u of successful) {
      try {
        await svc.from('property_photos').insert({ property_id: propertyId, url: u.publicUrl, thumbnail_url: null, caption: u.name || null, display_order: 0, is_cover: false });
      } catch (err) {
        console.error('Failed to insert property_photos row', err);
      }
    }

    try { await svc.from('property_media_audit').insert({ property_id: propertyId, uploads, changed_by: req.headers.get('x-admin-user') || 'admin-zip' }); } catch (err) { console.error('Failed to write property_media_audit', err); }

    return NextResponse.json({ ok: true, uploads });
  } catch (err: any) {
    console.error('admin zip upload error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
