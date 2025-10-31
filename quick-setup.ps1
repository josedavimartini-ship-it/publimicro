# PubliMicro Database & Payment Setup Script
# Run this script from the project root directory

Write-Host "PubliMicro Database & Payment Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path ".env.local")) {
    Write-Host "Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

# Read environment file
$envContent = Get-Content ".env.local" -Raw

# Check for Supabase URL
if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL=https://([^.]+)\.supabase\.co") {
    $projectRef = $matches[1]
    Write-Host "Found Supabase project: $projectRef" -ForegroundColor Green
} else {
    Write-Host "Supabase URL not configured in .env.local" -ForegroundColor Red
    exit 1
}

# Database setup instructions
Write-Host "`nDatabase Setup Required:" -ForegroundColor Blue
Write-Host "1. Go to your Supabase dashboard:" -ForegroundColor Yellow
Write-Host "   https://supabase.com/dashboard/project/$projectRef/sql" -ForegroundColor Cyan
Write-Host "2. Copy the content from: apps\publimicro\supabase_tables.sql" -ForegroundColor Yellow
Write-Host "3. Paste and run the SQL in your Supabase SQL editor" -ForegroundColor Yellow

# Stripe setup
Write-Host "`nStripe Payment Setup:" -ForegroundColor Blue
Write-Host "Please enter your Stripe test credentials:" -ForegroundColor Yellow
Write-Host "(Get these from: https://dashboard.stripe.com/test/apikeys)" -ForegroundColor Cyan

$publishableKey = Read-Host "Stripe Publishable Key (pk_test_...)"
$secretKey = Read-Host "Stripe Secret Key (sk_test_...)"

if ($publishableKey -and $secretKey) {
    # Update .env.local
    $envContent = $envContent -replace "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$publishableKey"
    $envContent = $envContent -replace "STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx", "STRIPE_SECRET_KEY=$secretKey"
    
    # Generate NEXTAUTH_SECRET
    $randomBytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($randomBytes)
    $nextAuthSecret = [Convert]::ToBase64String($randomBytes)
    $envContent = $envContent -replace "NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32", "NEXTAUTH_SECRET=$nextAuthSecret"
    
    # Save file
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "Environment updated successfully!" -ForegroundColor Green
}

# Build and test
Write-Host "`nBuilding shared packages..." -ForegroundColor Blue
& pnpm turbo build --filter=@publimicro/ui

Write-Host "`nSetup completed! Next steps:" -ForegroundColor Green
Write-Host "1. Complete the database setup in Supabase dashboard" -ForegroundColor Yellow
Write-Host "2. Run: pnpm turbo dev --filter=@publimicro/publimicro" -ForegroundColor Yellow
Write-Host "3. Open: http://localhost:3000" -ForegroundColor Yellow