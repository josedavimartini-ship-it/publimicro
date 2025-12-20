"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";

// All 14 Sítios Carcará with their slugs and info
interface SiteInfo {
  slug: string;
  name: string;
  displayName: string;
  forSale: boolean;
  color: string;
  description: string;
}

const ALL_SITES: Record<string, SiteInfo> = {
  abare: {
    slug: "abare",
    name: "Abaré",
    displayName: "Sítio Abaré - Refúgio do Rio",
    forSale: true,
    color: "#4A90E2",
    description: "Refúgio com lago e área plana"
  },
  bigua: {
    slug: "bigua",
    name: "Biguá", 
    displayName: "Sítio Biguá - Majestade da Água",
    forSale: true,
    color: "#A8C97F",
    description: "Vista panorâmica e vegetação preservada"
  },
  mergulhao: {
    slug: "mergulhao",
    name: "Mergulhão",
    displayName: "Sítio Mergulhão - Guardião das Águas",
    forSale: true,
    color: "#0D7377",
    description: "Ipês, nascente natural e terreno misto"
  },
  batuira: {
    slug: "batuira",
    name: "Batuíra",
    displayName: "Sítio Batuíra",
    forSale: false,
    color: "#8B9B6E",
    description: "Em breve disponível"
  },
  jacana: {
    slug: "jacana",
    name: "Jaçanã",
    displayName: "Sítio Jaçanã",
    forSale: false,
    color: "#F5A623",
    description: "Em breve disponível"
  },
  canario: {
    slug: "canario",
    name: "Canário",
    displayName: "Sítio Canário",
    forSale: false,
    color: "#FFD700",
    description: "Em breve disponível"
  },
  mutum: {
    slug: "mutum",
    name: "Mutum",
    displayName: "Sítio Mutum",
    forSale: false,
    color: "#B87333",
    description: "Em breve disponível"
  },
  seriema: {
    slug: "seriema",
    name: "Seriema",
    displayName: "Sítio Seriema - A Voz do Cerrado",
    forSale: true,
    color: "#E94B3C",
    description: "Jatobás centenários e solo argiloso"
  },
  juriti: {
    slug: "juriti",
    name: "Juriti",
    displayName: "Sítio Juriti - A Canção do Entardecer",
    forSale: true,
    color: "#B7791F",
    description: "Pequizeiros abundantes e microclima ameno"
  },
  surucua: {
    slug: "surucua",
    name: "Surucuá",
    displayName: "Sítio Surucuá - A Joia da Floresta",
    forSale: true,
    color: "#417505",
    description: "Sucupiras centenárias e ótima incidência solar"
  },
  irapuru: {
    slug: "irapuru",
    name: "Irapuru",
    displayName: "Sítio Irapuru",
    forSale: false,
    color: "#00D084",
    description: "Em breve disponível"
  },
  carcara: {
    slug: "carcara",
    name: "Carcará",
    displayName: "Sítio Carcará - Acesso Central",
    forSale: false,
    color: "#D4AF37",
    description: "Ponto central de acesso às propriedades"
  },
  inhambu: {
    slug: "inhambu",
    name: "Inhambu",
    displayName: "Sítio Inhambu",
    forSale: false,
    color: "#E6C98B",
    description: "Em breve disponível"
  },
  araponga: {
    slug: "araponga",
    name: "Araponga",
    displayName: "Sítio Araponga",
    forSale: false,
    color: "#FF69B4",
    description: "Em breve disponível"
  }
};

interface InteractiveCarcaraMapProps {
  onlyForSale?: boolean;
  showLabels?: boolean;
  height?: string;
}

// Component to fit bounds after polygons are rendered
function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

// Custom marker icon for labels
const createLabelIcon = (name: string, forSale: boolean) => {
  return L.divIcon({
    className: 'custom-label',
    html: `
      <div style="
        background: ${forSale ? 'linear-gradient(135deg, #D4AF37, #B87333)' : 'rgba(30,30,30,0.9)'};
        color: ${forSale ? '#000' : '#8B9B6E'};
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        border: 2px solid ${forSale ? '#D4AF37' : '#3a3a3a'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${forSale ? '🏷️ ' : ''}${name}
      </div>
    `,
    iconSize: [100, 30],
    iconAnchor: [50, 15]
  });
};

export default function InteractiveCarcaraMap({ 
  onlyForSale = false,
  showLabels = true,
  height = "600px"
}: InteractiveCarcaraMapProps) {
  const router = useRouter();
  const [polygons, setPolygons] = useState<Array<{
    slug: string;
    name: string;
    displayName: string;
    description: string;
    coordinates: [number, number][];
    center: [number, number];
    color: string;
    area: number;
    forSale: boolean;
  }>>([]);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [loading, setLoading] = useState(true);

  // Load and parse all KML files
  const loadAllKMLs = useCallback(async () => {
    // Only fetch KML files that exist in the public/kml folder (canonical Carcará set)
    const AVAILABLE_KMLS = ['abare','bigua','mergulhao','seriema','juriti','surucua'];
    const kmlFiles = Object.keys(ALL_SITES).filter(slug => 
      AVAILABLE_KMLS.includes(slug) && (!onlyForSale || ALL_SITES[slug].forSale)
    );

    const parsedPolygons: typeof polygons = [];
    const allPoints: [number, number][] = [];

    for (const slug of kmlFiles) {
      try {
        const response = await fetch(`/kml/${slug}.kml`);
        if (!response.ok) continue;
        
        const kmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, "text/xml");
        const placemarks = xmlDoc.getElementsByTagName("Placemark");

        // Find the polygon placemark (skip label points)
        for (let i = 0; i < placemarks.length; i++) {
          const placemark = placemarks[i];
          const coordsElement = placemark.getElementsByTagName("coordinates")[0];
          const polygon = placemark.getElementsByTagName("Polygon")[0];

          if (!coordsElement || !polygon) continue;

          const coordsText = coordsElement.textContent?.trim() || "";
          const coordPairs = coordsText.split(/\s+/).filter(c => c && c.includes(','));
          
          const coordinates: [number, number][] = coordPairs.map(coord => {
            const parts = coord.split(",");
            const lng = parseFloat(parts[0]);
            const lat = parseFloat(parts[1]);
            allPoints.push([lat, lng]);
            return [lat, lng]; // Leaflet uses [lat, lng] order
          });

          if (coordinates.length < 3) continue;

          // Calculate center of polygon
          const centerLat = coordinates.reduce((sum, c) => sum + c[0], 0) / coordinates.length;
          const centerLng = coordinates.reduce((sum, c) => sum + c[1], 0) / coordinates.length;

          // Calculate approximate area
          const area = calculatePolygonArea(coordinates);

          const siteInfo = ALL_SITES[slug];
          parsedPolygons.push({
            slug,
            name: siteInfo.name,
            displayName: siteInfo.displayName,
            description: siteInfo.description,
            coordinates,
            center: [centerLat, centerLng],
            color: siteInfo.color,
            area,
            forSale: siteInfo.forSale,
          });
          break; // Only take first polygon from each file
        }
      } catch (err) {
        console.warn(`Could not load KML for ${slug}:`, err);
      }
    }

    setPolygons(parsedPolygons);

    // Set bounds to fit all polygons
    if (allPoints.length > 0) {
      const leafletBounds = L.latLngBounds(allPoints);
      setBounds(leafletBounds);
    }
    
    setLoading(false);
  }, [onlyForSale]);

  useEffect(() => {
    void loadAllKMLs();
  }, [loadAllKMLs]);

  // Calculate polygon area using Shoelace formula
  const calculatePolygonArea = (coordinates: [number, number][]): number => {
    if (coordinates.length < 3) return 0;
    
    const toMeters = (coord: [number, number]): [number, number] => {
      const lat = coord[0];
      const lng = coord[1];
      const x = lng * 111320 * Math.cos(lat * Math.PI / 180);
      const y = lat * 110540;
      return [x, y];
    };

    const metersCoords = coordinates.map(toMeters);
    
    let area = 0;
    for (let i = 0; i < metersCoords.length; i++) {
      const j = (i + 1) % metersCoords.length;
      area += metersCoords[i][0] * metersCoords[j][1];
      area -= metersCoords[j][0] * metersCoords[i][1];
    }
    
    return Math.abs(area / 2);
  };

  const handlePolygonClick = (slug: string, forSale: boolean) => {
    if (forSale) {
      router.push(`/imoveis/${slug}`);
    }
  };

  // Default center (Corumbaíba area)
  const defaultCenter: [number, number] = [-18.2810, -48.8320];

  if (loading) {
    return (
      <div 
        className="w-full bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-[#2a2a1a]"
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          <span className="text-[#8B9B6E]">Carregando mapa dos sítios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={15}
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: "100%" }}
      >
        {/* Satellite Tiles */}
        <TileLayer
          attribution='&copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        {/* Labels overlay */}
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.2}
        />

        {/* Render all polygons */}
        {polygons.map((polygon) => (
          <Polygon
            key={polygon.slug}
            positions={polygon.coordinates}
            pathOptions={{
              color: polygon.color,
              fillColor: polygon.color,
              fillOpacity: polygon.forSale ? 0.35 : 0.15,
              weight: polygon.forSale ? 4 : 2,
              opacity: polygon.forSale ? 1 : 0.5,
              dashArray: polygon.forSale ? undefined : '5, 10',
            }}
            eventHandlers={{
              click: () => handlePolygonClick(polygon.slug, polygon.forSale),
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({ 
                  fillOpacity: polygon.forSale ? 0.55 : 0.25,
                  weight: polygon.forSale ? 5 : 3,
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({ 
                  fillOpacity: polygon.forSale ? 0.35 : 0.15,
                  weight: polygon.forSale ? 4 : 2,
                });
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2" style={{ color: polygon.color }}>
                  {polygon.displayName}
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  {polygon.description}
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  📐 Área: {polygon.area > 0 ? `${(polygon.area / 10000).toFixed(2)} hectares` : "N/A"}
                </p>
                {polygon.forSale ? (
                  <button
                    onClick={() => handlePolygonClick(polygon.slug, true)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-[#D4AF37] to-[#B87333] text-black font-bold rounded-lg hover:scale-105 transition-transform text-sm"
                  >
                    🏷️ Ver Detalhes e Fazer Proposta
                  </button>
                ) : (
                  <div className="text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    Em breve disponível
                  </div>
                )}
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Labels as markers */}
        {showLabels && polygons.map((polygon) => (
          <Marker
            key={`label-${polygon.slug}`}
            position={polygon.center}
            icon={createLabelIcon(polygon.name, polygon.forSale)}
            eventHandlers={{
              click: () => handlePolygonClick(polygon.slug, polygon.forSale),
            }}
          />
        ))}

        {/* Fit bounds to show all polygons */}
        <FitBounds bounds={bounds} />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[#0a0a0a]/95 backdrop-blur-md text-[#E6C98B] px-5 py-4 rounded-xl border-2 border-[#B7791F]/40 z-[1000] max-w-xs">
        <div className="font-bold text-lg mb-2">🗺️ Mapa Interativo</div>
        <div className="text-sm text-[#8B9B6E] mb-3">
          Clique nas áreas para ver detalhes
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#D4AF37] to-[#B87333]" />
            <span className="text-[#D4C4A8]">À Venda ({polygons.filter(p => p.forSale).length})</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-sm bg-[#3a3a3a] border border-dashed border-[#666]" />
            <span className="text-[#666]">Em breve</span>
          </div>
        </div>
      </div>

      {/* For Sale count badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-black px-4 py-2 rounded-full font-bold z-[1000] shadow-lg">
        {polygons.filter(p => p.forSale).length} sítios à venda
      </div>
    </div>
  );
}
