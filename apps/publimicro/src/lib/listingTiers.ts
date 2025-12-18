/**
 * Listing Tiers Configuration
 * Defines the limits and features for free vs paid listings
 * 
 * Industry Research (Zillow, Realtor, OLX, Idealista):
 * - Free: 5-10 photos, no videos, basic fields, no highlight
 * - Standard: 15-20 photos, 1 video, all fields, some visibility
 * - Premium: 30+ photos, multiple videos, featured placement, priority search
 * 
 * Our Strategy: Be 20% better than the best competitor
 */

export interface ListingTierLimits {
  maxPhotos: number;
  minPhotos: number;
  maxVideos: number;
  maxVideoSizeMB: number;
  maxVideoDurationSeconds: number;
  maxTitleLength: number;
  maxDescriptionLength: number;
  canHighlight: boolean;
  canFeature: boolean;
  searchPriority: number; // 1-10, higher = more visible
  durationDays: number;
  canRenew: boolean;
  mapDisplay: 'basic' | 'satellite' | 'interactive';
  neighborhoodInfo: boolean;
  contactOptions: ('phone' | 'email' | 'whatsapp' | 'chat')[];
  analytics: boolean;
  verifiedBadge: boolean;
  autoRenew: boolean;
  virtualTour: boolean;
  professionalPhotos: boolean;
}

export interface ListingTier {
  id: 'free' | 'standard' | 'premium' | 'professional';
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  priceMonthly: number; // BRL
  priceYearly: number; // BRL with discount
  limits: ListingTierLimits;
  color: string;
  icon: string;
  popular?: boolean;
}

export const LISTING_TIERS: ListingTier[] = [
  {
    id: 'free',
    name: 'Grátis',
    nameEn: 'Free',
    description: 'Ideal para testar a plataforma com um anúncio básico',
    descriptionEn: 'Perfect for testing the platform with a basic listing',
    priceMonthly: 0,
    priceYearly: 0,
    limits: {
      maxPhotos: 3,
      minPhotos: 1,
      maxVideos: 0,
      maxVideoSizeMB: 0,
      maxVideoDurationSeconds: 0,
      maxTitleLength: 60,
      maxDescriptionLength: 500,
      canHighlight: false,
      canFeature: false,
      searchPriority: 1,
      durationDays: 30,
      canRenew: false, // Only 1 free listing per user
      mapDisplay: 'basic',
      neighborhoodInfo: false,
      contactOptions: ['email'],
      analytics: false,
      verifiedBadge: false,
      autoRenew: false,
      virtualTour: false,
      professionalPhotos: false,
    },
    color: '#676767',
    icon: '🆓',
  },
  {
    id: 'standard',
    name: 'Padrão',
    nameEn: 'Standard',
    description: 'Para quem quer mais visibilidade e recursos',
    descriptionEn: 'For those who want more visibility and features',
    priceMonthly: 29.90,
    priceYearly: 299.00, // ~17% discount
    popular: true,
    limits: {
      maxPhotos: 12,
      minPhotos: 3,
      maxVideos: 1,
      maxVideoSizeMB: 50, // 50MB
      maxVideoDurationSeconds: 60, // 1 minute
      maxTitleLength: 100,
      maxDescriptionLength: 2000,
      canHighlight: false,
      canFeature: false,
      searchPriority: 5,
      durationDays: 60,
      canRenew: true,
      mapDisplay: 'satellite',
      neighborhoodInfo: true,
      contactOptions: ['phone', 'email', 'whatsapp'],
      analytics: true,
      verifiedBadge: false,
      autoRenew: true,
      virtualTour: false,
      professionalPhotos: false,
    },
    color: '#D4A574',
    icon: '⭐',
  },
  {
    id: 'premium',
    name: 'Premium',
    nameEn: 'Premium',
    description: 'Máxima exposição e todos os recursos avançados',
    descriptionEn: 'Maximum exposure and all advanced features',
    priceMonthly: 79.90,
    priceYearly: 799.00, // ~17% discount
    limits: {
      maxPhotos: 24,
      minPhotos: 5,
      maxVideos: 3,
      maxVideoSizeMB: 200, // 200MB
      maxVideoDurationSeconds: 180, // 3 minutes
      maxTitleLength: 150,
      maxDescriptionLength: 5000,
      canHighlight: true,
      canFeature: true,
      searchPriority: 8,
      durationDays: 90,
      canRenew: true,
      mapDisplay: 'interactive',
      neighborhoodInfo: true,
      contactOptions: ['phone', 'email', 'whatsapp', 'chat'],
      analytics: true,
      verifiedBadge: true,
      autoRenew: true,
      virtualTour: true,
      professionalPhotos: false,
    },
    color: '#CD7F32',
    icon: '👑',
  },
  {
    id: 'professional',
    name: 'Profissional',
    nameEn: 'Professional',
    description: 'Para corretores e imobiliárias com múltiplos anúncios',
    descriptionEn: 'For real estate agents with multiple listings',
    priceMonthly: 199.90,
    priceYearly: 1999.00, // ~17% discount
    limits: {
      maxPhotos: 50,
      minPhotos: 10,
      maxVideos: 5,
      maxVideoSizeMB: 500, // 500MB
      maxVideoDurationSeconds: 300, // 5 minutes
      maxTitleLength: 200,
      maxDescriptionLength: 10000,
      canHighlight: true,
      canFeature: true,
      searchPriority: 10,
      durationDays: 365,
      canRenew: true,
      mapDisplay: 'interactive',
      neighborhoodInfo: true,
      contactOptions: ['phone', 'email', 'whatsapp', 'chat'],
      analytics: true,
      verifiedBadge: true,
      autoRenew: true,
      virtualTour: true,
      professionalPhotos: true, // Includes professional photo service
    },
    color: '#D4AF37',
    icon: '🏆',
  },
];

/**
 * Get tier by ID
 */
export function getTierById(tierId: string): ListingTier | undefined {
  return LISTING_TIERS.find(tier => tier.id === tierId);
}

/**
 * Get tier limits by ID
 */
export function getTierLimits(tierId: string): ListingTierLimits | undefined {
  return getTierById(tierId)?.limits;
}

/**
 * Check if user can post free listing
 * Returns true if user hasn't used their free listing yet
 */
export async function canPostFreeListing(userId: string, supabase: { from: (table: string) => unknown }): Promise<boolean> {
  const { count, error } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('tier', 'free');
  
  if (error) {
    console.error('Error checking free listing:', error);
    return false;
  }
  
  return (count || 0) < 1; // Allow only 1 free listing per user
}

/**
 * Validate photo count for tier
 */
export function validatePhotoCount(photos: number, tierId: string): { valid: boolean; message?: string } {
  const limits = getTierLimits(tierId);
  if (!limits) return { valid: false, message: 'Plano inválido' };
  
  if (photos < limits.minPhotos) {
    return { 
      valid: false, 
      message: `Mínimo de ${limits.minPhotos} foto${limits.minPhotos > 1 ? 's' : ''} necessária${limits.minPhotos > 1 ? 's' : ''}` 
    };
  }
  
  if (photos > limits.maxPhotos) {
    return { 
      valid: false, 
      message: `Máximo de ${limits.maxPhotos} fotos permitidas no plano ${getTierById(tierId)?.name}` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate video for tier
 */
export function validateVideo(
  videoCount: number, 
  videoSizeMB: number, 
  videoDurationSeconds: number, 
  tierId: string
): { valid: boolean; message?: string } {
  const limits = getTierLimits(tierId);
  if (!limits) return { valid: false, message: 'Plano inválido' };
  
  if (videoCount > limits.maxVideos) {
    if (limits.maxVideos === 0) {
      return { valid: false, message: 'Vídeos não são permitidos no plano gratuito' };
    }
    return { 
      valid: false, 
      message: `Máximo de ${limits.maxVideos} vídeo${limits.maxVideos > 1 ? 's' : ''} permitido${limits.maxVideos > 1 ? 's' : ''} no plano ${getTierById(tierId)?.name}` 
    };
  }
  
  if (videoSizeMB > limits.maxVideoSizeMB) {
    return { 
      valid: false, 
      message: `Tamanho máximo do vídeo: ${limits.maxVideoSizeMB}MB no plano ${getTierById(tierId)?.name}` 
    };
  }
  
  if (videoDurationSeconds > limits.maxVideoDurationSeconds) {
    const maxMinutes = Math.floor(limits.maxVideoDurationSeconds / 60);
    return { 
      valid: false, 
      message: `Duração máxima do vídeo: ${maxMinutes} minuto${maxMinutes > 1 ? 's' : ''} no plano ${getTierById(tierId)?.name}` 
    };
  }
  
  return { valid: true };
}

/**
 * Get comparison features for tier selection UI
 */
export function getTierComparisonFeatures() {
  return [
    { 
      feature: 'Fotos', 
      free: '3', 
      standard: '12', 
      premium: '24', 
      professional: '50' 
    },
    { 
      feature: 'Vídeos', 
      free: '❌', 
      standard: '1 (60s)', 
      premium: '3 (3min)', 
      professional: '5 (5min)' 
    },
    { 
      feature: 'Duração do anúncio', 
      free: '30 dias', 
      standard: '60 dias', 
      premium: '90 dias', 
      professional: '1 ano' 
    },
    { 
      feature: 'Destaque na busca', 
      free: '❌', 
      standard: '❌', 
      premium: '✅', 
      professional: '✅' 
    },
    { 
      feature: 'Mapa interativo', 
      free: 'Básico', 
      standard: 'Satélite', 
      premium: 'Interativo', 
      professional: 'Interativo' 
    },
    { 
      feature: 'Info da vizinhança', 
      free: '❌', 
      standard: '✅', 
      premium: '✅', 
      professional: '✅' 
    },
    { 
      feature: 'WhatsApp', 
      free: '❌', 
      standard: '✅', 
      premium: '✅', 
      professional: '✅' 
    },
    { 
      feature: 'Estatísticas', 
      free: '❌', 
      standard: '✅', 
      premium: '✅', 
      professional: '✅' 
    },
    { 
      feature: 'Selo verificado', 
      free: '❌', 
      standard: '❌', 
      premium: '✅', 
      professional: '✅' 
    },
    { 
      feature: 'Tour virtual', 
      free: '❌', 
      standard: '❌', 
      premium: '✅', 
      professional: '✅' 
    },
    { 
      feature: 'Renovação automática', 
      free: '❌', 
      standard: '✅', 
      premium: '✅', 
      professional: '✅' 
    },
  ];
}

/**
 * Format price for display
 */
export function formatTierPrice(tier: ListingTier, yearly: boolean = false): string {
  const price = yearly ? tier.priceYearly : tier.priceMonthly;
  if (price === 0) return 'Grátis';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price) + (yearly ? '/ano' : '/mês');
}

export default LISTING_TIERS;
