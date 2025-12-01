import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceSupabaseClient } from '@/lib/supabaseServer';
import { randomUUID } from 'crypto';

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
      const normalized = list.map((e: unknown) => String(e).toLowerCase());
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
    const raw = await req.json() as unknown;
    if (typeof raw !== 'object' || raw === null) {
      return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
    }
    const body = raw as { property_id?: unknown; files?: unknown; kmlFile?: unknown };
    const propertyId = body.property_id;
    const files = Array.isArray(body.files) ? (body.files as Array<Record<string, unknown>>) : [];
    const kml = (body.kmlFile && typeof body.kmlFile === 'object') ? (body.kmlFile as Record<string, unknown>) : undefined;

    if (!propertyId) return NextResponse.json({ error: 'property_id is required' }, { status: 400 });

    const svc = createServiceSupabaseClient();
    const uploads: Array<Record<string, unknown>> = [];

    // Upload files to bucket 'property-photos'
    for (const f of files) {
      try {
        const folder = `properties/${String(propertyId)}`;
        const fname = String(f?.name ?? 'file');
        const name = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2,8)}_${fname}`;
        const base64 = String((f as Record<string, unknown>)?.base64 ?? '');
        const buffer = Buffer.from(base64, 'base64');
        const contentType = String((f as Record<string, unknown>)?.mime ?? 'application/octet-stream');
        const { error: upErr } = await svc.storage.from('property-photos').upload(name, buffer, { contentType, upsert: false });
        if (upErr) {
          const upErrMsg = upErr && typeof upErr === 'object' && 'message' in upErr ? String(((upErr as unknown) as Record<string, unknown>)['message']) : String(upErr);
          uploads.push({ name: fname, error: upErrMsg });
          continue;
        }
        const { data } = svc.storage.from('property-photos').getPublicUrl(name);
        const publicUrl = data && typeof data === 'object' && 'publicUrl' in data ? String((data as Record<string, unknown>)['publicUrl']) : undefined;
        uploads.push({ name: fname, publicUrl, path: name });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        uploads.push({ name: String((f as Record<string, unknown>)?.name ?? 'file'), error: msg });
      }
    }

    let kmlPublicUrl: string | null = null;
    if (kml && typeof kml.base64 === 'string') {
      try {
        const kname = String(kml.name ?? 'map.kml');
        const name = `properties/${String(propertyId)}/kml_${Date.now()}_${Math.random().toString(36).slice(2,8)}_${kname}`;
        const buffer = Buffer.from(String(kml.base64), 'base64');
        const contentType = String(kml.mime ?? 'application/vnd.google-earth.kml+xml');
        const { error: kErr } = await svc.storage.from('property-photos').upload(name, buffer, { contentType, upsert: false });
        if (!kErr) {
          const { data } = svc.storage.from('property-photos').getPublicUrl(name);
                kmlPublicUrl = data && typeof data === 'object' && 'publicUrl' in data ? String((data as Record<string, unknown>)['publicUrl']) : null;
        } else {
          const kErrMsg = kErr && typeof kErr === 'object' && 'message' in kErr ? String(((kErr as unknown) as Record<string, unknown>)['message']) : String(kErr);
          uploads.push({ name: kname, error: kErrMsg });
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        uploads.push({ name: String(kml.name ?? 'map.kml'), error: msg });
      }
    }

    // Insert into unified media table when feature flag enabled, otherwise legacy property_photos
    const USE_PLACEHOLDERS = process.env.FEATURE_MEDIA_PLACEHOLDERS === 'true';
    const successful = uploads.filter((u): u is Record<string, unknown> & { publicUrl: string } => typeof u.publicUrl === 'string');
    for (let i = 0; i < successful.length; i++) {
      const u = successful[i];
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
            display_order: i,
            is_cover: i === 0
          });
          u.placeholderId = placeholderId;
        } else {
          await svc.from('property_photos').insert({ property_id: propertyId, url: u.publicUrl, thumbnail_url: null, caption: (u.name as string) || null, display_order: 0, is_cover: false });
        }
      } catch (err) {
        console.error('Failed to insert property_photos/media row', err);
      }
    }

    // Update sitios.kml_url if kmlPublicUrl present
    if (kmlPublicUrl) {
      try {
        await svc.from('sitios').update({ kml_url: kmlPublicUrl }).eq('id', propertyId);
      } catch (err) {
        console.error('Failed to update sitios.kml_url', err);
      }
    }

    // Write audit record
    try {
      const changedBy = (auth.user && (auth.user.email || auth.user.id)) || null;
      await svc.from('property_media_audit').insert({ property_id: propertyId, uploads: uploads, changed_by: changedBy });
    } catch (e: unknown) {
      console.error('Failed to write property_media_audit', e instanceof Error ? e.message : String(e));
    }

    return NextResponse.json({ ok: true, uploads, kml_url: kmlPublicUrl });
  } catch (e: unknown) {
    console.error('property-media proxy error', e instanceof Error ? e.message : String(e));
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
