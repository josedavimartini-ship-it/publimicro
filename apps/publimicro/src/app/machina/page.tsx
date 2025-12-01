"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Tractor, Factory, Wrench, Search, SlidersHorizontal, X, ChevronDown,
  MapPin, Calendar, Gauge, Clock, Heart, Eye, Plus, Cog, HardHat
} from "lucide-react";
import { machineryBrands, machineryCategories } from "@/data/machinery";

// Machinery types for filtering
const machineryTypes = [
  { id: "all", label: "Todos", icon: Cog },
  { id: "agricola", label: "Agrícola", icon: Tractor },
  { id: "construcao", label: "Construção", icon: HardHat },
  { id: "industrial", label: "Industrial", icon: Factory },
  { id: "florestal", label: "Florestal", icon: Tractor },
];

// Condition options
const conditionOptions = ["Novo", "Seminovo", "Usado"];

// Mock listings for demonstration
const mockListings = [
  {
    id: "1",
    title: "Trator John Deere 6145J",
    brand: "John Deere",
    model: "6145J",
    category: "agricola",
    year: 2022,
    hours: 1200,
    power: "145 CV",
    price: 485000,
    location: "Ribeirão Preto, SP",
    image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=300&fit=crop",
    views: 456,
    favorites: 67,
    featured: true,
    condition: "Seminovo",
  },
  {
    id: "2",
    title: "Escavadeira Caterpillar 320D",
    brand: "Caterpillar",
    model: "320D L",
    category: "construcao",
    year: 2021,
    hours: 3500,
    power: "148 HP",
    price: 720000,
    location: "São Paulo, SP",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=300&fit=crop",
    views: 789,
    favorites: 123,
    featured: true,
    condition: "Usado",
  },
  {
    id: "3",
    title: "Colheitadeira New Holland CR8.90",
    brand: "New Holland",
    model: "CR8.90",
    category: "agricola",
    year: 2023,
    hours: 450,
    power: "571 CV",
    price: 2800000,
    location: "Sorriso, MT",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    views: 234,
    favorites: 45,
    featured: true,
    condition: "Novo",
  },
  {
    id: "4",
    title: "Retroescavadeira Case 580N",
    brand: "Case IH",
    model: "580N",
    category: "construcao",
    year: 2020,
    hours: 2800,
    power: "97 HP",
    price: 290000,
    location: "Curitiba, PR",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
    views: 345,
    favorites: 56,
    featured: false,
    condition: "Usado",
  },
  {
    id: "5",
    title: "Pulverizador Jacto Uniport 3030",
    brand: "Jacto",
    model: "Uniport 3030",
    category: "agricola",
    year: 2022,
    hours: 800,
    power: "275 CV",
    price: 1450000,
    location: "Rondonópolis, MT",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
    views: 567,
    favorites: 89,
    featured: false,
    condition: "Seminovo",
  },
  {
    id: "6",
    title: "Pá Carregadeira Volvo L120H",
    brand: "Volvo",
    model: "L120H",
    category: "construcao",
    year: 2021,
    hours: 4200,
    power: "265 HP",
    price: 890000,
    location: "Belo Horizonte, MG",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    views: 432,
    favorites: 78,
    featured: false,
    condition: "Usado",
  },
];

export default function MachinaPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 });
  const [yearRange, setYearRange] = useState({ min: 2015, max: 2024 });
  const [hoursRange, setHoursRange] = useState({ min: 0, max: 10000 });
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  // Filter listings based on criteria
  const filteredListings = useMemo(() => {
    return mockListings.filter((listing) => {
      // Category filter
      if (selectedCategory !== "all" && listing.category !== selectedCategory) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !listing.title.toLowerCase().includes(query) &&
          !listing.brand.toLowerCase().includes(query) &&
          !listing.model.toLowerCase().includes(query) &&
          !listing.location.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(listing.brand)) {
        return false;
      }
      
      // Price filter
      if (listing.price < priceRange.min || listing.price > priceRange.max) {
        return false;
      }
      
      // Year filter
      if (listing.year < yearRange.min || listing.year > yearRange.max) {
        return false;
      }
      
      // Hours filter
      if (listing.hours < hoursRange.min || listing.hours > hoursRange.max) {
        return false;
      }
      
      // Condition filter
      if (selectedConditions.length > 0 && !selectedConditions.includes(listing.condition)) {
        return false;
      }
      
      return true;
    });
  }, [selectedCategory, searchQuery, selectedBrands, priceRange, yearRange, hoursRange, selectedConditions]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatHours = (hours: number) => {
    return new Intl.NumberFormat("pt-BR").format(hours);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5F7161] via-[#7A8B5C] to-[#5F7161] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Tractor className="w-10 h-10" />
                PubliMachina
              </h1>
              <p className="text-[#d4e4c8] text-lg">Máquinas Agrícolas, Construção & Indústria</p>
            </div>
            <Link
              href="/postar"
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#5F7161] font-bold rounded-full hover:bg-[#f0f5eb] transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Anunciar Máquina
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
            <input
              type="text"
              placeholder="Buscar tratores, escavadeiras, colheitadeiras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a] rounded-xl text-white placeholder-[#676767] focus:outline-none focus:border-[#8B9B6E] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {machineryTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedCategory(type.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === type.id
                      ? "bg-gradient-to-r from-[#5F7161] to-[#7A8B5C] text-white"
                      : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
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
          <aside
            className={`${
              showFilters ? "w-72" : "w-0"
            } transition-all duration-300 overflow-hidden flex-shrink-0`}
          >
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#8B9B6E]" />
                  Filtros
                </h3>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange({ min: 0, max: 5000000 });
                    setYearRange({ min: 2015, max: 2024 });
                    setHoursRange({ min: 0, max: 10000 });
                    setSelectedConditions([]);
                  }}
                  className="text-sm text-[#5F7161] hover:text-[#8B9B6E] transition-colors"
                >
                  Limpar
                </button>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Marca
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {machineryBrands.slice(0, 15).map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.name)}
                        onChange={() => toggleBrand(brand.name)}
                        className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#5F7161] focus:ring-[#5F7161] focus:ring-offset-0"
                      />
                      <span className="text-[#aaa] group-hover:text-white transition-colors text-sm">
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Condição
                </h4>
                <div className="space-y-2">
                  {conditionOptions.map((condition) => (
                    <label
                      key={condition}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition)}
                        onChange={() => toggleCondition(condition)}
                        className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#5F7161] focus:ring-[#5F7161] focus:ring-offset-0"
                      />
                      <span className="text-[#aaa] group-hover:text-white transition-colors text-sm">
                        {condition}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Preço
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={5000000}
                    step={50000}
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-full accent-[#5F7161]"
                  />
                  <div className="flex justify-between text-sm text-[#888]">
                    <span>R$ 0</span>
                    <span className="text-[#8B9B6E]">{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
              </div>

              {/* Year Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Ano
                </h4>
                <div className="flex gap-2">
                  <select
                    value={yearRange.min}
                    onChange={(e) =>
                      setYearRange((prev) => ({ ...prev, min: Number(e.target.value) }))
                    }
                    className="flex-1 px-3 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#5F7161]"
                  >
                    {Array.from({ length: 20 }, (_, i) => 2005 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <span className="text-[#676767] self-center">até</span>
                  <select
                    value={yearRange.max}
                    onChange={(e) =>
                      setYearRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="flex-1 px-3 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#5F7161]"
                  >
                    {Array.from({ length: 20 }, (_, i) => 2005 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hours Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Horas de Uso
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    step={500}
                    value={hoursRange.max}
                    onChange={(e) =>
                      setHoursRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-full accent-[#5F7161]"
                  />
                  <div className="flex justify-between text-sm text-[#888]">
                    <span>0h</span>
                    <span className="text-[#8B9B6E]">{formatHours(hoursRange.max)}h</span>
                  </div>
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#888] hover:text-white hover:border-[#5F7161] transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? "Ocultar" : "Filtros"}
                </button>
                <span className="text-[#888]">
                  <span className="text-white font-semibold">{filteredListings.length}</span>{" "}
                  máquinas encontradas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#676767]">Ordenar:</span>
                <select className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#5F7161]">
                  <option>Mais Recentes</option>
                  <option>Menor Preço</option>
                  <option>Maior Preço</option>
                  <option>Menos Horas</option>
                  <option>Mais Vistos</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedBrands.length > 0 || selectedConditions.length > 0 || priceRange.max < 5000000) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="flex items-center gap-1 px-3 py-1 bg-[#5F7161]/20 border border-[#5F7161]/30 rounded-full text-sm text-[#8B9B6E]"
                  >
                    {brand}
                    <button
                      onClick={() => toggleBrand(brand)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedConditions.map((condition) => (
                  <span
                    key={condition}
                    className="flex items-center gap-1 px-3 py-1 bg-[#5F7161]/20 border border-[#5F7161]/30 rounded-full text-sm text-[#8B9B6E]"
                  >
                    {condition}
                    <button
                      onClick={() => toggleCondition(condition)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {priceRange.max < 5000000 && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#5F7161]/20 border border-[#5F7161]/30 rounded-full text-sm text-[#8B9B6E]">
                    Até {formatPrice(priceRange.max)}
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 5000000 })}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/machina/${listing.id}`}
                  className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#5F7161]/50 transition-all hover:shadow-lg hover:shadow-[#5F7161]/10"
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
                      <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-[#5F7161] to-[#7A8B5C] text-white text-xs font-bold rounded-full">
                        Destaque
                      </div>
                    )}
                    <div className="absolute top-3 right-12 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      {listing.condition}
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-[#5F7161] transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#8B9B6E] transition-colors line-clamp-1">
                        {listing.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[#888] mb-3">
                      <MapPin className="w-4 h-4" />
                      {listing.location}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#676767] mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {listing.year}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatHours(listing.hours)}h
                      </div>
                      <div className="flex items-center gap-1 col-span-2">
                        <Gauge className="w-3 h-3" />
                        {listing.power}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                      <span className="text-xl font-bold text-[#8B9B6E]">
                        {formatPrice(listing.price)}
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

            {/* Empty State */}
            {filteredListings.length === 0 && (
              <div className="text-center py-16">
                <Tractor className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Nenhuma máquina encontrada
                </h3>
                <p className="text-[#676767] mb-6">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange({ min: 0, max: 5000000 });
                    setYearRange({ min: 2015, max: 2024 });
                    setHoursRange({ min: 0, max: 10000 });
                    setSelectedConditions([]);
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#5F7161] to-[#7A8B5C] text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredListings.length > 0 && (
              <div className="text-center mt-10">
                <button className="px-8 py-4 bg-gradient-to-r from-[#5F7161] to-[#7A8B5C] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#5F7161]/30 transition-all">
                  Carregar Mais Máquinas
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
