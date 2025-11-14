import Stripe from 'stripe';
import type StripeType from 'stripe';
import { apiVersion } from '../../../../packages/stripe/dist/src';

// Read pinned apiVersion from repo root config so scripts and app share the same value
const stripeOptions = {
  apiVersion: apiVersion,
  typescript: true,
} as unknown as StripeType.StripeConfig;

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }

  stripeInstance = new Stripe(key, stripeOptions);
  return stripeInstance;
}

// Product Price IDs (public values can be read at build time)
export const STRIPE_PRICES = {
  DESTAQUE: process.env.NEXT_PUBLIC_STRIPE_PRICE_DESTAQUE || '',
  MARKETING: process.env.NEXT_PUBLIC_STRIPE_PRICE_MARKETING || '',
};

// Helper function to create checkout session using lazy-initialized Stripe
export async function createCheckoutSession({
  priceId,
  listingId,
  userId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  listingId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'pix'], // Enable Pix for Brazil
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      listingId,
      userId,
    },
    locale: 'pt-BR',
  });

  return session;
}
