#!/usr/bin/env node
import fs from 'fs/promises';
import process from 'process';
import { Client } from 'pg';

async function main() {
  const args = process.argv.slice(2);
  let query = null;

  if (args.length === 0) {
    console.error('Usage: node scripts/pg-query.mjs "<SQL query>" or node scripts/pg-query.mjs --file path.sql');
    process.exit(1);
  }

  if (args[0] === '--file') {
    if (!args[1]) {
      console.error('Missing filename after --file');
      process.exit(1);
    }
    query = await fs.readFile(args[1], 'utf8');
  } else {
    // Join args with space to make it easy to pass queries without worrying about quoting
    query = args.join(' ');
  }

  const client = new Client({
    host: process.env.PGHOST || 'db.irrzpwzyqcubhhjeuakc.supabase.co',
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query(query);
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
  } catch (e) {
    console.error('ERROR:', e.message || e);
    try { await client.end(); } catch (err) {}
    process.exit(1);
  }
}

main();
