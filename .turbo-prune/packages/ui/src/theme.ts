// packages/ui/src/theme.ts
export const colors = {
  background: "#0f0f0f",      // preto suave
  musgo: "#2e3b32",           // verde musgo
  chumbo: "#1b1b1b",          // cinza chumbo
  ouro: "#cfa847",            // amarelo escuro (principal)
  ferrugem: "#a6431c",        // vermelho ferrugem
  areia: "#bfa97a",           // bege amarelado
  textPrimary: "#cfa847",
  textMuted: "#bfb69a"
};

export const theme = {
  colors,
  classes: {
    bg: "bg-[#0f0f0f]",
    cardBg: "bg-gradient-to-b from-[#2e3b32] to-[#1b1b1b]",
    accent: "text-[#cfa847]",
    accentBg: "bg-[#cfa847] text-[#0f0f0f]",
    accentHover: "hover:bg-[#b89236]",
    text: "text-[#cfa847]",
  },
};

export type Theme = typeof theme;
export default theme;
