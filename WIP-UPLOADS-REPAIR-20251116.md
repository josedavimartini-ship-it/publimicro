WIP: Uploads Repair — 2025-11-16

Summary
- Objective: Fix `property_photos` rows that referenced non-retrievable storage objects by finding existing storage variants (encoded paths / compressed folder / timestamp-prefix) and updating `url` fields.
- Scope: Two properties involved: `2ab5c902-536d-4693-a255-2de307c54f3d` (juriti) and `883e906a-7f53-4e45-ad82-65754bcfaaab` (mergulhao).

What I did
- Scanned `verify-uploads.results.json` to locate successful storage object URLs that matched failing original filenames.
- Generated suggested updates:
  - Files written: `tmp/tmp/repair-suggested-updates.json`, `tmp/tmp/repair-suggested-updates.sql`, `tmp/tmp/repair-suggested-updates-curl.txt`.
- Added `tmp/apply-repair-updates.ps1` to test/apply PostgREST `PATCH` updates safely using `SUPABASE_SERVICE_ROLE_KEY`.
- Performed a test PATCH for id `1385b2e9-...` (succeeded).
- You ran `pwsh ./tmp/apply-repair-updates.ps1 -ApplyAll` to apply all suggested updates.
- Re-ran verification with `scripts/verify-uploads.ps1` for both properties — all checked URLs are reachable.

Artifacts created/modified
- Scripts:
  - `tmp/generate-repair-suggestions.ps1` — generates suggested mappings.
  - `tmp/apply-repair-updates.ps1` — test/apply helper for PostgREST PATCH.
- Outputs:
  - `tmp/tmp/repair-suggested-updates.json`
  - `tmp/tmp/repair-suggested-updates.sql`
  - `tmp/tmp/repair-suggested-updates-curl.txt`
  - `tmp/tmp/repair-applied-results.json` (per-id Patch responses)
  - `tmp/tmp/repair-applied-log.sql` (applied UPDATE statements)
  - `verify-uploads.results.json` (latest verification run)

Results
- All 8 originally failing `property_photos` rows were updated to existing, retrievable storage URLs (see `tmp/tmp/repair-applied-log.sql`).
- `scripts/verify-uploads.ps1` reports: "All checked URLs are reachable (HEAD or GET succeeded)."

Recommendations / next steps
- Decide canonical storage path policy (keep timestamp prefixes or canonical filenames). I recommend standardizing on a single folder layout (e.g., `<slug>/photos/...` and `<slug>/compressed/...`) to avoid future mismatches.
- Add normalization to uploader to always use chosen folder structure and URL-encoding rules.
- Consider adding a small CI check or GitHub Action that runs a quick verification of `property_photos` URLs after bulk uploads.

If you want me to:
- Revert any specific row(s) or roll back changes (I can produce SQL `ROLLBACK` candidates based on `tmp/tmp/repair-applied-log.sql`).
- Open a PR with the helper scripts and README additions.
- Implement canonicalization in `scripts/upload-uploads-folder.ps1` to prevent this in future.

-- End of repair snapshot
