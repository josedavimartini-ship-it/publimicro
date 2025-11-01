"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, DollarSign, Maximize2 } from "lucide-react";

interface RecentProperty {
  id: string;
  nome: string;
  localizacao: string;
  preco: number;
  area_total: number;
  fotos: string[];
  viewedAt: number;
}

export default function RecentlyViewed() {
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        const properties = JSON.parse(stored);
        // Sort by viewedAt descending and take last 5
        const sorted = properties
          .sort((a: RecentProperty, b: RecentProperty) => b.viewedAt - a.viewedAt)
          .slice(0, 5);
        setRecentProperties(sorted);
      }
    } catch (error) {
      console.error("Error loading recently viewed:", error);
    }
  };

  if (recentProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-8 h-8 text-[#FF6B35]" />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4A574] to-[#FF6B35]">
            Vistos Recentemente
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recentProperties.map((property) => (
            <Link
              key={property.id}
              href={`/imoveis/${property.id}`}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl overflow-hidden hover:border-[#FF6B35] transition-all hover:scale-105 shadow-lg hover:shadow-2xl group"
            >
              {/* Image */}
              <div className="relative w-full h-40 bg-[#2a2a1a] overflow-hidden">
                {property.fotos && property.fotos[0] ? (
                  <Image
                    src={property.fotos[0]}
                    alt={property.nome}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-[#676767]" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-[#D4A574] mb-2 group-hover:text-[#FF6B35] transition-colors line-clamp-1">
                  {property.nome}
                </h3>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-[#8B9B6E]">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{property.localizacao}</span>
                  </div>

                  {property.area_total && (
                    <div className="flex items-center gap-1 text-[#8B9B6E]">
                      <Maximize2 className="w-3 h-3" />
                      <span>{property.area_total} ha</span>
                    </div>
                  )}

                  {property.preco && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-[#FF6B35]" />
                      <span className="text-[#FF6B35] font-bold">
                        R$ {property.preco.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function to add property to recently viewed
export function addToRecentlyViewed(property: Omit<RecentProperty, "viewedAt">) {
  try {
    const stored = localStorage.getItem("recentlyViewed");
    let properties: RecentProperty[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists
    properties = properties.filter(p => p.id !== property.id);

    // Add to beginning with current timestamp
    properties.unshift({
      ...property,
      viewedAt: Date.now()
    });

    // Keep only last 10
    properties = properties.slice(0, 10);

    localStorage.setItem("recentlyViewed", JSON.stringify(properties));
  } catch (error) {
    console.error("Error saving to recently viewed:", error);
  }
}
