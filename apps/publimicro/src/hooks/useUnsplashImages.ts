import { useState, useEffect } from 'react';
import { getRandomCategoryImage, CategoryKey } from '@/lib/unsplash';

/**
 * Hook to fetch and cache Unsplash images for categories
 * Returns a record of category keys to image URLs
 */
export function useUnsplashImages() {
  const [images, setImages] = useState<Record<CategoryKey, string>>({
    motors: '',
    marine: '',
    machina: '',
    proper: '',
    share: '',
    journey: '',
    global: '',
    tudo: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true);
        
        // Fetch images for all categories
        const categories: CategoryKey[] = ['motors', 'marine', 'machina', 'proper', 'share', 'journey', 'global', 'tudo'];
        
        const imagePromises = categories.map(async (category) => {
          const url = await getRandomCategoryImage(category);
          return { category, url: url || '' };
        });

        const results = await Promise.all(imagePromises);
        
        const newImages = results.reduce((acc, { category, url }) => {
          acc[category] = url;
          return acc;
        }, {} as Record<CategoryKey, string>);

        setImages(newImages);
        setError(null);
      } catch (err) {
        console.error('Error loading Unsplash images:', err);
        setError('Failed to load images');
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  return { images, loading, error };
}
