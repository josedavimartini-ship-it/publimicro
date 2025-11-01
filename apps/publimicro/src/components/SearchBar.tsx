"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, MapPin, DollarSign, Maximize2, Filter, ChevronDown, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  id: string;
  nome: string;
  localizacao: string;
  preco: number;
  lance_inicial: number;
  area_total: number;
  fotos: string[];
}

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
}

export default function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000000);
  const [areaMin, setAreaMin] = useState(0);
  const [areaMax, setAreaMax] = useState(1000);
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState<SearchFilters["sortBy"]>("relevance");

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
      });
    }
  }, [query, priceMin, priceMax, areaMin, areaMax, location, sortBy]);

  const performSearch = async () => {
    setLoading(true);
    setIsOpen(true);

    try {
      let queryBuilder = supabase
        .from("sitios")
        .select("id, nome, localizacao, preco, lance_inicial, area_total, fotos");

      // Text search
      if (query) {
        queryBuilder = queryBuilder.or(`nome.ilike.%${query}%,localizacao.ilike.%${query}%`);
      }

      // Price filter
      if (priceMin > 0) {
        queryBuilder = queryBuilder.gte("preco", priceMin);
      }
      if (priceMax < 10000000) {
        queryBuilder = queryBuilder.lte("preco", priceMax);
      }

      // Area filter
      if (areaMin > 0) {
        queryBuilder = queryBuilder.gte("area_total", areaMin);
      }
      if (areaMax < 1000) {
        queryBuilder = queryBuilder.lte("area_total", areaMax);
      }

      // Location filter
      if (location) {
        queryBuilder = queryBuilder.ilike("localizacao", `%${location}%`);
      }

      // Sorting
      switch (sortBy) {
        case "price_asc":
          queryBuilder = queryBuilder.order("preco", { ascending: true });
          break;
        case "price_desc":
          queryBuilder = queryBuilder.order("preco", { ascending: false });
          break;
        case "area_desc":
          queryBuilder = queryBuilder.order("area_total", { ascending: false });
          break;
        case "newest":
          queryBuilder = queryBuilder.order("created_at", { ascending: false });
          break;
        default:
          // Relevance - no specific order
          break;
      }

      const { data, error } = await queryBuilder.limit(10);

      if (error) throw error;

      setResults(data || []);
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
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Search className="w-5 h-5 text-[#8B9B6E]" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Buscar propriedades por nome ou localização..."
          className="w-full pl-12 pr-32 py-4 bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-full text-[#D4A574] placeholder-[#676767] focus:border-[#FF6B35] focus:outline-none transition-colors"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 hover:bg-[#2a2a1a] rounded-full transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4 text-[#676767]" />
            </button>
          )}
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              showFilters
                ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a]"
                : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-semibold">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 bg-[#FF6B35] text-[#0a0a0a] text-xs font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#D4A574]">Filtros de Busca</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-[#8B9B6E] hover:text-[#FF6B35] transition-colors"
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
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#FF6B35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Máximo</label>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    placeholder="R$ 10.000.000"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#FF6B35] focus:outline-none"
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
                  className="w-full h-2 bg-[#2a2a1a] rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
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
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#FF6B35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#676767] mb-1 block">Máximo</label>
                  <input
                    type="number"
                    value={areaMax}
                    onChange={(e) => setAreaMax(Number(e.target.value))}
                    placeholder="1000 ha"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#FF6B35] focus:outline-none"
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
                  className="w-full h-2 bg-[#2a2a1a] rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
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
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg text-[#D4A574] text-sm focus:border-[#FF6B35] focus:outline-none appearance-none cursor-pointer"
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
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a]"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Relevância
                </button>
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "newest"
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a]"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Mais Recentes
                </button>
                <button
                  onClick={() => setSortBy("price_asc")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "price_asc"
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a]"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Menor Preço
                </button>
                <button
                  onClick={() => setSortBy("price_desc")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    sortBy === "price_desc"
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a]"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Maior Preço
                </button>
                <button
                  onClick={() => setSortBy("area_desc")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all col-span-2 ${
                    sortBy === "area_desc"
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a]"
                      : "bg-[#2a2a1a] text-[#8B9B6E] hover:bg-[#3a3a2a]"
                  }`}
                >
                  Maior Área
                </button>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={() => {
              performSearch();
              setShowFilters(false);
            }}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all shadow-lg"
          >
            Aplicar Filtros
          </button>
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl shadow-2xl overflow-hidden z-40">
          {loading ? (
            <div className="p-6 text-center text-[#8B9B6E]">
              <div className="animate-spin w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-2"></div>
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/imoveis/${result.id}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-4 p-4 hover:bg-[#2a2a1a]/50 transition-colors border-b border-[#2a2a1a] last:border-0"
                >
                  {/* Property Image */}
                  <div className="w-20 h-20 bg-[#2a2a1a] rounded-lg overflow-hidden flex-shrink-0 relative">
                    {result.fotos && result.fotos[0] ? (
                      <Image
                        src={result.fotos[0]}
                        alt={result.nome}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-[#959595]" />
                      </div>
                    )}
                  </div>

                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#D4A574] font-semibold truncate">
                      {result.nome}
                    </h4>
                    <p className="text-[#8B9B6E] text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {result.localizacao}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      {result.preco && (
                        <span className="text-[#FF6B35] font-bold text-sm">
                          R$ {result.preco.toLocaleString("pt-BR")}
                        </span>
                      )}
                      {result.area_total && (
                        <span className="text-[#8B9B6E] text-sm">
                          {result.area_total} ha
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-[#676767]">
              Nenhuma propriedade encontrada para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
