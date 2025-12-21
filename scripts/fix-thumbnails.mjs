#!/usr/bin/env node
import fs from 'fs/promises';
import process from 'process';
import path from 'path';
import { Client } from 'pg';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import child_process from 'child_process';

// Usage:
// DRY RUN: node scripts/fix-thumbnails.mjs --dry
// APPLY:   node scripts/fix-thumbnails.mjs --apply
// Requires: SUPABASE_DB_URL (for DB), NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (for uploading generated thumbs)

async function existsUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function runFfmpegCapture(inputUrl, outPath) {
  // Ensure parent dir exists
  await fs.mkdir(path.dirname(outPath), { recursive: true }).catch(()=>{});

  // Do not attempt to process dryrun:// URLs
  if (inputUrl.startsWith('dryrun://')) throw new Error('Cannot fetch dryrun:// URL: ' + inputUrl);

  // If remote URL, download to a temp file first to avoid ffmpeg HTTP issues
  let localInput = inputUrl;
  const isRemote = /^https?:\/\//i.test(inputUrl);
  let tmpDownloaded;
  if (isRemote) {
    const tmpDir = path.join('tmp', 'downloads', path.basename(path.dirname(outPath)));
    await fs.mkdir(tmpDir, { recursive: true }).catch(()=>{});
    tmpDownloaded = path.join(tmpDir, path.basename(inputUrl).replace(/[^a-zA-Z0-9_.-]/g, '_'));
    const res = await fetch(inputUrl);
    if (!res.ok) throw new Error('Failed to download ' + inputUrl + ' status=' + res.status);
    const buf = await res.arrayBuffer();
    await fs.writeFile(tmpDownloaded, Buffer.from(buf));
    localInput = tmpDownloaded;
  }

  // Choose ffmpeg args depending on whether input is an image or a video
  const isImageInput = /\.(jpe?g|png|webp|avif)$/i.test(localInput);

  return new Promise((resolve, reject) => {
    const args = isImageInput
      ? ['-y', '-i', localInput, '-vf', 'scale=640:-1', '-frames:v', '1', outPath]
      : ['-y', '-i', localInput, '-ss', '00:00:01', '-frames:v', '1', outPath];

    const p = child_process.spawn('ffmpeg', args);
    let stderr = '';
    p.stderr.on('data', (d) => { stderr += d.toString(); });
    p.on('close', async (code) => {
      if (tmpDownloaded) {
        try { await fs.unlink(tmpDownloaded); } catch (e) {}
      }
      if (code !== 0) {
        const err = new Error('ffmpeg exit ' + code + '\n' + stderr.slice(-1000));
        return reject(err);
      }
      // verify output file exists
      try {
        await fs.stat(outPath);
        return resolve();
      } catch (e) {
        const err = new Error('ffmpeg completed but output missing: ' + outPath + '\n' + stderr.slice(-1000));
        return reject(err);
      }
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const doApply = args.includes('--apply');
  const dry = !doApply;

  const dbConn = process.env.SUPABASE_DB_URL;
  if (!dbConn) {
    console.error('SUPABASE_DB_URL not set. Exiting.');
    process.exit(2);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const canUpload = Boolean(supabaseUrl && svcKey);

  const client = new Client({ connectionString: dbConn });
  await client.connect();

  try {
    // find sitio media rows with missing thumbnail_url
    const q = `SELECT m.id, m.url, s.slug FROM media m JOIN sitios s ON s.id = m.resource_id AND m.resource_type='sitio' WHERE m.thumbnail_url IS NULL`;
    const res = await client.query(q);
    console.log(`Found ${res.rows.length} media rows with NULL thumbnail_url`);
    const actions = [];

    for (const row of res.rows) {
      const { id, url, slug } = row;
      // derive base name
      const basename = path.basename(url).replace(/[^a-zA-Z0-9_.-]/g, '_');
      const baseNoExt = basename.replace(/\.[^/.]+$/, '');
      // candidate thumb paths
      const thumbs = [
        `${supabaseUrl}/storage/v1/object/public/imagens-sitios-thumbs/${slug}/${baseNoExt}_thumb.jpg`,
        `${supabaseUrl}/storage/v1/object/public/imagens-sitios-thumbs/${slug}/${basename.replace(/_compressed/, '')}_thumb.jpg`,
        `${supabaseUrl}/storage/v1/object/public/imagens-sitios-thumbs/${slug}/${baseNoExt}.jpg`,
      ].filter(Boolean);

      let foundThumb = null;
      for (const t of thumbs) {
        if (await existsUrl(t)) { foundThumb = t; break; }
      }

      if (foundThumb) {
        actions.push({ id, url, slug, action: 'SET_THUMB', thumb: foundThumb });
        continue;
      }

      // If thumb not found and URL is a video, try to generate a thumb
      if (/\.mp4$|\.mov$|\.webm$/i.test(url)) {
        if (!canUpload) {
          actions.push({ id, url, slug, action: 'MISSING_THUMB_VIDEO', reason: 'No upload creds' });
          continue;
        }

        // create tmp dir
        const tmpDir = `tmp/thumbnails/${slug}`;
        await fs.mkdir(tmpDir, { recursive: true }).catch(()=>{});
        const outFile = `${tmpDir}/${baseNoExt}_thumb.jpg`;
        try {
          console.log('Generating thumbnail for', url);
          await runFfmpegCapture(url, outFile);
          // upload to supabase
          const supa = createClient(supabaseUrl, svcKey, { auth: { persistSession: false } });
          const dest = `${slug}/${baseNoExt}_thumb.jpg`;
          const data = await fs.readFile(outFile);
          const { error } = await supa.storage.from('imagens-sitios-thumbs').upload(dest, data, { upsert: true, contentType: 'image/jpeg' });
          if (error) throw error;
          const pub = supa.storage.from('imagens-sitios-thumbs').getPublicUrl(dest).data.publicUrl;
          actions.push({ id, url, slug, action: 'GENERATED_UPLOADED', thumb: pub });
        } catch (e) {
          actions.push({ id, url, slug, action: 'GEN_FAILED', reason: String(e.message||e) });
        }
      } else {
        // try to generate thumbnail for images (if URL is http and is an image)
        if (canUpload && /^https?:\/\/.+\.(jpe?g|png|webp|avif)$/i.test(url)) {
          const tmpDir = `tmp/thumbnails/${slug}`;
          await fs.mkdir(tmpDir, { recursive: true }).catch(()=>{});
          const outFile = `${tmpDir}/${baseNoExt}_thumb.jpg`;
          try {
            console.log('Generating image thumbnail for', url);
            await runFfmpegCapture(url, outFile);
            const supa = createClient(supabaseUrl, svcKey, { auth: { persistSession: false } });
            const dest = `${slug}/${baseNoExt}_thumb.jpg`;
            const data = await fs.readFile(outFile);
            const { error } = await supa.storage.from('imagens-sitios-thumbs').upload(dest, data, { upsert: true, contentType: 'image/jpeg' });
            if (error) throw error;
            const pub = supa.storage.from('imagens-sitios-thumbs').getPublicUrl(dest).data.publicUrl;
            actions.push({ id, url, slug, action: 'GENERATED_UPLOADED', thumb: pub });
            continue;
          } catch (e) {
            actions.push({ id, url, slug, action: 'GEN_FAILED', reason: String(e.message||e) });
            continue;
          }
        }
        actions.push({ id, url, slug, action: 'NO_THUMB_FOUND', reason: 'Not video and no thumb in storage' });
      }
    }

    console.log('Planned actions:', JSON.stringify(actions, null, 2));

    if (!doApply) {
      console.log('Dry run; not applying DB updates. Re-run with --apply to perform updates.');
      process.exit(0);
    }

    // Apply updates
    for (const a of actions) {
      if (a.action === 'SET_THUMB' || a.action === 'GENERATED_UPLOADED') {
        const thumb = a.thumb.replace(/'/g, "''");
        const q = `UPDATE media SET thumbnail_url = '${thumb}' WHERE id = $1`;
        await client.query(q, [a.id]);
        console.log(`Updated media id=${a.id} set thumbnail_url=${thumb}`);
      } else {
        console.log('Skipping action', a);
      }
    }

    console.log('Fix-thumbnails: done');
  } finally {
    await client.end();
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });