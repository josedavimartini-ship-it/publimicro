const fs = require('fs');
const path = require('path');
const marker = path.join(process.cwd(), '.next-build-complete');
try {
  fs.writeFileSync(marker, String(Date.now()));
  // eslint-disable-next-line no-console
  console.log('Wrote marker', marker);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Failed to write marker', err);
  process.exitCode = 1;
}
