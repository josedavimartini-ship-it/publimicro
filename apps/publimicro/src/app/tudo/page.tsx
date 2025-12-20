"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBag, Search, SlidersHorizontal, X,
  MapPin, Heart, Eye, Plus, Grid, List, Tag, Clock,
  Smartphone, Sofa, Shirt, Briefcase, Baby, PawPrint, Dumbbell
} from "lucide-react";

// Categories for Tudo marketplace
const categories = [
  { id: "all", label: "Todos", icon: ShoppingBag },
  { id: "eletronicos", label: "Eletrônicos", icon: Smartphone },
  { id: "moveis", label: "Móveis", icon: Sofa },
  { id: "moda", label: "Moda", icon: Shirt },
  { id: "servicos", label: "Serviços", icon: Briefcase },
  { id: "esportes", label: "Esportes", icon: Dumbbell },
  { id: "infantil", label: "Infantil", icon: Baby },
  { id: "pets", label: "Pets", icon: PawPrint },
];

// Subcategories for filtering
const subcategories: Record<string, string[]> = {
  eletronicos: ["Smartphones", "Notebooks", "TVs", "Tablets", "Câmeras", "Áudio", "Games"],
  moveis: ["Sofás", "Mesas", "Camas", "Armários", "Cadeiras", "Estantes", "Decoração"],
  moda: ["Roupas", "Calçados", "Bolsas", "Acessórios", "Joias", "Relógios"],
  servicos: ["Reformas", "Limpeza", "Aulas", "Eventos", "Consultoria", "Design"],
  esportes: ["Fitness", "Bicicletas", "Camping", "Pesca", "Surf", "Futebol"],
  infantil: ["Brinquedos", "Roupas", "Móveis", "Carrinhos", "Educação"],
  pets: ["Cães", "Gatos", "Acessórios", "Alimentação", "Serviços Pet"],
};

// Condition options
const conditionOptions = ["Novo", "Seminovo", "Usado", "Para Peças"];

// Mock listings
const mockListings = [
  {
    id: "1",
    title: 'iPhone 14 Pro Max 256GB',
    category: "eletronicos",
    subcategory: "Smartphones",
    price: 5500,
    originalPrice: 7500,
    location: "São Paulo, SP",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop",
    views: 1234,
    favorites: 89,
    condition: "Seminovo",
    isNegotiable: true,
    postedAt: "2h atrás",
    seller: "João Silva",
  },
  {
    id: "2",
    title: "Sofá Retrátil 3 Lugares Cinza",
    category: "moveis",
    subcategory: "Sofás",
    price: 2800,
    location: "Rio de Janeiro, RJ",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    views: 456,
    favorites: 34,
    condition: "Usado",
    isNegotiable: true,
    postedAt: "5h atrás",
    seller: "Maria Santos",
  },
  {
    id: "3",
    title: "MacBook Pro M2 14 polegadas",
    category: "eletronicos",
    subcategory: "Notebooks",
    price: 12000,
    location: "Curitiba, PR",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    views: 789,
    favorites: 67,
    condition: "Novo",
    isNegotiable: false,
    postedAt: "1d atrás",
    seller: "Tech Store",
  },
  {
    id: "4",
    title: "Bicicleta Speed Trek Domane",
    category: "esportes",
    subcategory: "Bicicletas",
    price: 8500,
    location: "Belo Horizonte, MG",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
    views: 234,
    favorites: 23,
    condition: "Seminovo",
    isNegotiable: true,
    postedAt: "3h atrás",
    seller: "Pedro Costa",
  },
  {
    id: "5",
    title: "Vestido de Festa Longo Bordado",
    category: "moda",
    subcategory: "Roupas",
    price: 450,
    originalPrice: 890,
    location: "Salvador, BA",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
    views: 567,
    favorites: 78,
    condition: "Novo",
    isNegotiable: false,
    postedAt: "6h atrás",
    seller: "Ana Boutique",
  },
  {
    id: "6",
    title: "Aulas Particulares de Inglês",
    category: "servicos",
    subcategory: "Aulas",
    price: 80,
    priceLabel: "por hora",
    location: "Online",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
    views: 345,
    favorites: 45,
    condition: "Novo",
    isNegotiable: true,
    postedAt: "1h atrás",
    seller: "Prof. Lucas",
  },
  {
    id: "7",
    title: "Berço Multifuncional com Colchão",
    category: "infantil",
    subcategory: "Móveis",
    price: 650,
    location: "Porto Alegre, RS",
    image: "https://images.unsplash.com/photo-1586105449897-20b5efeb3233?w=400&h=300&fit=crop",
    views: 189,
    favorites: 28,
    condition: "Seminovo",
    isNegotiable: true,
    postedAt: "4h atrás",
    seller: "Camila Dias",
  },
  {
    id: "8",
    title: "Golden Retriever Filhotes",
    category: "pets",
    subcategory: "Cães",
    price: 2500,
    location: "Campinas, SP",
    image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop",
    views: 892,
    favorites: 156,
    condition: "Novo",
    isNegotiable: false,
    postedAt: "2d atrás",
    seller: "Canil Alegria",
  },
];

export default function TudoPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");

  // Get available subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all") {
      return Object.values(subcategories).flat();
    }
    return subcategories[selectedCategory] || [];
  }, [selectedCategory]);

  // Filter listings
  const filteredListings = useMemo(() => {
    const result = mockListings.filter((listing) => {
      // Category filter
      if (selectedCategory !== "all" && listing.category !== selectedCategory) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !listing.title.toLowerCase().includes(query) &&
          !listing.category.toLowerCase().includes(query) &&
          !listing.location.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      // Price filter
      if (listing.price < priceRange.min || listing.price > priceRange.max) {
        return false;
      }
      
      // Condition filter
      if (selectedConditions.length > 0 && !selectedConditions.includes(listing.condition)) {
        return false;
      }
      
      // Subcategory filter
      if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(listing.subcategory)) {
        return false;
      }
      
      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "views":
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        // Keep original order (recent)
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, priceRange, selectedConditions, selectedSubcategories, sortBy]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const toggleSubcategory = (sub: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 50000 });
    setSelectedConditions([]);
    setSelectedSubcategories([]);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#B8904D] via-[#D4A55A] to-[#B8904D] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-warm mb-2 flex items-center gap-3">
                <ShoppingBag className="w-10 h-10" />
                PubliTudo
              </h1>
              <p className="text-[#f5e6d0] text-lg">Marketplace Geral - Compre e Venda de Tudo</p>
            </div>
            <Link
              href="/postar"
              className="flex items-center gap-2 px-6 py-3 btn-secondary rounded-full font-bold transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Anunciar Grátis
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
            <input
              type="text"
              placeholder="O que você está procurando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a] rounded-xl text-warm placeholder-[#676767] focus:outline-none focus:border-[#D4A55A] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubcategories([]);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                  ? "bg-gradient-to-r from-[#B8904D] to-[#D4A55A] text-warm"
                      : "text-[#888] hover:text-warm hover:bg-[#1a1a1a]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
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
                <h3 className="text-lg font-bold text-warm flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#D4A55A]" />
                  Filtros
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#B8904D] hover:text-[#D4A55A] transition-colors"
                >
                  Limpar
                </button>
              </div>

              {/* Subcategories */}
              {availableSubcategories.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                    Subcategorias
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                    {availableSubcategories.slice(0, 10).map((sub) => (
                      <label
                        key={sub}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(sub)}
                          onChange={() => toggleSubcategory(sub)}
                          className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#B8904D] focus:ring-[#B8904D] focus:ring-offset-0"
                        />
                        <span className="text-[#aaa] group-hover:text-white transition-colors text-sm">
                          {sub}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                        className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#B8904D] focus:ring-[#B8904D] focus:ring-offset-0"
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
                    max={50000}
                    step={500}
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-full accent-[#B8904D]"
                  />
                  <div className="flex justify-between text-sm text-[#888]">
                    <span>R$ 0</span>
                    <span className="text-[#D4A55A]">{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
              </div>

              {/* Negotiable Only */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#B8904D] focus:ring-[#B8904D] focus:ring-offset-0"
                  />
                  <span className="text-[#aaa] group-hover:text-white transition-colors text-sm">
                    Aceita negociação
                  </span>
                </label>
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#888] hover:text-white hover:border-[#B8904D] transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? "Ocultar" : "Filtros"}
                </button>
                <span className="text-[#888]">
                  <span className="text-warm font-semibold">{filteredListings.length}</span>{" "}
                  anúncios encontrados
                </span>
              </div>
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-[#B8904D] text-warm" : "text-[#888] hover:text-warm"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-[#B8904D] text-white" : "text-[#888] hover:text-white"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#B8904D]"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="views">Mais Vistos</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedConditions.length > 0 || selectedSubcategories.length > 0 || priceRange.max < 50000) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedSubcategories.map((sub) => (
                  <span
                    key={sub}
                    className="flex items-center gap-1 px-3 py-1 bg-[#B8904D]/20 border border-[#B8904D]/30 rounded-full text-sm text-[#D4A55A]"
                  >
                    {sub}
                    <button
                      onClick={() => toggleSubcategory(sub)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedConditions.map((condition) => (
                  <span
                    key={condition}
                    className="flex items-center gap-1 px-3 py-1 bg-[#B8904D]/20 border border-[#B8904D]/30 rounded-full text-sm text-[#D4A55A]"
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
                {priceRange.max < 50000 && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#B8904D]/20 border border-[#B8904D]/30 rounded-full text-sm text-[#D4A55A]">
                    Até {formatPrice(priceRange.max)}
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 50000 })}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Listings Grid */}
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-4"
            }>
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/tudo/${listing.id}`}
                  className={`group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#B8904D]/50 transition-all hover:shadow-lg hover:shadow-[#B8904D]/10 ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${
                    viewMode === "list" ? "w-48 h-36 flex-shrink-0" : "aspect-square"
                  }`}>
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {listing.originalPrice && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        -{Math.round((1 - listing.price / listing.originalPrice) * 100)}%
                      </div>
                    )}
                    <button className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-[#B8904D] transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-2">
                      <Tag className="w-3 h-3" />
                      {listing.subcategory}
                      <span className="text-[#555]">•</span>
                      <span className="text-[#666]">{listing.condition}</span>
                    </div>
                    
                    <h3 className="text-sm font-bold text-white group-hover:text-[#D4A55A] transition-colors line-clamp-2 mb-2">
                      {listing.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                      <span className="text-[#555]">•</span>
                      <Clock className="w-3 h-3" />
                      {listing.postedAt}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]">
                      <div>
                        <span className="text-lg font-bold text-[#D4A55A]">
                          {formatPrice(listing.price)}
                        </span>
                        {listing.priceLabel && (
                          <span className="text-xs text-[#888] ml-1">/{listing.priceLabel}</span>
                        )}
                        {listing.originalPrice && (
                          <span className="text-xs text-[#666] line-through ml-2">
                            {formatPrice(listing.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#676767]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {listing.views}
                        </span>
                      </div>
                    </div>
                    
                    {listing.isNegotiable && (
                      <span className="inline-block mt-2 text-xs text-[#8B9B6E]">
                        💬 Aceita negociação
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {filteredListings.length === 0 && (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Nenhum anúncio encontrado
                </h3>
                <p className="text-[#676767] mb-6">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-[#B8904D] to-[#D4A55A] text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredListings.length > 0 && (
              <div className="text-center mt-10">
                <button className="px-8 py-4 bg-gradient-to-r from-[#B8904D] to-[#D4A55A] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#B8904D]/30 transition-all">
                  Ver Mais Anúncios
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
