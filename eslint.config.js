// Minimal compatibility wrapper for ESLint v9+ which expects an
// `eslint.config.js` file. Re-exports the legacy `.eslintrc.cjs`
// configuration so existing rules keep working without a full
// migration to the flat config format.
module.exports = require('./.eslintrc.cjs');
