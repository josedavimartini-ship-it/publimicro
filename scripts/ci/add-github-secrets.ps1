<#
.SYNOPSIS
  Helper to add STRIPE_TEST_KEY and SMOKE_STRIPE_PRICE_ID to a GitHub repository using the GitHub CLI (`gh`).

.DESCRIPTION
  This script sets two repository secrets using `gh secret set`.
  It reads values from parameters or from environment variables. It requires
  that the GitHub CLI is installed and you are authenticated (gh auth login).

.PARAMETER Repo
  The repository to target in the form owner/repo. Defaults to the current repo
  if running inside a checked-out repository and `gh` can detect it.

.PARAMETER StripeKey
  The Stripe test secret key (sk_test_...).

.PARAMETER PriceId
  The Smoke test price id (price_...).

.EXAMPLE
  # Interactive via environment variables
  $env:STRIPE_TEST_KEY='sk_test_...'; $env:SMOKE_STRIPE_PRICE_ID='price_...'; .\add-github-secrets.ps1

.EXAMPLE
  .\add-github-secrets.ps1 -Repo 'josedavimartini-ship-it/publimicro' -StripeKey 'sk_test_...' -PriceId 'price_...'
#>

param(
  [string]$Repo = '',
  [string]$StripeKey = $env:STRIPE_TEST_KEY,
  [string]$PriceId = $env:SMOKE_STRIPE_PRICE_ID
)

function Fail($msg) {
  Write-Error $msg
  exit 1
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Fail "GitHub CLI 'gh' not found. Install it from https://cli.github.com/ and run 'gh auth login' first."
}

if (-not $Repo) {
  try {
    $repoInfo = gh repo view --json nameWithOwner -q .nameWithOwner 2>$null
    if ($repoInfo) { $Repo = $repoInfo }
  } catch {
    # ignore
  }
}

if (-not $Repo) {
  Fail "Repository not specified. Provide -Repo 'owner/repo' or run this inside a cloned repo where gh can detect it."
}

if (-not $StripeKey) {
  Fail "Stripe key not provided. Pass -StripeKey or set the STRIPE_TEST_KEY environment variable."
}

if (-not $PriceId) {
  Fail "Price id not provided. Pass -PriceId or set the SMOKE_STRIPE_PRICE_ID environment variable."
}

Write-Host "Setting secrets on repository: $Repo"

gh secret set STRIPE_TEST_KEY --body $StripeKey --repo $Repo
if ($LASTEXITCODE -ne 0) { Fail "Failed to set STRIPE_TEST_KEY" }

gh secret set SMOKE_STRIPE_PRICE_ID --body $PriceId --repo $Repo
if ($LASTEXITCODE -ne 0) { Fail "Failed to set SMOKE_STRIPE_PRICE_ID" }

Write-Host "Secrets set successfully. Verify in GitHub > Settings > Secrets and variables > Actions."
