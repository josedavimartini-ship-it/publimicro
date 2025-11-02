"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapKMLProps {
  kmlData: string;
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

export default function LeafletMapKML({ kmlData }: LeafletMapKMLProps) {
  const [polygons, setPolygons] = useState<Array<{
    name: string;
    description: string;
    coordinates: [number, number][];
    color: string;
    area: number;
  }>>([]);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

  useEffect(() => {
    parseKMLData(kmlData);
  }, [kmlData]);

  const parseKMLData = (kml: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(kml, "text/xml");
      const placemarks = xmlDoc.getElementsByTagName("Placemark");

      const colors = [
        "#A8C97F", "#4A90E2", "#0D7377", "#F5A623", "#B7791F", 
        "#B8E986", "#E94B3C", "#417505", "#E6C98B", "#00D084",
        "#FFD700", "#FF69B4"
      ];

      const parsedPolygons: typeof polygons = [];
      const allPoints: [number, number][] = [];

      for (let i = 0; i < placemarks.length; i++) {
        const placemark = placemarks[i];
        const nameElement = placemark.getElementsByTagName("name")[0];
        const descElement = placemark.getElementsByTagName("description")[0];
        const coordsElement = placemark.getElementsByTagName("coordinates")[0];

        if (!coordsElement) continue;

        const coordsText = coordsElement.textContent?.trim() || "";
        const coordPairs = coordsText.split(/\s+/).filter(c => c);
        
        const coordinates: [number, number][] = coordPairs.map(coord => {
          const [lng, lat] = coord.split(",").map(parseFloat);
          allPoints.push([lat, lng]);
          return [lat, lng]; // Leaflet uses [lat, lng] order
        });

        if (coordinates.length < 3) continue;

        // Calculate approximate area using Shoelace formula (converted to meters²)
        const area = calculatePolygonArea(coordinates);

        parsedPolygons.push({
          name: nameElement?.textContent || `Sítio ${i + 1}`,
          description: descElement?.textContent || "Propriedade Carcará",
          coordinates,
          color: colors[i % colors.length],
          area,
        });
      }

      setPolygons(parsedPolygons);

      // Set bounds to fit all polygons
      if (allPoints.length > 0) {
        const leafletBounds = L.latLngBounds(allPoints);
        setBounds(leafletBounds);
      }

    } catch (err) {
      console.error("Error parsing KML:", err);
    }
  };

  // Calculate polygon area using Shoelace formula (approximate for small areas)
  const calculatePolygonArea = (coordinates: [number, number][]): number => {
    if (coordinates.length < 3) return 0;
    
    // Convert lat/lng to approximate meters using UTM-like projection
    const toMeters = (coord: [number, number]): [number, number] => {
      const lat = coord[0];
      const lng = coord[1];
      const x = lng * 111320 * Math.cos(lat * Math.PI / 180);
      const y = lat * 110540;
      return [x, y];
    };

    const metersCoords = coordinates.map(toMeters);
    
    // Shoelace formula
    let area = 0;
    for (let i = 0; i < metersCoords.length; i++) {
      const j = (i + 1) % metersCoords.length;
      area += metersCoords[i][0] * metersCoords[j][1];
      area -= metersCoords[j][0] * metersCoords[i][1];
    }
    
    return Math.abs(area / 2);
  };

  // Default center (Corumbaíba area)
  const defaultCenter: [number, number] = [-18.2810, -48.8310];

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: "100%", minHeight: "600px" }}
      >
        {/* Free OpenStreetMap Satellite Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Tiles &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        {/* Optional: Hybrid layer with labels */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.3}
        />

        {/* Render all polygons */}
        {polygons.map((polygon, index) => (
          <Polygon
            key={index}
            positions={polygon.coordinates}
            pathOptions={{
              color: polygon.color,
              fillColor: polygon.color,
              fillOpacity: 0.25,
              weight: 3,
              opacity: 0.8,
            }}
            eventHandlers={{
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({ fillOpacity: 0.45 });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({ fillOpacity: 0.25 });
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-base mb-2" style={{ color: polygon.color }}>
                  {polygon.name}
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  {polygon.description}
                </p>
                <p className="text-xs text-gray-600">
                  Área: {polygon.area > 0 ? `${polygon.area.toFixed(2)} m²` : "N/A"}
                </p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Fit bounds to show all polygons */}
        <FitBounds bounds={bounds} />
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-[#0a0a0a]/90 backdrop-blur-md text-[#E6C98B] px-4 py-3 rounded-lg border-2 border-[#B7791F]/40 z-[1000]">
        <div className="font-bold mb-1">Mapa Gratuito - Sítios Carcará</div>
        <div className="text-sm text-[#8B9B6E]">
          Clique nas áreas coloridas para ver detalhes • {polygons.length} propriedades
        </div>
      </div>
    </div>
  );
}
