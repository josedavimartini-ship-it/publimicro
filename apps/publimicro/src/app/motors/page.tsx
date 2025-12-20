'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, MapPin, Calendar, Gauge, Fuel, Settings, 
  Car, Bike, Truck, Grid, List, Heart, Plus, X
} from 'lucide-react';
import { vehicleBrands } from '@/data/vehicles';

// Mock vehicle listings (replace with Supabase data)
const MOCK_VEHICLES = [
  {
    id: '1',
    title: 'Toyota Hilux SRX 2022',
    brand: 'Toyota',
    model: 'Hilux',
    version: 'SRX 2.8 Diesel',
    year: 2022,
    mileage: 45000,
    fuel: 'Diesel',
    transmission: 'Automático',
    price: 289000,
    location: 'Brasília, DF',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400',
    category: 'Pickup',
    featured: true,
  },
  {
    id: '2',
    title: 'Honda Civic EXL 2023',
    brand: 'Honda',
    model: 'Civic',
    version: 'EXL 2.0',
    year: 2023,
    mileage: 15000,
    fuel: 'Flex',
    transmission: 'CVT',
    price: 169000,
    location: 'São Paulo, SP',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    category: 'Sedan',
    featured: true,
  },
  {
    id: '3',
    title: 'Jeep Compass Limited 2021',
    brand: 'Jeep',
    model: 'Compass',
    version: 'Limited 2.0 Diesel',
    year: 2021,
    mileage: 65000,
    fuel: 'Diesel',
    transmission: 'Automático',
    price: 185000,
    location: 'Goiânia, GO',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
    category: 'SUV',
    featured: false,
  },
  {
    id: '4',
    title: 'Yamaha XJ6 N 2020',
    brand: 'Yamaha',
    model: 'XJ6 N',
    version: '600cc',
    year: 2020,
    mileage: 25000,
    fuel: 'Gasolina',
    transmission: 'Manual',
    price: 42000,
    location: 'Curitiba, PR',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Moto',
    featured: false,
  },
  {
    id: '5',
    title: 'Volkswagen Polo TSI 2024',
    brand: 'Volkswagen',
    model: 'Polo',
    version: 'TSI 1.0 Turbo',
    year: 2024,
    mileage: 5000,
    fuel: 'Flex',
    transmission: 'Automático',
    price: 98000,
    location: 'Rio de Janeiro, RJ',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
    category: 'Hatch',
    featured: true,
  },
  {
    id: '6',
    title: 'Chevrolet S10 High Country',
    brand: 'Chevrolet',
    model: 'S10',
    version: 'High Country 2.8 Diesel',
    year: 2023,
    mileage: 32000,
    fuel: 'Diesel',
    transmission: 'Automático',
    price: 269000,
    location: 'Uberlândia, MG',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
    category: 'Pickup',
    featured: false,
  },
];

const VEHICLE_CATEGORIES = [
  { id: 'all', label: 'Todos', icon: <Car className="w-5 h-5" /> },
  { id: 'car', label: 'Carros', icon: <Car className="w-5 h-5" /> },
  { id: 'motorcycle', label: 'Motos', icon: <Bike className="w-5 h-5" /> },
  { id: 'truck', label: 'Caminhões', icon: <Truck className="w-5 h-5" /> },
  { id: 'utility', label: 'Utilitários', icon: <Truck className="w-5 h-5" /> },
];

const PRICE_RANGES = [
  { label: 'Qualquer preço', min: 0, max: Infinity },
  { label: 'Até R$ 50.000', min: 0, max: 50000 },
  { label: 'R$ 50.000 - R$ 100.000', min: 50000, max: 100000 },
  { label: 'R$ 100.000 - R$ 200.000', min: 100000, max: 200000 },
  { label: 'R$ 200.000 - R$ 500.000', min: 200000, max: 500000 },
  { label: 'Acima de R$ 500.000', min: 500000, max: Infinity },
];

export default function MotorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [yearRange, setYearRange] = useState({ min: 2000, max: 2025 });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');

  // Filter vehicles
  const filteredVehicles = MOCK_VEHICLES.filter(vehicle => {
    const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || vehicle.brand === selectedBrand;
    const matchesPrice = vehicle.price >= priceRange.min && vehicle.price <= priceRange.max;
    const matchesYear = vehicle.year >= yearRange.min && vehicle.year <= yearRange.max;
    return matchesSearch && matchesBrand && matchesPrice && matchesYear;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'year-new':
        return b.year - a.year;
      case 'mileage':
        return a.mileage - b.mileage;
      default:
        return 0;
    }
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative py-16 px-6 bg-gradient-to-r from-blue-900/20 to-blue-800/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                🚗 Motors
              </h1>
              <p className="text-[#676767] text-lg">
                Encontre o veículo dos seus sonhos
              </p>
            </div>
            <Link
              href="/postar?category=vehicle"
              className="flex items-center gap-2 px-6 py-3 btn-secondary font-bold rounded-xl transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5 text-warm" />
              Anunciar Veículo
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#676767]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por marca, modelo ou versão..."
                className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-[#3a3a3a] text-[#D4A574] rounded-xl focus:outline-none focus:border-blue-500 text-lg"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                showFilters 
                  ? 'bg-blue-500 text-warm' 
                  : 'bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4A574] hover:border-blue-500'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>

          {/* Category Pills */}
          <div className="mt-6 flex gap-3 flex-wrap">
            {VEHICLE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-warm'
                    : 'bg-[#2a2a2a] text-[#676767] hover:bg-[#3a3a3a]'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="py-6 px-6 bg-[#1a1a1a] border-y border-[#3a3a3a]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Brand */}
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Todas as marcas</option>
                {vehicleBrands.filter(b => b.types.includes('car')).map(brand => (
                  <option key={brand.id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">Faixa de Preço</label>
              <select
                value={PRICE_RANGES.findIndex(p => p.label === priceRange.label)}
                onChange={(e) => setPriceRange(PRICE_RANGES[Number(e.target.value)])}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-blue-500"
              >
                {PRICE_RANGES.map((range, i) => (
                  <option key={i} value={i}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Year Min */}
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">Ano Mínimo</label>
              <input
                type="number"
                value={yearRange.min}
                onChange={(e) => setYearRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                min={1980}
                max={2025}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Year Max */}
            <div>
              <label className="block text-[#D4A574] font-semibold mb-2">Ano Máximo</label>
              <input
                type="number"
                value={yearRange.max}
                onChange={(e) => setYearRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                min={1980}
                max={2025}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="max-w-7xl mx-auto mt-4">
            <button
              onClick={() => {
                setSelectedBrand('');
                setPriceRange(PRICE_RANGES[0]);
                setYearRange({ min: 2000, max: 2025 });
                setSearchTerm('');
              }}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </button>
          </div>
        </section>
      )}

      {/* Results Header */}
      <section className="py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <p className="text-[#676767]">
            <span className="text-[#D4A574] font-bold">{sortedVehicles.length}</span> veículos encontrados
          </p>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] text-[#D4A574] rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="recent">Mais recentes</option>
              <option value="price-low">Menor preço</option>
              <option value="price-high">Maior preço</option>
              <option value="year-new">Mais novos</option>
              <option value="mileage">Menor km</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-[#3a3a3a] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-[#2a2a2a] text-[#676767]'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-[#2a2a2a] text-[#676767]'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="py-6 px-6 pb-16">
        <div className={`max-w-7xl mx-auto ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'flex flex-col gap-4'
        }`}>
          {sortedVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
          ))}
        </div>

        {sortedVehicles.length === 0 && (
          <div className="max-w-7xl mx-auto text-center py-16">
            <Car className="w-16 h-16 mx-auto text-[#3a3a3a] mb-4" />
            <h3 className="text-xl text-[#D4A574] font-bold mb-2">Nenhum veículo encontrado</h3>
            <p className="text-[#676767]">Tente ajustar os filtros ou buscar por outro termo</p>
          </div>
        )}
      </section>
    </main>
  );
}

function VehicleCard({ vehicle, viewMode }: { vehicle: typeof MOCK_VEHICLES[0], viewMode: 'grid' | 'list' }) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (viewMode === 'list') {
    return (
      <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl overflow-hidden flex hover:border-blue-500/50 transition-all group">
        <div className="relative w-64 h-48 flex-shrink-0">
          <img
            src={vehicle.image}
            alt={vehicle.title}
            className="w-full h-full object-cover"
          />
          {vehicle.featured && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
              Destaque
            </span>
          )}
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#D4A574] mb-1 group-hover:text-blue-400 transition-colors">
              {vehicle.title}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm text-[#676767]">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{vehicle.year}</span>
              <span className="flex items-center gap-1"><Gauge className="w-4 h-4" />{vehicle.mileage.toLocaleString('pt-BR')} km</span>
              <span className="flex items-center gap-1"><Fuel className="w-4 h-4" />{vehicle.fuel}</span>
              <span className="flex items-center gap-1"><Settings className="w-4 h-4" />{vehicle.transmission}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{vehicle.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-black text-blue-400">
              R$ {vehicle.price.toLocaleString('pt-BR')}
            </span>
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
                className={`p-2 rounded-lg transition-all ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-[#3a3a3a] text-[#676767] hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <Link
                href={`/motors/${vehicle.id}`}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group">
      <div className="relative h-48">
        <img
          src={vehicle.image}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        {vehicle.featured && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
            Destaque
          </span>
        )}
        <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
          {vehicle.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[#D4A574] mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
          {vehicle.title}
        </h3>
        <div className="flex flex-wrap gap-2 text-xs text-[#676767] mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{vehicle.year}</span>
          <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{vehicle.mileage.toLocaleString('pt-BR')} km</span>
          <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{vehicle.fuel}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#676767] mb-3">
          <MapPin className="w-3 h-3" />
          {vehicle.location}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#3a3a3a]">
          <span className="text-xl font-black text-blue-400">
            R$ {vehicle.price.toLocaleString('pt-BR')}
          </span>
          <Link
            href={`/motors/${vehicle.id}`}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            Ver mais →
          </Link>
        </div>
      </div>
    </div>
  );
}
