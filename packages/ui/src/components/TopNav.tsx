"use client";

import Link from "next/link";
import { Heart, Handshake, Plus, ChevronDown, User } from "lucide-react";
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
  const negotiationsHref = "/negociacoes";
  const postHref = "/anunciar";
  const accountHref = "/entrar";

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b-2 border-[#2a2a1a]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* LOGO */}
          <Link href={brandHref} className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0">
            <div className="text-4xl font-bold tracking-tight">
              <span className="text-[#B7791F]">Publi</span>
              <span className="text-[#CD7F32]">Micr</span>
              <span className="relative inline-block">
                <span className="text-[#B87333]">o</span>
                <svg
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] text-[#FF6B35]"
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
          </Link>

          {/* SEARCH BAR */}
          <form action={searchAction} method="get" className="flex-1 max-w-3xl hidden md:flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategories(!showCategories)}
                className="h-11 px-4 bg-[#1a1a1a] border border-[#3a3a2a] rounded-l-lg text-[#D4A574] hover:bg-[#252525] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-sm">{categories.find(c => c.value === selectedCategory)?.label || "Categoria"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showCategories && (
                <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-[#3a3a2a] rounded-lg shadow-xl z-50 min-w-[200px]">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setShowCategories(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#D4A574] hover:bg-[#252525] first:rounded-t-lg last:rounded-b-lg"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <input
                type="search"
                name="q"
                placeholder="O que você procura?"
                className="w-full h-11 pl-4 pr-4 bg-[#1a1a1a] border-t border-b border-[#3a3a2a] text-[#D4A574] placeholder-[#676767] focus:outline-none"
              />
              <input type="hidden" name="category" value={selectedCategory} />
            </div>

            <input
              type="text"
              name="location"
              placeholder="Localização"
              className="w-40 h-11 px-4 bg-[#1a1a1a] border border-[#3a3a2a] text-[#D4A574] placeholder-[#676767] focus:outline-none"
            />

            <button
              type="submit"
              className="h-11 px-6 rounded-r-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] flex items-center justify-center transition-all shadow-lg"
              aria-label="Buscar"
            >
              <svg className="w-5 h-5 text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* ACTIONS */}
          <nav className="flex items-center gap-6">
            <Link href={favHref} className="flex flex-col items-center text-[#f2e6b1] hover:text-[#FF6B35] transition-colors group">
              <Heart className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Favoritos</span>
            </Link>
            
            <Link href={negotiationsHref} className="flex flex-col items-center text-[#f2e6b1] hover:text-[#0D7377] transition-colors group">
              <Handshake className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Negociações</span>
            </Link>
            
            <Link
              href={postHref}
              className="flex flex-col items-center px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] rounded-lg transition-all hover:scale-105 shadow-lg"
            >
              <Plus className="w-6 h-6 mb-1" strokeWidth={3} />
              <span className="text-xs font-bold">Postar</span>
            </Link>
            
            <Link
              href={accountHref}
              className="flex flex-col items-center px-4 py-2 border-2 border-[#B7791F] text-[#B7791F] hover:bg-[#B7791F]/10 rounded-lg transition-all"
            >
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Conta</span>
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