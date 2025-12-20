import fs from 'fs';
import path from 'path';

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function luminance([r, g, b]) {
  const srgb = [r, g, b].map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(hex1, hex2) {
  const l1 = luminance(hexToRgb(hex1));
  const l2 = luminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Read globals.css variables (simple parse)
const css = fs.readFileSync(path.resolve('apps/publimicro/src/app/globals.css'), 'utf8');
const varRegex = /--([a-z0-9-]+):\s*([^;]+);/gi;
let match;
const vars = {};
while ((match = varRegex.exec(css))) {
  vars[match[1]] = match[2].trim();
}

function safeHex(v) {
  if (!v) return null;
  const m = v.match(/#([0-9a-fA-F]{3,6})/);
  return m ? `#${m[1]}` : null;
}

const textStrongDark = safeHex(vars['text-strong-dark']) || '#1f1f1f';
const accentBronze = safeHex(vars['accent-bronze']) || '#8B6F47';
const accentGold = safeHex(vars['accent-gold']) || '#B8904D';
const textPrimary = safeHex(vars['text-primary']) || '#D4C4A8';
const bgPrimary = safeHex(vars['bg-primary']) || '#1a1a1a';

console.log('Contrast checks (WCAG):');
console.log('btn-primary (text vs accent-bronze):', contrastRatio(textStrongDark, accentBronze).toFixed(2));
console.log('btn-primary (text vs accent-gold):', contrastRatio(textStrongDark, accentGold).toFixed(2));
const avgHex = (() => {
  // approximate gradient average by averaging RGB
  const b = hexToRgb(accentBronze);
  const g = hexToRgb(accentGold);
  const avg = [(b[0] + g[0]) / 2, (b[1] + g[1]) / 2, (b[2] + g[2]) / 2];
  // convert avg to hex string
  return '#' + avg.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
})();
console.log('btn-primary (text vs gradient average):', contrastRatio(textStrongDark, avgHex).toFixed(2));
console.log('btn-secondary (text vs accent-petrol):', contrastRatio(textPrimary, safeHex(vars['accent-petrol']) || '#0F4C5C').toFixed(2));
console.log('Heading contrast (heading vs bg):', contrastRatio(safeHex(vars['text-heading']) || '#C9A87C', bgPrimary).toFixed(2));

console.log('\nWCAG benchmarks: 4.5 for normal text (AA), 3.0 for large text (AA Large)');
