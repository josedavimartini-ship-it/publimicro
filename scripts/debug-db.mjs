#!/usr/bin/env node
import { Client } from 'pg';
(async function(){
  const conn = process.env.SUPABASE_DB_URL;
  if(!conn){ console.error('SUPABASE_DB_URL not set'); process.exit(2); }
  const c = new Client({ connectionString: conn });
  await c.connect();
  const r = await c.query('SELECT slug, id FROM sitios LIMIT 10');
  console.log('sitios sample:', r.rows);
  await c.end();
})().catch(e=>{ console.error('DB error', e); process.exit(1); });