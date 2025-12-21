#!/usr/bin/env node
import { Client } from 'pg';
const slugs = ['abare','bigua','mergulhao','seriema','juriti','surucua'];
(async function(){
  const conn = process.env.SUPABASE_DB_URL;
  if(!conn){ console.error('SUPABASE_DB_URL not set'); process.exit(2); }
  const client = new Client({ connectionString: conn });
  await client.connect();
  for(const s of slugs){
    const q = `SELECT url, thumbnail_url, is_cover, (CASE WHEN url ~* '\\.(mp4|mov|webm)$' THEN 'video' ELSE 'photo' END) as kind FROM media WHERE resource_type='sitio' AND resource_id=(SELECT id FROM sitios WHERE slug=$1 LIMIT 1)`;
    const res = await client.query(q, [s]);
    const photos = res.rows.filter(r=>r.kind==='photo');
    const videos = res.rows.filter(r=>r.kind==='video');
    const covers = res.rows.filter(r=>r.is_cover===true);
    const coverIssues = covers.length===0 ? ['NO_COVER'] : (covers.some(c=>!c.thumbnail_url) ? ['COVER_NO_THUMB'] : []);
    console.log({ slug: s, total: res.rows.length, photos: photos.length, videos: videos.length, covers: covers.length, coverIssues});
  }
  await client.end();
})().catch(e=>{ console.error(e); process.exit(1); });