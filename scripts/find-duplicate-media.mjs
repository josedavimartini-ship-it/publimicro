#!/usr/bin/env node
import { Client } from 'pg';
import fs from 'fs/promises';

// Finds media rows for sitios with filenames that match after normalizing
// (strip _compressed/_processed, remove thumbs suffixes). Produces JSON report
// and a SQL/ops plan to delete duplicates keeping compressed/processed files.

function normalizeName(url){
  if(!url) return null;
  // last path part
  const p = url.split('/').pop();
  if(!p) return null;
  let n = p.replace(/(_compressed|_processed|_thumb)\./g, '.');
  // remove extra suffixes like _thumb.jpg -> .jpg
  n = n.replace(/_thumb\./g, '.');
  // remove extension
  n = n.replace(/\.[^.]+$/, '');
  return n.toLowerCase();
}

async function main(){
  const conn = process.env.SUPABASE_DB_URL;
  if(!conn){ console.error('SUPABASE_DB_URL not set'); process.exit(2); }
  const client = new Client({ connectionString: conn });
  await client.connect();

  const q = `SELECT m.id,m.url,m.thumbnail_url,s.slug FROM media m JOIN sitios s ON s.id = m.resource_id AND m.resource_type='sitio'`;
  const res = await client.query(q);

  const groups = new Map();
  for(const r of res.rows){
    const key = `${r.slug}::${normalizeName(r.url)}`;
    if(!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }

  const duplicates = [];
  for(const [k, arr] of groups){
    if(arr.length <= 1) continue;
    // prefer processed/compressed variants
    const keep = arr.find(a => /_compressed\.|_processed\./.test(a.url)) || arr[0];
    const remove = arr.filter(a => a.id !== keep.id);
    duplicates.push({ key: k, slug: arr[0].slug, keep: keep, remove });
  }

  const out = { totalGroups: groups.size, duplicatesCount: duplicates.length, duplicates };
  await fs.writeFile('artifacts/duplicate-media-report.json', JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote artifacts/duplicate-media-report.json');
  await client.end();
}

main().catch(e=>{ console.error(e); process.exit(1); });