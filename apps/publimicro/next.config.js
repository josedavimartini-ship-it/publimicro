/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Transpile workspace packages used by this app so Turbopack/Next can
  // resolve and bundle them correctly from the monorepo layout.
  // Include the package name as well as the resolved path to help Turbopack
  // resolve the workspace package entry during development and on Vercel.
  transpilePackages: ['@publimicro/ui', '@publimicro/stripe', path.resolve(__dirname, '../../packages/stripe')],
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
  
  // Image optimization - allow Supabase and Unsplash images
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "irrzpwzyqcubhhjeuakc.supabase.co" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  
  // Allow ngrok dev origins
  allowedDevOrigins: [
    'https://felipe-fasciculate-chemosynthetically.ngrok-free.dev',
  ],
};

module.exports = nextConfig;
