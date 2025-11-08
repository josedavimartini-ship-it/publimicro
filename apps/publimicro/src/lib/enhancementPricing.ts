/**
 * PubliMicro - Listing Enhancement Pricing
 * 
 * Per-listing add-on products (separate from subscription tiers):
 * - Highlight: 30 days on homepage + category top
 * - Organic Marketing: Professional marketing campaign
 * - Bundle: Both with discount
 */

export type AnnouncementCategory = 
  | 'items' 
  | 'properties' 
  | 'vehicles' 
  | 'machinery' 
  | 'marine' 
  | 'outdoor' 
  | 'travel' 
  | 'global' 
  | 'shared';

export type EnhancementType = 'highlight' | 'organic_marketing' | 'bundle';

export interface EnhancementPricing {
  highlight: number;
  organic_marketing: number;
  bundle: number;
  savings: number;
}

/**
 * Enhancement pricing by category (in BRL)
 */
export const ENHANCEMENT_PRICING: Record<AnnouncementCategory, EnhancementPricing> = {
  // AcheMeCoisas - General Classifieds (cheapest)
  items: {
    highlight: 12.00,
    organic_marketing: 70.00,
    bundle: 75.00,
    savings: 7.00
  },
  
  // AcheMeMotors - Vehicles (mid-tier)
  vehicles: {
    highlight: 20.00,
    organic_marketing: 120.00,
    bundle: 130.00,
    savings: 10.00
  },
  
  // AcheMeMachina - Machinery (mid-tier, same as vehicles)
  machinery: {
    highlight: 20.00,
    organic_marketing: 120.00,
    bundle: 130.00,
    savings: 10.00
  },
  
  // AcheMeMarine - Marine (mid-tier, same as vehicles)
  marine: {
    highlight: 20.00,
    organic_marketing: 120.00,
    bundle: 130.00,
    savings: 10.00
  },
  
  // AcheMeProper - Real Estate (premium)
  properties: {
    highlight: 30.00,
    organic_marketing: 180.00,
    bundle: 195.00,
    savings: 15.00
  },
  
  // AcheMeOutdoor - Sports & Camping (same as items)
  outdoor: {
    highlight: 12.00,
    organic_marketing: 70.00,
    bundle: 75.00,
    savings: 7.00
  },
  
  // AcheMeJourney - Travel (same as items)
  travel: {
    highlight: 12.00,
    organic_marketing: 70.00,
    bundle: 75.00,
    savings: 7.00
  },
  
  // AcheMeGlobal - International (same as items)
  global: {
    highlight: 12.00,
    organic_marketing: 70.00,
    bundle: 75.00,
    savings: 7.00
  },
  
  // AcheMeShare - Sharangas (same as items)
  shared: {
    highlight: 12.00,
    organic_marketing: 70.00,
    bundle: 75.00,
    savings: 7.00
  }
};

/**
 * Get pricing for a specific category and enhancement type
 */
export function getEnhancementPrice(
  category: AnnouncementCategory,
  type: EnhancementType
): number {
  const pricing = ENHANCEMENT_PRICING[category];
  return pricing[type];
}

/**
 * Get full pricing details for a category
 */
export function getCategoryPricing(category: AnnouncementCategory): EnhancementPricing {
  return ENHANCEMENT_PRICING[category];
}

/**
 * Format price for display (Brazilian Real)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

/**
 * Calculate savings percentage
 */
export function getSavingsPercentage(category: AnnouncementCategory): number {
  const pricing = ENHANCEMENT_PRICING[category];
  const totalSeparate = pricing.highlight + pricing.organic_marketing;
  return Math.round((pricing.savings / totalSeparate) * 100);
}

/**
 * Get category tier (for UI grouping)
 */
export function getCategoryTier(category: AnnouncementCategory): 'basic' | 'mid' | 'premium' {
  if (category === 'properties') return 'premium';
  if (['vehicles', 'machinery', 'marine'].includes(category)) return 'mid';
  return 'basic';
}

/**
 * Get category display name in Portuguese
 */
export function getCategoryDisplayName(category: AnnouncementCategory): string {
  const names: Record<AnnouncementCategory, string> = {
    items: 'AcheMeCoisas',
    properties: 'AcheMeProper',
    vehicles: 'AcheMeMotors',
    machinery: 'AcheMeMachina',
    marine: 'AcheMeMarine',
    outdoor: 'AcheMeOutdoor',
    travel: 'AcheMeJourney',
    global: 'AcheMeGlobal',
    shared: 'AcheMeShare'
  };
  return names[category];
}

/**
 * Get enhancement type display name in Portuguese
 */
export function getEnhancementTypeName(type: EnhancementType): string {
  const names: Record<EnhancementType, string> = {
    highlight: 'Destaque na HomePage',
    organic_marketing: 'Marketing Orgânico',
    bundle: 'Pacote Completo'
  };
  return names[type];
}

/**
 * Get enhancement features description
 */
export function getEnhancementFeatures(type: EnhancementType): string[] {
  const features: Record<EnhancementType, string[]> = {
    highlight: [
      '30 dias em destaque',
      'Topo da página inicial',
      'Destaque na categoria',
      'Badge "Em Destaque"',
      'Maior visibilidade'
    ],
    organic_marketing: [
      'Campanha profissional',
      'Posts em redes sociais',
      'SEO otimizado',
      'Criação de conteúdo',
      'Relatório de resultados'
    ],
    bundle: [
      'Tudo do Destaque',
      'Tudo do Marketing',
      'Economize até 18%',
      'Máxima visibilidade',
      'Suporte prioritário'
    ]
  };
  return features[type];
}

/**
 * Stripe price IDs (generated from setup-stripe-products.js)
 * Format: STRIPE_PRICE_IDS[category][type]
 */
export const STRIPE_PRICE_IDS: Record<AnnouncementCategory, Record<EnhancementType, string>> = {
  items: {
    highlight: 'price_1SQsWeFTa31reGpf9cqoamZK',
    organic_marketing: 'price_1SQsWfFTa31reGpfIUCCZCgB',
    bundle: 'price_1SQsWgFTa31reGpf2U52sdTG'
  },
  vehicles: {
    highlight: 'price_1SQsWhFTa31reGpfjOIz5v98',
    organic_marketing: 'price_1SQsWiFTa31reGpfu83iTmAB',
    bundle: 'price_1SQsWjFTa31reGpf7aW1O1kB'
  },
  machinery: {
    highlight: 'price_1SQsWhFTa31reGpfjOIz5v98', // Same as vehicles
    organic_marketing: 'price_1SQsWiFTa31reGpfu83iTmAB',
    bundle: 'price_1SQsWjFTa31reGpf7aW1O1kB'
  },
  marine: {
    highlight: 'price_1SQsWhFTa31reGpfjOIz5v98', // Same as vehicles
    organic_marketing: 'price_1SQsWiFTa31reGpfu83iTmAB',
    bundle: 'price_1SQsWjFTa31reGpf7aW1O1kB'
  },
  properties: {
    highlight: 'price_1SQsWkFTa31reGpfcvHEZ3Ns',
    organic_marketing: 'price_1SQsWlFTa31reGpfESfDzwk4',
    bundle: 'price_1SQsWlFTa31reGpfTgbF5xHA'
  },
  outdoor: {
    highlight: 'price_1SQsWeFTa31reGpf9cqoamZK', // Same as items
    organic_marketing: 'price_1SQsWfFTa31reGpfIUCCZCgB',
    bundle: 'price_1SQsWgFTa31reGpf2U52sdTG'
  },
  travel: {
    highlight: 'price_1SQsWeFTa31reGpf9cqoamZK', // Same as items
    organic_marketing: 'price_1SQsWfFTa31reGpfIUCCZCgB',
    bundle: 'price_1SQsWgFTa31reGpf2U52sdTG'
  },
  global: {
    highlight: 'price_1SQsWeFTa31reGpf9cqoamZK', // Same as items
    organic_marketing: 'price_1SQsWfFTa31reGpfIUCCZCgB',
    bundle: 'price_1SQsWgFTa31reGpf2U52sdTG'
  },
  shared: {
    highlight: 'price_1SQsWeFTa31reGpf9cqoamZK', // Same as items
    organic_marketing: 'price_1SQsWfFTa31reGpfIUCCZCgB',
    bundle: 'price_1SQsWgFTa31reGpf2U52sdTG'
  }
};

/**
 * Get Stripe Price ID for a specific enhancement
 */
export function getStripePriceId(
  category: AnnouncementCategory,
  type: EnhancementType
): string | null {
  const priceId = STRIPE_PRICE_IDS[category]?.[type];
  return priceId || null;
}

/**
 * Validate if enhancement is available for category
 */
export function isEnhancementAvailable(
  category: AnnouncementCategory,
  type: EnhancementType
): boolean {
  // All enhancements available for all categories
  return true;
}
