import { supabase } from '@/lib/supabaseClient';

export const CANONICAL_CARCARA_IDS = ['abare', 'bigua', 'mergulhao', 'seriema', 'juriti', 'surucua'];

// Supabase storage base URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://irrzpwzyqcubhhjeuakc.supabase.co';
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios`;

// The canonical IDs are the readable slugs used across the UI and seed data.
// Map canonical slug -> fable key (usually the same). Keeping an explicit
// mapping keeps the UI robust in case keys diverge later.
export const ID_TO_FABLE_KEY: Record<string, string> = {
  abare: 'abare',
  bigua: 'bigua',
  mergulhao: 'mergulhao',
  seriema: 'seriema',
  juriti: 'juriti',
  surucua: 'surucua',
};

export function mapIdToFableKey(id?: string) {
  if (!id) return '';
  const key = id.toLowerCase();
  return ID_TO_FABLE_KEY[key] || key;
}

// Human-friendly display names for the six Sítios (used in UI headings/cards)
export const ID_TO_DISPLAY_NAME: Record<string, string> = {
  abare: 'Sítio Abaré - Refúgio do Rio',
  bigua: 'Sítio Biguá - Majestade da Água',
  mergulhao: 'Sítio Mergulhão - Guardião das Águas',
  seriema: 'Sítio Seriema - A Voz do Cerrado',
  juriti: 'Sítio Juriti - A Canção do Entardecer',
  surucua: 'Sítio Surucuá - A Joia da Floresta',
};

export function mapIdToDisplayName(id?: string) {
  if (!id) return '';
  const key = id.toLowerCase();
  return ID_TO_DISPLAY_NAME[key] || id;
}

// Ranch cover photos from Supabase storage
const RANCH_COVER_PHOTOS: Record<string, string> = {
  juriti: `${STORAGE_BASE}/juriti/1762988625017-20251107_162023.jpg`,
  mergulhao: `${STORAGE_BASE}/mergulhao/1762988792202-20251107_163212.jpg`,
  seriema: `${STORAGE_BASE}/pordosol7.jpg`,
  surucua: `${STORAGE_BASE}/surucua.jpg`,
  bigua: `${STORAGE_BASE}/pordosol6lastviewofsunwide.jpg`,
  abare: `${STORAGE_BASE}/pordosolOrange.jpg`,
};

// All verified photos for each ranch (fallback if storage API fails)
const VERIFIED_RANCH_PHOTOS: Record<string, string[]> = {
  juriti: [
    `${STORAGE_BASE}/juriti/1762988625017-20251107_162023.jpg`,
    `${STORAGE_BASE}/juriti/1762988635593-20251107_162025.jpg`,
    `${STORAGE_BASE}/juriti/1762988648710-20251107_162052.jpg`,
    `${STORAGE_BASE}/juriti/1762988664370-20251107_162100.jpg`,
    `${STORAGE_BASE}/juriti/1762988673341-20251107_162143.jpg`,
    `${STORAGE_BASE}/juriti/1762988680911-20251107_162155.jpg`,
    `${STORAGE_BASE}/juriti/1762988692444-20251107_162239.jpg`,
    `${STORAGE_BASE}/juriti/1762988702080-20251107_162336.jpg`,
    `${STORAGE_BASE}/juriti/1762988708242-20251107_162356.jpg`,
    `${STORAGE_BASE}/juriti/1762988716151-20251107_162403.jpg`,
    `${STORAGE_BASE}/juriti/1762988783376-20251107_162537.jpg`,
  ],
  mergulhao: [
    `${STORAGE_BASE}/mergulhao/1762988792202-20251107_163212.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988798001-20251107_163239.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988804234-20251107_163252.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988808343-20251107_163306.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988811097-20251107_163415.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988818468-20251107_163506.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988827710-20251107_163720.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988836535-20251107_163820.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988845235-20251107_163847.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988852528-20251107_163856.jpg`,
    `${STORAGE_BASE}/mergulhao/1762988860014-20251107_163903.jpg`,
  ],
  seriema: [
    `${STORAGE_BASE}/pordosol7.jpg`,
  ],
  surucua: [
    `${STORAGE_BASE}/surucua.jpg`,
  ],
  bigua: [
    `${STORAGE_BASE}/pordosol6lastviewofsunwide.jpg`,
  ],
  abare: [
    `${STORAGE_BASE}/pordosolOrange.jpg`,
  ],
};

// Verified video URLs for each ranch
const VERIFIED_RANCH_VIDEOS: Record<string, string> = {
  juriti: `${STORAGE_BASE}/juriti/compressed/20251107_162422_compressed.mp4`,
  mergulhao: `${STORAGE_BASE}/mergulhao/compressed/20251107_163934_compressed.mp4`,
};

// Get cover photo for a ranch
export function getRanchCoverPhoto(slug: string): string {
  // Prefer verified ranch photo when available, otherwise fall back to a
  // local public asset to avoid broken external links in production.
  return RANCH_COVER_PHOTOS[slug.toLowerCase()] || '/images/sections/publiProper-bg.jpg';
}

// Get video URL for a ranch
export function getRanchVideoUrl(slug: string): string | undefined {
  return VERIFIED_RANCH_VIDEOS[slug.toLowerCase()];
}

// Fetch all photos for a ranch - uses verified fallback if storage API fails
export async function fetchRanchPhotos(slug: string): Promise<string[]> {
  const key = slug.toLowerCase();
  
  // First try the verified photos (reliable)
  if (VERIFIED_RANCH_PHOTOS[key] && VERIFIED_RANCH_PHOTOS[key].length > 0) {
    return VERIFIED_RANCH_PHOTOS[key];
  }
  
  // Try storage API as backup
  try {
    const { data: files } = await supabase.storage
      .from('imagens-sitios')
      .list(slug, { limit: 50 });
    
    if (!files || files.length === 0) return [getRanchCoverPhoto(slug)];
    
    // Filter for image files only
    const imageFiles = files.filter(f => 
      !f.name.includes('/') && 
      (f.name.endsWith('.jpg') || f.name.endsWith('.jpeg') || f.name.endsWith('.png') || f.name.endsWith('.webp'))
    );
    
    if (imageFiles.length === 0) return [getRanchCoverPhoto(slug)];
    
    return imageFiles.map(f => `${STORAGE_BASE}/${slug}/${f.name}`);
  } catch (error) {
    console.error(`Error fetching photos for ${slug}:`, error);
    return [getRanchCoverPhoto(slug)];
  }
}

type FetchOptions = {
  limit?: number;
  hideTestListings?: boolean;
};

const isTestTitle = (t?: string) => {
  if (!t) return false;
  return /\b(test|demo|dummy|lorem|sample)\b/i.test(t);
};

/**
 * Fetch the canonical Carcará properties from the 'properties' table.
 * Attaches photos from storage and current highest bid.
 */
export async function fetchCanonicalSitios(opts: FetchOptions = {}) {
  const { limit = 6, hideTestListings = true } = opts;
  try {
    // Query from properties table where the ranches are stored
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .in('slug', CANONICAL_CARCARA_IDS)
      .eq('property_type', 'sitio')
      .order('title', { ascending: true })
      .limit(limit);

    if (error) {
      console.warn('fetchCanonicalSitios: query error', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('fetchCanonicalSitios: no properties found');
      return [];
    }

    // Transform properties to expected sitio format with photos
    interface PropertyRow {
      id: string;
      slug: string;
      title?: string;
      description?: string;
      city?: string;
      state?: string;
      price?: number;
      expected_value?: number;
      total_area?: number;
      video_url?: string;
      featured?: boolean;
      latitude?: number;
      longitude?: number;
      accepts_proposals?: boolean;
      near_water?: boolean;
      has_electricity?: boolean;
      kml_url?: string;
      current_highest_bid?: number;
    }

    const rows = data as unknown as PropertyRow[];

    const sitiosWithPhotos = await Promise.all(
      rows.map(async (property) => {
        // Get photos from storage (ensure slug is string)
        const slug = String(property.slug ?? '');
        const photos = slug ? await fetchRanchPhotos(slug) : [getRanchCoverPhoto(slug || '')];

        // Get current highest bid
        const { data: bids } = await supabase
          .from('proposals')
          .select('amount')
          .eq('property_id', property.id)
          .order('amount', { ascending: false })
          .limit(1);

        const currentBid = Array.isArray(bids) && bids.length > 0 ? (bids[0] as { amount?: number }).amount : property.current_highest_bid ?? null;

        return {
          id: String(property.id),
          slug,
          nome: mapIdToDisplayName(slug),
          title: property.title,
          descricao: property.description,
          localizacao: property.city && property.state ? `${property.city}, ${property.state}` : 'Lago das Brisas, GO',
          preco: property.price ?? property.expected_value ?? null,
          area_total: property.total_area ?? null,
          fotos: photos,
          video_url: property.video_url,
          destaque: Boolean(property.featured),
          latitude: typeof property.latitude === 'number' ? property.latitude : undefined,
          longitude: typeof property.longitude === 'number' ? property.longitude : undefined,
          current_bid: typeof currentBid === 'number' ? currentBid : null,
          accepts_proposals: Boolean(property.accepts_proposals),
          agua: Boolean(property.near_water),
          energia: Boolean(property.has_electricity),
          kml_url: property.kml_url ?? null,
        };
      })
    );

    // Optional filtering for obvious test/demo titles
    const filtered = hideTestListings
      ? sitiosWithPhotos.filter((s) => !isTestTitle(s.nome || s.title))
      : sitiosWithPhotos;

    return filtered;
  } catch (err) {
    console.error('fetchCanonicalSitios unexpected error', err);
    return [];
  }
}

/**
 * Map the canonical JSON entries (from `AcheMeRuralPropers.json`) to the
 * Sitio shape the UI expects. Accepts an array of canonical records so the
 * caller controls the source (keeps helper pure and testable).
 */
type CanonicalEntry = {
  slug?: string;
  title?: string;
  latitude?: number | string;
  longitude?: number | string;
  short?: string;
  fotos?: string[];
  kml_url?: string;
  total_area?: number | string;
  tagline?: string;
  estimatedMarketValue?: number | null;
  openingOffer?: number | null;
  moodboard?: string[] | null;
  purpose?: string | null;
};

export function mapCanonicalPropersToSitios(canonical: Array<Record<string, unknown>>) {
  if (!Array.isArray(canonical)) return [];

  return (canonical as CanonicalEntry[]).map((p) => {
    const slug = String(p.slug ?? '');
    const title = String(p.title ?? '');
    const latitude = p.latitude !== undefined ? String(p.latitude) : '';
    const longitude = p.longitude !== undefined ? String(p.longitude) : '';

    return {
      id: slug || title,
      slug,
      title: title || undefined,
      nome: title || undefined,
      location: latitude && longitude ? `${latitude},${longitude}` : undefined,
      localizacao: p.short || (latitude && longitude ? `${latitude},${longitude}` : undefined),
      fotos: Array.isArray(p.fotos) ? p.fotos : [],
      kml_url: p.kml_url ?? undefined,
      short: p.short ?? undefined,
      total_area: p.total_area ?? null,
      current_bid: null,
      tagline: p.tagline ?? null,
      estimatedMarketValue: p.estimatedMarketValue ?? null,
      openingOffer: p.openingOffer ?? null,
      moodboard: p.moodboard ?? null,
      purpose: p.purpose ?? null,
    };
  });
}
