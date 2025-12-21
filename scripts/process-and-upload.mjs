#!/usr/bin/env node
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';
import AdmZip from 'adm-zip';
import { createClient } from '@supabase/supabase-js';

// Usage:
// NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/process-and-upload.mjs --dry-run
// To automatically APPLY generated SQL (requires SUPABASE_DB_URL):
// SUPABASE_DB_URL='postgresql://user:pass@host:5432/postgres' NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/process-and-upload.mjs --apply-sql
// Looks for uploads/* and processes zips and photo folders automatically.

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed with status ${res.status}`);
  return res;
}

function execCapture(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  if (res.error) throw res.error;
  return { status: res.status, stdout: res.stdout, stderr: res.stderr };
}

async function ensureDir(d) { await fsp.mkdir(d, { recursive: true }); }

async function processPhoto(inPath, outPath, ffmpegAvailable = true) {
  // Resize max width 1600 and set jpeg quality
  await ensureDir(path.dirname(outPath));
  if (!ffmpegAvailable) {
    // fallback: copy the file (no compression available)
    await fsp.copyFile(inPath, outPath);
    console.warn('ffmpeg not available: copied photo without compression:', inPath);
    return;
  }
  // Use ffmpeg -y -i inPath -vf "scale='min(iw,1600)':'-2'" -q:v 5 outPath
  run('ffmpeg', ['-y','-i', inPath, '-vf', "scale='min(iw,1600)':'-2'", '-q:v','5', outPath]);
}

async function processVideo(inPath, outPath, ffmpegAvailable = true) {
  await ensureDir(path.dirname(outPath));
  if (!ffmpegAvailable) {
    console.warn('ffmpeg not available: skipping video processing for', inPath);
    return;
  }
  // ffmpeg compress
  run('ffmpeg', ['-y','-i', inPath, '-c:v','libx264','-preset','medium','-crf','28','-vf',"scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease",'-c:a','aac','-b:a','128k','-movflags','+faststart', outPath]);
}

async function generateThumbFromVideo(inPath, outPath, ffmpegAvailable = true) {
  await ensureDir(path.dirname(outPath));
  if (!ffmpegAvailable) {
    console.warn('ffmpeg not available: skipping thumbnail generation for', inPath);
    return;
  }
  run('ffmpeg', ['-y','-ss','00:00:02','-i', inPath, '-vframes','1','-vf','scale=320:-2', outPath]);
}

async function extractZip(zipPath, dest) {
  await ensureDir(dest);
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(dest, true);
}

async function uploadFile(supabase, bucket, localPath, destPath) {
  // Check if file already exists to avoid re-uploading
  try {
    const folder = path.dirname(destPath).replace(/\\\\/g, '/').replace(/^\//, '');
    const fileName = path.basename(destPath);
    const { data: list, error: listErr } = await supabase.storage.from(bucket).list(folder, { limit: 2000 });
    if (!listErr && list && list.find(it => it.name === fileName)) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(destPath);
      console.log('Skipping upload; file already exists:', destPath);
      return data ? data.publicUrl : `https://(existing)/${destPath}`;
    }
  } catch (e) {
    // ignore and proceed to upload
  }

  const body = fs.createReadStream(localPath);
  const { error } = await supabase.storage.from(bucket).upload(destPath, body, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(destPath);
  return data ? data.publicUrl : null;
}

async function main() {
  const args = process.argv.slice(2);
  const params = { dryRun: false };
  for (let i=0;i<args.length;i++){
    if (args[i]==='--dry-run') params.dryRun = true;
    if (args[i]==='--out') params.out = args[++i];
    if (args[i]==='--slugs') params.slugs = (args[++i] || '').split(',').map(s=>s.trim()).filter(Boolean);
    if (args[i]==='--apply-sql') params.applySql = true;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !svcKey) {
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, svcKey, { auth: { persistSession: false } });

  // Check ffmpeg availability early to allow graceful fallback
  let ffmpegAvailable = false;
  try {
    const ffmpegCheck = execCapture('ffmpeg', ['-version']);
    ffmpegAvailable = ffmpegCheck && ffmpegCheck.status === 0;
  } catch (e) {
    ffmpegAvailable = false;
  }
  if (!ffmpegAvailable) console.warn('ffmpeg not found in PATH — videos will be skipped and photos will be copied without compression. Install ffmpeg and re-run for full processing.');

  // Check 7z availability to support rar/.7z extraction
  let sevenZipAvailable = false;
  try {
    const zcheck = execCapture('7z', ['--help']);
    sevenZipAvailable = zcheck && zcheck.status === 0;
  } catch (e) {
    sevenZipAvailable = false;
  }
  if (!sevenZipAvailable) console.warn('7z not found in PATH — .rar/.7z extraction will be skipped. Install 7-Zip (7z) for archive extraction.');

  const uploadsDir = path.resolve('uploads');
  const tmpDir = path.resolve('tmp','processing');
  await ensureDir(tmpDir);
  const results = [];

  // scan uploads dir
  if (!fs.existsSync(uploadsDir)) {
    console.error('No uploads directory found at', uploadsDir);
    process.exit(1);
  }

  let slugs = await fsp.readdir(uploadsDir);
  // If --slugs provided, filter to only those
  if (params.slugs && params.slugs.length) slugs = slugs.filter(s => params.slugs.includes(s));
  for (const slug of slugs) {
    const slugDir = path.join(uploadsDir, slug);
    if (!fs.statSync(slugDir).isDirectory()) continue;
    const entries = await fsp.readdir(slugDir);
    console.log('Processing slug', slug, 'with', entries.length, 'entries');
    const processed = [];
    const thumbBucket = 'imagens-sitios-thumbs';
    const procBucket = 'imagens-sitios-processed';

    for (const e of entries) {
      const full = path.join(slugDir, e);
      const stat = await fsp.stat(full);
      if (stat.isDirectory()) {
        // process photos folder if exists
        const files = await fsp.readdir(full);
        for (const f of files) {
          const src = path.join(full, f);
          const ext = path.extname(f).toLowerCase();
          if (!['.jpg','.jpeg','.png','.webp','.avif'].includes(ext)) continue;
          const outName = `${path.basename(f, ext)}_compressed.jpg`;
          const outTmp = path.join(tmpDir, slug, outName);
          await processPhoto(src, outTmp, ffmpegAvailable);
          if (!params.dryRun) {
            const dest = `${slug}/${outName}`;
            const url = await uploadFile(supabase, procBucket, outTmp, dest);
            const thumbName = `${path.basename(f, ext)}_thumb.jpg`;
            const thumbTmp = path.join(tmpDir, slug, thumbName);
            if (ffmpegAvailable) run('ffmpeg', ['-y','-i', outTmp, '-vf','scale=320:-2', thumbTmp]);
            else await fsp.copyFile(outTmp, thumbTmp);
            const thumbDest = `${slug}/${thumbName}`;
            const thumbUrl = await uploadFile(supabase, thumbBucket, thumbTmp, thumbDest);
            processed.push({ type: 'photo', original: src, processedUrl: url, thumbUrl });
          } else {
            processed.push({ type: 'photo', original: src, processedUrl: `dryrun://${slug}/${outName}`, thumbUrl: `dryrun://${slug}/${path.basename(f, ext)}_thumb.jpg` });
          }
        }
      } else if (stat.isFile()) {
        const ext = path.extname(e).toLowerCase();
        if (ext === '.zip') {
          // extract
          const extractDest = path.join(tmpDir,'extracted',slug, path.basename(e,ext));
          console.log('Extracting', full, 'to', extractDest);
          await extractZip(full, extractDest);
          // find media files inside
          const files = await (async function listFiles(dir){
            let out = [];
            for (const it of await fsp.readdir(dir)){
              const p = path.join(dir,it);
              const s = await fsp.stat(p);
              if (s.isDirectory()) out = out.concat(await listFiles(p));
              else out.push(p);
            }
            return out;
          })(extractDest);
          console.log('Found', files.length, 'extracted items for', e);
          for (const f of files) {
            const ext2 = path.extname(f).toLowerCase();
            if (['.jpg','.jpeg','.png','.webp','.avif'].includes(ext2)) {
              const outName = `${path.basename(f,ext2)}_compressed.jpg`;
              const outTmp = path.join(tmpDir, slug, outName);
              await processPhoto(f, outTmp, ffmpegAvailable);
              if (!params.dryRun) {
                const dest = `${slug}/${outName}`;
                const url = await uploadFile(supabase, procBucket, outTmp, dest);
                const thumbName = `${path.basename(f,ext2)}_thumb.jpg`;
                const thumbTmp = path.join(tmpDir, slug, thumbName);
                if (ffmpegAvailable) run('ffmpeg', ['-y','-i', outTmp, '-vf','scale=320:-2', thumbTmp]);
                else await fsp.copyFile(outTmp, thumbTmp);
                const thumbUrl = await uploadFile(supabase, thumbBucket, thumbTmp, `${slug}/${thumbName}`);
                processed.push({ type: 'photo', original: f, processedUrl: url, thumbUrl });
              } else {
                processed.push({ type: 'photo', original: f, processedUrl: `dryrun://${slug}/${outName}`, thumbUrl: `dryrun://${slug}/${path.basename(f,ext2)}_thumb.jpg` });
              }
            } else if (['.mp4','.mov','.webm'].includes(ext2)) {
              const outName = `${path.basename(f,ext2)}_compressed.mp4`;
              const outTmp = path.join(tmpDir, slug, outName);
              await processVideo(f, outTmp, ffmpegAvailable);
              const thumbTmp = path.join(tmpDir, slug, `${path.basename(f,ext2)}_thumb.jpg`);
              await generateThumbFromVideo(outTmp, thumbTmp, ffmpegAvailable);
              if (!params.dryRun) {
                if (!ffmpegAvailable) {
                  console.warn('Skipping upload for video because ffmpeg is not available:', f);
                } else {
                  const dest = `${slug}/${outName}`;
                  const url = await uploadFile(supabase, procBucket, outTmp, dest);
                  const thumbUrl = await uploadFile(supabase, thumbBucket, thumbTmp, `${slug}/${path.basename(thumbTmp)}`);
                  processed.push({ type: 'video', original: f, processedUrl: url, thumbUrl });
                }
              } else {
                processed.push({ type: 'video', original: f, processedUrl: `dryrun://${slug}/${outName}`, thumbUrl: `dryrun://${slug}/${path.basename(thumbTmp)}` });
              }
            }
          }
        } else if (['.jpg','.jpeg','.png','.webp','.avif'].includes(ext)) {
          // photo at root
          const outName = `${path.basename(e,ext)}_compressed.jpg`;
          const outTmp = path.join(tmpDir, slug, outName);
          await processPhoto(full, outTmp, ffmpegAvailable);
          if (!params.dryRun) {
            const url = await uploadFile(supabase, procBucket, outTmp, `${slug}/${outName}`);
            const thumbTmp = path.join(tmpDir, slug, `${path.basename(e,ext)}_thumb.jpg`);
            if (ffmpegAvailable) run('ffmpeg', ['-y','-i', outTmp, '-vf','scale=320:-2', thumbTmp]);
            else await fsp.copyFile(outTmp, thumbTmp);
            const thumbUrl = await uploadFile(supabase, thumbTmp ? thumbBucket : procBucket, thumbTmp, `${slug}/${path.basename(thumbTmp)}`);
            processed.push({ type: 'photo', original: full, processedUrl: url, thumbUrl });
          } else {
            processed.push({ type: 'photo', original: full, processedUrl: `dryrun://${slug}/${outName}`, thumbUrl: `dryrun://${slug}/${path.basename(e,ext)}_thumb.jpg` });
          }
        } else if (['.mp4','.mov','.webm'].includes(ext)) {
          const outName = `${path.basename(e,ext)}_compressed.mp4`;
          const outTmp = path.join(tmpDir, slug, outName);
          await processVideo(full, outTmp, ffmpegAvailable);
          const thumbTmp = path.join(tmpDir, slug, `${path.basename(e,ext)}_thumb.jpg`);
          await generateThumbFromVideo(outTmp, thumbTmp, ffmpegAvailable);
          if (!params.dryRun) {
            if (!ffmpegAvailable) {
              console.warn('Skipping upload for video because ffmpeg is not available:', full);
            } else {
              const url = await uploadFile(supabase, procBucket, outTmp, `${slug}/${outName}`);
              const thumbUrl = await uploadFile(supabase, thumbTmp ? thumbBucket : procBucket, thumbTmp, `${slug}/${path.basename(thumbTmp)}`);
              processed.push({ type: 'video', original: full, processedUrl: url, thumbUrl });
            }
          } else {
            processed.push({ type: 'video', original: full, processedUrl: `dryrun://${slug}/${outName}`, thumbUrl: `dryrun://${slug}/${path.basename(thumbTmp)}` });
          }
        }
      }
    }

    results.push({ slug, processed });
  }

  // write artifacts
  await ensureDir('artifacts');
  const outArtifact = params.out || 'artifacts/processed-uploads.json';
  await fsp.writeFile(outArtifact, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2), 'utf8');
  console.log('Wrote', outArtifact);

  // Merge processed URLs into artifacts/storage-files.json to be used by generate-media-sql
  const storageFilePath = 'artifacts/storage-files.json';
  let storage = { timestamp: new Date().toISOString(), by_slug: {} };
  if (fs.existsSync(storageFilePath)) storage = JSON.parse(await fsp.readFile(storageFilePath, 'utf8'));
  for (const r of results) {
    if (!storage.by_slug[r.slug]) storage.by_slug[r.slug] = { files: [] };
    for (const p of r.processed) {
      if (p.processedUrl && !storage.by_slug[r.slug].files.find(f => f.publicUrl === p.processedUrl)) {
        storage.by_slug[r.slug].files.push({ name: path.basename(p.processedUrl), path: path.basename(p.processedUrl), publicUrl: p.processedUrl });
      }
      if (p.thumbUrl && !storage.by_slug[r.slug].files.find(f => f.publicUrl === p.thumbUrl)) {
        storage.by_slug[r.slug].files.push({ name: path.basename(p.thumbUrl), path: path.basename(p.thumbUrl), publicUrl: p.thumbUrl });
      }
    }
  }
  await fsp.writeFile(storageFilePath, JSON.stringify(storage, null, 2), 'utf8');
  console.log('Updated', storageFilePath);

  // regenerate SQL dry-run and apply outputs
  try {
    run('node', ['scripts/generate-media-sql.mjs', '--in', storageFilePath, '--out', 'sql/media-mapping-apply.sql', '--out-dry', 'sql/media-mapping-dryrun.sql']);
    console.log('Regenerated SQL files');

    // Optionally apply SQL automatically if requested
    if (params.applySql) {
      if (!process.env.SUPABASE_DB_URL) {
        console.error('SUPABASE_DB_URL not set. Cannot apply SQL automatically. Set SUPABASE_DB_URL to a Postgres connection string (service role recommended)');
        process.exit(2);
      }
      console.log('Applying SQL automatically now using scripts/apply-media-mapping-local.mjs --file sql/media-mapping-apply.sql --apply');
      try {
        run('node', ['scripts/apply-media-mapping-local.mjs', '--file', 'sql/media-mapping-apply.sql', '--apply'], { env: process.env });
        console.log('SQL applied successfully.');
      } catch (applyErr) {
        console.error('Automatic SQL apply failed:', applyErr.message || applyErr);
        process.exit(3);
      }
    }

  } catch (e) {
    console.error('Failed to regenerate SQL:', e.message || e);
  }

  console.log('\nDone. Artifacts written. This was a dry-run:', params.dryRun);
}

main().catch(e => { console.error(e); process.exit(1); });
