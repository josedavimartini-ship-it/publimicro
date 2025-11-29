const fs = require('fs');
const path = require('path');
const logger = require('../../../scripts/logger.cjs');
const marker = path.join(process.cwd(), '.build-complete');
try {
  fs.writeFileSync(marker, String(Date.now()));
  logger.info('Wrote marker', marker);
} catch (err) {
  logger.error('Failed to write marker', err);
  process.exitCode = 1;
}
