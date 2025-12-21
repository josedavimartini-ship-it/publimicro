#!/usr/bin/env node
import { Client } from 'pg';
(async function(){
  const conn = process.env.SUPABASE_DB_URL;
  if(!conn){ console.error('SUPABASE_DB_URL not set'); process.exit(2); }
  const c = new Client({ connectionString: conn });
  await c.connect();
  const r = await c.query("SELECT id, url, thumbnail_url FROM media WHERE url LIKE 'dryrun://abare/%' OR url LIKE '%abarevideos_%' ORDER BY created_at DESC");
  console.log(JSON.stringify(r.rows, null, 2));
  await c.end();
})().catch(e=>{ console.error(e); process.exit(1); });