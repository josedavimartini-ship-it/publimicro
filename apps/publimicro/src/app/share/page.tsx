"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Share2, Search, SlidersHorizontal, X, MapPin, Users,
  Heart, Eye, Plus, Car, Home, Wrench, Camera, Bike,
  Star, Shield, CheckCircle
} from "lucide-react";

// Share categories
const shareCategories = [
  { id: "all", label: "Todos", icon: Share2 },
  { id: "veiculos", label: "Veículos", icon: Car },
  { id: "espacos", label: "Espaços", icon: Home },
  { id: "equipamentos", label: "Equipamentos", icon: Camera },
  { id: "ferramentas", label: "Ferramentas", icon: Wrench },
  { id: "esportes", label: "Esportes", icon: Bike },
  { id: "servicos", label: "Serviços", icon: Users },
];

// Rental periods
const rentalPeriods = ["Por hora", "Por dia", "Por semana", "Por mês"];

// Mock share listings
const mockListings = [
  {
    id: "1",
    title: "Carro Fiat Argo para Aluguel",
    category: "veiculos",
    type: "Carro",
    location: "São Paulo, SP",
    priceHour: null,
    priceDay: 120,
    priceWeek: 700,
    priceMonth: 2500,
    rating: 4.9,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    views: 567,
    favorites: 89,
    owner: "Carlos Silva",
    ownerVerified: true,
    ownerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
    availability: "Disponível",
    description: "Carro econômico e bem cuidado para aluguel",
    features: ["Ar condicionado", "Direção elétrica", "4 portas"],
  },
  {
    id: "2",
    title: "Sala de Reuniões Coworking",
    category: "espacos",
    type: "Sala",
    location: "Curitiba, PR",
    priceHour: 80,
    priceDay: 400,
    priceWeek: null,
    priceMonth: null,
    rating: 4.8,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    views: 892,
    favorites: 134,
    owner: "Ana Coworking",
    ownerVerified: true,
    ownerImage: "https://images.unsplash.com/photo-1494790108755-2616b612b828?w=50&h=50&fit=crop",
    availability: "Disponível",
    description: "Sala equipada para até 10 pessoas",
    features: ["Wi-Fi", "Projetor", "Ar condicionado", "Café"],
  },
  {
    id: "3",
    title: "Câmera Sony A7III + Lentes",
    category: "equipamentos",
    type: "Câmera",
    location: "Rio de Janeiro, RJ",
    priceHour: null,
    priceDay: 250,
    priceWeek: 1200,
    priceMonth: null,
    rating: 5.0,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    views: 456,
    favorites: 67,
    owner: "Pedro Foto",
    ownerVerified: true,
    ownerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop",
    availability: "Disponível",
    description: "Kit completo para produções profissionais",
    features: ["2 lentes", "Tripé", "Cards", "Bag"],
  },
  {
    id: "4",
    title: "Furadeira e Kit de Ferramentas",
    category: "ferramentas",
    type: "Ferramentas",
    location: "Belo Horizonte, MG",
    priceHour: null,
    priceDay: 35,
    priceWeek: 150,
    priceMonth: null,
    rating: 4.7,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop",
    views: 234,
    favorites: 45,
    owner: "José Marceneiro",
    ownerVerified: false,
    ownerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
    availability: "Disponível",
    description: "Furadeira Bosch + kit completo",
    features: ["Furadeira", "Brocas", "Parafusos", "Maleta"],
  },
  {
    id: "5",
    title: "Bicicleta Speed para Treino",
    category: "esportes",
    type: "Bicicleta",
    location: "Porto Alegre, RS",
    priceHour: 15,
    priceDay: 60,
    priceWeek: 300,
    priceMonth: 900,
    rating: 4.6,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop",
    views: 345,
    favorites: 56,
    owner: "Marcos Ciclista",
    ownerVerified: true,
    ownerImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop",
    availability: "Disponível",
    description: "Bike profissional para treinos e competições",
    features: ["Aro 29", "Quadro alumínio", "Capacete incluso"],
  },
  {
    id: "6",
    title: "Personal Trainer Particular",
    category: "servicos",
    type: "Serviço",
    location: "Florianópolis, SC",
    priceHour: 120,
    priceDay: null,
    priceWeek: null,
    priceMonth: 1800,
    rating: 5.0,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    views: 678,
    favorites: 123,
    owner: "Fernanda Fitness",
    ownerVerified: true,
    ownerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
    availability: "Agenda aberta",
    description: "Treinos personalizados online ou presencial",
    features: ["Plano nutricional", "Acompanhamento", "Resultados"],
  },
  {
    id: "7",
    title: "Drone DJI Mavic Pro",
    category: "equipamentos",
    type: "Drone",
    location: "Salvador, BA",
    priceHour: 80,
    priceDay: 350,
    priceWeek: 1500,
    priceMonth: null,
    rating: 4.9,
    reviews: 23,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
    views: 456,
    favorites: 78,
    owner: "Lucas Drones",
    ownerVerified: true,
    ownerImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=50&h=50&fit=crop",
    availability: "Disponível",
    description: "Drone 4K com baterias extras",
    features: ["4K", "3 baterias", "Controle", "Case"],
  },
  {
    id: "8",
    title: "Estúdio de Podcast",
    category: "espacos",
    type: "Estúdio",
    location: "Brasília, DF",
    priceHour: 150,
    priceDay: 800,
    priceWeek: null,
    priceMonth: null,
    rating: 4.8,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop",
    views: 567,
    favorites: 89,
    owner: "Studio Cast",
    ownerVerified: true,
    ownerImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop",
    availability: "Disponível",
    description: "Estúdio profissional para gravações",
    features: ["Microfones", "Mesa de som", "Isolamento", "Edição"],
  },
];

export default function SharePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
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
      
      // Verified filter
      if (verifiedOnly && !listing.ownerVerified) {
        return false;
      }
      
      // Rating filter
      if (listing.rating < minRating) {
        return false;
      }
      
      return true;
    });
  }, [selectedCategory, searchQuery, verifiedOnly, minRating]);

  const togglePeriod = (period: string) => {
    setSelectedPeriods((prev) =>
      prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getLowestPrice = (listing: typeof mockListings[0]) => {
    const prices = [listing.priceHour, listing.priceDay, listing.priceWeek, listing.priceMonth].filter(Boolean) as number[];
    return Math.min(...prices);
  };

  const getPriceLabel = (listing: typeof mockListings[0]) => {
    if (listing.priceHour) return "/hora";
    if (listing.priceDay) return "/dia";
    if (listing.priceWeek) return "/semana";
    return "/mês";
  };

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 500 });
    setSelectedPeriods([]);
    setVerifiedOnly(false);
    setMinRating(0);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6B7F5C] via-[#7A8F6B] to-[#6B7F5C] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-warm mb-2 flex items-center gap-3">
                <Share2 className="w-10 h-10" />
                PubliShare
              </h1>
              <p className="text-[#d4e4c8] text-lg">Economia Colaborativa - Alugue e Compartilhe</p>
            </div>
            <Link
              href="/postar"
              className="flex items-center gap-2 px-6 py-3 btn-secondary rounded-full font-bold transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Compartilhar Item
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#676767]" />
            <input
              type="text"
              placeholder="O que você precisa alugar?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#2a2a2a] rounded-xl text-warm placeholder-[#676767] focus:outline-none focus:border-[#7A8F6B] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {shareCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-[#6B7F5C] to-[#7A8F6B] text-warm"
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
                  <SlidersHorizontal className="w-5 h-5 text-[#7A8F6B]" />
                  Filtros
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#6B7F5C] hover:text-[#7A8F6B] transition-colors"
                >
                  Limpar
                </button>
              </div>

              {/* Rental Period */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Período
                </h4>
                <div className="flex flex-wrap gap-2">
                  {rentalPeriods.map((period) => (
                    <button
                      key={period}
                      onClick={() => togglePeriod(period)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedPeriods.includes(period)
                          ? "bg-[#6B7F5C] text-white"
                          : "bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] hover:border-[#6B7F5C]"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#6B7F5C] focus:ring-[#6B7F5C] focus:ring-offset-0"
                  />
                  <span className="text-[#aaa] group-hover:text-white transition-colors text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#7A8F6B]" />
                    Apenas verificados
                  </span>
                </label>
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
                          ? "bg-[#6B7F5C] text-white"
                          : "bg-[#1a1a1a] text-[#888] hover:text-white"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${minRating === rating ? "fill-current" : ""}`} />
                      {rating > 0 ? `${rating}+` : "Todos"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
                  Preço (por dia)
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={25}
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-full accent-[#6B7F5C]"
                  />
                  <div className="flex justify-between text-sm text-[#888]">
                    <span>R$ 0</span>
                    <span className="text-[#7A8F6B]">{formatPrice(priceRange.max)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 p-4 bg-[#1a1a1a] rounded-xl">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#7A8F6B]" />
                  Garantias PubliShare
                </h4>
                <ul className="space-y-2 text-xs text-[#888]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-[#7A8F6B]" />
                    Pagamento seguro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-[#7A8F6B]" />
                    Seguro contra danos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-[#7A8F6B]" />
                    Suporte 24/7
                  </li>
                </ul>
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
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#888] hover:text-white hover:border-[#6B7F5C] transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? "Ocultar" : "Filtros"}
                </button>
                <span className="text-[#888]">
                  <span className="text-warm font-semibold">{filteredListings.length}</span>{" "}
                  itens disponíveis
                </span>
              </div>
              <select className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#6B7F5C]">
                <option>Mais Relevantes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Melhor Avaliados</option>
                <option>Mais Próximos</option>
              </select>
            </div>

            {/* Active Filters */}
            {(verifiedOnly || minRating > 0 || selectedPeriods.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {verifiedOnly && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#6B7F5C]/20 border border-[#6B7F5C]/30 rounded-full text-sm text-[#7A8F6B]">
                    <Shield className="w-3 h-3" /> Verificados
                    <button
                      onClick={() => setVerifiedOnly(false)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#6B7F5C]/20 border border-[#6B7F5C]/30 rounded-full text-sm text-[#7A8F6B]">
                    <Star className="w-3 h-3 fill-current" /> {minRating}+
                    <button
                      onClick={() => setMinRating(0)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedPeriods.map((period) => (
                  <span
                    key={period}
                    className="flex items-center gap-1 px-3 py-1 bg-[#6B7F5C]/20 border border-[#6B7F5C]/30 rounded-full text-sm text-[#7A8F6B]"
                  >
                    {period}
                    <button
                      onClick={() => togglePeriod(period)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/share/${listing.id}`}
                  className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#6B7F5C]/50 transition-all hover:shadow-lg hover:shadow-[#6B7F5C]/10"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-green-500/90 text-warm text-xs font-bold rounded-full">
                      {listing.availability}
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-[#6B7F5C] transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-2">
                      <span className="px-2 py-0.5 bg-[#6B7F5C]/20 text-[#7A8F6B] rounded">
                        {listing.type}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white group-hover:text-[#7A8F6B] transition-colors line-clamp-1 mb-1">
                      {listing.title}
                    </h3>
                    
                    <p className="text-sm text-[#676767] line-clamp-1 mb-2">
                      {listing.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                      <MapPin className="w-3 h-3" />
                      {listing.location}
                    </div>

                    {/* Owner */}
                    <div className="flex items-center gap-2 mb-4">
                      <Image
                        src={listing.ownerImage}
                        alt={listing.owner}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-xs text-[#888]">{listing.owner}</span>
                      {listing.ownerVerified && (
                        <Shield className="w-3 h-3 text-[#7A8F6B]" />
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-white">{listing.rating}</span>
                        <span className="text-xs text-[#676767]">({listing.reviews})</span>
                      </div>
                    </div>

                    {/* Price Options */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {listing.priceHour && (
                        <span className="text-xs px-2 py-1 bg-[#1a1a1a] rounded text-[#888]">
                          {formatPrice(listing.priceHour)}/h
                        </span>
                      )}
                      {listing.priceDay && (
                        <span className="text-xs px-2 py-1 bg-[#6B7F5C]/20 text-[#7A8F6B] rounded font-medium">
                          {formatPrice(listing.priceDay)}/dia
                        </span>
                      )}
                      {listing.priceWeek && (
                        <span className="text-xs px-2 py-1 bg-[#1a1a1a] rounded text-[#888]">
                          {formatPrice(listing.priceWeek)}/sem
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                      <div>
                        <span className="text-lg font-bold text-[#7A8F6B]">
                          {formatPrice(getLowestPrice(listing))}
                        </span>
                        <span className="text-xs text-[#888]">{getPriceLabel(listing)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#676767]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {listing.views}
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
                <Share2 className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Nenhum item encontrado
                </h3>
                <p className="text-[#676767] mb-6">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#7A8F6B] text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  Limpar Filtros
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredListings.length > 0 && (
              <div className="text-center mt-10">
                <button className="px-8 py-4 bg-gradient-to-r from-[#6B7F5C] to-[#7A8F6B] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#6B7F5C]/30 transition-all">
                  Ver Mais Itens
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
