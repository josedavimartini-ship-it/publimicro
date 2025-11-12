import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

import type StripeType from 'stripe';
import { apiVersion } from '@publimicro/stripe';

// Read pinned apiVersion from repo root config so scripts and app share the same value
const stripeOptions = {
  apiVersion: apiVersion,
  typescript: true,
} as unknown as StripeType.StripeConfig;

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, stripeOptions);

// Product Price IDs
export const STRIPE_PRICES = {
  DESTAQUE: process.env.NEXT_PUBLIC_STRIPE_PRICE_DESTAQUE || "",
  MARKETING: process.env.NEXT_PUBLIC_STRIPE_PRICE_MARKETING || "",
};

// Helper function to create checkout session
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
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "pix"], // Enable Pix for Brazil
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
    locale: "pt-BR", // Brazilian Portuguese
  });

  return session;
}
