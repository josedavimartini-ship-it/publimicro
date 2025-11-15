import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { info, warn, error } from './logger.mjs';

// load .env from apps/publimicro if present
try {
  const dotenvPath = path.join(new URL('.', import.meta.url).pathname, '..', 'apps', 'publimicro', '.env.local');
  await import('dotenv/config');
} catch (e) {
  // ignore
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function runMigration() {
  info('📊 Running neighborhood data migration...\n');
  try {
    const sqlPath = path.join(new URL('.', import.meta.url).pathname, '..', 'supabase', 'migrations', '20250105000001_add_neighborhood_data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    info('✅ Migration file loaded');
    info(`📝 SQL length: ${sql.length} characters\n`);

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      info('⚠️  RPC endpoint not available, using table creation approach...\n');
      info('ℹ️  To run the full migration, use Supabase CLI:');
      info('   npx supabase db push\n');
      info('   OR manually run the SQL in Supabase Dashboard > SQL Editor\n');
      info(`   Migration file: supabase/migrations/20250105000001_add_neighborhood_data.sql\n`);
      return;
    }

    const data = await response.json();
    info('✅ Migration executed successfully!');
    info(data);
  } catch (err) {
    error('❌ Migration failed:', err.message);
    info('\n💡 Manual steps:');
    info('1. Go to Supabase Dashboard > SQL Editor');
    info('2. Copy the contents of: supabase/migrations/20250105000001_add_neighborhood_data.sql');
    info('3. Paste and run the SQL');
    process.exit(1);
  }
}

runMigration();
