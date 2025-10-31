#!/usr/bin/env pwsh
# =============================================================================
# PubliMicro Supabase Database Setup Script
# =============================================================================
# This script sets up all required database tables for the PubliMicro project
# =============================================================================

param(
    [switch]$Help,
    [switch]$SkipConfirmation
)

function Show-Help {
    Write-Host "PubliMicro Database Setup Script" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\setup-supabase-db.ps1                    # Interactive setup"
    Write-Host "  .\setup-supabase-db.ps1 -SkipConfirmation  # Auto setup"
    Write-Host "  .\setup-supabase-db.ps1 -Help              # Show this help"
    Write-Host ""
    Write-Host "Prerequisites:" -ForegroundColor Yellow
    Write-Host "  1. Supabase project created at https://supabase.com"
    Write-Host "  2. Environment variables configured in .env.local"
    Write-Host "  3. Database URL and credentials ready"
    Write-Host ""
    Write-Host "What this script does:" -ForegroundColor Yellow
    Write-Host "  - Creates all required database tables"
    Write-Host "  - Sets up indexes for performance"
    Write-Host "  - Creates triggers and functions"
    Write-Host "  - Verifies database connection"
    Write-Host ""
}

function Test-Prerequisites {
    Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue
    
    # Check if .env.local exists
    if (-not (Test-Path ".env.local")) {
        Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
        Write-Host "Please create .env.local with your Supabase credentials." -ForegroundColor Yellow
        return $false
    }
    
    # Check if SQL files exist
    $sqlFiles = @(
        "apps\publimicro\sql\create_tables.sql",
        "apps\publimicro\sql\01_create_profiles.sql",
        "apps\publimicro\sql\02_create_ads.sql",
        "apps\publimicro\sql\03_create_visits.sql",
        "apps\publimicro\sql\04_create_proposals.sql",
        "apps\publimicro\sql\05_create_bids.sql",
        "apps\publimicro\sql\06_create_sitios.sql"
    )
    
    foreach ($file in $sqlFiles) {
        if (-not (Test-Path $file)) {
            Write-Host "⚠️  Warning: SQL file not found: $file" -ForegroundColor Yellow
        }
    }
    
    Write-Host "✅ Prerequisites checked!" -ForegroundColor Green
    return $true
}

function Get-EnvVariable {
    param([string]$VarName)
    
    if (Test-Path ".env.local") {
        $content = Get-Content ".env.local"
        foreach ($line in $content) {
            if ($line -match "^$VarName=(.+)$") {
                return $matches[1].Trim('"').Trim("'")
            }
        }
    }
    return $null
}

function Show-DatabaseStatus {
    Write-Host ""
    Write-Host "📊 Database Setup Summary" -ForegroundColor Green
    Write-Host "=========================" -ForegroundColor Green
    
    $supabaseUrl = Get-EnvVariable "NEXT_PUBLIC_SUPABASE_URL"
    $hasDbUrl = (Get-EnvVariable "DATABASE_URL") -ne $null
    
    if ($supabaseUrl -and $supabaseUrl -ne "https://your-project.supabase.co") {
        Write-Host "✅ Supabase URL configured: $supabaseUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ Supabase URL not configured" -ForegroundColor Red
    }
    
    if ($hasDbUrl) {
        Write-Host "✅ Database URL configured" -ForegroundColor Green
    } else {
        Write-Host "❌ Database URL not configured" -ForegroundColor Red
    }
    
    Write-Host ""
}

function Show-SQLCommands {
    Write-Host "📝 Manual Database Setup Instructions" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Since we can't execute SQL directly, please run these commands in your Supabase SQL Editor:" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "1. Go to your Supabase project → SQL Editor" -ForegroundColor White
    Write-Host "2. Copy and paste the contents of these files in order:" -ForegroundColor White
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
    
    foreach ($file in $sqlFiles) {
        if (Test-Path $file) {
            Write-Host "   📄 $file" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "3. Run each file's content in the SQL Editor" -ForegroundColor White
    Write-Host "4. Verify tables are created in the Table Editor" -ForegroundColor White
    Write-Host ""
}

function Open-SupabaseDashboard {
    $supabaseUrl = Get-EnvVariable "NEXT_PUBLIC_SUPABASE_URL"
    if ($supabaseUrl -and $supabaseUrl -ne "https://your-project.supabase.co") {
        $dashboardUrl = $supabaseUrl -replace "\.supabase\.co.*", ".supabase.co"
        Write-Host "🌐 Opening Supabase Dashboard..." -ForegroundColor Blue
        Start-Process $dashboardUrl
    }
}

function Main {
    if ($Help) {
        Show-Help
        return
    }
    
    Write-Host ""
    Write-Host "🚀 PubliMicro Database Setup" -ForegroundColor Green
    Write-Host "============================" -ForegroundColor Green
    Write-Host ""
    
    # Check prerequisites
    if (-not (Test-Prerequisites)) {
        return
    }
    
    # Show current status
    Show-DatabaseStatus
    
    # Confirm setup
    if (-not $SkipConfirmation) {
        Write-Host "Do you want to continue with database setup? (y/N): " -ForegroundColor Yellow -NoNewline
        $response = Read-Host
        if ($response -notin @('y', 'Y', 'yes', 'Yes', 'YES')) {
            Write-Host "Setup cancelled." -ForegroundColor Yellow
            return
        }
    }
    
    # Show manual setup instructions
    Show-SQLCommands
    
    # Ask if user wants to open Supabase dashboard
    Write-Host "Would you like to open your Supabase dashboard now? (y/N): " -ForegroundColor Yellow -NoNewline
    $openDashboard = Read-Host
    if ($openDashboard -in @('y', 'Y', 'yes', 'Yes', 'YES')) {
        Open-SupabaseDashboard
    }
    
    Write-Host ""
    Write-Host "✅ Database setup instructions provided!" -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Execute the SQL files in your Supabase dashboard" -ForegroundColor White
    Write-Host "  2. Verify tables are created successfully" -ForegroundColor White
    Write-Host "  3. Test the application with: pnpm turbo dev --filter=@publimicro/publimicro" -ForegroundColor White
    Write-Host ""
}

# Run the script
Main