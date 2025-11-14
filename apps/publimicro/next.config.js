/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Transpile workspace packages used by this app so Turbopack/Next can
  // resolve and bundle them correctly from the monorepo layout.
  transpilePackages: ['@publimicro/ui', path.resolve(__dirname, '../../packages/stripe')],
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

module.exports = nextConfig;
