"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Building2, Home, Trees, Waves, MapPin, BedDouble, Bath, Car, Ruler,
  Heart, Phone, Mail, Share2, Printer, X, ChevronLeft, ChevronRight
} from "lucide-react";
import Link from "next/link";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description?: string;
    property_type: string;
    transaction_type: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    parking_spaces?: number;
    total_area?: number;
    city: string;
    state: string;
    country?: string;
    slug: string;
    featured?: boolean;
    property_photos?: { url: string; is_cover: boolean }[];
  };
  onFavorite?: () => void;
  isFavorited?: boolean;
  showFazerProposta?: boolean;
  onFazerProposta?: () => void;
}

const PROPERTY_TYPE_ICONS: Record<string, any> = {
  apartment: Building2,
  house: Home,
  chacara: Trees,
  sitio: Trees,
  fazenda: Trees,
  rancho: Waves,
  commercial: Building2,
  land: MapPin,
};

export default function PropertyCard({
  property,
  onFavorite,
  isFavorited = false,
  showFazerProposta = false,
  onFazerProposta,
}: PropertyCardProps) {
  const IconComponent = PROPERTY_TYPE_ICONS[property.property_type] || Building2;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCoverPhoto = (photos: any[]) => {
    const cover = photos?.find(p => p.is_cover);
    return cover?.url || photos?.[0]?.url || '/images/placeholder-property.jpg';
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Apartment',
      house: 'House',
      chacara: 'Chácara',
      sitio: 'Sítio',
      fazenda: 'Fazenda',
      rancho: 'Rancho',
      commercial: 'Commercial',
      land: 'Land',
    };
    return labels[type] || type;
  };

  return (
    <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] hover:border-[#B87333] rounded-2xl overflow-hidden transition-all hover:scale-[1.02] shadow-xl">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Link href={`/property/${property.slug}`}>
          <Image
            src={getCoverPhoto(property.property_photos || [])}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
        </Link>
        
        {property.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-[#FFD700] text-[#0a0a0a] font-bold rounded-full text-sm z-10">
            ⭐ Featured
          </div>
        )}
        
        <div className="absolute top-4 right-4 px-3 py-1 bg-[#B87333] text-white font-semibold rounded-full text-sm z-10 capitalize">
          {property.transaction_type}
        </div>

        {/* Favorite Button */}
        {onFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite();
            }}
            className="absolute bottom-4 right-4 p-3 bg-black/60 hover:bg-black/80 rounded-full transition z-10"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <IconComponent className="w-4 h-4 text-[#B87333]" />
          <span className="text-sm text-[#676767] capitalize">
            {getPropertyTypeLabel(property.property_type)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/property/${property.slug}`}>
          <h3 className="text-xl font-bold text-[#e6c86b] mb-2 line-clamp-2 group-hover:text-[#FFD700] transition">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-[#676767] mb-4">
          <MapPin className="w-4 h-4" />
          <span>{property.city}, {property.state}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mb-4 text-sm text-[#d8c68e]">
          {property.bedrooms && property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.parking_spaces && property.parking_spaces > 0 && (
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4" />
              <span>{property.parking_spaces}</span>
            </div>
          )}
          {property.total_area && property.total_area > 0 && (
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{property.total_area}m²</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-[#B87333]">
            {formatPrice(property.price)}
          </div>

          {showFazerProposta && onFazerProposta && (
            <button
              onClick={onFazerProposta}
              className="px-4 py-2 bg-gradient-to-r from-[#B87333] to-[#DAA520] hover:from-[#DAA520] hover:to-[#FFD700] text-white font-bold rounded-lg transition-all text-sm"
            >
              Fazer Proposta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
