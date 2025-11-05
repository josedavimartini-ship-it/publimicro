"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { 
  Building2, Home, Trees, Waves, MapPin, BedDouble, 
  Bath, Car, Ruler, DollarSign, Filter, X, Search,
  Heart, Phone, Mail, ChevronDown, SlidersHorizontal
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Property type configurations
const PROPERTY_TYPES = [
  { value: 'all', label: 'All Properties', icon: Building2, description: '' },
  { value: 'apartment', label: 'Apartment', icon: Building2, description: 'City apartments and flats' },
  { value: 'house', label: 'House', icon: Home, description: 'Single-family homes' },
  { value: 'chacara', label: 'Chácara', icon: Trees, description: 'Small rural property (<2ha, near cities)' },
  { value: 'sitio', label: 'Sítio', icon: Trees, description: 'Medium farm (2-50 hectares)' },
  { value: 'fazenda', label: 'Fazenda', icon: Trees, description: 'Large farm (50+ hectares)' },
  { value: 'rancho', label: 'Rancho', icon: Waves, description: 'Property near water (2+ hectares)' },
  { value: 'commercial', label: 'Commercial', icon: Building2, description: 'Offices, stores, warehouses' },
  { value: 'land', label: 'Land', icon: MapPin, description: 'Empty lots and land' },
];

const TRANSACTION_TYPES = [
  { value: 'all', label: 'All Transactions' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' },
  { value: 'auction', label: 'Auction' },
];

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  transaction_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  total_area: number;
  city: string;
  state: string;
  country: string;
  slug: string;
  featured: boolean;
  property_photos: { url: string; is_cover: boolean }[];
}

export default function SearchPage() {
  const supabase = createClientComponentClient();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [propertyType, setPropertyType] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [minBathrooms, setMinBathrooms] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Fetch properties
  useEffect(() => {
    fetchProperties();
  }, [propertyType, transactionType]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_photos(url, is_cover)
        `)
        .eq('status', 'active')
        .not('published_at', 'is', null)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      // Apply filters
      if (propertyType !== 'all') {
        query = query.eq('property_type', propertyType);
      }
      if (transactionType !== 'all') {
        query = query.eq('transaction_type', transactionType);
      }
      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }
      if (minBedrooms) {
        query = query.gte('bedrooms', parseInt(minBedrooms));
      }
      if (minBathrooms) {
        query = query.gte('bathrooms', parseInt(minBathrooms));
      }
      if (minArea) {
        query = query.gte('total_area', parseFloat(minArea));
      }
      if (maxArea) {
        query = query.lte('total_area', parseFloat(maxArea));
      }
      if (city) {
        query = query.ilike('city', `%${city}%`);
      }
      if (state) {
        query = query.ilike('state', `%${state}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProperties();
  };

  const clearFilters = () => {
    setPropertyType('all');
    setTransactionType('all');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms('');
    setMinBathrooms('');
    setMinArea('');
    setMaxArea('');
    setCity('');
    setState('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeIcon = (type: string) => {
    const config = PROPERTY_TYPES.find(t => t.value === type);
    return config ? config.icon : Building2;
  };

  const getCoverPhoto = (photos: any[]) => {
    const cover = photos?.find(p => p.is_cover);
    return cover?.url || photos?.[0]?.url || '/images/placeholder-property.jpg';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#B87333] via-[#DAA520] to-[#FFD700] bg-clip-text text-transparent mb-3">
            Search Properties
          </h1>
          <p className="text-[#d8c68e] text-lg">
            Find your perfect property from our extensive listings
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#B87333] flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#676767] hover:text-[#B87333] transition flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>

              <div className="space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Transaction
                  </label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  >
                    {TRANSACTION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    State/Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter state"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-3 py-2 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-3 py-2 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Min. Bedrooms
                  </label>
                  <select
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Min. Bathrooms
                  </label>
                  <select
                    value={minBathrooms}
                    onChange={(e) => setMinBathrooms(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-4 py-3 text-[#e6c86b] focus:border-[#B87333] focus:outline-none"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-semibold text-[#d8c68e] mb-2">
                    Area (m² or hectares)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                      placeholder="Min"
                      className="bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-3 py-2 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                    />
                    <input
                      type="number"
                      value={maxArea}
                      onChange={(e) => setMaxArea(e.target.value)}
                      placeholder="Max"
                      className="bg-[#0a0a0a] border border-[#2a2a1a] rounded-lg px-3 py-2 text-[#e6c86b] placeholder-[#676767] focus:border-[#B87333] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-[#B87333] to-[#DAA520] hover:from-[#DAA520] hover:to-[#FFD700] text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#B87333] border-t-transparent"></div>
                <p className="mt-4 text-[#d8c68e]">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 text-[#676767] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#d8c68e] mb-2">No properties found</h3>
                <p className="text-[#676767] mb-6">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#B87333] hover:bg-[#DAA520] text-white font-semibold rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[#d8c68e]">
                    <span className="font-bold text-[#B87333]">{properties.length}</span> properties found
                  </p>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((property) => {
                    const IconComponent = getPropertyTypeIcon(property.property_type);
                    return (
                      <Link
                        key={property.id}
                        href={`/property/${property.slug}`}
                        className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] hover:border-[#B87333] rounded-2xl overflow-hidden transition-all hover:scale-[1.02] shadow-xl"
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={getCoverPhoto(property.property_photos)}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                          {property.featured && (
                            <div className="absolute top-4 left-4 px-3 py-1 bg-[#FFD700] text-[#0a0a0a] font-bold rounded-full text-sm z-10">
                              ⭐ Featured
                            </div>
                          )}
                          <div className="absolute top-4 right-4 px-3 py-1 bg-[#B87333] text-white font-semibold rounded-full text-sm z-10 capitalize">
                            {property.transaction_type}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Type Badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <IconComponent className="w-4 h-4 text-[#B87333]" />
                            <span className="text-sm text-[#676767] capitalize">
                              {property.property_type.replace('_', ' ')}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-[#e6c86b] mb-2 line-clamp-2 group-hover:text-[#FFD700] transition">
                            {property.title}
                          </h3>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-[#676767] mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>{property.city}, {property.state}</span>
                          </div>

                          {/* Features */}
                          <div className="flex items-center gap-4 mb-4 text-sm text-[#d8c68e]">
                            {property.bedrooms > 0 && (
                              <div className="flex items-center gap-1">
                                <BedDouble className="w-4 h-4" />
                                <span>{property.bedrooms}</span>
                              </div>
                            )}
                            {property.bathrooms > 0 && (
                              <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span>{property.bathrooms}</span>
                              </div>
                            )}
                            {property.parking_spaces > 0 && (
                              <div className="flex items-center gap-1">
                                <Car className="w-4 h-4" />
                                <span>{property.parking_spaces}</span>
                              </div>
                            )}
                            {property.total_area > 0 && (
                              <div className="flex items-center gap-1">
                                <Ruler className="w-4 h-4" />
                                <span>{property.total_area}m²</span>
                              </div>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-2xl font-bold text-[#B87333]">
                            {formatPrice(property.price)}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
