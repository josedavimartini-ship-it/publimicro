import { resolve } from "path";

const config = {
  reactStrictMode: true,
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
