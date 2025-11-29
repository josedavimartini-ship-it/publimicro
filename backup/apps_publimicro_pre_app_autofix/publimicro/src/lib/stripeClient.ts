import Stripe from 'stripe';
import type StripeType from 'stripe';

const stripeOptions = {
  apiVersion: '2025-09-30.clover',
  typescript: true,
} as unknown as StripeType.StripeConfig;

let stripeInstance: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  if (stripeInstance) return stripeInstance;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripeInstance = new Stripe(key, stripeOptions);
  return stripeInstance;
}