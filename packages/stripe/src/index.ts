import stripeConfig from '../stripe-config.json';
import Stripe from 'stripe';
import type StripeType from 'stripe';

export const apiVersion: string = stripeConfig.apiVersion;

export function createStripe(secretKey: string) {
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }
  const options = { apiVersion } as unknown as StripeType.StripeConfig;
  return new Stripe(secretKey, options);
}

export default {
  apiVersion,
  createStripe,
};
