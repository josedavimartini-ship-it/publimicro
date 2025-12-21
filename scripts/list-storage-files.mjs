#!/usr/bin/env node
import fs from 'fs/promises';
import process from 'process';
import { createClient } from '@supabase/supabase-js';

// Usage:
// SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... node scripts/list-storage-files.mjs --prefix sitios --slugs abare,bigua,mergulhao,seriema,juriti,surucua --out artifacts/storage-files.json

async function main() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--prefix') params.prefix = args[++i];
    if (args[i] === '--slugs') params.slugs = (args[++i] || '').split(',').map(s => s.trim()).filter(Boolean);
    if (args[i] === '--out') params.out = args[++i];
    if (args[i] === '--bucket') params.bucket = args[++i];
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !svcKey) {
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment');
    process.exit(1);
  }

  const bucket = params.bucket || 'public';
  const prefix = params.prefix || 'imagens-sitios';
  const slugs = params.slugs || ['abare','bigua','mergulhao','seriema','juriti','surucua'];
  const outPath = params.out || 'artifacts/storage-files.json';

  const supabase = createClient(supabaseUrl, svcKey, { auth: { persistSession: false } });

  const out = { timestamp: new Date().toISOString(), by_slug: {} };
  // If we fallback to list under 'public' bucket, this variable holds the folder name (e.g. 'imagens-sitios')
  let PUBLIC_PREFIX = null;

  // Ensure bucket defaults to 'imagens-sitios' which holds the sitio folders
  const effectiveBucket = params.bucket || 'imagens-sitios';

  for (const slug of slugs) {
    out.by_slug[slug] = { files: [] };
    try {
      // Normalize helpers
      const stripDiacritics = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const capitalize = s => s ? (s[0].toUpperCase() + s.slice(1)) : s;

      // List top-level entries so we can find folder names that match slug (case/diacritics tolerant)
      let { data: rootItems, error: rootErr } = await supabase.storage.from(effectiveBucket).list('', { limit: 500, offset: 0 });
      if (rootErr) rootItems = [];
      // If bucket appears empty, try falling back to 'public' bucket and look for the prefix (e.g., 'imagens-sitios')
      if ((!rootItems || rootItems.length === 0) && effectiveBucket !== 'public') {
        try {
          const { data: publicRoot } = await supabase.storage.from('public').list('', { limit: 500, offset: 0 });
          if (publicRoot && publicRoot.length) {
            // look for folder entries named like the prefix or containing it
            const candidateFolder = (prefix || 'imagens-sitios').replace(/\/+$/,'');
            const found = publicRoot.find(it => it.type === 'folder' && (it.name === candidateFolder || it.name.includes(candidateFolder)));
            if (found) {
              // list the folder contents under public/<candidateFolder>/
              const { data: nestedUnder } = await supabase.storage.from('public').list(`${found.name}/`, { limit: 500, offset: 0 });
              // transform nestedUnder entries to look like they came from effectiveBucket
              rootItems = nestedUnder || [];
              // also bump effectiveBucket conceptually to 'public/<found.name>' so candidate paths are built correctly
              // (we'll treat candidate name as the folder root)
              // mark a debug note
              console.log(`Fallback: found folder '${found.name}' in 'public' bucket, searching inside it`);
              // adjust a marker so later code builds candidate paths accordingly
              PUBLIC_PREFIX = found.name;
            }
          }
        } catch (e) {
          // ignore
        }
      }
      const bucketBase = (typeof PUBLIC_PREFIX === 'string' && PUBLIC_PREFIX) ? PUBLIC_PREFIX : (prefix || effectiveBucket);
      const bucketPrefixBase = bucketBase.replace(/\/\+$/,'');
      const normalizedSlug = stripDiacritics(slug);
      // Find candidate folder names in root that match the slug (either exact or diacritics-insensitive)
      const candidates = [];
      for (const it of rootItems || []) {
        if (it.type === 'folder') {
          if (stripDiacritics(it.name).includes(normalizedSlug) || stripDiacritics(it.name) === normalizedSlug) candidates.push(it.name);
        }
      }

      // also try simple variants if no candidates found
      if (candidates.length === 0) {
        candidates.push(slug);
        candidates.push(capitalize(slug));
      }

      // Helper to test a candidate URL exists (HEAD)
      async function urlExists(u) {
        try {
          const res = await fetch(u, { method: 'HEAD' });
          return res && res.ok;
        } catch (e) {
          return false;
        }
      }

      // Try each candidate folder name until we find files
      let foundAny = false;
      for (const cand of candidates) {
        const folder = `${cand.replace(/\/+$/,'')}/`;
        let { data, error } = await supabase.storage.from(effectiveBucket).list(folder, { limit: 500, offset: 0, sortBy: { column: 'name', order: 'asc' } });
        if (error) {
          // not found – continue to next candidate
          continue;
        }
        // If folder contains entries, process them
        if (data && data.length) {
          foundAny = true;
          for (const item of data) {
            if (item.type === 'folder') {
              // nested
              const nestedPath = `${folder}${item.name}/`;
              let { data: nested } = await supabase.storage.from(effectiveBucket).list(nestedPath, { limit: 500, offset: 0 });
              for (const f of nested || []) {
                const candidate = `${bucketPrefixBase}/${cand}/${item.name}/${f.name}`;
                const publicUrl = `${supabaseUrl}/storage/v1/object/public/${candidate}`.replace(/\\/g, '/');
                if (await urlExists(publicUrl)) out.by_slug[slug].files.push({ name: f.name, path: `${item.name}/${f.name}`, publicUrl });
              }
            } else {
              const candidate = `${bucketPrefixBase}/${cand}/${item.name}`;
              const publicUrl = `${supabaseUrl}/storage/v1/object/public/${candidate}`.replace(/\\/g, '/');
              if (await urlExists(publicUrl)) out.by_slug[slug].files.push({ name: item.name, path: item.name, publicUrl });
            }
          }
          // if we found files for this candidate, stop trying others
          if (out.by_slug[slug].files.length) break;
        }
      }

      // If we didn't find files by candidate folders, try a wider search of root items for file names containing the slug
      if (!foundAny) {
        for (const it of rootItems || []) {
          if (it.type === 'file' && stripDiacritics(it.name).includes(normalizedSlug)) {
            const candidate = `${bucketPrefixBase}/${it.name}`;
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/${candidate}`.replace(/\\/g, '/');
            if (await urlExists(publicUrl)) out.by_slug[slug].files.push({ name: it.name, path: it.name, publicUrl });
          }
        }
      }
    } catch (e) {
      console.error('Fatal listing', slug, e.message || e);
    }
  }

  await fs.mkdir('artifacts', { recursive: true }).catch(()=>{});
  await fs.writeFile(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
