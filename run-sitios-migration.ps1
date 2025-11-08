# ============================================
# Run Sitios Table Migration to Supabase
# ============================================
Write-Host "🚀 Running Sitios Table Migration..." -ForegroundColor Cyan

# Database connection (pooler URL for better performance)
$env:SUPABASE_DB_URL = "postgresql://postgres.irrzpwzyqcubhhjeuakc:P16r8C3_q7%40@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Check if migration file exists
$migrationFile = "supabase\migrations\20251107000000_create_sitios_table.sql"
if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Found migration file: $migrationFile" -ForegroundColor Green

# Create temporary Node.js script to run the migration
$scriptContent = @"
const { Client } = require('pg');
const fs = require('fs');

const DB_URL = process.env.SUPABASE_DB_URL;
if (!DB_URL) {
  console.error('❌ ERROR: SUPABASE_DB_URL not set');
  process.exit(1);
}

async function runMigration() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase database');

    // Read the migration file
    const sql = fs.readFileSync('$($migrationFile.Replace('\', '/'))', 'utf8');
    
    console.log('📝 Executing sitios table migration...');
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Created:');
    console.log('  - sitios table with full schema');
    console.log('  - RLS policies (public view, users CRUD own)');
    console.log('  - Indexes for performance');
    console.log('  - Auto-slug generation trigger');
    console.log('  - Updated timestamp trigger');
    
    // Verify table was created
    const result = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'sitios'
    `);
    
    if (result.rows[0].count > 0) {
      console.log('');
      console.log('✅ Verified: sitios table exists in database');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
"@

# Write temporary script
$tempScript = "temp-run-migration.js"
$scriptContent | Out-File -FilePath $tempScript -Encoding UTF8

Write-Host "🔄 Executing migration..." -ForegroundColor Yellow

# Run the migration
node $tempScript

# Clean up
Remove-Item $tempScript -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Migration script completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify in Supabase Dashboard → Table Editor → sitios table should exist"
Write-Host "2. Test the /meus-anuncios page to see if it loads sitios"
Write-Host "3. Try creating a new sitio property"
