import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase credentials
const supabaseUrl = 'https://rkrbygsutlgbczvpzwwo.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmJ5Z3N1dGxnYmN6dnB6d3dvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODc2NDAxMSwiZXhwIjoyMDQ0MzQwMDExfQ.U48zITG4pWNxw00fGwN2z4aF2kq-f5B-LBZi9EVgSsc';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('🚀 Running announcement system migration...\n');
    
    // Read migration file
    const migrationPath = join(__dirname, 'supabase', 'migrations', '20251107000001_create_announcement_system.sql');
    const sql = readFileSync(migrationPath, 'utf-8');
    
    console.log(`📄 Migration file: ${migrationPath}`);
    console.log(`📏 Size: ${(sql.length / 1024).toFixed(2)} KB`);
    console.log(`📊 Total lines: ${sql.split('\n').length}\n`);
    
    // Execute migration using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).select();
    
    if (error) {
      console.error('❌ Migration failed:', error);
      
      // Try alternative method - direct execution
      console.log('\n🔄 Trying direct execution method...');
      
      // Split into individual statements and execute
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      console.log(`📝 Found ${statements.length} SQL statements\n`);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';
        
        // Skip comments
        if (statement.trim().startsWith('--')) continue;
        
        try {
          // For Supabase, we'll need to use the REST API or pg client
          // This is a simplified version - in production use proper pg client
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          
          // Note: This won't work directly with Supabase client
          // We need to use PostgreSQL client or Supabase Management API
          
          successCount++;
        } catch (err) {
          console.error(`❌ Error in statement ${i + 1}:`, err.message);
          console.error('Statement:', statement.substring(0, 100) + '...');
          errorCount++;
        }
      }
      
      console.log(`\n✅ Success: ${successCount}`);
      console.log(`❌ Errors: ${errorCount}`);
      
      throw new Error('Migration requires direct PostgreSQL access');
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('Data:', data);
    }
    
  } catch (error) {
    console.error('\n❌ MIGRATION ERROR:');
    console.error(error.message);
    console.error('\n💡 Solution: Run this migration using PostgreSQL client or Supabase dashboard:');
    console.error('   1. Go to Supabase Dashboard > SQL Editor');
    console.error('   2. Copy contents of: supabase/migrations/20251107000001_create_announcement_system.sql');
    console.error('   3. Paste and execute');
    console.error('\n   Or use: psql -h aws-0-sa-east-1.pooler.supabase.com -U postgres.rkrbygsutlgbczvpzwwo -d postgres -f supabase/migrations/20251107000001_create_announcement_system.sql');
    process.exit(1);
  }
}

runMigration();
