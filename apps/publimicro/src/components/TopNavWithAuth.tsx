"use client";

import Link from "next/link";
import {
  Home, Search, Heart, User, Menu, X,
  TrendingUp, Award, Shield, Bell, LogOut, LayoutDashboard, FileText, Gavel, ChevronDown,
  ThumbsUp, Megaphone, PlusCircle, Settings, Package
} from 'lucide-react';
import { AnimatedHandshake } from "./AnimatedHandshake";
import { useMemo, useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import AccountModal from "./AccountModal";
import AccountDashboard from "./AccountDashboard";
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
  brand = "AcheMe",
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
  const [showAccountDashboard, setShowAccountDashboard] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, profile, loading } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const searchAction = useMemo(
    () => (searchTarget === "main" ? "https://www.publimicro.com.br/search" : "/search"),
    [searchTarget]
  );

  const favHref = "/favoritos";
  const chatHref = "/chat";

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    router.push("/");
  };

  // Get user's first name
  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Conta';

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b-2 border-[#2a2a1a]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 gap-6">
            {/* LOGO - Enhanced with AcheMe Logo */}
            <Link href={brandHref} className="flex items-center gap-4 hover:opacity-90 transition-all flex-shrink-0 group relative">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-[#CD7F32]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              
              {/* AcheMe Logo */}
              <div className="relative z-10 transform group-hover:scale-110 transition-transform">
                <AchemeLogo className="w-11 h-11" />
              </div>
              
              <div className="flex flex-col relative z-10">
                {/* Enhanced Typography - AcheMe Brand */}
                <div className="text-4xl font-black tracking-tight leading-none mb-1">
                  <span className="bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent drop-shadow-lg">
                    Ache
                  </span>
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#8B9B6E] via-[#A8C97F] to-[#6B8E23] bg-clip-text text-transparent drop-shadow-lg">Me</span>
                    {/* Sniper Target Icon - now on 'e' */}
                    <svg
                      className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[28px] h-[28px] text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,116,0.6)]"
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
                    Encontre Tudo que Procura
                  </span>
                  <div className="w-1 h-1 bg-[#CD7F32] rounded-full"></div>
                </div>
              </div>
            </Link>

            {/* SEARCH BAR - Bronze Theme */}
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
              {/* Heart icon with 'gostei' */}
              <Link href={favHref} className="flex flex-col items-center text-[#E6C98B] hover:text-[#D4AF37] transition-all group transform hover:scale-110">
                <Heart className="w-7 h-7 mb-1 drop-shadow-lg" strokeWidth={2.5} />
                <span className="text-xs font-bold">gostei</span>
              </Link>

              {/* Animated Handshake for Chat - renamed from 'Negociar' */}
              <Link href={chatHref} className="flex flex-col items-center text-[#A8C97F] hover:text-[#8B9B6E] transition-all group transform hover:scale-110">
                <AnimatedHandshake size={28} className="mb-1 drop-shadow-lg" />
                <span className="text-xs font-bold">Chat</span>
              </Link>

              {/* Prominent Postar Button - Bronze/Gold Gradient */}
              <Link
                href="/postar"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#CD7F32] to-[#B87333] hover:from-[#B87333] hover:via-[#CD7F32] hover:to-[#D4AF37] text-[#0a0a0a] rounded-xl transition-all hover:scale-110 shadow-2xl font-bold border-2 border-[#D4AF37]/30"
              >
                <PlusCircle className="w-6 h-6" strokeWidth={3} />
                <span className="hidden lg:inline text-base">Postar</span>
                <span className="lg:hidden text-base">Postar</span>
              </Link>
              
              {/* User Account/Profile - CONDITIONAL RENDERING */}
              {!loading && (
                user && profile ? (
                  // LOGGED IN - Show user menu dropdown
                  <>
                  <button
                    onClick={() => setShowAccountDashboard(true)}
                    className="flex flex-col items-center px-3 py-1 text-[#E6C98B] hover:text-[#D4AF37] transition-all group"
                    aria-label="Conta"
                  >
                    <User className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Conta</span>
                  </button>
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[#CD7F32] text-[#E6C98B] hover:bg-[#CD7F32]/20 hover:border-[#D4AF37] rounded-xl transition-all transform hover:scale-105 shadow-lg"
                    >
                      {/* User Avatar or Icon */}
                      {profile.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={firstName}
                          className="w-8 h-8 rounded-full border-2 border-[#D4AF37]"
                        />
                      ) : (
                        <User className="w-7 h-7" strokeWidth={2.5} />
                      )}
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-xs font-bold">{firstName}</span>
                        {profile.verified && (
                          <span className="text-[10px] text-[#A8C97F]">✓ Verificado</span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-xl shadow-2xl overflow-hidden z-50">
                        {/* User Info Header */}
                        <div className="p-4 border-b border-[#2a2a1a]">
                          <p className="font-bold text-[#E6C98B]">{profile.full_name || 'Usuário'}</p>
                          <p className="text-xs text-[#8B9B6E]">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/conta"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#D4AF37] transition-colors"
                          >
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Minha Conta</span>
                          </Link>

                          <Link
                            href="/conta?tab=anuncios"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#D4AF37] transition-colors"
                          >
                            <Package className="w-5 h-5" />
                            <span>Meus Anúncios</span>
                          </Link>

                          <Link
                            href="/lances"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#D4AF37] transition-colors"
                          >
                            <Gavel className="w-5 h-5" />
                            <span>Meus Lances</span>
                          </Link>

                          <Link
                            href="/favoritos"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#D4AF37] transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                            <span>Favoritos</span>
                          </Link>

                          <Link
                            href="/conta?tab=configuracoes"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[#E6C98B] hover:bg-[#2a2a1a] hover:text-[#D4AF37] transition-colors"
                          >
                            <Settings className="w-5 h-5" />
                            <span>Configurações</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-[#2a2a1a]">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-[#CD7F32] hover:bg-[#2a2a1a] hover:text-[#D4AF37] transition-colors w-full"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Sair</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                    </>
                ) : (
                  // NOT LOGGED IN - Show "Entrar" button
                    <button
                      onClick={() => router.push('/entrar?redirect=/conta')}
                      className="flex flex-col items-center px-4 py-2 border-2 border-[#CD7F32] text-[#E6C98B] hover:bg-[#CD7F32]/20 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-xl transition-all transform hover:scale-110 shadow-lg"
                    >
                      <User className="w-7 h-7 mb-1" strokeWidth={2.5} />
                      <span className="text-xs font-bold">Conta</span>
                    </button>
                )
              )}
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

  {/* Account Dashboard modal (open for logged users) */}
  <AccountDashboard open={showAccountDashboard} onClose={() => setShowAccountDashboard(false)} />
    </>
  );
}
