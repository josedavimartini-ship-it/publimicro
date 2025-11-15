#!/usr/bin/env node
import fs from 'fs';
import fetch from 'node-fetch';
import logger from '../../../scripts/logger.mjs';

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length < 2) {
    logger.info('Usage: admin-upload-cli <zip-path> <property-id> --admin-key <key> [--url <api-url>]');
    process.exit(2);
  }
  const zipPath = argv[0];
  const propertyId = argv[1];
  const adminKeyFlag = argv.indexOf('--admin-key');
  const adminKey = adminKeyFlag >= 0 ? argv[adminKeyFlag + 1] : process.env.ADMIN_API_KEY;
  const urlFlag = argv.indexOf('--url');
  const apiUrl = urlFlag >= 0 ? argv[urlFlag + 1] : process.env.ADMIN_UPLOAD_URL || 'http://localhost:3000/api/admin/property-media/zip';

  if (!adminKey) {
    logger.error('Admin key is required via --admin-key or ADMIN_API_KEY env');
    process.exit(2);
  }

  const buf = fs.readFileSync(zipPath);
  const base64 = buf.toString('base64');

  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey, 'x-admin-user': 'cli-uploader' },
    body: JSON.stringify({ property_id: propertyId, zip: { base64 } }),
  });

  const json = await resp.json();
  logger.info('Upload response:', JSON.stringify(json, null, 2));
}

main().catch((err) => { logger.error(err); process.exit(1); });
