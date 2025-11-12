// Script para verificar se os preços são One-time ou Recurring
// Execute: STRIPE_SECRET_KEY=sk_test_... node verify-stripe-prices.js

const { createStripe } = require('@publimicro/stripe');

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
      console.log(`   Amount: R$ ${(price.unit_amount / 100).toFixed(2)}`);
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
