#!/usr/bin/env node
import { Client } from 'pg';

async function main(){
  const conn = process.env.SUPABASE_DB_URL;
  if(!conn){
    console.error('SUPABASE_DB_URL not set'); process.exit(2);
  }
  const c = new Client({ connectionString: conn });
  await c.connect();
  const q = `SELECT DISTINCT s.slug, count(*) as cnt FROM media m JOIN sitios s ON s.id = m.resource_id AND m.resource_type='sitio' WHERE m.url LIKE 'dryrun://%' GROUP BY s.slug ORDER BY cnt DESC`;
  const r = await c.query(q);
  console.log('Found slugs with dryrun media:');
  for(const row of r.rows) console.log(row.slug, row.cnt);
  await c.end();
}

main().catch(e=>{ console.error(e); process.exit(1); });