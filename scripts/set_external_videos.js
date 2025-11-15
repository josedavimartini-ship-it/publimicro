"use strict";

// Set external video URLs for canonical properties using a small JSON file.
// Usage:
// 1) Create `scripts/external-videos.json` with `{ "juriti": "https://...", "mergulhao": "https://..." }`
// 2) Set env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// 3) node .\scripts\set_external_videos.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger.cjs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  logger.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

function readJson(p) {
  if (!fs.existsSync(p)) {
    throw new Error('File not found: ' + p);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function main() {
  // repo root not needed here
  const mappingPath = path.join(__dirname, 'canonical-sitios-mapping.json');
  const externalPath = path.join(__dirname, 'external-videos.json');

  const canonical = readJson(mappingPath);
  const external = readJson(externalPath);

  const mapping = canonical && canonical.mapping ? canonical.mapping : canonical;
  const targetTable = canonical && canonical.target_table ? canonical.target_table : 'properties';

  logger.info('Target table detected:', targetTable);

  for (const slug of Object.keys(external)) {
    const url = external[slug];
    const id = mapping[slug];
    if (!id) {
      logger.warn('No id for', slug, '- skipping');
      continue;
    }

    if (targetTable === 'properties') {
      const { error } = await supabase.from('properties').update({ video_url: url }).eq('id', id);
      if (error) logger.error('Failed to set video_url for', slug, error.message || error);
      else logger.info('Set video_url for', slug, url);
    } else {
      const { error } = await supabase.from('sitios').update({ video_url: url }).eq('id', id);
      if (error) logger.error('Failed to set video_url for', slug, error.message || error);
      else logger.info('Set video_url for', slug, url);
    }
  }
}

main().catch(err => {
  logger.error('Failed', err && err.message ? err.message : err);
  process.exit(1);
});
