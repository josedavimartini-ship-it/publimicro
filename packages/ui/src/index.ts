// Re-export components from the ui package using their actual exports.

export * from "./components/Button";
export * from "./components/Card";
export * from "./components/Navbar";
export * from "./components/Hero";
export * from "./components/Footer";
export * from "./components/HighlightsCarousel";

export { Carcara3D } from "./components/Carcara3D";
export type { Carcara3DProps } from "./components/Carcara3D";

// New shared top nav
export { TopNav } from "./components/TopNav";

// Floating WhatsApp component
export { default as FloatingWhatsApp } from "./components/FloatingWhatsApp";

export { theme, publimicroColors } from "./theme";
export type { Theme } from "./theme";