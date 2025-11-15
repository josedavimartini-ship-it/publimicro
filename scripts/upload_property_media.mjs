#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { info, error } from './logger.mjs';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--url') out.url = args[++i];
    else if (a === '--property-id') out.propertyId = args[++i];
    else if (a === '--files') out.files = args[++i];
    else if (a === '--kml') out.kml = args[++i];
    else if (a === '--help') out.help = true;
  }
  return out;
}

async function main() {
  const args = parseArgs();
  if (args.help || !args.propertyId || !args.files) {
    info('Usage: ADMIN_API_KEY=... node ./scripts/upload_property_media.mjs --url http://localhost:3000 --property-id <UUID> --files "C:\\a.jpg,C:\\b.jpg" [--kml "C:\\map.kml"]');
    process.exit(1);
  }

  const urlBase = args.url || 'http://localhost:3000';
  const endpoint = new URL('/api/admin/property-media', urlBase).toString();

  const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
  if (!ADMIN_API_KEY) {
    error('Set ADMIN_API_KEY in the environment before running.');
    process.exit(2);
  }

  const filePaths = args.files.split(',').map(s => s.trim()).filter(Boolean);
  const files = [];
  for (const fp of filePaths) {
    const abs = path.resolve(fp);
    if (!fs.existsSync(abs)) {
      error('File not found:', abs);
      process.exit(3);
    }
    const stat = fs.statSync(abs);
    const sizeMB = stat.size / (1024 * 1024);
    info(`Reading ${abs} (${sizeMB.toFixed(2)} MB)`);
    const buffer = fs.readFileSync(abs);
    const base64 = buffer.toString('base64');
    files.push({ name: path.basename(abs), base64, mime: 'application/octet-stream' });
  }

  let kmlObj = null;
  if (args.kml) {
    const kpath = path.resolve(args.kml);
    if (!fs.existsSync(kpath)) {
      error('KML file not found:', kpath);
      process.exit(4);
    }
    const kb = fs.readFileSync(kpath);
    kmlObj = { name: path.basename(kpath), base64: kb.toString('base64'), mime: 'application/vnd.google-earth.kml+xml' };
  }

  const payload = { property_id: args.propertyId, files, kmlFile: kmlObj };

  info('Posting to', endpoint, 'files:', files.map(f => f.name));
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_API_KEY },
    body: JSON.stringify(payload),
  });

  const j = await res.json().catch(() => ({ error: 'invalid json response' }));
  if (!res.ok) {
    error('Upload failed:', res.status, j);
    process.exit(5);
  }
  info('Upload success:', JSON.stringify(j, null, 2));
}

main().catch(err => { error(err); process.exit(99); });
