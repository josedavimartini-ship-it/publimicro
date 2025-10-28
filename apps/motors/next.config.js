const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
      transpilePackages: ['@publimicro/ui'],
  
  // Certifique-se de que a raiz do monorepo é reconhecida
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

module.exports = nextConfig;
