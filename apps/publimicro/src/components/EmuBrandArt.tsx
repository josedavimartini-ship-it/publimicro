'use client';

/**
 * ACHEME Emu Brand Art
 * Artistic illustration of an Emu bird actively searching
 * Used for marketing materials, app icons, and brand identity
 * High-detail SVG for scalability
 */

export default function EmuBrandArt({ 
  className = "w-64 h-64", 
  variant = "searching" 
}: { 
  className?: string; 
  variant?: "searching" | "standing" | "looking" 
}) {
  return (
    <svg 
      viewBox="0 0 400 400" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Bronze to Gold Gradient */}
        <linearGradient id="bronzeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#B87333', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#D4A574', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Emu Feather Gradient - Rich Browns */}
        <linearGradient id="emuFeathers" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#8B7355', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#6B5344', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#5C4033', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Highlight Gradient */}
        <linearGradient id="highlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#D4A574', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 0.3 }} />
        </linearGradient>
        
        {/* Magnifying Glass Glass Gradient */}
        <radialGradient id="glassGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.8 }} />
          <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#D4A574', stopOpacity: 0.2 }} />
        </radialGradient>
      </defs>
      
      {/* Background Circle - Optional */}
      <circle
        cx="200"
        cy="200"
        r="190"
        fill="none"
        stroke="url(#bronzeGold)"
        strokeWidth="3"
        opacity="0.3"
      />
      
      {/* Magnifying Glass - Large and prominent */}
      <g transform="translate(220, 100)">
        {/* Glass Circle */}
        <circle
          cx="0"
          cy="0"
          r="90"
          fill="url(#glassGradient)"
          stroke="url(#bronzeGold)"
          strokeWidth="8"
        />
        
        {/* Glass Reflection */}
        <path
          d="M -30 -40 Q -20 -50, 10 -55 Q 40 -50, 50 -30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          opacity="0.6"
          strokeLinecap="round"
        />
        
        {/* Handle */}
        <line
          x1="65"
          y1="65"
          x2="130"
          y2="130"
          stroke="url(#bronzeGold)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Handle Shadow */}
        <line
          x1="68"
          y1="68"
          x2="133"
          y2="133"
          stroke="#5C4033"
          strokeWidth="8"
          opacity="0.3"
          strokeLinecap="round"
        />
      </g>
      
      {/* EMU BIRD - Detailed and Searching */}
      <g transform="translate(80, 120)">
        
        {/* Emu Body - Main torso */}
        <ellipse
          cx="60"
          cy="100"
          rx="45"
          ry="70"
          fill="url(#emuFeathers)"
        />
        
        {/* Body Highlight */}
        <ellipse
          cx="50"
          cy="90"
          rx="25"
          ry="40"
          fill="url(#highlight)"
          opacity="0.4"
        />
        
        {/* Wing - Feather details */}
        <path
          d="M 45 70 Q 30 80, 20 100 Q 25 110, 40 115 Q 50 105, 50 90 Z"
          fill="url(#emuFeathers)"
          opacity="0.8"
        />
        
        {/* Wing Feather Lines */}
        <path
          d="M 30 85 L 25 95 M 35 90 L 30 100 M 40 95 L 35 105"
          stroke="#5C4033"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        
        {/* Tail Feathers */}
        <path
          d="M 70 140 Q 80 160, 75 180 M 75 145 Q 90 165, 90 185 M 80 150 Q 100 170, 105 190"
          stroke="url(#emuFeathers)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Neck - Long and curved, looking through magnifying glass */}
        <path
          d="M 60 40 Q 65 25, 75 15 Q 85 8, 95 10"
          stroke="url(#emuFeathers)"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Neck Highlight */}
        <path
          d="M 62 35 Q 67 22, 77 14"
          stroke="url(#highlight)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        
        {/* Head - Detailed */}
        <ellipse
          cx="100"
          cy="12"
          rx="16"
          ry="14"
          fill="url(#emuFeathers)"
        />
        
        {/* Head Highlight */}
        <ellipse
          cx="97"
          cy="9"
          rx="8"
          ry="7"
          fill="url(#highlight)"
          opacity="0.5"
        />
        
        {/* Eye - Large and expressive, looking forward */}
        <circle
          cx="105"
          cy="10"
          r="5"
          fill="#2a2a1a"
        />
        
        {/* Eye Highlight - Sparkle */}
        <circle
          cx="107"
          cy="8"
          r="2"
          fill="#FFD700"
        />
        
        {/* Beak - Pointed and searching */}
        <path
          d="M 112 12 L 125 13 L 112 15 Z"
          fill="#CD7F32"
        />
        
        {/* Beak Highlight */}
        <path
          d="M 112 12 L 120 12.5"
          stroke="#FFD700"
          strokeWidth="1"
          opacity="0.7"
        />
        
        {/* Legs - Strong and visible */}
        <line 
          x1="50" 
          y1="170" 
          x2="45" 
          y2="210" 
          stroke="url(#emuFeathers)" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        <line 
          x1="70" 
          y1="170" 
          x2="75" 
          y2="210" 
          stroke="url(#emuFeathers)" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        
        {/* Feet - Three-toed */}
        <g transform="translate(45, 210)">
          <path d="M 0 0 L -8 8" stroke="#5C4033" strokeWidth="4" strokeLinecap="round" />
          <path d="M 0 0 L 0 10" stroke="#5C4033" strokeWidth="4" strokeLinecap="round" />
          <path d="M 0 0 L 8 8" stroke="#5C4033" strokeWidth="4" strokeLinecap="round" />
        </g>
        
        <g transform="translate(75, 210)">
          <path d="M 0 0 L -8 8" stroke="#5C4033" strokeWidth="4" strokeLinecap="round" />
          <path d="M 0 0 L 0 10" stroke="#5C4033" strokeWidth="4" strokeLinecap="round" />
          <path d="M 0 0 L 8 8" stroke="#5C4033" strokeWidth="4" strokeLinecap="round" />
        </g>
        
        {/* Texture Details - Feather patterns on body */}
        <path
          d="M 45 85 Q 50 88, 55 85 M 40 95 Q 47 98, 54 95 M 42 105 Q 50 108, 58 105"
          stroke="#5C4033"
          strokeWidth="2"
          opacity="0.4"
          strokeLinecap="round"
        />
      </g>
      
      {/* Search Rays - Coming from magnifying glass */}
      <g opacity="0.3">
        <path d="M 310 230 L 360 260" stroke="url(#bronzeGold)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 320 240 L 380 250" stroke="url(#bronzeGold)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 315 250 L 370 275" stroke="url(#bronzeGold)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      
      {/* Sparkles - Search magic */}
      <g opacity="0.8">
        <path d="M 340 170 L 342 172 L 340 174 L 338 172 Z" fill="#FFD700" />
        <path d="M 360 150 L 363 153 L 360 156 L 357 153 Z" fill="#D4A574" />
        <path d="M 330 190 L 332 192 L 330 194 L 328 192 Z" fill="#FFD700" />
      </g>
    </svg>
  );
}

/**
 * Simplified Icon Version for App Stores
 */
export function EmuIconArt({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Icon Background Gradient */}
        <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0a0a0a', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Icon Gradient */}
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#B87333', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#D4A574', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect width="512" height="512" rx="100" fill="url(#iconBg)" />
      
      {/* Simplified Magnifying Glass */}
      <circle
        cx="320"
        cy="220"
        r="120"
        fill="none"
        stroke="url(#iconGradient)"
        strokeWidth="16"
      />
      
      {/* Handle */}
      <line
        x1="400"
        y1="300"
        x2="480"
        y2="380"
        stroke="url(#iconGradient)"
        strokeWidth="20"
        strokeLinecap="round"
      />
      
      {/* Simplified Emu */}
      <g transform="translate(80, 150)">
        {/* Body */}
        <ellipse cx="80" cy="150" rx="60" ry="90" fill="url(#iconGradient)" />
        {/* Neck */}
        <path d="M 80 70 Q 100 40, 120 30" stroke="url(#iconGradient)" strokeWidth="25" fill="none" strokeLinecap="round" />
        {/* Head */}
        <circle cx="125" cy="25" r="20" fill="url(#iconGradient)" />
        {/* Eye */}
        <circle cx="133" cy="22" r="6" fill="#FFD700" />
        {/* Beak */}
        <path d="M 140 25 L 160 26" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
