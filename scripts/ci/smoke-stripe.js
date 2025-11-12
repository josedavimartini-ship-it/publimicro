#!/usr/bin/env node
const { createStripe } = require('@publimicro/stripe');

async function main() {
  const key = process.env.STRIPE_TEST_KEY;
  const priceId = process.env.SMOKE_STRIPE_PRICE_ID;

  if (!key || !priceId) {
    console.warn('Stripe smoke test skipped: STRIPE_TEST_KEY and/or SMOKE_STRIPE_PRICE_ID not provided.');
    console.warn('Set these environment variables to enable the smoke test (used in CI to validate Stripe integration).');
    // Skip the smoke test when secrets are not available (useful for forks and contributors)
    process.exit(0);
  }

  const stripe = createStripe(key);

  try {
    console.log(JSON.stringify({ action: 'stripe.retrievePrice', priceId }));
    const price = await stripe.prices.retrieve(priceId);
    console.log(JSON.stringify({ action: 'stripe.priceRetrieved', id: price.id, type: price.type }));
    process.exit(0);
  } catch (err) {
    console.error(JSON.stringify({ action: 'stripe.smokeFailed', error: err && err.message ? err.message : String(err) }));
    process.exit(2);
  }
}

main();
