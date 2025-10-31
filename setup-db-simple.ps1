#!/usr/bin/env pwsh
# PubliMicro Database Setup Script

Write-Host ""
Write-Host "🚀 PubliMicro Database Setup" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create .env.local with your Supabase credentials." -ForegroundColor Yellow
    exit 1
}

# Get Supabase URL from env
$envContent = Get-Content ".env.local"
$supabaseUrl = ""
foreach ($line in $envContent) {
    if ($line -match "^NEXT_PUBLIC_SUPABASE_URL=(.+)$") {
        $supabaseUrl = $matches[1].Trim('"').Trim("'")
        break
    }
}

Write-Host "📊 Database Setup Summary" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

if ($supabaseUrl -and $supabaseUrl -ne "https://your-project.supabase.co") {
    Write-Host "✅ Supabase URL configured: $supabaseUrl" -ForegroundColor Green
} else {
    Write-Host "❌ Supabase URL not configured" -ForegroundColor Red
    Write-Host "Please update your .env.local file with the correct Supabase URL" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📝 Manual Database Setup Instructions" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please run these SQL files in your Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""

$sqlFiles = @(
    "apps\publimicro\sql\01_create_profiles.sql",
    "apps\publimicro\sql\02_create_ads.sql", 
    "apps\publimicro\sql\03_create_visits.sql",
    "apps\publimicro\sql\04_create_proposals.sql",
    "apps\publimicro\sql\05_create_bids.sql",
    "apps\publimicro\sql\06_create_sitios.sql",
    "apps\publimicro\sql\create_tables.sql",
    "apps\publimicro\supabase_tables.sql"
)

$counter = 1
foreach ($file in $sqlFiles) {
    if (Test-Path $file) {
        Write-Host "   $counter. 📄 $file" -ForegroundColor Gray
        $counter++
    }
}

Write-Host ""
Write-Host "Instructions:" -ForegroundColor White
Write-Host "1. Go to your Supabase project → SQL Editor" -ForegroundColor White
Write-Host "2. Copy and paste each file's content and execute" -ForegroundColor White
Write-Host "3. Verify tables are created in the Table Editor" -ForegroundColor White
Write-Host ""

# Ask to open dashboard
Write-Host "Would you like to open your Supabase dashboard now? (y/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -in @('y', 'Y', 'yes', 'Yes', 'YES')) {
    if ($supabaseUrl) {
        $dashboardUrl = $supabaseUrl -replace "\.supabase\.co.*", ".supabase.co"
        Write-Host "🌐 Opening Supabase Dashboard..." -ForegroundColor Blue
        Start-Process $dashboardUrl
    }
}

Write-Host ""
Write-Host "✅ Setup instructions provided!" -ForegroundColor Green
Write-Host "Next: Test your app with 'pnpm turbo dev --filter=@publimicro/publimicro'" -ForegroundColor Cyan
Write-Host ""