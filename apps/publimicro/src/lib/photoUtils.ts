/**
 * Photo URL utilities for Supabase Storage
 * Handles various photo path formats and provides fallback images
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 
  "https://irrzpwzyqcubhhjeuakc.supabase.co";

const FALLBACK_IMAGE = "/images/fallback-rancho.jpg";

/**
 * Convert a photo path (relative or absolute) to a full Supabase Storage URL
 * @param photoPath - Path to the photo (can be relative or absolute URL)
 * @returns Full URL to the photo or fallback image
 */
export function getPhotoUrl(photoPath: string | null | undefined): string {
  if (!photoPath) {
    return FALLBACK_IMAGE;
  }

  const trimmed = photoPath.trim();
  
  if (!trimmed) {
    return FALLBACK_IMAGE;
  }

  // Already a full URL (http:// or https://)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Relative path - construct full URL
  const cleanPath = trimmed.replace(/^\/+/, "");
  
  // Already includes storage path: "storage/v1/object/public/..."
  if (cleanPath.startsWith("storage/v1/object/public/")) {
    return `${SUPABASE_URL}/${cleanPath}`;
  }

  // Just storage path: "storage/..."
  if (cleanPath.startsWith("storage/")) {
    return `${SUPABASE_URL}/${cleanPath}`;
  }

  // Bucket path format: "imagens-sitios/photo.jpg" or "bucket-name/path/photo.jpg"
  if (cleanPath.includes("/")) {
    return `${SUPABASE_URL}/storage/v1/object/public/${cleanPath}`;
  }

  // Just filename - assume default bucket "imagens-sitios"
  return `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios/${cleanPath}`;
}

/**
 * Get the first photo from an array of photos
 * @param fotos - Array of photo paths
 * @returns URL to first photo or fallback image
 */
export function getFirstPhoto(fotos: string[] | null | undefined): string {
  if (!fotos || fotos.length === 0) {
    return FALLBACK_IMAGE;
  }
  return getPhotoUrl(fotos[0]);
}

/**
 * Get all photos from an array with proper URLs
 * @param fotos - Array of photo paths
 * @returns Array of full URLs
 */
export function getAllPhotos(fotos: string[] | null | undefined): string[] {
  if (!fotos || fotos.length === 0) {
    return [FALLBACK_IMAGE];
  }
  return fotos.map(photo => getPhotoUrl(photo));
}

/**
 * Check if a URL is valid and accessible
 * @param url - URL to check
 * @returns true if URL is valid
 */
export function isValidPhotoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
