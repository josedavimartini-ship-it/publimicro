"use client";

import { useState, useEffect, useCallback } from "react";
import SearchTab, { SearchFilters } from "@/components/SearchTab";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Maximize2, DollarSign, Heart, Grid3x3, List, Scale } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/Skeleton";
import { addToComparison, isInComparison } from "@/lib/comparison";
import { useToast } from "@/components/ToastNotification";

interface Property {
  id: string;
  nome: string;
  localizacao: string;
  preco: number;
  area_total: number;
  fotos: string[];
  descricao: string;
  created_at: string;
  highest_bid?: number;
  bid_count?: number;
}

export default function ImoveisPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { showToast } = useToast();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    priceMin: 0,
    priceMax: 10000000,
    areaMin: 0,
    areaMax: 1000,
    location: "",
    sortBy: "relevance",
    searchType: "properties",
  });
  const [totalResults, setTotalResults] = useState(0);

  const loadProperties = useCallback(async () => {
    setLoading(true);

    try {
      // Query sitios table (actual table with property data)
      let queryBuilder = supabase
        .from("sitios")
        .select("id, nome, localizacao, preco, area_total, fotos, descricao, created_at", {
          count: "exact",
        });

      // Text search
      if (filters.query) {
        queryBuilder = queryBuilder.or(
          `nome.ilike.%${filters.query}%,localizacao.ilike.%${filters.query}%,descricao.ilike.%${filters.query}%`
        );
      }

      // Price filter
      if (Number(filters.priceMin) > 0) {
        queryBuilder = queryBuilder.gte("preco", Number(filters.priceMin));
      }
      if (Number(filters.priceMax) < 10000000) {
        queryBuilder = queryBuilder.lte("preco", Number(filters.priceMax));
      }

      // Area filter
      if (Number(filters.areaMin) > 0) {
        queryBuilder = queryBuilder.gte("area_total", Number(filters.areaMin));
      }
      if (Number(filters.areaMax) < 1000) {
        queryBuilder = queryBuilder.lte("area_total", Number(filters.areaMax));
      }

      // Location filter
      if (filters.location) {
        queryBuilder = queryBuilder.ilike("localizacao", `%${filters.location}%`);
      }

      // Sorting
      switch (filters.sortBy) {
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
          queryBuilder = queryBuilder.order("created_at", { ascending: false });
          break;
      }

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      // Fetch highest bids for all properties
      const propertiesWithBids = await Promise.all(
        (data || []).map(async (property) => {
          const { data: bidsData } = await supabase
            .from("property_proposals")
            .select("amount")
            .eq("sitio_id", property.id)
            .neq("status", "rejected")
            .order("amount", { ascending: false })
            .limit(1);

          const { count: bidCount } = await supabase
            .from("property_proposals")
            .select("*", { count: "exact", head: true })
            .eq("sitio_id", property.id)
            .neq("status", "rejected");

          return {
            ...property,
            highest_bid: bidsData && bidsData.length > 0 ? bidsData[0].amount : null,
            bid_count: bidCount || 0,
          };
        })
      );

      setProperties(propertiesWithBids);
      setTotalResults(count || 0);
    } catch (error) {
      console.error("Error loading properties:", error);
      setProperties([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    void loadProperties();
  }, [loadProperties]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-b-2 border-[#2a2a1a]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumbs />
          
          <div className="text-center mb-8 mt-4">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C9A87C] to-[#B8904D] mb-4">
              Todas as Propriedades
            </h1>
            <p className="text-[#B8A890] text-lg">
              Explore nosso catálogo completo de propriedades rurais e urbanas
            </p>
          </div>
          
          <SearchTab onFilterChange={setFilters} />
          
          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <p className="text-[#B8A890]">
              {loading ? (
                "Carregando..."
              ) : (
                <>
                  <span className="font-bold text-[#C9A87C]">{totalResults}</span>{" "}
                  {totalResults === 1 ? "propriedade encontrada" : "propriedades encontradas"}
                  {filters.query && (
                    <>
                      {" "}para "<span className="text-[#D4C4A8]">{filters.query}</span>"
                    </>
                  )}
                </>
              )}
            </p>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a1a] rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-[#6B7F5C] to-[#7A8F6B] text-[#D4C4A8]"
                    : "text-[#B8A890] hover:bg-[#2a2a1a]"
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-[#6B7F5C] to-[#7A8F6B] text-[#D4C4A8]"
                    : "text-[#B8A890] hover:bg-[#2a2a1a]"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="card" width="100%" height={viewMode === "grid" ? "400px" : "200px"} />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/imoveis/${property.id}`}
                className={`bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#6B7F5C] transition-all hover:scale-105 shadow-lg hover:shadow-2xl group ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Image */}
                <div className={`relative bg-[#2a2a1a] overflow-hidden ${viewMode === "grid" ? "w-full h-64" : "w-64 h-48 flex-shrink-0"}`}>
                  {property.fotos && property.fotos[0] ? (
                    <Image
                      src={property.fotos[0]}
                      alt={property.nome}
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
                    className="absolute top-4 right-4 p-2 bg-[#0a0a0a]/80 hover:bg-[#6B7F5C] rounded-full transition-all group/fav"
                    aria-label="Adicionar aos favoritos"
                  >
                    <Heart className="w-5 h-5 text-[#C9A87C] group-hover/fav:fill-current" />
                  </button>
                  
                  {/* Comparison Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const added = addToComparison(property.id);
                      if (added) {
                        showToast({
                          type: "success",
                          title: "Adicionado à comparação",
                          message: `${property.nome} foi adicionado. Vá para Comparar.`
                        });
                      }
                    }}
                    className={`absolute top-4 left-4 p-2 rounded-full transition-all ${
                      isInComparison(property.id)
                        ? "bg-[#6B7F5C] text-[#D4C4A8]"
                        : "bg-[#0a0a0a]/80 hover:bg-[#C9A87C] text-[#C9A87C]"
                    }`}
                    aria-label={isInComparison(property.id) ? "Remover da comparação" : "Adicionar à comparação"}
                  >
                    <Scale className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-bold text-[#C9A87C] mb-3 group-hover:text-[#B8904D] transition-colors">
                    {property.nome}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[#B8A890]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.localizacao}</span>
                    </div>

                    {property.area_total && (
                      <div className="flex items-center gap-2 text-[#B8A890]">
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-sm">{property.area_total} hectares</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className={viewMode === "list" ? "mb-4" : ""}>
                    {property.preco ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-[#A8C97F]" />
                          <span className="text-2xl font-bold text-[#A8C97F]">
                            R$ {property.preco.toLocaleString("pt-BR")}
                          </span>
                        </div>
                        
                        {/* Highest Bid Display */}
                        {property.highest_bid && property.highest_bid > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            {property.highest_bid > property.preco && (
                              <span className="text-lg">🔥</span>
                            )}
                            <div className="bg-[#A8C97F]/20 border border-[#A8C97F]/40 rounded-lg px-3 py-1">
                              <p className="text-xs text-[#E6C98B]">Lance mais alto:</p>
                              <p className="text-sm font-bold text-[#A8C97F]">
                                R$ {property.highest_bid.toLocaleString("pt-BR")}
                              </p>
                            </div>
                            {property.bid_count && property.bid_count > 1 && (
                              <span className="text-xs text-[#8B9B6E]">
                                ({property.bid_count} lances)
                              </span>
                            )}
                          </div>
                        )}
                        
                        {!property.highest_bid && (
                          <p className="text-xs text-[#676767] mt-2">Sem lances ainda</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#8B9B6E] text-sm">Consultar preço</span>
                    )}
                  </div>

                  {/* Description Preview */}
                  {property.descricao && viewMode === "list" && (
                    <p className="text-sm text-[#676767] line-clamp-2">
                      {property.descricao}
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
                  searchType: "properties",
                });
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#2C5F6F] hover:from-[#7A8F6B] hover:to-[#3A6F7F] text-[#D4C4A8] font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}








