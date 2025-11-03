"use client";

import Link from "next/link";
import { Heart, MessageCircle, Plus, ChevronDown, User, LogOut, FileText, Calendar, Gavel } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AccountModal from "./AccountModal";

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const { user, profile, loading } = useAuth();
  const supabase = createClientComponentClient();

  const searchAction = useMemo(
    () => (searchTarget === "main" ? "https://www.publimicro.com.br/search" : "/search"),
    [searchTarget]
  );

  const favHref = "/favoritos";
  const chatHref = "/chat";

  const handlePostAd = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setShowAccountModal(true);
    }
    // If user exists, let the link work normally
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#4A4E4D]/95 backdrop-blur-sm border-b-2 border-[#2a2a1a]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 gap-6">
            {/* LOGO - Left Corner - Enhanced Professional Brand */}
            <Link href={brandHref} className="flex flex-col items-start hover:opacity-90 transition-all flex-shrink-0 group relative">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A8C97F]/20 to-[#50C878]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              
              <div className="flex items-center gap-3 mb-1 relative z-10">
                {/* Premium Home Icon with emerald accent */}
                <div className="relative">
                  <svg className="w-10 h-10 text-[#50C878] drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {/* Emerald shine */}
                  <div className="absolute top-0 right-0 w-2 h-2 bg-[#50C878] rounded-full animate-pulse"></div>
                </div>
                
                {/* Enhanced Typography */}
                <div className="text-5xl font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-[#B7791F] via-[#CD7F32] to-[#DAA520] bg-clip-text text-transparent drop-shadow-lg">
                    Publi
                  </span>
                  <span className="bg-gradient-to-r from-[#6B8E23] via-[#50C878] to-[#A8C97F] bg-clip-text text-transparent drop-shadow-lg">
                    Micr
                  </span>
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#B87333] to-[#CD7F32] bg-clip-text text-transparent">o</span>
                    {/* Enhanced Sniper Target Icon with emerald glow */}
                    <svg
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32px] h-[32px] text-[#50C878] drop-shadow-[0_0_8px_rgba(80,200,120,0.6)]"
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
              </div>
              
              {/* Premium subtitle with moss green and emerald */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                <div className="w-1 h-1 bg-[#50C878] rounded-full animate-pulse"></div>
                <span className="text-xs bg-gradient-to-r from-[#6B8E23] to-[#50C878] bg-clip-text text-transparent font-bold tracking-wider uppercase">
                  Ecossistema de Negócios
                </span>
                <div className="w-1 h-1 bg-[#6B8E23] rounded-full animate-pulse"></div>
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
              <Link href={favHref} className="flex flex-col items-center text-[#E6C98B] hover:text-[#B7791F] transition-all group transform hover:scale-110">
                <Heart className="w-7 h-7 mb-1 drop-shadow-lg" strokeWidth={2.5} />
                <span className="text-xs font-bold">Favoritos</span>
              </Link>
              
              <Link href={chatHref} className="flex flex-col items-center text-[#A8C97F] hover:text-[#0D7377] transition-all group transform hover:scale-110">
                <MessageCircle className="w-7 h-7 mb-1 drop-shadow-lg" strokeWidth={2.5} />
                <span className="text-xs font-bold">Chat</span>
              </Link>
              
              {/* Prominent Free Ad Button - Enhanced for Mobile Visibility */}
              <Link
                href="/anunciar"
                onClick={handlePostAd}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A8C97F] via-[#50C878] to-[#0D7377] hover:from-[#0D7377] hover:via-[#50C878] hover:to-[#A8C97F] text-[#1a1a1a] rounded-xl transition-all hover:scale-110 shadow-[0_0_20px_rgba(168,201,127,0.6)] hover:shadow-[0_0_30px_rgba(80,200,120,0.8)] font-black animate-pulse hover:animate-none border-3 border-[#E6C98B] drop-shadow-2xl"
              >
                <Plus className="w-6 h-6" strokeWidth={3.5} />
                <span className="hidden lg:inline text-base">Publique Grátis</span>
                <span className="lg:hidden text-base">Anunciar</span>
              </Link>
              
              {/* User Account/Profile */}
              {!loading && (
                user && profile ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex flex-col items-center px-4 py-2 border-2 border-[#A8C97F] text-[#A8C97F] hover:bg-[#A8C97F]/20 rounded-xl transition-all transform hover:scale-110 shadow-lg"
                    >
                      <User className="w-7 h-7 mb-1" strokeWidth={2.5} />
                      <span className="text-xs font-bold truncate max-w-[80px]">
                        {profile.full_name?.split(' ')[0] || 'Perfil'}
                      </span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-[#5A5E5D] border-2 border-[#2a2a1a] rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-[#2a2a1a] bg-gradient-to-br from-[#2a2a1a] to-[#5A5E5D]">
                          <p className="text-sm font-bold text-[#E6C98B] truncate">{profile.full_name || 'Usuário'}</p>
                          <p className="text-xs text-[#676767] truncate">{user.email}</p>
                          {profile.verified && (
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#A8C97F]/20 rounded-full">
                              <div className="w-2 h-2 bg-[#A8C97F] rounded-full"></div>
                              <span className="text-xs text-[#A8C97F] font-medium">Verificado</span>
                            </div>
                          )}
                        </div>

                        <div className="py-2">
                          <Link
                            href="/meu-perfil"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#A8C97F] transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Meu Perfil</span>
                          </Link>

                          <Link
                            href="/meus-anuncios"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#A8C97F] transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Meus Anúncios</span>
                          </Link>

                          {profile.can_schedule_visits && (
                            <Link
                              href="/minhas-visitas"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#A8C97F] transition-colors"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>Minhas Visitas</span>
                            </Link>
                          )}

                          {profile.can_place_bids && (
                            <Link
                              href="/meus-lances"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#A8C97F] transition-colors"
                            >
                              <Gavel className="w-4 h-4" />
                              <span>Meus Lances</span>
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-[#2a2a1a] py-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a1a] transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
