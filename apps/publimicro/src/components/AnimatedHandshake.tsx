"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// Improved AnimatedHandshake: Professional handshake icon with subtle animation
// Shows two hands clasping with a gentle pulse animation
export function AnimatedHandshake({ size = 28, className = "" }: { size?: number; className?: string }) {
  const [mounted, setMounted] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    setMounted(true);
    
    // Respect prefers-reduced-motion
    const prefersReduce = typeof window !== "undefined" && 
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReduce) return;

    // Simple pulse animation loop
    const animate = async () => {
      while (true) {
        await controls.start({
          scale: [1, 1.05, 1],
          transition: { duration: 1.5, ease: "easeInOut" }
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };
    
    animate().catch(() => {});
  }, [controls]);

  // Always show static icon first, then animate after mount
  return (
    <div 
      aria-hidden 
      className={className} 
      style={{ display: "inline-block", lineHeight: 0 }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Handshake icon"
        animate={mounted ? controls : undefined}
        initial={{ scale: 1 }}
        style={{ originX: "50%", originY: "50%" }}
      >
        <defs>
          <linearGradient id="hand-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#CD7F32" />
          </linearGradient>
          <linearGradient id="hand-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A8C97F" />
            <stop offset="100%" stopColor="#6B8E23" />
          </linearGradient>
          <filter id="hand-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Left hand (gold/bronze) - coming from left side */}
        <g filter="url(#hand-shadow)">
          {/* Arm */}
          <path
            d="M8 38 L16 34 Q20 32 24 32 L28 32"
            stroke="url(#hand-gold)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Hand/fingers clasping */}
          <path
            d="M28 32 Q32 30 36 32 Q38 34 36 36 Q34 38 30 36 Q28 34 28 32"
            fill="url(#hand-gold)"
            stroke="#B8860B"
            strokeWidth="0.5"
          />
          {/* Thumb */}
          <circle cx="30" cy="30" r="2.5" fill="#D4AF37" stroke="#B8860B" strokeWidth="0.5" />
        </g>

        {/* Right hand (green) - coming from right side */}
        <g filter="url(#hand-shadow)">
          {/* Arm */}
          <path
            d="M56 38 L48 34 Q44 32 40 32 L36 32"
            stroke="url(#hand-green)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Hand/fingers clasping */}
          <path
            d="M36 32 Q32 30 28 32 Q26 34 28 36 Q30 38 34 36 Q36 34 36 32"
            fill="url(#hand-green)"
            stroke="#556B2F"
            strokeWidth="0.5"
          />
          {/* Thumb */}
          <circle cx="34" cy="30" r="2.5" fill="#A8C97F" stroke="#556B2F" strokeWidth="0.5" />
        </g>

        {/* Center clasp highlight */}
        <circle 
          cx="32" 
          cy="32" 
          r="3" 
          fill="white" 
          opacity="0.4"
        />
        
        {/* Connection point sparkle */}
        <motion.circle
          cx="32"
          cy="32"
          r="2"
          fill="white"
          opacity="0.8"
          animate={mounted ? {
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8]
          } : undefined}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    </div>
  );
}
