"use client";
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

// Improved AnimatedHandshake: three readable visual states
// - arm-wrestle (two arms squaring off)
// - clap/slap (palms meet)
// - handshake (hands clasp -> small pulse)
// This file keeps the same export name so existing imports stay valid.
export function AnimatedHandshake({ size = 28, className = "" }: { size?: number; className?: string }) {
  const left = useAnimation();
  const right = useAnimation();
  const palms = useAnimation();
  const group = useAnimation();

  // Sequence: arm-wrestle -> clap -> handshake -> idle
  const seq = async () => {
    while (true) {
      // ARM-WRESTLE: dynamic rotations and small vertical movement
      await Promise.all([
        left.start({ rotate: [0, 18, 6, 0], y: [0, 6, 0, 0], transition: { duration: 1.2, ease: "easeInOut" } }),
        right.start({ rotate: [0, -12, -4, 0], y: [0, -4, 0, 0], transition: { duration: 1.2, ease: "easeInOut" } }),
        group.start({ scale: [1, 1.02, 1], transition: { duration: 1.2 } }),
      ]);

      // quick recovery and mutual hold
      await Promise.all([
        left.start({ rotate: [6, -8, 0], y: [0, -6, 0], transition: { duration: 1.1, ease: "easeInOut" } }),
        right.start({ rotate: [-4, 14, 0], y: [0, 6, 0], transition: { duration: 1.1, ease: "easeInOut" } }),
      ]);

      // TRANSITION -> palms visible (clap)
      await Promise.all([
        palms.start({ opacity: 1, scale: 1, transition: { duration: 0.35 } }),
        left.start({ opacity: 0.6, transition: { duration: 0.35 } }),
        right.start({ opacity: 0.6, transition: { duration: 0.35 } }),
      ]);

      // CLAP: sequence of three quick meets
      await palms.start({ x: [0, -6, 0, 6, 0], rotate: [0, -8, 0, 8, 0], scale: [1, 1.06, 0.98, 1.02, 1], transition: { duration: 1.0, ease: "easeInOut" } });

      // HANDSHAKE: hide palms, bring clasp visual to center with pulse
      await Promise.all([
        palms.start({ opacity: 0, transition: { duration: 0.3 } }),
        left.start({ opacity: 1, rotate: 0, y: 0, transition: { duration: 0.4 } }),
        right.start({ opacity: 1, rotate: 0, y: 0, transition: { duration: 0.4 } }),
      ]);

      // Small handshake pulse (center)
      await group.start({ handshakePulse: [1, 1.08, 1], transition: { duration: 0.9, ease: "easeInOut" } } as any);

      // Idle pause
      await group.start({ scale: [1, 1.01, 1], transition: { duration: 1.2 } });
    }
  };

  useEffect(() => {
    // Respect prefers-reduced-motion: skip the sequence for users who opt out
    const prefersReduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) {
      // Set a neutral static pose
      left.set({ rotate: 0, y: 0, opacity: 1 });
      right.set({ rotate: 0, y: 0, opacity: 1 });
      palms.set({ opacity: 0 });
      group.set({ scale: 1 });
      return;
    }

    seq().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div aria-hidden className={className} style={{ display: "inline-block", lineHeight: 0 }}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Agreement animation: arm wrestle, clap, handshake"
        animate={group}
        style={{ originX: "50%", originY: "50%" }}
      >
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

        {/* LEFT ARM (arm-wrestle / handshake) */}
        <motion.g filter="url(#shadow2)" style={{ originX: "32px", originY: "32px" }}>
          <motion.path
            d="M12 36 C18 28, 26 24, 32 24"
            stroke="url(#acheme-left)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={left}
            style={{ originX: "32px", originY: "32px" }}
          />

          <motion.path
            d="M20 40 C24 42, 28 44, 32 44"
            stroke="#98763a"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={left}
            style={{ originX: "32px", originY: "32px" }}
          />
        </motion.g>

        {/* RIGHT ARM */}
        <motion.g style={{ originX: "32px", originY: "32px" }}>
          <motion.path
            d="M52 36 C46 28, 38 24, 32 24"
            stroke="url(#acheme-right)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={right}
            style={{ originX: "32px", originY: "32px" }}
          />

          <motion.path
            d="M44 40 C40 42, 36 44, 32 44"
            stroke="#6a8a2a"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={right}
            style={{ originX: "32px", originY: "32px" }}
          />
        </motion.g>

        {/* CENTER CLASP / PULSE for handshake */}
        <motion.g animate={group} style={{ originX: "32px", originY: "32px" }}>
          <motion.circle cx="32" cy="32" r="3.2" fill="#fff" opacity={0.95} animate={{ scale: [1, 1.06, 1], transition: { duration: 0.9 } }} />
        </motion.g>

        {/* PALMS / CLAP - hidden until clap phase */}
        <motion.g initial={{ opacity: 0 }} animate={palms} style={{ originX: "32px", originY: "32px" }}>
          <motion.path d="M18 22 C22 20, 26 20, 28 26 C29 29, 24 34, 20 36" fill="#f7e8d0" stroke="#d4b27a" strokeWidth={0.8} />
          <motion.path d="M46 22 C42 20, 38 20, 36 26 C35 29, 40 34, 44 36" fill="#f1f1e8" stroke="#c3d29a" strokeWidth={0.8} />
        </motion.g>
      </motion.svg>
    </div>
  );
}
