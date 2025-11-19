// Minimal media ingest server (express + multer)
// Usage (local):
// 1) cd services/media-ingest && npm install
// 2) SUPABASE_SERVICE_ROLE_KEY=... node server.js

const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const crypto = require('crypto')

// Multer v2: prefer explicit diskStorage to be explicit about filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const d = path.join(__dirname, '../.tmp_uploads')
    fs.mkdirSync(d, { recursive: true })
    cb(null, d)
  },
  filename: (req, file, cb) => {
    // keep original filename but prefix with timestamp to avoid collisions
    const name = `${Date.now()}-${file.originalname}`
    cb(null, name)
  }
})

const upload = multer({ storage })
const app = express()
const PORT = process.env.PORT || 4001

app.use(express.json())

// Load media buckets config (optional)
let bucketsConfig = {}
try {
  const cfgPath = path.join(__dirname, '..', '..', 'config', 'media-buckets.json')
  if (fs.existsSync(cfgPath)) bucketsConfig = JSON.parse(fs.readFileSync(cfgPath, 'utf8'))
} catch (e) { console.warn('Failed to load media-buckets.json', e.message) }

const SIGNED_DIR = path.join(__dirname, '..', '.tmp_signed')
fs.mkdirSync(SIGNED_DIR, { recursive: true })

// Optional Redis/BullMQ queue
const REDIS_URL = process.env.REDIS_URL || null
let mediaQueue = null
if (REDIS_URL) {
  try {
    const { Queue } = require('bullmq')
    // Mask password when logging
    function maskRedisUrl(u) {
      try {
        const url = new URL(u)
        if (url.password) url.password = '••••••'
        return url.toString()
      } catch (e) { return u }
    }

    // Use URL-style connection to be compatible with BullMQ v5
    // Provide sensible default job options for retries/backoff and retention
    mediaQueue = new Queue('media-jobs', {
      connection: { url: REDIS_URL },
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false
      }
    })
    console.log('Queue media-jobs configured using REDIS_URL ->', maskRedisUrl(REDIS_URL))
  } catch (e) { console.warn('Failed to initialize BullMQ queue', e && e.message) }
}

// Simple endpoint to accept a file and create a job JSON
app.post('/ingest', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    const slug = req.body.slug || 'unknown'
    if (!file) return res.status(400).json({ error: 'file required' })

    // In a production flow: upload to raw bucket with signed URL and enqueue job in queue/DB
    // For scaffold: move file into .tmp and emit a job JSON the worker can pick up
    const key = `${slug}/${file.originalname}`
    const dest = path.join(__dirname, '..', '.tmp', key.replace(/[\\/]/g, '_'))
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.renameSync(file.path, dest)

    const job = {
      key: key,
      rawPath: dest,
      // In production you should provide signedDownloadUrl and serviceRoleKey in job metadata
      rawUrl: null
    }

    if (mediaQueue) {
      try {
        const jobId = crypto.createHash('sha256').update(`${job.key}:${job.rawPath || ''}`).digest('hex')
        const qjob = await mediaQueue.add('ingest', job, { jobId })
        res.json({ ok: true, queued: true, jobId: qjob.id })
      } catch (e) {
        console.warn('Failed to enqueue ingest job', e && e.message)
        res.status(500).json({ error: 'failed to enqueue job' })
      }
    } else {
      const jobPath = path.join(__dirname, '..', '.tmp', `job-${Date.now()}.json`)
      fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), 'utf8')
      res.json({ ok: true, job: jobPath })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// POST /signed-url
// Body: { segment, slug, filename, contentType, expiresInSeconds?, sizeBytes? }
app.post('/signed-url', async (req, res) => {
  try {
    const { segment = 'default', slug = 'unknown', filename, contentType = 'application/octet-stream', expiresInSeconds = 3600, sizeBytes } = req.body || {}
    if (!filename) return res.status(400).json({ error: 'filename required' })

    const seg = bucketsConfig[segment] ? segment : 'default'
    const buckets = (bucketsConfig[seg] && bucketsConfig[seg].buckets) || bucketsConfig['default'].buckets
    // Determine target bucket and validate it exists in Supabase
    const targetBucket = buckets.raw
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://irrzpwzyqcubhhjeuakc.supabase.co'
    if (!SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'server misconfigured (missing SUPABASE_SERVICE_ROLE_KEY)' })

    // Check bucket existence via Supabase REST. If the bucket does not exist, return a clear error.
    try {
      const bucketUri = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/bucket/${encodeURIComponent(targetBucket)}`
      const headers = { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, apikey: SUPABASE_SERVICE_ROLE_KEY }
      await axios.get(bucketUri, { headers })
    } catch (be) {
      if (be && be.response && be.response.status === 404) {
        return res.status(400).json({ error: 'bucket not found', bucket: targetBucket })
      }
      console.warn('bucket validation error', be && be.message)
      return res.status(500).json({ error: 'bucket validation failed', detail: be && be.message })
    }

    // Build remote path (canonical): <slug>/raw/<filename>
    const remotePath = `${slug}/raw/${filename}`

    const id = crypto.randomBytes(12).toString('hex')
    const mapping = {
      id,
      segment: seg,
      bucket: buckets.raw,
      remotePath,
      contentType,
      sizeBytes: sizeBytes || null,
      expiresAt: Date.now() + (Number(expiresInSeconds) * 1000)
    }
    const mapFile = path.join(SIGNED_DIR, `${id}.json`)
    fs.writeFileSync(mapFile, JSON.stringify(mapping, null, 2), 'utf8')

    // Return a proxied upload URL (server will stream to Supabase)
    const uploadUrl = `/upload-proxy/${id}`
    res.json({ ok: true, uploadUrl, id, mapping: { bucket: mapping.bucket, remotePath: mapping.remotePath } })
  } catch (err) {
    console.error('signed-url error', err)
    res.status(500).json({ error: err.message })
  }
})

// PUT /upload-proxy/:id -> stream to Supabase Storage using service role key
app.put('/upload-proxy/:id', async (req, res) => {
  try {
    const id = req.params.id
    const mapFile = path.join(SIGNED_DIR, `${id}.json`)
    if (!fs.existsSync(mapFile)) return res.status(404).json({ error: 'upload token not found' })
    const mapping = JSON.parse(fs.readFileSync(mapFile, 'utf8'))
    if (Date.now() > mapping.expiresAt) return res.status(410).json({ error: 'upload token expired' })

    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://irrzpwzyqcubhhjeuakc.supabase.co'
    if (!SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'server misconfigured (missing SUPABASE_SERVICE_ROLE_KEY)' })

    const remoteEscaped = encodeURIComponent(mapping.remotePath)
    const uri = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${mapping.bucket}/${remoteEscaped}?upsert=true`

    // Stream request body to Supabase
    const headers = {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': req.headers['content-type'] || mapping.contentType || 'application/octet-stream'
    }

    try {
      const supResp = await axios.put(uri, req, { headers, maxContentLength: Infinity, maxBodyLength: Infinity, responseType: 'json' })
      const publicUrl = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${mapping.bucket}/${encodeURIComponent(mapping.remotePath)}`

      // Enqueue processing job when Redis queue is available
      const job = { key: mapping.remotePath, rawUrl: publicUrl, segment: mapping.segment, bucket: mapping.bucket }
      if (mediaQueue) {
          try {
            // Use deterministic jobId based on bucket+remotePath to make the enqueue idempotent
            const jobId = crypto.createHash('sha256').update(`${mapping.bucket}:${mapping.remotePath}`).digest('hex')
            await mediaQueue.add('proxy-upload', job, { jobId })
          } catch (e) { console.warn('Failed to enqueue proxy-upload job', e && e.message) }
        }

      res.json({ ok: true, publicUrl, status: supResp && supResp.status })
    } catch (err) {
      // Log full axios error for debugging: status, headers, body and stack
      try {
        if (err && err.response) {
          console.error('proxy upload failed: upstream status=', err.response.status)
          console.error('proxy upload failed: upstream data=', JSON.stringify(err.response.data))
          console.error('proxy upload failed: upstream headers=', JSON.stringify(err.response.headers))
        } else {
          console.error('proxy upload failed:', err && err.message)
        }
      } catch (logErr) {
        console.error('error while logging proxy upload error', logErr && logErr.message)
      }

      // If the upstream gave a response, forward its status and body to the client for local debugging.
      if (err && err.response && typeof err.response.status === 'number') {
        const upstreamBody = err.response.data || { message: 'no upstream body' }
        return res.status(err.response.status).json({ error: 'upload failed', detail: upstreamBody })
      }

      const detail = err && err.message
      res.status(500).json({ error: 'upload failed', detail })
    }

  } catch (err) {
    console.error('upload-proxy error', err)
    res.status(500).json({ error: err.message })
  }
})

// Health endpoint: checks server status and Redis connectivity (if configured)
app.get('/health', async (req, res) => {
  const result = { ok: true, service: 'media-ingest', redis: null }
  if (REDIS_URL) {
    try {
      const IORedis = require('ioredis')
      const rc = new IORedis(REDIS_URL, { maxRetriesPerRequest: null })
      const pong = await rc.ping()
      result.redis = pong
      try { await rc.quit() } catch (e) { rc.disconnect() }
    } catch (e) {
      result.redis = { error: String(e && e.message) }
      result.ok = false
    }
  }
  res.json(result)
})

app.listen(PORT, () => console.log(`Media ingest server listening on ${PORT}`))
