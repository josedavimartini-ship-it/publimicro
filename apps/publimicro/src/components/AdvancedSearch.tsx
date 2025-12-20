"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  Search, X, MapPin, ChevronDown,
  Building2, Car, Wrench, Ship, Globe, Plane, ShoppingBag,
  TrendingUp, Clock
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getFirstPhoto } from '@/lib/photoUtils';

// Section configurations for search
const searchSections = [
  { id: "all", name: "Todos", icon: Globe, table: null, href: "/buscar" },
  { id: "proper", name: "Imóveis", icon: Building2, table: "sitios", href: "/imoveis" },
  { id: "motors", name: "Veículos", icon: Car, table: "vehicles", href: "/motors" },
  { id: "machina", name: "Máquinas", icon: Wrench, table: "machines", href: "/machina" },
  { id: "marine", name: "Náutica", icon: Ship, table: "marine", href: "/marine" },
  { id: "journey", name: "Viagens", icon: Plane, table: "trips", href: "/journey" },
  { id: "tudo", name: "Tudo", icon: ShoppingBag, table: "listings", href: "/acheme-coisas" },
];

// Price ranges
const priceRanges = [
  { label: "Qualquer preço", min: 0, max: Infinity },
  { label: "Até R$ 1.000", min: 0, max: 1000 },
  { label: "R$ 1.000 - R$ 5.000", min: 1000, max: 5000 },
  { label: "R$ 5.000 - R$ 20.000", min: 5000, max: 20000 },
  { label: "R$ 20.000 - R$ 100.000", min: 20000, max: 100000 },
  { label: "R$ 100.000 - R$ 500.000", min: 100000, max: 500000 },
  { label: "Acima de R$ 500.000", min: 500000, max: Infinity },
];

interface SearchResult {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  section: string;
  href: string;
}

interface AdvancedSearchProps {
  defaultSection?: string;
  placeholder?: string;
  showFilters?: boolean;
  compact?: boolean;
  onSearch?: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  section: string;
  priceRange: { min: number; max: number };
  location: string;
  sortBy: string;
}

export default function AdvancedSearch({
  defaultSection = "all",
  placeholder = "O que você procura?",
  showFilters = true,
  compact = false,
  onSearch,
}: AdvancedSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Filters state
  const [selectedSection, setSelectedSection] = useState(defaultSection);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [location, setLocation] = useState("");
  const [sortBy, _setSortBy] = useState("relevance");

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect current section from pathname
  useEffect(() => {
    const section = searchSections.find(s => pathname.startsWith(s.href) && s.id !== "all");
    if (section && defaultSection === "all") {
      setSelectedSection(section.id);
    }
  }, [pathname, defaultSection]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("acheme-recent-searches");
    if (stored) {
      setRecentSearches(JSON.parse(stored).slice(0, 5));
    }
  }, []);

  // Save search to recent
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("acheme-recent-searches", JSON.stringify(updated));
  };

  // Debounced search suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results: SearchResult[] = [];
      
      // Search in sitios (properties)
      if (selectedSection === "all" || selectedSection === "proper") {
        const { data: sitios } = await supabase
          .from("sitios")
          .select("id, nome, preco, localizacao, fotos")
          .ilike("nome", `%${searchQuery}%`)
          .limit(3);
        
        if (sitios) {
          results.push(...sitios.map(s => ({
            id: s.id,
            title: s.nome,
            price: s.preco,
            location: s.localizacao || "",
            image: getFirstPhoto(s.fotos),
            section: "proper",
            href: `/imoveis/${s.id}`,
          })));
        }
      }

      // Search in listings (tudo/coisas)
      if (selectedSection === "all" || selectedSection === "tudo") {
        const { data: listings } = await supabase
          .from("listings")
          .select("id, title, price, location, images")
          .ilike("title", `%${searchQuery}%`)
          .limit(3);
        
        if (listings) {
          results.push(...listings.map(l => ({
            id: l.id,
            title: l.title,
            price: l.price,
            location: l.location || "",
            image: Array.isArray(l.images) && l.images.length > 0 ? l.images[0] : "/placeholder.jpg",
            section: "tudo",
            href: `/acheme-coisas/${l.id}`,
          })));
        }
      }

      setSuggestions(results.slice(0, 6));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSection]);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        void fetchSuggestions(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submit
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!query.trim()) return;

    saveRecentSearch(query);

    const filters: SearchFilters = {
      section: selectedSection,
      priceRange: selectedPriceRange,
      location,
      sortBy,
    };

    if (onSearch) {
      onSearch(query, filters);
    } else {
      // Build URL and navigate
      const params = new URLSearchParams();
      params.set("q", query);
      if (selectedSection !== "all") params.set("section", selectedSection);
      if (location) params.set("location", location);
      if (selectedPriceRange.max !== Infinity) {
        params.set("price_min", String(selectedPriceRange.min));
        params.set("price_max", String(selectedPriceRange.max));
      }
      if (sortBy !== "relevance") params.set("sort", sortBy);

      const section = searchSections.find(s => s.id === selectedSection);
      const targetUrl = section && section.id !== "all" 
        ? `${section.href}?${params.toString()}`
        : `/buscar?${params.toString()}`;
      
      router.push(targetUrl);
    }

    setIsOpen(false);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div ref={containerRef} className={`relative ${compact ? "w-full max-w-md" : "w-full max-w-2xl"}`}>
      <form onSubmit={handleSearch}>
        <div className={`
          relative flex items-center bg-[#1a1a1a] border border-[#333] rounded-xl
          focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20
          transition-all
          ${compact ? "h-10" : "h-12"}
        `}>
          {/* Section selector (when showing filters) */}
          {showFilters && !compact && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 h-full px-4 border-r border-[#333] text-[#E6C98B] hover:bg-[#252525] transition-colors rounded-l-xl"
              >
                {(() => {
                  const section = searchSections.find(s => s.id === selectedSection);
                  const Icon = section?.icon || Globe;
                  return <Icon className="w-4 h-4" />;
                })()}
                <span className="text-sm hidden sm:inline">{searchSections.find(s => s.id === selectedSection)?.name}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Search input */}
          <div className="flex-1 flex items-center">
            <Search className="w-5 h-5 text-[#666] ml-4" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className={`
                flex-1 bg-transparent border-none outline-none px-3
                text-[#E6C98B] placeholder-[#666]
                ${compact ? "text-sm" : "text-base"}
              `}
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-2 text-[#666] hover:text-[#E6C98B] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search button */}
          <button
            type="submit"
            className={`
              flex items-center justify-center gap-2 px-4 h-full
              bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-[#0a0a0a]
              font-medium rounded-r-xl hover:opacity-90 transition-opacity
              ${compact ? "text-sm" : ""}
            `}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </div>
      </form>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Advanced filters */}
          {showAdvanced && showFilters && (
            <div className="p-4 border-b border-[#2a2a2a]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Section filter */}
                <div>
                  <label className="text-xs text-[#9ca3af] mb-1 block">Seção</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full bg-[#252525] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E6C98B]"
                  >
                    {searchSections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price filter */}
                <div>
                  <label className="text-xs text-[#9ca3af] mb-1 block">Faixa de preço</label>
                  <select
                    value={priceRanges.indexOf(selectedPriceRange)}
                    onChange={(e) => setSelectedPriceRange(priceRanges[parseInt(e.target.value)])}
                    className="w-full bg-[#252525] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E6C98B]"
                  >
                    {priceRanges.map((range, index) => (
                      <option key={index} value={index}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location filter */}
                <div>
                  <label className="text-xs text-[#9ca3af] mb-1 block">Localização</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Cidade ou estado..."
                    className="w-full bg-[#252525] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E6C98B] placeholder-[#666]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="inline-block w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-[#666] px-2 py-1">Sugestões</p>
              {suggestions.map((result) => (
                <button
                  key={`${result.section}-${result.id}`}
                  onClick={() => {
                    saveRecentSearch(result.title);
                    router.push(result.href);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#252525] transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#252525] overflow-hidden flex-shrink-0">

                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#E6C98B] truncate">{result.title}</p>
                    <div className="flex items-center gap-2 text-xs text-[#666]">
                      <span className="text-[#8B9B6E] font-medium">{formatPrice(result.price)}</span>
                      {result.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {result.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent searches */}
          {!isLoading && !suggestions.length && recentSearches.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-[#666] px-2 py-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Buscas recentes
              </p>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    void fetchSuggestions(search);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#252525] transition-colors text-left text-sm text-[#9ca3af]"
                >
                  <Clock className="w-4 h-4 text-[#666]" />
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Trending searches */}
          {!isLoading && !suggestions.length && !recentSearches.length && (
            <div className="p-4">
              <p className="text-xs text-[#666] mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Buscas em alta
              </p>
              <div className="flex flex-wrap gap-2">
                {["Sítio MG", "iPhone 15", "Toyota Hilux", "Apartamento SP", "Trator"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      void fetchSuggestions(term);
                    }}
                    className="px-3 py-1 bg-[#252525] rounded-full text-xs text-[#9ca3af] hover:bg-[#333] hover:text-[#E6C98B] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compact search bar for section headers
export function SectionSearch({ section, placeholder }: { section: string; placeholder?: string }) {
  return (
    <AdvancedSearch
      defaultSection={section}
      placeholder={placeholder || `Buscar em ${section}...`}
      showFilters={false}
      compact
    />
  );
}
