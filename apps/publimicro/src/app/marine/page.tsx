"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Ship, Anchor, Sailboat, Waves, Filter, X, Search, MapPin, 
  Heart, Eye, ChevronDown, Plus, Ruler, Calendar, Fuel, Users
} from "lucide-react";
import { marineBrands } from "@/data/marine";

// Marine Types
const marineTypes = [
  { id: "all", label: "Todos", icon: Waves },
  { id: "lancha", label: "Lanchas", icon: Ship },
  { id: "jetski", label: "Jet Skis", icon: Waves },
  { id: "iate", label: "Iates", icon: Ship },
  { id: "veleiro", label: "Veleiros", icon: Sailboat },
  { id: "inflavel", label: "Infláveis", icon: Anchor },
];

// Hull types
const hullTypes = ["Fibra", "Alumínio", "Madeira", "Inflável", "Aço"];

// Fuel types
const fuelTypes = ["Gasolina", "Diesel", "Elétrico"];

// Mock marine listings
const mockMarineListings = [
  {
    id: 1,
    title: "Lancha Focker 265 Open",
    brand: "Focker",
    model: "265 Open",
    year: 2022,
    length: "26 pés",
    price: 320000,
    location: "Guarujá, SP",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=600&fit=crop",
    type: "lancha",
    views: 234,
    favorites: 18,
    featured: true,
  },
  {
    id: 2,
    title: "Jet Ski Sea-Doo GTX 300",
    brand: "Sea-Doo",
    model: "GTX 300",
    year: 2023,
    length: "11 pés",
    price: 89000,
    location: "Florianópolis, SC",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    type: "jetski",
    views: 456,
    favorites: 32,
    featured: true,
  },
  {
    id: 3,
    title: "Veleiro Bavaria 40 Cruiser",
    brand: "Bavaria",
    model: "40 Cruiser",
    year: 2019,
    length: "40 pés",
    price: 680000,
    location: "Ilhabela, SP",
    image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop",
    type: "veleiro",
    views: 189,
    favorites: 24,
    featured: false,
  },
  {
    id: 4,
    title: "Lancha Ventura 250 Comfort",
    brand: "Ventura",
    model: "250 Comfort",
    year: 2021,
    length: "25 pés",
    price: 275000,
    location: "Angra dos Reis, RJ",
    image: "https://images.unsplash.com/photo-1605281317010-fe5gy7b0a2b5?w=800&h=600&fit=crop",
    type: "lancha",
    views: 312,
    favorites: 21,
    featured: false,
  },
  {
    id: 5,
    title: "Iate Azimut 54 Flybridge",
    brand: "Azimut",
    model: "54 Flybridge",
    year: 2018,
    length: "54 pés",
    price: 3500000,
    location: "Balneário Camboriú, SC",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&h=600&fit=crop",
    type: "iate",
    views: 567,
    favorites: 45,
    featured: true,
  },
  {
    id: 6,
    title: "Jet Ski Yamaha FX Cruiser",
    brand: "Yamaha",
    model: "FX Cruiser SVHO",
    year: 2022,
    length: "12 pés",
    price: 115000,
    location: "Búzios, RJ",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop",
    type: "jetski",
    views: 289,
    favorites: 19,
    featured: false,
  },
  {
    id: 7,
    title: "Lancha Real 26 Open",
    brand: "Real",
    model: "26 Open",
    year: 2020,
    length: "26 pés",
    price: 245000,
    location: "Santos, SP",
    image: "https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&h=600&fit=crop",
    type: "lancha",
    views: 198,
    favorites: 14,
    featured: false,
  },
  {
    id: 8,
    title: "Inflável Flexboat SR-550",
    brand: "Flexboat",
    model: "SR-550",
    year: 2023,
    length: "18 pés",
    price: 185000,
    location: "Paraty, RJ",
    image: "https://images.unsplash.com/photo-1575912143736-6f6c9a0461fc?w=800&h=600&fit=crop",
    type: "inflavel",
    views: 145,
    favorites: 11,
    featured: false,
  },
];

export default function MarinePage() {
  const [selectedType, setSelectedType] = useState("all");
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });
  const [yearRange, setYearRange] = useState({ min: 2010, max: 2024 });
  const [selectedHull, setSelectedHull] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  
  // Filtered listings
  const filteredListings = useMemo(() => {
    return mockMarineListings.filter(listing => {
      // Type filter
      if (selectedType !== "all" && listing.type !== selectedType) return false;
      
      // Brand filter
      if (selectedBrand && listing.brand !== selectedBrand) return false;
      
      // Price filter
      if (listing.price < priceRange.min || listing.price > priceRange.max) return false;
      
      // Year filter
      if (listing.year < yearRange.min || listing.year > yearRange.max) return false;
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          listing.title.toLowerCase().includes(query) ||
          listing.brand.toLowerCase().includes(query) ||
          listing.model.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      return true;
    });
  }, [selectedType, selectedBrand, priceRange, yearRange, searchQuery]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const clearFilters = () => {
    setSelectedBrand("");
    setPriceRange({ min: 0, max: 5000000 });
    setYearRange({ min: 2010, max: 2024 });
    setSelectedHull("");
    setSelectedFuel("");
    setSearchQuery("");
    setSelectedType("all");
  };

  const hasActiveFilters = selectedBrand || selectedHull || selectedFuel || 
    priceRange.min > 0 || priceRange.max < 5000000 || 
    yearRange.min > 2010 || yearRange.max < 2024 || searchQuery;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D7377]/20 via-[#14FFEC]/10 to-[#0D7377]/20 border-b border-[#0D7377]/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0D7377] via-[#14FFEC] to-[#0D7377]">
                PubliMarine
              </h1>
              <p className="text-lg text-[#d8c68e] mt-2">Náutica, Embarcações & Esportes Aquáticos</p>
            </div>
            
            <Link 
              href="/postar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0D7377] to-[#14FFEC] text-[#0a0a0a] font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#0D7377]/20"
            >
              <Plus className="w-5 h-5" />
              Anunciar Embarcação
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
            <input
              type="text"
              placeholder="Buscar lanchas, jet skis, veleiros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-[#2a2a1a] rounded-xl text-white placeholder-[#676767] focus:outline-none focus:border-[#0D7377] transition-colors"
            />
          </div>
          
          {/* Type Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {marineTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    selectedType === type.id
                      ? "bg-gradient-to-r from-[#0D7377] to-[#14FFEC] text-[#0a0a0a]"
                      : "bg-[#1a1a1a] text-[#d8c68e] hover:bg-[#2a2a2a] border border-[#2a2a1a]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? "w-72" : "w-0"} flex-shrink-0 transition-all overflow-hidden`}>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a1a] rounded-2xl p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#d8c68e] flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#0D7377] hover:text-[#14FFEC] flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Limpar
                  </button>
                )}
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#B7791F] mb-2">Marca</label>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#2a2a1a] rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-[#0D7377]"
                  >
                    <option value="">Todas as marcas</option>
                    {marineBrands.map((brand) => (
                      <option key={brand.id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767] pointer-events-none" />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#B7791F] mb-2">Preço</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full accent-[#0D7377]"
                  />
                  <div className="flex justify-between text-sm text-[#676767]">
                    <span>R$ 0</span>
                    <span className="text-[#14FFEC] font-medium">{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
              </div>

              {/* Year Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#B7791F] mb-2">Ano</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="De"
                      value={yearRange.min}
                      onChange={(e) => setYearRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#2a2a1a] rounded-lg text-white text-sm focus:outline-none focus:border-[#0D7377]"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Até"
                      value={yearRange.max}
                      onChange={(e) => setYearRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#2a2a1a] rounded-lg text-white text-sm focus:outline-none focus:border-[#0D7377]"
                    />
                  </div>
                </div>
              </div>

              {/* Hull Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#B7791F] mb-2">Casco</label>
                <div className="space-y-2">
                  {hullTypes.map((hull) => (
                    <label key={hull} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="hull"
                        checked={selectedHull === hull}
                        onChange={() => setSelectedHull(selectedHull === hull ? "" : hull)}
                        className="w-4 h-4 accent-[#0D7377]"
                      />
                      <span className="text-[#d8c68e] group-hover:text-white transition-colors">{hull}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#B7791F] mb-2">Combustível</label>
                <div className="space-y-2">
                  {fuelTypes.map((fuel) => (
                    <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="fuel"
                        checked={selectedFuel === fuel}
                        onChange={() => setSelectedFuel(selectedFuel === fuel ? "" : fuel)}
                        className="w-4 h-4 accent-[#0D7377]"
                      />
                      <span className="text-[#d8c68e] group-hover:text-white transition-colors">{fuel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a1a] rounded-xl text-[#d8c68e] hover:bg-[#2a2a2a] transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                <p className="text-[#676767]">
                  <span className="text-[#14FFEC] font-bold">{filteredListings.length}</span> embarcações encontradas
                </p>
              </div>
              
              <select className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a1a] rounded-xl text-[#d8c68e] focus:outline-none focus:border-[#0D7377]">
                <option>Mais relevantes</option>
                <option>Menor preço</option>
                <option>Maior preço</option>
                <option>Mais recentes</option>
                <option>Mais vistos</option>
              </select>
            </div>

            {/* Listings Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/marine/${listing.id}`}
                    className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#0D7377]/50 transition-all hover:shadow-lg hover:shadow-[#0D7377]/10"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {listing.featured && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-[#0D7377] to-[#14FFEC] text-[#0a0a0a] text-xs font-bold rounded-full">
                          Destaque
                        </div>
                      )}
                      <button 
                        className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#0D7377] transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to favorites logic
                        }}
                      >
                        <Heart className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-white group-hover:text-[#14FFEC] transition-colors line-clamp-1">
                          {listing.title}
                        </h3>
                        <span className="text-xs text-[#676767] bg-[#0d0d0d] px-2 py-1 rounded-full whitespace-nowrap">
                          {listing.year}
                        </span>
                      </div>

                      <p className="text-xl font-bold text-[#0D7377] mb-3">
                        {formatPrice(listing.price)}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-[#676767] mb-3">
                        <span className="flex items-center gap-1">
                          <Ruler className="w-4 h-4" />
                          {listing.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {listing.year}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#2a2a1a]">
                        <span className="flex items-center gap-1 text-sm text-[#676767]">
                          <MapPin className="w-4 h-4" />
                          {listing.location}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-[#676767]">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {listing.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {listing.favorites}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Anchor className="w-16 h-16 text-[#0D7377]/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#d8c68e] mb-2">Nenhuma embarcação encontrada</h3>
                <p className="text-[#676767] mb-6">Tente ajustar os filtros ou fazer uma nova busca</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-[#0D7377] to-[#14FFEC] text-[#0a0a0a] font-bold rounded-xl hover:scale-105 transition-all"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredListings.length > 0 && (
              <div className="text-center mt-10">
                <button className="px-8 py-4 bg-[#1a1a1a] border border-[#2a2a1a] text-[#d8c68e] font-bold rounded-xl hover:bg-[#2a2a2a] hover:border-[#0D7377] transition-all">
                  Carregar mais embarcações
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Brands */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-[#2a2a1a]">
        <h2 className="text-2xl font-bold text-[#d8c68e] mb-8">Marcas em Destaque</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {marineBrands.slice(0, 6).map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.name)}
              className="p-6 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a1a] rounded-xl hover:border-[#0D7377] transition-all text-center group"
            >
              <span className="text-lg font-bold text-[#d8c68e] group-hover:text-[#14FFEC] transition-colors">
                {brand.name}
              </span>
              <p className="text-xs text-[#676767] mt-1">{brand.country}</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
