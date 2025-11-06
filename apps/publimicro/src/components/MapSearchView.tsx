"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  area_total: number;
  fotos: string[];
  latitude?: number;
  longitude?: number;
}

interface MapSearchViewProps {
  properties: Property[];
  center: [number, number];
  zoom: number;
  onPropertyClick: (property: Property) => void;
  selectedPropertyId?: string;
}

export default function MapSearchView({
  properties,
  center,
  zoom,
  onPropertyClick,
  selectedPropertyId,
}: MapSearchViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize map
    if (!mapRef.current) {
      const map = L.map("map-search-container").setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map center and zoom
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) return;

      const isSelected = property.id === selectedPropertyId;

      // Create custom icon
      const iconHtml = renderToStaticMarkup(
        <div
          style={{
            background: isSelected
              ? "linear-gradient(135deg, #A8C97F 0%, #0D7377 100%)"
              : "linear-gradient(135deg, #E6C98B 0%, #B7791F 100%)",
            border: "3px solid #fff",
            borderRadius: "50% 50% 50% 0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            width: isSelected ? "48px" : "40px",
            height: isSelected ? "48px" : "40px",
            transform: "rotate(-45deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ transform: "rotate(45deg)", color: "#0a0a0a" }}>
            <svg
              width={isSelected ? "24" : "20"}
              height={isSelected ? "24" : "20"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      );

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-map-marker",
        iconSize: [isSelected ? 48 : 40, isSelected ? 48 : 40],
        iconAnchor: [isSelected ? 24 : 20, isSelected ? 48 : 40],
        popupAnchor: [0, isSelected ? -48 : -40],
      });

      const marker = L.marker([property.latitude, property.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(mapRef.current!);

      // Popup content
      const popupContent = `
        <div style="min-width: 200px;">
          ${
            property.fotos && property.fotos[0]
              ? `<img src="${property.fotos[0]}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />`
              : ""
          }
          <h3 style="color: #E6C98B; font-weight: bold; font-size: 16px; margin-bottom: 4px;">${property.title}</h3>
          <p style="color: #8B9B6E; font-size: 12px; margin-bottom: 8px;">${property.location}</p>
          <p style="color: #A8C97F; font-weight: bold; font-size: 18px;">R$ ${property.price?.toLocaleString("pt-BR")}</p>
          ${property.area_total ? `<p style="color: #676767; font-size: 12px; margin-top: 4px;">${property.area_total} hectares</p>` : ""}
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: "custom-popup",
      });

      marker.on("click", () => {
        onPropertyClick(property);
      });

      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
    });
  }, [properties, selectedPropertyId]);

  return (
    <>
      <div id="map-search-container" className="w-full h-full" />
      <style jsx global>{`
        .custom-map-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
          border: 2px solid #2a2a1a;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }
        
        .leaflet-popup-tip {
          background: #1a1a1a;
          border: 2px solid #2a2a1a;
        }
        
        .leaflet-popup-close-button {
          color: #E6C98B !important;
          font-size: 24px !important;
          font-weight: bold !important;
        }
        
        .leaflet-popup-close-button:hover {
          color: #A8C97F !important;
        }
      `}</style>
    </>
  );
}
