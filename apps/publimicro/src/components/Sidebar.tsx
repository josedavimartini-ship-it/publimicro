"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  MapPin, Clock, Search, Filter, ChevronDown, ChevronUp,
  Building2, Car, Wrench, Ship, Globe, Users, Plane, ShoppingBag,
  TrendingUp, Star, X, Menu
} from "lucide-react";
import BrazilTimeClock from "./BrazilTimeClock";

// Brazilian states for location filtering
const brazilianStates = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

// World timezones for clock display
const timezones = [
  { name: "Brasília", offset: -3, flag: "🇧🇷" },
  { name: "New York", offset: -5, flag: "🇺🇸" },
  { name: "London", offset: 0, flag: "🇬🇧" },
  { name: "Tokyo", offset: 9, flag: "🇯🇵" },
];

// Quick links for sections
const sectionLinks = [
  { id: "proper", name: "Proper", icon: Building2, href: "/imoveis", color: "#6B7F5C" },
  { id: "motors", name: "Motors", icon: Car, href: "/motors", color: "#CD7F32" },
  { id: "machina", name: "Machina", icon: Wrench, href: "/machina", color: "#5A5A5A" },
  { id: "marine", name: "Marine", icon: Ship, href: "/marine", color: "#2C5F6F" },
  { id: "global", name: "Global", icon: Globe, href: "/global", color: "#4A6B8A" },
  { id: "share", name: "Share", icon: Users, href: "/share", color: "#7A5C8B" },
  { id: "journey", name: "Journey", icon: Plane, href: "/journey", color: "#D4AF37" },
  { id: "tudo", name: "Tudo", icon: ShoppingBag, href: "/acheme-coisas", color: "#8B9B6E" },
];

interface SidebarProps {
  side: "left" | "right";
  className?: string;
}

export default function Sidebar({ side, className = "" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showTimezones, setShowTimezones] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Determine current section from pathname
  const currentSection = sectionLinks.find(s => pathname.startsWith(s.href));

  // Handle location filter apply
  const handleLocationFilter = () => {
    if (selectedState) {
      const params = new URLSearchParams();
      params.set("estado", selectedState);
      if (selectedCity) params.set("cidade", selectedCity);
      
      // Navigate to search results with location filter
      if (currentSection) {
        router.push(`${currentSection.href}?${params.toString()}`);
      } else {
        router.push(`/buscar?${params.toString()}`);
      }
    }
    setShowLocationFilter(false);
  };

  // Left sidebar content (navigation & search)
  if (side === "left") {
    return (
      <>
        {/* Mobile toggle button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden fixed left-4 top-20 z-40 p-2 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? <X className="w-5 h-5 text-[#E6C98B]" /> : <Menu className="w-5 h-5 text-[#E6C98B]" />}
        </button>

        <aside
          className={`
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64
            bg-gradient-to-b from-[#121212] to-[#0a0a0a]
            border-r border-[#2a2a2a] overflow-y-auto
            transform transition-transform duration-300 z-30
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${className}
          `}
        >
          <div className="p-4 space-y-6">
            {/* Clock Section */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
              <button
                onClick={() => setShowTimezones(!showTimezones)}
                className="flex items-center justify-between w-full text-[#E6C98B] mb-3"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-sm">Hora Local</span>
                </div>
                {showTimezones ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <div className="text-center">
                <BrazilTimeClock 
                  offsetHours={-3}
                  className="text-3xl font-bold text-[#D4AF37] font-mono"
                />
                <p className="text-xs text-[#8B9B6E] mt-1">🇧🇷 Brasília</p>
              </div>

              {showTimezones && (
                <div className="mt-4 pt-4 border-t border-[#2a2a2a] space-y-2">
                  {timezones.slice(1).map((tz) => (
                    <div key={tz.name} className="flex justify-between items-center text-sm">
                      <span className="text-[#9ca3af]">{tz.flag} {tz.name}</span>
                      <BrazilTimeClock 
                        offsetHours={tz.offset}
                        className="text-[#E6C98B] font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Search */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
              <button
                onClick={() => setShowLocationFilter(!showLocationFilter)}
                className="flex items-center justify-between w-full text-[#E6C98B] mb-3"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium text-sm">Buscar por Local</span>
                </div>
                {showLocationFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showLocationFilter && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#9ca3af] mb-1 block">Estado</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full bg-[#252525] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E6C98B] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    >
                      <option value="">Todos os estados</option>
                      {brazilianStates.map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.name} ({state.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-[#9ca3af] mb-1 block">Cidade</label>
                    <input
                      type="text"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      placeholder="Digite a cidade..."
                      className="w-full bg-[#252525] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#E6C98B] placeholder-[#666] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleLocationFilter}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6B7F5C] to-[#8B9B6E] text-warm py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Search className="w-4 h-4" />
                    Filtrar
                  </button>
                </div>
              )}

              {!showLocationFilter && selectedState && (
                <p className="text-xs text-[#8B9B6E]">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {brazilianStates.find(s => s.code === selectedState)?.name}
                  {selectedCity && ` - ${selectedCity}`}
                </p>
              )}
            </div>

            {/* Quick Navigation */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
              <h3 className="text-[#E6C98B] font-medium text-sm mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Seções
              </h3>
              <nav className="space-y-1">
                {sectionLinks.map((section) => {
                  const isActive = pathname.startsWith(section.href);
                  return (
                    <Link
                      key={section.id}
                      href={section.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm
                        ${isActive 
                          ? "bg-[#252525] text-[#E6C98B] border-l-2" 
                          : "text-[#9ca3af] hover:bg-[#1f1f1f] hover:text-[#E6C98B]"
                        }
                      `}
                      style={{ borderColor: isActive ? section.color : "transparent" }}
                    >
                      <section.icon className="w-4 h-4" style={{ color: section.color }} />
                      <span>{section.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Trending / Hot Items */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
              <h3 className="text-[#E6C98B] font-medium text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#CD7F32]" />
                Em Alta
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                  <Star className="w-3 h-3 text-[#D4AF37]" />
                  <span>Sítios em MG</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                  <Star className="w-3 h-3 text-[#D4AF37]" />
                  <span>iPhone 15 Pro</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                  <Star className="w-3 h-3 text-[#D4AF37]" />
                  <span>Trator John Deere</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Right sidebar content (advertising space)
  return (
    <aside
      className={`
        hidden xl:block sticky top-16 h-[calc(100vh-4rem)] w-72
        bg-gradient-to-b from-[#121212] to-[#0a0a0a]
        border-l border-[#2a2a2a] overflow-y-auto
        ${className}
      `}
    >
      <div className="p-4 space-y-4">
        {/* Ad Space 1 - Premium */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="p-4">
            <span className="text-[10px] uppercase tracking-wider text-[#666] bg-[#252525] px-2 py-0.5 rounded">
              Publicidade
            </span>
          </div>
          <div className="h-64 flex items-center justify-center bg-[#151515] mx-4 mb-4 rounded-lg border border-dashed border-[#333]">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#CD7F32]/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <p className="text-sm text-[#666]">Espaço para anúncio</p>
              <p className="text-xs text-[#444] mt-1">300x250</p>
              <Link 
                href="/anunciar-aqui"
                className="inline-block mt-3 text-xs text-[#8B9B6E] hover:text-[#A8C97F] underline"
              >
                Anuncie aqui
              </Link>
            </div>
          </div>
        </div>

        {/* Ad Space 2 - Sidebar Banner */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="p-4">
            <span className="text-[10px] uppercase tracking-wider text-[#666] bg-[#252525] px-2 py-0.5 rounded">
              Parceiros
            </span>
          </div>
          <div className="h-80 flex items-center justify-center bg-[#151515] mx-4 mb-4 rounded-lg border border-dashed border-[#333]">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#6B7F5C]/20 to-[#8B9B6E]/20 flex items-center justify-center">
                <Globe className="w-8 h-8 text-[#8B9B6E]" />
              </div>
              <p className="text-sm text-[#666]">Espaço para anúncio</p>
              <p className="text-xs text-[#444] mt-1">300x600</p>
              <Link 
                href="/anunciar-aqui"
                className="inline-block mt-3 text-xs text-[#8B9B6E] hover:text-[#A8C97F] underline"
              >
                Anuncie aqui
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <h3 className="text-[#E6C98B] font-medium text-sm mb-3">📊 Estatísticas</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#9ca3af]">Anúncios ativos</span>
              <span className="text-[#8B9B6E] font-medium">12.847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9ca3af]">Usuários online</span>
              <span className="text-[#D4AF37] font-medium">1.234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9ca3af]">Negócios hoje</span>
              <span className="text-[#CD7F32] font-medium">89</span>
            </div>
          </div>
        </div>

        {/* Download App CTA */}
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl p-4 border border-[#333]">
          <h3 className="text-[#E6C98B] font-medium text-sm mb-2">📱 Baixe o App</h3>
          <p className="text-xs text-[#9ca3af] mb-3">
            Receba notificações de novos anúncios e negocie em tempo real.
          </p>
          <div className="flex gap-2">
            <button className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg py-2 px-3 text-xs text-[#E6C98B] hover:border-[#D4AF37] transition-colors">
              iOS
            </button>
            <button className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg py-2 px-3 text-xs text-[#E6C98B] hover:border-[#8B9B6E] transition-colors">
              Android
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Wrapper component that includes both sidebars
export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar side="left" />
      <main className="flex-1 min-w-0">
        {children}
      </main>
      <Sidebar side="right" />
    </div>
  );
}
