'use client';

/**
 * ACHEME Logo Component - PREMIUM EDITION
 * Realistic emu head in profile view inside a magnifying glass
 * Represents "Ache-me" (Find For Me)
 * Stunning bronze/copper/gold color palette with depth and shine
 */

import { useState } from "react";

export default function AchemeLogo({ className = "w-12 h-12", animate = false }: { className?: string; animate?: boolean }) {
  const [svgLoadFailed, setSvgLoadFailed] = useState(false);

  // Prefer external SVG at /logo-acheme.svg when available (easy to swap by replacing public file).
  // Fallback: render the inline premium SVG defined below.
  if (!svgLoadFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo-acheme.svg"
        alt="AcheMe"
        className={className}
        onError={() => setSvgLoadFailed(true)}
      />
    );
  }

  return (
    <svg 
      viewBox="0 0 140 140" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Glow */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
        </filter>

        {/* Lens Gradient - Realistic Glass */}
        <radialGradient id="lensGradient" cx="0.35" cy="0.35">
          <stop offset="0%" stopColor="rgba(230, 201, 139, 0.15)" />
          <stop offset="40%" stopColor="rgba(212, 175, 55, 0.10)" />
          <stop offset="70%" stopColor="rgba(205, 127, 50, 0.08)" />
          <stop offset="100%" stopColor="rgba(184, 115, 51, 0.05)" />
        </radialGradient>

        {/* Frame Gradient - Premium Bronze/Gold */}
        <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4E5B8" />
          <stop offset="15%" stopColor="#D4AF37" />
          <stop offset="40%" stopColor="#CD7F32" />
          <stop offset="65%" stopColor="#B87333" />
          <stop offset="85%" stopColor="#A8896B" />
          <stop offset="100%" stopColor="#8B7355" />
        </linearGradient>

        {/* Emu Head Gradient - Natural Brown Tones */}
        <linearGradient id="emuHeadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4A57B" />
          <stop offset="30%" stopColor="#A8896B" />
          <stop offset="60%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#6B5A45" />
        </linearGradient>

        {/* Neck Gradient - Darker Tones */}
        <linearGradient id="neckGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="50%" stopColor="#6B5A45" />
          <stop offset="100%" stopColor="#5B4A35" />
        </linearGradient>

        {/* Beak Gradient - Shiny Horn Effect */}
        <linearGradient id="beakGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#5B4A35" />
          <stop offset="40%" stopColor="#7B6A55" />
          <stop offset="60%" stopColor="#8B7A65" />
          <stop offset="100%" stopColor="#6B5A45" />
        </linearGradient>

        {/* Handle Gradient - Metallic Bronze */}
        <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="25%" stopColor="#CD7F32" />
          <stop offset="50%" stopColor="#B87333" />
          <stop offset="75%" stopColor="#A8896B" />
          <stop offset="100%" stopColor="#8B7355" />
        </linearGradient>

        {/* Handle Shine */}
        <linearGradient id="handleShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(244, 229, 184, 0.8)" />
          <stop offset="50%" stopColor="rgba(212, 175, 55, 0.4)" />
          <stop offset="100%" stopColor="rgba(184, 115, 51, 0.1)" />
        </linearGradient>

        {/* Cap Gradient - Gold Tip */}
        <radialGradient id="capGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#F4E5B8" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B87333" />
        </radialGradient>
      </defs>

      {/* Magnifying Glass Lens - Outer Circle with Depth */}
      <circle
        cx="55"
        cy="55"
        r="42"
        fill="url(#lensGradient)"
        stroke="url(#frameGradient)"
        strokeWidth="5"
        filter="url(#shadow)"
        className={animate ? "animate-pulse" : ""}
      />
      
      {/* Inner Frame Ring - Metallic Effect */}
      <circle
        cx="55"
        cy="55"
        r="39.5"
        fill="none"
        stroke="rgba(212, 175, 55, 0.3)"
        strokeWidth="1"
      />

      {/* Glass Shine Effect - Multiple Layers */}
      <ellipse
        cx="40"
        cy="38"
        rx="18"
        ry="12"
        fill="rgba(255, 255, 255, 0.35)"
        transform="rotate(-35 40 38)"
      />
      <ellipse
        cx="42"
        cy="40"
        rx="10"
        ry="7"
        fill="rgba(255, 255, 255, 0.20)"
        transform="rotate(-35 42 40)"
      />

      {/* Emu Head Profile - Inside Lens (Facing Right) - ENHANCED */}
      <g transform="translate(30, 28)" filter="url(#shadow)">
        {/* Emu Neck Base - More Realistic Curve */}
        <path
          d="M 26 52 Q 22 42, 19 32 Q 17 22, 19 14 Q 20 8, 22 4"
          stroke="url(#neckGradient)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Neck Highlight */}
        <path
          d="M 24 50 Q 20 40, 18 30 Q 16 20, 18 12"
          stroke="rgba(164, 136, 107, 0.4)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Emu Head - Larger, More Detailed */}
        <ellipse
          cx="22"
          cy="8"
          rx="13"
          ry="11"
          fill="url(#emuHeadGradient)"
          stroke="#5B4A35"
          strokeWidth="1.5"
        />
        
        {/* Head Texture - Feather Impression */}
        <path
          d="M 15 10 Q 18 8, 20 7"
          stroke="rgba(107, 90, 69, 0.3)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 14 13 Q 17 11, 19 10"
          stroke="rgba(107, 90, 69, 0.3)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Emu Beak - Pointing Right - MORE REALISTIC */}
        <path
          d="M 31 8 L 42 7 L 42 10 L 31 10 Z"
          fill="url(#beakGradient)"
          stroke="#4B3A25"
          strokeWidth="1.2"
        />
        
        {/* Beak Top Ridge */}
        <path
          d="M 31 8 L 41 7.2"
          stroke="rgba(139, 122, 101, 0.5)"
          strokeWidth="0.8"
        />
        
        {/* Beak Bottom Shadow */}
        <path
          d="M 31 10 L 41 9.8"
          stroke="rgba(75, 58, 37, 0.5)"
          strokeWidth="0.8"
        />
        
        {/* Emu Eye - Larger, More Expressive */}
        <circle
          cx="26"
          cy="7.5"
          r="2.8"
          fill="#1a1a1a"
          stroke="#0a0a0a"
          strokeWidth="0.5"
        />
        
        {/* Eye Highlight - Double Layer for Depth */}
        <circle
          cx="27"
          cy="6.8"
          r="1.2"
          fill="#D4AF37"
        />
        <circle
          cx="27.3"
          cy="6.5"
          r="0.6"
          fill="#F4E5B8"
        />
        
        {/* Eye Rim */}
        <circle
          cx="26"
          cy="7.5"
          r="3.2"
          fill="none"
          stroke="rgba(139, 115, 85, 0.3)"
          strokeWidth="0.6"
        />
        
        {/* Top Feathers - More Elaborate */}
        <path
          d="M 16 4 Q 13 1, 11 -2"
          stroke="#9B8A70"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 19 3 Q 17 0, 16 -3"
          stroke="#9B8A70"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 13 5 Q 10 3, 8 1"
          stroke="#8B7A65"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 21 4 Q 20 1, 19 -2"
          stroke="#9B8A70"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Feather Highlights */}
        <path
          d="M 17 4 Q 14 2, 12 0"
          stroke="rgba(196, 165, 123, 0.4)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Magnifying Glass Handle - Enhanced */}
      <path
        d="M 82 82 L 118 118"
        stroke="url(#handleGradient)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#shadow)"
        className={animate ? "animate-pulse" : ""}
      />
      
      {/* Handle Shine/Highlight */}
      <path
        d="M 84 84 L 116 116"
        stroke="url(#handleShine)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Handle Ridge Detail */}
      <path
        d="M 86 86 L 114 114"
        stroke="rgba(139, 115, 85, 0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Handle End Cap - Enhanced */}
      <circle
        cx="121"
        cy="121"
        r="6.5"
        fill="url(#capGradient)"
        stroke="#8B7355"
        strokeWidth="2"
        filter="url(#shadow)"
      />
      
      {/* Cap Highlight */}
      <circle
        cx="119"
        cy="119"
        r="2.5"
        fill="rgba(244, 229, 184, 0.6)"
      />
      
      {/* Cap Rim */}
      <circle
        cx="121"
        cy="121"
        r="5"
        fill="none"
        stroke="rgba(212, 175, 55, 0.4)"
        strokeWidth="0.8"
      />

      {/* Glow Effect for Animation */}
  {animate && (
        <>
          <circle
            cx="55"
            cy="55"
            r="42"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            opacity="0.5"
            className="animate-ping"
          />
          <circle
            cx="55"
            cy="55"
            r="50"
            fill="none"
            stroke="#F4E5B8"
            strokeWidth="1"
            opacity="0.3"
            className="animate-ping"
            style={{ animationDelay: "0.2s" }}
          />
        </>
      )}
    </svg>
  );
}

/**
 * ACHEME Wordmark Component - PREMIUM EDITION
 * Stunning bronze/copper/gold branding with metallic sheen
 */
export function AchemeWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AchemeLogo className="w-14 h-14" animate />
      <div className="flex flex-col">
        <span className="text-4xl font-black bg-gradient-to-r from-[#F4E5B8] via-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent tracking-tight leading-none drop-shadow-[0_2px_4px_rgba(205,127,50,0.3)]">
          ACHEME
        </span>
        <span className="text-xs text-[#D4AF37] font-semibold tracking-[0.2em] uppercase mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          Find For Me
        </span>
      </div>
    </div>
  );
}

/**
 * ACHEME Icon Only - For Nav/Buttons
 */
export function AchemeIcon({ size = "md", animate = false }: { size?: "sm" | "md" | "lg"; animate?: boolean }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };
  
  return <AchemeLogo className={sizeClasses[size]} animate={animate} />;
}
