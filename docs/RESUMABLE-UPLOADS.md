Resumable Uploads Guidance

This document outlines recommended approaches for resumable uploads for large files (videos, maps, large archives).

Options:

1) Tus (recommended)
- Protocol: https://tus.io
- Client: `tus-js-client` in browsers
- Advantages: resumable across network failures, handles concurrency, wide support
- Integration: run a tus server (node or go) or use managed providers; or implement server-side endpoint that exchanges tus upload URL with Supabase after upload completes.

2) Chunked PUT to your server
- Client: split file into chunks, upload each chunk with `Content-Range` headers, server assembles chunks into final file and uploads to Supabase
- Simpler to implement but requires server-side temporary storage and robust assembly logic

3) S3-style multipart upload
- Use S3-compatible APIs to create multipart upload, upload parts, complete multipart
- Supabase storage does not support multipart in the same manner; requires proxying or staging to S3-compatible storage

Quick example (tus-js-client) — client-side
```js
import * as tus from 'tus-js-client'
const file = input.files[0]
const upload = new tus.Upload(file, {
  endpoint: '/uploads/tus', // your server that implements tus or proxies to tus-server
  retryDelays: [0, 1000, 3000, 5000],
  metadata: { filename: file.name, filetype: file.type },
  onError: function(error) { console.error('Upload failed', error) },
  onProgress: function(bytesUploaded, bytesTotal) {
    const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
    console.log(bytesUploaded, bytesTotal, percentage+'%')
  },
  onSuccess: function() {
    console.log('Upload finished:', upload.url)
  }
})
upload.start()
```

Server-side you can proxy tus-server or implement an upload completion hook that returns the final remote path and triggers any processing jobs.

Notes:
- Use signed URL issuance for final storage writes where possible to avoid holding service-role keys.
- For quick wins, implement chunked uploads to the ingest server and assemble into a single file before uploading to Supabase.
- Always validate filetypes and sizes server-side and rate-limit uploads per-user.

