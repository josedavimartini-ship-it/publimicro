#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import AdmZip from 'adm-zip';

// Usage example:
// NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/process-and-upload-sitio-media.mjs --paths "./uploads/abare/abarephotos/abarephotos.zip,./uploads/abare/abarevideos/abarevideos.zip,./uploads/seriema/photos" --processed imagens-sitios-processed --thumbs imagens-sitios-thumbs --out artifacts/processed-uploads.json --dry

async function main() {
  const args = process.argv.slice(2);
  const params = { paths: [], processed: 'imagens-sitios-processed', thumbs: 'imagens-sitios-thumbs', out: 'artifacts/processed-uploads.json', dry: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--paths') params.paths = (args[++i] || '').split(',').map(s => s.trim()).filter(Boolean);
    if (args[i] === '--processed') params.processed = args[++i];
    if (args[i] === '--thumbs') params.thumbs = args[++i];
    if (args[i] === '--out') params.out = args[++i];
    if (args[i] === '--dry') params.dry = true;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !svcKey) {
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, svcKey, { auth: { persistSession: false } });
  await fs.mkdir('tmp/processing', { recursive: true }).catch(()=>{});
  await fs.mkdir('artifacts', { recursive: true }).catch(()=>{});

  const discovered = {}; // slug -> files[] with {role: processed|thumb, local, dest, publicUrl}

  for (const p of params.paths) {
    if (!p) continue;
    // If path is a directory, assume slug is directory name
    const exists = await fs.stat(p).catch(()=>null);
    if (exists && exists.isDirectory()) {
      const slug = path.basename(p);
      const files = await fs.readdir(p).catch(()=>[]);
      for (const f of files) {
        const src = path.join(p, f);
        const ext = path.extname(f).toLowerCase();
        if (!f.startsWith('.') && (ext.match(/\.(jpg|jpeg|png|webp|avif|mp4|mov|webm)$/i))) {
          // process individual file
          await processFile(slug, src, params, supabase, discovered);
        }
      }
      continue;
    }

    // If path is a file (zip), extract it and process contents
    const st = await fs.stat(p).catch(()=>null);
    if (!st || !st.isFile()) {
      console.warn('Path not found or not a file:', p); continue;
    }

    const zip = new AdmZip(p);
    const tmpdir = path.join('tmp/processing', path.basename(p).replace(/\.[^/.]+$/, ''));
    await fs.mkdir(tmpdir, { recursive: true });
    zip.extractAllTo(tmpdir, true);

    // try to infer slug from parent folder name
    let slug = path.basename(path.dirname(p));
    // fallback: if extracted folder has a single subfolder named like slug, use that
    const extractedFiles = await gatherFiles(tmpdir);
    for (const f of extractedFiles) {
      const ext = path.extname(f).toLowerCase();
      if (!f.toLowerCase().includes('thumb') && ext.match(/\.(jpg|jpeg|png|webp|avif|mp4|mov|webm)$/i)) {
        await processFile(slug, f, params, supabase, discovered);
      }
    }
  }

  await fs.writeFile(params.out, JSON.stringify({ timestamp: new Date().toISOString(), processed: discovered }, null, 2), 'utf8');
  console.log('Wrote', params.out);

  // Merge discovered into artifacts/storage-files.json for generator convenience
  await mergeIntoStorageFiles(discovered);

  // Regenerate SQL dry-run / apply
  const genCmd = `node scripts/generate-media-sql.mjs --in artifacts/storage-files.json --out sql/media-mapping-dryrun.sql --out-sql sql/media-mapping-apply.sql`;
  console.log('Regenerating SQL with:', genCmd);
  if (!params.dry) execSync(genCmd, { stdio: 'inherit' }); else execSync(genCmd, { stdio: 'inherit' });

  console.log('Processing complete. Dry run:', !!params.dry);
}

async function processFile(slug, src, params, supabase, discovered) {
  const ext = path.extname(src).toLowerCase();
  const basename = path.basename(src).replace(/\s+/g, '_');
  if (!discovered[slug]) discovered[slug] = { files: [] };
  // decide pipeline: images vs videos
  if (ext.match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
    // produce processed jpg and thumb
    const outName = `${basename.replace(/\.[^/.]+$/, '')}_processed.jpg`;
    const outPath = path.join('tmp/processing', slug + '_' + outName);
    const thumbName = `${basename.replace(/\.[^/.]+$/, '')}_thumb.jpg`;
    const thumbPath = path.join('tmp/processing', slug + '_' + thumbName);

    // ffmpeg image resize
    try {
      execSync(`ffmpeg -y -i "${src}" -vf "scale='min(1600,iw)':-2" -q:v 5 "${outPath}"`);
      execSync(`ffmpeg -y -i "${src}" -vf "scale=320:-2" -q:v 5 "${thumbPath}"`);
    } catch (e) {
      console.warn('ffmpeg image processing failed for', src, e.message || e);
      // fallback to copy
      await fs.copyFile(src, outPath).catch(()=>{});
      await fs.copyFile(src, thumbPath).catch(()=>{});
    }

    // upload processed and thumb
    const processedDest = `${slug}/${path.basename(outPath)}`;
    const thumbDest = `${slug}/${path.basename(thumbPath)}`;
    if (!params.dry) {
      const pResp = await supabase.storage.from(params.processed).upload(processedDest, await fs.readFile(outPath)).catch(e=>({ error: e }));
      if (pResp && pResp.error) console.error('Upload processed failed', pResp.error.message || pResp.error);
      const tResp = await supabase.storage.from(params.thumbs).upload(thumbDest, await fs.readFile(thumbPath)).catch(e=>({ error: e }));
      if (tResp && tResp.error) console.error('Upload thumb failed', tResp.error.message || tResp.error);
    }

    const pUrl = (await supabase.storage.from(params.processed).getPublicUrl(processedDest)).data?.publicUrl || null;
    const tUrl = (await supabase.storage.from(params.thumbs).getPublicUrl(thumbDest)).data?.publicUrl || null;

    discovered[slug].files.push({ name: path.basename(outPath), path: processedDest, publicUrl: pUrl });
    discovered[slug].files.push({ name: path.basename(thumbPath), path: thumbDest, publicUrl: tUrl });
  } else if (ext.match(/\.(mp4|mov|webm)$/i)) {
    const outName = `${basename.replace(/\.[^/.]+$/, '')}_processed.mp4`;
    const outPath = path.join('tmp/processing', slug + '_' + outName);
    const thumbName = `${basename.replace(/\.[^/.]+$/, '')}_thumb.jpg`;
    const thumbPath = path.join('tmp/processing', slug + '_' + thumbName);

    try {
      execSync(`ffmpeg -y -i "${src}" -c:v libx264 -preset medium -crf 28 -vf "scale='min(1280,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${outPath}"`, { stdio: 'inherit' });
      execSync(`ffmpeg -y -ss 00:00:02 -i "${src}" -vframes 1 -vf "scale=320:-2" -q:v 2 "${thumbPath}"`);
    } catch (e) {
      console.warn('ffmpeg video processing failed for', src, e.message || e);
      await fs.copyFile(src, outPath).catch(()=>{});
    }

    const processedDest = `${slug}/${path.basename(outPath)}`;
    const thumbDest = `${slug}/${path.basename(thumbPath)}`;
    if (!params.dry) {
      const pResp = await supabase.storage.from(params.processed).upload(processedDest, await fs.readFile(outPath)).catch(e=>({ error: e }));
      if (pResp && pResp.error) console.error('Upload processed failed', pResp.error.message || pResp.error);
      const tResp = await supabase.storage.from(params.thumbs).upload(thumbDest, await fs.readFile(thumbPath)).catch(e=>({ error: e }));
      if (tResp && tResp.error) console.error('Upload thumb failed', tResp.error.message || tResp.error);
    }

    const pUrl = (await supabase.storage.from(params.processed).getPublicUrl(processedDest)).data?.publicUrl || null;
    const tUrl = (await supabase.storage.from(params.thumbs).getPublicUrl(thumbDest)).data?.publicUrl || null;

    discovered[slug].files.push({ name: path.basename(outPath), path: processedDest, publicUrl: pUrl });
    discovered[slug].files.push({ name: path.basename(thumbPath), path: thumbDest, publicUrl: tUrl });
  } else {
    console.log('Skipping unknown file type', src);
  }
}

async function gatherFiles(root) {
  const out = [];
  async function walk(d) {
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else out.push(full);
    }
  }
  await walk(root);
  return out;
}

async function mergeIntoStorageFiles(discovered) {
  const sf = 'artifacts/storage-files.json';
  let cur = { timestamp: new Date().toISOString(), by_slug: {} };
  try { cur = JSON.parse(await fs.readFile(sf, 'utf8')); } catch (e) {}
  for (const [slug, data] of Object.entries(discovered)) {
    if (!cur.by_slug[slug]) cur.by_slug[slug] = { files: [] };
    const existing = cur.by_slug[slug].files || [];
    const urls = new Set(existing.map(f=>f.publicUrl));
    for (const f of data.files) {
      if (!f.publicUrl) continue;
      if (!urls.has(f.publicUrl)) existing.push({ name: f.name, path: f.path, publicUrl: f.publicUrl });
    }
    cur.by_slug[slug].files = existing;
  }
  cur.timestamp = new Date().toISOString();
  await fs.writeFile(sf, JSON.stringify(cur, null, 2), 'utf8');
  console.log('Merged into', sf);
}

main().catch(e => { console.error(e); process.exit(1); });