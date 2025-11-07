"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, MapPin, DollarSign, Maximize2, Filter, ChevronDown, SlidersHorizontal, Heart, GraduationCap, ShoppingCart, Wifi, Package } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import BottomSheet from "./BottomSheet";

interface PropertyResult {
  id: string;
  title: string;
  location: string;
  price: number;
  area_total: number;
  fotos: string[];
  type: "property";
}

interface ListingResult {
  id: string;
  title: string;
  price: number;
  location: string;
  condition: string;
  category_path: string;
  photos: { url: string }[];
  type: "listing";
}

type SearchResult = PropertyResult | ListingResult;

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  query: string;
  priceMin: number;
  priceMax: number;
  areaMin: number;
  areaMax: number;
  location: string;
  sortBy: "relevance" | "price_asc" | "price_desc" | "area_desc" | "newest";
  searchType: "all" | "properties" | "listings"; // NEW: Search type selector
  // Neighborhood filters
  maxHospitalDistance?: number | null;
  maxSchoolDistance?: number | null;
  internetType?: string | null;
  roadCondition?: string | null;
}

export default function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<"all" | "properties" | "listings">("all");
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000000);
  const [areaMin, setAreaMin] = useState(0);
  const [areaMax, setAreaMax] = useState(1000);
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState<SearchFilters["sortBy"]>("relevance");
  
  // Neighborhood filter states
  const [maxHospitalDistance, setMaxHospitalDistance] = useState<number | null>(null);
  const [maxSchoolDistance, setMaxSchoolDistance] = useState<number | null>(null);
  const [internetType, setInternetType] = useState<string | null>(null);
  const [roadCondition, setRoadCondition] = useState<string | null>(null);

  // Property feature filter states
  const [propertyStatus, setPropertyStatus] = useState<string | null>(null);
  const [hasElectricity, setHasElectricity] = useState<boolean | null>(null);
  const [waterSource, setWaterSource] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null); // 'last-7' or 'last-30'

  // Available locations (you can fetch these from database)
  const locations = [
    "Goiás",
    "São Paulo",
    "Minas Gerais",
    "Rio de Janeiro",
    "Brasília",
    "Caldas Novas",
    "Pirenópolis",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      performSearch();
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Notify parent of filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        query,
        priceMin,
        priceMax,
        areaMin,
        areaMax,
        location,
        sortBy,
        searchType,
        maxHospitalDistance,
        maxSchoolDistance,
        internetType,
        roadCondition,
      });
    }
  }, [query, priceMin, priceMax, areaMin, areaMax, location, sortBy, searchType, maxHospitalDistance, maxSchoolDistance, internetType, roadCondition]);

  const performSearch = async () => {
    setLoading(true);
    setIsOpen(true);

    try {
      const combinedResults: SearchResult[] = [];

      // Search Properties (if all or properties selected)
      if (searchType === "all" || searchType === "properties") {
        let propertyQuery = supabase
          .from("properties")
          .select("id, title, location, price, area_total, fotos");

        // Text search
        if (query) {
          propertyQuery = propertyQuery.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
        }

        // Price filter
        if (priceMin > 0) propertyQuery = propertyQuery.gte("price", priceMin);
        if (priceMax < 10000000) propertyQuery = propertyQuery.lte("price", priceMax);

        // Area filter
        if (areaMin > 0) propertyQuery = propertyQuery.gte("area_total", areaMin);
        if (areaMax < 1000) propertyQuery = propertyQuery.lte("area_total", areaMax);

        // Location filter
        if (location) propertyQuery = propertyQuery.ilike("location", `%${location}%`);

        // Sorting
        switch (sortBy) {
          case "price_asc":
            propertyQuery = propertyQuery.order("price", { ascending: true });
            break;
          case "price_desc":
            propertyQuery = propertyQuery.order("price", { ascending: false });
            break;
          case "area_desc":
            propertyQuery = propertyQuery.order("area_total", { ascending: false });
            break;
          case "newest":
            propertyQuery = propertyQuery.order("created_at", { ascending: false });
            break;
        }

        const { data: properties } = await propertyQuery.limit(searchType === "all" ? 5 : 10);
        
        if (properties) {
          combinedResults.push(...properties.map(p => ({ ...p, type: "property" as const })));
        }
      }

      // Search AcheMeCoisas Listings (if all or listings selected)
      if (searchType === "all" || searchType === "listings") {
        let listingQuery = supabase
          .from("listings")
          .select("id, title, price, location, condition, category_path, photos")
          .eq("status", "active");

        // Text search - using full-text search on search_vector
        if (query) {
          listingQuery = listingQuery.textSearch("search_vector", query, {
            type: "websearch",
            config: "portuguese",
          });
        }

        // Price filter
        if (priceMin > 0) listingQuery = listingQuery.gte("price", priceMin);
        if (priceMax < 10000000) listingQuery = listingQuery.lte("price", priceMax);

        // Location filter
        if (location) listingQuery = listingQuery.ilike("location", `%${location}%`);

        // Sorting
        switch (sortBy) {
          case "price_asc":
            listingQuery = listingQuery.order("price", { ascending: true });
            break;
          case "price_desc":
            listingQuery = listingQuery.order("price", { ascending: false });
            break;
          case "newest":
            listingQuery = listingQuery.order("created_at", { ascending: false });
            break;
        }

        const { data: listings } = await listingQuery.limit(searchType === "all" ? 5 : 10);

        if (listings) {
          combinedResults.push(...listings.map(l => ({ ...l, type: "listing" as const })));
        }
      }

      setResults(combinedResults);
      if (onSearch) {
        onSearch(query);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setPriceMin(0);
    setPriceMax(10000000);
    setAreaMin(0);
    setAreaMax(1000);
    setLocation("");
    setSortBy("relevance");
  };

  const activeFiltersCount = 
    (priceMin > 0 ? 1 : 0) +
    (priceMax < 10000000 ? 1 : 0) +
    (areaMin > 0 ? 1 : 0) +
    (areaMax < 1000 ? 1 : 0) +
    (location ? 1 : 0) +
    (sortBy !== "relevance" ? 1 : 0);

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl">
      {/* Search Input - Enhanced Size */}
      <div className="relative shadow-2xl">
        <div className="absolute left-6 md:left-7 top-1/2 -translate-y-1/2 z-10">
          <Search className="w-7 h-7 md:w-6 md:h-6 text-[#A8C97F]" strokeWidth={2.5} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Buscar propriedades por nome ou localização..."
          className="w-full pl-16 md:pl-16 pr-40 md:pr-36 py-6 md:py-5 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border-4 md:border-3 border-[#A8C97F]/30 rounded-2xl text-[#E6C98B] text-xl md:text-lg placeholder-[#8B9B6E] font-semibold focus:border-[#A8C97F] focus:outline-none focus:ring-4 focus:ring-[#A8C97F]/20 transition-all shadow-lg hover:shadow-[#A8C97F]/20"
        />

        <div className="absolute right-4 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-3 md:p-2 hover:bg-[#2a2a1a] rounded-full transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-6 h-6 md:w-5 md:h-5 text-[#8B9B6E]" strokeWidth={2.5} />
            </button>
          )}
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 md:gap-2 px-5 py-3 md:px-4 md:py-2 rounded-full transition-all font-bold text-base md:text-sm shadow-lg hover:scale-105 ${
              showFilters
                ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a]"
                : "bg-[#2a2a1a] text-[#A8C97F] hover:bg-[#3a3a2a] border-2 border-[#A8C97F]/30"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5 md:w-4 md:h-4" strokeWidth={2.5} />
            <span className="font-extrabold">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-6 h-6 md:w-5 md:h-5 bg-[#B7791F] text-[#0a0a0a] text-sm md:text-xs font-black rounded-full flex items-center justify-center shadow-md">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel - Desktop */}
      {showFilters && (
        <div className="hidden md:block absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#D4A574]">Filtros de Busca</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-[#8B9B6E] hover:text-[#A8C97F] transition-colors"
            >
              Limpar Filtros
            </button>
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Faixa de Preço
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Mínimo</label>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    placeholder="R$ 0"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Máximo</label>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    placeholder="R$ 10.000.000"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  />
                </div>
              </div>
              {/* Price Range Slider */}
              <div className="mt-3">
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full h-2 bg-[#2a2a1a] rounded-lg appearance-none cursor-pointer accent-[#A8C97F]"
                />
                <div className="flex justify-between text-xs text-[#676767] mt-1">
                  <span>R$ 0</span>
                  <span>R$ 10M</span>
                </div>
              </div>
            </div>

            {/* Area Range */}
            <div>
              <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                <Maximize2 className="w-4 h-4 inline mr-1" />
                Área Total (hectares)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Mínimo</label>
                  <input
                    type="number"
                    value={areaMin}
                    onChange={(e) => setAreaMin(Number(e.target.value))}
                    placeholder="0 ha"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Máximo</label>
                  <input
                    type="number"
                    value={areaMax}
                    onChange={(e) => setAreaMax(Number(e.target.value))}
                    placeholder="1000 ha"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  />
                </div>
              </div>
              {/* Area Range Slider */}
              <div className="mt-3">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={areaMax}
                  onChange={(e) => setAreaMax(Number(e.target.value))}
                  className="w-full h-2 bg-[#2a2a1a] rounded-lg appearance-none cursor-pointer accent-[#A8C97F]"
                />
                <div className="flex justify-between text-xs text-[#676767] mt-1">
                  <span>0 ha</span>
                  <span>1000 ha</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                <MapPin className="w-4 h-4 inline mr-1" />
                Localização
              </label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Todas as localidades</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#676767] pointer-events-none" />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                <Filter className="w-4 h-4 inline mr-1" />
                Ordenar por
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSortBy("relevance")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "relevance"
                      ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Relevância
                </button>
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "newest"
                      ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Mais Recentes
                </button>
                <button
                  onClick={() => setSortBy("price_asc")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "price_asc"
                      ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Menor Preço
                </button>
                <button
                  onClick={() => setSortBy("price_desc")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "price_desc"
                      ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Maior Preço
                </button>
                <button
                  onClick={() => setSortBy("area_desc")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all col-span-2 ${
                    sortBy === "area_desc"
                      ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Maior Área
                </button>
              </div>
            </div>

            {/* Neighborhood Filters - NEW */}
            <div className="border-t border-[#2a2a1a] pt-6 mt-6">
              <h4 className="text-lg font-bold text-[#E6C98B] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Região & Infraestrutura
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Max Hospital Distance */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                    <Heart className="w-4 h-4 inline mr-1" />
                    Distância Máxima Hospital
                  </label>
                  <select
                    value={maxHospitalDistance || ""}
                    onChange={(e) => setMaxHospitalDistance(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Qualquer distância</option>
                    <option value="5">Até 5 km</option>
                    <option value="10">Até 10 km</option>
                    <option value="20">Até 20 km</option>
                    <option value="50">Até 50 km</option>
                  </select>
                </div>

                {/* Max School Distance */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                    <GraduationCap className="w-4 h-4 inline mr-1" />
                    Distância Máxima Escola
                  </label>
                  <select
                    value={maxSchoolDistance || ""}
                    onChange={(e) => setMaxSchoolDistance(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Qualquer distância</option>
                    <option value="2">Até 2 km</option>
                    <option value="5">Até 5 km</option>
                    <option value="10">Até 10 km</option>
                    <option value="20">Até 20 km</option>
                  </select>
                </div>

                {/* Internet Type */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                    <Wifi className="w-4 h-4 inline mr-1" />
                    Tipo de Internet
                  </label>
                  <select
                    value={internetType || ""}
                    onChange={(e) => setInternetType(e.target.value || null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Qualquer tipo</option>
                    <option value="fiber">🚀 Fibra Óptica</option>
                    <option value="5G">📱 5G</option>
                    <option value="4G">📱 4G</option>
                    <option value="satellite">📡 Satélite</option>
                    <option value="cable">🔌 Cabo</option>
                  </select>
                </div>

                {/* Road Condition */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Condição da Via
                  </label>
                  <select
                    value={roadCondition || ""}
                    onChange={(e) => setRoadCondition(e.target.value || null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Qualquer condição</option>
                    <option value="paved">✅ Asfaltada</option>
                    <option value="gravel">🟡 Cascalho</option>
                    <option value="dirt">🔶 Terra</option>
                    <option value="mixed">🔀 Mista</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={() => {
              performSearch();
              setShowFilters(false);
            }}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
          >
            Aplicar Filtros
          </button>
        </div>
      )}

      {/* Filters Bottom Sheet - Mobile */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros de Busca"
        showHandle
        maxHeight="95vh"
      >
        <div className="md:hidden">
          <button
            onClick={resetFilters}
            className="text-sm text-[#8B9B6E] hover:text-[#A8C97F] transition-colors mb-6 block"
          >
            Limpar Filtros
          </button>

          <div className="space-y-6 pb-24">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Faixa de Preço
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Mínimo</label>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    placeholder="R$ 0"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Máximo</label>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    placeholder="R$ 10.000.000"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Area Range */}
            <div>
              <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                <Maximize2 className="w-4 h-4 inline mr-1" />
                Área Total (hectares)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Mínimo</label>
                  <input
                    type="number"
                    value={areaMin}
                    onChange={(e) => setAreaMin(Number(e.target.value))}
                    placeholder="0 ha"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Máximo</label>
                  <input
                    type="number"
                    value={areaMax}
                    onChange={(e) => setAreaMax(Number(e.target.value))}
                    placeholder="1000 ha"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                <MapPin className="w-4 h-4 inline mr-1" />
                Localização
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">Todas as localidades</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-[#8B9B6E] mb-3">
                <Filter className="w-4 h-4 inline mr-1" />
                Ordenar por
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSortBy("relevance")}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "relevance"
                      ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Relevância
                </button>
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "newest"
                      ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Mais Recentes
                </button>
                <button
                  onClick={() => setSortBy("price_asc")}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "price_asc"
                      ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Menor Preço
                </button>
                <button
                  onClick={() => setSortBy("price_desc")}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "price_desc"
                      ? "bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Maior Preço
                </button>
              </div>
            </div>

            {/* Neighborhood Filters */}
            <div className="border-t border-[#2a2a1a] pt-6">
              <h4 className="text-lg font-bold text-[#E6C98B] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Região & Infraestrutura
              </h4>

              <div className="space-y-4">
                {/* Max Hospital Distance */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-2">
                    <Heart className="w-4 h-4 inline mr-1" />
                    Distância Máxima Hospital
                  </label>
                  <select
                    value={maxHospitalDistance || ""}
                    onChange={(e) => setMaxHospitalDistance(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  >
                    <option value="">Qualquer distância</option>
                    <option value="5">Até 5 km</option>
                    <option value="10">Até 10 km</option>
                    <option value="20">Até 20 km</option>
                    <option value="50">Até 50 km</option>
                  </select>
                </div>

                {/* Max School Distance */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-1" />
                    Distância Máxima Escola
                  </label>
                  <select
                    value={maxSchoolDistance || ""}
                    onChange={(e) => setMaxSchoolDistance(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  >
                    <option value="">Qualquer distância</option>
                    <option value="2">Até 2 km</option>
                    <option value="5">Até 5 km</option>
                    <option value="10">Até 10 km</option>
                    <option value="20">Até 20 km</option>
                  </select>
                </div>

                {/* Internet Type */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-2">
                    <Wifi className="w-4 h-4 inline mr-1" />
                    Tipo de Internet
                  </label>
                  <select
                    value={internetType || ""}
                    onChange={(e) => setInternetType(e.target.value || null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  >
                    <option value="">Qualquer tipo</option>
                    <option value="fiber">🚀 Fibra Óptica</option>
                    <option value="5G">📱 5G</option>
                    <option value="4G">📱 4G</option>
                    <option value="satellite">📡 Satélite</option>
                    <option value="cable">🔌 Cabo</option>
                  </select>
                </div>

                {/* Road Condition */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Condição da Via
                  </label>
                  <select
                    value={roadCondition || ""}
                    onChange={(e) => setRoadCondition(e.target.value || null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  >
                    <option value="">Qualquer condição</option>
                    <option value="paved">✅ Asfaltada</option>
                    <option value="gravel">🟡 Cascalho</option>
                    <option value="dirt">🔶 Terra</option>
                    <option value="mixed">🔀 Mista</option>
                  </select>
                </div>

                {/* Property Status */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-2">
                    Status do Imóvel
                  </label>
                  <select
                    value={propertyStatus || ""}
                    onChange={(e) => setPropertyStatus(e.target.value || null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  >
                    <option value="">Todos os status</option>
                    <option value="active">🟢 Disponível</option>
                    <option value="sold">🔴 Vendido</option>
                    <option value="rented">🟡 Alugado</option>
                  </select>
                </div>

                {/* Electricity */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-2">
                    ⚡ Energia Elétrica
                  </label>
                  <select
                    value={hasElectricity === null ? "" : hasElectricity ? "yes" : "no"}
                    onChange={(e) => setHasElectricity(e.target.value === "" ? null : e.target.value === "yes")}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  >
                    <option value="">Tanto faz</option>
                    <option value="yes">✅ Com energia</option>
                    <option value="no">❌ Sem energia</option>
                  </select>
                </div>

                {/* Water Source */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-2">
                    💧 Fonte de Água
                  </label>
                  <select
                    value={waterSource || ""}
                    onChange={(e) => setWaterSource(e.target.value || null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  >
                    <option value="">Qualquer fonte</option>
                    <option value="public">🏘️ Pública</option>
                    <option value="well">🕳️ Poço</option>
                    <option value="river">🌊 Rio</option>
                    <option value="cistern">💧 Cisterna</option>
                  </select>
                </div>

                {/* Recently Added */}
                <div>
                  <label className="block text-sm font-semibold text-[#8B9B6E] mb-2">
                    📅 Adicionados Recentemente
                  </label>
                  <select
                    value={dateFilter || ""}
                    onChange={(e) => setDateFilter(e.target.value || null)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#A8C97F] focus:outline-none"
                  >
                    <option value="">Qualquer data</option>
                    <option value="last-7">Últimos 7 dias</option>
                    <option value="last-30">Últimos 30 dias</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent">
            <button
              onClick={() => {
                performSearch();
                setShowFilters(false);
              }}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg text-lg"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl shadow-2xl overflow-hidden z-40"
          role="region"
          aria-label="Search results"
        >
          {/* Search Type Tabs */}
          <div className="flex border-b border-[#2a2a1a] bg-[#0a0a0a]">
            <button
              onClick={() => setSearchType("all")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
                searchType === "all"
                  ? "text-[#E6C98B] border-b-2 border-[#CD7F32]"
                  : "text-[#676767] hover:text-[#8B9B6E]"
              }`}
            >
              🔍 Todos ({results.length})
            </button>
            <button
              onClick={() => setSearchType("properties")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
                searchType === "properties"
                  ? "text-[#E6C98B] border-b-2 border-[#CD7F32]"
                  : "text-[#676767] hover:text-[#8B9B6E]"
              }`}
            >
              🏡 Propriedades ({results.filter(r => r.type === "property").length})
            </button>
            <button
              onClick={() => setSearchType("listings")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
                searchType === "listings"
                  ? "text-[#E6C98B] border-b-2 border-[#CD7F32]"
                  : "text-[#676767] hover:text-[#8B9B6E]"
              }`}
            >
              📦 AcheMeCoisas ({results.filter(r => r.type === "listing").length})
            </button>
          </div>

          {/* Screen Reader Results Count */}
          <div 
            role="status" 
            aria-live="polite" 
            aria-atomic="true"
            className="sr-only"
          >
            {loading 
              ? "Searching..." 
              : `${results.length} ${results.length === 1 ? 'result' : 'results'} found`}
          </div>

          {loading ? (
            <div className="p-6 text-center text-[#8B9B6E]">
              <div className="animate-spin w-8 h-8 border-4 border-[#A8C97F] border-t-transparent rounded-full mx-auto mb-2"></div>
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => {
                const isProperty = result.type === "property";
                const href = isProperty ? `/imoveis/${result.id}` : `/acheme-coisas/${result.id}`;
                
                return (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={href}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-4 p-4 hover:bg-[#2a2a1a]/50 transition-colors border-b border-[#2a2a1a] last:border-0"
                  >
                    {/* Result Image */}
                    <div className="w-20 h-20 bg-[#2a2a1a] rounded-lg overflow-hidden flex-shrink-0 relative">
                      {isProperty ? (
                        (result as PropertyResult).fotos && (result as PropertyResult).fotos[0] ? (
                          <Image
                            src={(result as PropertyResult).fotos[0]}
                            alt={isProperty ? (result as PropertyResult).title : (result as ListingResult).title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-[#959595]" />
                          </div>
                        )
                      ) : (
                        (result as ListingResult).photos && (result as ListingResult).photos[0] ? (
                          <Image
                            src={(result as ListingResult).photos[0].url}
                            alt={(result as ListingResult).title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-[#959595]" />
                          </div>
                        )
                      )}
                      
                      {/* Type Badge */}
                      <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        isProperty 
                          ? "bg-[#A8C97F] text-[#0a0a0a]" 
                          : "bg-[#CD7F32] text-[#0a0a0a]"
                      }`}>
                        {isProperty ? "🏡" : "📦"}
                      </div>
                    </div>

                    {/* Result Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#D4A574] font-semibold truncate">
                        {isProperty ? (result as PropertyResult).title : (result as ListingResult).title}
                      </h4>
                      
                      <p className="text-[#8B9B6E] text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {isProperty ? (result as PropertyResult).location : (result as ListingResult).location}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[#B7791F] font-bold text-sm">
                          R$ {isProperty 
                            ? ((result as PropertyResult).price || 0).toLocaleString("pt-BR")
                            : (result as ListingResult).price.toLocaleString("pt-BR")
                          }
                        </span>
                        
                        {isProperty && (result as PropertyResult).area_total && (
                          <span className="text-[#8B9B6E] text-sm">
                            {(result as PropertyResult).area_total} ha
                          </span>
                        )}
                        
                        {!isProperty && (result as ListingResult).condition && (
                          <span className="text-xs bg-[#1a1a1a] text-[#A8C97F] px-2 py-0.5 rounded-full">
                            {(result as ListingResult).condition}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-[#676767]">
              Nenhum resultado encontrado para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
