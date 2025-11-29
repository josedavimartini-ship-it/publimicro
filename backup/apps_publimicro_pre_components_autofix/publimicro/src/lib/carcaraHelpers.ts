import { supabase } from '@/lib/supabaseClient';

export const CANONICAL_CARCARA_IDS = ['abare', 'bigua', 'mergulhao', 'seriema', 'juriti', 'surucua'];

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
  abare: 'Abaré',
  bigua: 'Biguá',
  mergulhao: 'Mergulhão',
  seriema: 'Seriema',
  juriti: 'Juriti',
  surucua: 'Surucuá',
};

export function mapIdToDisplayName(id?: string) {
  if (!id) return '';
  const key = id.toLowerCase();
  return ID_TO_DISPLAY_NAME[key] || id;
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
 * Fetch the canonical Carcará sitios. Tries to fetch by projeto='Sítios Carcará'
 * then falls back to the canonical id list. Also attaches the current highest bid.
 */
export async function fetchCanonicalSitios(opts: FetchOptions = {}) {
  const { limit = 6, hideTestListings = true } = opts;
  try {
    // Try project-based query first
    let { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('projeto', 'Sítios Carcará')
      .order('price', { ascending: true })
      .limit(limit);

    if (error) {
      console.warn('fetchCanonicalSitios: projeto query error', error);
    }

    // If no rows returned, fallback to canonical id list
    if (!data || data.length === 0) {
      const { data: fbData, error: fbErr } = await supabase
        .from('properties')
        .select('*')
        .in('id', CANONICAL_CARCARA_IDS)
        .order('price', { ascending: true });

      if (fbErr) {
        console.warn('fetchCanonicalSitios: fallback query error', fbErr);
      }
      data = fbData || [];
    }

    // Attach current highest bid for each property
    const sitiosWithBids = await Promise.all(
      (data || []).map(async (sitio: any) => {
        const { data: bids } = await supabase
          .from('proposals')
          .select('amount')
          .eq('property_id', sitio.id)
          .order('amount', { ascending: false })
          .limit(1);

        return {
          ...sitio,
          current_bid: bids && bids.length > 0 ? bids[0].amount : null,
        };
      })
    );

    // Optional filtering for obvious test/demo titles
    const filtered = hideTestListings
      ? (sitiosWithBids as any[]).filter((s) => !isTestTitle(s.nome || s.title))
      : sitiosWithBids;

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
export function mapCanonicalPropersToSitios(canonical: Array<any>) {
  if (!Array.isArray(canonical)) return [];
  return canonical.map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    nome: p.title,
    location: `${p.latitude},${p.longitude}`,
    localizacao: p.short || `${p.latitude},${p.longitude}`,
    fotos: p.fotos || [],
    kml_url: p.kml_url,
    short: p.short,
    total_area: p.total_area || null,
    current_bid: null,
    tagline: p.tagline || null,
    estimatedMarketValue: p.estimatedMarketValue || null,
    openingOffer: p.openingOffer || null,
    moodboard: p.moodboard || null,
    purpose: p.purpose || null,
  }));
}
