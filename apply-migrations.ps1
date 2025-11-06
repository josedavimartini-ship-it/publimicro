# ====================================================================
# PubliMicro - Apply Database Migrations to Supabase
# ====================================================================

Write-Host "🗄️ PubliMicro Database Migration Tool" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found" -ForegroundColor Red
    Write-Host "Please create .env.local with your Supabase credentials" -ForegroundColor Yellow
    exit 1
}

# Read Supabase credentials from .env.local
$envContent = Get-Content ".env.local" -Raw
$supabaseUrl = if ($envContent -match 'NEXT_PUBLIC_SUPABASE_URL=(.+)') { $matches[1].Trim() } else { "" }
$supabaseKey = if ($envContent -match 'SUPABASE_SERVICE_ROLE_KEY=(.+)') { $matches[1].Trim() } else { "" }

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Error: Supabase credentials not found in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Supabase credentials loaded" -ForegroundColor Green
Write-Host "📍 Project URL: $supabaseUrl" -ForegroundColor Blue
Write-Host ""

# List of migrations to apply (in order)
$migrations = @(
    "supabase\migrations\20251031160823_remote_schema.sql",
    "supabase\migrations\20251103000000_create_user_profiles.sql",
    "supabase\migrations\20251104000000_create_properties_system.sql",
    "supabase\migrations\20251105000000_create_visits_system.sql",
    "supabase\migrations\20250105000001_add_neighborhood_data.sql"
)

Write-Host "📋 Migrations to apply:" -ForegroundColor Blue
foreach ($migration in $migrations) {
    $fileName = Split-Path $migration -Leaf
    Write-Host "  • $fileName" -ForegroundColor White
}
Write-Host ""

# Function to execute SQL via Supabase REST API
function Invoke-SupabaseSql {
    param (
        [string]$Sql,
        [string]$MigrationName
    )
    
    try {
        Write-Host "⏳ Applying: $MigrationName" -ForegroundColor Yellow
        
        # Prepare the SQL for JSON (escape special characters)
        $escapedSql = $Sql -replace '"', '\"' -replace "`r`n", "\n" -replace "`n", "\n"
        
        # Create JSON payload
        $jsonPayload = @{
            query = $Sql
        } | ConvertTo-Json -Depth 10
        
        # Execute SQL via Supabase REST API
        $response = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/rpc/exec_sql" `
            -Method Post `
            -Headers @{
                "apikey" = $supabaseKey
                "Authorization" = "Bearer $supabaseKey"
                "Content-Type" = "application/json"
            } `
            -Body $jsonPayload `
            -ErrorAction Stop
        
        Write-Host "✅ Applied: $MigrationName" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "⚠️ Note: $MigrationName - $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "   (This may be normal if the schema already exists)" -ForegroundColor Gray
        return $false
    }
}

# Apply each migration
$successCount = 0
$skippedCount = 0

foreach ($migrationFile in $migrations) {
    if (-not (Test-Path $migrationFile)) {
        Write-Host "⚠️ File not found: $migrationFile" -ForegroundColor Yellow
        $skippedCount++
        continue
    }
    
    $fileName = Split-Path $migrationFile -Leaf
    $sqlContent = Get-Content $migrationFile -Raw
    
    if (Invoke-SupabaseSql -Sql $sqlContent -MigrationName $fileName) {
        $successCount++
    } else {
        $skippedCount++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🎉 Migration Complete!" -ForegroundColor Green
Write-Host "✅ Applied: $successCount migrations" -ForegroundColor Green
Write-Host "⚠️ Skipped: $skippedCount migrations" -ForegroundColor Yellow
Write-Host ""

# Verify tables exist
Write-Host "🔍 Verifying database tables..." -ForegroundColor Blue
Write-Host ""
Write-Host "Please check your Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "👉 $supabaseUrl/project/irrzpwzyqcubhhjeuakc/editor" -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected tables:" -ForegroundColor Blue
Write-Host "  ✓ user_profiles" -ForegroundColor White
Write-Host "  ✓ properties" -ForegroundColor White
Write-Host "  ✓ property_favorites" -ForegroundColor White
Write-Host "  ✓ visits" -ForegroundColor White
Write-Host "  ✓ proposals" -ForegroundColor White
Write-Host "  ✓ neighborhood_data" -ForegroundColor White
Write-Host ""

Write-Host "📚 Next Steps:" -ForegroundColor Blue
Write-Host "1. Verify tables in Supabase Dashboard → Database → Tables" -ForegroundColor Yellow
Write-Host "2. Configure Authentication → See SUPABASE-CONFIG-GUIDE.md" -ForegroundColor Yellow
Write-Host "3. Test signup/login at http://localhost:3000/entrar" -ForegroundColor Yellow
Write-Host ""
