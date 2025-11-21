const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', '.eslintignore');
try {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log('.eslintignore removed');
    process.exitCode = 0;
  } else {
    console.log('.eslintignore not present');
    process.exitCode = 0;
  }
} catch (err) {
  console.error('Failed to remove .eslintignore:', err && err.message ? err.message : err);
  // Do not fail the lint script; just warn.
  process.exitCode = 0;
}
