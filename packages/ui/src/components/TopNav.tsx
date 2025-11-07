"use client";

import Link from "next/link";
import { Heart, MessageCircle, Plus, ChevronDown, User } from "lucide-react";
import { useMemo, useState } from "react";

type SearchTarget = "local" | "main";

const categories = [
  { value: "all", label: "Todas Categorias" },
  { value: "proper", label: "🏘️ Imóveis" },
  { value: "motors", label: "🚗 Veículos" },
  { value: "machina", label: "⚙️ Máquinas" },
  { value: "outdoor", label: "⛵ Náutica" },
  { value: "global", label: "🌍 Global" },
  { value: "share", label: "🤝 Compartilhar" },
  { value: "journey", label: "✈️ Viagens" },
  { value: "tudo", label: "🛍️ Tudo" },
];

// AcheMe Logo Component Inline (avoid circular dependency)
function AcheMeLogoCompact() {
  return (
    <svg width="44" height="44" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="38" fill="url(#lensGrad)" stroke="url(#frameGrad)" strokeWidth="4" />
      <ellipse cx="38" cy="38" rx="14" ry="10" fill="rgba(255,255,255,0.25)" transform="rotate(-35 38 38)" />
      <g transform="translate(28, 24)">
        <path d="M 24 48 Q 19 38, 17 28 Q 16 18, 19 10" stroke="#8B7355" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="20" cy="10" rx="11" ry="9" fill="url(#emuGrad)" stroke="#6B5A45" strokeWidth="1.5" />
        <path d="M 27 10 L 36 9 L 36 11 L 27 11 Z" fill="url(#beakGrad)" stroke="#6B5A45" strokeWidth="1" />
        <circle cx="24" cy="9" r="2.2" fill="#1a1a1a" />
        <circle cx="24.8" cy="8.3" r="0.8" fill="#D4AF37" />
        <path d="M 15 7 Q 12 4, 10 1" stroke="#A8896B" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 18 6 Q 16 3, 15 0" stroke="#A8896B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
      <path d="M 74 74 L 104 104" stroke="url(#handleGrad)" strokeWidth="7" strokeLinecap="round" />
      <circle cx="106" cy="106" r="5" fill="url(#capGrad)" stroke="#8B7355" strokeWidth="1.5" />
      <defs>
        <radialGradient id="lensGrad" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="rgba(230,201,139,0.12)" />
          <stop offset="100%" stopColor="rgba(205,127,50,0.05)" />
        </radialGradient>
        <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#CD7F32" />
          <stop offset="100%" stopColor="#B87333" />
        </linearGradient>
        <linearGradient id="emuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8896B" />
          <stop offset="100%" stopColor="#6B5A45" />
        </linearGradient>
        <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B5A45" />
          <stop offset="100%" stopColor="#8B7355" />
        </linearGradient>
        <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CD7F32" />
          <stop offset="100%" stopColor="#A8896B" />
        </linearGradient>
        <radialGradient id="capGrad">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B87333" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function TopNav({
  brand = "PubliMicro",
  brandHref = "/",
  searchTarget = "local",
}: {
  brand?: string;
  brandHref?: string;
  searchTarget?: SearchTarget;
}) {
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const searchAction = useMemo(
    () => (searchTarget === "main" ? "https://www.publimicro.com.br/search" : "/search"),
    [searchTarget]
  );

  const favHref = "/favoritos";
  const chatHref = "/chat";
  const postHref = "/anunciar";
  const accountHref = "/entrar";

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b-2 border-[#2a2a1a]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* LOGO - Left Corner - ENHANCED with AcheMe Logo */}
          <Link href={brandHref} className="flex items-center gap-4 hover:opacity-90 transition-all flex-shrink-0 group relative">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-[#CD7F32]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            
            {/* AcheMe Logo */}
            <div className="relative z-10 transform group-hover:scale-110 transition-transform">
              <AcheMeLogoCompact />
            </div>
            
            <div className="flex flex-col relative z-10">
              {/* Enhanced Typography */}
              <div className="text-4xl font-black tracking-tight leading-none mb-1">
                <span className="bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent drop-shadow-lg">
                  Publi
                </span>
                <span className="bg-gradient-to-r from-[#8B9B6E] via-[#A8C97F] to-[#6B8E23] bg-clip-text text-transparent drop-shadow-lg">
                  Micr
                </span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#CD7F32] to-[#D4AF37] bg-clip-text text-transparent">o</span>
                  {/* Sniper Target Icon */}
                  <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28px] h-[28px] text-[#A8C97F] drop-shadow-[0_0_8px_rgba(168,201,127,0.6)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <circle cx="12" cy="12" r="3" className="animate-pulse" />
                    <line x1="12" y1="2" x2="12" y2="7" />
                    <line x1="12" y1="17" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="7" y2="12" />
                    <line x1="17" y1="12" x2="22" y2="12" />
                  </svg>
                </span>
              </div>
              
              {/* Premium subtitle - ALWAYS VISIBLE */}
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
                <span className="text-xs bg-gradient-to-r from-[#B87333] to-[#D4AF37] bg-clip-text text-transparent font-bold tracking-wider uppercase">
                  Ecossistema de Negócios
                </span>
                <div className="w-1 h-1 bg-[#CD7F32] rounded-full"></div>
              </div>
            </div>
          </Link>

          {/* SEARCH BAR - EXTRA VERTICAL with Bronze/Copper Theme */}
          <form action={searchAction} method="get" className="flex-shrink-0 hidden md:flex flex-col gap-3 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-4 rounded-2xl shadow-2xl max-w-[280px] border-2 border-[#2a2a1a]">
            <div className="flex flex-col gap-2">
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setShowCategories(!showCategories)}
                  className="w-full h-12 px-4 bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-lg text-[#E6C98B] hover:bg-[#2a2a1a] hover:border-[#A8C97F] transition-colors flex items-center justify-between gap-2 text-sm font-medium"
                >
                  <span className="truncate">{categories.find(c => c.value === selectedCategory)?.label || "Categoria"}</span>
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                </button>
                {showCategories && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-xl shadow-2xl z-50 w-full max-h-[400px] overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.value);
                          setShowCategories(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#A8C97F] first:rounded-t-xl last:rounded-b-xl transition-colors"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                name="location"
                placeholder="Localização"
                className="w-full h-12 px-4 bg-[#1a1a1a] border-2 border-[#2a2a1a] text-[#E6C98B] placeholder-[#8B9B6E] focus:outline-none focus:ring-2 focus:ring-[#A8C97F] focus:border-[#A8C97F] rounded-lg text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="search"
                name="q"
                placeholder="O que você procura?"
                className="w-full h-12 px-4 bg-[#1a1a1a] border-2 border-[#2a2a1a] text-[#E6C98B] placeholder-[#8B9B6E] focus:outline-none focus:ring-2 focus:ring-[#A8C97F] focus:border-[#A8C97F] rounded-lg text-sm font-medium"
              />
              <input type="hidden" name="category" value={selectedCategory} />

              <button
                type="submit"
                className="w-full h-12 px-6 rounded-lg bg-gradient-to-r from-[#CD7F32] to-[#B87333] hover:from-[#D4AF37] hover:to-[#CD7F32] flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl font-bold text-[#0a0a0a]"
                aria-label="Buscar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Buscar</span>
              </button>
            </div>
          </form>

          {/* ACTIONS - Bronze/Copper Theme */}
          <nav className="flex items-center gap-4">
            <Link href={favHref} className="flex flex-col items-center text-[#E6C98B] hover:text-[#D4AF37] transition-all group transform hover:scale-110">
              <Heart className="w-7 h-7 mb-1 drop-shadow-lg" strokeWidth={2.5} />
              <span className="text-xs font-bold">Favoritos</span>
            </Link>
            
            <Link href={chatHref} className="flex flex-col items-center text-[#A8C97F] hover:text-[#8B9B6E] transition-all group transform hover:scale-110">
              <MessageCircle className="w-7 h-7 mb-1 drop-shadow-lg" strokeWidth={2.5} />
              <span className="text-xs font-bold">Chat</span>
            </Link>
            
            {/* Prominent Free Ad Button - Bronze/Gold Gradient */}
            <Link
              href={postHref}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#CD7F32] to-[#B87333] hover:from-[#B87333] hover:via-[#CD7F32] hover:to-[#D4AF37] text-[#0a0a0a] rounded-xl transition-all hover:scale-110 shadow-2xl font-bold border-2 border-[#D4AF37]/30"
            >
              <Plus className="w-6 h-6" strokeWidth={3} />
              <span className="hidden lg:inline text-base">Publique Grátis</span>
              <span className="lg:hidden text-base">Anunciar</span>
            </Link>
            
            <Link
              href={accountHref}
              className="flex flex-col items-center px-4 py-2 border-2 border-[#CD7F32] text-[#E6C98B] hover:bg-[#CD7F32]/20 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-xl transition-all transform hover:scale-110 shadow-lg"
            >
              <User className="w-7 h-7 mb-1" strokeWidth={2.5} />
              <span className="text-xs font-bold">Conta</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Search - Bronze Theme */}
        <div className="md:hidden pb-3">
          <form action={searchAction} method="get" className="flex flex-col gap-2">
            <input
              type="search"
              name="q"
              placeholder="Buscar..."
              className="w-full h-11 px-4 bg-[#1a1a1a] border-2 border-[#2a2a1a] rounded-lg text-[#E6C98B] placeholder-[#8B9B6E] focus:outline-none focus:ring-2 focus:ring-[#CD7F32] focus:border-[#CD7F32]"
            />
          </form>
        </div>
      </div>
    </header>
  );
}