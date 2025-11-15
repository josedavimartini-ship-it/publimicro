import fs from 'fs';
import path from 'path';
import { error, info } from './logger.mjs';
const DB_URL = process.env.SUPABASE_DB_URL;
if (!DB_URL) { error('ERROR: Please set SUPABASE_DB_URL environment variable.'); process.exit(1); }

const sqlFiles = [
  'apps/publimicro/sql/01_create_profiles.sql',
  'apps/publimicro/sql/02_create_ads.sql',
  'apps/publimicro/sql/03_create_visits.sql',
  'apps/publimicro/sql/04_create_proposals.sql',
  'apps/publimicro/sql/05_create_bids.sql',
  'apps/publimicro/sql/06_create_sitios.sql',
];

async function run() {
  // dynamic import of pg for compatibility
  const pg = await import('pg');
  const { Client } = pg;
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  info('Connected to Supabase.');
  await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
  info('Ensured extension "pgcrypto".');

  for (const rel of sqlFiles) {
    const filePath = path.resolve(process.cwd(), rel);
    const sql = fs.readFileSync(filePath, 'utf8');
    info(`\n=== Running ${rel} ===`);
    await client.query(sql);
    info(`OK: ${rel}`);
  }

  try {
    info("\nAttempting to create storage bucket 'imagens-sitios'...");
    await client.query(`select storage.create_bucket('imagens-sitios', public => true);`);
    info('Bucket created.');
  } catch (e) { info('Bucket step:', e.message); }

  await client.end();
  info('\nAll SQL executed successfully.');
}

run().catch((err) => { error('SQL runner failed:', err); process.exit(1); });
