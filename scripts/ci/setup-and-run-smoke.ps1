<#
setup-and-run-smoke.ps1

Interactive PowerShell helper to:
- list or create a Stripe Price for a given Product
- add STRIPE_TEST_KEY and SMOKE_STRIPE_PRICE_ID to GitHub Actions secrets (via gh)
- run the local smoke test to verify the configuration

Security notes:
- This script runs locally and DOES NOT store secrets in the repository.
- Do NOT paste secrets into chat. Enter them only when prompted by this script.
- Prefer restricted test keys for CI (not live/production keys).

Usage:
  Open PowerShell in the repo root and run:
    .\scripts\ci\setup-and-run-smoke.ps1

Requirements:
- node (in PATH)
- gh (GitHub CLI) authenticated and in PATH
- stripe npm package available in the repository (the monorepo has it in dependencies)

#>

param()

function Read-Secret($prompt) {
  Write-Host $prompt -NoNewline
  $s = Read-Host -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

function Run-Node($code, $envVars) {
  $psEnv = @{}
  if ($envVars) { foreach ($k in $envVars.Keys) { $psEnv[$k] = $envVars[$k] } }
  $startInfo = New-Object System.Diagnostics.ProcessStartInfo
  $startInfo.FileName = 'node'
  $startInfo.Arguments = "-e `"$code`""
  $startInfo.RedirectStandardOutput = $true
  $startInfo.RedirectStandardError = $true
  $startInfo.UseShellExecute = $false
  foreach ($k in $psEnv.Keys) { $startInfo.Environment[$k] = $psEnv[$k] }
  $p = New-Object System.Diagnostics.Process
  $p.StartInfo = $startInfo
  $p.Start() | Out-Null
  $out = $p.StandardOutput.ReadToEnd()
  $err = $p.StandardError.ReadToEnd()
  $p.WaitForExit()
  return @{ ExitCode = $p.ExitCode; Stdout = $out; Stderr = $err }
}

Write-Host "--- PubliMicro CI smoke setup helper ---"

# 1) Get Stripe test key
if (-not $env:STRIPE_TEST_KEY) {
  $stripeKey = Read-Secret "Enter your Stripe test/restricted key (will not echo): "
} else {
  $stripeKey = $env:STRIPE_TEST_KEY
  Write-Host "Using STRIPE_TEST_KEY from environment"
}

if (-not $stripeKey) { Write-Error "No Stripe key provided. Exiting."; exit 1 }

# 2) Ask for the Product ID (you already provided one earlier)
$productId = Read-Host "Enter the Product ID to use (for example prod_TNdoUZmpINlwFX)"
if (-not $productId) { Write-Error "No product id provided. Exiting."; exit 1 }

Write-Host "Listing existing prices for product: $productId"

$listCode = @"
const Stripe = require('stripe');
const s = Stripe(process.env.STRIPE_API_KEY);
(async()=>{
  const r = await s.prices.list({product: '$productId', limit: 100});
  console.log(JSON.stringify(r.data));
})();
"@

$res = Run-Node $listCode @{ STRIPE_API_KEY = $stripeKey }
if ($res.ExitCode -ne 0) {
  Write-Host "Stripe API call failed or returned an error."
  Write-Host "Stdout:`n$res.Stdout"
  Write-Host "Stderr:`n$res.Stderr"
  Write-Host "If your account is under review, open the Dashboard and create/copy a Price ID manually."
  $useManual = Read-Host "Do you want to open the Stripe Dashboard in your browser now? (y/N)"
  if ($useManual -match '^[yY]') { Start-Process 'https://dashboard.stripe.com/products' }
  Write-Host "Exiting due to Stripe API error."; exit 2
}

$prices = $null
try { $prices = ConvertFrom-Json $res.Stdout } catch { $prices = @() }

if ($prices.Count -eq 0) {
  Write-Host "No prices found for product $productId."
  $create = Read-Host "Create a new price for this product? (Y/n)"
  if ($create -match '^[nN]') {
    Write-Host "Please create a price in the Dashboard and then re-run this script. Exiting."; exit 0
  }
  $amount = Read-Host "Enter price amount in cents (example 1000 for USD 10.00)"
  if (-not [int]::TryParse($amount,[ref]0)) { Write-Error "Invalid amount"; exit 1 }

  $createCode = @"
const Stripe = require('stripe');
const s = Stripe(process.env.STRIPE_API_KEY);
(async()=>{
  const p = await s.prices.create({unit_amount: $amount, currency: 'usd', product: '$productId'});
  console.log(JSON.stringify({ id: p.id }));
})();
"@

  $cres = Run-Node $createCode @{ STRIPE_API_KEY = $stripeKey }
  if ($cres.ExitCode -ne 0) { Write-Host "Failed to create price:"; Write-Host $cres.Stdout; Write-Host $cres.Stderr; exit 2 }
  $created = ConvertFrom-Json $cres.Stdout
  $priceId = $created.id
  Write-Host "Created price id: $priceId"
} else {
  Write-Host "Found the following prices for product ${productId}:"
  $prices | ForEach-Object { Write-Host " - $($_.id)  |  unit_amount: $($_.unit_amount)  currency: $($_.currency)" }
  $priceId = Read-Host "Enter the Price ID you want to use from the list above (price_...):"
}

if (-not $priceId) { Write-Error "No Price ID selected. Exiting."; exit 1 }

Write-Host "Price ID selected: $priceId"

# 3) Ask whether to write secrets to GitHub
$doGh = Read-Host "Do you want to add STRIPE_TEST_KEY and SMOKE_STRIPE_PRICE_ID to GitHub repo secrets now? (Y/n)"
if ($doGh -match '^[nN]') { Write-Host "Skipping adding secrets to GitHub. You can add them manually later."; exit 0 }

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { Write-Error "gh CLI not found in PATH. Install and authenticate gh first."; exit 1 }

Write-Host "Adding secrets to repository josedavimartini-ship-it/publimicro"

# Use gh secret set; use the helper to avoid secrets appearing in history
Write-Host "Setting SMOKE_STRIPE_PRICE_ID..."
& gh secret set SMOKE_STRIPE_PRICE_ID --body $priceId --repo josedavimartini-ship-it/publimicro
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to set SMOKE_STRIPE_PRICE_ID"; exit 2 }

Write-Host "Setting STRIPE_TEST_KEY..."
# We will prompt the user to paste the secret so it doesn't appear in the command line history
$stripeToSet = Read-Secret "Paste the STRIPE_TEST_KEY now (will not echo): "
& gh secret set STRIPE_TEST_KEY --body $stripeToSet --repo josedavimartini-ship-it/publimicro
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to set STRIPE_TEST_KEY"; exit 2 }

Write-Host "Secrets set. Verifying..."
& gh secret list --repo josedavimartini-ship-it/publimicro

Write-Host "Running local smoke test now..."
$env:STRIPE_TEST_KEY = $stripeToSet
$env:SMOKE_STRIPE_PRICE_ID = $priceId
node .\scripts\ci\smoke-stripe.js

Write-Host "Done. If the smoke test succeeded, the CI smoke step should also pass when workflows run with these secrets.";
