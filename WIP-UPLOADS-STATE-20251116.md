WIP: Uploads & Verification Snapshot
Date: 2025-11-16

Summary
- Work: Prepared local upload pipeline for OneDrive photo/video folders → process (unzip/transcode) → upload to Supabase + insert `property_photos` rows.
- Current status: Local uploads completed for a batch (Successes=39, Failures=0 at upload time). Verification run found 8 `property_photos` rows whose public URLs were not retrievable (HEAD/GET failed).

Important files created/modified
- scripts/upload-uploads-folder.ps1: patched to avoid duplicating slug in remote paths; switched uploader to HTTP PUT (upsert) for this project.
- scripts/verify-uploads.ps1: added robust ID parsing, GET fallback, saves samples to `tmp/verify-downloads`; now writes `verify-uploads.results.json`.
- verify-uploads.results.json: generated in repo root by last verification run (contains per-row status details).
- verify-uploads.found-variants.json: may be generated later if discovery finds timestamped variants.
- scripts/insert-photos-multiple.ps1: mapping and normalization patches (earlier in session).

Key runtime facts
- Supabase project: https://irrzpwzyqcubhhjeuakc.supabase.co
- Bucket used: `imagens-sitios`
- Service role key: expected in `$env:SUPABASE_SERVICE_ROLE_KEY` (was set and validated during this session).
- Upload method: PUT to `/storage/v1/object/<bucket>/<object>?upsert=true` (PUT worked; multipart POST was not available and returned 404).

Results (from verification)
- Uploads: 39 files uploaded successfully.
- Verification: 8 failed URLs (both HEAD and GET failed). Failed row ids (from `verify-uploads.results.json`):
  - 1385b2e9-f84c-4088-877a-62f3b5ba5355
  - 64aa0e58-8dd9-4965-8c62-40f92bfa774f
  - 3eda1d55-8089-49b1-a1ae-bce2ae56852f
  - c3ac817b-0410-471f-b550-68619f4712fb
  - 4f9909dd-b9c1-4bdc-9b28-c56b19eb2c94
  - d18e4fc1-1df8-42d9-864c-1f3f38011902
  - a7ea8af0-208b-4d61-b02f-6f7bbd2f4328
  - 452b912f-84ec-4feb-a3a8-aed26a0e2e53

What I saved in the repo
- `WIP-UPLOADS-STATE-20251116.md` (this file) — snapshot and next steps.
- `verify-uploads.results.json` (created by `scripts/verify-uploads.ps1`) — detailed per-row results and notes.

Suggested next steps (what to run when you return)
1) Inspect failures locally:
   - Open the results file: `Get-Content .\verify-uploads.results.json | ConvertFrom-Json | Where-Object { $_.status -eq 'error' -or $_.status -eq $null } | Format-Table -AutoSize`
2) Run the discovery script to look for timestamp-prefixed variants (non-destructive):
   - Copy/paste the `find-prefix-matches.ps1` snippet provided in the repo root and run it. This will try common numeric prefixes and save findings to `verify-uploads.found-variants.json` and print suggested SQL UPDATEs.
3) If variants are found, apply fixes (either run SQL updates or run the `upload-single-and-optional-insert.ps1` to re-upload corrected files). I can prepare and apply the updates if you want and provide the exact REST calls.
4) Re-run verification: `pwsh .\scripts\verify-uploads.ps1 -PropertyIds '<property-uuid>'` for affected properties.

How to resume quickly (copy-paste)
- Set service role key for the session (only if you need to run uploads or DB updates):

  $env:SUPABASE_SERVICE_ROLE_KEY = '<YOUR_SERVICE_ROLE_KEY_HERE>'

- Verify uploads for two example properties:

  pwsh -NoProfile -ExecutionPolicy Bypass .\scripts\verify-uploads.ps1 -PropertyIds '2ab5c902-536d-4693-a255-2de307c54f3d','883e906a-7f53-4e45-ad82-65754bcfaaab'

- Run discovery of timestamped variants (paste snippet `find-prefix-matches.ps1` into terminal and run it).

Notes and risks
- The service role key is powerful — do not commit it. Keep it in your environment and unset it when done.
- I did not modify any DB rows or perform any destructive actions without confirmation. All proposed DB updates are printed as SQL statements for review.

If you'd like me to apply safe DB updates or re-upload files tomorrow, tell me which approach you prefer and whether you want me to run the actions here (you would need to paste the service role key) or run them locally and paste outputs for review.

-- End of snapshot
