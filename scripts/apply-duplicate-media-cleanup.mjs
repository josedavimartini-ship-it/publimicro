#!/usr/bin/env node
import fs from 'fs/promises';
import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';

// Usage: node scripts/apply-duplicate-media-cleanup.mjs --apply

async function main(){
  const args = process.argv.slice(2);
  const doApply = args.includes('--apply');

  const conn = process.env.SUPABASE_DB_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!conn) { console.error('SUPABASE_DB_URL not set'); process.exit(2); }

  const raw = await fs.readFile('artifacts/duplicate-media-report.json','utf8');
  const report = JSON.parse(raw);

  const client = new Client({ connectionString: conn });
  await client.connect();

  const supa = (supabaseUrl && svcKey) ? createClient(supabaseUrl, svcKey, { auth: { persistSession: false } }) : null;

  const removeIds = [];
  const storageDeletes = [];

  for(const g of report.duplicates){
    for(const r of g.remove){
      removeIds.push(r.id);
      // if url is public storage URL, parse bucket/path
      const m = r.url && r.url.match(/\/storage\/v1\/object\/public\/(.*?)\/(.*)$/);
      if(m){ storageDeletes.push({ bucket: m[1], path: m[2], url: r.url, id: r.id }); }
    }
  }

  // Dry-run summary
  console.log('Planned media row deletions:', removeIds.length);
  console.log('Planned storage object deletions (if unreferenced):', storageDeletes.length);

  if(!doApply){
    console.log('Dry run complete. Re-run with --apply to execute deletions.');
    await client.end();
    return;
  }

  console.log('Applying deletions...');
  // Delete media rows in a transaction
  try{
    await client.query('BEGIN');
    for(const id of removeIds){
      await client.query('DELETE FROM media WHERE id = $1', [id]);
      console.log('Deleted media row', id);
    }
    await client.query('COMMIT');
  } catch(e){
    await client.query('ROLLBACK');
    throw e;
  }

  if(!supa){
    console.log('Supabase upload creds not set; skipping storage deletes.');
    await client.end();
    return;
  }

  // For each storage delete, check if any remaining media rows reference the same URL
  for(const s of storageDeletes){
    const r = await client.query('SELECT count(*) as c FROM media WHERE url = $1', [s.url]);
    const c = Number(r.rows[0].c || 0);
    if(c === 0){
      // safe to delete object
      const { data, error } = await supa.storage.from(s.bucket).remove([s.path]);
      if(error) console.warn('Failed to delete storage', s.bucket, s.path, error.message || error);
      else console.log('Deleted storage object', s.bucket, s.path);
    } else {
      console.log('Skipping storage delete (still referenced):', s.url, 'refs=', c);
    }
  }

  await client.end();
  console.log('Cleanup applied.');
}

main().catch(e=>{ console.error(e); process.exit(1); });