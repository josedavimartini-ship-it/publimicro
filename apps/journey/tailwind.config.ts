import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // If you want to use components from the shared UI package:
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Publimicro brand colors (consistent across all apps)
        brand: {
          gold: "#cfa847",
          "gold-light": "#e6c86b",
          "gold-dark": "#bfa97a",
          dark: "#0f1110",
          "dark-elevated": "#162017",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;