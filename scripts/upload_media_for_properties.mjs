#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { warn, info, error } from './logger.mjs';
let AdmZip = null;
try { AdmZip = (await import('adm-zip')).default || (await import('adm-zip')); } catch (e) { /* optional */ }

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const bucket = 'imagens-sitios';
const MAX_FILE_SIZE_BYTES = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES || String(50 * 1024 * 1024), 10);

async function detectTargetTable() {
  try {
    const { error } = await supabase.from('properties').select('id').limit(1);
    if (!error) return 'properties';
    return 'sitios';
  } catch (err) {
    return 'sitios';
  }
}

function listLocalFiles(dir) {
  try {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile());
  } catch (err) {
    return [];
  }
}

async function maybeExtractZip(dir) {
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
    warn('Failed to extract zip in', dir, err && err.message ? err.message : err);
    return null;
  }
}

function isVideo(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.mp4', '.mov', '.webm', '.mkv'].includes(ext);
}

async function uploadFileBuffer(slug, filename, buffer) {
  const destPath = `${slug}/${Date.now()}-${filename}`;
  const { data, error: err } = await supabase.storage.from(bucket).upload(destPath, buffer, { upsert: true });
  if (err) throw err;
  const pub = supabase.storage.from(bucket).getPublicUrl(destPath);
  return pub && pub.data && pub.data.publicUrl ? pub.data.publicUrl : null;
}

async function run() {
  const mappingPath = path.join(new URL('.', import.meta.url).pathname, 'canonical-sitios-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    error('Mapping file not found. Run the seed script first. Expected at', mappingPath);
    process.exit(1);
  }

  const parsed = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  const mapping = parsed && parsed.mapping ? parsed.mapping : parsed;
  info('Loaded mapping keys:', Object.keys(mapping).join(', '));
  const targets = ['juriti', 'mergulhao'];
  const targetTable = await detectTargetTable();
  info('Detected table:', targetTable);

  for (const slug of targets) {
    const id = mapping[slug];
    if (!id) { warn('No id found for', slug, 'in mapping - skipping'); continue; }

    const localDir = path.join(process.cwd(), 'uploads', slug);
    let sourceDir = localDir;
    const compressedDir = path.join(localDir, 'compressed');
    if (fs.existsSync(compressedDir)) sourceDir = compressedDir;
    else if (fs.existsSync(localDir)) {
      const extractDir = await maybeExtractZip(localDir);
      if (extractDir) sourceDir = extractDir;
    }
    const files = listLocalFiles(sourceDir);
    if (!files || files.length === 0) { warn('No files found in', sourceDir, ' — place 11 images + 1 video here.'); continue; }

    const uploadedUrls = [];
    for (const f of files) {
      const filePath = path.join(localDir, f);
      const realPath = path.join(sourceDir, f);
      const stat = fs.statSync(realPath);
      if (stat.size > MAX_FILE_SIZE_BYTES) { warn('Skipping', f, '— file too large (', stat.size, 'bytes ). Consider compressing or hosting externally.'); continue; }
      const buffer = fs.readFileSync(realPath);
      try {
        const publicUrl = await uploadFileBuffer(slug, f, buffer);
        if (publicUrl) { uploadedUrls.push({ url: publicUrl, filename: f, isVideo: isVideo(f) }); info('Uploaded', f, '->', publicUrl); }
      } catch (err) { error('Failed to upload', f, err.message || err); }
    }

    if (uploadedUrls.length === 0) continue;

    if (targetTable === 'properties') {
      const imageRows = uploadedUrls.filter((u) => !u.isVideo).map((u, idx) => ({ property_id: id, url: u.url, is_cover: idx === 0, display_order: idx }));

      if (imageRows.length > 0) {
        const { error: photoErr } = await supabase.from('property_photos').insert(imageRows);
        if (photoErr) error('Failed to insert photos for', slug, photoErr.message || photoErr);
        else info('Inserted', imageRows.length, 'photos for', slug);
      }

      const video = uploadedUrls.find((u) => u.isVideo);
      if (video) {
        const { error: updErr } = await supabase.from('properties').update({ video_url: video.url }).eq('id', id);
        if (updErr) error('Failed to set video_url for', slug, updErr.message || updErr);
        else info('Set video_url for', slug);
      }
    } else {
      const urls = uploadedUrls.map((u) => u.url);
      const { data: existing } = await supabase.from('sitios').select('fotos,video_url').eq('id', id).limit(1);
      const existingFotos = (existing && existing[0] && existing[0].fotos) || [];
      const merged = Array.from(new Set([...existingFotos, ...urls]));
      const updatePayload = { fotos: merged };
      const video = uploadedUrls.find((u) => u.isVideo);
      if (video) updatePayload.video_url = video.url;

      const { error: updErr } = await supabase.from('sitios').update(updatePayload).eq('id', id);
      if (updErr) error('Failed to update sitios media for', slug, updErr.message || updErr);
      else info('Updated sitios media for', slug);
    }
  }
  info('Upload run completed.');
}

run().catch((err) => { error('Uploader failed', err); process.exit(1); });
