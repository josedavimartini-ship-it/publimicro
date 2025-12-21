#!/usr/bin/env node
import { Client } from 'pg';
const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/query-media-by-slug.mjs <slug>'); process.exit(2);
}
async function main(){
  const conn = process.env.SUPABASE_DB_URL;
  if (!conn) { console.error('SUPABASE_DB_URL not set'); process.exit(2); }
  const client = new Client({ connectionString: conn });
  await client.connect();
  try{
    const q = `SELECT url, thumbnail_url, is_cover, created_at FROM media WHERE resource_type='sitio' AND resource_id = (SELECT id FROM sitios WHERE slug=$1 LIMIT 1) ORDER BY is_cover DESC, created_at ASC`;
    const res = await client.query(q, [slug]);
    console.log(JSON.stringify(res.rows, null, 2));
  } finally { await client.end(); }
}
main().catch(e=>{ console.error(e); process.exit(1); });