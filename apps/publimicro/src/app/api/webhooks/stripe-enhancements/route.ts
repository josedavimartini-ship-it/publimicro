import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { EnhancementType } from '@/lib/enhancementPricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: ('2024-11-20.acacia' as any),
});

// Use service role for webhook (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/webhooks/stripe-enhancements
 * 
 * Stripe webhook handler for enhancement purchases
 * 
 * Events handled:
 * - checkout.session.completed: Create enhancement record
 * - payment_intent.succeeded: Confirm payment
 * - payment_intent.payment_failed: Handle failure
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);

  const {
    user_id,
    announcement_id,
    category,
    enhancement_type,
    price_brl,
  } = session.metadata || {};

  if (!user_id || !announcement_id || !enhancement_type) {
    console.error('Missing required metadata in checkout session');
    return;
  }

  // Create enhancement record
  const enhancementData = {
    announcement_id,
    user_id,
    enhancement_type: enhancement_type as EnhancementType,
    
    // Pricing
    price_paid: parseFloat(price_brl || '0'),
    currency: 'BRL',
    
    // Payment info
    stripe_payment_id: session.payment_intent as string,
    stripe_session_id: session.id,
    payment_status: 'completed',
    
    // Activation (highlights activate immediately)
    status: enhancement_type === 'highlight' ? 'active' : 'pending',
    activated_at: enhancement_type === 'highlight' ? new Date().toISOString() : null,
    expires_at: enhancement_type === 'highlight' 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      : null,
    
    // Marketing campaigns start pending, need manual activation
    campaign_status: enhancement_type === 'organic_marketing' || enhancement_type === 'bundle'
      ? 'pending_start'
      : null,
  };

  const { data: enhancement, error: insertError } = await supabase
    .from('listing_enhancements')
    .insert(enhancementData)
    .select()
    .single();

  if (insertError) {
    console.error('Error creating enhancement record:', insertError);
    throw insertError;
  }

  console.log('Enhancement created:', enhancement.id);

  // If it's a bundle, create both highlight and marketing records
  if (enhancement_type === 'bundle') {
    // The bundle itself is tracked as one record
    // The announcement gets both benefits:
    // 1. Immediate highlight (via activated_at)
    // 2. Marketing campaign (via campaign_status)
    
    // Update announcement to mark it as highlighted
    await supabase
      .from('announcements')
      .update({
        is_highlighted: true,
        highlighted_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', announcement_id);
  }

  // Update announcement if highlight purchased
  if (enhancement_type === 'highlight') {
    await supabase
      .from('announcements')
      .update({
        is_highlighted: true,
        highlighted_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', announcement_id);
  }

  // TODO: Send confirmation email to user
  // TODO: Notify marketing team if organic_marketing or bundle purchased
}

/**
 * Handle successful payment intent
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment_intent.succeeded:', paymentIntent.id);

  const { announcement_id } = paymentIntent.metadata || {};

  if (!announcement_id) {
    console.error('Missing announcement_id in payment intent metadata');
    return;
  }

  // Update enhancement payment status
  const { error: updateError } = await supabase
    .from('listing_enhancements')
    .update({
      payment_status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_id', paymentIntent.id);

  if (updateError) {
    console.error('Error updating enhancement payment status:', updateError);
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment_intent.payment_failed:', paymentIntent.id);

  const { announcement_id } = paymentIntent.metadata || {};

  if (!announcement_id) {
    console.error('Missing announcement_id in payment intent metadata');
    return;
  }

  // Update enhancement payment status
  const { error: updateError } = await supabase
    .from('listing_enhancements')
    .update({
      payment_status: 'failed',
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_id', paymentIntent.id);

  if (updateError) {
    console.error('Error updating enhancement payment status:', updateError);
  }

  // TODO: Send payment failure notification to user
}

/**
 * GET method not allowed
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
