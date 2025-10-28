// Re-export components from the ui package using their actual exports.
// Ensure these lines match the export style used in each component file.

export * from "./components/Button";
export * from "./components/Card";
export * from "./components/Navbar";
export * from "./components/Hero";
export * from "./components/Footer";
export * from "./components/HighlightsCarousel";

// Carcara3D exports a named component and types
export { Carcara3D } from "./components/Carcara3D";
export type { Carcara3DProps } from "./components/Carcara3D";

// Export theme
export { theme, publimicroColors } from "./theme";
export type { Theme } from "./theme";