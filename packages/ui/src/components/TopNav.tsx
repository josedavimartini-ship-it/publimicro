"use client";

import Link from "next/link";
import { Heart, Plus, ChevronDown, User } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

type SearchTarget = "local" | "main";

// Simplified category names (removed AcheMe prefix)
const categories = [
  { value: "all", label: "Todas Categorias" },
  { value: "proper", label: "🏘️ Proper (Imóveis)" },
  { value: "motors", label: "🚗 Motors (Veículos)" },
  { value: "machina", label: "⚙️ Machina (Máquinas)" },
  { value: "marine", label: "⛵ Marine (Náutica)" },
  { value: "global", label: "🌍 Global" },
  { value: "share", label: "🤝 Share" },
  { value: "journey", label: "✈️ Journey (Viagens)" },
  { value: "tudo", label: "🛍️ Tudo" },
];

/**
 * AcheMe Logo - Realistic Emu Head with Winking Animation
 * Inline version to avoid circular dependencies
 */
function AchemeLogoInline({ animate = true }: { animate?: boolean }) {
  const [isWinking, setIsWinking] = useState(false);

  useEffect(() => {
    if (!animate) return;

    const wink = () => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 200);
    };

    const initialTimer = setTimeout(wink, 2000);
    const interval = setInterval(() => {
      const delay = Math.random() * 2000 + 4000;
      setTimeout(wink, delay);
    }, 6000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [animate]);

  return (
    <svg width="56" height="56" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300">
      <defs>
        <linearGradient id="emuFeatherMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5D4E37" />
          <stop offset="30%" stopColor="#7A6B54" />
          <stop offset="70%" stopColor="#4A3D2C" />
          <stop offset="100%" stopColor="#3D3226" />
        </linearGradient>
        <linearGradient id="emuFeatherHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="50%" stopColor="#A08060" />
          <stop offset="100%" stopColor="#6B5A45" />
        </linearGradient>
        <linearGradient id="emuSkin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7EB3D8" />
          <stop offset="50%" stopColor="#5A9BC7" />
          <stop offset="100%" stopColor="#4A8AB6" />
        </linearGradient>
        <linearGradient id="emuBeak" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#4A4A4A" />
          <stop offset="50%" stopColor="#3A3A3A" />
          <stop offset="100%" stopColor="#2A2A2A" />
        </linearGradient>
        <linearGradient id="eyeShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
        <filter id="emuShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      <circle cx="50" cy="50" r="48" fill="none" stroke="url(#eyeShine)" strokeWidth="2" opacity="0.3" />

      <g filter="url(#emuShadow)">
        {/* Neck */}
        <path d="M 15 95 Q 10 70, 20 55 Q 30 40, 40 35 L 45 38 Q 35 45, 28 58 Q 22 72, 25 90 Z" fill="url(#emuFeatherMain)" />
        
        {/* Head */}
        <ellipse cx="55" cy="38" rx="25" ry="22" fill="url(#emuFeatherMain)" />
        <path d="M 35 30 Q 45 15, 60 18 Q 75 22, 78 32" fill="url(#emuFeatherHighlight)" />
        
        {/* Crown feathers */}
        <path d="M 48 20 Q 50 12, 52 20" stroke="#4A3D2C" strokeWidth="2" fill="none" />
        <path d="M 54 18 Q 57 10, 60 17" stroke="#5D4E37" strokeWidth="1.5" fill="none" />
        <path d="M 60 19 Q 64 12, 66 20" stroke="#4A3D2C" strokeWidth="1.5" fill="none" />

        {/* Blue skin around eye */}
        <path d="M 55 30 Q 70 28, 78 35 Q 80 42, 75 48 Q 68 52, 58 50 Q 50 48, 50 40 Q 52 32, 55 30" fill="url(#emuSkin)" />

        {/* Eye with winking animation */}
        <ellipse cx="65" cy="40" rx="8" ry="9" fill="#1a1a1a" />
        <ellipse cx="65" cy="40" rx={isWinking ? 7 : 7} ry={isWinking ? 1.5 : 7} fill="#2D2D2D" className="transition-all duration-150" />
        {!isWinking && (
          <>
            <circle cx="67" cy="40" r="4" fill="#8B4513" />
            <circle cx="67" cy="40" r="2.5" fill="#1a1a1a" />
            <circle cx="68.5" cy="38.5" r="1.2" fill="white" opacity="0.9" />
          </>
        )}
        {isWinking && <path d="M 58 40 Q 65 38, 72 40" stroke="#3D3226" strokeWidth="1.5" fill="none" />}

        {/* Beak */}
        <path d="M 78 38 L 98 42 L 95 46 L 78 44 Q 76 41, 78 38" fill="url(#emuBeak)" />
        <ellipse cx="86" cy="42" rx="1.5" ry="1" fill="#1a1a1a" opacity="0.7" />
      </g>

      {/* Magnifying glass */}
      <g opacity="0.95">
        <line x1="25" y1="75" x2="38" y2="58" stroke="#B87333" strokeWidth="4" strokeLinecap="round" />
        <line x1="25" y1="75" x2="38" y2="58" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
        <circle cx="45" cy="52" r="12" fill="none" stroke="#CD7F32" strokeWidth="3" />
        <circle cx="45" cy="52" r="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
        <circle cx="45" cy="52" r="10" fill="rgba(255,255,255,0.08)" />
        <ellipse cx="42" cy="48" rx="4" ry="3" fill="rgba(255,255,255,0.25)" transform="rotate(-20 42 48)" />
      </g>
    </svg>
  );
}

/**
 * Animated Negotiation Icon - Arm Wrestling / Handshake
 * Inline version for TopNav
 */
function NegotiationIconInline({ size = 28 }: { size?: number }) {
  const [phase, setPhase] = useState<"left" | "center" | "right" | "deal">("center");
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    const sequence = ["center", "left", "center", "right", "center", "left", "right", "deal"] as const;
    let currentIndex = 0;

    const animate = () => {
      const current = sequence[currentIndex];
      setPhase(current);
      if (current === "deal") {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 1000);
      }
      currentIndex = (currentIndex + 1) % sequence.length;
    };

    animate();
    const interval = setInterval(animate, 1500);
    return () => clearInterval(interval);
  }, []);

  const rotation = phase === "left" ? -15 : phase === "right" ? 15 : 0;
  const isDeal = phase === "deal";

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skinTone1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C4A0" />
          <stop offset="100%" stopColor="#D4A574" />
        </linearGradient>
        <linearGradient id="skinTone2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A87C" />
          <stop offset="100%" stopColor="#B8956E" />
        </linearGradient>
        <linearGradient id="sleeve1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B7F5C" />
          <stop offset="100%" stopColor="#8B9B6E" />
        </linearGradient>
        <linearGradient id="sleeve2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2C5F6F" />
          <stop offset="100%" stopColor="#3A7A8A" />
        </linearGradient>
        <linearGradient id="sparkleGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>

      <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '24px 24px', transition: 'transform 0.5s ease-in-out' }}>
        {!isDeal ? (
          <>
            {/* Arm wrestling mode */}
            <path d="M 2 28 L 12 26 L 14 30 L 4 32 Z" fill="url(#sleeve1)" />
            <path d="M 12 24 L 22 22 Q 24 24, 22 26 L 12 28 Q 10 26, 12 24" fill="url(#skinTone1)" />
            <path d="M 20 21 L 26 20 Q 28 22, 28 25 Q 27 27, 24 27 L 20 26 Q 19 24, 20 21" fill="url(#skinTone1)" />
            <path d="M 46 28 L 36 26 L 34 30 L 44 32 Z" fill="url(#sleeve2)" />
            <path d="M 36 24 L 26 22 Q 24 24, 26 26 L 36 28 Q 38 26, 36 24" fill="url(#skinTone2)" />
            <path d="M 28 21 L 22 20 Q 20 22, 20 25 Q 21 27, 24 27 L 28 26 Q 29 24, 28 21" fill="url(#skinTone2)" />
            <rect x="8" y="34" width="32" height="4" rx="1" fill="#4A3D2C" />
          </>
        ) : (
          <>
            {/* Handshake mode */}
            <path d="M 4 24 L 14 22 L 16 28 L 6 30 Z" fill="url(#sleeve1)" />
            <path d="M 44 24 L 34 22 L 32 28 L 42 30 Z" fill="url(#sleeve2)" />
            <path d="M 14 20 L 24 18 Q 26 20, 25 24 L 16 26 Q 13 24, 14 20" fill="url(#skinTone1)" />
            <path d="M 34 20 L 24 18 Q 22 20, 23 24 L 32 26 Q 35 24, 34 20" fill="url(#skinTone2)" />
          </>
        )}
      </g>

      {showSparkles && (
        <g className="animate-pulse">
          <circle cx="12" cy="8" r="1" fill="#FFD700" />
          <circle cx="36" cy="8" r="1" fill="#FFD700" />
          <circle cx="24" cy="4" r="1.5" fill="#FFA500" />
        </g>
      )}

      {isDeal && (
        <g>
          <circle cx="24" cy="40" r="6" fill="#28A745" />
          <path d="M 20 40 L 23 43 L 28 37" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

export function TopNav({
  brand: _brand = "AcheMe",
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
    () => (searchTarget === "main" ? "https://www.acheme.com.br/search" : "/search"),
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
          {/* LOGO - Left Corner - AcheMe Branding */}
          <Link href={brandHref} className="flex items-center gap-4 hover:opacity-90 transition-all flex-shrink-0 group relative">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-[#CD7F32]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            
            {/* AcheMe Logo - Realistic Emu */}
            <div className="relative z-10 transform group-hover:scale-110 transition-transform">
              <AchemeLogoInline animate={true} />
            </div>
            
            <div className="flex flex-col relative z-10">
              {/* AcheMe Typography */}
              <div className="text-4xl font-black tracking-tight leading-none mb-1">
                <span className="bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent drop-shadow-lg">
                  Ache
                </span>
                <span className="bg-gradient-to-r from-[#8B9B6E] via-[#A8C97F] to-[#6B8E23] bg-clip-text text-transparent drop-shadow-lg">
                  Me
                </span>
              </div>
              
              {/* Premium subtitle */}
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
                <span className="text-xs bg-gradient-to-r from-[#B87333] to-[#D4AF37] bg-clip-text text-transparent font-bold tracking-wider uppercase">
                  Ecossistema de Negócios
                </span>
                <div className="w-1 h-1 bg-[#CD7F32] rounded-full"></div>
              </div>
            </div>
          </Link>

          {/* SEARCH BAR - Bronze/Copper Theme */}
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
            
            {/* Negotiation Icon - Animated Arm Wrestling / Handshake */}
            <Link href={chatHref} className="flex flex-col items-center text-[#A8C97F] hover:text-[#8B9B6E] transition-all group transform hover:scale-110">
              <NegotiationIconInline size={28} />
              <span className="text-xs font-bold">Negociar</span>
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
