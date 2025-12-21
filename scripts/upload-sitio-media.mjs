#!/usr/bin/env node
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import process from 'process';
import { createClient } from '@supabase/supabase-js';

// Usage:
// SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... node scripts/upload-sitio-media.mjs --slug seriema --dir ./uploads/seriema --bucket imagens-sitios --out artifacts/upload-seriema.json

async function main() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug') params.slug = args[++i];
    if (args[i] === '--dir') params.dir = args[++i];
    if (args[i] === '--bucket') params.bucket = args[++i];
    if (args[i] === '--out') params.out = args[++i];
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !svcKey) {
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const slug = params.slug;
  const dir = params.dir || `uploads/${slug}`;
  const bucket = params.bucket || 'imagens-sitios';
  const outPath = params.out || `artifacts/upload-${slug || 'unknown'}.json`;

  if (!slug) {
    console.error('Missing --slug argument');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, svcKey, { auth: { persistSession: false } });

  try {
    await fsp.mkdir('artifacts', { recursive: true });
  } catch (e) {}

  const files = (await fsp.readdir(dir)).filter(f => !f.startsWith('.'));
  if (!files.length) {
    console.error('No files found in', dir);
    process.exit(1);
  }

  const uploaded = [];
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = await fsp.stat(full);
    if (!stat.isFile()) continue;

    const dest = `${slug}/${file}`;
    // simple mime type mapping
    const ext = path.extname(file).toLowerCase();
    let contentType = 'application/octet-stream';
    if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.avif') contentType = 'image/avif';
    else if (ext === '.mp4') contentType = 'video/mp4';

    // upload
    const body = fs.createReadStream(full);
    try {
      const { error } = await supabase.storage.from(bucket).upload(dest, body, { upsert: false, contentType });
      if (error) {
        console.error('Upload failed for', file, error.message || error);
        uploaded.push({ file, ok: false, error: String(error.message || error) });
        continue;
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(dest);
      uploaded.push({ file, ok: true, publicUrl: data ? data.publicUrl : null });
      console.log('Uploaded', file, '->', data ? data.publicUrl : dest);
    } catch (e) {
      console.error('Upload exception', file, e.message || e);
      uploaded.push({ file, ok: false, error: String(e.message || e) });
    }
  }

  await fsp.writeFile(outPath, JSON.stringify({ slug, bucket, uploaded, timestamp: new Date().toISOString() }, null, 2), 'utf8');
  console.log('Wrote', outPath);
  const failed = uploaded.filter(u => !u.ok);
  if (failed.length) process.exit(2);
}

main().catch(e => { console.error(e); process.exit(1); });
