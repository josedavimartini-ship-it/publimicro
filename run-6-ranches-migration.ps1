# ═══════════════════════════════════════════════════════════
# FAZENDA CARCARÁ - 6 SÍTIOS MIGRATION SCRIPT
# Inserts 6 tree-named ranches into Supabase
# Run this AFTER configuring SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
# ═══════════════════════════════════════════════════════════

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  FAZENDA CARCARÁ - 6 SÍTIOS MIGRATION" -ForegroundColor Yellow
Write-Host "  Inserting: Buriti, Cedro, Ipê, Jatobá, Pequi, Sucupira" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check for environment variables
if (-not $env:SUPABASE_URL) {
    Write-Host "❌ ERROR: SUPABASE_URL not set in environment variables" -ForegroundColor Red
    Write-Host "Please add to .env.local:" -ForegroundColor Yellow
    Write-Host "NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url" -ForegroundColor Gray
    exit 1
}

if (-not $env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Host "❌ ERROR: SUPABASE_SERVICE_ROLE_KEY not set" -ForegroundColor Red
    Write-Host "Please add to .env.local:" -ForegroundColor Yellow
    Write-Host "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key" -ForegroundColor Gray
    exit 1
}

$SUPABASE_URL = $env:SUPABASE_URL
$SUPABASE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

Write-Host "🔑 Supabase URL: $SUPABASE_URL" -ForegroundColor Green
Write-Host "🔑 Service Role Key: $(if($SUPABASE_KEY.Length -gt 20) { $SUPABASE_KEY.Substring(0,20) + '...' } else { $SUPABASE_KEY })" -ForegroundColor Green
Write-Host ""

# Read SQL file
$SQL_FILE = Join-Path $PSScriptRoot "supabase\insert-6-ranches.sql"
if (-not (Test-Path $SQL_FILE)) {
    Write-Host "❌ ERROR: SQL file not found: $SQL_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Reading SQL file: $SQL_FILE" -ForegroundColor Cyan
$sqlContent = Get-Content $SQL_FILE -Raw
Write-Host "✅ SQL file loaded ($($sqlContent.Length) characters)" -ForegroundColor Green
Write-Host ""

# Execute SQL via Supabase REST API
Write-Host "🚀 Executing SQL migration..." -ForegroundColor Cyan

try {
    $headers = @{
        "apikey" = $SUPABASE_KEY
        "Authorization" = "Bearer $SUPABASE_KEY"
        "Content-Type" = "application/json"
        "Prefer" = "return=representation"
    }
    
    # Note: Supabase doesn't have a direct SQL execution endpoint via REST API
    # We'll need to use the PostgREST API or supabase CLI
    # For now, let's provide instructions for manual execution
    
    Write-Host "⚠️  MANUAL EXECUTION REQUIRED" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
    Write-Host "2. Select your project" -ForegroundColor White
    Write-Host "3. Navigate to: SQL Editor (left sidebar)" -ForegroundColor White
    Write-Host "4. Click 'New query'" -ForegroundColor White
    Write-Host "5. Copy and paste the contents of:" -ForegroundColor White
    Write-Host "   $SQL_FILE" -ForegroundColor Gray
    Write-Host "6. Click 'Run' or press Ctrl+Enter" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 SQL file path copied to clipboard (if available)" -ForegroundColor Green
    
    # Try to copy path to clipboard
    try {
        Set-Clipboard -Value $SQL_FILE
        Write-Host "✅ File path copied to clipboard!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not copy to clipboard automatically" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Alternative: Use Supabase CLI" -ForegroundColor Cyan
    Write-Host "npx supabase db execute --file supabase/insert-6-ranches.sql" -ForegroundColor Gray
    Write-Host ""
    
    # Open SQL file in default editor
    Write-Host "📝 Opening SQL file in default editor..." -ForegroundColor Cyan
    Start-Process $SQL_FILE
    
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  NEXT STEPS" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "After running the SQL in Supabase Dashboard:" -ForegroundColor White
Write-Host "1. ✅ Verify properties were created:" -ForegroundColor Cyan
Write-Host "   SELECT id, title, price FROM properties WHERE projeto = 'Sítios Carcará';" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 📸 Upload photos to Supabase Storage:" -ForegroundColor Cyan
Write-Host "   - Bucket: property-photos (public)" -ForegroundColor Gray
Write-Host "   - Folder structure: /{property_id}/" -ForegroundColor Gray
Write-Host "   - Example: /buriti/foto1.jpg, /buriti/foto2.jpg" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🔄 Update photo URLs in properties table:" -ForegroundColor Cyan
Write-Host "   UPDATE properties SET fotos = ARRAY[" -ForegroundColor Gray
Write-Host "     'https://[project].supabase.co/storage/v1/object/public/property-photos/buriti/foto1.jpg'," -ForegroundColor Gray
Write-Host "     'https://[project].supabase.co/storage/v1/object/public/property-photos/buriti/foto2.jpg'" -ForegroundColor Gray
Write-Host "   ] WHERE id = 'buriti';" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 🌐 Test on website:" -ForegroundColor Cyan
Write-Host "   - Homepage: http://localhost:3000" -ForegroundColor Gray
Write-Host "   - Carcará Landing: http://localhost:3000/projetos/carcara" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  MIGRATION SCRIPT COMPLETE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
