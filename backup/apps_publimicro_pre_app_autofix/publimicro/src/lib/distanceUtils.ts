/**
 * Distance calculation utility using Haversine formula
 * Calculates distances between geographic coordinates on Earth
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface POI {
  name: string;
  coordinates: Coordinates;
  type: 'hospital' | 'school' | 'supermarket' | 'pharmacy' | 'gas_station' | 'bank' | 'clinic' | 'university';
}

export interface DistanceResult {
  name: string;
  distance_km: number;
  type: string;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  
  const lat1Rad = toRadians(point1.latitude);
  const lat2Rad = toRadians(point2.latitude);
  const deltaLat = toRadians(point2.latitude - point1.latitude);
  const deltaLon = toRadians(point2.longitude - point1.longitude);
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const distance = R * c;
  
  // Round to 2 decimal places
  return Math.round(distance * 100) / 100;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the nearest POI of each type from a property location
 * @param propertyCoords Property coordinates
 * @param pois Array of Points of Interest
 * @returns Object with nearest POI of each type
 */
export function findNearestPOIs(
  propertyCoords: Coordinates,
  pois: POI[]
): Record<string, DistanceResult | null> {
  const nearestByType: Record<string, DistanceResult | null> = {
    hospital: null,
    clinic: null,
    school: null,
    university: null,
    supermarket: null,
    pharmacy: null,
    gas_station: null,
    bank: null,
  };
  
  pois.forEach(poi => {
    const distance = calculateDistance(propertyCoords, poi.coordinates);
    const current = nearestByType[poi.type];
    
    if (!current || distance < current.distance_km) {
      nearestByType[poi.type] = {
        name: poi.name,
        distance_km: distance,
        type: poi.type,
      };
    }
  });
  
  return nearestByType;
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted string (e.g., "3.5 km" or "850 m")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Get distance quality indicator (near, moderate, far)
 * @param distanceKm Distance in kilometers
 * @param poiType Type of POI (different thresholds for different types)
 * @returns Quality indicator
 */
export function getDistanceQuality(
  distanceKm: number,
  poiType: string
): 'excellent' | 'good' | 'moderate' | 'far' {
  // Different thresholds for different POI types
  const thresholds: Record<string, { excellent: number; good: number; moderate: number }> = {
    hospital: { excellent: 5, good: 10, moderate: 20 },
    clinic: { excellent: 3, good: 7, moderate: 15 },
    school: { excellent: 2, good: 5, moderate: 10 },
    university: { excellent: 10, good: 20, moderate: 40 },
    supermarket: { excellent: 3, good: 7, moderate: 15 },
    pharmacy: { excellent: 3, good: 7, moderate: 15 },
    gas_station: { excellent: 5, good: 10, moderate: 20 },
    bank: { excellent: 5, good: 10, moderate: 20 },
  };
  
  const threshold = thresholds[poiType] || thresholds.hospital;
  
  if (distanceKm <= threshold.excellent) return 'excellent';
  if (distanceKm <= threshold.good) return 'good';
  if (distanceKm <= threshold.moderate) return 'moderate';
  return 'far';
}

/**
 * Calculate bounding box for a given point and radius
 * Useful for querying POIs within a certain distance
 * @param center Center coordinates
 * @param radiusKm Radius in kilometers
 * @returns Bounding box coordinates
 */
export function getBoundingBox(
  center: Coordinates,
  radiusKm: number
): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} {
  const R = 6371; // Earth's radius in km
  const latDelta = (radiusKm / R) * (180 / Math.PI);
  const lonDelta = (radiusKm / R) * (180 / Math.PI) / Math.cos(toRadians(center.latitude));
  
  return {
    minLat: center.latitude - latDelta,
    maxLat: center.latitude + latDelta,
    minLon: center.longitude - lonDelta,
    maxLon: center.longitude + lonDelta,
  };
}

/**
 * Mock POI data for Brasília region
 * In production, this should be fetched from Google Places API or OpenStreetMap
 */
export const MOCK_BRASILIA_POIS: POI[] = [
  // Hospitals
  { name: 'Hospital Regional de Planaltina', coordinates: { latitude: -15.6178, longitude: -47.6520 }, type: 'hospital' },
  { name: 'Hospital Regional de Sobradinho', coordinates: { latitude: -15.6525, longitude: -47.7889 }, type: 'hospital' },
  { name: 'Hospital Regional de Brasília', coordinates: { latitude: -15.7801, longitude: -47.9292 }, type: 'hospital' },
  
  // Clinics
  { name: 'UBS Mestre D\'Armas', coordinates: { latitude: -15.5987, longitude: -47.4321 }, type: 'clinic' },
  { name: 'Centro de Saúde Planaltina', coordinates: { latitude: -15.6234, longitude: -47.6543 }, type: 'clinic' },
  
  // Schools
  { name: 'Escola Classe 01 de Planaltina', coordinates: { latitude: -15.6123, longitude: -47.6434 }, type: 'school' },
  { name: 'Centro Educacional 01 de Planaltina', coordinates: { latitude: -15.6089, longitude: -47.6521 }, type: 'school' },
  { name: 'Colégio La Salle Sobradinho', coordinates: { latitude: -15.6543, longitude: -47.7921 }, type: 'school' },
  
  // Universities
  { name: 'UnB - Campus Planaltina', coordinates: { latitude: -15.6014, longitude: -47.6581 }, type: 'university' },
  { name: 'UnB - Campus Darcy Ribeiro', coordinates: { latitude: -15.7647, longitude: -47.8706 }, type: 'university' },
  
  // Supermarkets
  { name: 'Supermercado BH', coordinates: { latitude: -15.6234, longitude: -47.6512 }, type: 'supermarket' },
  { name: 'Extra Planaltina', coordinates: { latitude: -15.6178, longitude: -47.6589 }, type: 'supermarket' },
  { name: 'Atacadão Sobradinho', coordinates: { latitude: -15.6489, longitude: -47.7834 }, type: 'supermarket' },
  
  // Pharmacies
  { name: 'Drogaria São Paulo', coordinates: { latitude: -15.6201, longitude: -47.6523 }, type: 'pharmacy' },
  { name: 'Farmácia Popular', coordinates: { latitude: -15.6156, longitude: -47.6478 }, type: 'pharmacy' },
  
  // Gas Stations
  { name: 'Posto Shell BR-020', coordinates: { latitude: -15.6045, longitude: -47.6234 }, type: 'gas_station' },
  { name: 'Posto Petrobras Planaltina', coordinates: { latitude: -15.6189, longitude: -47.6501 }, type: 'gas_station' },
  { name: 'Posto Ipiranga DF-250', coordinates: { latitude: -15.5876, longitude: -47.5987 }, type: 'gas_station' },
  
  // Banks
  { name: 'Banco do Brasil Planaltina', coordinates: { latitude: -15.6212, longitude: -47.6534 }, type: 'bank' },
  { name: 'Caixa Econômica Federal', coordinates: { latitude: -15.6198, longitude: -47.6521 }, type: 'bank' },
  { name: 'Bradesco Planaltina', coordinates: { latitude: -15.6223, longitude: -47.6545 }, type: 'bank' },
];

/**
 * Generate neighborhood data for a property
 * In production, use Google Places API or Overpass API (OpenStreetMap)
 * @param propertyCoords Property coordinates
 * @returns Neighborhood data object ready for database insertion
 */
export async function generateNeighborhoodData(propertyCoords: Coordinates) {
  // In production, fetch real POIs from API based on property location
  // For now, use mock data
  const nearestPOIs = findNearestPOIs(propertyCoords, MOCK_BRASILIA_POIS);
  
  return {
    nearest_hospital_name: nearestPOIs.hospital?.name || null,
    nearest_hospital_distance_km: nearestPOIs.hospital?.distance_km || null,
    nearest_clinic_name: nearestPOIs.clinic?.name || null,
    nearest_clinic_distance_km: nearestPOIs.clinic?.distance_km || null,
    nearest_school_name: nearestPOIs.school?.name || null,
    nearest_school_distance_km: nearestPOIs.school?.distance_km || null,
    nearest_university_name: nearestPOIs.university?.name || null,
    nearest_university_distance_km: nearestPOIs.university?.distance_km || null,
    nearest_supermarket_name: nearestPOIs.supermarket?.name || null,
    nearest_supermarket_distance_km: nearestPOIs.supermarket?.distance_km || null,
    nearest_pharmacy_name: nearestPOIs.pharmacy?.name || null,
    nearest_pharmacy_distance_km: nearestPOIs.pharmacy?.distance_km || null,
    nearest_gas_station_name: nearestPOIs.gas_station?.name || null,
    nearest_gas_station_distance_km: nearestPOIs.gas_station?.distance_km || null,
    nearest_bank_name: nearestPOIs.bank?.name || null,
    nearest_bank_distance_km: nearestPOIs.bank?.distance_km || null,
  };
}
