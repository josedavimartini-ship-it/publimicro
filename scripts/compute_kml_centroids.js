const fs = require('fs');
const path = require('path');
const logger = require('./logger.cjs');

function parseCoordinates(coordText) {
  return coordText
    .trim()
    .split(/\s+/)
    .map(pair => {
      const [lon, lat] = pair.split(',').map(Number);
      return { lat, lon };
    });
}

function polygonCentroid(coords) {
  // planar polygon centroid (suitable for small areas)
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const xi = coords[i].lon;
    const yi = coords[i].lat;
    const xj = coords[j].lon;
    const yj = coords[j].lat;
    const a = xi * yj - xj * yi;
    area += a;
    cx += (xi + xj) * a;
    cy += (yi + yj) * a;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-12) {
    // degenerate - fallback to average
    const avgLon = coords.reduce((s, c) => s + c.lon, 0) / coords.length;
    const avgLat = coords.reduce((s, c) => s + c.lat, 0) / coords.length;
    return { lat: avgLat, lon: avgLon };
  }
  cx = cx / (6 * area);
  cy = cy / (6 * area);
  return { lat: cy, lon: cx };
}

const kmlDir = path.join(__dirname, '..', 'apps', 'publimicro', 'public', 'kml');
const files = fs.readdirSync(kmlDir).filter(f => f.endsWith('.kml'));

for (const file of files) {
  const p = path.join(kmlDir, file);
  const content = fs.readFileSync(p, 'utf8');
  const m = content.match(/<coordinates>([\s\S]*?)<\/coordinates>/);
  if (!m) {
    logger.error('No coordinates found in', file);
    continue;
  }
  const coords = parseCoordinates(m[1]);
  const c = polygonCentroid(coords);
  logger.info(`${file}: ${c.lon.toFixed(12)},${c.lat.toFixed(12)}`);
}
