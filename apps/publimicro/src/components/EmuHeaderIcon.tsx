"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function EmuHeaderIcon({ className = "w-7 h-7" }: { className?: string }) {
  const [isShining, setIsShining] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function schedule() {
      const delay = 3000 + Math.random() * 2000;
      timerRef.current = window.setTimeout(() => {
        setIsShining(true);
        window.setTimeout(() => setIsShining(false), 600);
        schedule();
      }, delay);
    }
    schedule();
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="emuSmall" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="50%" stopColor="#C9A87C" />
            <stop offset="100%" stopColor="#6B5A45" />
          </linearGradient>
          <filter id="glow-small"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <ellipse cx="50" cy="42" rx="26" ry="28" fill="url(#emuSmall)" />
        <path d="M35 67 Q50 82 65 67 L62 84 Q50 90 38 84 Z" fill="#6B5A45" />
        <path d="M42 50 Q50 45 58 50 L55 64 Q50 68 45 64 Z" fill="#2A2016" />
        {/* Eyes */}
        <circle cx="40" cy="42" r="6" fill="#0a0a0a" />
        <circle cx="40" cy="42" r="4" fill="var(--text-primary)" />
        <circle cx="40" cy="42" r="2" fill="#1a1a1a" />

        <circle cx="60" cy="42" r="6" fill="#0a0a0a" />
        <circle cx="60" cy="42" r="4" fill="var(--text-primary)" />
        <circle cx="60" cy="42" r="2" fill="#1a1a1a" />

        {/* Feather tufts */}
        <g fill="#5C4A1F">
          <ellipse cx="36" cy="24" rx="2" ry="7" transform="rotate(-15 36 24)" />
          <ellipse cx="50" cy="20" rx="2" ry="8" />
          <ellipse cx="64" cy="24" rx="2" ry="7" transform="rotate(15 64 24)" />
        </g>

        {/* Starry shine groups - controlled via motion */}
        <motion.g
          animate={isShining ? { opacity: [0,1,1,0], scale: [0.6,1.2,1.2,0.6] } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          filter="url(#glow-small)"
        >
          <path d="M40 30 L41 36 L46 38 L41 40 L40 46 L39 40 L34 38 L39 36 Z" fill="var(--text-primary)" />
          <path d="M60 30 L61 36 L66 38 L61 40 L60 46 L59 40 L54 38 L59 36 Z" fill="var(--text-primary)" />
        </motion.g>
      </svg>
    </div>
  );
}
