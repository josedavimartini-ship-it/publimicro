/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDocumentPreloading: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
