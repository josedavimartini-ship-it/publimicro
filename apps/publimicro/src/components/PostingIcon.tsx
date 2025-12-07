"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface PostingIconProps {
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function PostingIcon({ 
  href = '/postar',
  onClick,
  size = 'md',
  showLabel = true,
  className = ''
}: PostingIconProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'insert' | 'glow' | 'complete'>('idle');

  const sizeConfig = {
    sm: { container: 'w-12 h-12', icon: 'w-10 h-10', text: 'text-xs' },
    md: { container: 'w-16 h-16', icon: 'w-14 h-14', text: 'text-sm' },
    lg: { container: 'w-20 h-20', icon: 'w-18 h-18', text: 'text-base' }
  };

  // Animation cycle every 5 seconds
  useEffect(() => {
    const animationCycle = () => {
      setIsAnimating(true);
      setPhase('insert');
      
      setTimeout(() => setPhase('glow'), 800);
      setTimeout(() => setPhase('complete'), 1400);
      setTimeout(() => {
        setPhase('idle');
        setIsAnimating(false);
      }, 2000);
    };

    // Start first animation after 2 seconds
    const initialTimeout = setTimeout(animationCycle, 2000);
    
    // Then repeat every 6 seconds
    const interval = setInterval(animationCycle, 6000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const content = (
    <motion.div
      className={`flex flex-col items-center justify-center gap-1 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Mailbox with Banner Animation */}
      <div className={`relative ${sizeConfig[size].icon}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mailboxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B6914" />
              <stop offset="50%" stopColor="#A67C1A" />
              <stop offset="100%" stopColor="#6B5210" />
            </linearGradient>
            <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#F0D060" />
              <stop offset="100%" stopColor="#B8962A" />
            </linearGradient>
            <filter id="glowEffect">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="spotlightGlow">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          {/* Mailbox Post */}
          <rect x="45" y="55" width="10" height="40" fill="#4A3A1A" rx="2" />
          
          {/* Mailbox Body */}
          <motion.g>
            {/* Main box */}
            <rect x="15" y="30" width="70" height="35" rx="5" fill="url(#mailboxGradient)" />
            
            {/* Rounded top */}
            <path 
              d="M15 45 Q15 30 50 25 Q85 30 85 45" 
              fill="url(#mailboxGradient)"
            />
            
            {/* Opening slot */}
            <rect x="25" y="38" width="50" height="8" rx="2" fill="#2A2016" />
            
            {/* Flag */}
            <motion.g
              animate={phase === 'complete' ? { rotate: 45 } : { rotate: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              style={{ originX: '90px', originY: '45px' }}
            >
              <rect x="85" y="35" width="5" height="20" fill="#CD7F32" rx="1" />
              <path d="M90 35 L90 25 L80 30 L90 35" fill="#D4AF37" />
            </motion.g>
          </motion.g>

          {/* Animated Banner/Letter going into mailbox */}
          <AnimatePresence>
            {(phase === 'insert' || phase === 'glow') && (
              <motion.g
                initial={{ y: -50, opacity: 0 }}
                animate={{ 
                  y: phase === 'insert' ? 0 : 5,
                  opacity: 1,
                  scale: phase === 'glow' ? 0.8 : 1
                }}
                exit={{ y: 10, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Banner/Ad card */}
                <rect x="35" y="5" width="30" height="35" rx="3" fill="url(#bannerGradient)" />
                
                {/* Banner content lines */}
                <rect x="40" y="12" width="20" height="3" rx="1" fill="#5C4A1F" />
                <rect x="40" y="18" width="15" height="2" rx="1" fill="#5C4A1F" opacity="0.7" />
                <rect x="40" y="23" width="18" height="2" rx="1" fill="#5C4A1F" opacity="0.7" />
                
                {/* Star/highlight on banner */}
                <motion.path
                  d="M55 30 L56.5 33 L60 33.5 L57 36 L58 40 L55 38 L52 40 L53 36 L50 33.5 L53.5 33 Z"
                  fill="#FFFEF0"
                  animate={phase === 'glow' ? { 
                    scale: [1, 1.3, 1],
                    opacity: [1, 1, 0.8]
                  } : {}}
                  transition={{ duration: 0.4, repeat: 2 }}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Spotlight/Glow effect when banner enters */}
          <AnimatePresence>
            {phase === 'glow' && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Light rays */}
                <motion.ellipse 
                  cx="50" cy="42" rx="40" ry="15" 
                  fill="rgba(212, 175, 55, 0.3)"
                  filter="url(#spotlightGlow)"
                  animate={{ 
                    rx: [35, 45, 35],
                    ry: [12, 18, 12]
                  }}
                  transition={{ duration: 0.6, repeat: 1 }}
                />
                
                {/* Sparkles */}
                {[
                  { x: 20, y: 35, delay: 0 },
                  { x: 75, y: 40, delay: 0.1 },
                  { x: 30, y: 50, delay: 0.2 },
                  { x: 70, y: 55, delay: 0.15 }
                ].map((spark, i) => (
                  <motion.circle
                    key={i}
                    cx={spark.x}
                    cy={spark.y}
                    r="2"
                    fill="#F0D060"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: spark.delay,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Success checkmark when complete */}
          <AnimatePresence>
            {phase === 'complete' && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <circle cx="75" cy="20" r="12" fill="#6B8E23" />
                <path 
                  d="M69 20 L73 24 L81 16" 
                  stroke="#FFFEF0" 
                  strokeWidth="3" 
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Label */}
      {showLabel && (
        <motion.span 
          className={`font-bold ${sizeConfig[size].text} text-[#D4AF37]`}
          animate={phase === 'complete' ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          Postar
        </motion.span>
      )}
    </motion.div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none">
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className="focus:outline-none">
      {content}
    </Link>
  );
}
