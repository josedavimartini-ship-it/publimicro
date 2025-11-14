/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Point Turbopack at the monorepo workspace root so package resolution
  // matches the pnpm workspace layout and avoids "inferred workspace root" warnings.
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

module.exports = nextConfig;
