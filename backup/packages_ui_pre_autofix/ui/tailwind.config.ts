import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../apps/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "proper-black": "#0a0a0a",
        "proper-darkgray": "#121212",
        "proper-moss": "#708238",
        "proper-gold": "#D4AF37",
        "proper-orange": "#FF7A00",
        "proper-teal": "#00C2A8",
        "proper-gray": "#c2c2c2",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
