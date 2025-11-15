/**
 * Run neighborhood data migration
 * This script creates the neighborhood_data table in Supabase
 */

const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: path.join(__dirname, '../apps/publimicro/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const logger = require('./logger.cjs');

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Supabase client creation not required for this migration path (we use REST RPC or manual SQL).

async function runMigration() {
  logger.info('📊 Running neighborhood data migration...\n');
  
  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, '../supabase/migrations/20250105000001_add_neighborhood_data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split into individual statements (rough split, Supabase will handle it)
    logger.info('✅ Migration file loaded');
    logger.info(`📝 SQL length: ${sql.length} characters\n`);
    
    // Execute using Supabase SQL editor equivalent
    // Note: Supabase JS client doesn't support raw SQL execution directly
    // We need to use the REST API endpoint
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
      // If rpc endpoint doesn't exist, try direct database connection approach
      logger.info('⚠️  RPC endpoint not available, using table creation approach...\n');
      
      // Create the table using individual Supabase operations
      // This is a simplified version - the full migration should be run via Supabase CLI
      logger.info('ℹ️  To run the full migration, use Supabase CLI:');
      logger.info('   npx supabase db push\n');
      logger.info('   OR manually run the SQL in Supabase Dashboard > SQL Editor\n');
      logger.info(`   Migration file: supabase/migrations/20250105000001_add_neighborhood_data.sql\n`);
      
      return;
    }
    
    const data = await response.json();
    logger.info('✅ Migration executed successfully!');
    logger.info(data);
    
  } catch (error) {
    logger.error('❌ Migration failed:', error.message);
    logger.info('\n💡 Manual steps:');
    logger.info('1. Go to Supabase Dashboard > SQL Editor');
    logger.info('2. Copy the contents of: supabase/migrations/20250105000001_add_neighborhood_data.sql');
    logger.info('3. Paste and run the SQL');
    process.exit(1);
  }
}

runMigration();
