# 🎯 Announcement System Implementation Guide

**Status:** Migration created ✅ | Implementation ready to begin 🚀

---

## 📋 Quick Start

### 1. Run Database Migration

**Option A: Supabase Dashboard (RECOMMENDED)**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/rkrbygsutlgbczvpzwwo/sql/new)
2. Copy entire contents of: `supabase/migrations/20251107000001_create_announcement_system.sql`
3. Paste into SQL Editor
4. Click "Run" button
5. Verify success message

**Option B: PostgreSQL Client (psql)**
```powershell
psql -h aws-0-sa-east-1.pooler.supabase.com -U postgres.rkrbygsutlgbczvpzwwo -d postgres -f supabase/migrations/20251107000001_create_announcement_system.sql
```
Password: `publimicro2025`

**Option C: Node.js Script**
```powershell
node run-announcement-migration.js
```

### 2. Verify Migration Success

Go to Supabase Dashboard > Table Editor and verify these tables exist:
- ✅ `user_subscriptions`
- ✅ `user_credits`
- ✅ `announcements`
- ✅ `credit_transactions`
- ✅ `announcement_views`
- ✅ `oauth_accounts`
- ✅ `referral_program`
- ✅ `announcement_favorites`
- ✅ `announcement_reports`

---

## 🗃️ Database Schema Overview

### 1. user_subscriptions
**Purpose:** Manages subscription tiers (Free, Premium, Pro)

**Key Fields:**
- `tier`: 'free' | 'premium' | 'pro'
- `status`: 'active' | 'canceled' | 'expired' | 'past_due' | 'trialing'
- `stripe_customer_id`, `stripe_subscription_id`: Stripe integration
- `current_period_start`, `current_period_end`: Billing cycle
- `trial_ends_at`: For 7-day Premium trial

**Limits by Tier:**
| Tier    | Items | Properties | Vehicles | Photos | AI | Featured |
|---------|-------|------------|----------|--------|-----|----------|
| Free    | 2/mo  | 1/mo       | 1/mo     | 6      | ❌  | ❌       |
| Premium | 10/mo | 3/mo       | 3/mo     | 15     | ✅  | ✅       |
| Pro     | ∞     | ∞          | ∞        | 30     | ✅+ | ✅       |

### 2. user_credits
**Purpose:** Tracks monthly usage and credit balance

**Key Fields:**
- `total_credits`, `free_credits`, `paid_credits`: Credit balance
- `items_posted_this_month`: Count of items posted (reset monthly)
- `properties_posted_this_month`: Count of properties posted
- `vehicles_posted_this_month`: Count of vehicles + machinery + marine
- `last_monthly_reset`: Last reset date (auto-reset on 1st of month)

**Auto-Reset Logic:**
Free tier users get fresh monthly limits on the 1st of each month via function `reset_monthly_posting_limits()`.

### 3. announcements
**Purpose:** Unified table for ALL listing types (9 categories)

**Categories:**
- `items` - AcheMeCoisas (general classifieds)
- `properties` - AcheMeProper (real estate)
- `vehicles` - AcheMeMotors (cars, motorcycles)
- `machinery` - AcheMeMachina (tractors, construction equipment)
- `marine` - AcheMeMarine (boats, jet-skis)
- `outdoor` - AcheMeOutdoor (camping, sports gear)
- `travel` - AcheMeJourney (trips, experiences)
- `global` - AcheMeGlobal (international trade)
- `shared` - AcheMeShare (sharangas - shared/rental items)

**Key Features:**
- **Full-text search**: Portuguese language search via `search_vector` (tsvector)
- **Auto-slug generation**: SEO-friendly URLs (`generate_announcement_slug()`)
- **Geographic search**: Latitude/longitude for location-based queries
- **Status workflow**: draft → pending → active → sold/expired
- **AI enhancement**: Fields for AI-generated improvements
- **Rich media**: Photos (JSON array), video URL, thumbnails
- **Engagement tracking**: views, favorites, contacts, WhatsApp clicks
- **Moderation**: Admin approval, rejection reasons, flagging

**Status Flow:**
```
draft → pending → active → [sold/expired/paused/removed]
                    ↓
                 rejected
```

### 4. credit_transactions
**Purpose:** Audit trail for all credit movements

**Transaction Types:**
- `purchase` - User bought credits with money
- `earned` - Referral rewards, promotions
- `spent` - Used for creating listing
- `refund` - Payment refunded
- `expired` - Free credits expired
- `bonus` - Admin granted bonus
- `subscription` - Credits from Premium/Pro tier

### 5. announcement_views
**Purpose:** Analytics tracking with deduplication

**Key Features:**
- Unique constraint: 1 view per user/IP per hour
- Session tracking: `session_id` for multi-page visits
- UTM parameters: Source attribution (utm_source, utm_medium, utm_campaign)
- Engagement metrics: Time spent, scroll depth, WhatsApp/phone clicks
- Geolocation: City, state, country (from IP or user profile)

### 6. oauth_accounts
**Purpose:** Multi-provider OAuth authentication

**Supported Providers:**
- Google (OAuth 2.0)
- Microsoft (Azure AD)
- Apple (Sign in with Apple)
- Facebook
- GitHub
- LinkedIn

**Key Features:**
- Token management: Access token, refresh token, expiry
- Account linking: Multiple OAuth providers per user
- Primary account: Designate which provider is primary
- Email verification: Track verified emails from providers

### 7. referral_program
**Purpose:** Referral rewards system

**Flow:**
1. User gets unique referral code
2. Invites friend via email/WhatsApp/link
3. Friend signs up using code
4. Both receive credits when friend verifies account

**Rewards:**
- Referrer: 5 credits + 20% discount on next subscription
- Referee: 3 credits + 10% off first Premium purchase

### 8. announcement_favorites
**Purpose:** User saved listings with organization

**Features:**
- Folder organization: Group favorites into folders
- Private notes: Add notes visible only to user
- Price alerts: Get notified when price drops below threshold

### 9. announcement_reports
**Purpose:** User flagging with admin moderation

**Report Reasons:**
- spam, fraud, inappropriate, duplicate, wrong_category, prohibited_item, misleading, offensive, other

**Workflow:**
```
User reports → pending → investigating → resolved/dismissed
```

---

## 🎨 Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1)

#### Day 1-2: Subscription Management API
**Files to create:**
- `apps/publimicro/src/app/api/subscriptions/create/route.ts`
- `apps/publimicro/src/app/api/subscriptions/upgrade/route.ts`
- `apps/publimicro/src/app/api/subscriptions/cancel/route.ts`
- `apps/publimicro/src/app/api/subscriptions/status/route.ts`

**Key Functions:**
```typescript
// Create subscription
POST /api/subscriptions/create
Body: { user_id, tier: 'free' | 'premium' | 'pro' }
Response: { subscription_id, status, current_period_end }

// Upgrade subscription
POST /api/subscriptions/upgrade
Body: { user_id, new_tier }
Response: { prorated_charge, new_period_end }

// Cancel subscription
POST /api/subscriptions/cancel
Body: { user_id, immediate: boolean }
Response: { canceled_at, active_until }

// Get subscription status
GET /api/subscriptions/status?user_id=xxx
Response: { tier, status, usage: {...}, limits: {...} }
```

#### Day 3: Posting Limits Middleware
**Files to create:**
- `apps/publimicro/src/lib/postingLimits.ts`
- `apps/publimicro/src/middleware/checkPostingLimits.ts`

**Core Function:**
```typescript
export async function canUserPost(
  userId: string, 
  category: AnnouncementCategory
): Promise<{
  allowed: boolean;
  reason?: string;
  remaining?: number;
  limit?: number;
}> {
  // 1. Get subscription tier
  // 2. Get monthly usage from user_credits
  // 3. Check if monthly reset needed
  // 4. Compare usage vs limits
  // 5. Return decision
}
```

**Usage in API:**
```typescript
// Before creating announcement
const { allowed, reason } = await canUserPost(user.id, 'properties');

if (!allowed) {
  return Response.json({ 
    error: reason,
    upgrade_url: '/planos' 
  }, { status: 403 });
}
```

#### Day 4-5: Announcement CRUD API
**Files to create:**
- `apps/publimicro/src/app/api/announcements/create/route.ts`
- `apps/publimicro/src/app/api/announcements/[id]/route.ts` (GET, PATCH, DELETE)
- `apps/publimicro/src/app/api/announcements/search/route.ts`

**Key Endpoints:**
```typescript
// Create announcement (draft)
POST /api/announcements/create
Body: { category, title, description, price, photos, location, attributes }
Response: { id, status: 'draft', slug }

// Update announcement
PATCH /api/announcements/[id]
Body: { partial announcement fields }
Response: { updated announcement }

// Publish announcement (draft → pending/active)
POST /api/announcements/[id]/publish
Response: { status: 'pending' | 'active', published_at }

// Search announcements
GET /api/announcements/search?q=casa&category=properties&city=São Paulo
Response: { results: [...], total, page, per_page }

// Get user's announcements
GET /api/announcements?user_id=xxx&status=active
Response: { announcements: [...] }
```

---

### Phase 2: AI Enhancement (Week 2)

#### Day 6-7: AI Listing Assistant API
**Files to create:**
- `apps/publimicro/src/app/api/ai/enhance-listing/route.ts`
- `apps/publimicro/src/app/api/ai/suggest-price/route.ts`
- `apps/publimicro/src/app/api/ai/detect-category/route.ts`
- `apps/publimicro/src/app/api/ai/analyze-photos/route.ts`

**Environment Variables:**
```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
```

**AI Enhancement Endpoint:**
```typescript
POST /api/ai/enhance-listing
Body: {
  category: 'properties',
  title: 'Casa para vender',
  description: 'Casa boa, 3 quartos',
  price: 500000,
  photos: ['url1', 'url2'],
  location: { city: 'São Paulo', neighborhood: 'Vila Madalena' }
}

Response: {
  suggestions: {
    titles: [
      'Casa Moderna 3 Quartos - Vila Madalena, SP | R$ 500.000',
      'Sobrado Vila Madalena: 3 Dorm, Aceita Financiamento',
      'Imóvel Residencial 3 Quartos - Região Nobre SP'
    ],
    enhanced_description: 'Casa residencial moderna...',
    price_range: {
      min: 450000,
      max: 550000,
      recommended: 495000,
      market_analysis: 'Preço está 10% acima da média...'
    },
    category_confidence: 0.95,
    subcategory: 'casa',
    tags: ['3 quartos', 'Vila Madalena', 'aceita financiamento'],
    photo_feedback: [
      'Adicione foto da fachada',
      'Inclua foto do banheiro',
      'Foto da cozinha está escura'
    ],
    seo_score: 0.87
  }
}
```

**Implementation:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { category, title, description, price, location } = await req.json();
  
  // Generate enhanced titles
  const titlePrompt = `
    You are a Brazilian classified ads expert. Generate 3 SEO-optimized titles 
    for this listing:
    
    Category: ${category}
    Current title: ${title}
    Location: ${location.neighborhood}, ${location.city}
    Price: R$ ${price.toLocaleString('pt-BR')}
    
    Requirements:
    - Include key features
    - Add location for SEO
    - Max 200 characters
    - In Portuguese
    - Compelling and professional
  `;
  
  const titleResponse = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: titlePrompt }],
    temperature: 0.7,
    max_tokens: 300
  });
  
  // ... Similar for description, price, etc.
  
  return Response.json({ suggestions });
}
```

---

### Phase 3: Payment Integration (Week 2)

#### Day 8-9: Stripe Checkout & Webhooks
**Files to create:**
- `apps/publimicro/src/app/api/stripe/create-checkout/route.ts`
- `apps/publimicro/src/app/api/stripe/webhook/route.ts`
- `apps/publimicro/src/app/api/stripe/create-customer/route.ts`
- `apps/publimicro/src/app/api/stripe/manage-subscription/route.ts`

**Stripe Products Setup:**
```typescript
// Create products in Stripe Dashboard or via API
const products = {
  premium: {
    name: 'PubliMicro Premium',
    price: 3990, // R$ 39,90 in cents
    currency: 'BRL',
    interval: 'month',
    features: [
      '10 anúncios de itens/mês',
      '3 anúncios de imóveis/mês',
      '3 anúncios de veículos/mês',
      'Otimização com IA',
      'Selo de destaque',
      'Atualização automática a cada 3 dias',
      'Suporte prioritário'
    ]
  },
  pro: {
    name: 'PubliMicro Pro',
    price: 9990, // R$ 99,90
    currency: 'BRL',
    interval: 'month',
    features: [
      'Anúncios ilimitados',
      'Até 30 fotos por anúncio',
      'Vídeos incorporados',
      'IA avançada + sugestão de preços',
      'Selo gold de verificado',
      'Atualização diária automática',
      'Topo dos resultados',
      'Análises avançadas',
      'Gestão de leads',
      'Selo de verificado'
    ]
  }
};
```

**Checkout Session:**
```typescript
// apps/publimicro/src/app/api/stripe/create-checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { user_id, tier, email } = await req.json();
  
  const priceIds = {
    premium: process.env.STRIPE_PREMIUM_PRICE_ID!,
    pro: process.env.STRIPE_PRO_PRICE_ID!
  };
  
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    payment_method_types: ['card', 'boleto'],
    line_items: [{
      price: priceIds[tier],
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/planos`,
    metadata: { user_id, tier },
    subscription_data: {
      trial_period_days: 7, // 7-day trial for Premium
      metadata: { user_id, tier }
    }
  });
  
  return Response.json({ sessionId: session.id });
}
```

**Webhook Handler:**
```typescript
// apps/publimicro/src/app/api/stripe/webhook/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  
  const event = stripe.webhooks.constructEvent(
    body, 
    sig, 
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCancel(event.data.object);
      break;
      
    case 'customer.subscription.trial_will_end':
      await handleTrialEnding(event.data.object);
      break;
  }
  
  return Response.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { user_id, tier } = session.metadata!;
  
  // Create or update subscription in database
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id,
      tier,
      status: session.mode === 'subscription' ? 'trialing' : 'active',
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      stripe_price_id: session.line_items?.data[0].price.id,
      price_paid: session.amount_total! / 100,
      currency: session.currency,
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      trial_ends_at: session.mode === 'subscription' 
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        : null,
      is_trial: session.mode === 'subscription'
    });
    
  if (error) {
    console.error('Failed to create subscription:', error);
    throw error;
  }
  
  // Send welcome email
  // await sendWelcomeEmail(user_id, tier);
}
```

---

### Phase 4: Frontend UI (Week 3)

#### Day 10-11: Announcement Creation Form
**Files to create:**
- `apps/publimicro/src/app/anunciar/page.tsx` (Category selection)
- `apps/publimicro/src/app/anunciar/[category]/page.tsx` (Form)
- `apps/publimicro/src/components/announcements/AnnouncementForm.tsx`
- `apps/publimicro/src/components/announcements/CategorySelector.tsx`
- `apps/publimicro/src/components/announcements/PhotoUploader.tsx`
- `apps/publimicro/src/components/announcements/AIAssistant.tsx`
- `apps/publimicro/src/components/announcements/LocationPicker.tsx`

**Form Flow:**
```
1. Category Selection → 
2. Basic Info (title, description, price) → 
3. Photos & Media → 
4. Location & Details → 
5. AI Enhancement (optional) → 
6. Preview → 
7. Publish
```

**Component Example:**
```typescript
// apps/publimicro/src/components/announcements/AnnouncementForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/AuthProvider';
import { PhotoUploader } from './PhotoUploader';
import { AIAssistant } from './AIAssistant';
import { LocationPicker } from './LocationPicker';

interface AnnouncementFormData {
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  price?: number;
  price_negotiable: boolean;
  photos: string[];
  video_url?: string;
  location: {
    cep: string;
    city: string;
    state: string;
    neighborhood?: string;
  };
  attributes: Record<string, any>; // Category-specific
}

export function AnnouncementForm({ category }: { category: string }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showAI, setShowAI] = useState(false);
  
  const { register, handleSubmit, watch, setValue } = useForm<AnnouncementFormData>({
    defaultValues: {
      category,
      price_negotiable: true,
      photos: []
    }
  });
  
  const onSubmit = async (data: AnnouncementFormData) => {
    // Check posting limits
    const limitsCheck = await fetch('/api/announcements/check-limits', {
      method: 'POST',
      body: JSON.stringify({ user_id: user.id, category })
    });
    
    if (!limitsCheck.ok) {
      const { error } = await limitsCheck.json();
      // Show upgrade modal
      return;
    }
    
    // Create announcement
    const response = await fetch('/api/announcements/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const { id, slug } = await response.json();
      // Redirect to preview or publish
      router.push(`/anuncio/${slug}/publicar`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-8">
      {step === 1 && (
        <BasicInfoStep register={register} watch={watch} />
      )}
      
      {step === 2 && (
        <PhotosStep 
          photos={watch('photos')} 
          onChange={(photos) => setValue('photos', photos)}
        />
      )}
      
      {step === 3 && (
        <LocationStep register={register} />
      )}
      
      {step === 4 && (
        <PreviewStep data={watch()} />
      )}
      
      {/* AI Assistant Sidebar */}
      {showAI && (
        <AIAssistant 
          currentData={watch()}
          onApplySuggestions={(suggestions) => {
            setValue('title', suggestions.title);
            setValue('description', suggestions.description);
          }}
        />
      )}
      
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)}>
            Voltar
          </button>
        )}
        
        {step < 4 ? (
          <button type="button" onClick={() => setStep(step + 1)}>
            Próximo
          </button>
        ) : (
          <button type="submit" className="bg-[#FF6B35] text-white px-8 py-3">
            Publicar Anúncio
          </button>
        )}
      </div>
    </form>
  );
}
```

#### Day 12: Subscription Plans Page
**Files to create:**
- `apps/publimicro/src/app/planos/page.tsx`
- `apps/publimicro/src/components/subscriptions/PricingTable.tsx`
- `apps/publimicro/src/components/subscriptions/FeatureComparison.tsx`

**Pricing Table:**
```typescript
// apps/publimicro/src/app/planos/page.tsx
export default function PlansPage() {
  const plans = [
    {
      tier: 'free',
      name: 'Gratuito',
      price: 0,
      billing: 'Sempre grátis',
      features: [
        '2 anúncios de itens/mês',
        '1 anúncio de imóvel/mês',
        '1 anúncio de veículo/mês',
        'Até 6 fotos',
        'Descrição até 300 caracteres',
        'Visibilidade padrão'
      ],
      cta: 'Começar Grátis',
      highlighted: false
    },
    {
      tier: 'premium',
      name: 'Premium',
      price: 39.90,
      billing: '/mês',
      trial: '7 dias grátis',
      features: [
        '10 anúncios de itens/mês',
        '3 anúncios de imóveis/mês',
        '3 anúncios de veículos/mês',
        'Até 15 fotos por anúncio',
        'Otimização com IA',
        'Selo de destaque',
        'Atualização automática 3 dias',
        'Suporte prioritário'
      ],
      cta: 'Experimentar Premium',
      highlighted: true
    },
    {
      tier: 'pro',
      name: 'Pro',
      price: 99.90,
      billing: '/mês',
      features: [
        'Anúncios ilimitados',
        'Até 30 fotos + vídeos',
        'IA avançada + precificação',
        'Selo gold verificado',
        'Atualização diária',
        'Topo dos resultados',
        'Análises avançadas',
        'Gestão de leads',
        'Selo de verificado'
      ],
      cta: 'Ir para Pro',
      highlighted: false
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0b] to-[#1a1a1a] py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-4">
          Escolha o Plano Ideal
        </h1>
        <p className="text-xl text-gray-400 text-center mb-12">
          Aumente seu alcance e venda mais rápido
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.tier} {...plan} />
          ))}
        </div>
        
        <FeatureComparison className="mt-16" />
      </div>
    </div>
  );
}
```

---

### Phase 5: Admin Dashboard (Week 3-4)

#### Day 13-14: Admin Moderation Panel
**Files to create:**
- `apps/publimicro/src/app/admin/anuncios/page.tsx`
- `apps/publimicro/src/app/admin/anuncios/[id]/page.tsx`
- `apps/publimicro/src/components/admin/ModerationQueue.tsx`
- `apps/publimicro/src/components/admin/AnnouncementReview.tsx`

**Admin Routes:**
```typescript
/admin/dashboard           - Overview metrics
/admin/anuncios           - All announcements (filterable)
/admin/anuncios/pendentes - Pending approval queue
/admin/anuncios/flagged   - Flagged for review
/admin/usuarios           - User management
/admin/assinaturas        - Subscriptions & revenue
/admin/analytics          - Charts & reports
```

---

## 🧪 Testing Checklist

### Database Tests
- [ ] Migration runs without errors
- [ ] All indexes created correctly
- [ ] RLS policies active and functional
- [ ] Triggers execute (slug generation, search vector, posting count)
- [ ] Full-text search works with Portuguese
- [ ] Monthly reset function works

### API Tests
- [ ] Create subscription (free tier auto-assigned)
- [ ] Upgrade subscription (free → premium)
- [ ] Cancel subscription (remains active until period end)
- [ ] Check posting limits (respects tier limits)
- [ ] Create announcement (draft)
- [ ] Publish announcement (draft → pending/active)
- [ ] Search announcements (full-text + filters)
- [ ] AI enhancement returns valid suggestions
- [ ] Stripe checkout creates session
- [ ] Webhook processes events correctly

### User Flow Tests
- [ ] New user gets free tier automatically
- [ ] Free user can post 2 items, 1 property, 1 vehicle
- [ ] 3rd item blocked with upgrade prompt
- [ ] Premium upgrade increases limits
- [ ] Monthly reset restores free credits
- [ ] Paid credits persist across months
- [ ] OAuth login creates/links account correctly
- [ ] Referral code grants credits to both parties
- [ ] Favorite/unfavorite works
- [ ] Report listing creates moderation ticket

### Payment Tests
- [ ] Stripe checkout flow completes
- [ ] Trial subscription activates (7 days)
- [ ] Trial ends and converts to paid
- [ ] Subscription renews monthly
- [ ] Cancellation works (active until period end)
- [ ] Refund reverses subscription
- [ ] Boleto payment processes

---

## 🚀 Deployment

### Environment Variables (Production)
```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Premium Price IDs
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# Feature Flags
NEXT_PUBLIC_AI_ENHANCEMENT_ENABLED=true
NEXT_PUBLIC_REFERRAL_PROGRAM_ENABLED=true
```

### Vercel Deployment
1. Push to GitHub
2. Vercel auto-deploys from main branch
3. Set environment variables in Vercel dashboard
4. Configure Stripe webhook URL: `https://publimicro.com.br/api/stripe/webhook`
5. Test in production

---

## 📊 Success Metrics

### Week 1
- ✅ Database migration deployed
- ✅ Subscription API functional
- ✅ Posting limits enforced
- ✅ Basic CRUD operations working

### Week 2
- ✅ AI enhancement generating suggestions
- ✅ Stripe payments processing
- ✅ Webhooks handling events
- ✅ First test subscription created

### Week 3
- ✅ Frontend form accepting submissions
- ✅ Users can create/publish announcements
- ✅ Plans page live with checkout
- ✅ Admin can moderate listings

### Week 4
- ✅ End-to-end flow tested
- ✅ Analytics tracking implemented
- ✅ Production deployment complete
- ✅ First real customer acquired! 🎉

---

## 🆘 Troubleshooting

### "Cannot insert duplicate key in user_subscriptions"
**Cause:** User already has active subscription  
**Fix:** Query existing subscription, update instead of insert

### "Posting limit exceeded"
**Cause:** User hit monthly limit  
**Fix:** Check `last_monthly_reset` date, reset if needed

### "AI enhancement timeout"
**Cause:** OpenAI API slow response  
**Fix:** Increase timeout, add retry logic, use streaming

### "Stripe webhook signature invalid"
**Cause:** Wrong webhook secret  
**Fix:** Copy exact secret from Stripe dashboard, update env var

### "Full-text search returns no results"
**Cause:** `search_vector` not populated  
**Fix:** Run `UPDATE announcements SET search_vector = ... WHERE search_vector IS NULL;`

---

## 📚 References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Stripe Subscriptions Guide](https://stripe.com/docs/billing/subscriptions/overview)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Created:** 2025-11-07  
**Status:** Ready for implementation 🚀  
**Next Action:** Run database migration via Supabase Dashboard
