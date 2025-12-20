"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Carcara3D } from "@publimicro/ui";
import { Sparkles, MapPin, Ruler } from "lucide-react";

// Get from env - this will be replaced at build time
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://irrzpwzyqcubhhjeuakc.supabase.co";

// The 6 Carcará ranch slugs
const CARCARA_SLUGS = ['surucua', 'juriti', 'seriema', 'mergulhao', 'bigua', 'abare'];

interface Ranch {
  id: string;
  title: string;
  description?: string;
  city?: string;
  state?: string;
  price?: number;
  total_area?: number;
  slug?: string;
  featured?: boolean;
  latitude?: number;
  longitude?: number;
}

// Function to get ranch photo URL from Supabase storage
function getRanchPhotoUrl(slug: string): string {
  // Each ranch has photos in its folder, use a default sunset image for now
  const ranchImages: Record<string, string> = {
    'juriti': `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios/juriti/20251107_162023.jpg`,
    'mergulhao': `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios/mergulhao/20251107_162023.jpg`,
    'seriema': `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios/seriema/20251107_162023.jpg`,
    'surucua': `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios/surucua.jpg`,
    'bigua': `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios/pordosol7.jpg`,
    'abare': `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios/pordosolOrange.jpg`,
  };
  return ranchImages[slug] || `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg`;
}

export default function CarcaraHighlights() {
  const [ranches, setRanches] = useState<Ranch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanches(): Promise<void> {
      setLoading(true);
      // Query from properties table where the ranches actually are
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, description, city, state, price, total_area, slug, featured, latitude, longitude")
        .in("slug", CARCARA_SLUGS)
        .eq("property_type", "sitio")
        .order("title", { ascending: true });

      if (!error && data && data.length > 0) {
        setRanches(data);
      } else {
        console.error("Erro ao buscar sítios Carcará:", error);
      }
      setLoading(false);
    }
    void fetchRanches();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Super highlight banner with 3D Bird - DARKER text for contrast */}
      <Link
        href="/projetos/carcara"
        className="relative block h-[420px] md:h-[480px] min-h-[420px] md:min-h-[480px] w-full mb-16 group overflow-hidden rounded-2xl shadow-2xl"
      >
        <Image
          src="https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg"
          alt="Sítios Carcará"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        {/* Stronger dark overlay for text readability */}
        <div className="absolute inset-0 carcara-overlay group-hover:opacity-95 transition-all"></div>
        
        {/* 3D Carcará Bird - larger, centered-right and behind overlay text */}
        <div className="absolute top-1/2 right-20 transform -translate-y-1/2 w-[320px] h-[320px] md:w-[440px] md:h-[440px] z-10 hidden lg:block pointer-events-none">
          <Carcara3D 
            scale={2.0} 
            autoRotate={true}
            rotationSpeed={0.2}
            onSoundTrigger={() => {
              const audio = document.getElementById('carcara-sound') as HTMLAudioElement;
              if (audio && audio.paused) {
                audio.volume = 0.5;
                audio.play().catch(() => {});
              }
            }}
          />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 carcara-badge rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 text-black animate-pulse" />
            <span className="text-black font-bold text-sm tracking-widest uppercase">Destaque</span>
          </div>
          
          {/* Title with text-shadow for better readability */}
          <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-heading drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Sítios Carcará
          </h2>
          <p className="max-w-2xl text-base md:text-lg leading-relaxed text-muted drop-shadow-lg mb-6">
            Natureza, conforto e sustentabilidade em 6 sítios exclusivos às margens do Lago das Brisas
          </p>
          <span className="inline-flex items-center gap-2 btn-primary">
            <span>🦅</span>
            <span>Conhecer Projeto</span>
          </span>
        </div>
        
        {/* Audio element for bird sound */}
        <audio id="carcara-sound" preload="metadata">
          <source src="/sounds/carcara.mp3" type="audio/mpeg" />
        </audio>
      </Link>

      {/* Section Title */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-heading mb-2">
          🏡 Destaques Rurais
        </h3>
        <p className="text-muted">
          {ranches.length > 0 ? `${ranches.length} sítios disponíveis no projeto Carcará` : 'Carregando propriedades...'}
        </p>
      </div>

      {/* Ranch Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-gold border-t-transparent"></div>
        </div>
      ) : ranches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ranches.map((ranch) => (
            <Link
              key={ranch.id}
              href={`/imoveis/${ranch.slug || ranch.id}`}
              className="group relative bg-card rounded-2xl overflow-hidden border-default hover:border-accent-gold transition-all hover:scale-[1.02] shadow-xl"
            >
              {/* Image */}
              <div className="relative h-48 min-h-[192px] overflow-hidden">
                <img
                  src={getRanchPhotoUrl(ranch.slug || '')}
                  alt={ranch.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.dataset.fallback) {
                      img.dataset.fallback = 'true';
                      img.src = '/images/sections/placeholder-section.svg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                
                {/* Price badge */}
                {ranch.price && ranch.price > 0 && (
                  <div className="absolute top-3 right-3 price-badge">
                    R$ {(ranch.price / 1000).toFixed(0)}k
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h4 className="text-lg font-bold text-warm mb-2 group-hover-text-accent transition-colors">
                  {ranch.title}
                </h4>
                
                <div className="flex items-center gap-2 text-sm text-muted mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Lago das Brisas, GO</span>
                </div>
                
                {ranch.total_area && (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <Ruler className="w-4 h-4" />
                    <span>{ranch.total_area.toLocaleString('pt-BR')} m²</span>
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-[#2a2a1a]">
                  <span className="text-xs text-[#CD7F32] font-medium uppercase tracking-wider">
                    Ver Detalhes →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#1a1a1a]/50 rounded-2xl border border-[#2a2a1a]">
          <p className="text-[#8B9B6E] mb-4">Em breve: 6 sítios exclusivos às margens da represa.</p>
          <Link 
            href="/projetos/carcara" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#4A5A3C] text-white rounded-lg hover:opacity-90 transition font-medium"
          >
            Ver detalhes do projeto
          </Link>
        </div>
      )}
    </section>
  );
}

