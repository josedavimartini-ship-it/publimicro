"use client";
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

// AnimatedHandshake is now a richer arm-wrestle → slap sequence.
// It keeps the same exported name so existing imports (TopNavWithAuth) stay the same.
export function AnimatedHandshake({ size = 28, className = "" }: { size?: number; className?: string }) {
  const controls = useAnimation();

  // Sequence timings (in seconds)
  const seq = async () => {
    // Repeating cycle: arm-wrestle (3 phases) -> transition -> slaps -> idle -> repeat
    while (true) {
      // 1) Arm-wrestle: left nearly wins
      await controls.start({ leftArm: { rotate: [0, 18, 6], y: [0, 6, 0] }, rightArm: { rotate: [0, -12, -4], y: [0, -4, 0] }, transition: { duration: 1.2, ease: "easeInOut" } });
      // 2) Opposite recovers
      await controls.start({ leftArm: { rotate: [6, -8, 0], y: [0, -6, 0] }, rightArm: { rotate: [-4, 14, 0], y: [0, 6, 0] }, transition: { duration: 1.2, ease: "easeInOut" } });
      // 3) Both hold center and pulse
      await controls.start({ leftArm: { rotate: [0, 6, -6, 0], y: [0, -2, 2, 0] }, rightArm: { rotate: [0, -6, 6, 0], y: [0, 2, -2, 0] }, transition: { duration: 1.4, ease: "easeInOut" } });

      // Quick pause
      await controls.start({ leftArm: { rotate: 0, y: 0 }, rightArm: { rotate: 0, y: 0 }, transition: { duration: 0.25 } });

      // Transition fade into slapping hands (scale/hide arms, show palms)
      await controls.start({ armsOpacity: 0, palmsOpacity: 1, transition: { duration: 0.5 } });

      // Slap sequence (3 slaps with squeezing/shake)
      await controls.start({ palms: { x: [0, -6, 0, 6, 0], scale: [1, 1.05, 0.98, 1.02, 1], rotate: [0, -6, 0, 6, 0] }, transition: { duration: 1.2, ease: "easeInOut" } });
      await controls.start({ palms: { x: [0, -4, 0], scale: [1, 1.02, 1], rotate: [0, -4, 0] }, transition: { duration: 0.8, ease: "easeInOut" } });

      // Squeeze+shake: small horizontal oscillation
      await controls.start({ palms: { x: [0, -3, 3, -2, 2, 0], rotate: [0, -2, 2, -1, 1, 0], transition: { duration: 1.0, ease: "easeInOut" } } });

      // Return to arms visible
      await controls.start({ armsOpacity: 1, palmsOpacity: 0, transition: { duration: 0.4 } });

      // Short idle between cycles
      await controls.start({ idlePulse: { scale: [1, 1.03, 1], opacity: [1, 0.98, 1] }, transition: { duration: 1.2 } });
    }
  };

  useEffect(() => {
    // kick off sequence once mounted
    seq().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Visual: stylized arms and palms within a compact SVG, using gradients consistent with brand
  return (
    <div aria-hidden className={className} style={{ display: "inline-block", lineHeight: 0 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chat arm wrestle">
        <defs>
          <linearGradient id="acheme-left" x1="0" x2="1">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#CD7F32" />
          </linearGradient>
          <linearGradient id="acheme-right" x1="0" x2="1">
            <stop offset="0%" stopColor="#A8C97F" />
            <stop offset="100%" stopColor="#6B8E23" />
          </linearGradient>
          <filter id="shadow2" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Arms group (arm-wrestle) */}
        <motion.g filter="url(#shadow2)" animate={controls} initial={{ opacity: 1 }} style={{ originX: "50%", originY: "50%" }}>
          <motion.path
            // left upper arm
            d="M12 36 C18 28, 26 24, 32 24"
            stroke="url(#acheme-left)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          <motion.path
            // left forearm to hand (clasp)
            d="M20 40 C24 42, 28 44, 32 44"
            stroke="#98763a"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          <motion.path
            // right upper arm
            d="M52 36 C46 28, 38 24, 32 24"
            stroke="url(#acheme-right)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          <motion.path
            // right forearm to hand
            d="M44 40 C40 42, 36 44, 32 44"
            stroke="#6a8a2a"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* center clasp / pulse */}
          <motion.circle cx="32" cy="32" r="3" fill="#FFF" opacity={0.9} animate={controls} />
        </motion.g>

        {/* Palms/slap group - initially hidden then animated in sequence */}
        <motion.g animate={controls} initial={{ opacity: 0 }}>
          <motion.rect x="18" y="22" width="10" height="18" rx="4" ry="4" fill="#f7e8d0" stroke="#d4b27a" strokeWidth={0.8} />
          <motion.rect x="36" y="22" width="10" height="18" rx="4" ry="4" fill="#f1f1e8" stroke="#c3d29a" strokeWidth={0.8} />
          {/* slap motion is driven by controls (palms keyframes) */}
        </motion.g>
      </svg>
    </div>
  );
}
