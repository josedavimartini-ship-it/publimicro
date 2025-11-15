import fs from 'fs';
import path from 'path';
import { info, error } from '../../../scripts/logger.mjs';

const marker = path.join(process.cwd(), '.next-build-complete');

try {
  fs.writeFileSync(marker, String(Date.now()));
  info('Wrote marker', marker);
} catch (err) {
  error('Failed to write marker', err);
  process.exitCode = 1;
}
