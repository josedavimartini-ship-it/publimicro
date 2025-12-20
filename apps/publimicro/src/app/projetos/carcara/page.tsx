"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  MapPin, Maximize2, DollarSign, ChevronRight, Star, TreePine, 
  Droplets, Zap, Calendar, MessageCircle, Info, Gavel, Play, Pause, Map
} from 'lucide-react';
import { fetchCanonicalSitios, getRanchCoverPhoto } from '@/lib/carcaraHelpers';
import Breadcrumbs from '@/components/Breadcrumbs';

// Dynamic import for Harpy Eagle 3D (SSR disabled for Three.js)
const HarpyEagle3D = dynamic(() => import('@/components/HarpyEagle3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-transparent flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
    </div>
  )
});

// Dynamic import for Interactive Carcará Map (SSR disabled)
const InteractiveCarcaraMap = dynamic(() => import('@/components/InteractiveCarcaraMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-2xl animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
        <span className="text-[#8B9B6E]">Carregando mapa interativo...</span>
      </div>
    </div>
  )
});

interface Sitio {
  id: string;
  slug: string;
  nome: string;
  title?: string;
  localizacao: string;
  preco: number;
  area_total: number;
  fotos: string[];
  descricao?: string;
  current_bid: number | null;
  agua: boolean;
  energia: boolean;
  video_url?: string;
  accepts_proposals?: boolean;
}

// Supabase storage base URL
const STORAGE_BASE = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios';

export default function CarcaraProjectPage() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function loadSitios() {
      try {
        const data = await fetchCanonicalSitios({ limit: 6 });
        setSitios(data as Sitio[]);
      } catch (error) {
        console.error('Error loading sitios:', error);
      } finally {
        setLoading(false);
      }
    }
    
    void loadSitios();
  }, []);

  const toggleSound = () => {
    if (audioRef.current) {
      if (soundPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(() => {});
      }
      setSoundPlaying(!soundPlaying);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
      {/* Hero Section with Sunset Background and 3D Bird */}
      <section className="relative min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={`${STORAGE_BASE}/pordosol4mediumearthwide.jpg`}
          alt="Pôr do sol no Lago das Brisas"
          fill
          className="object-cover"
          priority
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        
        {/* 3D Harpy Eagle - flies in background and attacks screen periodically */}
        <div className="absolute inset-0 pointer-events-none">
          <HarpyEagle3D 
            attackInterval={20000} // Attack every 20 seconds
            onAttack={toggleSound} // Play sound when attacking
          />
        </div>
        
        {/* Sound Control */}
        <button
          onClick={toggleSound}
          className="absolute top-8 right-8 z-30 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all group"
          aria-label={soundPlaying ? 'Pausar som do Gavião Real' : 'Tocar som do Gavião Real'}
        >
          {soundPlaying ? (
            <Pause className="w-6 h-6 text-[#D4AF37]" />
          ) : (
            <Play className="w-6 h-6 text-[#D4AF37]" />
          )}
          <span className="absolute -bottom-8 right-0 text-xs text-[#8B9B6E] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Som do Gavião Real
          </span>
        </button>
        
        {/* Audio Element - Harpy Eagle/Gavião Real cry */}
        <audio ref={audioRef} preload="metadata">
          <source src="/sounds/carcara.mp3" type="audio/mpeg" />
        </audio>
        
        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
          <Breadcrumbs />
          
          <div className="mt-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] rounded-full shadow-lg">
              <Star className="w-5 h-5 text-black animate-pulse" />
              <span className="text-black font-bold text-lg tracking-widest uppercase">Super Destaque</span>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#CD7F32] to-[#B87333] mb-6 leading-tight drop-shadow-2xl">
              Sítios Carcará
            </h1>
            
            {/* Description */}
            <p className="text-[#E6C98B] text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed font-medium drop-shadow-lg">
              6 propriedades exclusivas de <span className="text-[#D4AF37] font-bold">2 hectares cada</span>, 
              às margens do Lago das Brisas, em <span className="text-[#D4AF37] font-semibold">Buriti Alegre, GO</span>.
              <br /><br />
              <span className="text-[#A8C97F]">🎯 Aceitando propostas a partir de Janeiro 2026</span>
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-[#1a1a1a]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2a2a1a]">
                <TreePine className="w-5 h-5 text-[#A8C97F]" />
                <span className="text-[#D4C4A8]">100% Natureza</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1a1a1a]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2a2a1a]">
                <Droplets className="w-5 h-5 text-[#6B8F71]" />
                <span className="text-[#D4C4A8]">Rio Perene</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1a1a1a]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2a2a1a]">
                <Zap className="w-5 h-5 text-[#E6C98B]" />
                <span className="text-[#D4C4A8]">Energia Solar</span>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex gap-4 flex-wrap">
              <a
                href="https://www.sitioscarcara.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-gradient-to-r from-[#CD7F32] to-[#B87333] hover:from-[#D4AF37] hover:to-[#CD7F32] text-black text-lg font-bold rounded-full transition-all hover:scale-105 shadow-2xl flex items-center gap-2"
              >
                <Info className="w-5 h-5" />
                Mais Informações
              </a>
              <Link
                href="/contato"
                className="px-10 py-4 border-2 border-[#6B7F5C] text-[#A8C97F] text-lg font-bold rounded-full hover:bg-[#6B7F5C]/10 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Entrar em Contato
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E6C98B] mb-4">
              🏡 Conheça Nossos 6 Sítios
            </h2>
            <p className="text-[#8B9B6E] max-w-2xl mx-auto">
              Cada propriedade é única, com características especiais e vista privilegiada para o lago.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full"></div>
            </div>
          ) : sitios.length === 0 ? (
            <div className="text-center py-12 bg-[#1a1a1a]/50 rounded-2xl border border-[#2a2a1a]">
              <p className="text-[#8B9B6E] mb-4">Em breve: 6 sítios exclusivos às margens do lago.</p>
              <p className="text-[#D4AF37] font-semibold">Aceitando propostas a partir de Janeiro 2026</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sitios.map((sitio) => (
                <div
                  key={sitio.id}
                  className="group bg-[#1a1a1a] border border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 hover:transform hover:scale-[1.02] shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={sitio.fotos?.[0] || getRanchCoverPhoto(sitio.slug)}
                      alt={sitio.nome}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    
                    {/* Bid Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Gavel className="w-4 h-4" />
                      Aceita Propostas
                    </div>
                    
                    {/* Video indicator */}
                    {sitio.video_url && (
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-warm flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        Vídeo disponível
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#E6C98B] mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {sitio.nome}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[#8B9B6E] text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {sitio.localizacao || 'Lago das Brisas, GO'}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-[#6B8F71]" />
                        <span className="text-[#D4C4A8]">
                          {sitio.area_total ? `${sitio.area_total.toLocaleString('pt-BR')} m²` : '~20.000 m²'}
                        </span>
                      </div>
                      {sitio.preco && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#E6C98B]" />
                          <span className="text-[#E6C98B] font-bold">
                            R$ {(sitio.preco / 1000).toFixed(0)}k
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Link
                        href={`/proposta?property=${sitio.slug}`}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-black text-sm font-bold rounded-lg hover:scale-105 transition-transform"
                      >
                        <Gavel className="w-4 h-4" />
                        Proposta
                      </Link>
                      <Link
                        href={`/schedule-visit?property=${sitio.slug}`}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-[#6B7F5C] text-white text-sm font-bold rounded-lg hover:scale-105 transition-transform"
                      >
                        <Calendar className="w-4 h-4" />
                        Agendar
                      </Link>
                    </div>

                    {/* View Details Link */}
                    <Link
                      href={`/imoveis/${sitio.slug}`}
                      className="flex items-center justify-between pt-4 border-t border-[#2a2a1a] text-[#8B9B6E] hover:text-[#D4AF37] transition-colors"
                    >
                      <span className="text-sm font-medium">Ver detalhes completos</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#6B7F5C]/20 border border-[#6B7F5C]/40 rounded-full">
              <Map className="w-5 h-5 text-[#A8C97F]" />
              <span className="text-[#A8C97F] font-semibold">Mapa Interativo</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#E6C98B] mb-4">
              🗺️ Localização dos Sítios
            </h2>
            <p className="text-[#8B9B6E] max-w-2xl mx-auto">
              Clique em cada área para navegar diretamente ao perfil do sítio. 
              Explore a localização privilegiada às margens do Lago das Brisas.
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden border-2 border-[#2a2a1a] shadow-2xl">
            <InteractiveCarcaraMap height="650px" showLabels={true} />
          </div>
        </div>
      </section>

      {/* Proposal Info Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full">
            <Gavel className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold">Sistema de Propostas</span>
          </div>
          
          <h2 className="text-3xl font-bold text-[#E6C98B] mb-4">
            Como Funciona?
          </h2>
          <p className="text-[#B8A890] mb-8 max-w-2xl mx-auto">
            Os Sítios Carcará utilizam um sistema de propostas. Você pode fazer uma oferta 
            a qualquer momento, e nossa equipe entrará em contato para negociação.
            <br /><br />
            <span className="text-[#A8C97F] font-semibold">
              📅 Início das negociações: Janeiro de 2026
            </span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contato"
              className="px-8 py-3 bg-gradient-to-r from-[#6B7F5C] to-[#4A5A3C] text-white font-bold rounded-full hover:scale-105 transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Fale Conosco
            </Link>
            <a
              href="https://www.sitioscarcara.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-[#D4AF37] text-[#D4AF37] font-bold rounded-full hover:bg-[#D4AF37]/10 transition-all flex items-center gap-2"
            >
              <Info className="w-5 h-5" />
              Site Oficial
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}





















