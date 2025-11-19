// Simple end-to-end test for local ingest signed-url + upload-proxy flow.
// Usage: Start the ingest server on localhost:4001, then run:
//   node test-e2e.js

const fs = require('fs')
const path = require('path')
const axios = require('axios')

const BASE = process.env.INGEST_BASE || 'http://localhost:4001'

async function run() {
  // create small test file
  const tmp = path.join(__dirname, '..', '.tmp_test')
  fs.mkdirSync(tmp, { recursive: true })
  const filePath = path.join(tmp, `test-${Date.now()}.txt`)
  fs.writeFileSync(filePath, 'hello publimicro test')

  // request signed url
  console.log('Requesting signed URL...')
  const signed = await axios.post(`${BASE}/signed-url`, { segment: 'default', slug: 'e2e-demo', filename: path.basename(filePath), contentType: 'text/plain' }, { headers: { 'Content-Type': 'application/json' } })
  console.log('Signed response:', signed.data)
  if (!signed.data || !signed.data.uploadUrl) throw new Error('No uploadUrl returned')

  const uploadUrl = `${BASE}${signed.data.uploadUrl}`
  console.log('Uploading file to', uploadUrl)

  const stream = fs.createReadStream(filePath)
  const resp = await axios.put(uploadUrl, stream, { headers: { 'Content-Type': 'text/plain' }, maxContentLength: Infinity, maxBodyLength: Infinity })
  console.log('Upload response:', resp.data)

  if (resp.data && resp.data.publicUrl) {
    console.log('Public URL:', resp.data.publicUrl)
    // Optionally HEAD the public URL
    try {
      const h = await axios.head(resp.data.publicUrl)
      console.log('HEAD OK', h.status)
    } catch (e) { console.warn('HEAD failed', e && e.response && e.response.status) }
  }

  console.log('E2E test complete')
}

run().catch(err => { console.error(err); process.exit(1) })
