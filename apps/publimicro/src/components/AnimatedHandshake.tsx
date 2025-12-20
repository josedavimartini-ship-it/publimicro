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
  const slapScale = phase === "slap-together" ? 1.12 : 1;

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
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {isWrestling ? (
          /* ARM WRESTLING MODE */
          <motion.g 
            filter="url(#shadow)"
            animate={{ rotate: wrestleRotation }}
            transition={{ duration: 0.36, ease: "easeInOut" }}
            style={{ transformOrigin: "32px 28px" }}
          >
            {/* Table/surface - slightly thicker */}
            <rect x="8" y="42" width="48" height="6" rx="3" fill="#3E2F21" />
            
            {/* Left arm with sleeve (green) - stronger silhouette */}
            <path d="M 3 36 L 18 30 L 20 38 L 6 44 Z" fill="url(#sleeve-green)" stroke="#2b2b2b" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M 18 26 L 30 20 Q 33 24 30 30 L 18 34 Q 13 31 18 26" fill="url(#skin-warm)" stroke="#886a4f" strokeWidth="1" strokeLinejoin="round" />
            
            {/* Right arm with sleeve (blue) - stronger silhouette */}
            <path d="M 61 36 L 46 30 L 44 38 L 58 44 Z" fill="url(#sleeve-blue)" stroke="#1f3b42" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M 46 26 L 34 20 Q 31 24 34 30 L 46 34 Q 51 31 46 26" fill="url(#skin-tan)" stroke="#8c6f56" strokeWidth="1" strokeLinejoin="round" />
            
            {/* Locked hands in center - larger and bolder */}
            <ellipse cx="32" cy="26" rx="10" ry="7" fill="url(#skin-warm)" stroke="#b8956e" strokeWidth="1.2" />
            <path d="M 24 23 Q 32 18 40 23" stroke="#b8956e" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Finger details - slightly bolder */}
            <path d="M 28 22 L 28 19" stroke="#B8956E" strokeWidth="2" strokeLinecap="round" />
            <path d="M 32 21 L 32 18" stroke="#B8956E" strokeWidth="2" strokeLinecap="round" />
            <path d="M 36 22 L 36 19" stroke="#B8956E" strokeWidth="2" strokeLinecap="round" />
            
            {/* Strain lines (shows effort!) - bolder */}
            <path d="M 18 16 L 22 12" stroke="#D4AF37" strokeWidth="1.2" opacity="0.85" strokeLinecap="round" />
            <path d="M 46 16 L 42 12" stroke="#D4AF37" strokeWidth="1.2" opacity="0.85" strokeLinecap="round" />
          </motion.g>
        ) : (
          /* PALM SLAP MODE - Bro greeting! */
          <g filter="url(#shadow)">
            {/* Left hand coming from left - thicker */}
            <motion.g
              animate={{ x: leftHandX, scale: slapScale }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              <path d="M 2 32 L 16 26 L 18 36 L 4 40 Z" fill="url(#sleeve-green)" stroke="#2b2b2b" strokeWidth="1.4" strokeLinejoin="round" />
              <path 
                d="M 16 22 L 30 18 Q 34 22 32 28 L 16 34 Q 12 28 16 22" 
                fill="url(#skin-warm)" stroke="#a07b5a" strokeWidth="0.9" strokeLinejoin="round" 
              />
              {/* Open palm fingers - bolder strokes */}
              <path d="M 26 20 L 30 16" stroke="#D4A574" strokeWidth="3" strokeLinecap="round" />
              <path d="M 28 22 L 32 18" stroke="#D4A574" strokeWidth="3" strokeLinecap="round" />
              <path d="M 28 24 L 32 22" stroke="#D4A574" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 27 26 L 30 26" stroke="#D4A574" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>
            
            {/* Right hand coming from right - thicker */}
            <motion.g
              animate={{ x: rightHandX, scale: slapScale }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              <path d="M 62 32 L 48 26 L 46 36 L 60 40 Z" fill="url(#sleeve-blue)" stroke="#1f3b42" strokeWidth="1.4" strokeLinejoin="round" />
              <path 
                d="M 48 22 L 34 18 Q 30 22 32 28 L 48 34 Q 52 28 48 22" 
                fill="url(#skin-tan)" stroke="#8b6b53" strokeWidth="0.9" strokeLinejoin="round" 
              />
              {/* Open palm fingers - bolder strokes */}
              <path d="M 38 20 L 34 16" stroke="#B8956E" strokeWidth="3" strokeLinecap="round" />
              <path d="M 36 22 L 32 18" stroke="#B8956E" strokeWidth="3" strokeLinecap="round" />
              <path d="M 36 24 L 32 22" stroke="#B8956E" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 37 26 L 34 26" stroke="#B8956E" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>
            
            {/* SLAP effect - impact burst! */}
            {phase === "slap-together" && mounted && (
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.25 }}
                transition={{ duration: 0.09 }}
              >
                {/* Impact star burst */}
                <circle cx="32" cy="26" r="4.5" fill="#FFD700" opacity="0.9" />
                <path d="M 32 18 L 32 14" stroke="#FFD700" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 38 20 L 42 16" stroke="#FFD700" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 26 20 L 22 16" stroke="#FFD700" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 40 26 L 44 26" stroke="#FFD700" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 24 26 L 20 26" stroke="#FFD700" strokeWidth="2.2" strokeLinecap="round" />
              </motion.g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
