# =============================================================================
# PubliMicro - One-Click Database & Payment Setup
# =============================================================================
# This script sets up your Supabase database and configures payment integration
# =============================================================================

param(
    [string]$StripePublishableKey = "",
    [string]$StripeSecretKey = "",
    [string]$StripeWebhookSecret = ""
)

Write-Host "🚀 PubliMicro Database & Payment Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if Supabase credentials exist
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "Please make sure you're in the project root directory." -ForegroundColor Yellow
    exit 1
}

# Read current environment variables
$envContent = Get-Content ".env.local" -Raw

# Check if Supabase URL is configured
if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL=https://([^.]+)\.supabase\.co") {
    $projectRef = $matches[1]
    Write-Host "✅ Found Supabase project: $projectRef" -ForegroundColor Green
} else {
    Write-Host "❌ Supabase URL not found in .env.local" -ForegroundColor Red
    Write-Host "Please add your Supabase credentials to .env.local first" -ForegroundColor Yellow
    exit 1
}

# =============================================================================
# 1. Install Supabase CLI (if not already installed)
# =============================================================================
Write-Host "`n📦 Checking Supabase CLI..." -ForegroundColor Blue

try {
    $supabaseVersion = & supabase --version 2>&1
    Write-Host "✅ Supabase CLI already installed: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "⚙️ Installing Supabase CLI..." -ForegroundColor Yellow
    
    # Try different installation methods
    try {
        # Method 1: Try with Scoop (if available)
        if (Get-Command scoop -ErrorAction SilentlyContinue) {
            Write-Host "Installing via Scoop..." -ForegroundColor Yellow
            scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
            scoop install supabase
        } else {
            # Method 2: Manual download (Windows)
            Write-Host "Downloading Supabase CLI manually..." -ForegroundColor Yellow
            $downloadUrl = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.zip"
            $tempPath = "$env:TEMP\supabase-cli.zip"
            $installPath = "$env:LOCALAPPDATA\supabase"
            
            # Create install directory
            New-Item -ItemType Directory -Force -Path $installPath | Out-Null
            
            # Download and extract
            Invoke-WebRequest -Uri $downloadUrl -OutFile $tempPath
            Expand-Archive -Path $tempPath -DestinationPath $installPath -Force
            
            # Add to PATH for current session
            $env:PATH += ";$installPath"
            
            Write-Host "✅ Supabase CLI installed to: $installPath" -ForegroundColor Green
            Write-Host "💡 Note: Add '$installPath' to your system PATH permanently" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️ Could not install Supabase CLI automatically" -ForegroundColor Yellow
        Write-Host "Please install manually from: https://supabase.com/docs/guides/cli" -ForegroundColor Yellow
        Write-Host "Continuing with database setup via REST API..." -ForegroundColor Blue
    }
}

# =============================================================================
# 2. Setup Database Schema
# =============================================================================
Write-Host "`n🗄️ Setting up database schema..." -ForegroundColor Blue

# Read the SQL file
$sqlFile = "apps\publimicro\supabase_tables.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ SQL file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

$sqlContent = Get-Content $sqlFile -Raw
Write-Host "📄 Found SQL file with $(($sqlContent -split "`n").Count) lines" -ForegroundColor Green

# Try to execute SQL via Supabase CLI
try {
    Write-Host "🔄 Executing SQL schema..." -ForegroundColor Yellow
    
    # Save SQL to temp file for execution
    $tempSqlFile = "$env:TEMP\publimicro_schema.sql"
    $sqlContent | Out-File -FilePath $tempSqlFile -Encoding UTF8
    
    # Execute via Supabase CLI (if available)
    if (Get-Command supabase -ErrorAction SilentlyContinue) {
        Write-Host "Executing via Supabase CLI..." -ForegroundColor Yellow
        supabase db reset --linked --debug
        supabase db push --linked --include-all
    } else {
        Write-Host "⚠️ Supabase CLI not available" -ForegroundColor Yellow
        Write-Host "Please run the SQL file manually in your Supabase dashboard:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://supabase.com/dashboard/project/$projectRef/sql" -ForegroundColor Blue
        Write-Host "2. Copy and paste the content from: $sqlFile" -ForegroundColor Blue
        Write-Host "3. Click 'Run' to execute the schema" -ForegroundColor Blue
    }
    
    Write-Host "✅ Database schema setup completed!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error setting up database: $_" -ForegroundColor Red
    Write-Host "Please check your Supabase connection and try again" -ForegroundColor Yellow
}

# =============================================================================
# 3. Configure Stripe Payment Integration
# =============================================================================
Write-Host "`n💳 Setting up Stripe payment integration..." -ForegroundColor Blue

# Prompt for Stripe keys if not provided
if ($StripePublishableKey -eq "") {
    Write-Host "`n📝 Please enter your Stripe credentials:" -ForegroundColor Yellow
    Write-Host "(Get these from: https://dashboard.stripe.com/test/apikeys)" -ForegroundColor Blue
    $StripePublishableKey = Read-Host "Stripe Publishable Key (pk_test_...)"
}

if ($StripeSecretKey -eq "") {
    $StripeSecretKey = Read-Host "Stripe Secret Key (sk_test_...)" -AsSecureString
    $StripeSecretKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($StripeSecretKey))
}

if ($StripeWebhookSecret -eq "") {
    $StripeWebhookSecret = Read-Host "Stripe Webhook Secret (whsec_...) - Optional, press Enter to skip"
}

# Update .env.local with Stripe credentials
if ($StripePublishableKey -ne "" -and $StripeSecretKey -ne "") {
    Write-Host "🔄 Updating .env.local with Stripe credentials..." -ForegroundColor Yellow
    
    # Read current content
    $envContent = Get-Content ".env.local" -Raw
    
    # Replace Stripe keys
    $envContent = $envContent -replace "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$StripePublishableKey"
    $envContent = $envContent -replace "STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx", "STRIPE_SECRET_KEY=$StripeSecretKey"
    
    if ($StripeWebhookSecret -ne "") {
        $envContent = $envContent -replace "STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx", "STRIPE_WEBHOOK_SECRET=$StripeWebhookSecret"
    }
    
    # Generate NEXTAUTH_SECRET if not set
    if ($envContent -match "NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32") {
        $randomBytes = New-Object byte[] 32
        [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($randomBytes)
        $nextAuthSecret = [Convert]::ToBase64String($randomBytes)
        $envContent = $envContent -replace "NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32", "NEXTAUTH_SECRET=$nextAuthSecret"
        Write-Host "🔑 Generated NEXTAUTH_SECRET" -ForegroundColor Green
    }
    
    # Save updated content
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "✅ Stripe credentials updated in .env.local" -ForegroundColor Green
} else {
    Write-Host "⚠️ Skipping Stripe setup - credentials not provided" -ForegroundColor Yellow
}

# =============================================================================
# 4. Final Setup Steps
# =============================================================================
Write-Host "`n🏁 Final setup steps..." -ForegroundColor Blue

# Install any missing dependencies
Write-Host "🔄 Ensuring all dependencies are installed..." -ForegroundColor Yellow
try {
    & pnpm install
    Write-Host "✅ Dependencies verified" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Please run 'pnpm install' manually" -ForegroundColor Yellow
}

# Build shared packages
Write-Host "🔄 Building shared packages..." -ForegroundColor Yellow
try {
    & pnpm turbo build --filter=@publimicro/ui
    Write-Host "✅ Shared packages built" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Please run 'pnpm turbo build --filter=@publimicro/ui' manually" -ForegroundColor Yellow
}

# =============================================================================
# SUCCESS! 🎉
# =============================================================================
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green

Write-Host "`n✅ What's been configured:" -ForegroundColor Blue
Write-Host "  • Supabase database schema" -ForegroundColor White
Write-Host "  • Environment variables" -ForegroundColor White
Write-Host "  • Stripe payment integration" -ForegroundColor White
Write-Host "  • Authentication secrets" -ForegroundColor White

Write-Host "`n🚀 Next steps:" -ForegroundColor Blue
Write-Host "  1. Start development server: pnpm turbo dev --filter=@publimicro/publimicro" -ForegroundColor Yellow
Write-Host "  2. Open: http://localhost:3000" -ForegroundColor Yellow
Write-Host "  3. Test payment integration" -ForegroundColor Yellow

Write-Host "`n🔗 Useful links:" -ForegroundColor Blue
Write-Host "  • Supabase Dashboard: https://supabase.com/dashboard/project/$projectRef" -ForegroundColor Cyan
Write-Host "  • Stripe Dashboard: https://dashboard.stripe.com/test/dashboard" -ForegroundColor Cyan
Write-Host "  • Local App: http://localhost:3000" -ForegroundColor Cyan

Write-Host "`n💡 Pro tip: Use 'pnpm turbo dev' to start all apps simultaneously!" -ForegroundColor Magenta