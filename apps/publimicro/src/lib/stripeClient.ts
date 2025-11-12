import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

import type StripeType from 'stripe';

const stripeOptions = {
  apiVersion: '2025-09-30.clover',
  typescript: true,
} as unknown as StripeType.StripeConfig;

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, stripeOptions);