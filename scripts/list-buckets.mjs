#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const sup = createClient(url, key, { auth: { persistSession: false } });
(async ()=>{
  try {
    const res = await sup.storage.listBuckets();
    console.log('listBuckets result:', res);
  } catch (err) {
    console.error('Exception listing buckets:', err);
  }
})();