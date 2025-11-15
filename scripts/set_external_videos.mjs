import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { info, warn, error } from './logger.mjs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
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
  const repoRoot = path.join(new URL('.', import.meta.url).pathname, '..');
  const mappingPath = path.join(new URL('.', import.meta.url).pathname, 'canonical-sitios-mapping.json');
  const externalPath = path.join(new URL('.', import.meta.url).pathname, 'external-videos.json');

  const canonical = readJson(mappingPath);
  const external = readJson(externalPath);

  const mapping = canonical && canonical.mapping ? canonical.mapping : canonical;
  const targetTable = canonical && canonical.target_table ? canonical.target_table : 'properties';

  info('Target table detected:', targetTable);

  for (const slug of Object.keys(external)) {
    const url = external[slug];
    const id = mapping[slug];
    if (!id) {
      warn('No id for', slug, '- skipping');
      continue;
    }

    if (targetTable === 'properties') {
      const { error: err } = await supabase.from('properties').update({ video_url: url }).eq('id', id);
      if (err) error('Failed to set video_url for', slug, err.message || err);
      else info('Set video_url for', slug, url);
    } else {
      const { error: err } = await supabase.from('sitios').update({ video_url: url }).eq('id', id);
      if (err) error('Failed to set video_url for', slug, err.message || err);
      else info('Set video_url for', slug, url);
    }
  }
}

main().catch(err => { error('Failed', err && err.message ? err.message : err); process.exit(1); });
