/**
 * Posting Limits Middleware
 * Checks if user can post based on subscription tier and monthly limits
 */

import { createClient } from '@supabase/supabase-js';

// Types
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

export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface PostingLimit {
  items: number;
  properties: number;
  vehicles: number;
}

export interface CanUserPostResult {
  allowed: boolean;
  reason?: string;
  remaining?: number;
  limit?: number;
  tier?: SubscriptionTier;
  needsUpgrade?: boolean;
  upgradeUrl?: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  total_credits: number;
  free_credits: number;
  paid_credits: number;
  items_posted_this_month: number;
  properties_posted_this_month: number;
  vehicles_posted_this_month: number;
  machinery_posted_this_month: number;
  last_monthly_reset: string; // Date string
  total_posts_lifetime: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'expired' | 'past_due' | 'trialing';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string;
  current_period_end: string;
  trial_ends_at: string | null;
  is_trial: boolean;
  created_at: string;
  updated_at: string;
}

// Tier limits configuration
const TIER_LIMITS: Record<SubscriptionTier, PostingLimit> = {
  free: {
    items: 2,
    properties: 1,
    vehicles: 1,
  },
  premium: {
    items: 10,
    properties: 3,
    vehicles: 3,
  },
  pro: {
    items: Infinity,
    properties: Infinity,
    vehicles: Infinity,
  },
};

// Category mapping to limit field
const CATEGORY_TO_FIELD: Record<AnnouncementCategory, keyof PostingLimit> = {
  items: 'items',
  properties: 'properties',
  vehicles: 'vehicles',
  machinery: 'vehicles', // Grouped with vehicles
  marine: 'vehicles', // Grouped with vehicles
  outdoor: 'items', // Grouped with items
  travel: 'items', // Grouped with items
  global: 'items', // Grouped with items
  shared: 'items', // Grouped with items
};

// Category to usage field mapping
const CATEGORY_TO_USAGE_FIELD: Record<AnnouncementCategory, keyof UserCredits> = {
  items: 'items_posted_this_month',
  properties: 'properties_posted_this_month',
  vehicles: 'vehicles_posted_this_month',
  machinery: 'machinery_posted_this_month',
  marine: 'vehicles_posted_this_month',
  outdoor: 'items_posted_this_month',
  travel: 'items_posted_this_month',
  global: 'items_posted_this_month',
  shared: 'items_posted_this_month',
};

/**
 * Initialize Supabase client
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Check if monthly reset is needed
 * Free tier users get fresh limits on 1st of each month
 */
async function checkAndResetMonthlyLimits(
  userId: string,
  lastReset: string
): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  const lastResetDate = new Date(lastReset).toISOString().split('T')[0];

  // Check if it's a new month
  const todayMonth = new Date(today).getMonth();
  const lastResetMonth = new Date(lastResetDate).getMonth();

  if (todayMonth !== lastResetMonth) {
    const supabase = getSupabaseClient();

    // Reset monthly counters
    const { error } = await supabase
      .from('user_credits')
      .update({
        items_posted_this_month: 0,
        properties_posted_this_month: 0,
        vehicles_posted_this_month: 0,
        machinery_posted_this_month: 0,
        last_monthly_reset: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to reset monthly limits:', error);
      return false;
    }

    return true; // Reset performed
  }

  return false; // No reset needed
}

/**
 * Get user's active subscription
 */
async function getUserSubscription(
  userId: string
): Promise<UserSubscription | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No subscription found
      return null;
    }
    console.error('Failed to get user subscription:', error);
    throw error;
  }

  return data as UserSubscription;
}

/**
 * Get or create user credits record
 */
async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const supabase = getSupabaseClient();

  let { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Credits record doesn't exist, create it
    const { data: newCredits, error: insertError } = await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        total_credits: 0,
        free_credits: 0,
        paid_credits: 0,
        items_posted_this_month: 0,
        properties_posted_this_month: 0,
        vehicles_posted_this_month: 0,
        machinery_posted_this_month: 0,
        last_monthly_reset: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create user credits:', insertError);
      return null;
    }

    return newCredits as UserCredits;
  }

  if (error) {
    console.error('Failed to get user credits:', error);
    return null;
  }

  return data as UserCredits;
}

/**
 * Main function to check if user can post in a category
 * 
 * @param userId - User ID from auth.users
 * @param category - Announcement category
 * @returns Result indicating if posting is allowed
 */
export async function canUserPost(
  userId: string,
  category: AnnouncementCategory
): Promise<CanUserPostResult> {
  try {
    // 1. Get user's subscription
    const subscription = await getUserSubscription(userId);

    if (!subscription) {
      // No subscription = something wrong, should have free tier
      return {
        allowed: false,
        reason: 'Você precisa de uma assinatura ativa para publicar anúncios.',
        needsUpgrade: true,
        upgradeUrl: '/planos',
      };
    }

    // 2. Pro tier has unlimited posts
    if (subscription.tier === 'pro') {
      return {
        allowed: true,
        tier: 'pro',
        remaining: Infinity,
        limit: Infinity,
      };
    }

    // 3. Get user credits/usage
    const credits = await getUserCredits(userId);

    if (!credits) {
      return {
        allowed: false,
        reason: 'Erro ao verificar seus limites de postagem. Tente novamente.',
      };
    }

    // 4. Check if monthly reset is needed
    await checkAndResetMonthlyLimits(userId, credits.last_monthly_reset);

    // Re-fetch credits after potential reset
    const updatedCredits = await getUserCredits(userId);
    if (!updatedCredits) {
      return {
        allowed: false,
        reason: 'Erro ao verificar seus limites de postagem. Tente novamente.',
      };
    }

    // 5. Get limits for this tier
    const tierLimits = TIER_LIMITS[subscription.tier];
    const limitField = CATEGORY_TO_FIELD[category];
    const limit = tierLimits[limitField];

    // 6. Get current usage for this category
    const usageField = CATEGORY_TO_USAGE_FIELD[category];
    const currentUsage = updatedCredits[usageField];

    // 7. Check if under limit
    if (currentUsage >= limit) {
      const nextTier = subscription.tier === 'free' ? 'premium' : 'pro';
      const nextLimit = TIER_LIMITS[nextTier][limitField];

      return {
        allowed: false,
        reason: `Você atingiu o limite de ${limit} anúncio(s) de ${getCategoryDisplayName(category)} por mês. Faça upgrade para ${nextTier === 'premium' ? 'Premium' : 'Pro'} e publique até ${nextLimit === Infinity ? 'ilimitados' : nextLimit} anúncios!`,
        remaining: 0,
        limit,
        tier: subscription.tier,
        needsUpgrade: true,
        upgradeUrl: '/planos',
      };
    }

    // 8. User can post
    return {
      allowed: true,
      remaining: limit - currentUsage,
      limit,
      tier: subscription.tier,
    };
  } catch (error) {
    console.error('Error checking posting limits:', error);
    return {
      allowed: false,
      reason: 'Erro ao verificar permissões. Tente novamente mais tarde.',
    };
  }
}

/**
 * Get user-friendly category name in Portuguese
 */
function getCategoryDisplayName(category: AnnouncementCategory): string {
  const names: Record<AnnouncementCategory, string> = {
    items: 'itens',
    properties: 'imóveis',
    vehicles: 'veículos',
    machinery: 'máquinas',
    marine: 'embarcações',
    outdoor: 'outdoor',
    travel: 'viagens',
    global: 'comércio global',
    shared: 'compartilhados',
  };

  return names[category] || category;
}

/**
 * Increment posting count after successful announcement creation
 * Call this after announcement is published (status = 'active' or 'pending')
 */
export async function incrementPostingCount(
  userId: string,
  category: AnnouncementCategory
): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const usageField = CATEGORY_TO_USAGE_FIELD[category];

    const { error } = await supabase.rpc('increment_user_posting_count', {
      p_user_id: userId,
      p_field: usageField,
    });

    if (error) {
      // Fallback: Manual increment
      const credits = await getUserCredits(userId);
      if (!credits) return false;

      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          [usageField]: credits[usageField] + 1,
          total_posts_lifetime: credits.total_posts_lifetime + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Failed to increment posting count:', updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error incrementing posting count:', error);
    return false;
  }
}

/**
 * Get user's posting stats (for dashboard display)
 */
export async function getUserPostingStats(userId: string) {
  try {
    const subscription = await getUserSubscription(userId);
    const credits = await getUserCredits(userId);

    if (!subscription || !credits) {
      return null;
    }

    const tierLimits = TIER_LIMITS[subscription.tier];

    return {
      tier: subscription.tier,
      status: subscription.status,
      is_trial: subscription.is_trial,
      trial_ends_at: subscription.trial_ends_at,
      current_period_end: subscription.current_period_end,
      usage: {
        items: {
          current: credits.items_posted_this_month,
          limit: tierLimits.items,
          remaining: tierLimits.items === Infinity 
            ? Infinity 
            : tierLimits.items - credits.items_posted_this_month,
        },
        properties: {
          current: credits.properties_posted_this_month,
          limit: tierLimits.properties,
          remaining: tierLimits.properties === Infinity 
            ? Infinity 
            : tierLimits.properties - credits.properties_posted_this_month,
        },
        vehicles: {
          current: credits.vehicles_posted_this_month,
          limit: tierLimits.vehicles,
          remaining: tierLimits.vehicles === Infinity 
            ? Infinity 
            : tierLimits.vehicles - credits.vehicles_posted_this_month,
        },
      },
      credits: {
        total: credits.total_credits,
        free: credits.free_credits,
        paid: credits.paid_credits,
      },
      lifetime_posts: credits.total_posts_lifetime,
      last_reset: credits.last_monthly_reset,
    };
  } catch (error) {
    console.error('Error getting posting stats:', error);
    return null;
  }
}
