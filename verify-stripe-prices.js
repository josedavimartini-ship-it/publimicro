// Script para verificar se os preços são One-time ou Recurring
// Execute: STRIPE_SECRET_KEY=sk_test_... node verify-stripe-prices.js

const path = require('path');
let createStripe;
try {
  createStripe = require('@publimicro/stripe').createStripe;
} catch (e) {
  // fallback to local built package
  // eslint-disable-next-line global-require
  createStripe = require(path.join(__dirname, 'packages', 'stripe', 'dist', 'src', 'index.js')).createStripe;
}

async function verifyPrices() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('\n❌ ERROR: STRIPE_SECRET_KEY not found in environment variables');
    process.exit(1);
  }

  const stripe = createStripe(process.env.STRIPE_SECRET_KEY);

  console.log('🔍 Verificando preços do Stripe...\n');

  const priceIds = {
    DESTAQUE: 'price_1SQXY4FTa31reGpf1w2KTfGA',
    MARKETING: 'price_1SQXZxFTa31reGpf7HGHw8In'
  };

  for (const [name, priceId] of Object.entries(priceIds)) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      
      console.log(`📦 ${name}:`);
      console.log(`   Price ID: ${priceId}`);
      const amountBRL = Math.round(price.unit_amount / 100);
      console.log(`   Amount: R$ ${amountBRL} (rounded whole BRL)`);
      if (price.unit_amount % 100 !== 0) {
        console.log('   ⚠️  NOTE: price includes cents — consider rounding to whole BRL');
      }
      console.log(`   Type: ${price.type}`);
      console.log(`   Recurring: ${price.recurring ? 'SIM ❌ (Assinatura)' : 'NÃO ✅ (One-time)'}`);
      
      if (price.recurring) {
        console.log(`   ⚠️  PROBLEMA: Este preço é RECURRING (${price.recurring.interval})`);
        console.log(`   💡 Você precisa criar um novo preço One-time!`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`❌ Erro ao verificar ${name}: ${error.message}\n`);
    }
  }
}

verifyPrices();
