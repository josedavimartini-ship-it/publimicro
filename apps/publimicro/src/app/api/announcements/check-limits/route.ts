/**
 * API Route: Check Posting Limits
 * Checks if user can post in a specific category
 */

import { NextRequest, NextResponse } from 'next/server';
import { canUserPost, type AnnouncementCategory } from '@/lib/postingLimits';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { category } = await request.json();

    // Validate category
    const validCategories: AnnouncementCategory[] = [
      'items',
      'properties',
      'vehicles',
      'machinery',
      'marine',
      'outdoor',
      'travel',
      'global',
      'shared',
    ];

    if (!category || !validCategories.includes(category)) {
      return NextResponse.json(
        {
          error: 'Categoria inválida',
          valid_categories: validCategories,
        },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Você precisa estar logado para publicar anúncios',
          redirect: '/entrar',
        },
        { status: 401 }
      );
    }

    // Check if user can post
    const result = await canUserPost(user.id, category as AnnouncementCategory);

    if (!result.allowed) {
      return NextResponse.json(
        {
          allowed: false,
          error: result.reason,
          needs_upgrade: result.needsUpgrade,
          upgrade_url: result.upgradeUrl,
          tier: result.tier,
          limit: result.limit,
          remaining: result.remaining,
        },
        { status: 403 }
      );
    }

    // User can post
    return NextResponse.json({
      allowed: true,
      tier: result.tier,
      limit: result.limit,
      remaining: result.remaining,
      message: `Você pode publicar mais ${result.remaining} anúncio(s) de ${getCategoryDisplayName(category as AnnouncementCategory)} este mês.`,
    });
  } catch (error) {
    console.error('Error checking posting limits:', error);
    return NextResponse.json(
      {
        error: 'Erro ao verificar limites de postagem',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check limits without category (get all limits)
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Você precisa estar logado',
          redirect: '/entrar',
        },
        { status: 401 }
      );
    }

    // Get posting stats for all categories
    const { getUserPostingStats } = await import('@/lib/postingLimits');
    const stats = await getUserPostingStats(user.id);

    if (!stats) {
      return NextResponse.json(
        { error: 'Erro ao buscar estatísticas de postagem' },
        { status: 500 }
      );
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting posting stats:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar estatísticas',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

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
