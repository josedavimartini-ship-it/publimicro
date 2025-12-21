#!/usr/bin/env node
import { Client } from 'pg';
const slugs = ['abare','bigua','mergulhao','seriema','juriti','surucua'];
(async function(){
  const conn = process.env.SUPABASE_DB_URL;
  if(!conn){ console.error('SUPABASE_DB_URL not set'); process.exit(2); }
  const client = new Client({ connectionString: conn });
  await client.connect();
  for(const s of slugs){
    const r = await client.query("SELECT id,url,thumbnail_url FROM media WHERE resource_type='sitio' AND is_cover=true AND resource_id=(SELECT id FROM sitios WHERE slug=$1 LIMIT 1)",[s]);
    console.log(s, 'covers=', r.rows.length);
    if(r.rows.length) console.log(JSON.stringify(r.rows, null,2));
  }
  await client.end();
})().catch(e=>{ console.error(e); process.exit(1); });