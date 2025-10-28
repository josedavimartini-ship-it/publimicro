import type { Config } from "tailwindcss";
import { theme } from "@publimicro/ui";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: theme.fontFamily
    }
  },
  plugins: [],
};

export default config;
