import { resolve } from "path";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  // ✅ Permite o deploy mesmo com avisos do ESLint e TypeScript
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "irrzpwzyqcubhhjeuakc.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": resolve(process.cwd(), "src"),
    };
    return config;
  },
};

export default config;
