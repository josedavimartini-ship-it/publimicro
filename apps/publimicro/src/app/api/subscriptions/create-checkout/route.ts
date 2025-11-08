import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ============================================
    // VERIFICAÇÃO DE IDENTIDADE OBRIGATÓRIA
    // ============================================
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('verification_status, email, full_name')
      .eq('user_id', session.user.id)
      .single();

    if (profile?.verification_status !== 'approved') {
      return NextResponse.json(
        { 
          error: 'Verificação de identidade necessária',
          requiresVerification: true,
          verificationStatus: profile?.verification_status || 'not_started'
        },
        { status: 403 }
      );
    }

    const { priceId, planId } = await request.json();

    if (!priceId || !planId) {
      return NextResponse.json(
        { error: 'Price ID e Plan ID são obrigatórios' },
        { status: 400 }
      );
    }

    // Create or get Stripe customer
    let customerId: string;

    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: profile.email || session.user.email,
        name: profile.full_name,
        metadata: {
          userId: session.user.id,
        },
      });

      // Save to database
      await supabase.from('stripe_customers').insert({
        user_id: session.user.id,
        stripe_customer_id: customer.id,
      });

      customerId = customer.id;
    }

    // Create Stripe Checkout Session for subscription
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/assinatura/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/assinatura?cancelled=true`,
      metadata: {
        userId: session.user.id,
        planId,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planId,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating subscription checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
