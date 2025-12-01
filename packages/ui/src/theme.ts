export const theme = {
  colors: {
    // Core colors
    black: "#0a0a0a",
    darkgray: "#121212",
    moss: "#708238",
    gold: "#D4AF37",
    orange: "#FF7A00",
    teal: "#00C2A8",
    gray: "#c2c2c2",

    // AcheMe brand colors (formerly publimicro)
    acheme: {
      background: "#0f0f0f",
      musgo: "#2e3b32",
      chumbo: "#1b1b1b",
      ouro: "#cfa847",
      "ouro-light": "#e5c97f",
      "ouro-dark": "#b8953d",
      ferrugem: "#a6431c",
      areia: "#bfa97a",
      // New accent colors
      bronze: "#CD7F32",
      copper: "#B87333",
      sage: "#8B9B6E",
      forest: "#6B7F5C",
    },

    // Legacy alias (deprecated - use acheme instead)
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
export const achemeColors = theme.colors.acheme;
export const publimicroColors = theme.colors.publimicro; // Legacy alias

// Export type for TypeScript support
export type Theme = typeof theme;