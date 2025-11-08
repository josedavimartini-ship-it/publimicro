"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Heart, Trash2, Search } from "lucide-react";
import { PropertyCard } from "@publimicro/ui";

export default function FavoritesPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/entrar');
      return;
    }
    setUser(user);
    fetchFavorites(user.id);
  };

  const fetchFavorites = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_favorites')
        .select(`
          id,
          created_at,
          property:properties (
            id,
            title,
            description,
            property_type,
            transaction_type,
            price,
            bedrooms,
            bathrooms,
            parking_spaces,
            total_area,
            city,
            state,
            country,
            slug,
            featured,
            property_photos (url, is_cover)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('property_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      // Update local state
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleFazerProposta = (propertyId: string) => {
    // Check visit status and redirect accordingly
    router.push(`/property/${propertyId}#fazer-proposta`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#B87333] via-[#DAA520] to-[#FFD700] bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <Heart className="w-10 h-10 text-[#B87333] fill-[#B87333]" />
            My Favorites
          </h1>
          <p className="text-[#d8c68e] text-lg">
            Properties you've saved for later
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#B87333] border-t-transparent"></div>
            <p className="mt-4 text-[#d8c68e]">Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-[#676767] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#d8c68e] mb-3">No favorites yet</h2>
            <p className="text-[#676767] mb-8 max-w-md mx-auto">
              Start exploring properties and add them to your favorites by clicking the heart icon
            </p>
            <button
              onClick={() => router.push('/search')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B87333] to-[#DAA520] hover:from-[#DAA520] hover:to-[#FFD700] text-white font-bold rounded-lg transition-all"
            >
              <Search className="w-5 h-5" />
              Browse Properties
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-[#d8c68e]">
                <span className="font-bold text-[#B87333]">{favorites.length}</span> 
                {favorites.length === 1 ? ' property' : ' properties'} saved
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="relative">
                  <PropertyCard
                    id={favorite.property.id}
                    title={favorite.property.title}
                    description={favorite.property.description}
                    price={favorite.property.price}
                    featured={favorite.property.featured}
                    location={{
                      city: favorite.property.city,
                      state: favorite.property.state,
                      neighborhood: undefined
                    }}
                    area={{
                      total: favorite.property.total_area || 0
                    }}
                    features={{
                      bedrooms: favorite.property.bedrooms,
                      bathrooms: favorite.property.bathrooms,
                      parking: favorite.property.parking_spaces
                    }}
                    photos={favorite.property.property_photos?.map((p: any) => p.url) || []}
                    link={`/property/${favorite.property.slug}`}
                    type="property"
                  />
                  
                  {/* Remove button overlay */}
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="absolute top-4 left-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition z-20 shadow-lg"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
