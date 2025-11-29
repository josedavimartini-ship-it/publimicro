// Dark Theme Configuration for PubliMicro
// User requirements: Eye-friendly, no white, sophisticated dark palette, restrained colors
// Color research: Burnt bronze, moss green, petrol blue, dark amber, warm grays
// Strategy: Dark charcoal backgrounds (not pure black), warm text tones, subtle accents

export const darkTheme = {
  // Background layers (sophisticated grays, not pure black)
  bg: {
    primary: "#1a1a1a",      // Main background (dark charcoal - less eye strain than black)
    secondary: "#242424",    // Cards, panels (slightly lighter for hierarchy)
    tertiary: "#2e2e2e",     // Elevated elements (modals, dropdowns)
    overlay: "#1f1f1f",      // Overlays, navigation
    input: "#2a2a2a",        // Form inputs (subtle contrast)
    light: "#353535",        // Light variant for mixed approach (darker text on lighter bg)
  },

  // Text colors (warm, easy on eyes, excellent contrast)
  text: {
    primary: "#D4C4A8",      // Body text (warm beige - optimal readability)
    secondary: "#B8A890",    // Secondary text (muted beige)
    muted: "#8A7F6F",        // Disabled/placeholder text
    heading: "#C9A87C",      // Headings (light copper - warm, sophisticated)
    accent: "#B8904D",       // Highlighted text (burnt gold - subtle emphasis)
    success: "#6B7F5C",      // Success (moss green - calming)
    warning: "#9B6B3E",      // Warnings (dark amber - attention without alarm)
    error: "#A85F4F",        // Errors (muted terracotta - clear but not harsh)
  },

  // Interactive elements (subtle, sophisticated)
  interactive: {
    primary: {
      bg: "linear-gradient(135deg, #6B7F5C 0%, #2C5F6F 100%)", // Moss to petrol - natural, calming
      bgHover: "linear-gradient(135deg, #7A8F6B 0%, #3A6F7F 100%)", // Slightly lighter on hover
      text: "#1a1a1a",       // Dark text on buttons for readability
    },
    secondary: {
      bg: "#8B6F47",         // Burnt bronze (primary accent)
      bgHover: "#9B7F57",    // Lighter bronze on hover
      text: "#1a1a1a",
    },
    tertiary: {
      bg: "#2C5F6F",         // Petrol blue (cool accent)
      bgHover: "#3C6F7F",
      text: "#D4C4A8",
    },
    ghost: {
      bg: "transparent",
      bgHover: "#2a2a2a",
      text: "#B8A890",
    },
  },

  // Borders and dividers (subtle, don't compete with content)
  border: {
    default: "#3a3a3a",      // Subtle gray
    subtle: "#2e2e2e",       // Very subtle for inner dividers
    focus: "#B8904D",        // Burnt gold focus ring (warm, noticeable)
    hover: "#4a4a4a",        // Slightly lighter on hover
    accent: "#8B6F47",       // Burnt bronze for emphasized borders
  },

  // Shadows for raised text effect (warm glow instead of harsh light)
  textShadow: {
    subtle: "0 1px 2px rgba(0, 0, 0, 0.6)",
    medium: "0 2px 4px rgba(0, 0, 0, 0.7)",
    strong: "0 3px 6px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(184, 144, 77, 0.3)", // Burnt gold glow
    raised: "0 2px 4px rgba(0, 0, 0, 0.8), 0 -1px 2px rgba(139, 111, 71, 0.2)", // Bronze embossed
    copper: "0 2px 4px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(201, 168, 124, 0.4)", // Copper highlight
  },

  // Box shadows (soft, natural depth)
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.5)",
    md: "0 4px 6px rgba(0, 0, 0, 0.6)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.7)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.8)",
    inner: "inset 0 2px 4px rgba(0, 0, 0, 0.4)", // Subtle depth for inputs
  },
};

// Tailwind CSS class utilities (refined palette)
export const tw = {
  // Background classes
  bgPrimary: "bg-[#1a1a1a]",
  bgSecondary: "bg-[#242424]",
  bgTertiary: "bg-[#2e2e2e]",
  bgOverlay: "bg-[#1f1f1f]",
  bgInput: "bg-[#2a2a2a]",
  bgLight: "bg-[#353535]", // For lighter sections with darker text

  // Text color classes
  textPrimary: "text-[#D4C4A8]",      // Warm beige body text
  textSecondary: "text-[#B8A890]",    // Muted beige
  textMuted: "text-[#8A7F6F]",        // Disabled text
  textHeading: "text-[#C9A87C]",      // Light copper headings
  textAccent: "text-[#B8904D]",       // Burnt gold accents
  textSuccess: "text-[#6B7F5C]",      // Moss green
  textWarning: "text-[#9B6B3E]",      // Dark amber
  textError: "text-[#A85F4F]",        // Muted terracotta

  // Border classes
  borderDefault: "border-[#3a3a3a]",
  borderSubtle: "border-[#2e2e2e]",
  borderFocus: "border-[#B8904D]",    // Burnt gold focus
  borderHover: "border-[#4a4a4a]",
  borderAccent: "border-[#8B6F47]",   // Burnt bronze

  // Interactive button classes
  btnPrimary: "bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#1a1a1a] font-bold",
  btnSecondary: "bg-[#8B6F47] hover:bg-[#9B7F57] text-[#1a1a1a] font-semibold",
  btnTertiary: "bg-[#2C5F6F] hover:bg-[#3C6F7F] text-[#D4C4A8] font-semibold",
  btnGhost: "bg-transparent hover:bg-[#2a2a2a] text-[#B8A890]",

  // Typography utilities
  headingRaised: "font-bold text-[#C9A87C]", // Light copper with text-shadow
  bodyText: "text-[#D4C4A8]",               // Warm beige
  labelText: "text-[#B8A890] font-medium",  // Muted beige

  // Card/Panel classes
  card: "bg-[#242424] border border-[#3a3a3a] rounded-xl shadow-lg",
  cardHover: "hover:border-[#4a4a4a] hover:shadow-xl transition-all",
  cardElevated: "bg-[#2e2e2e] border border-[#4a4a4a] rounded-xl shadow-xl", // Higher elevation
  modal: "bg-[#1f1f1f] border border-[#3a3a3a] rounded-2xl shadow-2xl",

  // Input classes (subtle inner shadow for depth)
  input: "bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8A7F6F] focus:border-[#B8904D] focus:ring-2 focus:ring-[#B8904D]/20",
  textarea: "bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8A7F6F] focus:border-[#B8904D] focus:ring-2 focus:ring-[#B8904D]/20",
  select: "bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] focus:border-[#B8904D] focus:ring-2 focus:ring-[#B8904D]/20",
};

// CSS-in-JS styles for text-shadow (use with style prop)
export const textShadowStyles = {
  subtle: { textShadow: "0 1px 2px rgba(0, 0, 0, 0.6)" },
  medium: { textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)" },
  strong: { textShadow: "0 3px 6px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(184, 144, 77, 0.3)" },
  raised: { textShadow: "0 2px 4px rgba(0, 0, 0, 0.8), 0 -1px 2px rgba(139, 111, 71, 0.2)" },
  copper: { textShadow: "0 2px 4px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(201, 168, 124, 0.4)" },
};

// Component preset classes
export const componentPresets = {
  // Page wrapper
  pageContainer: "min-h-screen bg-[#1a1a1a] text-[#D4C4A8]",

  // Section wrapper
  section: "bg-[#242424] rounded-xl border border-[#3a3a3a] p-6 md:p-8",

  // Heading styles (add text-shadow via inline style)
  h1: "text-4xl md:text-5xl font-bold text-[#C9A87C] mb-4",       // Light copper
  h2: "text-3xl md:text-4xl font-bold text-[#C9A87C] mb-3",
  h3: "text-2xl md:text-3xl font-bold text-[#B8904D] mb-2",       // Burnt gold
  h4: "text-xl md:text-2xl font-semibold text-[#B8A890] mb-2",    // Muted beige

  // Button presets
  buttonPrimary: "px-6 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#1a1a1a] font-bold rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100",
  buttonSecondary: "px-6 py-3 bg-[#8B6F47] hover:bg-[#9B7F57] text-[#1a1a1a] font-semibold rounded-lg transition-all hover:scale-105",
  buttonTertiary: "px-6 py-3 bg-[#2C5F6F] hover:bg-[#3C6F7F] text-[#D4C4A8] font-semibold rounded-lg transition-all hover:scale-105",
  buttonGhost: "px-6 py-3 bg-transparent hover:bg-[#2a2a2a] text-[#B8A890] rounded-lg transition-all",

  // Link styles
  link: "text-[#B8904D] hover:text-[#C9A87C] underline-offset-4 hover:underline transition-colors",        // Burnt gold
  linkSubtle: "text-[#B8A890] hover:text-[#D4C4A8] transition-colors",

  // Form field wrapper
  formField: "space-y-2",
  label: "block text-[#B8A890] font-medium text-sm",
  inputField: "w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4C4A8] placeholder-[#8A7F6F] rounded-lg focus:border-[#B8904D] focus:ring-2 focus:ring-[#B8904D]/20 focus:outline-none transition-all",

  // Badge/Tag
  badge: "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
  badgeSuccess: "bg-[#6B7F5C]/20 text-[#6B7F5C] border border-[#6B7F5C]/30",      // Moss green
  badgeWarning: "bg-[#9B6B3E]/20 text-[#9B6B3E] border border-[#9B6B3E]/30",      // Dark amber
  badgeError: "bg-[#A85F4F]/20 text-[#A85F4F] border border-[#A85F4F]/30",        // Muted terracotta
  badgeInfo: "bg-[#B8904D]/20 text-[#B8904D] border border-[#B8904D]/30",         // Burnt gold
  badgeBronze: "bg-[#8B6F47]/20 text-[#8B6F47] border border-[#8B6F47]/30",       // Burnt bronze

  // Loading spinner
  spinner: "w-8 h-8 border-4 border-[#B8904D] border-t-transparent rounded-full animate-spin",
};

export default darkTheme;
