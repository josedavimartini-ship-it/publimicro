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
          {/* LOGO - Left Corner - BIGGER with Home Link */}
          <Link href={brandHref} className="flex flex-col items-start hover:opacity-90 transition-opacity flex-shrink-0 group">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-8 h-8 text-[#A8C97F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div className="text-5xl font-bold tracking-tight leading-none">
                <span className="text-[#B7791F]">Publi</span>
                <span className="text-[#CD7F32]">Micr</span>
                <span className="relative inline-block">
                  <span className="text-[#B87333]">o</span>
                  <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] text-[#A8C97F]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <line x1="12" y1="2" x2="12" y2="7" />
                    <line x1="12" y1="17" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="7" y2="12" />
                    <line x1="17" y1="12" x2="22" y2="12" />
                  </svg>
                </span>
              </div>
            </div>
            <span className="text-xs text-[#8B9B6E] font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
              ← Voltar ao Início
            </span>
          </Link>

          {/* SEARCH BAR - EXTRA VERTICAL (Very Tall, Very Narrow) with Nature Theme */}
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
                className="w-full h-12 px-6 rounded-lg bg-gradient-to-r from-[#A8C97F] to-[#0D7377] hover:from-[#0D7377] hover:to-[#A8C97F] flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl font-bold text-white"
                aria-label="Buscar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Buscar</span>
              </button>
            </div>
          </form>

          {/* ACTIONS */}
          <nav className="flex items-center gap-4">
            <Link href={favHref} className="flex flex-col items-center text-[#E6C98B] hover:text-[#B7791F] transition-all group transform hover:scale-110">
              <Heart className="w-7 h-7 mb-1 drop-shadow-lg" strokeWidth={2.5} />
              <span className="text-xs font-bold">Favoritos</span>
            </Link>
            
            <Link href={chatHref} className="flex flex-col items-center text-[#A8C97F] hover:text-[#0D7377] transition-all group transform hover:scale-110">
              <MessageCircle className="w-7 h-7 mb-1 drop-shadow-lg" strokeWidth={2.5} />
              <span className="text-xs font-bold">Chat</span>
            </Link>
            
            {/* Prominent Free Ad Button */}
            <Link
              href={postHref}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A8C97F] via-[#8B9B6E] to-[#0D7377] hover:from-[#0D7377] hover:via-[#8B9B6E] hover:to-[#A8C97F] text-white rounded-xl transition-all hover:scale-110 shadow-2xl font-bold animate-pulse hover:animate-none border-2 border-[#A8C97F]/30"
            >
              <Plus className="w-6 h-6" strokeWidth={3} />
              <span className="hidden lg:inline text-base">Publique Grátis</span>
              <span className="lg:hidden text-base">Anunciar</span>
            </Link>
            
            <Link
              href={accountHref}
              className="flex flex-col items-center px-4 py-2 border-2 border-[#E6C98B] text-[#E6C98B] hover:bg-[#E6C98B]/20 hover:border-[#A8C97F] hover:text-[#A8C97F] rounded-xl transition-all transform hover:scale-110 shadow-lg"
            >
              <User className="w-7 h-7 mb-1" strokeWidth={2.5} />
              <span className="text-xs font-bold">Conta</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form action={searchAction} method="get" className="flex flex-col gap-2">
            <input
              type="search"
              name="q"
              placeholder="Buscar..."
              className="w-full h-11 px-4 bg-[#1a1a1a] border border-[#3a3a2a] rounded-lg text-[#D4A574] placeholder-[#676767] focus:outline-none"
            />
          </form>
        </div>
      </div>
    </header>
  );
}