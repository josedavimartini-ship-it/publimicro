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
        .from('property_favorites')
        .select('id')
        .eq('property_id', propertyId)
        .eq('user_id', userId)
        .single();
      
      setIsFavorite(!!data);
    }

    void checkFavorite();
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
          .from('property_favorites')
          .delete()
          .eq('property_id', propertyId)
          .eq('user_id', userId);
        setIsFavorite(false);
      } else {
        await supabase
          .from('property_favorites')
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
          ? 'bg-[#6B7F5C] text-[#D4C4A8] hover:bg-[#7A8F6B]'
          : 'bg-[#0a0a0a]/80 text-[#C9A87C] hover:bg-[#6B7F5C]/20 border-2 border-[#2a2a1a]'
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





















