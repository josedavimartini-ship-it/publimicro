#!/usr/bin/env node
import { Client } from 'pg';

// Usage: node scripts/ensure-covers.mjs --apply
const args = process.argv.slice(2);
const doApply = args.includes('--apply');
const slugs = ['abare','bigua']; // slugs that had no covers

async function main(){
  const conn = process.env.SUPABASE_DB_URL;
  if(!conn){ console.error('SUPABASE_DB_URL not set'); process.exit(2); }
  const client = new Client({ connectionString: conn });
  await client.connect();

  for(const s of slugs){
    const cur = await client.query("SELECT id FROM media WHERE resource_type='sitio' AND is_cover=true AND resource_id=(SELECT id FROM sitios WHERE slug=$1 LIMIT 1)",[s]);
    if(cur.rows.length){ console.log(s, 'already has cover'); continue; }

    // pick first photo with thumbnail (prefer processed photos)
    const cand = await client.query("SELECT id,url,thumbnail_url FROM media WHERE resource_type='sitio' AND (url ~* '\\.(jpe?g|png|webp|avif)$') AND resource_id=(SELECT id FROM sitios WHERE slug=$1 LIMIT 1) ORDER BY url LIKE '%-processed%' DESC, created_at ASC LIMIT 1", [s]);
    if(cand.rows.length){
      const row = cand.rows[0];
      console.log('Chosen cover for', s, row.url, 'thumb=', row.thumbnail_url);
      if(!doApply){ console.log('Dry run: would set is_cover on', row.id); continue; }
      await client.query('UPDATE media SET is_cover=true WHERE id=$1',[row.id]);
      console.log('Set is_cover for', s, row.id);
    } else {
      console.log('No photo candidate found for', s, 'skipping.');
    }
  }
  await client.end();
}

main().catch(e=>{ console.error(e); process.exit(1); });