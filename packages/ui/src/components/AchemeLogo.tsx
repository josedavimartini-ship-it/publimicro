"use client";

import { useState, useEffect } from "react";

interface AchemeLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

/**
 * AcheMe Logo - Realistic Emu Head with Winking Animation
 * 
 * A realistic emu head looking sideways, dynamically winking at the viewer
 * as if to say "look, here's some good, accurate, carefully selected stuff"
 */
export function AchemeLogo({ size = "md", animate = true, className = "" }: AchemeLogoProps) {
  const [isWinking, setIsWinking] = useState(false);

  // Wink animation - happens every 4-6 seconds
  useEffect(() => {
    if (!animate) return;

    const wink = () => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 200);
    };

    // Initial wink after 2 seconds
    const initialTimer = setTimeout(wink, 2000);

    // Random interval winks
    const interval = setInterval(() => {
      const delay = Math.random() * 2000 + 4000; // 4-6 seconds
      setTimeout(wink, delay);
    }, 6000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [animate]);

  const sizes = {
    sm: { width: 40, height: 40 },
    md: { width: 56, height: 56 },
    lg: { width: 80, height: 80 },
    xl: { width: 120, height: 120 },
  };

  const { width, height } = sizes[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className}`}
      role="img"
      aria-label="AcheMe - Emu mascot looking for great deals"
    >
      <defs>
        {/* Realistic feather gradients */}
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

        {/* Feather texture pattern */}
        <pattern id="featherTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="4" y2="4" stroke="#5D4E37" strokeWidth="0.5" opacity="0.3" />
        </pattern>

        {/* Soft shadow filter */}
        <filter id="emuShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background circle - optional golden ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="url(#eyeShine)" strokeWidth="2" opacity="0.3" />

      <g filter="url(#emuShadow)">
        {/* Neck (coming from bottom-left, curving up) */}
        <path
          d="M 15 95 
             Q 10 70, 20 55
             Q 30 40, 40 35
             L 45 38
             Q 35 45, 28 58
             Q 22 72, 25 90
             Z"
          fill="url(#emuFeatherMain)"
        />
        
        {/* Neck feather details */}
        <path
          d="M 18 85 Q 22 70, 28 60"
          stroke="#8B7355"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M 22 82 Q 26 68, 32 58"
          stroke="#6B5A45"
          strokeWidth="0.8"
          fill="none"
          opacity="0.4"
        />

        {/* Head base - side profile facing right */}
        <ellipse
          cx="55"
          cy="38"
          rx="25"
          ry="22"
          fill="url(#emuFeatherMain)"
        />

        {/* Top of head - crown feathers */}
        <path
          d="M 35 30 Q 45 15, 60 18 Q 75 22, 78 32"
          fill="url(#emuFeatherHighlight)"
        />
        
        {/* Crown feather tufts */}
        <path d="M 48 20 Q 50 12, 52 20" stroke="#4A3D2C" strokeWidth="2" fill="none" />
        <path d="M 54 18 Q 57 10, 60 17" stroke="#5D4E37" strokeWidth="1.5" fill="none" />
        <path d="M 60 19 Q 64 12, 66 20" stroke="#4A3D2C" strokeWidth="1.5" fill="none" />

        {/* Blue skin around eye area */}
        <path
          d="M 55 30 
             Q 70 28, 78 35
             Q 80 42, 75 48
             Q 68 52, 58 50
             Q 50 48, 50 40
             Q 52 32, 55 30"
          fill="url(#emuSkin)"
        />

        {/* Eye socket */}
        <ellipse cx="65" cy="40" rx="8" ry="9" fill="#1a1a1a" />
        
        {/* Eye - with winking animation */}
        <g>
          {/* Eyeball */}
          <ellipse 
            cx="65" 
            cy="40" 
            rx={isWinking ? 7 : 7}
            ry={isWinking ? 1.5 : 7}
            fill="#2D2D2D"
            className="transition-all duration-150"
          />
          
          {/* Iris - only show when not winking */}
          {!isWinking && (
            <>
              <circle cx="67" cy="40" r="4" fill="#8B4513" />
              <circle cx="67" cy="40" r="2.5" fill="#1a1a1a" />
              {/* Eye shine */}
              <circle cx="68.5" cy="38.5" r="1.2" fill="white" opacity="0.9" />
              <circle cx="66" cy="41" r="0.6" fill="white" opacity="0.5" />
            </>
          )}
          
          {/* Eyelid line when winking */}
          {isWinking && (
            <path
              d="M 58 40 Q 65 38, 72 40"
              stroke="#3D3226"
              strokeWidth="1.5"
              fill="none"
            />
          )}
        </g>

        {/* Beak - long and pointed */}
        <path
          d="M 78 38
             L 98 42
             L 95 46
             L 78 44
             Q 76 41, 78 38"
          fill="url(#emuBeak)"
        />
        
        {/* Beak ridge */}
        <path
          d="M 78 39 L 96 43"
          stroke="#5A5A5A"
          strokeWidth="0.5"
          opacity="0.6"
        />
        
        {/* Nostril */}
        <ellipse cx="86" cy="42" rx="1.5" ry="1" fill="#1a1a1a" opacity="0.7" />

        {/* Lower jaw hint */}
        <path
          d="M 78 44 L 88 48 L 78 47 Z"
          fill="#3A3A3A"
        />

        {/* Ear opening (behind eye) */}
        <ellipse cx="52" cy="42" rx="3" ry="4" fill="#3D3226" opacity="0.6" />

        {/* Feather detail lines on head */}
        <path d="M 40 45 Q 50 50, 55 48" stroke="#5D4E37" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M 42 40 Q 48 42, 52 40" stroke="#6B5A45" strokeWidth="0.6" fill="none" opacity="0.3" />
      </g>

      {/* Magnifying glass held in front */}
      <g opacity="0.95">
        {/* Glass handle */}
        <line x1="25" y1="75" x2="38" y2="58" stroke="#B87333" strokeWidth="4" strokeLinecap="round" />
        <line x1="25" y1="75" x2="38" y2="58" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
        
        {/* Glass rim */}
        <circle cx="45" cy="52" r="12" fill="none" stroke="#CD7F32" strokeWidth="3" />
        <circle cx="45" cy="52" r="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
        
        {/* Glass lens */}
        <circle cx="45" cy="52" r="10" fill="rgba(255,255,255,0.08)" />
        
        {/* Glass shine */}
        <ellipse cx="42" cy="48" rx="4" ry="3" fill="rgba(255,255,255,0.25)" transform="rotate(-20 42 48)" />
      </g>
    </svg>
  );
}

/**
 * Compact version of the AcheMe logo for use in navigation bars
 */
export function AchemeLogoCompact({ animate = true }: { animate?: boolean }) {
  return <AchemeLogo size="md" animate={animate} />;
}

export default AchemeLogo;
