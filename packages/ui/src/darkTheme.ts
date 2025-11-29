// Dark Theme Configuration for PubliMicro
// User requirements: Eye-friendly, no white, dark backgrounds, bold text, raised titles

export const darkTheme = {
  // Background layers (darkest to lightest)
  bg: {
    primary: "#0f0f0f",      // Main background (almost black)
    secondary: "#1a1a1a",    // Cards, panels
    tertiary: "#2a2a2a",     // Elevated elements
    overlay: "#1b1b1b",      // Modals, dropdowns
    input: "#252525",        // Form inputs
  },

  // Text colors (low-glare, earthy tones)
  text: {
    primary: "#e5c97f",      // Main text (light gold)
    secondary: "#bfa97a",    // Secondary text (sand)
    muted: "#8a7a5a",        // Muted/disabled text
    accent: "#cfa847",       // Highlighted text (gold)
    success: "#88b04b",      // Success messages (soft green)
    warning: "#d4a574",      // Warnings (beige)
    error: "#c86f4f",        // Errors (soft red, not harsh)
  },

  // Interactive elements
  interactive: {
    primary: {
      bg: "linear-gradient(135deg, #A8C97F 0%, #0D7377 100%)",
      bgHover: "linear-gradient(135deg, #0D7377 0%, #A8C97F 100%)",
      text: "#0a0a0a",       // Dark text on bright buttons
    },
    secondary: {
      bg: "#2e3b32",         // Moss green
      bgHover: "#3a4a3e",
      text: "#e5c97f",
    },
    ghost: {
      bg: "transparent",
      bgHover: "#2a2a2a",
      text: "#bfa97a",
    },
  },

  // Borders and dividers
  border: {
    default: "#3a3a3a",
    focus: "#cfa847",        // Gold focus ring
    hover: "#4a4a4a",
  },

  // Shadows for raised text effect
  textShadow: {
    subtle: "0 1px 2px rgba(0, 0, 0, 0.5)",
    medium: "0 2px 4px rgba(0, 0, 0, 0.7)",
    strong: "0 3px 6px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(207, 168, 71, 0.3)", // Gold glow
    raised: "0 2px 4px rgba(0, 0, 0, 0.8), 0 -1px 2px rgba(255, 255, 255, 0.1)", // Embossed effect
  },

  // Box shadows
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
    md: "0 4px 6px rgba(0, 0, 0, 0.6)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.7)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.8)",
  },
};

// Tailwind CSS class utilities
export const tw = {
  // Background classes
  bgPrimary: "bg-[#0f0f0f]",
  bgSecondary: "bg-[#1a1a1a]",
  bgTertiary: "bg-[#2a2a2a]",
  bgOverlay: "bg-[#1b1b1b]",
  bgInput: "bg-[#252525]",

  // Text color classes
  textPrimary: "text-[#e5c97f]",
  textSecondary: "text-[#bfa97a]",
  textMuted: "text-[#8a7a5a]",
  textAccent: "text-[#cfa847]",
  textSuccess: "text-[#88b04b]",
  textWarning: "text-[#d4a574]",
  textError: "text-[#c86f4f]",

  // Border classes
  borderDefault: "border-[#3a3a3a]",
  borderFocus: "border-[#cfa847]",
  borderHover: "border-[#4a4a4a]",

  // Interactive button classes
  btnPrimary: "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] hover:from-[#0D7377] hover:to-[#A8C97F] text-[#0a0a0a] font-bold",
  btnSecondary: "bg-[#2e3b32] hover:bg-[#3a4a3e] text-[#e5c97f] font-semibold",
  btnGhost: "bg-transparent hover:bg-[#2a2a2a] text-[#bfa97a]",

  // Typography utilities
  headingRaised: "font-bold text-[#cfa847]", // Will add text-shadow in CSS
  bodyText: "text-[#bfa97a]",
  labelText: "text-[#e5c97f] font-medium",

  // Card/Panel classes
  card: "bg-[#1a1a1a] border-2 border-[#3a3a3a] rounded-xl shadow-lg",
  cardHover: "hover:border-[#4a4a4a] hover:shadow-xl transition-all",
  modal: "bg-[#1b1b1b] border border-[#3a3a3a] rounded-2xl shadow-2xl",

  // Input classes
  input: "bg-[#252525] border border-[#3a3a3a] text-[#e5c97f] placeholder-[#8a7a5a] focus:border-[#cfa847] focus:ring-2 focus:ring-[#cfa847]/30",
  textarea: "bg-[#252525] border border-[#3a3a3a] text-[#e5c97f] placeholder-[#8a7a5a] focus:border-[#cfa847] focus:ring-2 focus:ring-[#cfa847]/30",
  select: "bg-[#252525] border border-[#3a3a3a] text-[#e5c97f] focus:border-[#cfa847] focus:ring-2 focus:ring-[#cfa847]/30",
};

// CSS-in-JS styles for text-shadow (use with style prop)
export const textShadowStyles = {
  subtle: { textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" },
  medium: { textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)" },
  strong: { textShadow: "0 3px 6px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(207, 168, 71, 0.3)" },
  raised: { textShadow: "0 2px 4px rgba(0, 0, 0, 0.8), 0 -1px 2px rgba(255, 255, 255, 0.1)" },
};

// Component preset classes
export const componentPresets = {
  // Page wrapper
  pageContainer: "min-h-screen bg-[#0f0f0f] text-[#bfa97a]",

  // Section wrapper
  section: "bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] p-6 md:p-8",

  // Heading styles (add text-shadow via inline style)
  h1: "text-4xl md:text-5xl font-bold text-[#cfa847] mb-4",
  h2: "text-3xl md:text-4xl font-bold text-[#cfa847] mb-3",
  h3: "text-2xl md:text-3xl font-bold text-[#e5c97f] mb-2",
  h4: "text-xl md:text-2xl font-semibold text-[#e5c97f] mb-2",

  // Button presets
  buttonPrimary: "px-6 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] hover:from-[#0D7377] hover:to-[#A8C97F] text-[#0a0a0a] font-bold rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100",
  buttonSecondary: "px-6 py-3 bg-[#2e3b32] hover:bg-[#3a4a3e] text-[#e5c97f] font-semibold rounded-lg transition-all hover:scale-105",
  buttonGhost: "px-6 py-3 bg-transparent hover:bg-[#2a2a2a] text-[#bfa97a] rounded-lg transition-all",

  // Link styles
  link: "text-[#cfa847] hover:text-[#e5c97f] underline-offset-4 hover:underline transition-colors",
  linkSubtle: "text-[#bfa97a] hover:text-[#e5c97f] transition-colors",

  // Form field wrapper
  formField: "space-y-2",
  label: "block text-[#e5c97f] font-medium text-sm",
  inputField: "w-full px-4 py-3 bg-[#252525] border border-[#3a3a3a] text-[#e5c97f] placeholder-[#8a7a5a] rounded-lg focus:border-[#cfa847] focus:ring-2 focus:ring-[#cfa847]/30 focus:outline-none transition-all",

  // Badge/Tag
  badge: "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
  badgeSuccess: "bg-[#88b04b]/20 text-[#88b04b] border border-[#88b04b]/30",
  badgeWarning: "bg-[#d4a574]/20 text-[#d4a574] border border-[#d4a574]/30",
  badgeError: "bg-[#c86f4f]/20 text-[#c86f4f] border border-[#c86f4f]/30",
  badgeInfo: "bg-[#cfa847]/20 text-[#cfa847] border border-[#cfa847]/30",

  // Loading spinner
  spinner: "w-8 h-8 border-4 border-[#cfa847] border-t-transparent rounded-full animate-spin",
};

export default darkTheme;
