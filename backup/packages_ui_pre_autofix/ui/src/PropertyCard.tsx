"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Ruler, Bed, Bath, Car, Star } from "lucide-react";

export interface PropertyCardProps {
  // Core identifiers
  id: string;
  title: string;
  description?: string;
  
  // Pricing
  price: number;
  currentBid?: number; // For properties with bidding
  featured?: boolean;
  
  // Location
  location: {
    city: string;
    state: string;
    neighborhood?: string;
  };
  
  // Measurements
  area: {
    total: number; // Total area in m²
    built?: number; // Built area (optional)
  };
  
  // Features (optional)
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    parking?: number;
  };
  
  // Media
  photos: string[];
  
  // Navigation
  link: string; // Dynamic: /imoveis/[id] or /property/[slug]
  
  // Metadata
  type?: "sitio" | "property" | "listing"; // For styling variations
}

/**
 * Unified Property Card Component
 * 
 * Used across all PubliMicro apps for consistent property display.
 * Supports both Sítios Carcará and PubliProper properties.
 * 
 * Bronze/Gold/Sage color palette applied throughout.
 */
export default function PropertyCard({
  id,
  title,
  description,
  price,
  currentBid,
  featured = false,
  location,
  area,
  features,
  photos,
  link,
  type = "property",
}: PropertyCardProps) {
  const displayPrice = currentBid && currentBid > price ? currentBid : price;
  const firstPhoto = photos[0] || "/placeholder-property.jpg";
  const imageAlt = title || "Propriedade Publimicro";

  return (
    <Link
      href={link}
      className="block group transform transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#3a3a2a] hover:border-[#D4AF37] shadow-lg hover:shadow-[0_8px_30px_rgba(212,175,55,0.2)]"
      aria-label={`Ver detalhes de ${title}`}
    >
  {/* Photo Section */}
  {/* Reduced image height for better proportions on home and listing grids */}
  <div className="relative h-48 overflow-hidden bg-[#0a0a0a]">
        <Image
          src={firstPhoto}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] rounded-full shadow-lg z-10">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#0a0a0a] fill-[#0a0a0a]" />
              <span className="text-[#0a0a0a] font-bold text-xs uppercase tracking-wide">
                Destaque
              </span>
            </div>
          </div>
        )}

        {/* Current Bid Indicator */}
        {currentBid && currentBid > price && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#8B9B6E]/90 backdrop-blur-sm rounded-full shadow-lg z-10">
            <span className="text-[#0a0a0a] font-bold text-xs uppercase tracking-wide">
              🔥 Lance Ativo
            </span>
          </div>
        )}

        {/* Photo Count Badge */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs font-semibold">
            📷 {photos.length}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-[#D4AF37] line-clamp-2 group-hover:text-[#E6C98B] transition-colors">
          {title}
        </h3>

        {/* Description (if provided) */}
        {description && (
          <p className="text-[#A8896B] text-sm line-clamp-2">
            {description}
          </p>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-[#8B9B6E]">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm truncate">
            {location.neighborhood && `${location.neighborhood}, `}
            {location.city}/{location.state}
          </span>
        </div>

        {/* Features Grid */}
        {(area.total > 0 || features) && (
          <div className="flex flex-wrap gap-3 text-[#A8896B] text-sm">
            {/* Total Area */}
            {area.total > 0 && (
              <div className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4" />
                <span>{area.total.toLocaleString("pt-BR")}m²</span>
              </div>
            )}

            {/* Built Area */}
            {area.built && area.built > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs">Construído:</span>
                <span>{area.built.toLocaleString("pt-BR")}m²</span>
              </div>
            )}

            {/* Bedrooms */}
            {features?.bedrooms && features.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4" />
                <span>{features.bedrooms}</span>
              </div>
            )}

            {/* Bathrooms */}
            {features?.bathrooms && features.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4" />
                <span>{features.bathrooms}</span>
              </div>
            )}

            {/* Parking */}
            {features?.parking && features.parking > 0 && (
              <div className="flex items-center gap-1.5">
                <Car className="w-4 h-4" />
                <span>{features.parking}</span>
              </div>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="pt-4 border-t border-[#2a2a1a]">
          <div className="flex items-end justify-between">
            <div>
              {currentBid && currentBid > price ? (
                <>
                  <p className="text-xs text-[#8B9B6E] mb-1">Proposta Atual</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#CD7F32]">
                    R$ {displayPrice.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-[#A8896B] mt-1">
                    Inicial: R$ {price.toLocaleString("pt-BR")}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-[#8B9B6E] mb-1">
                    {type === "sitio" ? "Lance Inicial" : "Valor"}
                  </p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#CD7F32]">
                    R$ {displayPrice.toLocaleString("pt-BR")}
                  </p>
                </>
              )}
            </div>

            {/* CTA Arrow */}
            <div className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
