"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * AnimatedHandshake - Dynamic Arm Wrestling to Palm Slap Animation
 * 
 * Phase 1: ARM WRESTLING - Two arms locked, fighting back and forth
 *          (tilts left, then right, like a tense wrestling match)
 * Phase 2: PALM SLAP - The "bro greeting" where two buddies slap palms
 *          (right hand to right hand, like a high-five but horizontal)
 * 
 * This creates a unique, eye-catching icon that shows negotiation/interaction
 */
export function AnimatedHandshake({ size = 28, className = "" }: { size?: number; className?: string }) {
  const [phase, setPhase] = useState<"wrestle-left" | "wrestle-center" | "wrestle-right" | "slap-apart" | "slap-together">("wrestle-center");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Respect prefers-reduced-motion
    const prefersReduce = typeof window !== "undefined" && 
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReduce) return;

    // Animation sequence: wrestling back and forth, then palm slap
    const sequence: typeof phase[] = [
      "wrestle-center",
      "wrestle-left",
      "wrestle-center", 
      "wrestle-right",
      "wrestle-center",
      "wrestle-left",
      "wrestle-right",
      "wrestle-center",
      "slap-apart",    // Hands separate
      "slap-together", // SLAP! Hands meet
      "slap-apart",    // Brief separation
      "slap-together", // Second slap
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      setPhase(sequence[index]);
      index = (index + 1) % sequence.length;
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Calculate transformations based on phase
  const isSlap = phase.startsWith("slap");
  const isWrestling = phase.startsWith("wrestle");
  
  // Wrestling rotation
  const wrestleRotation = phase === "wrestle-left" ? -20 : phase === "wrestle-right" ? 20 : 0;
  
  // Palm slap positions
  const leftHandX = phase === "slap-apart" ? -8 : 0;
  const rightHandX = phase === "slap-apart" ? 8 : 0;
  const slapScale = phase === "slap-together" ? 1.1 : 1;

  return (
    <div 
      aria-hidden 
      className={className} 
      style={{ display: "inline-block", lineHeight: 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={isSlap ? "High five!" : "Negotiating..."}
      >
        <defs>
          <linearGradient id="skin-warm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C4A0" />
            <stop offset="100%" stopColor="#D4A574" />
          </linearGradient>
          <linearGradient id="skin-tan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A87C" />
            <stop offset="100%" stopColor="#B8956E" />
          </linearGradient>
          <linearGradient id="sleeve-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6B7F5C" />
            <stop offset="100%" stopColor="#8B9B6E" />
          </linearGradient>
          <linearGradient id="sleeve-blue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2C5F6F" />
            <stop offset="100%" stopColor="#3A7A8A" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {isWrestling ? (
          /* ARM WRESTLING MODE */
          <motion.g 
            filter="url(#shadow)"
            animate={{ rotate: wrestleRotation }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ transformOrigin: "32px 28px" }}
          >
            {/* Table/surface */}
            <rect x="10" y="42" width="44" height="4" rx="2" fill="#4A3D2C" />
            
            {/* Left arm with sleeve (green) */}
            <path d="M 4 36 L 16 32 L 18 38 L 6 42 Z" fill="url(#sleeve-green)" />
            <path d="M 16 28 L 28 24 Q 30 26 28 30 L 18 34 Q 14 32 16 28" fill="url(#skin-warm)" />
            
            {/* Right arm with sleeve (blue) */}
            <path d="M 60 36 L 48 32 L 46 38 L 58 42 Z" fill="url(#sleeve-blue)" />
            <path d="M 48 28 L 36 24 Q 34 26 36 30 L 46 34 Q 50 32 48 28" fill="url(#skin-tan)" />
            
            {/* Locked hands in center */}
            <ellipse cx="32" cy="26" rx="8" ry="6" fill="url(#skin-warm)" />
            <path d="M 26 24 Q 32 20 38 24" stroke="url(#skin-tan)" strokeWidth="3" fill="none" />
            
            {/* Finger details */}
            <path d="M 28 22 L 28 20" stroke="#B8956E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 32 21 L 32 19" stroke="#B8956E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 36 22 L 36 20" stroke="#B8956E" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Strain lines (shows effort!) */}
            <path d="M 20 18 L 22 16" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
            <path d="M 44 18 L 42 16" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
          </motion.g>
        ) : (
          /* PALM SLAP MODE - Bro greeting! */
          <g filter="url(#shadow)">
            {/* Left hand coming from left */}
            <motion.g
              animate={{ x: leftHandX, scale: slapScale }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <path d="M 2 32 L 14 28 L 16 34 L 4 38 Z" fill="url(#sleeve-green)" />
              <path 
                d="M 14 24 L 28 22 Q 32 24 30 28 L 16 32 Q 12 30 14 24" 
                fill="url(#skin-warm)" 
              />
              {/* Open palm fingers */}
              <path d="M 26 20 L 30 18" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" />
              <path d="M 28 22 L 32 20" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" />
              <path d="M 28 24 L 32 23" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" />
              <path d="M 27 26 L 30 26" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
            
            {/* Right hand coming from right */}
            <motion.g
              animate={{ x: rightHandX, scale: slapScale }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <path d="M 62 32 L 50 28 L 48 34 L 60 38 Z" fill="url(#sleeve-blue)" />
              <path 
                d="M 50 24 L 36 22 Q 32 24 34 28 L 48 32 Q 52 30 50 24" 
                fill="url(#skin-tan)" 
              />
              {/* Open palm fingers */}
              <path d="M 38 20 L 34 18" stroke="#B8956E" strokeWidth="2" strokeLinecap="round" />
              <path d="M 36 22 L 32 20" stroke="#B8956E" strokeWidth="2" strokeLinecap="round" />
              <path d="M 36 24 L 32 23" stroke="#B8956E" strokeWidth="2" strokeLinecap="round" />
              <path d="M 37 26 L 34 26" stroke="#B8956E" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
            
            {/* SLAP effect - impact burst! */}
            {phase === "slap-together" && mounted && (
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.1 }}
              >
                {/* Impact star burst */}
                <circle cx="32" cy="26" r="4" fill="#FFD700" opacity="0.8" />
                <path d="M 32 18 L 32 14" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                <path d="M 38 20 L 42 16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                <path d="M 26 20 L 22 16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                <path d="M 40 26 L 44 26" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                <path d="M 24 26 L 20 26" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
              </motion.g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
