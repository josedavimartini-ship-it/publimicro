**Admin ZIP Upload Workflow**

Overview:

- Admins prepare a ZIP containing files for a single property. Recommended layout: images and optionally one video file. Filenames should be ASCII-friendly; the server sanitizes filenames.
- Upload via Admin UI (`/admin/upload`) or CLI `admin-upload-cli` which posts to `/api/admin/property-media/zip`.

Server behavior:

- Extracts ZIP server-side and validates allowed extensions.
- Images are uploaded directly to Supabase Storage bucket `property-photos`.
- Videos are transcoded to MP4 (H.264, CRF 23), scaled to 720p max, a thumbnail is generated, and both are uploaded.
- DB rows are inserted into `property_photos` and an audit row into `property_media_audit`.

CLI example (PowerShell):

```pwsh
pwsh -NoProfile -Command "node ./apps/publimicro/scripts/admin-upload-cli.js ./path/to/carcara.zip PROPERTY_ID --admin-key $env:ADMIN_API_KEY --url http://localhost:3000/api/admin/property-media/zip"
```

Notes & idempotency:

- Uploaded filenames include timestamps and random suffixes to avoid collisions. Re-uploading the same ZIP will result in duplicate storage objects; run a cleanup SQL script if you need to dedupe DB entries.
- For large batches consider running the CLI on a machine with a native `ffmpeg` compiled with hardware acceleration.

Environment variables (production):

- `ADMIN_API_KEY` - required for the admin endpoint and CLI.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public config.
- `SUPABASE_SERVICE_ROLE_KEY` - required for server uploads and DB writes.

Troubleshooting:

- If uploads fail with storage errors, confirm the `property-photos` bucket exists and the service role key has storage permissions.
- If ffmpeg fails, check `@ffmpeg-installer/ffmpeg` path or install a system ffmpeg and set `FFMPEG_PATH` env to override.
