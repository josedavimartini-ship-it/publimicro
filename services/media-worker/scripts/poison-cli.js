#!/usr/bin/env node
/* eslint-disable no-console */
// Simple CLI to inspect and manage jobs in the media-poison queue
// Usage:
//   node scripts/poison-cli.js list
//   node scripts/poison-cli.js requeue <jobId>
//   node scripts/poison-cli.js remove <jobId>

const { Queue } = require('bullmq')
const IORedis = require('ioredis')

const REDIS_URL = process.env.REDIS_URL
if (!REDIS_URL) {
  console.error('Please set REDIS_URL in env')
  process.exit(2)
}

const poison = new Queue('media-poison', { connection: { url: REDIS_URL } })
const main = async () => {
  const cmd = process.argv[2]
  if (!cmd || cmd === 'list') {
    // list recent failed jobs
    const jobs = await poison.getJobs(['waiting','delayed','active','completed','failed'], 0, 100)
    console.log(`Found ${jobs.length} jobs in media-poison:`)
    for (const j of jobs) {
      console.log('-', j.id, j.name, j.data && j.data.jobId ? `(orig:${j.data.jobId})` : '', j.failedReason || '')
    }
    process.exit(0)
  }

  if (cmd === 'requeue') {
    const id = process.argv[3]
    if (!id) { console.error('requeue requires jobId'); process.exit(2) }
    const job = await poison.getJob(id)
    if (!job) { console.error('Job not found in poison queue:', id); process.exit(1) }
    // Re-add to main queue
    const mainQueue = new Queue('media-jobs', { connection: { url: REDIS_URL } })
    await mainQueue.add('ingest', job.data.job || job.data, { jobId: job.data.jobId || undefined })
    console.log('Requeued job', id)
    await job.remove()
    process.exit(0)
  }

  if (cmd === 'remove') {
    const id = process.argv[3]
    if (!id) { console.error('remove requires jobId'); process.exit(2) }
    const job = await poison.getJob(id)
    if (!job) { console.error('Job not found in poison queue:', id); process.exit(1) }
    await job.remove()
    console.log('Removed job', id)
    process.exit(0)
  }

  console.log('Unknown command', cmd)
  process.exit(2)
}

main().catch(e => { console.error(e); process.exit(1) })
