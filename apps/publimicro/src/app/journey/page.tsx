"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plane, Search, SlidersHorizontal, X, MapPin, Star, Users,
  Heart, Eye, Plus, Bed, UtensilsCrossed, Camera, Mountain,
  Tent, Waves, Clock
} from "lucide-react";

// Travel categories
const travelCategories = [
  { id: "all", label: "Todos", icon: Plane },
  { id: "hospedagem", label: "Hospedagem", icon: Bed },
  { id: "passeios", label: "Passeios", icon: Camera },
  { id: "aventura", label: "Aventura", icon: Mountain },
  { id: "praia", label: "Praias", icon: Waves },
  { id: "gastronomia", label: "Gastronomia", icon: UtensilsCrossed },
  { id: "camping", label: "Camping", icon: Tent },
];

// Regions for filtering
const regions = [
  "Sul", "Sudeste", "Centro-Oeste", "Nordeste", "Norte", "Internacional"
];

// Accommodation types
const accommodationTypes = [
  "Hotel", "Pousada", "Resort", "Hostel", "Casa", "Apartamento", "Chalé", "Camping"
];

// Mock travel listings
const mockListings = [
  {
    id: "1",
    title: "Pousada Encanto do Mar",
    category: "hospedagem",
    type: "Pousada",
    location: "Jericoacoara, CE",
    region: "Nordeste",
    price: 450,
    priceType: "diária",
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    views: 1567,
    favorites: 234,
    featured: true,
    capacity: 2,
    amenities: ["Café da manhã", "Wi-Fi", "Ar condicionado", "Piscina"],
    description: "Vista privilegiada para as dunas e mar",
  },
  {
    id: "2",
    title: "Trilha Chapada Diamantina",
    category: "aventura",
    type: "Passeio",
    location: "Lençóis, BA",
    region: "Nordeste",
    price: 180,
    priceType: "pessoa",
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
    views: 892,
    favorites: 167,
    featured: true,
    capacity: 12,
    duration: "8 horas",
    description: "Trekking com cachoeiras e mirantes",
  },
  {
    id: "3",
    title: "Resort Águas Claras",
    category: "hospedagem",
    type: "Resort",
    location: "Gramado, RS",
    region: "Sul",
    price: 890,
    priceType: "diária",
    rating: 4.7,
    reviews: 489,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    views: 2341,
    favorites: 456,
    featured: true,
    capacity: 4,
    amenities: ["All inclusive", "Spa", "Piscina aquecida", "Restaurante"],
    description: "Luxo e conforto na serra gaúcha",
  },
  {
    id: "4",
    title: "Passeio de Buggy nas Dunas",
    category: "passeios",
    type: "Passeio",
    location: "Natal, RN",
    region: "Nordeste",
    price: 120,
    priceType: "pessoa",
    rating: 4.6,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    views: 1234,
    favorites: 189,
    featured: false,
    capacity: 4,
    duration: "3 horas",
    description: "Aventura pelas dunas de Genipabu",
  },
  {
    id: "5",
    title: "Chalé na Montanha",
    category: "hospedagem",
    type: "Chalé",
    location: "Monte Verde, MG",
    region: "Sudeste",
    price: 380,
    priceType: "diária",
    rating: 4.9,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop",
    views: 789,
    favorites: 145,
    featured: false,
    capacity: 6,
    amenities: ["Lareira", "Cozinha completa", "Vista panorâmica"],
    description: "Refúgio aconchegante com vista incrível",
  },
  {
    id: "6",
    title: "Mergulho em Fernando de Noronha",
    category: "aventura",
    type: "Experiência",
    location: "Fernando de Noronha, PE",
    region: "Nordeste",
    price: 650,
    priceType: "pessoa",
    rating: 5.0,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    views: 567,
    favorites: 123,
    featured: true,
    capacity: 6,
    duration: "4 horas",
    description: "Mergulho com tartarugas e golfinhos",
  },
  {
    id: "7",
    title: "Tour Gastronômico São Paulo",
    category: "gastronomia",
    type: "Tour",
    location: "São Paulo, SP",
    region: "Sudeste",
    price: 250,
    priceType: "pessoa",
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    views: 456,
    favorites: 78,
    featured: false,
    capacity: 10,
    duration: "5 horas",
    description: "Descubra os sabores da maior cidade da América Latina",
  },
  {
    id: "8",
    title: "Camping Praia do Rosa",
    category: "camping",
    type: "Camping",
    location: "Imbituba, SC",
    region: "Sul",
    price: 80,
    priceType: "pessoa/noite",
    rating: 4.5,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop",
    views: 345,
    favorites: 67,
    featured: false,
    capacity: 4,
    amenities: ["Banheiro compartilhado", "Churrasqueira", "Praia próxima"],
    description: "Conexão com a natureza à beira-mar",
  },
];

export default function JourneyPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
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
          !listing.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      // Price filter
      if (listing.price < priceRange.min || listing.price > priceRange.max) {
        return false;
      }
      
      // Region filter
      if (selectedRegions.length > 0 && !selectedRegions.includes(listing.region)) {
        return false;
      }
      
      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(listing.type)) {
        return false;
      }
      
      // Rating filter
      if (listing.rating < minRating) {
        return false;
      }
      
      return true;
    });
  }, [selectedCategory, searchQuery, priceRange, selectedRegions, selectedTypes, minRating]);

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
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
    setPriceRange({ min: 0, max: 2000 });
    setSelectedRegions([]);
    setSelectedTypes([]);
    setMinRating(0);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2C5F6F] via-[#3D7A8A] to-[#2C5F6F] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Plane className="w-10 h-10" />
                PubliJourney
              </h1>
              <p className="text-[#a8d4e6] text-lg">Turismo, Viagens & Experiências Inesquecíveis</p>
            </div>
            <Link
              href="/postar"
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#2C5F6F] font-bold rounded-full hover:bg-[#e8f4f8] transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Anunciar Experiência
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
            <input
              type="text"
              placeholder="Para onde você quer viajar?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a] rounded-xl text-white placeholder-[#676767] focus:outline-none focus:border-[#3D7A8A] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {travelCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-[#2C5F6F] to-[#3D7A8A] text-white"
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
                  <SlidersHorizontal className="w-5 h-5 text-[#3D7A8A]" />
                  Filtros
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#2C5F6F] hover:text-[#3D7A8A] transition-colors"
                >
                  Limpar
                </button>
              </div>

              {/* Region Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Região
                </h4>
                <div className="space-y-2">
                  {regions.map((region) => (
                    <label
                      key={region}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(region)}
                        onChange={() => toggleRegion(region)}
                        className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#2C5F6F] focus:ring-[#2C5F6F] focus:ring-offset-0"
                      />
                      <span className="text-[#aaa] group-hover:text-white transition-colors text-sm">
                        {region}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Accommodation Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Tipo de Hospedagem
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {accommodationTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#2C5F6F] focus:ring-[#2C5F6F] focus:ring-offset-0"
                      />
                      <span className="text-[#aaa] group-hover:text-white transition-colors text-sm">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Preço (por diária/pessoa)
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={50}
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-full accent-[#2C5F6F]"
                  />
                  <div className="flex justify-between text-sm text-[#888]">
                    <span>R$ 0</span>
                    <span className="text-[#3D7A8A]">{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Avaliação Mínima
                </h4>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${
                        minRating === rating
                          ? "bg-[#2C5F6F] text-white"
                          : "bg-[#1a1a1a] text-[#888] hover:text-white"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${minRating === rating ? "fill-current" : ""}`} />
                      {rating > 0 ? `${rating}+` : "Todos"}
                    </button>
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#888] hover:text-white hover:border-[#2C5F6F] transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? "Ocultar" : "Filtros"}
                </button>
                <span className="text-[#888]">
                  <span className="text-white font-semibold">{filteredListings.length}</span>{" "}
                  experiências encontradas
                </span>
              </div>
              <select className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#2C5F6F]">
                <option>Mais Relevantes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Melhor Avaliados</option>
                <option>Mais Populares</option>
              </select>
            </div>

            {/* Active Filters */}
            {(selectedRegions.length > 0 || selectedTypes.length > 0 || minRating > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedRegions.map((region) => (
                  <span
                    key={region}
                    className="flex items-center gap-1 px-3 py-1 bg-[#2C5F6F]/20 border border-[#2C5F6F]/30 rounded-full text-sm text-[#3D7A8A]"
                  >
                    {region}
                    <button
                      onClick={() => toggleRegion(region)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedTypes.map((type) => (
                  <span
                    key={type}
                    className="flex items-center gap-1 px-3 py-1 bg-[#2C5F6F]/20 border border-[#2C5F6F]/30 rounded-full text-sm text-[#3D7A8A]"
                  >
                    {type}
                    <button
                      onClick={() => toggleType(type)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {minRating > 0 && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#2C5F6F]/20 border border-[#2C5F6F]/30 rounded-full text-sm text-[#3D7A8A]">
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
                  href={`/journey/${listing.id}`}
                  className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#2C5F6F]/50 transition-all hover:shadow-lg hover:shadow-[#2C5F6F]/10"
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
                      <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-[#2C5F6F] to-[#3D7A8A] text-white text-xs font-bold rounded-full">
                        ⭐ Destaque
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-[#2C5F6F] transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {listing.rating} ({listing.reviews})
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-2">
                      <span className="px-2 py-0.5 bg-[#2C5F6F]/20 text-[#3D7A8A] rounded">
                        {listing.type}
                      </span>
                      <span>{listing.region}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white group-hover:text-[#3D7A8A] transition-colors line-clamp-1 mb-1">
                      {listing.title}
                    </h3>
                    
                    <p className="text-sm text-[#676767] line-clamp-1 mb-2">
                      {listing.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#676767] mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {listing.capacity} pessoas
                      </div>
                      {listing.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {listing.duration}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                      <div>
                        <span className="text-xl font-bold text-[#3D7A8A]">
                          {formatPrice(listing.price)}
                        </span>
                        <span className="text-xs text-[#888] ml-1">/{listing.priceType}</span>
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
                <Plane className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Nenhuma experiência encontrada
                </h3>
                <p className="text-[#676767] mb-6">
                  Tente ajustar os filtros ou buscar por outros destinos
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-[#2C5F6F] to-[#3D7A8A] text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredListings.length > 0 && (
              <div className="text-center mt-10">
                <button className="px-8 py-4 bg-gradient-to-r from-[#2C5F6F] to-[#3D7A8A] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#2C5F6F]/30 transition-all">
                  Explorar Mais Destinos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
