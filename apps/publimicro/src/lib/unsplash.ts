import { createApi } from 'unsplash-js';

// Initialize Unsplash API with fallback
const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';
const unsplash = accessKey ? createApi({ accessKey }) : null;

// Category-specific search queries for optimal image results
export const CATEGORY_QUERIES = {
  motors: 'luxury cars sports vehicles automobile',
  marine: 'boats yachts sailing ocean water',
  machina: 'heavy machinery equipment industrial construction',
  proper: 'modern architecture houses real estate buildings',
  share: 'collaboration teamwork community sharing',
  journey: 'travel wanderlust destinations landscape adventure',
  global: 'world globe international business skyline',
  tudo: 'marketplace shopping colorful products variety',
} as const;

export type CategoryKey = keyof typeof CATEGORY_QUERIES;

// Fallback images from Unsplash (direct URLs that don't require API key)
const FALLBACK_IMAGES: Record<CategoryKey, string> = {
  motors: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
  marine: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80',
  machina: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
  proper: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
  share: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
  journey: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  global: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80',
  tudo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
};

/**
 * Fetch a random landscape image from Unsplash for a specific category
 * @param category - The category key (motors, marine, etc.)
 * @returns Image URL or fallback image if API unavailable
 */
export async function getRandomCategoryImage(category: CategoryKey): Promise<string | null> {
  // If no API key, return fallback immediately
  if (!unsplash) {
    console.log(`Using fallback image for ${category} (no API key configured)`);
    return FALLBACK_IMAGES[category];
  }

  try {
    const query = CATEGORY_QUERIES[category];
    
    const result = await unsplash.photos.getRandom({
      query,
      orientation: 'landscape',
      count: 1,
    });

    if (result.type === 'success' && result.response) {
      const photo = Array.isArray(result.response) ? result.response[0] : result.response;
      return photo.urls.regular;
    }

    // If API call fails, return fallback
    console.log(`Using fallback image for ${category} (API call failed)`);
    return FALLBACK_IMAGES[category];
  } catch (error) {
    console.error(`Error fetching Unsplash image for ${category}:`, error);
    return FALLBACK_IMAGES[category];
  }
}

/**
 * Fetch multiple random images for all categories at once
 * Useful for preloading section images
 */
export async function getAllCategoryImages(): Promise<Record<CategoryKey, string | null>> {
  const categories = Object.keys(CATEGORY_QUERIES) as CategoryKey[];
  
  const imagePromises = categories.map(async (category) => ({
    category,
    url: await getRandomCategoryImage(category),
  }));

  const results = await Promise.all(imagePromises);
  
  return results.reduce((acc, { category, url }) => {
    acc[category] = url;
    return acc;
  }, {} as Record<CategoryKey, string | null>);
}

/**
 * Track Unsplash download (required by API guidelines)
 * Call this when an image is actually displayed to the user
 */
export async function trackDownload(downloadLocation: string): Promise<void> {
  try {
    // The download location is provided in the photo response
    if (downloadLocation) {
      await fetch(downloadLocation);
    }
  } catch (error) {
    console.error('Error tracking Unsplash download:', error);
  }
}
