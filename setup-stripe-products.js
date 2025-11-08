#!/usr/bin/env node

/**
 * PubliMicro - Stripe Products Setup Script
 * 
 * Creates all Stripe products for:
 * 1. Listing Enhancements (9 products: 3 categories × 3 types)
 * 2. Subscription Plans (2 products: Premium + Pro)
 * 
 * Run with: node setup-stripe-products.js
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Enhancement pricing (from enhancementPricing.ts)
const ENHANCEMENT_PRODUCTS = [
  // AcheMeCoisas (Items, Outdoor, Travel, Global, Shared)
  {
    category: 'items',
    type: 'highlight',
    name: 'Destaque HomePage - AcheMeCoisas',
    description: '30 dias de destaque na página inicial e topo da categoria. Máxima visibilidade para seu anúncio!',
    price: 1200, // R$ 12.00 in cents
    features: [
      '30 dias em destaque',
      'Topo da página inicial',
      'Destaque na categoria',
      'Badge "Em Destaque"',
      'Aumenta visibilidade em 5x'
    ]
  },
  {
    category: 'items',
    type: 'organic_marketing',
    name: 'Marketing Orgânico - AcheMeCoisas',
    description: 'Campanha profissional de marketing para seu anúncio. Nossa equipe divulga em redes sociais e otimiza SEO.',
    price: 7000, // R$ 70.00
    features: [
      'Posts em redes sociais',
      'SEO otimizado',
      'Criação de conteúdo',
      'Hashtags estratégicas',
      'Relatório de resultados'
    ]
  },
  {
    category: 'items',
    type: 'bundle',
    name: 'Pacote Completo - AcheMeCoisas',
    description: 'Destaque + Marketing Orgânico. Economize R$ 7! Máxima visibilidade e alcance para seu anúncio.',
    price: 7500, // R$ 75.00 (save R$ 7)
    features: [
      'Tudo do Destaque',
      'Tudo do Marketing',
      'Economize R$ 7,00',
      'Suporte prioritário',
      'Resultados em 48h'
    ]
  },

  // AcheMeMotors (Vehicles, Machinery, Marine)
  {
    category: 'vehicles',
    type: 'highlight',
    name: 'Destaque HomePage - AcheMeMotors',
    description: '30 dias de destaque para veículos. Venda mais rápido com maior visibilidade!',
    price: 2000, // R$ 20.00
    features: [
      '30 dias em destaque',
      'Topo da categoria veículos',
      'Badge "Destaque"',
      'Fotos em carrossel',
      'Aumenta conversão em 8x'
    ]
  },
  {
    category: 'vehicles',
    type: 'organic_marketing',
    name: 'Marketing Orgânico - AcheMeMotors',
    description: 'Campanha completa para veículos. Posts profissionais, vídeos e divulgação em grupos especializados.',
    price: 12000, // R$ 120.00
    features: [
      'Posts em redes sociais',
      'Vídeo promocional',
      'Divulgação em grupos',
      'SEO premium',
      'Relatório semanal'
    ]
  },
  {
    category: 'vehicles',
    type: 'bundle',
    name: 'Pacote Completo - AcheMeMotors',
    description: 'Destaque + Marketing. Economize R$ 10! Ideal para vender veículos rapidamente.',
    price: 13000, // R$ 130.00 (save R$ 10)
    features: [
      'Tudo do Destaque',
      'Tudo do Marketing',
      'Economize R$ 10,00',
      'Gerente de conta dedicado',
      'Venda garantida ou reembolso parcial'
    ]
  },

  // AcheMeProper (Properties)
  {
    category: 'properties',
    type: 'highlight',
    name: 'Destaque HomePage - AcheMeProper',
    description: '30 dias de destaque premium para imóveis. Máxima exposição para sua propriedade!',
    price: 3000, // R$ 30.00
    features: [
      '30 dias em destaque',
      'Topo de imóveis',
      'Badge "Premium"',
      'Tour virtual 360°',
      'Alcance 10x maior'
    ]
  },
  {
    category: 'properties',
    type: 'organic_marketing',
    name: 'Marketing Orgânico - AcheMeProper',
    description: 'Campanha completa para imóveis. Fotos profissionais, vídeos e divulgação em portais parceiros.',
    price: 18000, // R$ 180.00
    features: [
      'Fotografia profissional',
      'Vídeo aéreo com drone',
      'Tour virtual 360°',
      'Divulgação em portais',
      'Anúncios no Google'
    ]
  },
  {
    category: 'properties',
    type: 'bundle',
    name: 'Pacote Completo - AcheMeProper',
    description: 'Destaque + Marketing Premium. Economize R$ 15! Pacote profissional para imóveis de alto padrão.',
    price: 19500, // R$ 195.00 (save R$ 15)
    features: [
      'Tudo do Destaque',
      'Tudo do Marketing',
      'Economize R$ 15,00',
      'Corretor virtual 24/7',
      'Garantia de visibilidade'
    ]
  }
];

// Subscription plans
const SUBSCRIPTION_PRODUCTS = [
  {
    tier: 'premium',
    name: 'PubliMicro Premium',
    description: 'Plano Premium com mais anúncios e recursos avançados. Ideal para vendedores frequentes.',
    price: 3990, // R$ 39,90/month
    interval: 'month',
    trial_days: 7,
    features: [
      '10 anúncios/mês em AcheMeCoisas',
      '3 anúncios/mês em Imóveis',
      '3 anúncios/mês em Veículos',
      'Badge "Vendedor Premium"',
      'Suporte prioritário',
      'Analytics avançado',
      '7 dias grátis'
    ]
  },
  {
    tier: 'pro',
    name: 'PubliMicro Pro',
    description: 'Plano Profissional com anúncios ilimitados. Para vendedores e empresas.',
    price: 9990, // R$ 99,90/month
    interval: 'month',
    trial_days: 0,
    features: [
      'Anúncios ILIMITADOS',
      'Todas as categorias',
      'Badge "Vendedor Profissional"',
      'Gerente de conta dedicado',
      'API de integração',
      'Relatórios personalizados',
      'Prioridade máxima'
    ]
  }
];

async function createEnhancementProducts() {
  console.log('\n🎨 Creating Enhancement Products...\n');
  
  const priceIds = {};
  
  for (const product of ENHANCEMENT_PRODUCTS) {
    try {
      // Create product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: {
          category: product.category,
          enhancement_type: product.type,
          features: JSON.stringify(product.features)
        }
      });
      
      // Create price
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'brl',
        metadata: {
          category: product.category,
          enhancement_type: product.type
        }
      });
      
      // Store price ID for code generation
      if (!priceIds[product.category]) {
        priceIds[product.category] = {};
      }
      priceIds[product.category][product.type] = stripePrice.id;
      
      console.log(`✅ ${product.name}`);
      console.log(`   Product ID: ${stripeProduct.id}`);
      console.log(`   Price ID: ${stripePrice.id}`);
      console.log(`   Amount: R$ ${(product.price / 100).toFixed(2)}\n`);
      
    } catch (error) {
      console.error(`❌ Error creating ${product.name}:`, error.message);
    }
  }
  
  return priceIds;
}

async function createSubscriptionProducts() {
  console.log('\n💳 Creating Subscription Products...\n');
  
  const subscriptionPriceIds = {};
  
  for (const sub of SUBSCRIPTION_PRODUCTS) {
    try {
      // Create product
      const stripeProduct = await stripe.products.create({
        name: sub.name,
        description: sub.description,
        metadata: {
          tier: sub.tier,
          features: JSON.stringify(sub.features)
        }
      });
      
      // Create price (recurring)
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: sub.price,
        currency: 'brl',
        recurring: {
          interval: sub.interval,
          trial_period_days: sub.trial_days
        },
        metadata: {
          tier: sub.tier
        }
      });
      
      subscriptionPriceIds[sub.tier] = stripePrice.id;
      
      console.log(`✅ ${sub.name}`);
      console.log(`   Product ID: ${stripeProduct.id}`);
      console.log(`   Price ID: ${stripePrice.id}`);
      console.log(`   Amount: R$ ${(sub.price / 100).toFixed(2)}/${sub.interval}`);
      console.log(`   Trial: ${sub.trial_days} days\n`);
      
    } catch (error) {
      console.error(`❌ Error creating ${sub.name}:`, error.message);
    }
  }
  
  return subscriptionPriceIds;
}

function generateCodeSnippet(enhancementPriceIds, subscriptionPriceIds) {
  console.log('\n\n📝 UPDATE YOUR CODE WITH THESE PRICE IDs:\n');
  console.log('═'.repeat(80));
  console.log('\n// apps/publimicro/src/lib/enhancementPricing.ts');
  console.log('\nexport const STRIPE_PRICE_IDS: Record<AnnouncementCategory, Record<EnhancementType, string>> = {');
  
  // Generate enhancement price IDs
  console.log('  items: {');
  console.log(`    highlight: '${enhancementPriceIds.items?.highlight || 'price_xxxxx'}',`);
  console.log(`    organic_marketing: '${enhancementPriceIds.items?.organic_marketing || 'price_xxxxx'}',`);
  console.log(`    bundle: '${enhancementPriceIds.items?.bundle || 'price_xxxxx'}'`);
  console.log('  },');
  console.log('  vehicles: {');
  console.log(`    highlight: '${enhancementPriceIds.vehicles?.highlight || 'price_xxxxx'}',`);
  console.log(`    organic_marketing: '${enhancementPriceIds.vehicles?.organic_marketing || 'price_xxxxx'}',`);
  console.log(`    bundle: '${enhancementPriceIds.vehicles?.bundle || 'price_xxxxx'}'`);
  console.log('  },');
  console.log('  properties: {');
  console.log(`    highlight: '${enhancementPriceIds.properties?.highlight || 'price_xxxxx'}',`);
  console.log(`    organic_marketing: '${enhancementPriceIds.properties?.organic_marketing || 'price_xxxxx'}',`);
  console.log(`    bundle: '${enhancementPriceIds.properties?.bundle || 'price_xxxxx'}'`);
  console.log('  },');
  console.log('  // Copy items pricing for other categories');
  console.log('  machinery: { /* same as vehicles */ },');
  console.log('  marine: { /* same as vehicles */ },');
  console.log('  outdoor: { /* same as items */ },');
  console.log('  travel: { /* same as items */ },');
  console.log('  global: { /* same as items */ },');
  console.log('  shared: { /* same as items */ }');
  console.log('};');
  
  console.log('\n\n// apps/publimicro/src/lib/subscriptionPricing.ts');
  console.log('\nexport const SUBSCRIPTION_PRICE_IDS = {');
  console.log(`  premium: '${subscriptionPriceIds.premium || 'price_xxxxx'}',`);
  console.log(`  pro: '${subscriptionPriceIds.pro || 'price_xxxxx'}'`);
  console.log('};');
  
  console.log('\n' + '═'.repeat(80));
}

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║         PubliMicro - Stripe Products Setup Script            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('\n❌ ERROR: STRIPE_SECRET_KEY not found in environment variables');
    console.error('\nPlease set it in your .env.local file:');
    console.error('STRIPE_SECRET_KEY=sk_test_...\n');
    process.exit(1);
  }
  
  console.log('\n⚙️  Using Stripe Secret Key:', process.env.STRIPE_SECRET_KEY.substring(0, 15) + '...');
  console.log('\n📦 Creating 11 products total:');
  console.log('   • 9 Enhancement products (3 categories × 3 types)');
  console.log('   • 2 Subscription products (Premium + Pro)');
  console.log('\n⏳ This will take about 30 seconds...\n');
  
  try {
    // Create products
    const enhancementPriceIds = await createEnhancementProducts();
    const subscriptionPriceIds = await createSubscriptionProducts();
    
    // Generate code snippet
    generateCodeSnippet(enhancementPriceIds, subscriptionPriceIds);
    
    console.log('\n\n✅ SUCCESS! All Stripe products created successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Copy the price IDs above into your code');
    console.log('   2. Test checkout flow in development');
    console.log('   3. Setup webhook endpoint for production');
    console.log('   4. Configure Stripe webhook secret in .env.local\n');
    
  } catch (error) {
    console.error('\n\n❌ FATAL ERROR:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script
main();
