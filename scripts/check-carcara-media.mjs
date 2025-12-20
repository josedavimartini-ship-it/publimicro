import fs from 'fs/promises';
import process from 'process';
import { createClient } from '@supabase/supabase-js';

const CANONICAL_PATH = 'apps/publimicro/src/lib/AcheMeRuralPropers.json';

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || null;
}
function getServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;
}

function makePhotoUrl(photoPath, supabaseUrl) {
  if (!photoPath) return null;
  const trimmed = String(photoPath).trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const clean = trimmed.replace(/^\/+/, '');
  if (clean.startsWith('storage/')) return `${supabaseUrl}/${clean}`;
  if (clean.includes('/')) return `${supabaseUrl}/storage/v1/object/public/${clean}`;
  return `${supabaseUrl}/storage/v1/object/public/imagens-sitios/${clean}`;
}

async function checkUrlHead(url, timeout = 8000) {
  const result = { url, status: null, ok: false, note: null, contentType: null };
  if (!url) { result.note = 'invalid'; return result; }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let res;
    try {
      res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    } catch (e) {
      // fallback to GET
    }
    clearTimeout(timer);
    if (!res || res.status === 405 || res.status === 403 || res.status === 401) {
      try {
        const controller2 = new AbortController();
        const timer2 = setTimeout(() => controller2.abort(), timeout + 2000);
        const res2 = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller2.signal });
        clearTimeout(timer2);
        res = res2;
      } catch (e) {
        result.note = 'network error: ' + (e.message || String(e));
        return result;
      }
    }
    result.status = res.status;
    result.ok = res.ok && res.status >= 200 && res.status < 400;
    result.contentType = res.headers.get('content-type');
    result.note = res.ok ? 'OK' : `HTTP ${res.status}`;
  } catch (e) {
    result.note = 'fetch error: ' + (e.message || String(e));
  }
  return result;
}

async function main() {
  const supabaseUrl = getSupabaseUrl();
  const svcKey = getServiceKey();
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
  if (!svcKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY not set');

  const supabase = createClient(supabaseUrl, svcKey, { auth: { persistSession: false } });
  const canonical = JSON.parse(await fs.readFile(CANONICAL_PATH, 'utf8'));
  const slugs = (canonical || []).map(p => p.slug).filter(Boolean);

  const out = { timestamp: new Date().toISOString(), properties: [] };

  for (const slug of slugs) {
    const prop = { slug, id: slug, nome: null, fotos: [], fotos_status: [], videos: [], videos_status: [] };

    // Fetch property row (try slug first, then id, then project-filter fallback)
    let row = null;
    try {
      let res = await supabase.from('properties').select('id, slug, nome, fotos').eq('slug', slug).limit(1);
      if (res.error || !res.data || res.data.length === 0) {
        res = await supabase.from('properties').select('id, slug, nome, fotos').eq('id', slug).limit(1);
      }
      if (res && !res.error && res.data && res.data.length > 0) {
        row = res.data[0];
      } else {
        const { data: proj } = await supabase.from('properties').select('id, slug, nome, fotos, project').eq('project', 'Sítios Carcará').in('slug', [slug]).limit(1);
        if (proj && proj.length > 0) row = proj[0];
      }
    } catch (e) {
      prop.note = 'property query error: ' + (e.message || String(e));
      out.properties.push(prop);
      continue;
    }

    if (!row) {
      prop.note = 'property not found in DB';
      out.properties.push(prop);
      continue;
    }

    prop.nome = row.nome;
    prop.fotos = Array.isArray(row.fotos) ? row.fotos : [];

    // Check photos
    for (const p of prop.fotos) {
      const url = makePhotoUrl(p, supabaseUrl);
      const res = await checkUrlHead(url);
      prop.fotos_status.push({ original: p, url, ...res });
    }

    // Listing videos (both listing_videos and media table)
    try {
      const { data: videos } = await supabase.from('listing_videos').select('id,listing_id,url,thumbnail_url,duration_seconds').eq('listing_id', row.id).limit(20);
      if (videos && videos.length) {
        for (const v of videos) {
          const urlRes = await checkUrlHead(v.url);
          const thumbRes = v.thumbnail_url ? await checkUrlHead(v.thumbnail_url) : null;
          prop.videos.push(v);
          prop.videos_status.push({ id: v.id, url: v.url, url_status: urlRes, thumbnail_url: v.thumbnail_url, thumbnail_status: thumbRes });
        }
      }
    } catch (e) {
      prop.videos_note = 'listing_videos query failed: ' + (e.message || String(e));
    }

    // Check media table for resource_type = 'property' (if present)
    try {
      const { data: mediaRows } = await supabase.from('media').select('id,resource_type,resource_id,url,status').eq('resource_type', 'property').eq('resource_id', row.id).limit(50);
      if (mediaRows && mediaRows.length) {
        for (const m of mediaRows) {
          const res = await checkUrlHead(m.url);
          prop.media = prop.media || [];
          prop.media.push({ id: m.id, url: m.url, status: m.status, url_status: res });
        }
      }
    } catch (e) {
      prop.media_note = 'media query failed: ' + (e.message || String(e));
    }

    out.properties.push(prop);
  }

  await fs.mkdir('artifacts', { recursive: true }).catch(() => {});
  await fs.writeFile('artifacts/carcara-media.json', JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote artifacts/carcara-media.json');
}

// Run when executed directly
main().catch(e => { console.error('Fatal:', e.message || e); process.exit(1); });
