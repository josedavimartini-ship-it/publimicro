"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Maximize2, DollarSign, ArrowLeft, Heart } from "lucide-react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  area_total: number;
  fotos: string[];
  description: string;
  created_at: string;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    priceMin: 0,
    priceMax: 10000000,
    areaMin: 0,
    areaMax: 1000,
    location: "",
    sortBy: "relevance",
    searchType: "all",
  });
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    performSearch();
  }, [filters]);

  const performSearch = async () => {
    setLoading(true);

    try {
      let queryBuilder = supabase
        .from("properties")
        .select("id, title, location, price, area_total, fotos, description, created_at", {
          count: "exact",
        });

      // Text search
      if (filters.query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${filters.query}%,location.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
        );
      }

      // Price filter
      if (filters.priceMin > 0) {
        queryBuilder = queryBuilder.gte("price", filters.priceMin);
      }
      if (filters.priceMax < 10000000) {
        queryBuilder = queryBuilder.lte("price", filters.priceMax);
      }

      // Area filter
      if (filters.areaMin > 0) {
        queryBuilder = queryBuilder.gte("area_total", filters.areaMin);
      }
      if (filters.areaMax < 1000) {
        queryBuilder = queryBuilder.lte("area_total", filters.areaMax);
      }

      // Location filter
      if (filters.location) {
        queryBuilder = queryBuilder.ilike("location", `%${filters.location}%`);
      }

      // Sorting
      switch (filters.sortBy) {
        case "price_asc":
          queryBuilder = queryBuilder.order("price", { ascending: true });
          break;
        case "price_desc":
          queryBuilder = queryBuilder.order("price", { ascending: false });
          break;
        case "area_desc":
          queryBuilder = queryBuilder.order("area_total", { ascending: false });
          break;
        case "newest":
          queryBuilder = queryBuilder.order("created_at", { ascending: false });
          break;
        default:
          // Relevance - order by created_at desc as default
          queryBuilder = queryBuilder.order("created_at", { ascending: false });
          break;
      }

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      setProperties(data || []);
      setTotalResults(count || 0);
    } catch (error) {
      console.error("Search error:", error);
      setProperties([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header with Search */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-b-2 border-[#2a2a1a]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a1a] hover:bg-[#3a3a2a] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#8B9B6E]" />
              <span className="text-[#8B9B6E] font-semibold">Voltar</span>
            </Link>
            <h1 className="text-3xl font-bold text-[#E6C98B]">Buscar Propriedades</h1>
          </div>
          
          <SearchBar onFilterChange={setFilters} />
          
          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[#8B9B6E]">
              {loading ? (
                "Buscando..."
              ) : (
                <>
                  <span className="font-bold text-[#A8C97F]">{totalResults}</span>{" "}
                  {totalResults === 1 ? "propriedade encontrada" : "propriedades encontradas"}
                  {filters.query && (
                    <>
                      {" "}para "<span className="text-[#E6C98B]">{filters.query}</span>"
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="w-full h-64 bg-[#2a2a1a]"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-[#2a2a1a] rounded"></div>
                  <div className="h-4 bg-[#2a2a1a] rounded w-2/3"></div>
                  <div className="h-4 bg-[#2a2a1a] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/imoveis/${property.id}`}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#A8C97F] transition-all hover:scale-105 shadow-lg hover:shadow-2xl group"
              >
                {/* Image */}
                <div className="relative w-full h-64 bg-[#2a2a1a] overflow-hidden">
                  {property.fotos && property.fotos[0] ? (
                    <Image
                      src={property.fotos[0]}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-[#676767]" />
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle favorite toggle
                    }}
                    className="absolute top-4 right-4 p-2 bg-[#0a0a0a]/80 hover:bg-[#A8C97F] rounded-full transition-all group/fav"
                    aria-label="Adicionar aos favoritos"
                  >
                    <Heart className="w-5 h-5 text-[#E6C98B] group-hover/fav:fill-current" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#E6C98B] mb-3 group-hover:text-[#A8C97F] transition-colors">
                    {property.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[#8B9B6E]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    {property.area_total && (
                      <div className="flex items-center gap-2 text-[#8B9B6E]">
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-sm">{property.area_total} hectares</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    {property.price ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-[#A8C97F]" />
                          <span className="text-2xl font-bold text-[#A8C97F]">
                            R$ {property.price.toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#8B9B6E] text-sm">Consultar preço</span>
                    )}
                  </div>

                  {/* Description Preview */}
                  {property.description && (
                    <p className="mt-4 text-sm text-[#676767] line-clamp-2">
                      {property.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-[#2a2a1a] rounded-full flex items-center justify-center">
              <MapPin className="w-16 h-16 text-[#676767]" />
            </div>
            <h2 className="text-2xl font-bold text-[#E6C98B] mb-3">
              Nenhuma propriedade encontrada
            </h2>
            <p className="text-[#8B9B6E] mb-6">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            <button
              onClick={() => {
                setFilters({
                  query: "",
                  priceMin: 0,
                  priceMax: 10000000,
                  areaMin: 0,
                  areaMax: 1000,
                  location: "",
                  sortBy: "relevance",
                  searchType: "all",
                });
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#A8C97F] to-[#0D7377] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-all"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#E6C98B] text-xl">Carregando busca...</div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
