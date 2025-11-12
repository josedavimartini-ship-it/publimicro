const stripeConfig = require('./stripe-config.json');

function createStripe(secretKey) {
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }
  const Stripe = require('stripe');
  return new Stripe(secretKey, { apiVersion: stripeConfig.apiVersion });
}

module.exports = {
  apiVersion: stripeConfig.apiVersion,
  createStripe,
};
