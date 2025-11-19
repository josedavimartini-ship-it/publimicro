# Media Architecture (segments, buckets, worker, queue)

This document describes the media ingestion and processing architecture used by the project. It focuses on segmentation (different listing sections), bucket layout, and recommended production practices.

Segments and buckets
- Each major segment (e.g. `acheme-rural-propers`, `acheme-urban-propers`, `findme-marine`, `findme-things`, `findme-motors`, etc.) has a set of buckets defined in `config/media-buckets.json`:
  - `raw`: private raw uploads (originals)
  - `processed`: processed, web-optimized assets (public)
  - `thumbs`: smaller thumbnails (public)
  - `compressed`: intermediate compressed video assets
  - `videos`: if you prefer a dedicated videos bucket

Flow
1. Client requests a short-lived upload token via `/signed-url` with `segment`, `slug`, and `filename`.
2. Server returns a proxied upload URL (`/upload-proxy/:id`) which validates expiry and streams to Supabase Storage (current scaffold) or returns a true Supabase signed PUT URL (recommended improvement).
3. Ingest server creates a job record (file-backed or enqueued into Redis/BullMQ) containing `segment`, `slug`, `rawPath`/`rawUrl`, and optional `propertyId` to be associated with DB rows.
4. Worker consumes jobs (BullMQ worker preferred for production), downloads raw if needed, runs `sharp` (images) or `ffmpeg` (videos), writes derivatives to `processed`/`thumbs` buckets, and optionally inserts `property_photos` rows via PostgREST using a service role key or an internal API.
5. Worker marks job complete and optionally archives originals to a long-term `archive` bucket or lifecycle policy.

Security & least privilege
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to clients. Use server-side creation of signed PUT URLs or short-lived tokens.
- For production, create a dedicated microservice that mints signed URLs and records uploads for audit.

Queueing
- Local dev: file-backed `.tmp` jobs (scaffold).
- Production: Redis + BullMQ. Implement retries, exponential backoff, and poison-queue handling. Add metrics and logging for job duration and error rates.

Operational suggestions
- Add virus scanning and content moderation to the worker pipeline before making assets public.
- Use bucket-level lifecycle rules to move raw originals to cold storage after N days.
- Rotate service role keys periodically and use IAM where available.

Per-segment rules
- See `config/media-buckets.json` for suggested defaults (max photos, videos, and size limits). Adapt rules per segment based on UX and storage cost.
**Media Architecture (Summary)**

This document summarizes the media ingestion and processing architecture used by the project.

- **Goals:**
  - Safe, auditable ingestion of user media (images & video).
  - Least-privilege upload flow (signed URLs) with a processing worker to generate derivatives.
  - Segment-aware buckets to support multiple product lines (AcheMe / FindMe variants).

**Buckets & Segmentation**
- Each segment has dedicated buckets (recommended):
  - `<segment>-raw` (private): raw uploads, archived originals
  - `<segment>-processed` (public): optimized images & compressed videos
  - `<segment>-thumbs` (public): thumbnails & low-res previews
  - `<segment>-compressed` (private or public per policy): compressed versions
  - `<segment>-videos` (public or private): large video variants
- A global fallback `imagens-default-*` set is used when segment is unknown.

**Segments (examples)**
- `acheme-rural-propers`, `acheme-urban-propers`
- `findme-marine`, `findme-machina`, `findme-jour` (travel & rentals)
- `findme-things` (marketplace / general items)
- `findme-motors` with subsegments `findme-autos`, `findme-motos`, `findme-cargo`

Each segment includes rules (max photos, max videos, per-file limits, allowed mimes) stored in `config/media-buckets.json`.

**Ingest Flow (recommended production)**
1. Client requests signed upload URL for a target segment and filename from a signing service (no service-role key on client).
2. Signing service validates request against segment rules, mints a short-lived signed PUT URL (or a token mapped server-side), returns URL to client.
3. Client uploads directly to storage using the signed URL. Storage returns success.
4. Client notifies ingest API (optional) with object path and listing metadata; ingest API enqueues a processing job (Redis + BullMQ recommended).
5. Worker consumes job, validates content (virus scanning, hash verification), generates derivatives (webp, thumbnails, mp4 H.264), uploads derivatives to processed/thumb buckets (prefer signed-URL uploads), updates DB (`property_photos`) and records checksums/manifest.
6. Worker archives raw original to cold storage or leaves in raw bucket depending on retention policy.

**Current Scaffold Implementation**
- `services/media-ingest/server.js` provides:
  - `/signed-url` (mapping token) and `/upload-proxy/:id` which currently proxies uploads to Supabase using a service role key (scaffold-only).
  - `/ingest` endpoint for quick local testing (saves raw file to `.tmp` and creates `job-*.json`).
- `services/media-worker/worker.js`:
  - Supports file-backed jobs (local `.tmp`) and Redis/BullMQ consumer when `REDIS_URL` is set.
  - Uses `fluent-ffmpeg` + `sharp` to transcode and create derivatives.
  - Reads `config/media-buckets.json` to choose target processed/thumb buckets per job `segment`.

**Queue & Reliability**
- Use Redis + BullMQ for production job handling. Configure:
  - retries (exponential backoff),
  - job timeouts,
  - dead-letter / poison queue for failures requiring manual inspection.

**Security & Secrets**
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to clients. Keep it in a secure server-side signing service (rotated regularly).
- Prefer server-generated signed URLs returned to clients. If using a proxy, keep proxy service minimal and short-lived mappings.

**Operational Notes**
- Monitor worker queue depth and job failure rate.
- Track storage usage per segment and set lifecycle policies for `raw` buckets (move to cold archive after N days).
- Add content-moderation and virus scanning step before making assets public.
**Media Architecture & Buckets (High-Level)**

Purpose: define a robust media ingestion, processing, and delivery architecture optimized for reliability, good UX, and rapid onboarding of advertisers and property owners.

Buckets and Access Policy (Supabase Storage)
- `imagens-sitios-raw` (private): store original uploads as received. Private to prevent immediate public access until scanning/processing completes.
- `imagens-sitios-processed` (public): processed derivatives optimized for web delivery (images, compressed mp4, thumbnails). Public read for site delivery.
- `imagens-sitios-thumbs` (public): small thumbnails and posters for UI cards.
- `imagens-sitios-maps` (private/public configurable): map files (geojson, kml). Can be public for reuse or private until processed.
- `imagens-sitios-projects` (private): large project files, CAD, PDFs, zips.

Rationale
- Keep originals private to allow scanning, moderation, and reprocessing without exposing potentially unsafe content.
- Serve only processed, optimized assets publicly for performance and consistent URLs.

High-level Flow
1. Client requests an upload token (short-lived signed URL) for `imagens-sitios-raw` or uploads through authenticated server endpoint.
2. Client uploads directly to `imagens-sitios-raw` (or posts to server endpoint which stores raw object). Server enqueues a processing job (message queue / DB table).
3. Worker picks up job: downloads raw object, runs virus scan, image optimization (sharp/libvips), video transcode (ffmpeg) to H.264 MP4, generate thumbnails/posters, extract metadata (dimensions, duration), compute checksum.
4. Worker uploads derivatives to `imagens-sitios-processed` and thumbnails to `imagens-sitios-thumbs`, then updates the database (e.g., `property_photos`, `media` table) with final public URLs.
5. Post-processing verification ensures objects are reachable; system notifies user and optionally queues moderation.

Worker & Queue Options
- Minimal: worker polls a Postgres `media_jobs` table (PostgREST or direct DB). Good for small scale.
- Scalable: use a message broker (Redis + BullMQ, RabbitMQ, or SQS). Workers scale horizontally.

Security & Moderation
- Scan all raw files with antivirus and basic content heuristics.
- Restrict immediate public access. Only mark public after processing and moderation check (policy toggle).

UX Considerations
- Client-side capture (web/native): capture and upload via signed URL, show progress, allow lightweight client-side image compression before upload.
- Show placeholder/processing state in UI while assets are processed.
- Provide retry and resumable uploads for large videos (Tus or chunked PUT).

Performance
- Use CDNs (Supabase + CDN or proxy in front of storage) for delivery.
- Keep multiple resolutions for video and serve appropriate bitrate via responsive player.

Operational
- Keep manifests and checksums for every upload.
- Retention: keep raw files for 30–90 days, then move to cold storage or delete, depending on legal needs.

Next: See `services/` scaffolds for a worker and an ingest endpoint with run instructions.
