/**
 * PubliMicro - Subscription Pricing Configuration
 * 
 * Recurring subscription tiers (separate from per-listing enhancements)
 */

export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface SubscriptionFeatures {
  tier: SubscriptionTier;
  name: string;
  price: number;
  billing: 'monthly' | 'free';
  trial_days: number;
  
  // Posting Limits
  max_properties: number;
  max_items: number;
  max_vehicles: number;
  
  // Features
  featured_badge: boolean;
  priority_support: boolean;
  analytics: boolean;
  bulk_upload: boolean;
  api_access: boolean;
  verified_badge: boolean;
  
  // Benefits
  benefits: string[];
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    tier: 'free',
    name: 'Gratuito',
    price: 0,
    billing: 'free',
    trial_days: 0,
    max_properties: 5,
    max_items: 10,
    max_vehicles: 3,
    featured_badge: false,
    priority_support: false,
    analytics: false,
    bulk_upload: false,
    api_access: false,
    verified_badge: false,
    benefits: [
      'Até 10 anúncios de itens',
      'Até 5 imóveis',
      'Até 3 veículos',
      'Suporte básico',
      'Validade de 30 dias'
    ]
  },
  
  premium: {
    tier: 'premium',
    name: 'Premium',
    price: 39.90,
    billing: 'monthly',
    trial_days: 7,
    max_properties: 50,
    max_items: 100,
    max_vehicles: 30,
    featured_badge: true,
    priority_support: true,
    analytics: true,
    bulk_upload: false,
    api_access: false,
    verified_badge: true,
    benefits: [
      '7 dias grátis para testar',
      'Até 100 anúncios de itens',
      'Até 50 imóveis',
      'Até 30 veículos',
      'Badge "Verificado"',
      'Badge "Premium"',
      'Suporte prioritário',
      'Analytics básico',
      'Validade ilimitada'
    ]
  },
  
  pro: {
    tier: 'pro',
    name: 'Profissional',
    price: 99.90,
    billing: 'monthly',
    trial_days: 0,
    max_properties: 999,
    max_items: 999,
    max_vehicles: 999,
    featured_badge: true,
    priority_support: true,
    analytics: true,
    bulk_upload: true,
    api_access: true,
    verified_badge: true,
    benefits: [
      'Anúncios ilimitados',
      'Badge "PRO"',
      'Badge "Verificado"',
      'Suporte VIP 24/7',
      'Analytics avançado',
      'Upload em lote (CSV)',
      'API de integração',
      'Gerente de conta dedicado',
      'Desconto 10% em enhancements'
    ]
  }
};

/**
 * Stripe Price IDs for subscriptions (generated from setup-stripe-products.js)
 */
export const SUBSCRIPTION_PRICE_IDS: Record<Exclude<SubscriptionTier, 'free'>, string> = {
  premium: 'price_1SQsWoFTa31reGpfgeoyCXZL',
  pro: 'price_1SQsWpFTa31reGpfKboHtx4H'
};

/**
 * Get subscription plan details
 */
export function getSubscriptionPlan(tier: SubscriptionTier): SubscriptionFeatures {
  return SUBSCRIPTION_PLANS[tier];
}

/**
 * Get Stripe Price ID for subscription
 */
export function getSubscriptionPriceId(tier: Exclude<SubscriptionTier, 'free'>): string | null {
  return SUBSCRIPTION_PRICE_IDS[tier] || null;
}

/**
 * Format subscription price for display
 */
export function formatSubscriptionPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(price);
}

/**
 * Check if user can post based on tier and current count
 */
export function canUserPost(
  tier: SubscriptionTier,
  category: 'properties' | 'items' | 'vehicles',
  currentCount: number
): boolean {
  const plan = SUBSCRIPTION_PLANS[tier];
  
  switch (category) {
    case 'properties':
      return currentCount < plan.max_properties;
    case 'items':
      return currentCount < plan.max_items;
    case 'vehicles':
      return currentCount < plan.max_vehicles;
    default:
      return false;
  }
}

/**
 * Get remaining posts for category
 */
export function getRemainingPosts(
  tier: SubscriptionTier,
  category: 'properties' | 'items' | 'vehicles',
  currentCount: number
): number {
  const plan = SUBSCRIPTION_PLANS[tier];
  
  switch (category) {
    case 'properties':
      return Math.max(0, plan.max_properties - currentCount);
    case 'items':
      return Math.max(0, plan.max_items - currentCount);
    case 'vehicles':
      return Math.max(0, plan.max_vehicles - currentCount);
    default:
      return 0;
  }
}

/**
 * Calculate enhancement discount for Pro tier
 */
export function getEnhancementDiscount(tier: SubscriptionTier, price: number): number {
  if (tier === 'pro') {
    return price * 0.10; // 10% discount
  }
  return 0;
}

/**
 * Get upgrade recommendation based on usage
 */
export function getUpgradeRecommendation(
  currentTier: SubscriptionTier,
  propertiesCount: number,
  itemsCount: number,
  vehiclesCount: number
): SubscriptionTier | null {
  if (currentTier === 'pro') return null; // Already on highest tier
  
  const currentPlan = SUBSCRIPTION_PLANS[currentTier];
  
  // Recommend Premium if hitting Free limits
  if (currentTier === 'free') {
    if (
      propertiesCount >= currentPlan.max_properties * 0.8 ||
      itemsCount >= currentPlan.max_items * 0.8 ||
      vehiclesCount >= currentPlan.max_vehicles * 0.8
    ) {
      return 'premium';
    }
  }
  
  // Recommend Pro if hitting Premium limits
  if (currentTier === 'premium') {
    if (
      propertiesCount >= currentPlan.max_properties * 0.8 ||
      itemsCount >= currentPlan.max_items * 0.8 ||
      vehiclesCount >= currentPlan.max_vehicles * 0.8
    ) {
      return 'pro';
    }
  }
  
  return null;
}
