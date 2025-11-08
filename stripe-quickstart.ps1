# Quick Start - Stripe Webhook Testing
# Run this script to authenticate and get ready for testing

Write-Host "`n🚀 PubliMicro - Stripe Webhook Quick Start`n" -ForegroundColor Cyan

# Step 1: Authenticate
Write-Host "Step 1: Authenticating with Stripe..." -ForegroundColor Yellow
Write-Host "A browser window will open. Please sign in and authorize the CLI.`n" -ForegroundColor Gray

& "$env:USERPROFILE\stripe-cli\stripe.exe" login

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Authentication successful!`n" -ForegroundColor Green
} else {
    Write-Host "`n❌ Authentication failed. Please try again.`n" -ForegroundColor Red
    exit 1
}

# Step 2: Instructions
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "1. Start Next.js dev server (keep this window open):" -ForegroundColor Yellow
Write-Host "   pnpm dev:publimicro`n" -ForegroundColor White

Write-Host "2. Open a NEW PowerShell window and run:" -ForegroundColor Yellow
Write-Host "   & `"`$env:USERPROFILE\stripe-cli\stripe.exe`" listen --forward-to http://localhost:3000/api/webhooks/stripe-enhancements`n" -ForegroundColor White

Write-Host "3. When you see 'Ready! Your webhook signing secret is whsec_...':" -ForegroundColor Yellow
Write-Host "   • Copy that whsec_ secret" -ForegroundColor Gray
Write-Host "   • Replace STRIPE_WEBHOOK_SECRET in apps/publimicro/.env.local" -ForegroundColor Gray
Write-Host "   • Restart the Next.js dev server`n" -ForegroundColor Gray

Write-Host "4. Test with a sample event (in a third window):" -ForegroundColor Yellow
Write-Host "   & `"`$env:USERPROFILE\stripe-cli\stripe.exe`" trigger checkout.session.completed`n" -ForegroundColor White

Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "📖 Full documentation: STRIPE-CLI-SETUP-GUIDE.md" -ForegroundColor Cyan
Write-Host "🐛 Troubleshooting: See the guide for common issues`n" -ForegroundColor Cyan

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
