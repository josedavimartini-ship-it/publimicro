import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { info, error } from './logger.mjs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {});

async function detectTargetTable() {
  try {
    const { data, error: e } = await supabase.from('properties').select('id,slug').limit(1);
    if (!e) return 'properties';
  } catch (err) {}
  try {
    const { data, error: e } = await supabase.from('sitios').select('id,slug').limit(1);
    if (!e) return 'sitios';
  } catch (err) {}
  return null;
}

function readCanonical() {
  const p = path.join(new URL('.', import.meta.url).pathname, '..', 'apps', 'proper', 'rural', 'src', 'lib', 'AcheMeRuralPropers.json');
  if (!fs.existsSync(p)) throw new Error('Canonical JSON not found at ' + p);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function upsertProperties(targetTable, properties) {
  const mapping = {};
  for (const p of properties) {
    try {
      if (targetTable === 'properties') {
        const payloadBase = { slug: p.slug, title: p.title || p.slug, description: p.description || '', city: p.city || '', state: p.state || '', country: p.country || '', price: p.price || null, total_area: p.total_area || null, bedrooms: p.bedrooms || null, bathrooms: p.bathrooms || null, latitude: p.latitude || null, longitude: p.longitude || null, video_url: p.video_url || null, property_type: p.property_type || 'sitio', transaction_type: p.transaction_type || 'sale', status: p.status || 'active' };
        const triedCols = new Set();
        let finalData = null; let lastError = null;
        for (let attempt = 0; attempt < 6; attempt++) {
          const payload = Object.assign({}, payloadBase);
          if (p.fotos) payload.fotos = p.fotos;
          const { data, error: err } = await supabase.from('properties').upsert(payload, { onConflict: ['slug'] }).select('id,slug');
          if (!err) { finalData = data; break; }
          lastError = err;
          const msg = (err && (err.message || err)) + '';
          const m = msg.match(/null value in column "([^"]+)"/i);
          if (!m) { error('Upsert properties error for', p.slug, msg); break; }
          const col = m[1];
          if (triedCols.has(col)) { error('Repeated NOT NULL for', col, 'for', p.slug, msg); break; }
          triedCols.add(col);
          if (col === 'property_type') payloadBase.property_type = p.property_type || 'sitio';
          else if (col === 'transaction_type') payloadBase.transaction_type = p.transaction_type || 'sale';
          else if (col === 'status') payloadBase.status = p.status || 'active';
          else if (col === 'title') payloadBase.title = p.title || p.slug;
          else payloadBase[col] = p[col] || '';
        }
        if (!finalData) { error('Failed to upsert properties for', p.slug, lastError && (lastError.message || lastError)); mapping[p.slug] = null; }
        else { const id = finalData && finalData[0] && finalData[0].id; mapping[p.slug] = id || null; info('Upserted properties', p.slug, '->', id); }
      } else {
        const payload = { slug: p.slug, nome: p.title || null, descricao: p.description || null, zona: p.city || null, preco: p.price || null, area_total: p.total_area || null, quartos: p.bedrooms || null, banheiros: p.bathrooms || null, coordenadas: p.latitude && p.longitude ? { lat: p.latitude, lng: p.longitude } : null, fotos: p.fotos || [], video_url: p.video_url || null, destaque: !!p.featured, ativo: true };
        const { data, error: err } = await supabase.from('sitios').upsert(payload, { onConflict: ['slug'] }).select('id,slug');
        if (err) { error('Upsert sitios error for', p.slug, err.message || err); continue; }
        const id = data && data[0] && data[0].id; mapping[p.slug] = id || null; info('Upserted sitios', p.slug, '->', id);
      }
    } catch (err) { error('Unexpected error for', p.slug, err && err.message ? err.message : err); }
  }
  return mapping;
}

async function main() {
  info('Detecting target table...');
  const target = await detectTargetTable();
  if (!target) { error('Could not detect target table `properties` or `sitios`. Check your Supabase credentials and schema.'); process.exit(1); }
  info('Detected target table:', target);
  const properties = readCanonical();
  if (!Array.isArray(properties) || properties.length === 0) { error('No canonical properties found in JSON.'); process.exit(1); }
  const mapping = await upsertProperties(target, properties);
  const outPath = path.join(new URL('.', import.meta.url).pathname, 'canonical-sitios-mapping.json');
  fs.writeFileSync(outPath, JSON.stringify({ target_table: target, mapping }, null, 2), 'utf8');
  info('Wrote mapping to', outPath);
}

main().catch((err) => { error('Seed failed', err && err.message ? err.message : err); process.exit(1); });
