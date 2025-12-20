# Media Audit & URL Reachability Checker 🔧

This guide explains how to run the media audit and reachability checks.

## Scripts

- `node scripts/audit-supabase-media.mjs`
  - Runs SQL checks (requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for service-role queries).

- `node scripts/check-media-urls.mjs [--from-db] [--from-file path] [--out path] [--concurrency N]`
  - `--from-db` will query the DB (`sitios`, `listing_videos`, `listing_photos`) and check collected URLs (requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`).
  - `--from-file path` reads a JSON array of objects (like `verify-uploads.results.json`) and checks `url` entries or `fotos` arrays.
  - `--out path` (default: `check-media-urls.results.json`) writes the detailed report.
  - `--concurrency N` sets concurrent HTTP checks (default 10).

## Examples

Check URLs found in `verify-uploads.results.json`:

  node scripts/check-media-urls.mjs --from-file verify-uploads.results.json --out verify-checks.json

Query DB and check URLs (requires service role key):

  NEXT_PUBLIC_SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... node scripts/check-media-urls.mjs --from-db --out db-checks.json


CI: GitHub Actions automation

A GitHub Actions workflow `media-audit.yml` has been added at `.github/workflows/media-audit.yml`. It runs daily (and on-demand) and executes:

- `node scripts/audit-supabase-media.mjs --out artifacts/audit.json --fail-on-findings`
- `node scripts/check-media-urls.mjs --from-db --out artifacts/check-media.json`

Required repository secrets (add in Settings → Secrets):

- `NEXT_PUBLIC_SUPABASE_URL` (required)
- `SUPABASE_SERVICE_ROLE_KEY` (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional but useful)
- `GITHUB_TOKEN` (provided by GitHub automatically for comments; no action needed)

The workflow uploads `artifacts/*` as build artifacts and fails when the audit finds records or the URL check has failed URLs. Adjust the schedule or failure policy as needed.



