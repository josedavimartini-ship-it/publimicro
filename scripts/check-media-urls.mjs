import fs from 'fs/promises';
import process from 'process';
import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
const opts = { fromDb: false, file: null, out: 'check-media-urls.results.json', concurrency: 10 };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--from-db') opts.fromDb = true;
  if (a === '--from-file') opts.file = args[++i];
  if (a === '--out') opts.out = args[++i];
  if (a === '--concurrency') opts.concurrency = Number(args[++i]);
}

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

async function gatherFromFile(path) {
  const raw = await fs.readFile(path, 'utf8');
  const arr = JSON.parse(raw);
  const urls = [];
  for (const item of arr) {
    if (item.url) urls.push({ source: path, id: item.id || null, url: item.url });
    else if (typeof item === 'string') urls.push({ source: path, id: null, url: item });
    else if (item.fotos && Array.isArray(item.fotos)) {
      for (const p of item.fotos) urls.push({ source: path, id: item.id || null, url: p });
    }
  }
  return urls;
}

async function gatherFromDb() {
  const supabaseUrl = getSupabaseUrl();
  const svcKey = getServiceKey();
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
  if (!svcKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY not set');

  const supabase = createClient(supabaseUrl, svcKey, { auth: { persistSession: false } });
  const urls = [];

  // sitios fotos
  console.log('Querying sitios for fotos...');
  {
    const { data, error } = await supabase.from('sitios').select('id,nome,fotos').limit(2000);
    if (error) throw error;
    for (const r of data || []) {
      if (r.fotos && Array.isArray(r.fotos)) {
        for (const p of r.fotos) {
          const url = makePhotoUrl(p, supabaseUrl);
          if (url) urls.push({ source: 'sitios', id: r.id, url });
        }
      }
    }
  }

  // listing_videos
  console.log('Querying listing_videos for urls...');
  try {
    const { data, error } = await supabase.from('listing_videos').select('id,listing_id,url,thumbnail_url').limit(2000);
    if (error) {
      console.warn('listing_videos query failed or table missing:', error.message || error);
    } else {
      for (const r of data || []) {
        if (r.url) urls.push({ source: 'listing_videos', id: r.id, url: r.url });
        if (r.thumbnail_url) urls.push({ source: 'listing_videos_thumb', id: r.id, url: r.thumbnail_url });
      }
    }
  } catch (e) {
    console.warn('listing_videos fetch error (table may not exist):', e.message || e);
  }

  // listing_photos (best-effort: photo field may be "url" or "path")
  console.log('Querying listing_photos for urls (best-effort)...');
  try {
    const { data, error } = await supabase.from('listing_photos').select('id,listing_id,photo_path,url').limit(2000);
    if (!error) {
      for (const r of data || []) {
        if (r.url) urls.push({ source: 'listing_photos', id: r.id, url: r.url });
        if (r.photo_path) {
          const url = makePhotoUrl(r.photo_path, supabaseUrl);
          if (url) urls.push({ source: 'listing_photos', id: r.id, url });
        }
      }
    }
  } catch (e) {
    // ignore if column names differ
  }

  return urls;
}

async function checkUrl(item) {
  const url = item.url;
  const result = { url, source: item.source || null, id: item.id || null, status: null, note: null, ok: false, contentType: null, contentLength: null };

  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    result.note = 'Invalid URL';
    return result;
  }

  // HEAD with timeout
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let res;
    try {
      res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    } catch (e) {
      // fallback to GET
    }
    clearTimeout(timer);

    if (!res || res.status === 405 || res.status === 403 || res.status === 401 || res.status === 412) {
      // Try GET if HEAD not permitted or auth problems
      try {
        const controller2 = new AbortController();
        const timer2 = setTimeout(() => controller2.abort(), 10000);
        const res2 = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller2.signal });
        clearTimeout(timer2);
        res = res2;
      } catch (e) {
        result.note = 'Network/GET error: ' + (e.message || String(e));
        return result;
      }
    }

    result.status = res.status;
    result.ok = res.ok && res.status >= 200 && res.status < 400;
    result.contentType = res.headers.get('content-type');
    result.contentLength = res.headers.get('content-length');
    result.note = res.ok ? 'OK' : `HTTP ${res.status}`;
  } catch (e) {
    result.note = 'Fetch error: ' + (e.message || String(e));
  }

  return result;
}

async function run() {
  let items = [];
  if (opts.file) {
    console.log('Reading from file:', opts.file);
    items = items.concat(await gatherFromFile(opts.file));
  }
  if (opts.fromDb) {
    console.log('Gathering from DB...');
    items = items.concat(await gatherFromDb());
  }

  // dedupe by URL
  const seen = new Map();
  for (const it of items) {
    if (!it.url) continue;
    if (!seen.has(it.url)) seen.set(it.url, { url: it.url, source: it.source, id: it.id });
  }
  const unique = Array.from(seen.values());

  console.log(`Checking ${unique.length} unique URLs with concurrency ${opts.concurrency}...`);

  const results = [];
  const concurrency = Math.max(1, Number(opts.concurrency) || 10);
  let idx = 0;

  async function worker() {
    while (idx < unique.length) {
      const cur = unique[idx++];
      try {
        const res = await checkUrl(cur);
        results.push(res);
        if (!res.ok) console.warn(`FAIL: ${res.status || ''} ${res.note} ${res.url}`);
      } catch (e) {
        results.push({ url: cur.url, source: cur.source, id: cur.id, note: 'Worker error: ' + (e.message || String(e)) });
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  // summary
  const total = results.length;
  const ok = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  const codeBuckets = results.reduce((acc, r) => {
    const key = r.status ? String(r.status)[0] + 'xx' : 'err';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const out = { total, ok, failed, codeBuckets, results };
  await fs.writeFile(opts.out, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote results to ${opts.out}`);
  console.log(`Summary: total=${total} ok=${ok} failed=${failed}`);
  console.table(codeBuckets);
}

// Run when executed
run().catch(e => { console.error('Fatal:', e.message || e); process.exit(1); });

