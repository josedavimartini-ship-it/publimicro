Stripe Scripts Audit — 2025-11-19

Summary:
- `setup-stripe-products.js` is idempotent, supports `--dry-run`, FX conversion via exchangerate.host, and rounds target prices to whole BRL. Good.
- `verify-stripe-prices.js` performs targeted checks but is limited: it uses a hard-coded list of price IDs and doesn't load the code's current `STRIPE_PRICE_IDS` values.
- `packages/stripe` local fallback mechanism is in place (good for monorepo dev), but tests should verify both resolution ways.

Findings & Risks:
- Some legacy price IDs remain in built artifacts and in some source mappings. `docs/stripe-price-mapping.json` contains best-effort mapping but requires verification against live Stripe before any production cutover.
- `setup-stripe-products.js` uses `EXCHANGE_RATE` via `exchangerate.host`. The script writes an FX cache at `data/fx-cache.json`; ensure sensitive keys are not checked in and set TTL appropriately (12h currently).
- The `--dry-run` output is used to patch code. DRY-RUN price IDs (e.g., `dryprice_prod_*`) are not Stripe objects and must not be deployed to production.

Recommendations (high priority):
1. Make `verify-stripe-prices.js` load price IDs dynamically:
   - Support reading `docs/stripe-price-mapping.json` or the compiled code file that exports `STRIPE_PRICE_IDS`/`SUBSCRIPTION_PRICE_IDS`.
   - Add CLI flags: `--file <json>` to verify arbitrary mapping files, `--all` to verify all IDs found in mapping.
2. Add a strict verification mode for migrations:
   - A `verify-mapping.js` script that lists live prices for each `old` ID and confirms the `new` price exists and amount/currency/recurrence match expectations.
   - Provide a `--approve` flag to allow creating missing live prices (requires explicit `STRIPE_SECRET_KEY` with live secret and an extra interactive confirmation step).
3. Protect production execution:
   - Require `--force-live` plus `CONFIRM=Y` env var for any script that writes to a live Stripe account.
   - Log all created product/price IDs into `docs/stripe-price-mapping.json` with `created_at` and `by` fields.
4. Improve FX resilience:
   - Add retry/backoff and fallback to last cached rate when exchangerate.host is temporarily unreachable.
   - Emit clear warnings when conversion fails and fall back to base product price rather than failing.
5. Tests & CI:
   - Add unit tests for `asyncComputeTargetPrice()` and `convertToBRLCents()` mocking `getFxRate()`.
   - Add an integration test that runs `setup-stripe-products.js --dry-run` and asserts the generated mapping includes expected keys.

Suggested Quick Patches:
- `verify-stripe-prices.js`:
  - Add CLI parsing (minimist) and `--file` support.
  - If file points to `docs/stripe-price-mapping.json`, iterate its `mappings` array and verify each `new` and `old` price id.
- `setup-stripe-products.js`:
  - Write the mapping result to `docs/stripe-price-mapping.json` (or update it) even in `--dry-run` mode (mark entries as `dry_run: true`).

Next Steps I can take now:
- Implement the `verify-mapping.js` script that verifies live price metadata for each mapping entry (read-only by default). Requires a live key to fully verify.
- Improve `verify-stripe-prices.js` to accept `--file` and `--all` flags and to load mappings automatically.

If you'd like, I will implement the verification script next and wire it into the todo workflow (it will be read-only unless you explicitly approve a live write with `--force-live`).
