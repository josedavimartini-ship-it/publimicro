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

const fs = require('fs');
const path = require('path');
let createStripe;
try {
  // prefer workspace package if node resolution is configured
  createStripe = require('@publimicro/stripe').createStripe;
} catch (e) {
  // fallback to local package build (dist)
  // eslint-disable-next-line global-require
  createStripe = require(path.join(__dirname, 'packages', 'stripe', 'dist', 'src', 'index.js')).createStripe;
}
let stripe; // assigned in main after env check
let fetchClient;

// Operational constants
const DISCOUNT_PERCENT = 30; // target: 30% cheaper than competitor or current price
const FREE_ADS_PER_NEW_USER = 2;

// Path to competitor minima file (populated by research)
const COMPETITOR_MIN_FILE = path.join(__dirname, 'data', 'competitor_min_prices.json');
// FX cache for exchangerate.host responses
const FX_CACHE_FILE = path.join(__dirname, 'data', 'fx-cache.json');
const FX_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function loadCompetitorMinPrices() {
  try {
    if (fs.existsSync(COMPETITOR_MIN_FILE)) {
      const raw = fs.readFileSync(COMPETITOR_MIN_FILE, 'utf8');
      return JSON.parse(raw || '{}');
    }
  } catch (e) {
    console.warn('Could not read competitor minima file:', e.message);
  }
  return {};
}

function computeTargetPrice(baseCents, competitorMinCents) {
  const source = typeof competitorMinCents === 'number' && competitorMinCents > 0 ? competitorMinCents : baseCents;
  const discounted = Math.round(source * (1 - DISCOUNT_PERCENT / 100));
  // Round to whole BRL (no cents) as requested: nearest 100 cents
  const rounded = Math.round(discounted / 100) * 100;
  return Math.max(100, rounded);
}

// Async helpers to support competitor minima expressed in foreign currencies
async function asyncComputeTargetPrice(baseCents, competitorVal) {
  // competitorVal may be a number (BRL cents) or an object { amount: number, currency: 'ARS' }
  let sourceCents = baseCents;

  if (typeof competitorVal === 'number' && competitorVal > 0) {
    sourceCents = competitorVal;
  } else if (competitorVal && typeof competitorVal === 'object' && competitorVal.amount) {
    try {
      const brlCents = await convertToBRLCents(competitorVal.amount, competitorVal.currency);
      if (brlCents > 0) sourceCents = brlCents;
    } catch (e) {
      console.warn('FX conversion failed, falling back to base price:', e.message);
    }
  }

  const discounted = Math.round(sourceCents * (1 - DISCOUNT_PERCENT / 100));
  // Round to whole BRL (no cents): nearest 100 cents
  const rounded = Math.round(discounted / 100) * 100;
  return Math.max(100, rounded);
}

function getFetch() {
  if (fetchClient) return fetchClient;
  if (typeof fetch !== 'undefined') {
    fetchClient = fetch.bind(global);
  } else {
    try {
      // eslint-disable-next-line global-require
      fetchClient = require('node-fetch');
    } catch (e) {
      throw new Error('No fetch available. Please run on Node 18+ or install node-fetch.');
    }
  }
  return fetchClient;
}

function readFxCache() {
  try {
    if (fs.existsSync(FX_CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(FX_CACHE_FILE, 'utf8') || '{}');
    }
  } catch (e) {
    return {};
  }
  return {};
}

function writeFxCache(cache) {
  try {
    fs.writeFileSync(FX_CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (e) {
    // ignore write errors
  }
}

async function getFxRate(from, to) {
  from = (from || '').toUpperCase();
  to = (to || '').toUpperCase();
  if (!from || !to || from === to) return 1;
  const key = `${from}_${to}`;
  const cache = readFxCache();
  const now = Date.now();
  if (cache[key] && (now - cache[key].ts) < FX_TTL_MS) return cache[key].rate;

  const fetch = getFetch();
  const base = `https://api.exchangerate.host/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=1`;
  const apikey = process.env.FX_API_KEY;
  const url = apikey ? `${base}&apikey=${encodeURIComponent(apikey)}` : base;

  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`FX fetch failed: ${res.status} ${res.statusText}`);
  const body = await res.json();
  const rate = (body && (body.info && body.info.rate)) ? body.info.rate : (body && body.result ? body.result : null);
  if (!rate) throw new Error('FX rate not found in response');
  cache[key] = { rate, ts: now };
  writeFxCache(cache);
  return rate;
}

async function convertToBRLCents(amountMajor, currency) {
  if (!currency) throw new Error('currency required');
  const rate = await getFxRate(currency, 'BRL');
  const brlMajor = amountMajor * rate; // in BRL major units
  const brlCents = Math.round(brlMajor * 100);
  return brlCents;
}

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
  
  const enhancementPriceIds = {};
  const competitorMin = loadCompetitorMinPrices();
  const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run');

  for (const product of ENHANCEMENT_PRODUCTS) {
    try {
      // Idempotent product creation: try to reuse by name
      let stripeProduct;
      const existing = await stripe.products.list({ limit: 100 });
      stripeProduct = existing.data.find(p => p.name === product.name) || null;
      if (!stripeProduct) {
        if (DRY_RUN) {
          console.log(`DRY-RUN: would create product '${product.name}' (category=${product.category} enhancement_type=${product.type})`);
          stripeProduct = { id: `dryprod_${product.category}_${product.type}` };
        } else {
          stripeProduct = await stripe.products.create({
            name: product.name,
            description: product.description,
            metadata: {
              category: product.category,
              enhancement_type: product.type,
              features: JSON.stringify(product.features),
              free_ads_included: FREE_ADS_PER_NEW_USER
            }
          });
        }
      }

      // Determine target price (30% cheaper than competitor min if present, otherwise 30% cheaper than current value)
      const compKey = `${product.category}.${product.type}`;
      const compVal = (competitorMin && competitorMin[compKey]) ? competitorMin[compKey] : null;
      const targetAmount = await asyncComputeTargetPrice(product.price, compVal);

      // Reuse existing price if same amount exists for this product
      const prices = await stripe.prices.list({ product: stripeProduct.id, limit: 100 });
      let stripePrice = prices.data.find(p => p.unit_amount === targetAmount && p.currency === 'brl');
      if (!stripePrice) {
        if (DRY_RUN) {
          console.log(`DRY-RUN: would create price for product ${stripeProduct.id}: unit_amount=${targetAmount} BRL cents`);
          stripePrice = { id: `dryprice_${stripeProduct.id}_${targetAmount}`, unit_amount: targetAmount, currency: 'brl' };
        } else {
          stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: targetAmount,
            currency: 'brl',
            metadata: {
              category: product.category,
              enhancement_type: product.type,
              pricing_source: compVal ? 'competitor_min' : 'current_base'
            }
          });
        }
      }
      
      // Store price ID for code generation
      if (!enhancementPriceIds[product.category]) {
        enhancementPriceIds[product.category] = {};
      }
      enhancementPriceIds[product.category][product.type] = stripePrice.id;
      
      console.log(`✅ ${product.name}`);
      console.log(`   Product ID: ${stripeProduct.id}`);
      console.log(`   Price ID: ${stripePrice.id}`);
      console.log(`   Amount: R$ ${(stripePrice.unit_amount / 100).toFixed(2)}\n`);
      
    } catch (error) {
      console.error(`❌ Error creating ${product.name}:`, error.message);
    }
  }
  
  return enhancementPriceIds;
}

async function createSubscriptionProducts() {
  console.log('\n💳 Creating Subscription Products...\n');
  
  const subscriptionPriceIds = {};
  // load competitor minima (optional)
  const competitorMin = loadCompetitorMinPrices();
  const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run');

  for (const sub of SUBSCRIPTION_PRODUCTS) {
    try {
      // Idempotent product creation: try to reuse by name
      let stripeProduct;
      const existing = await stripe.products.list({ limit: 100 });
      stripeProduct = existing.data.find(p => p.name === sub.name) || null;
      if (!stripeProduct) {
        if (DRY_RUN) {
          console.log(`DRY-RUN: would create product '${sub.name}' (tier=${sub.tier})`);
          stripeProduct = { id: `dryprod_subscription_${sub.tier}` };
        } else {
          stripeProduct = await stripe.products.create({
            name: sub.name,
            description: sub.description,
            metadata: {
              tier: sub.tier,
              features: JSON.stringify(sub.features)
            }
          });
        }
      }

      // Determine target price for subscription (use competitor minima if available)
      const compKey = `subscription.${sub.tier}`;
      const compVal = (competitorMin && competitorMin[compKey]) ? competitorMin[compKey] : null;
      const targetAmount = await asyncComputeTargetPrice(sub.price, compVal);

      // Reuse existing recurring price if same exists for this product
      const prices = await stripe.prices.list({ product: stripeProduct.id, limit: 100 });
      let stripePrice = prices.data.find(p => p.unit_amount === targetAmount && p.recurring && p.recurring.interval === sub.interval && p.currency === 'brl');
      if (!stripePrice) {
        if (DRY_RUN) {
          console.log(`DRY-RUN: would create recurring price for product ${stripeProduct.id}: unit_amount=${targetAmount} BRL cents interval=${sub.interval}`);
          stripePrice = { id: `dryprice_${stripeProduct.id}_${targetAmount}`, unit_amount: targetAmount, currency: 'brl', recurring: { interval: sub.interval } };
        } else {
          stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: targetAmount,
            currency: 'brl',
            recurring: {
              interval: sub.interval,
              trial_period_days: sub.trial_days
            },
            metadata: {
              tier: sub.tier,
              pricing_source: compVal ? 'competitor_min' : 'current_base'
            }
          });
        }
      }
      
      subscriptionPriceIds[sub.tier] = stripePrice.id;
      
      console.log(`✅ ${sub.name}`);
      console.log(`   Product ID: ${stripeProduct.id}`);
      console.log(`   Price ID: ${stripePrice.id}`);
      console.log(`   Amount: R$ ${(stripePrice.unit_amount / 100).toFixed(2)}/${sub.interval}`);
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

  // Create stripe client after validating environment
  stripe = createStripe(process.env.STRIPE_SECRET_KEY);
  
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
