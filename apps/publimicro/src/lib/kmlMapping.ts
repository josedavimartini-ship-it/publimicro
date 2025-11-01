/**
 * Mapping between property names/IDs and their individual KML files
 * Each of the 6 Sítios Carcará properties has its own KML file
 */

export const KML_FILES: Record<string, string> = {
  // By property name (normalized)
  surucua: '/kml/surucua.kml',
  juriti: '/kml/juriti.kml',
  seriema: '/kml/seriema.kml',
  mergulhao: '/kml/mergulhao.kml',
  bigua: '/kml/bigua.kml',
  abare: '/kml/abare.kml',
  
  // By sitio number (legacy)
  'sitio-1': '/kml/surucua.kml',
  'sitio-2': '/kml/juriti.kml',
  'sitio-3': '/kml/seriema.kml',
  'sitio-4': '/kml/mergulhao.kml',
  'sitio-5': '/kml/bigua.kml',
  'sitio-6': '/kml/abare.kml',
};

/**
 * Get KML file path for a property by ID or name
 * Returns null if no individual KML exists (will fall back to full map)
 */
export function getKMLForProperty(idOrName: string): string | null {
  if (!idOrName) return null;
  
  // Normalize the input
  const normalized = idOrName.toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[áàâã]/g, 'a')
    .replace(/[éèê]/g, 'e')
    .replace(/[íìî]/g, 'i')
    .replace(/[óòôõ]/g, 'o')
    .replace(/[úùû]/g, 'u')
    .replace(/ç/g, 'c');
  
  // Check if we have a direct match
  if (KML_FILES[normalized]) {
    return KML_FILES[normalized];
  }
  
  // Try to match partial names (e.g., "Surucuá" matches "surucua")
  for (const [key, path] of Object.entries(KML_FILES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return path;
    }
  }
  
  return null;
}

/**
 * Fetch KML content from a file path
 */
export async function fetchKMLContent(filePath: string): Promise<string | null> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      console.error(`Failed to fetch KML from ${filePath}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching KML:', error);
    return null;
  }
}
