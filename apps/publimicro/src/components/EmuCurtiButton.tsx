"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface EmuCurtiButtonProps {
  itemId: string;
  itemType: 'property' | 'listing' | 'vehicle' | 'post';
  userId?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function EmuCurtiButton({ 
  itemId, 
  itemType = 'property',
  userId, 
  size = 'md',
  showLabel = true,
  className = ''
}: EmuCurtiButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShining, setIsShining] = useState(false);
  const shineIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sizeConfig = {
    sm: { container: 'w-16 h-16', emu: 'w-10 h-10', text: 'text-xs' },
    md: { container: 'w-20 h-20', emu: 'w-14 h-14', text: 'text-sm' },
    lg: { container: 'w-24 h-24', emu: 'w-18 h-18', text: 'text-base' }
  };

  // Starry eyes shine effect every 3-5 seconds
  useEffect(() => {
    const startShineInterval = () => {
      const randomDelay = 3000 + Math.random() * 2000; // 3-5 seconds
      shineIntervalRef.current = setTimeout(() => {
        setIsShining(true);
        setTimeout(() => setIsShining(false), 600);
        startShineInterval();
      }, randomDelay);
    };

    startShineInterval();

    return () => {
      if (shineIntervalRef.current) {
        clearTimeout(shineIntervalRef.current);
      }
    };
  }, []);

  // Check if item is favorited
  useEffect(() => {
    if (!userId) return;

    async function checkFavorite() {
      const tableName = itemType === 'property' ? 'property_favorites' : 'listing_favorites';
      const idColumn = itemType === 'property' ? 'property_id' : 'listing_id';
      
      const { data } = await supabase
        .from(tableName)
        .select('id')
        .eq(idColumn, itemId)
        .eq('user_id', userId)
        .single();
      
      setIsFavorite(!!data);
    }

    void checkFavorite();
  }, [itemId, itemType, userId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      router.push(`/entrar?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);
    try {
      const tableName = itemType === 'property' ? 'property_favorites' : 'listing_favorites';
      const idColumn = itemType === 'property' ? 'property_id' : 'listing_id';

      if (isFavorite) {
        await supabase
          .from(tableName)
          .delete()
          .eq(idColumn, itemId)
          .eq('user_id', userId);
        setIsFavorite(false);
      } else {
        await supabase
          .from(tableName)
          .insert({ 
            [idColumn]: itemId, 
            user_id: userId,
            item_type: itemType,
            created_at: new Date().toISOString()
          });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`flex flex-col items-center justify-center gap-1 transition-all ${className} ${
        loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Curti - Adicionar aos favoritos'}
      title={isFavorite ? 'Remover dos favoritos' : 'Curti!'}
    >
      {/* Emu Head SVG */}
      <div className={`relative ${sizeConfig[size].emu}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Emu Head Shape */}
          <defs>
            <linearGradient id="emuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isFavorite ? "#8B6914" : "#5C4A1F"} />
              <stop offset="50%" stopColor={isFavorite ? "#A67C1A" : "#6B5A2E"} />
              <stop offset="100%" stopColor={isFavorite ? "#8B6914" : "#4A3A1A"} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Feathers/Fur texture on head */}
          <ellipse cx="50" cy="45" rx="28" ry="32" fill="url(#emuGradient)" />
          
          {/* Neck */}
          <path 
            d="M35 70 Q50 85 65 70 L60 90 Q50 95 40 90 Z" 
            fill="url(#emuGradient)"
          />
          
          {/* Beak */}
          <path 
            d="M42 55 Q50 50 58 55 L55 68 Q50 72 45 68 Z" 
            fill={isFavorite ? "#2C2416" : "#1A1510"}
          />
          
          {/* Beak highlight */}
          <path 
            d="M44 56 Q50 53 56 56" 
            stroke={isFavorite ? "#3D3220" : "#2A2018"}
            strokeWidth="1"
            fill="none"
          />

          {/* Left Eye */}
          <AnimatePresence>
            <motion.g>
              {/* Eye socket */}
              <circle cx="38" cy="38" r="8" fill="#1A1510" />
              
              {/* Eye white */}
              <circle cx="38" cy="38" r="6" fill="#FFFEF0" />
              
              {/* Iris */}
              <circle cx="38" cy="38" r="4" fill={isFavorite ? "#D4AF37" : "#4A3A1A"} />
              
              {/* Pupil */}
              <circle cx="38" cy="38" r="2" fill="#0A0A0A" />
              
              {/* Star shine effect */}
              <motion.g
                animate={isShining ? { 
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1.2, 0.5]
                } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                filter="url(#glow)"
              >
                <path
                  d="M38 30 L39 36 L45 38 L39 40 L38 46 L37 40 L31 38 L37 36 Z"
                  fill="#FFFEF0"
                />
                <circle cx="38" cy="38" r="3" fill="rgba(255,255,240,0.8)" />
              </motion.g>
            </motion.g>
          </AnimatePresence>

          {/* Right Eye */}
          <AnimatePresence>
            <motion.g>
              {/* Eye socket */}
              <circle cx="62" cy="38" r="8" fill="#1A1510" />
              
              {/* Eye white */}
              <circle cx="62" cy="38" r="6" fill="#FFFEF0" />
              
              {/* Iris */}
              <circle cx="62" cy="38" r="4" fill={isFavorite ? "#D4AF37" : "#4A3A1A"} />
              
              {/* Pupil */}
              <circle cx="62" cy="38" r="2" fill="#0A0A0A" />
              
              {/* Star shine effect */}
              <motion.g
                animate={isShining ? { 
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1.2, 0.5]
                } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                filter="url(#glow)"
              >
                <path
                  d="M62 30 L63 36 L69 38 L63 40 L62 46 L61 40 L55 38 L61 36 Z"
                  fill="#FFFEF0"
                />
                <circle cx="62" cy="38" r="3" fill="rgba(255,255,240,0.8)" />
              </motion.g>
            </motion.g>
          </AnimatePresence>

          {/* Feather tufts on top */}
          <g fill={isFavorite ? "#5C4A1F" : "#3A2A10"}>
            <ellipse cx="40" cy="18" rx="3" ry="8" transform="rotate(-15 40 18)" />
            <ellipse cx="50" cy="15" rx="3" ry="9" />
            <ellipse cx="60" cy="18" rx="3" ry="8" transform="rotate(15 60 18)" />
          </g>
        </svg>

        {/* Heart indicator when favorited */}
        <AnimatePresence>
          {isFavorite && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-[#0a0a0a]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label */}
      {showLabel && (
        <motion.span 
          className={`font-bold ${sizeConfig[size].text} ${
            isFavorite ? 'text-[#D4AF37]' : 'text-[#8B9B6E]'
          }`}
          animate={isFavorite ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {isFavorite ? 'Curti!' : 'Curti'}
        </motion.span>
      )}
    </motion.button>
  );
}
