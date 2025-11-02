"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface FavoritesButtonProps {
  propertyId: string;
  userId?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoritesButton({ propertyId, userId, size = 'md' }: FavoritesButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  useEffect(() => {
    if (!userId) return;

    async function checkFavorite() {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('property_id', propertyId)
        .eq('user_id', userId)
        .single();
      
      setIsFavorite(!!data);
    }

    checkFavorite();
  }, [propertyId, userId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert('Você precisa fazer login para adicionar favoritos!');
      window.location.href = '/entrar';
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('property_id', propertyId)
          .eq('user_id', userId);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ property_id: propertyId, user_id: userId });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
        isFavorite
          ? 'bg-[#A8C97F] text-[#0a0a0a] hover:bg-[#B7791F]'
          : 'bg-[#0a0a0a]/80 text-[#D4A574] hover:bg-[#A8C97F]/20 border-2 border-[#2a2a1a]'
      } ${loading ? 'opacity-50 cursor-wait' : 'hover:scale-110'}`}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={iconSizes[size]}
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
    </button>
  );
}
