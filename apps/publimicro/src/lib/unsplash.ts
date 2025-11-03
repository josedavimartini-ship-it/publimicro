import { createApi } from 'unsplash-js';

// Initialize Unsplash API
const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
});

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

/**
 * Fetch a random landscape image from Unsplash for a specific category
 * @param category - The category key (motors, marine, etc.)
 * @returns Image URL or null if error
 */
export async function getRandomCategoryImage(category: CategoryKey): Promise<string | null> {
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

    return null;
  } catch (error) {
    console.error(`Error fetching Unsplash image for ${category}:`, error);
    return null;
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
