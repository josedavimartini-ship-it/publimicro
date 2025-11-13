Seed & Uploader usage

Prerequisites
- Node.js installed (14+)
- Set environment variables: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

Corepack & pnpm version
------------------------

If you see an update like `10.20.0 → 10.22.0`, align your local pnpm version used by Corepack with the repo by running:

```powershell
corepack use pnpm@10.22.0
```

This repository records `packageManager: "pnpm@10.22.0"` in the top-level `package.json`. After switching, install dependencies and run the turbo build from the repo root:

```powershell
pnpm install
pnpm run build
```

The top-level `build` now runs `turbo run build` so builds use Turborepo for workspace orchestration (preferred).

Steps

1) Seed canonical Carcará sitios (creates/updates 6 rows and writes mapping):

PowerShell (pwsh):

```powershell
$env:SUPABASE_URL="https://<your-project>.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
node .\scripts\seed_carcara_properties.js
```

This will create `scripts/canonical-sitios-mapping.json` with slug -> id mapping.

2) Prepare local uploads
- Create `uploads/juriti` and `uploads/mergulhao` folders at the repo root.
- Place 11 images and 1 video in each folder. Filenames are preserved.

3) Upload media (uploads to `imagens-sitios` storage bucket and attach to DB)

```powershell
$env:SUPABASE_URL="https://<your-project>.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
node .\scripts\upload_media_for_properties.js
```

Notes
- The uploader detects whether your DB uses the `properties` table or the legacy `sitios` table and writes media accordingly.
- Do not commit or share your service role key. Use environment variables.
- If you need help creating the storage bucket `imagens-sitios`, run the bucket creation in Supabase UI or let me generate a SQL/CLI snippet.

Admin API notes (server-side)
- There is a server-side admin upload endpoint at `apps/publimicro/src/app/api/admin/property-media/route.ts`.
- It is protected by an `ADMIN_API_KEY` (must match the `x-admin-key` header) and accepts JSON payloads with `property_id`, `files` and optional `kmlFile`.
- Files must be provided as base64 strings and include `name`, `mime`, and `base64` fields. Example file object:

```json
{
	"name": "front.jpg",
	"mime": "image/jpeg",
	"base64": "<BASE64_PAYLOAD>"
}
```

- Server-side limits and validation:
	- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/heic`, `video/mp4`, `video/quicktime`, and KML (`application/vnd.google-earth.kml+xml`).
	- Default max file size: 50 MB (configurable via `ADMIN_MAX_UPLOAD_BYTES`).
	- Default max files per request: 20 (configurable via `ADMIN_MAX_UPLOAD_FILES`).
	- Filenames are sanitized before upload; audit entries include `x-admin-user` if provided.

Use the admin API from a trusted environment only (CI job, secure server-side script). Example PowerShell snippet (for small files only):

```powershell
$env:ADMIN_API_KEY = '<your-admin-key>'
$body = @{
	property_id = '2ab5c902-536d-4693-a255-2de307c54f3d'
	files = @(
		@{ name = 'front.jpg'; mime = 'image/jpeg'; base64 = (Get-Content -Encoding Byte -Path .\uploads\juriti\front.jpg -Raw | [System.Convert]::ToBase64String) }
	)
} | ConvertTo-Json -Depth 5

# Then POST to the Next.js API route using Invoke-RestMethod or a node/fetch call inside a secure environment.
```

Admin Upload UI (lightweight)
--------------------------------

There is a small browser admin upload page included in the monorepo for quick, manual uploads during staging or QA:

- Path: `apps/publimicro/src/app/admin/upload/page.tsx`
- Purpose: select a `property_id`, choose multiple image/video/KML files and upload them directly to the admin API.
- Notes:
	- The UI is intended for trusted users and requires the `x-admin-key` header (enter your `ADMIN_API_KEY` value in the UI form).
	- ZIP extraction is not performed in the browser; please use the CLI uploader if you need ZIP extraction or server-side processing.
	- For large videos, prefer local ffmpeg compression or upload externally and set `properties.video_url`.

Usage (quick): open `http://localhost:3000/admin/upload` during local development, fill `property_id` (UUID), paste your `ADMIN_API_KEY`, pick files and click Upload. Progress and results are shown in the UI.


Troubleshooting
- If the seed fails with PostgREST errors about missing columns, verify your DB schema with:

```sql
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'properties' ORDER BY ordinal_position;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sitios' ORDER BY ordinal_position;
```

- If `canonical-sitios-mapping.json` is missing after seeding, check console output for errors and ensure the service role key has permission to insert into the detected table.

ZIP support & large video notes
- You can place a single ZIP file inside `uploads/{slug}` (e.g. `uploads/juriti/juriti.zip`) and the uploader will extract it automatically before uploading. This requires the `adm-zip` package.
- If any file exceeds the configured `MAX_UPLOAD_SIZE_BYTES` (default 50 MB) the uploader will skip it and log a warning.
- For large videos consider one of:
	- Compress/transcode locally with `ffmpeg` and re-run the uploader.
	- Host large videos on YouTube/Vimeo/Cloudflare Stream and set the external URL in `properties.video_url` (the uploader can be adapted to accept an URLs file).
	- Implement server-side transcoding/chunked upload (requires additional infra/services).

Install the zip dependency (one-time):
```powershell
pnpm install adm-zip
```

Local video compression (ffmpeg)
- To compress large videos locally before upload, install `ffmpeg` on your machine and run the compression helper:

```powershell
# Compress the two property videos (creates uploads/{slug}/compressed/*)
node .\scripts\compress_videos.js --slugs=juriti,mergulhao

# Or compress all canonical sites
node .\scripts\compress_videos.js --all
```

The script requires `ffmpeg` in your PATH and will write `*_compressed.mp4` files in `uploads/{slug}/compressed`.

Set external video URLs (alternative to uploading large videos)
- If you prefer to host videos externally (YouTube, Vimeo, Cloudflare Stream) you can provide a small JSON mapping and set the `properties.video_url` column without uploading files:

1) Create `scripts/external-videos.json` with content like:

```json
{
	"juriti": "https://youtu.be/your_juriti_video",
	"mergulhao": "https://youtu.be/your_mergulhao_video"
}
```

2) Run:

```powershell
$env:SUPABASE_URL = 'https://<your-project>.supabase.co'
$env:SUPABASE_SERVICE_ROLE_KEY = '<your-service-role-key>'
node .\scripts\set_external_videos.js
```

This will update `properties.video_url` (or `sitios.video_url` for legacy tables) for the canonical slugs.
