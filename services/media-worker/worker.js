#!/usr/bin/env node
/* eslint-disable no-console */
// Simple media worker scaffold.
// Usage (local):
// 1) Install deps: `cd services/media-worker && npm install`
// 2) Run: `node worker.js job.json`
// job.json example: {"bucket":"imagens-sitios-raw","key":"juriti/20251107_...jpg","targetBucket":"imagens-sitios-processed","projectUrl":"https://<supabase>.supabase.co","serviceRoleKey":"<key>"}

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg')
// Attempt to set ffmpeg binary path from common installers to avoid relying on system PATH
try {
  // prefer @ffmpeg-installer/ffmpeg, fallback to ffmpeg-static
  const ffInst = require('@ffmpeg-installer/ffmpeg')
  if (ffInst && ffInst.path) ffmpeg.setFfmpegPath(ffInst.path)
} catch (_e) {
  try {
    const ffStatic = require('ffmpeg-static')
    if (ffStatic) ffmpeg.setFfmpegPath(ffStatic)
  } catch (_e2) {
    console.warn('No embedded ffmpeg binary found; ensure ffmpeg is on PATH')
  }
}
const sharp = require('sharp')
const { Worker } = require('bullmq')
const IORedis = require('ioredis')

// Vision moderation config (optional)
const VISION_API_URL = process.env.VISION_API_URL || null
const VISION_API_KEY = process.env.VISION_API_KEY || null

async function moderateFile(localFile) {
  // If no moderation endpoint configured, return not flagged
  if (!VISION_API_URL) return { flagged: false, labels: [] }
  try {
    const b64 = fs.readFileSync(localFile, { encoding: 'base64' })
    const headers = {}
    if (VISION_API_KEY) headers['Authorization'] = `Bearer ${VISION_API_KEY}`
    const resp = await axios.post(VISION_API_URL, { filename: path.basename(localFile), content_base64: b64 }, { headers, timeout: 20000 })
    // Expect response shape { flagged: boolean, labels: [] }
    return resp.data || { flagged: false, labels: [] }
  } catch (e) {
    console.warn('Vision moderation failed:', e && e.message)
    return { flagged: false, labels: [] }
  }
}

// Configuration (env)
const REDIS_URL = process.env.REDIS_URL || null
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://irrzpwzyqcubhhjeuakc.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || null

// Load buckets config if present
let bucketsConfig = {}
try {
  const cfgPath = path.join(__dirname, '..', '..', 'config', 'media-buckets.json')
  if (fs.existsSync(cfgPath)) bucketsConfig = JSON.parse(fs.readFileSync(cfgPath, 'utf8'))
} catch (_e) { console.warn('Could not load media-buckets.json', (_e && _e.message) || String(_e)) }


async function uploadToSupabase(bucket, remotePath, localFile, contentType) {
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY required to upload')
  const escaped = encodeURIComponent(remotePath)
  const uri = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${bucket}/${escaped}?upsert=true`
  const stat = fs.statSync(localFile)
  const stream = fs.createReadStream(localFile)
  const headers = {
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Content-Type': contentType || 'application/octet-stream',
    'Content-Length': stat.size
  }
  const resp = await axios.put(uri, stream, { headers, maxContentLength: Infinity, maxBodyLength: Infinity })
  return resp
}

async function insertPropertyPhoto(propertyId, publicUrl, filename) {
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY required for DB insert')
  const base = SUPABASE_URL.replace(/\/$/, '')
  const headers = {
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }

  // Idempotency: check if a row for this exact URL already exists
  try {
    const q = `${base}/rest/v1/property_photos?url=eq.${encodeURIComponent(publicUrl)}`
    const exist = await axios.get(q, { headers })
    if (exist && Array.isArray(exist.data) && exist.data.length > 0) {
      // Non-error informational: only log in debug mode
      if (process.env.DEBUG === '1' || process.env.DEBUG === 'true') console.log('property_photos row already exists for', publicUrl)
      return exist.data
    }
  } catch (e) {
    console.warn('failed to check existing photo row', e && e.message)
  }

  const uri = `${base}/rest/v1/property_photos`
  const payload = [{ property_id: propertyId, url: publicUrl, thumbnail_url: null, caption: filename, display_order: 0, is_cover: false }]
  const resp = await axios.post(uri, payload, { headers })
  return resp.data
}

async function main() {
  // Accept either: a job file path argument, or run as a Redis consumer if REDIS_URL set.
  const tmpDir = path.join(__dirname, '.tmp')
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

  async function processJob(job) {
    const debug = process.env.DEBUG === '1' || process.env.DEBUG === 'true'
    const debugLog = (...args) => { if (debug) console.log(...args) }
    debugLog('Processing job:', job)
    const rawUrl = job.rawUrl
    const key = job.key
    const slug = job.slug || (key && key.split('/')[0]) || 'unknown'
    const propertyId = job.propertyId || job.property_id || null

    if (!rawUrl) {
      // Support local rawPath for scaffolded ingest server
      if (job.rawPath && fs.existsSync(job.rawPath)) {
        debugLog('Using local rawPath', job.rawPath)
        tmpFile = job.rawPath
      } else {
        throw new Error('Job must include rawUrl or rawPath')
      }
    } else {
      const tmpFile = path.join(tmpDir, `${Date.now()}-${path.basename(key || rawUrl)}`)
      debugLog('Downloading', rawUrl, '->', tmpFile)
      const resp = await axios.get(rawUrl, { responseType: 'stream', maxContentLength: Infinity, maxBodyLength: Infinity })
      await new Promise((resolve, reject) => {
        const w = fs.createWriteStream(tmpFile)
        resp.data.pipe(w)
        w.on('finish', resolve)
        w.on('error', reject)
      })
      job._tmpFile = tmpFile
    }

    const localFile = job._tmpFile || job.rawPath
    const ext = path.extname(localFile).toLowerCase()

    const uploadedUrls = []

    // If image -> create optimized webp + thumbnail, upload
    if (['.jpg', '.jpeg', '.png', '.webp', '.heic'].includes(ext)) {
      const outWebp = localFile + '.webp'
      const thumb = localFile + '.thumb.jpg'
      debugLog('Optimizing image ->', outWebp)
      await sharp(localFile).resize({ width: 1920 }).webp({ quality: 80 }).toFile(outWebp)
      await sharp(localFile).resize({ width: 400 }).jpeg({ quality: 70 }).toFile(thumb)
      // Upload derivatives to processed buckets
      const segment = job.segment || 'default'
      const segCfg = bucketsConfig[segment] || bucketsConfig['default'] || null
      const processedBucket = (segCfg && segCfg.buckets && segCfg.buckets.processed) || 'imagens-sitios-processed'
      const thumbsBucket = (segCfg && segCfg.buckets && segCfg.buckets.thumbs) || 'imagens-sitios-thumbs'
      const webpRemote = `${slug}/photos/${path.basename(localFile)}.webp`
      const thumbRemote = `${slug}/photos/${path.basename(thumb)}`
      await uploadToSupabase(processedBucket, webpRemote, outWebp, 'image/webp')
      await uploadToSupabase(thumbsBucket, thumbRemote, thumb, 'image/jpeg')
      uploadedUrls.push(`${SUPABASE_URL}/storage/v1/object/public/${processedBucket}/${encodeURIComponent(webpRemote)}`)
    }

    // If video -> transcode to mp4 H.264 and create poster, upload
    if (['.mp4', '.mov', '.mkv', '.avi', '.webm'].includes(ext)) {
      const outMp4 = localFile + '.processed.mp4'
      debugLog('Transcoding video ->', outMp4)
      await new Promise((resolve, reject) => {
        ffmpeg(localFile)
          .outputOptions(['-c:v libx264', '-preset medium', '-crf 23', '-c:a aac', '-b:a 128k', '-movflags +faststart'])
          .size('?x720')
          .on('end', resolve)
          .on('error', reject)
          .save(outMp4)
      })
      const poster = localFile + '.poster.jpg'
      await new Promise((resolve, reject) => {
        ffmpeg(outMp4).screenshots({ timestamps: ['5%'], filename: path.basename(poster), folder: path.dirname(poster), size: '1280x?' })
          .on('end', resolve).on('error', reject)
      })
      // Upload processed video and poster
      const segment = job.segment || 'default'
      const segCfg = bucketsConfig[segment] || bucketsConfig['default'] || null
      const processedBucket = (segCfg && segCfg.buckets && segCfg.buckets.processed) || 'imagens-sitios-processed'
      const thumbsBucket = (segCfg && segCfg.buckets && segCfg.buckets.thumbs) || 'imagens-sitios-thumbs'
      const remoteMp4 = `${slug}/compressed/${path.basename(outMp4)}`
      const remotePoster = `${slug}/photos/${path.basename(poster)}`
      await uploadToSupabase(processedBucket, remoteMp4, outMp4, 'video/mp4')
      await uploadToSupabase(thumbsBucket, remotePoster, poster, 'image/jpeg')
      uploadedUrls.push(`${SUPABASE_URL}/storage/v1/object/public/${processedBucket}/${encodeURIComponent(remoteMp4)}`)
    }

    // Optionally, insert DB row pointing to processed asset(s)
    if (propertyId && uploadedUrls.length > 0) {
      try {
        // Run moderation (if configured). If flagged, mark caption accordingly.
        let moderation = { flagged: false, labels: [] }
        try { moderation = await moderateFile(localFile) } catch (e) { console.warn('Moderation error', e && e.message) }

        const filename = path.basename(uploadedUrls[0])
        const caption = moderation.flagged ? `[FLAGGED] ${filename}` : filename
        const inserted = await insertPropertyPhoto(propertyId, uploadedUrls[0], caption)
          debugLog('Inserted property_photos row, result:', inserted, 'moderation:', moderation)
      } catch (err) { console.warn('DB insert failed:', err && err.message) }
    }

    // Cleanup temporary files produced by worker (but keep originals in archive if desired)
    if (job._tmpFile && fs.existsSync(job._tmpFile)) { try { fs.unlinkSync(job._tmpFile) } catch (e) {} }
    return { ok: true, uploaded: uploadedUrls }
  }

    // If REDIS_URL provided, run BullMQ worker consuming jobs from 'media-jobs' queue
    if (REDIS_URL) {
      if (process.env.DEBUG === '1' || process.env.DEBUG === 'true') console.log('Starting Redis-backed worker (BullMQ v5) using REDIS_URL')
      // Create ioredis client with options compatible with BullMQ v5
      const redisClient = new IORedis(REDIS_URL, { maxRetriesPerRequest: null })
      const { Queue } = require('bullmq')
      const poisonQueue = new Queue('media-poison', { connection: { url: REDIS_URL } })

      const concurrency = Number(process.env.WORKER_CONCURRENCY || 2)
      const worker = new Worker('media-jobs', async job => {
        return await processJob(job.data)
      }, { connection: redisClient, concurrency })

      // Worker lifecycle logs
      if (process.env.DEBUG === '1' || process.env.DEBUG === 'true') console.log('Worker started; awaiting jobs on queue "media-jobs"')
      worker.on('active', job => { if (process.env.DEBUG === '1' || process.env.DEBUG === 'true') console.log('Job active', job.id, job.name) })
      worker.on('completed', (job) => { if (process.env.DEBUG === '1' || process.env.DEBUG === 'true') console.log('Job completed', job.id) })
      worker.on('failed', async (job, err) => {
        try {
          console.error('Job failed', job.id, err && err.message)
          // If job has exhausted attempts, move to poison queue for manual inspection
          const attempts = (job.opts && job.opts.attempts) || 5
          if ((job.attemptsMade || 0) >= attempts) {
            console.warn('Job reached max attempts; moving to poison queue', job.id)
            await poisonQueue.add('poison', { job: job.data, failedReason: err && err.message, jobId: job.id }, { removeOnComplete: true })
          }
        } catch (e) { console.error('Error handling failed job', e && e.message) }
      })
      worker.on('error', err => console.error('Worker error', err))

      // Graceful shutdown
      const shutdown = async () => {
        if (process.env.DEBUG === '1' || process.env.DEBUG === 'true') console.log('Shutting down worker...')
        try { await worker.close() } catch (e) { console.warn('Error closing worker', e && e.message) }
        try { await redisClient.quit() } catch (e) { redisClient.disconnect() }
        process.exit(0)
      }
      process.on('SIGINT', shutdown)
      process.on('SIGTERM', shutdown)
      return
    }

  // Fallback: if job file path passed, process it
  const jobFile = process.argv[2]
  if (!jobFile) { console.error('Usage: node worker.js <job.json> or set REDIS_URL for queue mode'); process.exit(2) }
  const job = JSON.parse(fs.readFileSync(jobFile, 'utf8'))
  try {
    const res = await processJob(job)
    if (process.env.DEBUG === '1' || process.env.DEBUG === 'true') console.log('Job result:', res)
  } catch (err) {
    console.error('Processing failed:', err)
    process.exit(1)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
