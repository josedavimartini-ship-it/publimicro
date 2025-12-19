'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, X, Maximize2, List, Map, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Rectangle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Rectangle),
  { ssr: false }
);

interface Property {
  id: string;
  nome: string;
  localizacao?: string;
  preco?: number;
  area_total?: number;
  fotos?: string[];
  latitude?: number;
  longitude?: number;
  slug?: string;
}

interface PropertyMapSearchProps {
  properties: Property[];
  onFilterByBounds?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  showListView?: boolean;
}

export default function PropertyMapSearch({
  properties,
  onFilterByBounds,
  showListView: _showListView = true,
}: PropertyMapSearchProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('split');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');
  const [selectionBounds, setSelectionBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  // Filter properties that have valid coordinates
  const mappableProperties = properties.filter(
    (p) => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
  );

  // Calculate center from properties or use default
  const center: [number, number] = mappableProperties.length > 0
    ? [
        mappableProperties.reduce((sum, p) => sum + (p.latitude || 0), 0) / mappableProperties.length,
        mappableProperties.reduce((sum, p) => sum + (p.longitude || 0), 0) / mappableProperties.length,
      ]
    : [-18.279, -48.832]; // Default: Lago das Brisas region

  // Filter properties within selection bounds
  const filteredProperties = selectionBounds
    ? mappableProperties.filter(
        (p) =>
          p.latitude &&
          p.longitude &&
          p.latitude >= selectionBounds.south &&
          p.latitude <= selectionBounds.north &&
          p.longitude >= selectionBounds.west &&
          p.longitude <= selectionBounds.east
      )
    : mappableProperties;

  const handleClearSelection = () => {
    setSelectionBounds(null);
    if (onFilterByBounds) {
      onFilterByBounds({ north: 90, south: -90, east: 180, west: -180 });
    }
  };

  useEffect(() => {
    setMapReady(true);
  }, []);

  // Property Card Component
  const PropertyCard = ({ property, compact = false }: { property: Property; compact?: boolean }) => (
    <Link
      href={`/imoveis/${property.slug || property.id}`}
      className={`block bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#CD7F32] transition-all hover:scale-[1.02] ${
        compact ? '' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative ${compact ? 'h-32' : 'h-48'} w-full`}>
        {property.fotos && property.fotos[0] ? (
          <Image
            src={property.fotos[0]}
            alt={property.nome}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
            <MapPin className="w-8 h-8 text-[#676767]" />
          </div>
        )}
        {property.preco && (
          <div className="absolute bottom-2 left-2 bg-[#0a0a0a]/90 px-3 py-1 rounded-lg">
            <span className="text-[#CD7F32] font-bold text-sm">
              R$ {property.preco.toLocaleString('pt-BR')}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-[#E6C98B] text-sm line-clamp-1">{property.nome}</h3>
        {property.localizacao && (
          <div className="flex items-center gap-1 text-xs text-[#8B9B6E] mt-1">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{property.localizacao}</span>
          </div>
        )}
        {property.area_total && (
          <div className="flex items-center gap-1 text-xs text-[#676767] mt-1">
            <Maximize2 className="w-3 h-3" />
            {property.area_total} hectares
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <div className="space-y-4">
      {/* View Toggle & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'map'
                ? 'bg-[#CD7F32] text-[#0a0a0a]'
                : 'bg-[#1a1a1a] text-[#D4A574] border border-[#3a3a3a] hover:bg-[#2a2a2a]'
            }`}
          >
            <Map className="w-4 h-4" />
            Mapa
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-[#CD7F32] text-[#0a0a0a]'
                : 'bg-[#1a1a1a] text-[#D4A574] border border-[#3a3a3a] hover:bg-[#2a2a2a]'
            }`}
          >
            <List className="w-4 h-4" />
            Lista
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-[#CD7F32] text-[#0a0a0a]'
                : 'bg-[#1a1a1a] text-[#D4A574] border border-[#3a3a3a] hover:bg-[#2a2a2a]'
            }`}
          >
            <Filter className="w-4 h-4" />
            Dividido
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Results count */}
          <div className="text-sm">
            <span className="text-[#D4A574] font-bold">{filteredProperties.length}</span>
            <span className="text-[#8B9B6E] ml-1">
              {filteredProperties.length === 1 ? 'imóvel' : 'imóveis'}
              {selectionBounds ? ' na área' : ' encontrados'}
            </span>
          </div>

          {/* Clear selection */}
          {selectionBounds && (
            <button
              onClick={handleClearSelection}
              className="flex items-center gap-1 px-3 py-1 bg-red-900/30 text-red-400 rounded-lg text-sm hover:bg-red-900/50 transition-colors"
            >
              <X className="w-3 h-3" />
              Limpar área
            </button>
          )}

          {/* Map layer toggle */}
          {(viewMode === 'map' || viewMode === 'split') && (
            <div className="flex gap-1">
              <button
                onClick={() => setMapLayer('street')}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  mapLayer === 'street'
                    ? 'bg-[#3a3a3a] text-[#D4A574]'
                    : 'text-[#676767] hover:text-[#D4A574]'
                }`}
              >
                🗺️ Rua
              </button>
              <button
                onClick={() => setMapLayer('satellite')}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  mapLayer === 'satellite'
                    ? 'bg-[#3a3a3a] text-[#D4A574]'
                    : 'text-[#676767] hover:text-[#D4A574]'
                }`}
              >
                🛰️ Satélite
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${viewMode === 'split' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
        {/* Map View */}
        {(viewMode === 'map' || viewMode === 'split') && mapReady && (
          <div className={`${viewMode === 'map' ? 'h-[600px]' : 'h-[500px]'} rounded-xl overflow-hidden border border-[#2a2a2a]`}>
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={
                  mapLayer === 'satellite'
                    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
              />

              {/* Property Markers */}
              {filteredProperties.map((property) => {
                if (typeof property.latitude !== 'number' || typeof property.longitude !== 'number') return null;
                return (
                  <Marker key={property.id} position={[property.latitude, property.longitude]}>
                    <Popup maxWidth={280}>
                      <div className="p-1">
                        {property.fotos && property.fotos[0] && (
                          <div className="relative w-full h-24 mb-2 rounded overflow-hidden">
                            <Image
                              src={property.fotos[0]}
                              alt={property.nome}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h3 className="font-bold text-gray-900 text-sm">{property.nome}</h3>
                        {property.preco && (
                          <p className="text-[#CD7F32] font-bold text-sm mt-1">
                            R$ {property.preco.toLocaleString('pt-BR')}
                          </p>
                        )}
                        <Link
                          href={`/imoveis/${property.slug || property.id}`}
                          className="mt-2 block w-full text-center py-1.5 bg-[#CD7F32] text-white text-xs font-semibold rounded hover:bg-[#B87333] transition-colors"
                        >
                          Ver detalhes
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Selection rectangle */}
              {selectionBounds && (
                <Rectangle
                  bounds={[
                    [selectionBounds.south, selectionBounds.west],
                    [selectionBounds.north, selectionBounds.east],
                  ]}
                  pathOptions={{
                    color: '#CD7F32',
                    weight: 2,
                    fillColor: '#CD7F32',
                    fillOpacity: 0.1,
                    dashArray: '5, 5',
                  }}
                />
              )}
            </MapContainer>
          </div>
        )}

        {/* List View */}
        {(viewMode === 'list' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'h-[500px] overflow-y-auto' : ''}`}>
            <div className={`grid gap-4 ${viewMode === 'list' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    compact={viewMode === 'split'}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <MapPin className="w-12 h-12 text-[#676767] mx-auto mb-4" />
                  <p className="text-[#8B9B6E]">Nenhum imóvel encontrado nesta área</p>
                  {selectionBounds && (
                    <button
                      onClick={handleClearSelection}
                      className="mt-4 px-4 py-2 bg-[#CD7F32] text-[#0a0a0a] rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
                    >
                      Limpar filtro de área
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Property Panel (mobile) */}
      {selectedProperty && viewMode === 'map' && (
        <div className="fixed bottom-4 left-4 right-4 z-[1000] bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl p-4 shadow-xl md:hidden">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 text-[#676767] hover:text-[#D4A574]"
          >
            <X className="w-5 h-5" />
          </button>
          <PropertyCard property={selectedProperty} compact />
        </div>
      )}
    </div>
  );
}
