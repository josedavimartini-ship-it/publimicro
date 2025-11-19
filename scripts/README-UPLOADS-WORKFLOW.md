Uploads workflow (local)

1) Prepare Uploads directory
- Place files under `Uploads/<slug>/photos`, `Uploads/<slug>/videos`, or `Uploads/<slug>/compressed`.

2) Dry-run the uploader
```
pwsh ./scripts/upload-uploads-folder.ps1 -DryRun
```

3) Real run with DB insert (server-side key required)
```
$env:SUPABASE_SERVICE_ROLE_KEY = '<SERVICE_ROLE_KEY>'
pwsh ./scripts/upload-uploads-folder.ps1 -InsertDb
```

4) Worker processing (local scaffold)
- Install deps and run worker for a job file (scaffolded under `services/media-worker`):
```
cd services/media-worker
npm install
node worker.js ../.tmp/job-123.json
```

5) Ingest server (local testing)
```
cd services/media-ingest
npm install
node server.js
# then POST form-data file to http://localhost:4001/ingest (field name `file`, include `slug`)
```

6) Verification
```
pwsh ./scripts/verify-uploads.ps1 -PropertyIds '<comma-separated-uuids>'
```

Notes
- These are scaffolds; before production you should:
  - Use signed upload URLs for direct client uploads to `imagens-sitios-raw`.
  - Use a message broker or DB-backed queue for reliable job delivery.
  - Implement upload retry, resumable uploads, and moderation steps.
