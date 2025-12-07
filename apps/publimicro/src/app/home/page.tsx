"use client";

import Link from "next/link";
import { 
  Building2, Car, Wrench, Ship, Globe, Users, Plane, ShoppingBag,
  Search, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import CarcaraHighlights from "@/components/home/CarcaraHighlights";

// The 8 main sections of AcheMe with Unsplash backgrounds
const sections = [
  {
    id: "proper",
    name: "Proper",
    subtitle: "Imóveis",
    description: "Casas, apartamentos, sítios, fazendas e terrenos",
    icon: Building2,
    href: "/imoveis",
    color: "from-[#6B7F5C] to-[#4A5A3C]",
    stats: { count: 0, label: "imóveis" },
    bgImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
  },
  {
    id: "motors",
    name: "Motors",
    subtitle: "Veículos",
    description: "Carros, motos, caminhões e utilitários",
    icon: Car,
    href: "/motors",
    color: "from-[#CD7F32] to-[#8B5A2B]",
    stats: { count: 0, label: "veículos" },
    bgImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80",
  },
  {
    id: "machina",
    name: "Machina",
    subtitle: "Máquinas",
    description: "Equipamentos agrícolas, industriais e construção",
    icon: Wrench,
    href: "/machina",
    color: "from-[#5A5A5A] to-[#3A3A3A]",
    stats: { count: 0, label: "máquinas" },
    bgImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80",
  },
  {
    id: "marine",
    name: "Marine",
    subtitle: "Náutica",
    description: "Barcos, lanchas, jet skis e equipamentos náuticos",
    icon: Ship,
    href: "/marine",
    color: "from-[#2C5F6F] to-[#1A3A42]",
    stats: { count: 0, label: "embarcações" },
    bgImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&q=80",
  },
  {
    id: "global",
    name: "Global",
    subtitle: "Internacional",
    description: "Oportunidades e negócios ao redor do mundo",
    icon: Globe,
    href: "/global",
    color: "from-[#4A6B8A] to-[#2A4A5A]",
    stats: { count: 0, label: "países" },
    bgImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=80",
  },
  {
    id: "share",
    name: "Share",
    subtitle: "Compartilhar",
    description: "Coworking, compartilhamento e parcerias",
    icon: Users,
    href: "/share",
    color: "from-[#7A5C8B] to-[#4A3A5A]",
    stats: { count: 0, label: "ofertas" },
    bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
  },
  {
    id: "journey",
    name: "Journey",
    subtitle: "Viagens",
    description: "Turismo, hospedagem e experiências",
    icon: Plane,
    href: "/journey",
    color: "from-[#D4AF37] to-[#8B7355]",
    stats: { count: 0, label: "destinos" },
    bgImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
  },
  {
    id: "tudo",
    name: "Tudo",
    subtitle: "Classificados",
    description: "Eletrônicos, móveis, roupas e muito mais",
    icon: ShoppingBag,
    href: "/acheme-coisas",
    color: "from-[#8B9B6E] to-[#5A6B4C]",
    stats: { count: 0, label: "anúncios" },
    bgImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80",
  },
];

export default function HomePage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentListings, setRecentListings] = useState<Array<{ id: string; nome: string; preco: number; fotos: string[] }>>([]);

  useEffect(() => {
    // Fetch some stats
    async function fetchStats() {
      try {
        const { count: sitiosCount } = await supabase
          .from("sitios")
          .select("*", { count: "exact", head: true });
        
        const { count: listingsCount } = await supabase
          .from("listings")
          .select("*", { count: "exact", head: true });

        setStats({
          proper: sitiosCount || 0,
          tudo: listingsCount || 0,
        });

        // Fetch recent listings
        const { data: recent } = await supabase
          .from("sitios")
          .select("id, nome, preco, fotos")
          .order("created_at", { ascending: false })
          .limit(4);

        if (recent) {
          setRecentListings(recent);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section - Clean AcheMe Branding */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-[#0a0a0a]" />
        
        {/* Subtle decorative elements */}
        <div className="absolute top-10 left-5 w-48 h-48 bg-[#D4AF37]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-5 w-64 h-64 bg-[#6B7F5C]/3 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* AcheMe Logo/Brand - Compact */}
          <div className="mb-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-br from-[#C9A87C] via-[#D4AF37] to-[#B87333] bg-clip-text text-transparent drop-shadow-2xl">
                Ache
              </span>
              <span className="bg-gradient-to-br from-[#8B9B6E] via-[#A8C97F] to-[#6B8E23] bg-clip-text text-transparent drop-shadow-2xl">
                Me
              </span>
            </h1>
          </div>

          {/* Short tagline */}
          <p className="text-base md:text-lg text-[#B8A890]/80 max-w-sm mx-auto mb-8 font-light">
            Encontre. Negocie. Feche.
          </p>

          {/* Single prominent CTA */}
          <div className="flex justify-center">
            <Link
              href="/buscar"
              className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#6B7F5C] to-[#8B9B6E] text-white rounded-full font-semibold text-lg hover:scale-105 transition-all shadow-2xl shadow-[#6B7F5C]/20"
            >
              <Search className="w-5 h-5" />
              Explorar
            </Link>
          </div>
        </div>
      </section>

      {/* Sítios Carcará - Featured Project */}
      <CarcaraHighlights />

      {/* 8 Sections Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#C9A87C] mb-4">
              Explore Nossas Seções
            </h2>
            <p className="text-[#8B9B6E]">
              8 categorias especializadas para encontrar exatamente o que você procura
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              const count = stats[section.id] || section.stats.count;
              
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="group relative overflow-hidden rounded-2xl border-2 border-[#2a2a1a] hover:border-[#6B7F5C]/50 transition-all hover:scale-[1.02] hover:shadow-xl min-h-[200px]"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${section.bgImage})` }}
                  />
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/85 group-hover:via-black/50 transition-all" />
                  
                  {/* Colored accent overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-30 transition-opacity`} />
                  
                  <div className="relative p-6 h-full flex flex-col justify-end">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-0.5 drop-shadow-lg">
                      {section.name}
                    </h3>
                    <p className="text-sm text-[#E6C98B] mb-1 drop-shadow">
                      {section.subtitle}
                    </p>
                    <p className="text-xs text-gray-300/80 line-clamp-2 drop-shadow">
                      {section.description}
                    </p>

                    {/* Stats */}
                    {count > 0 && (
                      <p className="text-xs text-[#A8C97F] mt-2 drop-shadow">
                        <span className="font-bold">{count.toLocaleString("pt-BR")}</span> {section.stats.label}
                      </p>
                    )}

                    {/* Arrow */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      {recentListings.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#C9A87C]">
                  Adicionados Recentemente
                </h2>
                <p className="text-[#8B9B6E]">Os últimos anúncios publicados</p>
              </div>
              <Link
                href="/imoveis"
                className="flex items-center gap-2 text-[#A8C97F] hover:text-[#C9A87C] transition-colors"
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/imoveis/${listing.id}`}
                  className="group rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a1a] hover:border-[#6B7F5C]/50 transition-all"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {listing.fotos?.[0] ? (
                      <img
                        src={listing.fotos[0]}
                        alt={listing.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2a2a1a] flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-[#676767]" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-[#E6C98B] line-clamp-1">
                      {listing.nome}
                    </h3>
                    <p className="text-lg font-bold text-[#A8C97F]">
                      R$ {listing.preco?.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#C9A87C] mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-lg text-[#8B9B6E] mb-8">
            Crie sua conta gratuitamente e comece a anunciar ou encontre o que procura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/entrar"
              className="px-8 py-4 bg-gradient-to-r from-[#6B7F5C] to-[#4A5A3C] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Criar Conta Grátis
            </Link>
            <Link
              href="/contato"
              className="px-8 py-4 border-2 border-[#2a2a1a] text-[#B8A890] rounded-xl font-bold text-lg hover:border-[#6B7F5C] hover:text-[#A8C97F] transition-colors"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-20" />
    </div>
  );
}
