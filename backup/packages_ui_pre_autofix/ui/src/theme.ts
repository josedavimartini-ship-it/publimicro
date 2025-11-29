export const theme = {
  colors: {
    // Original colors (keep for backwards compatibility)
    black: "#0a0a0a",
    darkgray: "#121212",
    moss: "#708238",
    gold: "#D4AF37",
    orange: "#FF7A00",
    teal: "#00C2A8",
    gray: "#c2c2c2",

    // Publimicro brand colors
    publimicro: {
      background: "#0f0f0f",
      musgo: "#2e3b32",
      chumbo: "#1b1b1b",
      ouro: "#cfa847",
      "ouro-light": "#e5c97f",
      "ouro-dark": "#b8953d",
      ferrugem: "#a6431c",
      areia: "#bfa97a",
    },
  },
  fontFamily: {
    sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
    mono: ["var(--font-geist-mono)", "monospace"],
  },
};

// Export individual color palettes for easier imports
export const publimicroColors = theme.colors.publimicro;

// Export type for TypeScript support
export type Theme = typeof theme;