"use client";

import { useState } from "react";

interface MapSearchProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

export default function MapSearch({ onLocationSelect }: MapSearchProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapView, setMapView] = useState<"map" | "satellite">("map");
  const [showMap, setShowMap] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMap(true);
    // TODO: Implement actual geocoding and map display
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="bg-[#0b0b0b] border border-[#242424] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">🗺️</div>
        <div>
          <h3 className="text-xl font-bold text-[#e6c86b]">Buscar no Mapa</h3>
          <p className="text-sm text-[#bfa97a]">Encontre imóveis por localização</p>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite cidade, bairro, rua ou CEP..."
            className="flex-1 bg-[#0f0f0f] border border-[#242424] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#bfa97a]/50 focus:outline-none focus:border-amber-500/50"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-all"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Map View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMapView("map")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            mapView === "map"
              ? "bg-amber-500 text-black"
              : "bg-[#0f0f0f] border border-[#242424] text-[#bfa97a] hover:border-amber-500/30"
          }`}
        >
          🗺️ Mapa
        </button>
        <button
          type="button"
          onClick={() => setMapView("satellite")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            mapView === "satellite"
              ? "bg-amber-500 text-black"
              : "bg-[#0f0f0f] border border-[#242424] text-[#bfa97a] hover:border-amber-500/30"
          }`}
        >
          🛰️ Satélite
        </button>
      </div>

      {/* Map Placeholder */}
      {showMap && (
        <div className="relative aspect-video bg-[#0f0f0f] border border-[#242424] rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-[#bfa97a] mb-2">Mapa Interativo</p>
              <p className="text-sm text-[#bfa97a]/70">
                Integração com Google Maps / Leaflet em breve
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-xs text-amber-500">📍 Recursos disponíveis:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                    Visualização de imóveis
                  </span>
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                    Filtros por região
                  </span>
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                    Raio de busca
                  </span>
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                    Street View
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Location Buttons */}
      <div className="mt-4">
        <p className="text-xs text-[#bfa97a] mb-3">Localizações populares:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Goiânia, GO",
            "Brasília, DF",
            "São Paulo, SP",
            "Triângulo Mineiro, MG",
            "Interior de Goiás",
          ].map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => {
                setSearchQuery(location);
                setShowMap(true);
              }}
              className="px-3 py-1.5 bg-[#0f0f0f] border border-[#242424] hover:border-amber-500/30 text-xs text-[#bfa97a] hover:text-amber-500 rounded-full transition-all"
            >
              📍 {location}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <p className="text-xs text-amber-400 flex items-start gap-2">
          <span>💡</span>
          <span>
            Use o mapa para visualizar imóveis próximos, verificar infraestrutura da região 
            e explorar o entorno das propriedades.
          </span>
        </p>
      </div>
    </div>
  );
}
