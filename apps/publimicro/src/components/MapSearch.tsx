"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, List, Layers, ZoomIn, ZoomOut, Maximize2, Filter } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Dynamic import to avoid SSR issues
const Map = dynamic(() => import("./MapSearchView"), { ssr: false });

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

interface MapSearchProps {
  onPropertySelect?: (property: Property) => void;
  initialProperties?: Property[];
}

export default function MapSearch({ onPropertySelect, initialProperties = [] }: MapSearchProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-15.8267, -47.9218]); // Brasília
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (initialProperties.length === 0) {
      loadProperties();
    }
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      // For now, we'll fetch properties and use their location text
      // TODO: Implement actual geocoding to get lat/lon from addresses
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, location, price, area_total, fotos")
        .limit(50);

      if (error) throw error;
      
      // Mock coordinates for demonstration - in production, geocode addresses
      const propertiesWithCoords = (data || []).map((property, index) => ({
        ...property,
        latitude: -15.8267 + (Math.random() - 0.5) * 0.1,
        longitude: -47.9218 + (Math.random() - 0.5) * 0.1,
      }));

      setProperties(propertiesWithCoords);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    if (property.latitude && property.longitude) {
      setMapCenter([property.latitude, property.longitude]);
      setZoom(15);
    }
    onPropertySelect?.(property);
  };

  return (
    <div className="w-full h-screen bg-[#0a0a0a]">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between gap-4">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-[#1a1a1a]/95 backdrop-blur-md border-2 border-[#2a2a1a] rounded-lg p-1 shadow-2xl">
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              viewMode === "map"
                ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] font-bold"
                : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="hidden md:inline">Mapa</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] font-bold"
                : "text-[#8B9B6E] hover:bg-[#2a2a1a]"
            }`}
          >
            <List className="w-5 h-5" />
            <span className="hidden md:inline">Lista</span>
          </button>
        </div>

        {/* Property Count */}
        <div className="bg-[#1a1a1a]/95 backdrop-blur-md border-2 border-[#2a2a1a] rounded-lg px-4 py-2 shadow-2xl">
          <p className="text-[#E6C98B] font-bold">
            {properties.length} {properties.length === 1 ? "propriedade" : "propriedades"}
          </p>
        </div>

        {/* Map Controls (only in map view) */}
        {viewMode === "map" && (
          <div className="flex items-center gap-2 bg-[#1a1a1a]/95 backdrop-blur-md border-2 border-[#2a2a1a] rounded-lg p-1 shadow-2xl">
            <button
              onClick={() => setZoom(Math.min(zoom + 1, 18))}
              className="p-2 text-[#8B9B6E] hover:bg-[#2a2a1a] rounded-md transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 1, 3))}
              className="p-2 text-[#8B9B6E] hover:bg-[#2a2a1a] rounded-md transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Map or List View */}
      {viewMode === "map" ? (
        <div className="w-full h-full">
          <Map
            properties={properties}
            center={mapCenter}
            zoom={zoom}
            onPropertyClick={handlePropertyClick}
            selectedPropertyId={selectedProperty?.id}
          />
        </div>
      ) : (
        <div className="w-full h-full overflow-y-auto pt-20 px-4 pb-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property)}
                className={`bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:border-[#A8C97F] ${
                  selectedProperty?.id === property.id
                    ? "border-[#A8C97F] shadow-xl shadow-[#A8C97F]/30"
                    : "border-[#2a2a1a]"
                }`}
              >
                <div className="relative h-48 bg-[#2a2a1a]">
                  {property.fotos && property.fotos[0] ? (
                    <img
                      src={property.fotos[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-[#676767]" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#E6C98B] mb-2">{property.title}</h3>
                  <p className="text-sm text-[#8B9B6E] mb-3 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-[#A8C97F]">
                      R$ {property.price?.toLocaleString("pt-BR")}
                    </p>
                    {property.area_total && (
                      <p className="text-sm text-[#676767]">
                        <Maximize2 className="w-3 h-3 inline mr-1" />
                        {property.area_total} ha
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODO: Add filter panel */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <button className="bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] p-4 rounded-full shadow-2xl hover:scale-110 transition-all">
          <Filter className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
