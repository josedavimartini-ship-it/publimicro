#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { Client } from 'pg';

async function main(){
  const conn = process.env.SUPABASE_DB_URL;
  if(!conn){ console.error('SUPABASE_DB_URL not set'); process.exit(2); }
  const artifactsPath = 'artifacts/processed-uploads-abare.json';
  const raw = await fs.readFile(artifactsPath, 'utf8');
  const data = JSON.parse(raw);
  const files = [];
  for(const group of Object.values(data.processed||{})){
    for(const f of group.files||[]) files.push(f);
  }

  const client = new Client({ connectionString: conn });
  await client.connect();
  const res = await client.query("SELECT id,url,thumbnail_url FROM media WHERE url LIKE 'dryrun://abare/%'");
  const updates = [];
  for(const row of res.rows){
    const id = row.id;
    const url = row.url;
    const m = url.match(/(\d{8}_\d{6})/);
    if(!m){ console.warn('No timestamp found in', url); continue; }
    const stamp = m[1];
    // find processed mp4 and thumb candidates
    const processed = files.find(f => f.name.toLowerCase().includes(stamp) && f.name.toLowerCase().endsWith('.mp4'));
    const thumb = files.find(f => f.name.toLowerCase().includes(stamp) && f.name.toLowerCase().endsWith('_thumb.jpg'));
    if(processed){
      updates.push({ id, oldUrl: url, newUrl: processed.publicUrl, thumb: thumb ? thumb.publicUrl : null });
    } else {
      console.warn('No processed mp4 found for', url);
    }
  }

  if(!updates.length){ console.log('No updates to apply'); await client.end(); return; }

  console.log('Planned updates:', updates);

  // Apply
  for(const u of updates){
    const q = `UPDATE media SET url=$1${u.thumb?`, thumbnail_url=$2`:''} WHERE id=$3`;
    const params = u.thumb ? [u.newUrl, u.thumb, u.id] : [u.newUrl, u.id];
    console.log('Applying update for id', u.id);
    await client.query(q, params);
  }

  console.log('Done');
  await client.end();
}

main().catch(e=>{ console.error(e); process.exit(1); });