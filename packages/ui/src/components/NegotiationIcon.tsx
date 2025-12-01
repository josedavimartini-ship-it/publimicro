"use client";

import { useState, useEffect } from "react";

interface NegotiationIconProps {
  size?: number;
  className?: string;
  /** Animation state: 'wrestling' (back and forth), 'deal' (handshake), 'auto' (cycles through) */
  state?: "wrestling" | "deal" | "auto";
}

/**
 * Negotiation Icon - Animated Arm Wrestling / Handshake
 * 
 * Shows arms in arm wrestling position, balanced, sometimes leaning to one side,
 * sometimes to the other. After a while, transitions to a handshake signaling
 * agreement - deal closed!
 */
export function NegotiationIcon({ size = 32, className = "", state = "auto" }: NegotiationIconProps) {
  const [phase, setPhase] = useState<"left" | "center" | "right" | "deal">("center");
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (state !== "auto") {
      setPhase(state === "deal" ? "deal" : "center");
      return;
    }

    // Arm wrestling animation sequence
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

    // Initial position
    animate();

    // Cycle through positions
    const interval = setInterval(animate, 1500);

    return () => clearInterval(interval);
  }, [state]);

  // Calculate rotation based on phase
  const getRotation = () => {
    switch (phase) {
      case "left": return -15;
      case "right": return 15;
      case "deal": return 0;
      default: return 0;
    }
  };

  const isDeal = phase === "deal";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={isDeal ? "Deal closed - handshake" : "Negotiation in progress"}
    >
      <defs>
        {/* Skin tones */}
        <linearGradient id="skinTone1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C4A0" />
          <stop offset="100%" stopColor="#D4A574" />
        </linearGradient>
        
        <linearGradient id="skinTone2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A87C" />
          <stop offset="100%" stopColor="#B8956E" />
        </linearGradient>

        {/* Sleeve colors */}
        <linearGradient id="sleeve1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B7F5C" />
          <stop offset="100%" stopColor="#8B9B6E" />
        </linearGradient>
        
        <linearGradient id="sleeve2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2C5F6F" />
          <stop offset="100%" stopColor="#3A7A8A" />
        </linearGradient>

        {/* Gold sparkle */}
        <linearGradient id="sparkleGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>

        {/* Glow filter for deal */}
        <filter id="dealGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#FFD700" floodOpacity="0.5" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g 
        style={{ 
          transform: `rotate(${getRotation()}deg)`,
          transformOrigin: '24px 24px',
          transition: 'transform 0.5s ease-in-out'
        }}
      >
        {!isDeal ? (
          /* ARM WRESTLING MODE */
          <>
            {/* Left arm (coming from left) */}
            <g>
              {/* Sleeve */}
              <path
                d="M 2 28 L 12 26 L 14 30 L 4 32 Z"
                fill="url(#sleeve1)"
              />
              {/* Forearm */}
              <path
                d="M 12 24 L 22 22 Q 24 24, 22 26 L 12 28 Q 10 26, 12 24"
                fill="url(#skinTone1)"
              />
              {/* Hand */}
              <path
                d="M 20 21 L 26 20 Q 28 22, 28 25 Q 27 27, 24 27 L 20 26 Q 19 24, 20 21"
                fill="url(#skinTone1)"
              />
              {/* Fingers gripping */}
              <path d="M 24 20 Q 26 19, 27 21" stroke="#D4A574" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 25 22 Q 27 21, 28 23" stroke="#D4A574" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>

            {/* Right arm (coming from right) */}
            <g>
              {/* Sleeve */}
              <path
                d="M 46 28 L 36 26 L 34 30 L 44 32 Z"
                fill="url(#sleeve2)"
              />
              {/* Forearm */}
              <path
                d="M 36 24 L 26 22 Q 24 24, 26 26 L 36 28 Q 38 26, 36 24"
                fill="url(#skinTone2)"
              />
              {/* Hand */}
              <path
                d="M 28 21 L 22 20 Q 20 22, 20 25 Q 21 27, 24 27 L 28 26 Q 29 24, 28 21"
                fill="url(#skinTone2)"
              />
              {/* Fingers gripping */}
              <path d="M 24 20 Q 22 19, 21 21" stroke="#B8956E" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 23 22 Q 21 21, 20 23" stroke="#B8956E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>

            {/* Grip point - clasped hands center */}
            <circle cx="24" cy="23" r="4" fill="none" stroke="#C9A87C" strokeWidth="1" opacity="0.5" />

            {/* Table/surface */}
            <rect x="8" y="34" width="32" height="4" rx="1" fill="#4A3D2C" />
            <rect x="8" y="34" width="32" height="1" fill="#6B5A45" />

            {/* Elbow rests */}
            <ellipse cx="14" cy="34" rx="3" ry="2" fill="#5D4E37" />
            <ellipse cx="34" cy="34" rx="3" ry="2" fill="#5D4E37" />

            {/* Effort lines */}
            <g opacity="0.6">
              <path d="M 10 18 L 8 16" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 38 18 L 40 16" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 24 14 L 24 11" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </>
        ) : (
          /* HANDSHAKE MODE - Deal Closed! */
          <g filter="url(#dealGlow)">
            {/* Left sleeve */}
            <path
              d="M 4 24 L 14 22 L 16 28 L 6 30 Z"
              fill="url(#sleeve1)"
            />
            
            {/* Right sleeve */}
            <path
              d="M 44 24 L 34 22 L 32 28 L 42 30 Z"
              fill="url(#sleeve2)"
            />

            {/* Left hand */}
            <path
              d="M 14 20 L 24 18 Q 26 20, 25 24 L 16 26 Q 13 24, 14 20"
              fill="url(#skinTone1)"
            />
            
            {/* Right hand (on top, gripping) */}
            <path
              d="M 34 20 L 24 18 Q 22 20, 23 24 L 32 26 Q 35 24, 34 20"
              fill="url(#skinTone2)"
            />

            {/* Clasped fingers detail */}
            <path d="M 22 20 Q 24 18, 26 20" stroke="#C9A87C" strokeWidth="1.5" fill="none" />
            <path d="M 21 22 Q 24 21, 27 22" stroke="#B8956E" strokeWidth="1" fill="none" />
            <path d="M 22 24 Q 24 23, 26 24" stroke="#C9A87C" strokeWidth="1" fill="none" />

            {/* Thumbs */}
            <ellipse cx="20" cy="21" rx="2" ry="1.5" fill="#E8C4A0" />
            <ellipse cx="28" cy="21" rx="2" ry="1.5" fill="#C9A87C" />
          </g>
        )}
      </g>

      {/* Sparkles when deal is made */}
      {showSparkles && (
        <g className="animate-pulse">
          <path d="M 8 10 L 10 8 M 9 9 L 9 9" stroke="url(#sparkleGold)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 40 10 L 38 8 M 39 9 L 39 9" stroke="url(#sparkleGold)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 24 6 L 24 4" stroke="url(#sparkleGold)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 6 20 L 4 20" stroke="url(#sparkleGold)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 42 20 L 44 20" stroke="url(#sparkleGold)" strokeWidth="2" strokeLinecap="round" />
          
          {/* Star bursts */}
          <circle cx="12" cy="8" r="1" fill="#FFD700" />
          <circle cx="36" cy="8" r="1" fill="#FFD700" />
          <circle cx="24" cy="4" r="1.5" fill="#FFA500" />
        </g>
      )}

      {/* Deal badge when handshake */}
      {isDeal && (
        <g>
          <circle cx="24" cy="40" r="6" fill="#28A745" />
          <path d="M 20 40 L 23 43 L 28 37" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

/**
 * Simple static handshake icon for buttons/links
 */
export function HandshakeIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M 2 12 L 8 10 L 12 9 L 16 10 L 22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 8 10 L 8 14 L 12 16 L 16 14 L 16 10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/**
 * Animated handshake for chat/negotiation contexts
 */
export function AnimatedHandshake({ size = 28, className = "" }: { size?: number; className?: string }) {
  return <NegotiationIcon size={size} className={className} state="auto" />;
}

export default NegotiationIcon;
