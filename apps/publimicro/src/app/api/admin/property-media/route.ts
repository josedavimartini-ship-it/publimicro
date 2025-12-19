import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabaseClient } from '@/lib/supabaseServer';
import { randomUUID } from 'crypto';

const ADMIN_HEADER = 'x-admin-key';
const DEFAULT_MAX_BYTES = 50 * 1024 * 1024; // 50 MB
const DEFAULT_MAX_FILES = 20;
const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/avif',
  'video/mp4',
  'video/quicktime',
  'application/vnd.google-earth.kml+xml',
  'application/xml',
  'text/xml'
];

function sanitizeFileName(name: string) {
  return (name || 'file').replace(/[^a-zA-Z0-9-_.]/g, '_').slice(0, 180);
}

function isMimeAllowed(mime?: string) {
  if (!mime) return false;
  return ALLOWED_MIMES.includes(mime.toLowerCase());
}

export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return NextResponse.json({ error: 'ADMIN_API_KEY not configured' }, { status: 500 });
  const provided = req.headers.get(ADMIN_HEADER) || '';
  if (provided !== adminKey) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const MAX_BYTES = Number(process.env.ADMIN_MAX_UPLOAD_BYTES || DEFAULT_MAX_BYTES);
  const MAX_FILES = Number(process.env.ADMIN_MAX_UPLOAD_FILES || DEFAULT_MAX_FILES);

  try {
    type FilePayload = { name?: string; base64?: string; mime?: string };
    type KmlPayload = { name?: string; base64?: string; mime?: string };
    type UploadResult = { name: string; publicUrl?: string; path?: string; error?: string };

    const raw = await req.json() as unknown;
    if (typeof raw !== 'object' || raw === null) {
      return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
    }
    const body = raw as Record<string, unknown>;
    const propertyId = String(body.property_id ?? "").trim();
    const files = Array.isArray(body.files) ? (body.files as Array<unknown>) : [];
    const kml = (body.kmlFile && typeof body.kmlFile === 'object') ? (body.kmlFile as Record<string, unknown>) : undefined;

    if (!propertyId) return NextResponse.json({ error: 'property_id is required' }, { status: 400 });
    if (files.length + (kml ? 1 : 0) > MAX_FILES) return NextResponse.json({ error: `Too many files (max ${MAX_FILES})` }, { status: 400 });

    const svc = createServiceSupabaseClient();
    const uploads: Array<Record<string, unknown>> = [];

    for (const rawF of files) {
      const f = (rawF as Record<string, unknown>) || {};
      const nameRaw = String(f.name ?? 'file');
      const mime = String(f.mime ?? '').toLowerCase();
      if (!isMimeAllowed(mime)) {
        uploads.push({ name: nameRaw, error: 'MIME type not allowed' });
        continue;
      }

      // Quick size check using base64 length when available
      const base64 = String(f.base64 ?? '');
      const estimatedBytes = Math.floor((base64.length * 3) / 4);
      if (estimatedBytes > MAX_BYTES) {
        uploads.push({ name: nameRaw, error: `File exceeds max size of ${Math.round(MAX_BYTES / (1024 * 1024))}MB` });
        continue;
      }

      try {
        const folder = `properties/${String(propertyId)}`;
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2,8)}_${sanitizeFileName(nameRaw)}`;
        const path = `${folder}/${fileName}`;
        const buffer = Buffer.from(base64, 'base64');
        const { error: upErr } = await svc.storage.from('property-photos').upload(path, buffer, { contentType: mime || 'application/octet-stream', upsert: false });
        if (upErr) {
          const upErrMsg = upErr && typeof upErr === 'object' && 'message' in upErr ? String((upErr as Record<string, unknown>)['message']) : String(upErr);
          uploads.push({ name: nameRaw, error: upErrMsg });
          continue;
        }
        const { data } = svc.storage.from('property-photos').getPublicUrl(path);
        const publicUrl = data && typeof data === 'object' && 'publicUrl' in data ? String((data as Record<string, unknown>)['publicUrl']) : undefined;
        uploads.push({ name: nameRaw, publicUrl, path });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        uploads.push({ name: nameRaw, error: msg });
      }
    }

    let kmlPublicUrl: string | null = null;
    if (kml && typeof (kml as Record<string, unknown>).base64 === 'string') {
      const kmlNameRaw = String((kml as Record<string, unknown>)?.name ?? 'map.kml');
      const kmlMime = String((kml as Record<string, unknown>)?.mime ?? 'application/vnd.google-earth.kml+xml');
      if (!isMimeAllowed(kmlMime)) {
        uploads.push({ name: kmlNameRaw, error: 'KML MIME type not allowed' });
      } else {
        const base64 = String((kml as Record<string, unknown>)?.base64 ?? '');
        const estimatedBytes = Math.floor((base64.length * 3) / 4);
        if (estimatedBytes > MAX_BYTES) {
          uploads.push({ name: kmlNameRaw, error: `KML file exceeds max size of ${Math.round(MAX_BYTES / (1024 * 1024))}MB` });
        } else {
          try {
            const name = `properties/${String(propertyId)}/kml_${Date.now()}_${Math.random().toString(36).slice(2,8)}_${sanitizeFileName(kmlNameRaw)}`;
            const buffer = Buffer.from(base64, 'base64');
            const { error: kErr } = await svc.storage.from('property-photos').upload(name, buffer, { contentType: kmlMime, upsert: false });
              if (!kErr) {
                const { data } = svc.storage.from('property-photos').getPublicUrl(name);
                kmlPublicUrl = data && typeof data === 'object' && 'publicUrl' in data ? String((data as Record<string, unknown>)['publicUrl']) : null;
              } else {
                const kErrMsg = kErr && typeof kErr === 'object' && 'message' in kErr ? String(((kErr as unknown) as Record<string, unknown>)['message']) : String(kErr);
                uploads.push({ name: kmlNameRaw, error: kErrMsg });
              }
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            uploads.push({ name: kmlNameRaw, error: msg });
          }
        }
      }
    }

    const USE_PLACEHOLDERS = process.env.FEATURE_MEDIA_PLACEHOLDERS === 'true';
    const successful = uploads.filter((u): u is Record<string, unknown> & { publicUrl: string } => typeof u.publicUrl === 'string');
    for (const u of successful) {
      try {
        if (USE_PLACEHOLDERS) {
          const placeholderId = randomUUID();
          await svc.from('media').insert({
            resource_type: 'property',
            resource_id: propertyId,
            placeholder_id: placeholderId,
            url: u.publicUrl,
            thumbnail_url: (u.thumbnail as string) || null,
            caption_pt: (u.name as string) || null,
            status: 'processing',
            display_order: 0,
            is_cover: false
          });
          u.placeholderId = placeholderId;
        } else {
          await svc.from('property_photos').insert({ property_id: propertyId, url: u.publicUrl, thumbnail_url: null, caption: (u.name as string) || null, display_order: 0, is_cover: false });
        }
      } catch (err) {
        console.error('Failed to insert property_photos/media row', err);
      }
    }

    if (kmlPublicUrl) {
      try { await svc.from('sitios').update({ kml_url: kmlPublicUrl }).eq('id', propertyId); } catch (err) { console.error('Failed to update sitios.kml_url', err); }
    }

    try { await svc.from('property_media_audit').insert({ property_id: propertyId, uploads, changed_by: req.headers.get('x-admin-user') || 'admin-api' }); } catch (e: unknown) { console.error('Failed to write property_media_audit', e instanceof Error ? e.message : String(e)); }

    return NextResponse.json({ ok: true, uploads, kml_url: kmlPublicUrl });
  } catch (e: unknown) {
    console.error('property-media admin error', e instanceof Error ? e.message : String(e));
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
