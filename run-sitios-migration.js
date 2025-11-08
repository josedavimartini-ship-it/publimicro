const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection (direct connection)
// Note: Using direct connection instead of pooler for DDL operations
const DB_URL = "postgresql://postgres.irrzpwzyqcubhhjeuakc:P16r8C3_q7@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

async function runMigration() {
  console.log('🚀 Running Sitios Table Migration...\n');

  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase database\n');

    // Read the migration file
    const migrationFile = path.join(__dirname, 'supabase', 'migrations', '20251107000000_create_sitios_table.sql');
    
    if (!fs.existsSync(migrationFile)) {
      console.error('❌ Migration file not found:', migrationFile);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    console.log('📝 Executing sitios table migration...');
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!\n');
    console.log('Created:');
    console.log('  ✅ sitios table with full schema');
    console.log('  ✅ RLS policies (public view, users CRUD own)');
    console.log('  ✅ Indexes for performance');
    console.log('  ✅ Auto-slug generation trigger');
    console.log('  ✅ Updated timestamp trigger\n');
    
    // Verify table was created
    const result = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'sitios'
    `);
    
    if (result.rows[0].count > 0) {
      console.log('✅ Verified: sitios table exists in database\n');
      
      // Get column info
      const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'sitios'
        ORDER BY ordinal_position
      `);
      
      console.log('📊 Table Columns:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
      console.log('');
    }
    
    console.log('🎉 All done! Next steps:');
    console.log('1. Verify in Supabase Dashboard → Table Editor → sitios table');
    console.log('2. Test /meus-anuncios page');
    console.log('3. Try creating a new sitio property\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
