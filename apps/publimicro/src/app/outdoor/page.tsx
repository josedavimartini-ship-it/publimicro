"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Tent, Mountain, Compass, Search, SlidersHorizontal, X, MapPin,
  Heart, Eye, Plus, Backpack, TreePine, Wind,
  Sun, Star, Users, Clock
} from "lucide-react";

// Outdoor categories
const outdoorCategories = [
  { id: "all", label: "Todos", icon: TreePine },
  { id: "camping", label: "Camping", icon: Tent },
  { id: "trilhas", label: "Trilhas", icon: Mountain },
  { id: "escalada", label: "Escalada", icon: Mountain },
  { id: "pesca", label: "Pesca", icon: Wind },
  { id: "equipamentos", label: "Equipamentos", icon: Backpack },
  { id: "guias", label: "Guias & Tours", icon: Compass },
];

// Equipment types
const equipmentTypes = [
  "Barracas", "Sacos de dormir", "Mochilas", "Lanternas", "Fogareiros",
  "Cordas", "Capacetes", "Mosquetões", "Roupas técnicas"
];

// Difficulty levels
const difficultyLevels = ["Fácil", "Moderado", "Difícil", "Extremo"];

// Conditions
const conditions = ["Novo", "Seminovo", "Usado"];

// Mock outdoor listings
const mockListings = [
  {
    id: "1",
    title: "Barraca Naturehike 2P Ultralight",
    category: "camping",
    type: "Barraca",
    condition: "Nova",
    price: 890,
    location: "São Paulo, SP",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop",
    views: 567,
    favorites: 89,
    rating: 4.9,
    reviews: 45,
    description: "Ultraleve, 1.8kg, impermeável",
    seller: "Aventura Store",
    featured: true,
  },
  {
    id: "2",
    title: "Trilha Pico dos Marins - Guiada",
    category: "trilhas",
    type: "Tour",
    difficulty: "Moderado",
    price: 280,
    priceType: "pessoa",
    location: "Piquete, SP",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
    views: 892,
    favorites: 156,
    rating: 5.0,
    reviews: 89,
    description: "2.421m de altitude, nascer do sol",
    duration: "2 dias",
    capacity: 12,
    seller: "Montanhas Paulistas",
    featured: true,
  },
  {
    id: "3",
    title: "Mochila Osprey Atmos 65L",
    category: "equipamentos",
    type: "Mochila",
    condition: "Seminova",
    price: 1200,
    originalPrice: 1800,
    location: "Curitiba, PR",
    image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400&h=300&fit=crop",
    views: 345,
    favorites: 67,
    rating: 4.8,
    reviews: 23,
    description: "Sistema AG, perfeito estado",
    seller: "Pedro Trekking",
    featured: false,
  },
  {
    id: "4",
    title: "Curso de Escalada em Rocha",
    category: "escalada",
    type: "Curso",
    difficulty: "Moderado",
    price: 450,
    priceType: "pessoa",
    location: "Salto, SP",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop",
    views: 456,
    favorites: 78,
    rating: 4.9,
    reviews: 56,
    description: "Técnicas básicas e intermediárias",
    duration: "1 dia",
    capacity: 6,
    seller: "Vertical School",
    featured: true,
  },
  {
    id: "5",
    title: "Saco de Dormir -5°C Deuter",
    category: "camping",
    type: "Saco de dormir",
    condition: "Novo",
    price: 780,
    location: "Porto Alegre, RS",
    image: "https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=400&h=300&fit=crop",
    views: 234,
    favorites: 45,
    rating: 4.7,
    reviews: 34,
    description: "Conforto -5°C, limite -15°C",
    seller: "Camping Sul",
    featured: false,
  },
  {
    id: "6",
    title: "Expedição Chapada dos Veadeiros",
    category: "guias",
    type: "Expedição",
    difficulty: "Moderado",
    price: 1800,
    priceType: "pessoa",
    location: "Alto Paraíso, GO",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop",
    views: 678,
    favorites: 123,
    rating: 5.0,
    reviews: 67,
    description: "4 dias com cachoeiras secretas",
    duration: "4 dias",
    capacity: 8,
    seller: "Cerrado Expedições",
    featured: true,
  },
  {
    id: "7",
    title: "Kit Escalada Completo",
    category: "escalada",
    type: "Kit",
    condition: "Seminovo",
    price: 2500,
    originalPrice: 4000,
    location: "Rio de Janeiro, RJ",
    image: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=400&h=300&fit=crop",
    views: 345,
    favorites: 56,
    rating: 4.6,
    reviews: 18,
    description: "Cadeirinha, capacete, mosquetões, cordas",
    seller: "Escalador RJ",
    featured: false,
  },
  {
    id: "8",
    title: "Pescaria Esportiva Pantanal",
    category: "pesca",
    type: "Pacote",
    difficulty: "Fácil",
    price: 3500,
    priceType: "pessoa",
    location: "Miranda, MS",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    views: 456,
    favorites: 89,
    rating: 4.9,
    reviews: 45,
    description: "5 dias, all inclusive, barco exclusivo",
    duration: "5 dias",
    capacity: 4,
    seller: "Pantanal Fishing",
    featured: true,
  },
];

export default function OutdoorPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  // Filter listings
  const filteredListings = useMemo(() => {
    return mockListings.filter((listing) => {
      // Category filter
      if (selectedCategory !== "all" && listing.category !== selectedCategory) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !listing.title.toLowerCase().includes(query) &&
          !listing.location.toLowerCase().includes(query) &&
          !listing.type.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      // Price filter
      if (listing.price < priceRange.min || listing.price > priceRange.max) {
        return false;
      }
      
      // Difficulty filter
      if (selectedDifficulties.length > 0 && listing.difficulty && !selectedDifficulties.includes(listing.difficulty)) {
        return false;
      }
      
      // Condition filter
      if (selectedConditions.length > 0 && listing.condition && !selectedConditions.includes(listing.condition)) {
        return false;
      }
      
      // Rating filter
      if (listing.rating < minRating) {
        return false;
      }
      
      return true;
    });
  }, [selectedCategory, searchQuery, priceRange, selectedDifficulties, selectedConditions, minRating]);

  const toggleDifficulty = (diff: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  const toggleCondition = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
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
    setPriceRange({ min: 0, max: 5000 });
    setSelectedDifficulties([]);
    setSelectedConditions([]);
    setMinRating(0);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Fácil": return "text-green-400 bg-green-400/20";
      case "Moderado": return "text-yellow-400 bg-yellow-400/20";
      case "Difícil": return "text-orange-400 bg-orange-400/20";
      case "Extremo": return "text-red-400 bg-red-400/20";
      default: return "text-[#888] bg-[#888]/20";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5F7161] via-[#6C8C5E] to-[#5F7161] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <TreePine className="w-10 h-10" />
                PubliOutdoor
              </h1>
              <p className="text-[#d4e4c8] text-lg">Aventura, Camping & Natureza</p>
            </div>
            <Link
              href="/postar"
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#5F7161] font-bold rounded-full hover:bg-[#f0f5eb] transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Anunciar Equipamento
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
            <input
              type="text"
              placeholder="Buscar equipamentos, trilhas, guias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a] rounded-xl text-white placeholder-[#676767] focus:outline-none focus:border-[#6C8C5E] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {outdoorCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-[#5F7161] to-[#6C8C5E] text-white"
                      : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
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
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#6C8C5E]" />
                  Filtros
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#5F7161] hover:text-[#6C8C5E] transition-colors"
                >
                  Limpar
                </button>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Dificuldade
                </h4>
                <div className="flex flex-wrap gap-2">
                  {difficultyLevels.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => toggleDifficulty(diff)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedDifficulties.includes(diff)
                          ? getDifficultyColor(diff)
                          : "bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] hover:border-[#5F7161]"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Condição (Equipamentos)
                </h4>
                <div className="space-y-2">
                  {conditions.map((cond) => (
                    <label
                      key={cond}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(cond)}
                        onChange={() => toggleCondition(cond)}
                        className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#5F7161] focus:ring-[#5F7161] focus:ring-offset-0"
                      />
                      <span className="text-[#aaa] group-hover:text-white transition-colors text-sm">
                        {cond}
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
                    max={5000}
                    step={100}
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-full accent-[#5F7161]"
                  />
                  <div className="flex justify-between text-sm text-[#888]">
                    <span>R$ 0</span>
                    <span className="text-[#6C8C5E]">{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Avaliação Mínima
                </h4>
                <div className="flex gap-2">
                  {[0, 4, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all ${
                        minRating === rating
                          ? "bg-[#5F7161] text-white"
                          : "bg-[#1a1a1a] text-[#888] hover:text-white"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${minRating === rating ? "fill-current" : ""}`} />
                      {rating > 0 ? `${rating}+` : "Todos"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather Info */}
              <div className="mt-8 p-4 bg-[#1a1a1a] rounded-xl">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  Dica do Dia
                </h4>
                <p className="text-xs text-[#888]">
                  ☀️ Tempo ideal para trilhas na região sudeste. 
                  Lembre-se de levar protetor solar e bastante água!
                </p>
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
                  resultados encontrados
                </span>
              </div>
              <select className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#5F7161]">
                <option>Mais Relevantes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Melhor Avaliados</option>
                <option>Mais Recentes</option>
              </select>
            </div>

            {/* Active Filters */}
            {(selectedDifficulties.length > 0 || selectedConditions.length > 0 || minRating > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedDifficulties.map((diff) => (
                  <span
                    key={diff}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getDifficultyColor(diff)}`}
                  >
                    {diff}
                    <button
                      onClick={() => toggleDifficulty(diff)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedConditions.map((cond) => (
                  <span
                    key={cond}
                    className="flex items-center gap-1 px-3 py-1 bg-[#5F7161]/20 border border-[#5F7161]/30 rounded-full text-sm text-[#6C8C5E]"
                  >
                    {cond}
                    <button
                      onClick={() => toggleCondition(cond)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {minRating > 0 && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#5F7161]/20 border border-[#5F7161]/30 rounded-full text-sm text-[#6C8C5E]">
                    <Star className="w-3 h-3 fill-current" /> {minRating}+
                    <button
                      onClick={() => setMinRating(0)}
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
                  href={`/outdoor/${listing.id}`}
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
                      <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-[#5F7161] to-[#6C8C5E] text-white text-xs font-bold rounded-full">
                        🌟 Destaque
                      </div>
                    )}
                    {listing.difficulty && (
                      <div className={`absolute top-3 right-12 px-2 py-1 rounded-full text-xs font-bold ${getDifficultyColor(listing.difficulty)}`}>
                        {listing.difficulty}
                      </div>
                    )}
                    {listing.originalPrice && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        -{Math.round((1 - listing.price / listing.originalPrice) * 100)}%
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-[#5F7161] transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-2">
                      <span className="px-2 py-0.5 bg-[#5F7161]/20 text-[#6C8C5E] rounded">
                        {listing.type}
                      </span>
                      {listing.condition && (
                        <span className="text-[#888]">{listing.condition}</span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white group-hover:text-[#6C8C5E] transition-colors line-clamp-1 mb-1">
                      {listing.title}
                    </h3>
                    
                    <p className="text-sm text-[#676767] line-clamp-1 mb-2">
                      {listing.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                    </div>

                    {/* Tour/Experience specific info */}
                    {(listing.duration || listing.capacity) && (
                      <div className="flex items-center gap-3 text-xs text-[#676767] mb-3">
                        {listing.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {listing.duration}
                          </div>
                        )}
                        {listing.capacity && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Até {listing.capacity} pessoas
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-white font-medium">{listing.rating}</span>
                      <span className="text-xs text-[#676767]">({listing.reviews} avaliações)</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                      <div>
                        <span className="text-xl font-bold text-[#6C8C5E]">
                          {formatPrice(listing.price)}
                        </span>
                        {listing.priceType && (
                          <span className="text-xs text-[#888] ml-1">/{listing.priceType}</span>
                        )}
                        {listing.originalPrice && (
                          <span className="text-xs text-[#666] line-through ml-2">
                            {formatPrice(listing.originalPrice)}
                          </span>
                        )}
                      </div>
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
                <TreePine className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-[#676767] mb-6">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-[#5F7161] to-[#6C8C5E] text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredListings.length > 0 && (
              <div className="text-center mt-10">
                <button className="px-8 py-4 bg-gradient-to-r from-[#5F7161] to-[#6C8C5E] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#5F7161]/30 transition-all">
                  Explorar Mais Aventuras
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
