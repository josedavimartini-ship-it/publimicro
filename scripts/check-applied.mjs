#!/usr/bin/env node
import { Client } from 'pg';

async function main() {
  const conn = process.env.SUPABASE_DB_URL;
  if (!conn) {
    console.error('SUPABASE_DB_URL not set');
    process.exit(2);
  }

  const client = new Client({ connectionString: conn });
  await client.connect();
  try {
    const q = `SELECT s.slug, count(m.id)::int AS cnt
FROM sitios s
LEFT JOIN media m ON m.resource_type='sitio' AND m.resource_id = s.id
WHERE s.slug IN ('surucua','bigua','abare')
GROUP BY s.slug
ORDER BY s.slug`;
    const res = await client.query(q);
    console.log(JSON.stringify(res.rows, null, 2));
  } finally {
    await client.end();
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });