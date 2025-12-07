'use client';

/**
 * ACHEME Logo Component - PHOTO EDITION
 * 
 * Layout:
 *   Ach [Emu Head Photo] eMe
 *        (rotates between real emu photos)
 * 
 * Uses real emu photographs from Unsplash that cycle through
 * to create a dynamic, living brand identity.
 */

import { useState, useEffect } from "react";
import Image from "next/image";

// Real emu/rhea photos from Unsplash - verified working URLs
const EMU_PHOTOS = [
  "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1590095037543-37fbf8e8dbee?w=200&h=200&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1557401620-67270b61ea82?w=200&h=200&fit=crop&crop=faces",
];

// Fallback SVG emu illustration
const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="emuBrown" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B7355"/>
      <stop offset="100%" stop-color="#5B4A35"/>
    </linearGradient>
  </defs>
  <ellipse cx="32" cy="28" rx="18" ry="16" fill="url(#emuBrown)"/>
  <ellipse cx="40" cy="24" rx="5" ry="6" fill="#3a3a3a"/>
  <circle cx="41" cy="23" r="2" fill="#FFD700"/>
  <circle cx="41" cy="23" r="1" fill="#000"/>
  <path d="M50 28 L62 26 L60 30 L50 32 Z" fill="#4a4a4a"/>
  <path d="M20 36 Q16 50 18 58" stroke="url(#emuBrown)" stroke-width="8" fill="none"/>
</svg>
`)}`;

interface AchemeLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export default function AchemeLogo({ 
  className = "", 
  size = "md",
  animate = true 
}: AchemeLogoProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Rotate through emu photos every 5 seconds
  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % EMU_PHOTOS.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [animate]);

  // Size configurations
  const sizeConfig = {
    sm: { container: "h-8", text: "text-lg", image: 24 },
    md: { container: "h-12", text: "text-2xl", image: 36 },
    lg: { container: "h-16", text: "text-4xl", image: 48 },
  };
  
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-0.5 ${config.container} ${className}`}>
      {/* "Ach" in gold/bronze gradient */}
      <span 
        className={`${config.text} font-black tracking-tight bg-gradient-to-r from-[#B87333] via-[#D4AF37] to-[#CD7F32] bg-clip-text text-transparent`}
      >
        Ach
      </span>
      
      {/* Emu head photo - circular with gold border */}
      <div 
        className="relative rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg flex-shrink-0"
        style={{ 
          width: config.image, 
          height: config.image,
        }}
      >
        <Image
          src={imageError ? FALLBACK_SVG : EMU_PHOTOS[currentPhotoIndex]}
          alt="Emu"
          fill
          className="object-cover transition-opacity duration-500"
          onError={() => setImageError(true)}
          unoptimized
        />
        
        {/* Subtle golden overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent pointer-events-none" />
      </div>
      
      {/* "eMe" in green gradient */}
      <span 
        className={`${config.text} font-black tracking-tight bg-gradient-to-r from-[#8B9B6E] via-[#A8C97F] to-[#6B8E23] bg-clip-text text-transparent`}
      >
        eMe
      </span>
    </div>
  );
}
