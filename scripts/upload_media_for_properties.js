#!/usr/bin/env node
// Upload media for canonical sitios (Juriti and Mergulhão)
// Usage:
// 1) set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment
// 2) place files in ./uploads/juriti and ./uploads/mergulhao (11 images + 1 video each)
// 3) node scripts/upload_media_for_properties.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const logger = require('./logger.cjs');
let AdmZip = null;
try {
  AdmZip = require('adm-zip');
} catch {
  // adm-zip is optional but recommended for ZIP extraction support.
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  logger.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const bucket = 'imagens-sitios';
const MAX_FILE_SIZE_BYTES = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES || String(50 * 1024 * 1024), 10); // default 50 MB

async function detectTargetTable() {
  try {
    const { error } = await supabase.from('properties').select('id').limit(1);
    if (error) return 'sitios';
    return 'properties';
  } catch {
    return 'sitios';
  }
}

function listLocalFiles(dir) {
  try {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile());
  } catch {
    return [];
  }
}

async function maybeExtractZip(dir) {
  // If there's a zip file in `dir` and adm-zip is available, extract it to a temp folder and return that path.
  if (!AdmZip) return null;
  try {
    const files = fs.readdirSync(dir);
    const zipFile = files.find((f) => path.extname(f).toLowerCase() === '.zip');
    if (!zipFile) return null;
    const zipPath = path.join(dir, zipFile);
    const dest = path.join(dir, '_extracted_' + Date.now());
    fs.mkdirSync(dest, { recursive: true });
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(dest, true);
    return dest;
    } catch (err) {
    logger.warn('Failed to extract zip in', dir, err && err.message ? err.message : err);
    return null;
  }
}

function isVideo(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.mp4', '.mov', '.webm', '.mkv'].includes(ext);
}

async function uploadFileBuffer(slug, filename, buffer) {
  const destPath = `${slug}/${Date.now()}-${filename}`;
  const { error } = await supabase.storage.from(bucket).upload(destPath, buffer, { upsert: true });
  if (error) throw error;
  const pub = supabase.storage.from(bucket).getPublicUrl(destPath);
  return pub && pub.data && pub.data.publicUrl ? pub.data.publicUrl : null;
}

async function run() {
  const mappingPath = path.join(__dirname, 'canonical-sitios-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    logger.error('Mapping file not found. Run the seed script first. Expected at', mappingPath);
    process.exit(1);
  }

  const parsed = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  // seed may write either a plain mapping object or { target_table, mapping }
  const mapping = parsed && parsed.mapping ? parsed.mapping : parsed;
  logger.info('Loaded mapping keys:', Object.keys(mapping).join(', '));
  const targets = ['juriti', 'mergulhao'];
  const targetTable = await detectTargetTable();
  logger.info('Detected table:', targetTable);

  for (const slug of targets) {
    const id = mapping[slug];
    if (!id) {
      logger.warn('No id found for', slug, 'in mapping - skipping');
      continue;
    }

    const localDir = path.join(process.cwd(), 'uploads', slug);
    // Priority for files: compressed/ > extracted zip > localDir
    let sourceDir = localDir;
    const compressedDir = path.join(localDir, 'compressed');
    if (fs.existsSync(compressedDir)) {
      sourceDir = compressedDir;
    } else if (fs.existsSync(localDir)) {
      const extractDir = await maybeExtractZip(localDir);
      if (extractDir) sourceDir = extractDir;
    }
    const files = listLocalFiles(sourceDir);
    if (!files || files.length === 0) {
      logger.warn('No files found in', sourceDir, ' — place 11 images + 1 video here.');
      continue;
    }

    const uploadedUrls = [];
    for (const f of files) {
      // realPath is where the file actually lives (compressed/extracted/local)
      const realPath = path.join(sourceDir, f);
      const stat = fs.statSync(realPath);
      if (stat.size > MAX_FILE_SIZE_BYTES) {
        logger.warn('Skipping', f, '— file too large (', stat.size, 'bytes ). Consider compressing or hosting externally.');
        continue;
      }
      const buffer = fs.readFileSync(realPath);
      try {
        const publicUrl = await uploadFileBuffer(slug, f, buffer);
        if (publicUrl) {
          uploadedUrls.push({ url: publicUrl, filename: f, isVideo: isVideo(f) });
          logger.info('Uploaded', f, '->', publicUrl);
        }
      } catch (err) {
        logger.error('Failed to upload', f, err.message || err);
      }
    }

    if (uploadedUrls.length === 0) continue;

    if (targetTable === 'properties') {
      // Insert into property_photos table and set video_url if present
      const imageRows = uploadedUrls.filter((u) => !u.isVideo).map((u, idx) => ({
        property_id: id,
        url: u.url,
        is_cover: idx === 0,
        display_order: idx
      }));

      if (imageRows.length > 0) {
        const { error: photoErr } = await supabase.from('property_photos').insert(imageRows);
        if (photoErr) logger.error('Failed to insert photos for', slug, photoErr.message || photoErr);
          else logger.info('Inserted', imageRows.length, 'photos for', slug);
      }

      const video = uploadedUrls.find((u) => u.isVideo);
      if (video) {
        const { error: updErr } = await supabase.from('properties').update({ video_url: video.url }).eq('id', id);
        if (updErr) logger.error('Failed to set video_url for', slug, updErr.message || updErr);
        else logger.info('Set video_url for', slug);
      }
    } else {
      // Update sitios.fotos array and video_url
      const urls = uploadedUrls.map((u) => u.url);
      // Fetch existing fotos
      const { data: existing } = await supabase.from('sitios').select('fotos,video_url').eq('id', id).limit(1);
      const existingFotos = (existing && existing[0] && existing[0].fotos) || [];
      const merged = Array.from(new Set([...existingFotos, ...urls]));
      const updatePayload = { fotos: merged };
      const video = uploadedUrls.find((u) => u.isVideo);
      if (video) updatePayload.video_url = video.url;

      const { error: updErr } = await supabase.from('sitios').update(updatePayload).eq('id', id);
      if (updErr) logger.error('Failed to update sitios media for', slug, updErr.message || updErr);
      else logger.info('Updated sitios media for', slug);
    }
  }
  logger.info('Upload run completed.');
}

run().catch((err) => {
  logger.error('Uploader failed', err);
  process.exit(1);
});
