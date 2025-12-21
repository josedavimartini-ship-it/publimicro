#!/usr/bin/env node
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import process from 'process';
import { createClient } from '@supabase/supabase-js';
import AdmZip from 'adm-zip';
import { spawnSync } from 'child_process';

// Usage examples:
// SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... node scripts/extract-and-upload.mjs --slug seriema --photos ./uploads/seriema/photos --bucket imagens-sitios
// Or process all known uploads under ./uploads

async function uploadFile(supabase, bucket, slug, srcPath, destSubPath) {
  const fileName = path.basename(srcPath);
  const dest = `${slug}/${destSubPath ? destSubPath + '/' : ''}${fileName}`.replace(/\\/g, '/');
  const stream = fs.createReadStream(srcPath);
  const ext = path.extname(fileName).toLowerCase();
  let contentType = 'application/octet-stream';
  if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (ext === '.avif') contentType = 'image/avif';
  else if (ext === '.mp4') contentType = 'video/mp4';

  const { error } = await supabase.storage.from(bucket).upload(dest, stream, { upsert: true, contentType });
  if (error) throw new Error(`Upload error for ${srcPath}: ${error.message || String(error)}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(dest);
  return { file: fileName, publicUrl: data?.publicUrl || null, dest };
}

async function ensureDir(d) { await fsp.mkdir(d, { recursive: true }).catch(()=>{}); }

async function main() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i=0;i<args.length;i++){
    if (args[i]==='--slug') params.slug = args[++i];
    if (args[i]==='--dir') params.dir = args[++i];
    if (args[i]==='--bucket') params.bucket = args[++i];
    if (args[i]==='--out') params.out = args[++i];
    if (args[i]==='--all') params.all = true;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !svcKey) {
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const bucket = params.bucket || 'imagens-sitios';
  const outPath = params.out || 'artifacts/extract-upload.json';

  const supabase = createClient(supabaseUrl, svcKey, { auth: { persistSession: false } });

  // if --all, scan uploads/* and find slugs
  const uploadsRoot = params.dir || 'uploads';

  const slugs = [];
  if (params.all) {
    const list = await fsp.readdir(uploadsRoot).catch(()=>[]);
    for (const item of list) {
      const full = path.join(uploadsRoot, item);
      const st = await fsp.stat(full).catch(()=>null);
      if (st && st.isDirectory()) slugs.push(item);
    }
  } else if (params.slug) {
    slugs.push(params.slug);
  } else {
    console.error('Specify --slug or --all');
    process.exit(1);
  }

  const results = [];
  for (const slug of slugs) {
    const slugResult = { slug, uploaded: [] };
    // photos dir
    const photosDir = path.join(uploadsRoot, slug, 'photos');
    const photosZip = path.join(uploadsRoot, slug, `${slug}photos.zip`);
    const photosZipAlt = path.join(uploadsRoot, slug, `${slug}photos`, `${slug}photos.zip`);
    const videosDir = path.join(uploadsRoot, slug, 'videos');
    const videosZip = path.join(uploadsRoot, slug, `${slug}videos.zip`);
    const videosZipAlt = path.join(uploadsRoot, slug, `${slug}videos`, `${slug}videos.zip`);

    // helper: extract zip to tmp dir
    async function extractZip(zipPath, targetDir) {
      await ensureDir(targetDir);
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(targetDir, true);
      return targetDir;
    }

    // process photos: if photos dir exists use it; else if zip exists extract
    let photosToUpload = [];
    if (fs.existsSync(photosDir)) {
      const files = await fsp.readdir(photosDir).catch(()=>[]);
      photosToUpload = files.map(f=>path.join(photosDir,f)).filter(p=>fs.statSync(p).isFile());
    } else if (fs.existsSync(photosZip)) {
      const tmp = path.join('tmp', `extract-${slug}-photos`);
      await extractZip(photosZip, tmp);
      const files = await fsp.readdir(tmp).catch(()=>[]);
      photosToUpload = files.map(f=>path.join(tmp,f)).filter(p=>fs.statSync(p).isFile());
    } else if (fs.existsSync(photosZipAlt)) {
      const tmp = path.join('tmp', `extract-${slug}-photos`);
      await extractZip(photosZipAlt, tmp);
      const files = await fsp.readdir(tmp).catch(()=>[]);
      photosToUpload = files.map(f=>path.join(tmp,f)).filter(p=>fs.statSync(p).isFile());
    }

    // process videos similarly
    let videosToUpload = [];
    if (fs.existsSync(videosDir)) {
      const files = await fsp.readdir(videosDir).catch(()=>[]);
      videosToUpload = files.map(f=>path.join(videosDir,f)).filter(p=>fs.statSync(p).isFile());
    } else if (fs.existsSync(videosZip)) {
      const tmp = path.join('tmp', `extract-${slug}-videos`);
      await extractZip(videosZip, tmp);
      const files = await fsp.readdir(tmp).catch(()=>[]);
      videosToUpload = files.map(f=>path.join(tmp,f)).filter(p=>fs.statSync(p).isFile());
    } else if (fs.existsSync(videosZipAlt)) {
      const tmp = path.join('tmp', `extract-${slug}-videos`);
      await extractZip(videosZipAlt, tmp);
      const files = await fsp.readdir(tmp).catch(()=>[]);
      videosToUpload = files.map(f=>path.join(tmp,f)).filter(p=>fs.statSync(p).isFile());
    }

    // Upload photos
    for (const p of photosToUpload) {
      try {
        const r = await uploadFile(supabase, bucket, slug, p, '');
        slugResult.uploaded.push(r);
      } catch (e) {
        slugResult.uploaded.push({ file: path.basename(p), ok: false, error: String(e.message||e) });
      }
    }

    // Check ffmpeg availability
    const ff = spawnSync('ffmpeg', ['-version']);
    const haveFfmpeg = !(ff.error || ff.status !== 0);

    for (const v of videosToUpload) {
      const base = path.basename(v, path.extname(v));
      let toUploadPath = v;
      let uploadedName = path.basename(v);
      if (haveFfmpeg) {
        // compress to mp4 - _compressed.mp4
        await ensureDir(path.join('tmp','compressed'));
        const outCompressed = path.join('tmp','compressed', `${base}_compressed.mp4`);
        // simple ffmpeg command
        const result = spawnSync('ffmpeg', ['-y','-i', v, '-c:v','libx264','-crf','28','-preset','veryfast','-c:a','aac','-b:a','128k', outCompressed], { stdio: 'inherit' });
        if (result.error || result.status !== 0) {
          // fallback to raw
          toUploadPath = v;
          uploadedName = path.basename(v);
        } else {
          toUploadPath = outCompressed;
          uploadedName = path.basename(outCompressed);
        }
      }
      try {
        const r = await uploadFile(supabase, bucket, slug, toUploadPath, 'videos');
        slugResult.uploaded.push(r);
      } catch (e) {
        slugResult.uploaded.push({ file: path.basename(toUploadPath), ok: false, error: String(e.message||e) });
      }
    }

    results.push(slugResult);
  }

  await ensureDir('artifacts');
  await fsp.writeFile(outPath, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2), 'utf8');
  console.log('Wrote', outPath);
}

main().catch(e=>{ console.error(e); process.exit(1); });
