/**
 * Run neighborhood data migration
 * This script creates the neighborhood_data table in Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: path.join(__dirname, '../apps/publimicro/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('📊 Running neighborhood data migration...\n');
  
  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, '../supabase/migrations/20250105000001_add_neighborhood_data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split into individual statements (rough split, Supabase will handle it)
    console.log('✅ Migration file loaded');
    console.log(`📝 SQL length: ${sql.length} characters\n`);
    
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
      console.log('⚠️  RPC endpoint not available, using table creation approach...\n');
      
      // Create the table using individual Supabase operations
      // This is a simplified version - the full migration should be run via Supabase CLI
      console.log('ℹ️  To run the full migration, use Supabase CLI:');
      console.log('   npx supabase db push\n');
      console.log('   OR manually run the SQL in Supabase Dashboard > SQL Editor\n');
      console.log(`   Migration file: supabase/migrations/20250105000001_add_neighborhood_data.sql\n`);
      
      return;
    }
    
    const data = await response.json();
    console.log('✅ Migration executed successfully!');
    console.log(data);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n💡 Manual steps:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Copy the contents of: supabase/migrations/20250105000001_add_neighborhood_data.sql');
    console.log('3. Paste and run the SQL');
    process.exit(1);
  }
}

runMigration();
