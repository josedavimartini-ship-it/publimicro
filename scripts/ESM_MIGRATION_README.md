ESM Migration Plan (scripts/)
=================================

This branch contains a small, phased migration proof-of-concept for converting repo scripts to ESM.

Phase 1 (pilot):
- Add `scripts/logger.mjs` (ESM logger) while keeping `scripts/logger.cjs` for backward compatibility.
- Add `.mjs` pilot scripts that import `logger.mjs`:
  - `compute_kml_centroids.mjs`
  - `compress_videos.mjs`
  - `run-neighborhood-migration.mjs`

Notes:
- The original `.js` CommonJS scripts are left in place as a fallback.
- Next steps would convert more scripts to `.mjs` and, eventually, either set `"type":"module"` in `package.json` or adopt `.mjs` for all scripts.

How to run the pilot:
- Run the ESM script with Node (Node >= 18 recommended):
  ```pwsh
  node scripts/compute_kml_centroids.mjs
  node scripts/compress_videos.mjs --help
  node scripts/run-neighborhood-migration.mjs
  ```

If you'd like, the next PR can:
- Convert all scripts to `.mjs` and update imports.
- Update CI to use Node >= 18 and adjust any tooling that expects CommonJS.
