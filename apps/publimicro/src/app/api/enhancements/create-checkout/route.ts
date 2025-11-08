import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';
import { getStripePriceId, getEnhancementPrice, getCategoryDisplayName, getEnhancementTypeName } from '@/lib/enhancementPricing';
import type { AnnouncementCategory, EnhancementType } from '@/lib/enhancementPricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * POST /api/enhancements/create-checkout
 * 
 * Creates a Stripe Checkout session for listing enhancement purchase
 * 
 * IMPORTANT: User must be verified before purchasing enhancements
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Você precisa estar logado para comprar enhancements.' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { 
      announcement_id, 
      category, 
      enhancement_type 
    } = body as {
      announcement_id: string;
      category: AnnouncementCategory;
      enhancement_type: EnhancementType;
    };

    // Validate required fields
    if (!announcement_id || !category || !enhancement_type) {
      return NextResponse.json(
        { error: 'announcement_id, category e enhancement_type são obrigatórios.' },
        { status: 400 }
      );
    }

    // ============================================
    // CRITICAL: Check user verification status
    // ============================================
    const { data: verification, error: verifyError } = await supabase
      .from('user_verifications')
      .select('status, rejection_reason')
      .eq('user_id', user.id)
      .single();

    if (verifyError && verifyError.code !== 'PGRST116') {
      console.error('Error checking verification:', verifyError);
      return NextResponse.json(
        { error: 'Erro ao verificar status de verificação.' },
        { status: 500 }
      );
    }

    // User not verified - redirect to verification flow
    if (!verification || verification.status !== 'approved') {
      return NextResponse.json(
        { 
          error: 'Você precisa ser verificado antes de comprar enhancements.',
          verification_required: true,
          verification_status: verification?.status || 'not_started',
          redirect_url: '/verificacao'
        },
        { status: 403 }
      );
    }

    // Check if announcement exists and belongs to user
    const { data: announcement, error: announcementError } = await supabase
      .from('announcements')
      .select('id, title, user_id, category, status')
      .eq('id', announcement_id)
      .single();

    if (announcementError || !announcement) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado.' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (announcement.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para comprar enhancement para este anúncio.' },
        { status: 403 }
      );
    }

    // Check if announcement is active
    if (announcement.status !== 'active' && announcement.status !== 'pending') {
      return NextResponse.json(
        { error: 'Apenas anúncios ativos podem ter enhancements.' },
        { status: 400 }
      );
    }

    // Get Stripe Price ID
    const priceId = getStripePriceId(category, enhancement_type);
    if (!priceId) {
      return NextResponse.json(
        { error: 'Preço não encontrado para este enhancement.' },
        { status: 500 }
      );
    }

    // Get pricing info for metadata
    const price = getEnhancementPrice(category, enhancement_type);
    const categoryName = getCategoryDisplayName(category);
    const enhancementName = getEnhancementTypeName(enhancement_type);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      
      // Customer info
      customer_email: user.email,
      
      // Metadata for webhook processing
      metadata: {
        user_id: user.id,
        announcement_id: announcement.id,
        category: category,
        enhancement_type: enhancement_type,
        announcement_title: announcement.title,
        price_brl: price.toString(),
      },
      
      // Success/Cancel URLs
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/anuncios/${announcement_id}?enhancement_success=true&type=${enhancement_type}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/anuncios/${announcement_id}?enhancement_canceled=true`,
      
      // Additional settings
      billing_address_collection: 'auto',
      locale: 'pt-BR',
      
      // Payment intent data
      payment_intent_data: {
        description: `${enhancementName} - ${categoryName}: ${announcement.title}`,
        metadata: {
          announcement_id: announcement.id,
          enhancement_type: enhancement_type,
        },
      },
    });

    // Log checkout creation
    await supabase.from('verification_audit_log').insert({
      user_verification_id: verification.id,
      user_id: user.id,
      event_type: 'automated_check_completed',
      performed_by: user.id,
      performed_by_type: 'user',
      event_data: {
        action: 'enhancement_checkout_created',
        announcement_id: announcement.id,
        enhancement_type: enhancement_type,
        stripe_session_id: session.id,
        price_brl: price,
      },
    });

    return NextResponse.json({
      checkout_url: session.url,
      session_id: session.id,
      amount: price,
      currency: 'BRL',
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Erro Stripe: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao criar sessão de checkout. Tente novamente.' },
      { status: 500 }
    );
  }
}
