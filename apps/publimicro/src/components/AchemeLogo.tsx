'use client';

/**
 * ACHEME Logo Component
 * Simple, clean emu head in profile view inside a magnifying glass
 * Represents "Ache-me" (Find For Me)
 * Premium bronze/copper/gold color palette
 */

export default function AchemeLogo({ className = "w-12 h-12", animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Magnifying Glass Lens - Outer Circle */}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="url(#lensGradient)"
        stroke="url(#frameGradient)"
        strokeWidth="4"
        className={animate ? "animate-pulse" : ""}
      />
      
      {/* Glass Shine Effect */}
      <ellipse
        cx="38"
        cy="38"
        rx="14"
        ry="10"
        fill="rgba(255, 255, 255, 0.25)"
        transform="rotate(-35 38 38)"
      />

      {/* Emu Head Profile - Inside Lens (Facing Right) */}
      <g transform="translate(28, 24)">
        {/* Emu Neck Base */}
        <path
          d="M 24 48 Q 19 38, 17 28 Q 16 18, 19 10"
          stroke="#8B7355"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Emu Head */}
        <ellipse
          cx="20"
          cy="10"
          rx="11"
          ry="9"
          fill="url(#emuHeadGradient)"
          stroke="#6B5A45"
          strokeWidth="1.5"
        />
        
        {/* Emu Beak - Pointing Right */}
        <path
          d="M 27 10 L 36 9 L 36 11 L 27 11 Z"
          fill="url(#beakGradient)"
          stroke="#6B5A45"
          strokeWidth="1"
        />
        
        {/* Emu Eye */}
        <circle
          cx="24"
          cy="9"
          r="2.2"
          fill="#1a1a1a"
        />
        
        {/* Eye Highlight - Golden */}
        <circle
          cx="24.8"
          cy="8.3"
          r="0.8"
          fill="#D4AF37"
        />
        
        {/* Top Feather Details */}
        <path
          d="M 15 7 Q 12 4, 10 1"
          stroke="#A8896B"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 18 6 Q 16 3, 15 0"
          stroke="#A8896B"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 13 8 Q 10 6, 8 4"
          stroke="#A8896B"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Magnifying Glass Handle */}
      <path
        d="M 74 74 L 104 104"
        stroke="url(#handleGradient)"
        strokeWidth="7"
        strokeLinecap="round"
        className={animate ? "animate-pulse" : ""}
      />
      
      {/* Handle Highlight */}
      <path
        d="M 76 76 L 102 102"
        stroke="rgba(212, 175, 55, 0.5)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Handle End Cap */}
      <circle
        cx="106"
        cy="106"
        r="5"
        fill="url(#capGradient)"
        stroke="#8B7355"
        strokeWidth="1.5"
      />

      {/* Gradients */}
      <defs>
        {/* Lens Gradient - Subtle Glass */}
        <radialGradient id="lensGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="rgba(230, 201, 139, 0.12)" />
          <stop offset="60%" stopColor="rgba(212, 175, 55, 0.08)" />
          <stop offset="100%" stopColor="rgba(205, 127, 50, 0.05)" />
        </radialGradient>

        {/* Frame Gradient - Bronze/Gold */}
        <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#CD7F32" />
          <stop offset="100%" stopColor="#B87333" />
        </linearGradient>

        {/* Emu Head Gradient */}
        <linearGradient id="emuHeadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8896B" />
          <stop offset="50%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#6B5A45" />
        </linearGradient>

        {/* Beak Gradient */}
        <linearGradient id="beakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B5A45" />
          <stop offset="100%" stopColor="#8B7355" />
        </linearGradient>

        {/* Handle Gradient */}
        <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CD7F32" />
          <stop offset="50%" stopColor="#B87333" />
          <stop offset="100%" stopColor="#A8896B" />
        </linearGradient>

        {/* Cap Gradient */}
        <radialGradient id="capGradient">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B87333" />
        </radialGradient>
      </defs>
      
      {/* Glow Effect for Animation */}
      {animate && (
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          opacity="0.4"
          className="animate-ping"
        />
      )}
    </svg>
  );
}

/**
 * ACHEME Wordmark Component
 * Premium bronze/copper/gold branding
 */
export function AchemeWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AchemeLogo className="w-12 h-12" />
      <div className="flex flex-col">
        <span className="text-3xl font-black bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent tracking-tight leading-none">
          ACHEME
        </span>
        <span className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase">
          Find For Me
        </span>
      </div>
    </div>
  );
}
