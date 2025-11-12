# CI Smoke Test helpers

This folder contains helpers for running and installing the Stripe smoke test used by CI.

Files
- `smoke-stripe.js` - smoke test script that retrieves a Stripe price. Exits 0 when skipped (no secrets) or when successful. Exits 2 on error.
- `add-github-secrets.ps1` - PowerShell helper to set the repository secrets using the GitHub CLI (`gh`).

How to set repository secrets (recommended)

1) Create a restricted Stripe test key in the Stripe Dashboard (recommended):
   - In Stripe: Developers -> API keys -> Create restricted key
   - Give it the minimal read permissions required (Prices, Products)

2) Add secrets via GitHub UI
   - Go to your repo -> Settings -> Secrets and variables -> Actions -> New repository secret
   - Add `STRIPE_TEST_KEY` (value: the restricted sk_test_ key)
   - Add `SMOKE_STRIPE_PRICE_ID` (value: price_...)

3) Or add secrets using GitHub CLI (PowerShell)
   - Authenticate: `gh auth login`
   - Run the helper script in this folder (it will call `gh secret set`):

```powershell
# Option A: provide via environment variables then run the script
$env:STRIPE_TEST_KEY = 'sk_test_...'
$env:SMOKE_STRIPE_PRICE_ID = 'price_...'
.\add-github-secrets.ps1 -Repo 'owner/repo'

# Option B: pass as parameters directly
.\add-github-secrets.ps1 -Repo 'owner/repo' -StripeKey 'sk_test_...' -PriceId 'price_...'
```

Using a protected environment (recommended for manual gating)
- Create an Environment called `smoke-test` in repo Settings -> Environments.
- Add `STRIPE_TEST_KEY` and `SMOKE_STRIPE_PRICE_ID` as environment secrets in that Environment.
- Protect the environment with required reviewers if you want maintainers to approve runs.
- Use the manual workflow `Smoke Test (manual)` from Actions -> select "Run workflow" to trigger the smoke test under that environment.

Notes
- By default GitHub will not expose repository secrets to workflows triggered from forked repositories. That is safer.
- If you want the smoke test to run automatically for forks, consider using very restricted test keys or a manual dispatch workflow so maintainers can review code before running secrets.
