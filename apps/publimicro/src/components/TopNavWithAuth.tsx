"use client";

import Link from "next/link";
import {
  Home, Search, MessageCircle, Heart, User, Menu, X,
  TrendingUp, Award, Shield, Bell, LogOut, LayoutDashboard, FileText, Gavel, Handshake, ChevronDown,
  ThumbsUp, Megaphone, PlusCircle
} from 'lucide-react';
import { useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AccountModal from "./AccountModal";
import AchemeLogo from "./AchemeLogo";

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

export function TopNavWithAuth({
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
  const [showAccountModal, setShowAccountModal] = useState(false);

  const { user, profile, loading } = useAuth();
  const supabase = createClientComponentClient();

  const searchAction = useMemo(
    () => (searchTarget === "main" ? "https://www.publimicro.com.br/search" : "/search"),
    [searchTarget]
  );

  const favHref = "/favoritos";
  const chatHref = "/chat";

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#4A4E4D]/95 backdrop-blur-sm border-b-2 border-[#2a2a1a]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 gap-6">
            {/* LOGO - Left Corner - Enhanced Professional Brand */}
            <Link href={brandHref} className="flex flex-col items-start hover:opacity-90 transition-all flex-shrink-0 group relative">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#B87333]/20 to-[#FFD700]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              
              <div className="flex items-center gap-3 mb-1 relative z-10">
                {/* ACHEME Logo with Search + Emu */}
                <AchemeLogo className="w-10 h-10 drop-shadow-lg" />
                
                {/* Enhanced Typography - ACHEME */}
                <div className="text-5xl font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-[#B87333] via-[#DAA520] to-[#FFD700] bg-clip-text text-transparent drop-shadow-lg">
                    ACHEME
                  </span>
                </div>
              </div>
              
              {/* Premium subtitle - Find For Me */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                <div className="w-1 h-1 bg-[#DAA520] rounded-full animate-pulse"></div>
                <span className="text-xs bg-gradient-to-r from-[#B87333] to-[#DAA520] bg-clip-text text-transparent font-bold tracking-wider uppercase">
                  Find For Me
                </span>
                <div className="w-1 h-1 bg-[#B87333] rounded-full animate-pulse"></div>
              </div>
            </Link>

            {/* SEARCH BAR - EXTRA VERTICAL (Very Tall, Very Narrow) with Nature Theme */}
            <form action={searchAction} method="get" className="flex-shrink-0 hidden md:flex flex-col gap-3 bg-gradient-to-b from-[#5A5E5D] to-[#3A3E3D] p-4 rounded-2xl shadow-2xl max-w-[280px] border-2 border-[#2a2a1a]">
              <div className="flex flex-col gap-2">
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setShowCategories(!showCategories)}
                    className="w-full h-12 px-4 bg-[#5A5E5D] border-2 border-[#2a2a1a] rounded-lg text-[#E6C98B] hover:bg-[#2a2a1a] hover:border-[#A8C97F] transition-colors flex items-center justify-between gap-2 text-sm font-medium"
                  >
                    <span className="truncate">{categories.find(c => c.value === selectedCategory)?.label || "Categoria"}</span>
                    <ChevronDown className="w-5 h-5 flex-shrink-0" />
                  </button>
                  {showCategories && (
                    <div className="absolute top-full left-0 mt-1 bg-[#5A5E5D] border-2 border-[#2a2a1a] rounded-xl shadow-2xl z-50 w-full max-h-[400px] overflow-y-auto">
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
                  className="w-full h-12 px-4 bg-[#5A5E5D] border-2 border-[#2a2a1a] text-[#E6C98B] placeholder-[#8B9B6E] focus:outline-none focus:ring-2 focus:ring-[#A8C97F] focus:border-[#A8C97F] rounded-lg text-sm font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="search"
                  name="q"
                  placeholder="O que você procura?"
                  className="w-full h-12 px-4 bg-[#5A5E5D] border-2 border-[#2a2a1a] text-[#E6C98B] placeholder-[#8B9B6E] focus:outline-none focus:ring-2 focus:ring-[#A8C97F] focus:border-[#A8C97F] rounded-lg text-sm font-medium"
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
              {/* Handshake - At the top */}
              <Link href="/propostas" className="flex flex-col items-center text-[#FFD700] hover:text-[#B87333] transition-all group transform hover:scale-110">
                <Handshake className="w-7 h-7 mb-1 drop-shadow-lg" strokeWidth={2.5} />
                <span className="text-xs font-bold">Propostas</span>
              </Link>
              
              <Link href={chatHref} className="flex flex-col items-center text-[#A8C97F] hover:text-[#0D7377] transition-all group transform hover:scale-110">
                <MessageCircle className="w-7 h-7 mb-1 drop-shadow-lg" strokeWidth={2.5} />
                <span className="text-xs font-bold">Chat</span>
              </Link>
              
              <Link href={favHref} className="flex flex-col items-center text-[#E6C98B] hover:text-[#B7791F] transition-all group transform hover:scale-110">
                <Heart className="w-7 h-7 mb-1 drop-shadow-lg fill-[#E6C98B]" strokeWidth={2.5} />
                <span className="text-xs font-bold">Gostei</span>
              </Link>
              
              {/* Prominent Post Ad Button - Enhanced for Mobile Visibility */}
              <Link
                href="/postar"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A8C97F] via-[#50C878] to-[#0D7377] hover:from-[#0D7377] hover:via-[#50C878] hover:to-[#A8C97F] text-[#1a1a1a] rounded-xl transition-all hover:scale-110 shadow-[0_0_20px_rgba(168,201,127,0.6)] hover:shadow-[0_0_30px_rgba(80,200,120,0.8)] font-black animate-pulse hover:animate-none border-3 border-[#E6C98B] drop-shadow-2xl"
              >
                <PlusCircle className="w-6 h-6" strokeWidth={3.5} />
                <span className="text-base">Postar</span>
              </Link>
              
              {/* User Account/Profile */}
              {!loading && (
                user && profile ? (
                  <Link
                    href="/conta"
                    className="flex flex-col items-center px-4 py-2 border-2 border-[#A8C97F] text-[#A8C97F] hover:bg-[#A8C97F]/20 rounded-xl transition-all transform hover:scale-110 shadow-lg"
                  >
                    <User className="w-7 h-7 mb-1" strokeWidth={2.5} />
                    <span className="text-xs font-bold truncate max-w-[80px]">
                      {profile.full_name?.split(' ')[0] || 'Conta'}
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="flex flex-col items-center px-4 py-2 border-2 border-[#E6C98B] text-[#E6C98B] hover:bg-[#E6C98B]/20 hover:border-[#A8C97F] hover:text-[#A8C97F] rounded-xl transition-all transform hover:scale-110 shadow-lg"
                  >
                    <User className="w-7 h-7 mb-1" strokeWidth={2.5} />
                    <span className="text-xs font-bold">Conta</span>
                  </button>
                )
              )}
            </nav>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <form action={searchAction} method="get" className="flex flex-col gap-2">
              <input
                type="search"
                name="q"
                placeholder="Buscar..."
                className="w-full h-11 px-4 bg-[#5A5E5D] border border-[#3a3a2a] rounded-lg text-[#D4A574] placeholder-[#676767] focus:outline-none"
              />
            </form>
          </div>
        </div>
      </header>

      {/* Account Modal */}
      <AccountModal open={showAccountModal} onClose={() => setShowAccountModal(false)} />
    </>
  );
}
