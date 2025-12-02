"use client";

import Link from "next/link";
import { 
  Building2, Car, Wrench, Ship, Globe, Users, Plane, ShoppingBag,
  Search, TrendingUp, Shield, Star, ArrowRight, Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import CarcaraHighlights from "@/components/home/CarcaraHighlights";

// The 8 main sections of AcheMe (simplified names without AcheMe prefix)
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
  },
];

// Featured highlights
const highlights = [
  { icon: Shield, text: "Transações Seguras", description: "Pagamentos protegidos" },
  { icon: TrendingUp, text: "Lances em Tempo Real", description: "Sistema de leilão integrado" },
  { icon: Star, text: "Vendedores Verificados", description: "Confiança garantida" },
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
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-[#0a0a0a]" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#6B7F5C]/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main headline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              <span className="bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent">
                Ache
              </span>
              <span className="bg-gradient-to-r from-[#8B9B6E] via-[#A8C97F] to-[#6B8E23] bg-clip-text text-transparent">
                Me
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#C9A87C] font-medium">
              Ecossistema de Negócios
            </p>
          </div>

          <p className="text-lg md:text-xl text-[#B8A890] max-w-2xl mx-auto mb-10">
            A plataforma mais completa para comprar, vender e negociar.
            De imóveis a eletrônicos, de veículos a serviços – tudo em um só lugar.
          </p>

          {/* Search CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/buscar"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-[#CD7F32] to-[#B87333] text-[#0a0a0a] rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              <Search className="w-6 h-6" />
              Começar a Buscar
            </Link>
            <Link
              href="/anunciar"
              className="flex items-center gap-3 px-8 py-4 border-2 border-[#6B7F5C] text-[#A8C97F] rounded-xl font-bold text-lg hover:bg-[#6B7F5C]/10 transition-colors"
            >
              <Sparkles className="w-6 h-6" />
              Anunciar Grátis
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-[#8B9B6E]">
                <item.icon className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium text-[#E6C98B]">{item.text}</p>
                  <p className="text-xs">{item.description}</p>
                </div>
              </div>
            ))}
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              const count = stats[section.id] || section.stats.count;
              
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] hover:border-[#6B7F5C]/50 transition-all hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="relative p-6">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-[#E6C98B] mb-1">
                      {section.name}
                    </h3>
                    <p className="text-sm text-[#C9A87C] mb-2">
                      {section.subtitle}
                    </p>
                    <p className="text-xs text-[#676767] mb-4 line-clamp-2">
                      {section.description}
                    </p>

                    {/* Stats */}
                    {count > 0 && (
                      <p className="text-xs text-[#8B9B6E]">
                        <span className="font-bold text-[#A8C97F]">{count.toLocaleString("pt-BR")}</span> {section.stats.label}
                      </p>
                    )}

                    {/* Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#6B7F5C]" />
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
