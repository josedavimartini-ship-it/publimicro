import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabaseClient } from '@/lib/supabaseServer';

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
    const body = await req.json();
    const propertyId = body?.property_id;
    const files = Array.isArray(body?.files) ? body.files : [];
    const kml = body?.kmlFile;

    if (!propertyId) return NextResponse.json({ error: 'property_id is required' }, { status: 400 });
    if (files.length + (kml ? 1 : 0) > MAX_FILES) return NextResponse.json({ error: `Too many files (max ${MAX_FILES})` }, { status: 400 });

    const svc = createServiceSupabaseClient();
    const uploads: any[] = [];

    for (const f of files) {
      const nameRaw = String(f.name || 'file');
      const mime = String(f.mime || '').toLowerCase();
      if (!isMimeAllowed(mime)) {
        uploads.push({ name: nameRaw, error: 'MIME type not allowed' });
        continue;
      }

      // Quick size check using base64 length when available
      const base64 = String(f.base64 || '');
      const estimatedBytes = Math.floor((base64.length * 3) / 4);
      if (estimatedBytes > MAX_BYTES) {
        uploads.push({ name: nameRaw, error: `File exceeds max size of ${Math.round(MAX_BYTES / (1024 * 1024))}MB` });
        continue;
      }

      try {
        const folder = `properties/${propertyId}`;
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2,8)}_${sanitizeFileName(nameRaw)}`;
        const path = `${folder}/${fileName}`;
        const buffer = Buffer.from(base64, 'base64');
        const { error: upErr } = await svc.storage.from('property-photos').upload(path, buffer, { contentType: mime || 'application/octet-stream', upsert: false });
        if (upErr) { uploads.push({ name: nameRaw, error: upErr.message }); continue; }
        const { data } = svc.storage.from('property-photos').getPublicUrl(path);
        uploads.push({ name: nameRaw, publicUrl: data.publicUrl, path });
      } catch (err: any) {
        uploads.push({ name: nameRaw, error: err.message || String(err) });
      }
    }

    let kmlPublicUrl: string | null = null;
    if (kml && kml.base64) {
      const kmlNameRaw = String(kml.name || 'map.kml');
      const kmlMime = String(kml.mime || 'application/vnd.google-earth.kml+xml');
      if (!isMimeAllowed(kmlMime)) {
        uploads.push({ name: kmlNameRaw, error: 'KML MIME type not allowed' });
      } else {
        const base64 = String(kml.base64 || '');
        const estimatedBytes = Math.floor((base64.length * 3) / 4);
        if (estimatedBytes > MAX_BYTES) {
          uploads.push({ name: kmlNameRaw, error: `KML file exceeds max size of ${Math.round(MAX_BYTES / (1024 * 1024))}MB` });
        } else {
          try {
            const name = `properties/${propertyId}/kml_${Date.now()}_${Math.random().toString(36).slice(2,8)}_${sanitizeFileName(kmlNameRaw)}`;
            const buffer = Buffer.from(base64, 'base64');
            const { error: kErr } = await svc.storage.from('property-photos').upload(name, buffer, { contentType: kmlMime, upsert: false });
            if (!kErr) {
              const { data } = svc.storage.from('property-photos').getPublicUrl(name);
              kmlPublicUrl = data.publicUrl;
            } else {
              uploads.push({ name: kmlNameRaw, error: kErr.message });
            }
          } catch (err: any) {
            uploads.push({ name: kmlNameRaw, error: err.message || String(err) });
          }
        }
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

    if (kmlPublicUrl) {
      try { await svc.from('properties').update({ kml_url: kmlPublicUrl }).eq('id', propertyId); } catch (err) { console.error('Failed to update properties.kml_url', err); }
    }

    try { await svc.from('property_media_audit').insert({ property_id: propertyId, uploads, changed_by: req.headers.get('x-admin-user') || 'admin-api' }); } catch (err) { console.error('Failed to write property_media_audit', err); }

    return NextResponse.json({ ok: true, uploads, kml_url: kmlPublicUrl });
  } catch (err: any) {
    console.error('property-media admin error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
