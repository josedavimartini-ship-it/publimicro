# Stripe Migration Plan — PubliMicro

This document outlines the audit findings, migration steps, verification checklist, rollback strategy and runbook to safely move Stripe price changes into production.

## Summary
- Work completed in test account: `setup-stripe-products.js` created idempotent products/prices with FX support and rounding to whole BRL.
- New test-mode price IDs were generated and patched into the app code under `apps/publimicro/src/lib`.
- FX conversion uses `exchangerate.host` and respects `FX_API_KEY` (cached in `data/fx-cache.json` for 12h).

## Test Price IDs (created during test run)

### Enhancement prices
- items.highlight: `price_1SVAhzJtHEENVe7mhcUlf0rM` — R$ 8
- items.organic_marketing: `price_1SVAcCJtHEENVe7miMNkPrja` — R$ 49
- items.bundle: `price_1SVAi1JtHEENVe7mu9eOlSHj` — R$ 53
- vehicles.highlight: `price_1SVAcHJtHEENVe7mlOLZJ2vd` — R$ 14
- vehicles.organic_marketing: `price_1SVAcJJtHEENVe7mVL0KbOXa` — R$ 84
- vehicles.bundle: `price_1SVAcKJtHEENVe7mADY3MPUB` — R$ 91
- properties.highlight: `price_1SVAcMJtHEENVe7mUh3nvjSn` — R$ 21
- properties.organic_marketing: `price_1SVAcNJtHEENVe7m0cn3ZLd8` — R$ 126
- properties.bundle: `price_1SVAiAJtHEENVe7mcSmpJtCS` — R$ 137

### Subscription prices
- premium: `price_1SVAiBJtHEENVe7mEYMVprtW` — R$ 7/month
- pro: `price_1SVAiCJtHEENVe7mzCtb8qY8` — R$ 70/month

> Note: All amounts are whole BRL (no cents) as requested.

## Audit findings (summary)
- `setup-stripe-products.js` now:
  - Is idempotent: re-uses products/prices by name/amount when present.
  - Supports competitor minima in foreign currencies via `exchangerate.host` and caches results.
  - Rounds final prices to whole BRL (nearest R$1).
  - Has a local-package fallback for `@publimicro/stripe` so it can run without workspace linking.
- `verify-stripe-prices.js` updated to warn about prices that include cents and to display rounded amounts.
- `data/competitor_min_prices.json` was fixed to be valid JSON; still contains partial public minima and notes on sources requiring manual contact.

## Migration strategy (test → live)
1. **Review & approval**
   - Manual review of all generated price IDs and amounts by product owner.
   - Confirm free-ads policy and subscription limits are implemented separately in DB logic (see runbook below).

2. **Preflight in staging**
   - Run the full script in a staging Stripe account (use `sk_test_...` staging key) and verify product/price IDs.
   - Run `verify-stripe-prices.js` against staging to ensure prices are one-time/recurring as expected.

3. **Backup live config**
   - Export current price/product IDs from live Stripe (CSV via Stripe Dashboard or API) and store in a safe location.
   - Snapshot current `apps/*/src/lib/*Pricing.ts` files (they are in the repo; create a `stripe-backup/` folder to hold current values).

4. **Dry run (no-op)**
   - Add an environment flag `DRY_RUN=1` to `setup-stripe-products.js` to print what would change without creating resources. (Optional — recommended before production run.)

5. **Run in production (careful)**
   - Set `STRIPE_SECRET_KEY=sk_live_...` for the live account only after step 1–4 completed and approved.
   - Run `node setup-stripe-products.js`.
   - The script will reuse existing products/prices when amounts match; it will create new ones when amounts differ.

6. **Post-run verification**
   - Run `verify-stripe-prices.js` against live keys to ensure pricing kinds are correct (one-time vs recurring) and amounts are rounded.
   - Validate purchases flow in a controlled test (if possible with connected test cards) or use Stripe's test mode webhooks simulation where available.

7. **Code update**
   - After confirming live price IDs, update production code (`apps/.../pricing.ts`) with the live price IDs and deploy.
   - Prefer a canary rollout where only a percentage of traffic uses the new prices initially.

8. **Monitoring & rollback**
   - Monitor revenue, checkout errors, and webhook failures for 24–72 hours.
   - Rollback plan: re-run `setup-stripe-products.js` with previous price IDs inserted into the code, or restore from `stripe-backup/` snapshot.

## Verification checklist
- [ ] All generated price IDs validated in Stripe Dashboard
- [ ] Prices are the expected amount and currency (BRL), and are one-time vs recurring as intended
- [ ] Webhook handler tested (signature verification and idempotency)
- [ ] Checkout flow tested for at least one price ID for each type (enhancement + subscription)
- [ ] Logging/alerts configured for webhook failures and payment errors
- [ ] DB counters for free-ads and subscription enforcement in place (see recommendations below)

## DB/Server recommendations (short)
- Add `users.free_ads_quota` (integer) with default 2 for new users; decrement on each promoted ad creation and record event in `ad_events` table.
- Add `users.active_subscription_id` (nullable) and enforce via server-side checks that only one active subscription per user is allowed. Use Stripe webhooks (`customer.subscription.created`, `customer.subscription.deleted`, `invoice.payment_failed`) to keep DB in sync.
- Store `stripe.price_id` references in `enhancements` and `subscriptions` tables for traceability.

## Runbook — exact commands (PowerShell)
- Test run (with FX key):
```powershell
$Env:FX_API_KEY='YOUR_FX_KEY'
$Env:STRIPE_SECRET_KEY='sk_test_...'
node .\setup-stripe-products.js
```

- Verify prices:
```powershell
$Env:STRIPE_SECRET_KEY='sk_test_...'
node .\verify-stripe-prices.js
```

- Suggested DRY-RUN addition (local):
  - Run with `DRY_RUN=1` set; the script can be patched to check `process.env.DRY_RUN` and skip API calls while printing the intended changes.

## Risks & mitigations
- **Accidental live creation:** Always verify `STRIPE_SECRET_KEY` value before running in production. Use least-privilege keys where feasible.
- **Incompatible price kinds:** Verify recurring vs one-time — creating an incorrect kind will break checkout flows. `verify-stripe-prices.js` helps detect this.
- **Price duplication:** The script attempts to reuse existing prices by amount/product; still, minor rounding or metadata differences could cause duplicates. Review generated items before code update.

## Next actions I can take for you
- Commit and push these changes to `chore/remove-cjs-scripts` branch (I will stage and commit now).
- Extend `setup-stripe-products.js` with `DRY_RUN` support and a `--verify-only` mode.
- Continue collecting competitor minima (I will try more sites and add entries to `data/competitor_min_prices.json`).
- Implement DB migration SQL & server checks for free-ads quota and single-subscription enforcement.

---

If you approve, I will commit these changes and continue with the next items (I will also add a `DRY_RUN` flag to the script before any live-run, unless you prefer otherwise).