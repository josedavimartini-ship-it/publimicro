const path = require('path')

module.exports = {
  turbopack: {
    // Point Turbopack at the monorepo workspace root so package resolution
    // matches the pnpm workspace layout and avoids "inferred workspace root" warnings.
    root: path.resolve(__dirname, '../../'),
  },
}
