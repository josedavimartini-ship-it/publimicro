const fs = require('fs');
const path = require('path');
const marker = path.join(process.cwd(), '.build-complete');
try {
  fs.writeFileSync(marker, String(Date.now()));
  console.log('Wrote marker', marker);
} catch (err) {
  console.error('Failed to write marker', err);
  process.exitCode = 1;
}
