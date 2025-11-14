const fs = require('fs');
const path = require('path');

const out = path.join(process.cwd(), '.next-build-complete');
try {
  fs.writeFileSync(out, `built:${new Date().toISOString()}`);
  // eslint-disable-next-line no-console
  console.log('Wrote marker', out);
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Failed to write marker file', e);
  process.exit(1);
}
