import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface FavoritesButtonProps {
  propertyId: string;
  userId: string;
}

export default function FavoritesButton({ propertyId, userId }: FavoritesButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async () => {
    setLoading(true);
    if (isFavorite) {
      await supabase.from('favorites').delete().eq('property_id', propertyId).eq('user_id', userId);
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert({ property_id: propertyId, user_id: userId });
      setIsFavorite(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`px-4 py-2 rounded-full border-2 ${isFavorite ? 'border-yellow-400 bg-yellow-100 text-yellow-700' : 'border-gray-400 bg-gray-100 text-gray-700'} transition`}
    >
      {isFavorite ? 'Favorito' : 'Favoritar'}
    </button>
  );
}
