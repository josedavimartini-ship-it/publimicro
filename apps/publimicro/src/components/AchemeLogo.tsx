'use client';

/**
 * ACHEME Logo Component
 * Combines a search icon with an Emu (Ema) bird in the center
 * Represents "Ache-me" (Find For Me)
 * Designed for international marketplace www.acheme.com
 */

export default function AchemeLogo({ className = "w-12 h-12", animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Search Circle - Magnifying Glass */}
      <circle
        cx="80"
        cy="80"
        r="50"
        fill="none"
        stroke="url(#achemeGradient)"
        strokeWidth="8"
        className={animate ? "animate-pulse" : ""}
      />
      
      {/* Search Handle */}
      <line
        x1="120"
        y1="120"
        x2="160"
        y2="160"
        stroke="url(#achemeGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        className={animate ? "animate-pulse" : ""}
      />
      
      {/* Emu Bird Silhouette in Center */}
      <g transform="translate(55, 55)">
        {/* Emu Body */}
        <ellipse
          cx="25"
          cy="35"
          rx="15"
          ry="22"
          fill="url(#emuGradient)"
        />
        
        {/* Emu Neck */}
        <path
          d="M 25 15 Q 23 8, 20 5"
          stroke="url(#emuGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Emu Head */}
        <circle
          cx="19"
          cy="3"
          r="4"
          fill="url(#emuGradient)"
        />
        
        {/* Emu Eye */}
        <circle
          cx="20"
          cy="2"
          r="1"
          fill="#FFD700"
        />
        
        {/* Emu Beak */}
        <path
          d="M 16 3 L 14 3"
          stroke="#CD7F32"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Emu Legs */}
        <line x1="20" y1="57" x2="18" y2="67" stroke="url(#emuGradient)" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="57" x2="32" y2="67" stroke="url(#emuGradient)" strokeWidth="2" strokeLinecap="round" />
        
        {/* Emu Feet */}
        <path d="M 18 67 L 15 67 M 18 67 L 21 67" stroke="url(#emuGradient)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 32 67 L 29 67 M 32 67 L 35 67" stroke="url(#emuGradient)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      
      {/* Gradient Definitions */}
      <defs>
        {/* Main ACHEME Gradient - Bronze to Gold */}
        <linearGradient id="achemeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#B87333', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#D4A574', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Emu Gradient - Earth tones */}
        <linearGradient id="emuGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#8B7355', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#5C4033', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Glow Effect for Animation */}
      {animate && (
        <circle
          cx="80"
          cy="80"
          r="50"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          opacity="0.3"
          className="animate-ping"
        />
      )}
    </svg>
  );
}

/**
 * ACHEME Wordmark Component
 */
export function AchemeWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AchemeLogo className="w-10 h-10" />
      <div className="flex flex-col">
        <span className="text-3xl font-black bg-gradient-to-r from-[#B87333] via-[#D4A574] to-[#FFD700] bg-clip-text text-transparent tracking-tight">
          ACHEME
        </span>
        <span className="text-xs text-[#D4A574] font-semibold tracking-widest uppercase">
          Find For Me
        </span>
      </div>
    </div>
  );
}
