#!/usr/bin/env node
import fs from 'fs/promises';
import process from 'process';
import url from 'url';
import { Client } from 'pg';

// Usage:
// DRY RUN (preview):
//   node scripts/apply-media-mapping-local.mjs --file sql/media-mapping-apply.sql
// APPLY:
//   SUPABASE_DB_URL='postgresql://user:pass@host:5432/postgres' node scripts/apply-media-mapping-local.mjs --file sql/media-mapping-apply.sql --apply

async function main() {
  const args = process.argv.slice(2);
  let file = 'sql/media-mapping-apply.sql';
  let doApply = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') file = args[++i];
    if (args[i] === '--apply') doApply = true;
  }

  try {
    const sql = await fs.readFile(file, 'utf8');
    const lines = sql.split(/\r?\n/);
    const preview = lines.slice(0, 200).join('\n');
    console.log('--- SQL preview (first 200 lines) ---\n');
    console.log(preview);
    console.log('\n--- End preview ---\n');

    const inserts = (sql.match(/INSERT INTO media /gi) || []).length;
    console.log(`Detected ${inserts} INSERT INTO media statements in the file.`);

    if (!doApply) {
      console.log('\nThis is a dry run. To apply the SQL, re-run with --apply and ensure SUPABASE_DB_URL env var is set.');
      console.log("Example: SUPABASE_DB_URL='postgresql://user:pass@host:5432/postgres' node scripts/apply-media-mapping-local.mjs --file sql/media-mapping-apply.sql --apply");
      process.exit(0);
    }

    const conn = process.env.SUPABASE_DB_URL;
    if (!conn) {
      console.error('SUPABASE_DB_URL environment variable not set. Set it to your DB connection string.');
      process.exit(2);
    }

    console.log('Connecting to DB...');
    const client = new Client({ connectionString: conn });
    await client.connect();
    try {
      console.log('Starting transaction...');
      await client.query('BEGIN');
      console.log('Running SQL...');
      await client.query(sql);
      await client.query('COMMIT');
      console.log('Apply completed successfully.');
    } catch (e) {
      console.error('Error while executing SQL, rolling back. Error:', e.message || e);
      try { await client.query('ROLLBACK'); } catch (e2) {}
      process.exit(3);
    } finally {
      await client.end();
    }
  } catch (e) {
    console.error('Failed to read file or other error:', e.message || e);
    process.exit(1);
  }
}

main();
