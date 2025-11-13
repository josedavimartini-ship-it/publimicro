import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceSupabaseClient } from '@/lib/supabaseServer';

// Proxy for in-app admin UI to upload property media (photos/videos) and optional KML
// Requires session-auth and admin email allowlist (reads app_settings.admin_emails)

async function ensureAdmin() {
  const serverSupabase = createServerSupabaseClient();
  const { data } = await serverSupabase.auth.getUser();
  const user = data?.user;
  if (!user || !user.email) return { ok: false };
  const email = user.email.toLowerCase();

  try {
    const svc = createServiceSupabaseClient();
    const { data: setting } = await svc.from('app_settings').select('value').eq('key', 'admin_emails').maybeSingle();
    if (setting?.value) {
      const list = Array.isArray(setting.value) ? setting.value : JSON.parse(setting.value);
      const normalized = list.map((e: any) => String(e).toLowerCase());
      if (normalized.includes(email)) return { ok: true, user };
    }
  } catch (err) {
    console.error('property-media proxy: failed to read admin_emails', err);
  }

  // fallback hard-coded check
  const FALLBACK = ['admin@publimicro.com.br', 'contato@publimicro.com.br'];
  if (FALLBACK.includes(email)) return { ok: true, user };
  return { ok: false };
}

export async function POST(req: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const propertyId = body?.property_id;
    const files = body?.files || []; // [{ name, base64, mime }]
    const kml = body?.kmlFile; // { name, base64, mime }

    if (!propertyId) return NextResponse.json({ error: 'property_id is required' }, { status: 400 });

    const svc = createServiceSupabaseClient();
    const uploads: any[] = [];

    // Upload files to bucket 'property-photos'
    for (const f of files) {
      try {
        const folder = `properties/${propertyId}`;
        const name = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2,8)}_${(f.name||'file')}`;
        const buffer = Buffer.from(f.base64, 'base64');
        const { error: upErr } = await svc.storage.from('property-photos').upload(name, buffer, { contentType: f.mime || 'application/octet-stream', upsert: false });
        if (upErr) {
          uploads.push({ name: f.name, error: upErr.message });
          continue;
        }
        const { data } = svc.storage.from('property-photos').getPublicUrl(name);
        uploads.push({ name: f.name, publicUrl: data.publicUrl, path: name });
      } catch (err: any) {
        uploads.push({ name: f.name, error: err.message || String(err) });
      }
    }

    let kmlPublicUrl: string | null = null;
    if (kml && kml.base64) {
      try {
        const name = `properties/${propertyId}/kml_${Date.now()}_${Math.random().toString(36).slice(2,8)}_${kml.name || 'map.kml'}`;
        const buffer = Buffer.from(kml.base64, 'base64');
        const { error: kErr } = await svc.storage.from('property-photos').upload(name, buffer, { contentType: kml.mime || 'application/vnd.google-earth.kml+xml', upsert: false });
        if (!kErr) {
          const { data } = svc.storage.from('property-photos').getPublicUrl(name);
          kmlPublicUrl = data.publicUrl;
        } else {
          uploads.push({ name: kml.name, error: kErr.message });
        }
      } catch (err: any) {
        uploads.push({ name: kml.name, error: err.message || String(err) });
      }
    }

    // Update property_photos table for successful uploads
    const successful = uploads.filter(u => u.publicUrl);
    for (let i = 0; i < successful.length; i++) {
      const u = successful[i];
      try {
        await svc.from('property_photos').insert({ property_id: propertyId, url: u.publicUrl, thumbnail_url: null, caption: u.name || null, display_order: 0, is_cover: false });
      } catch (err) {
        console.error('Failed to insert property_photos row', err);
      }
    }

    // Update properties.kml_url if kmlPublicUrl present
    if (kmlPublicUrl) {
      try {
        await svc.from('properties').update({ kml_url: kmlPublicUrl }).eq('id', propertyId);
      } catch (err) {
        console.error('Failed to update properties.kml_url', err);
      }
    }

    // Write audit record
    try {
      const changedBy = (auth.user && (auth.user.email || auth.user.id)) || null;
      await svc.from('property_media_audit').insert({ property_id: propertyId, uploads: uploads, changed_by: changedBy });
    } catch (err) {
      console.error('Failed to write property_media_audit', err);
    }

    return NextResponse.json({ ok: true, uploads, kml_url: kmlPublicUrl });
  } catch (err: any) {
    console.error('property-media proxy error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
