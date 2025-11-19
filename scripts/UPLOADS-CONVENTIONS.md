Uploads Conventions & Best Practices

Purpose
- Describe canonical storage paths, naming, retention, and post-upload verification workflow for `Uploads/` ingestion into Supabase storage and `property_photos` table.

Canonical storage layout
- Bucket: `imagens-sitios`
- Per-property prefix: `<slug>/`
- Canonical subfolders (recommended):
  - `photos/` : still images (jpg, jpeg, png, webp, heic, gif)
  - `videos/` : original videos (mp4, mov, mkv, etc.)
  - `compressed/` : processed / compressed video derivatives (mp4 H.264)
  - `photos/thumbnails/` : generated thumbnails or small derivatives
  - `maps/` : map files (geojson, kml, kmz)
  - `projects/` : project documents (pdf, dxf, zip)

Filename and encoding rules
- Use original filename when possible, but avoid collisions by adding a timestamp prefix during automated processing if needed: `<ts>-<original-filename>`.
- Always URL-encode object keys when constructing public URLs. Server-side helpers should use `Uri.EscapeDataString()` or equivalent.
- Avoid spaces and control characters; prefer `YYYYMMDD_HHMMSS` timestamps and underscores.

Upload workflow (recommended)
1. Client or operator places files under `Uploads/<slug>/...` locally (or uploads via admin UI).
2. A controlled uploader script (`scripts/upload-uploads-folder.ps1`) runs in DryRun first, then real run:
   - Applies canonical subfolder placement (photos/videos/compressed) automatically.
   - Uploads objects with `upsert=true`.
   - Optionally inserts `property_photos` rows after verifying property existence.
3. After successful insert, run verification (`scripts/verify-uploads.ps1`) to ensure public URLs are reachable.
4. On success, move local originals to an `archive/Uploads-processed/<slug>/` folder or to an offsite backup (S3, object storage) and keep for a retention period (30–90 days) before permanent deletion.

Should you delete `Uploads/` after upload?
- Do NOT immediately delete the `Uploads/` folder. Instead:
  - Move processed files to `archive/` and keep for 30–90 days (configurable).
  - Only permanently delete after automated verification and a grace period.
  - Keep a checksum (sha256) or manifest file for each run to allow re-ingestion troubleshooting.

Security & keys
- Never commit `SUPABASE_SERVICE_ROLE_KEY` or any secrets. Use environment variables in CI or local shells.
- Use the service role key only for server-side tasks (DB inserts, direct storage PUTs). Client uploads should use signed/temporary URLs or an authenticated server endpoint.

Processing pipeline recommendations
- Virus/Content scanning: run uploaded files through a scanning step (ClamAV, third-party API) before making them public.
- Image optimization: use `sharp` (Node) or `libvips` to generate optimized JPEG/WebP derivatives and thumbnails.
- Video compression: use `ffmpeg` in a worker to transcode to H.264 MP4 with sensible presets (see below).
- Queueing: offload CPU-bound tasks to a worker queue (BullMQ, RabbitMQ, or a serverless job queue) to avoid blocking web requests.

Video compression presets (example)
- Target container: MP4
- Codec: H.264 (libx264) for wide compatibility; AV1 for experimental/optional.
- CRF: 23 (good balance) — lower is higher quality.
- Tune: `film` or `fast` depending on quality/speed tradeoff.
- Example ffmpeg command:
  ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart output.mp4

Handling many file types
- Photos: jpg, jpeg, png, webp, heic (convert HEIC to JPEG/WebP for web delivery)
- Videos: mp4, mov, mkv, avi, webm (transcode to mp4 H.264)
- Maps: geojson, kml, kmz — store in `maps/` and index geometry metadata in DB
- Project files: pdf, dxf, dwg, zip — store in `projects/` and attach metadata
- Treat unrecognized or executable formats cautiously; scan and restrict public access until moderated.

Client-side capture (in-app camera)
- Web: use MediaDevices.getUserMedia() to capture photos/videos. For photos, create Blob and upload via FormData; for videos, record MediaRecorder chunks and upload as a single file or via resumable upload.
- Mobile: use native camera APIs or WebView bridge; allow direct upload to temporary server endpoint that enqueues processing.
- For large captures, use resumable uploads (Tus protocol or chunked uploads with server-side reassembly).

Moderation & UX
- Add a moderation queue for first-time uploads or high-risk content.
- Apply client-side preview and limits (max file size, dimensions, duration) with helpful error messages.

Operational notes
- Implement logging and an audit trail for bulk uploads and DB updates.
- Keep a manifest and checksums for each bulk run to allow rollbacks.
- Automate post-upload verification and notify operators on failures.

Commands (examples)
- Dry run planned uploads:
  pwsh ./scripts/upload-uploads-folder.ps1 -DryRun
- Real run with DB inserts (server env var set):
  $env:SUPABASE_SERVICE_ROLE_KEY = '<SERVICE_ROLE_KEY>'
  pwsh ./scripts/upload-uploads-folder.ps1 -InsertDb
- Run verification for properties:
  pwsh ./scripts/verify-uploads.ps1 -PropertyIds 'comma,separated,uuids'

Contact me if you want me to scaffold the worker that runs ffmpeg and image processing, or to add resumable upload support.
