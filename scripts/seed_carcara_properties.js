"use strict";

// Minimal, safe seed script for the six Sítios Carcará.
// Usage (PowerShell):
//  $env:SUPABASE_URL = 'https://...'
//  $env:SUPABASE_SERVICE_ROLE_KEY = '<service-role-key>'
//  node .\scripts\seed_carcara_properties.js

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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  // keep minimal settings
});

async function detectTargetTable() {
  // Try a minimal select against the `properties` table.
  try {
    const { error } = await supabase.from('properties').select('id,slug').limit(1);
    if (!error) return 'properties';
    // If error exists, fallthrough to try sitios
  } catch {
    // ignore and try sitios
  }

  try {
    const { error } = await supabase.from('sitios').select('id,slug').limit(1);
    if (!error) return 'sitios';
  } catch {
    // ignore
  }

  return null;
}

function readCanonical() {
  const p = path.join(__dirname, '..', 'apps', 'proper', 'rural', 'src', 'lib', 'AcheMeRuralPropers.json');
  if (!fs.existsSync(p)) {
    throw new Error('Canonical JSON not found at ' + p);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function upsertProperties(targetTable, properties) {
  const mapping = {};

  for (const p of properties) {
    try {
      if (targetTable === 'properties') {
        // Build a minimal payload and attempt upsert. If the DB returns
        // a NOT NULL constraint error, try to fill that column with a
        // safe default (from the source JSON or a sensible literal)
        const payloadBase = {
          slug: p.slug,
          title: p.title || p.slug,
          description: p.description || '',
          city: p.city || '',
          state: p.state || '',
          country: p.country || '',
          price: p.price || null,
          total_area: p.total_area || null,
          bedrooms: p.bedrooms || null,
          bathrooms: p.bathrooms || null,
          latitude: p.latitude || null,
          longitude: p.longitude || null,
          video_url: p.video_url || null,
          // sensible defaults for common not-null columns
          property_type: p.property_type || 'sitio',
          transaction_type: p.transaction_type || 'sale',
          status: p.status || 'active'
        };

        // Attempt upsert, and if we receive a NOT NULL violation for a
        // specific column, try adding a fallback value and retry.
        const triedCols = new Set();
        let finalData = null;
        let lastError = null;

        for (let attempt = 0; attempt < 6; attempt++) {
          const payload = Object.assign({}, payloadBase);
          // also copy any raw fotos array if present (harmless)
          if (p.fotos) payload.fotos = p.fotos;

          const { data, error } = await supabase
            .from('properties')
            .upsert(payload, { onConflict: ['slug'] })
            .select('id,slug');

          if (!error) {
            finalData = data;
            break;
          }

          lastError = error;
          const msg = (error && (error.message || error)) + '';
          const m = msg.match(/null value in column "([^"]+)"/i);
          if (!m) {
            // Unknown error — stop retrying
            logger.error('Upsert properties error for', p.slug, msg);
            break;
          }

          const col = m[1];
          if (triedCols.has(col)) {
            // Already tried to fill this column — avoid infinite loop
            logger.error('Repeated NOT NULL for', col, 'for', p.slug, msg);
            break;
          }

          triedCols.add(col);
          // Attempt to set a reasonable fallback based on type
          if (col === 'property_type') payloadBase.property_type = p.property_type || 'sitio';
          else if (col === 'transaction_type') payloadBase.transaction_type = p.transaction_type || 'sale';
          else if (col === 'status') payloadBase.status = p.status || 'active';
          else if (col === 'title') payloadBase.title = p.title || p.slug;
          else {
            // Generic fallback: set string columns to empty string
            payloadBase[col] = p[col] || '';
          }

          // loop and retry
        }

        if (!finalData) {
          logger.error('Failed to upsert properties for', p.slug, lastError && (lastError.message || lastError));
          mapping[p.slug] = null;
        } else {
          const id = finalData && finalData[0] && finalData[0].id;
          mapping[p.slug] = id || null;
          logger.info('Upserted properties', p.slug, '->', id);
        }
      } else {
        // sitios
        const payload = {
          slug: p.slug,
          nome: p.title || null,
          descricao: p.description || null,
          zona: p.city || null,
          preco: p.price || null,
          area_total: p.total_area || null,
          quartos: p.bedrooms || null,
          banheiros: p.bathrooms || null,
          coordenadas: p.latitude && p.longitude ? { lat: p.latitude, lng: p.longitude } : null,
          fotos: p.fotos || [],
          video_url: p.video_url || null,
          destaque: !!p.featured,
          ativo: true
        };

        const { data, error } = await supabase
          .from('sitios')
          .upsert(payload, { onConflict: ['slug'] })
          .select('id,slug');

        if (error) {
          logger.error('Upsert sitios error for', p.slug, error.message || error);
          continue;
        }

        const id = data && data[0] && data[0].id;
        mapping[p.slug] = id || null;
        logger.info('Upserted sitios', p.slug, '->', id);
      }
    } catch (err) {
      logger.error('Unexpected error for', p.slug, err && err.message ? err.message : err);
    }
  }

  return mapping;
}

async function main() {
  logger.info('Detecting target table...');
  const target = await detectTargetTable();
  if (!target) {
    logger.error('Could not detect target table `properties` or `sitios`. Check your Supabase credentials and schema.');
    process.exit(1);
  }

  logger.info('Detected target table:', target);

  const properties = readCanonical();
  if (!Array.isArray(properties) || properties.length === 0) {
    logger.error('No canonical properties found in JSON.');
    process.exit(1);
  }

  const mapping = await upsertProperties(target, properties);

  const outPath = path.join(__dirname, 'canonical-sitios-mapping.json');
  fs.writeFileSync(outPath, JSON.stringify({ target_table: target, mapping }, null, 2), 'utf8');
  logger.info('Wrote mapping to', outPath);
}

main().catch((err) => {
  logger.error('Seed failed', err && err.message ? err.message : err);
  process.exit(1);
});
