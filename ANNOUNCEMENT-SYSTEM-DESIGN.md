# 🚀 PubliMicro Advanced Announcement System

**Design Document**  
**Date:** November 7, 2025  
**Status:** 🔥 In Development

---

## 📊 Competitor Research - Brazilian Classified Marketplaces

### OLX Brasil
**Business Model:**
- FREE basic listings (limited features)
- Premium listings: R$ 9,90 - R$ 39,90/listing
- Featured placement: R$ 19,90 - R$ 99,90
- Auto refresh: R$ 4,90/week

**Features:**
- Photo limit: 8 free, 20 with premium
- Auto-renewal optional
- Boost visibility packages
- Category-specific pricing (vehicles, real estate higher)

**Pricing Strategy:**
- Vehicles: R$ 29,90 (featured)
- Real Estate: R$ 39,90 (featured)
- General Items: R$ 9,90 (featured)

---

### WebMotors
**Business Model:**
- Dealer plans: R$ 299 - R$ 1.499/month (unlimited listings)
- Individual sellers: R$ 59,90/listing (30 days)
- Premium features: R$ 99,90

**Features:**
- Professional photography service
- Video integration
- Financing calculator
- Performance analytics

---

### iCarros
**Business Model:**
- Similar to WebMotors
- R$ 49,90 - R$ 89,90/vehicle listing
- Dealer packages R$ 399+/month

---

### ZAP Imóveis / VivaReal
**Business Model:**
- Real estate agents: R$ 149 - R$ 799/month
- Builders: R$ 999+/month
- Individual: R$ 79,90/property

**Features:**
- Virtual tours
- Floor plans
- Neighborhood data
- Lead management

---

## 💎 PubliMicro Pricing Strategy (Competitive & Profitable)

### 🆓 FREE TIER - "Starter"
**What's Included:**
- ✅ 2 AcheMeCoisas announcements (general items)
- ✅ 1 Property listing (30 days)
- ✅ 1 Vehicle listing (30 days)
- ✅ Up to 6 photos per listing
- ✅ Basic description (300 characters)
- ✅ Standard visibility

**Limitations:**
- No featured placement
- No auto-refresh
- No priority support
- Limited to one active listing per category

**Perfect for:** Occasional sellers, individuals decluttering

---

### 🌟 PREMIUM TIER - "Destaque" 
**R$ 39,90/month**

**What's Included:**
- ✅ 10 AcheMeCoisas announcements
- ✅ 3 Property listings
- ✅ 3 Vehicle listings
- ✅ Up to 15 photos per listing
- ✅ AI-powered listing optimizer
- ✅ Featured badge on listings
- ✅ Auto-refresh every 3 days
- ✅ Extended description (1000 characters)
- ✅ Priority placement in search
- ✅ Basic analytics (views, favorites)
- ✅ Priority email support

**Perfect for:** Regular sellers, small businesses

---

### 💼 PRO TIER - "Profissional"
**R$ 99,90/month**

**What's Included:**
- ✅ UNLIMITED announcements (all categories)
- ✅ Up to 30 photos per listing
- ✅ Video integration (YouTube/Vimeo embed)
- ✅ AI-powered listing optimizer + pricing suggestions
- ✅ Premium featured badge (gold)
- ✅ Auto-refresh daily
- ✅ Top placement in search results
- ✅ Advanced analytics (conversion rates, click-through)
- ✅ Lead management dashboard
- ✅ WhatsApp integration
- ✅ Bump to top (3x/week manually)
- ✅ Priority WhatsApp support
- ✅ Custom URL slugs
- ✅ Verified seller badge

**Perfect for:** Professional sellers, dealers, real estate agents

---

### 🎯 À LA CARTE - "Credits System"

**For users who exceed free tier but don't want monthly subscription:**

| Item | Credits | Price |
|------|---------|-------|
| 1 General Item Listing (30 days) | 1 credit | R$ 4,90 |
| 1 Property Listing (30 days) | 3 credits | R$ 14,90 |
| 1 Vehicle Listing (30 days) | 2 credits | R$ 9,90 |
| Featured Placement (7 days) | 1 credit | R$ 4,90 |
| Boost to Top (instant) | 1 credit | R$ 4,90 |
| Auto-refresh (30 days) | 2 credits | R$ 9,90 |
| Extra photo pack (+10 photos) | 1 credit | R$ 4,90 |

**Credit Packages:**
- 5 credits: R$ 19,90 (R$ 3,98 each) - Save 19%
- 10 credits: R$ 34,90 (R$ 3,49 each) - Save 29%
- 25 credits: R$ 79,90 (R$ 3,20 each) - Save 35%
- 50 credits: R$ 149,90 (R$ 3,00 each) - Save 39%

---

## 🏗️ Database Schema - Complete System

### Table: `user_subscriptions`
```sql
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Subscription Details
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'premium', 'pro')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'past_due')),
  
  -- Billing
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  price_paid DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Period
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- Auto-renewal
  auto_renew BOOLEAN DEFAULT TRUE,
  
  -- Trial (7 days Premium for new users)
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, status) WHERE status = 'active'
);

CREATE INDEX idx_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);
```

---

### Table: `user_credits`
```sql
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Credits
  total_credits INT NOT NULL DEFAULT 0,
  free_credits INT NOT NULL DEFAULT 0, -- From promotions, referrals
  paid_credits INT NOT NULL DEFAULT 0,
  
  -- Usage Limits (Monthly reset for Free tier)
  items_posted_this_month INT NOT NULL DEFAULT 0,
  properties_posted_this_month INT NOT NULL DEFAULT 0,
  vehicles_posted_this_month INT NOT NULL DEFAULT 0,
  
  -- Last reset date
  last_monthly_reset DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX idx_credits_user ON user_credits(user_id);
```

---

### Table: `announcements` (Unified table for ALL listings)
```sql
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Category & Type
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'items',        -- AcheMeCoisas
    'properties',   -- AcheMeProper (real estate)
    'vehicles',     -- AcheMeMotors
    'machinery',    -- AcheMeMachina
    'marine',       -- AcheMeMarine (boats)
    'outdoor',      -- AcheMeOutdoor
    'travel',       -- AcheMeJourney
    'global',       -- AcheMeGlobal (international)
    'shared'        -- AcheMeShare (sharangas)
  )),
  
  subcategory VARCHAR(100), -- e.g., 'apartment', 'car', 'tractor', 'electronics'
  
  -- Basic Info
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  
  -- Pricing
  price DECIMAL(12,2),
  price_negotiable BOOLEAN DEFAULT TRUE,
  accepts_trade BOOLEAN DEFAULT FALSE,
  
  -- Media
  photos JSONB DEFAULT '[]', -- Array of photo URLs
  video_url TEXT, -- YouTube, Vimeo embed
  
  -- Location
  cep VARCHAR(9),
  street TEXT,
  number VARCHAR(10),
  complement TEXT,
  neighborhood TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  country VARCHAR(3) DEFAULT 'BRA',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',      -- User is creating
    'pending',    -- Awaiting admin approval
    'active',     -- Live and visible
    'sold',       -- Marked as sold
    'expired',    -- Listing period ended
    'removed',    -- User removed
    'rejected'    -- Admin rejected
  )),
  
  -- Visibility & Features
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  auto_refresh BOOLEAN DEFAULT FALSE,
  boost_count INT DEFAULT 0, -- Number of times boosted to top
  
  -- Engagement Metrics
  views_count INT DEFAULT 0,
  favorites_count INT DEFAULT 0,
  contacts_count INT DEFAULT 0, -- WhatsApp clicks, calls
  
  -- Publication Dates
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE, -- 30 days from publish
  last_refreshed_at TIMESTAMP WITH TIME ZONE,
  
  -- Moderation
  admin_approved_by UUID REFERENCES auth.users(id),
  admin_approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- AI Enhancement
  ai_enhanced BOOLEAN DEFAULT FALSE,
  ai_suggestions JSONB, -- Stores AI recommendations
  
  -- SEO
  slug VARCHAR(300) UNIQUE,
  meta_title VARCHAR(200),
  meta_description VARCHAR(300),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Full-text search
  search_vector tsvector
);

-- Indexes for performance
CREATE INDEX idx_announcements_user ON announcements(user_id);
CREATE INDEX idx_announcements_category ON announcements(category);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_city_state ON announcements(city, state);
CREATE INDEX idx_announcements_featured ON announcements(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_announcements_published ON announcements(published_at DESC) WHERE status = 'active';
CREATE INDEX idx_announcements_price ON announcements(price) WHERE price IS NOT NULL;
CREATE INDEX idx_announcements_location ON announcements USING GIST(
  ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Full-text search index
CREATE INDEX idx_announcements_search ON announcements USING GIN(search_vector);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION announcements_search_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.city, '')), 'C') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.neighborhood, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER announcements_search_vector_update
  BEFORE INSERT OR UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION announcements_search_update();
```

---

### Table: `credit_transactions`
```sql
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction Type
  type VARCHAR(20) NOT NULL CHECK (type IN (
    'purchase',     -- Bought credits
    'earned',       -- Referral, promotion
    'spent',        -- Used for listing
    'refund',       -- Refunded
    'expired'       -- Credits expired
  )),
  
  -- Amount
  amount INT NOT NULL, -- Positive for add, negative for subtract
  balance_after INT NOT NULL,
  
  -- Description
  description TEXT NOT NULL,
  
  -- Related records
  announcement_id UUID REFERENCES announcements(id),
  payment_id UUID, -- Reference to Stripe payment
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_created ON credit_transactions(created_at DESC);
```

---

### Table: `announcement_views`
```sql
CREATE TABLE IF NOT EXISTS public.announcement_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  
  -- Viewer Info (can be anonymous)
  viewer_user_id UUID REFERENCES auth.users(id),
  viewer_ip VARCHAR(45), -- IPv4 or IPv6
  viewer_user_agent TEXT,
  
  -- Location (from IP geolocation)
  viewer_city VARCHAR(100),
  viewer_state VARCHAR(2),
  viewer_country VARCHAR(3),
  
  -- Session tracking
  session_id UUID,
  
  -- Referrer
  referrer TEXT,
  
  -- Time spent on page (seconds)
  time_spent INT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_views_announcement ON announcement_views(announcement_id);
CREATE INDEX idx_views_user ON announcement_views(viewer_user_id) WHERE viewer_user_id IS NOT NULL;
CREATE INDEX idx_views_created ON announcement_views(created_at DESC);

-- Prevent counting same user multiple views in short time
CREATE UNIQUE INDEX idx_views_unique_session ON announcement_views(
  announcement_id, 
  COALESCE(viewer_user_id::text, viewer_ip),
  DATE_TRUNC('hour', created_at)
);
```

---

### Table: `oauth_accounts`
```sql
-- Handles users who sign in with Google, Microsoft, Apple, etc.
CREATE TABLE IF NOT EXISTS public.oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Provider Info
  provider VARCHAR(50) NOT NULL CHECK (provider IN (
    'google',
    'microsoft',
    'apple',
    'facebook',
    'github'
  )),
  provider_user_id TEXT NOT NULL, -- Provider's unique ID for user
  
  -- Profile Data from Provider
  email TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  display_name TEXT,
  photo_url TEXT,
  
  -- Tokens (encrypted)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Account linking
  primary_account BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_oauth_user ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_provider ON oauth_accounts(provider, provider_user_id);
```

---

### Table: `referral_program`
```sql
CREATE TABLE IF NOT EXISTS public.referral_program (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referrer (person who invited)
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referrer_code VARCHAR(20) UNIQUE NOT NULL, -- Unique referral code
  
  -- Referee (person who was invited)
  referee_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referee_email TEXT, -- Before signup
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',    -- Invited but not signed up
    'completed',  -- Signed up and verified
    'rewarded'    -- Both users received rewards
  )),
  
  -- Rewards
  referrer_credits_awarded INT DEFAULT 0,
  referee_credits_awarded INT DEFAULT 0,
  
  -- Timestamps
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  signed_up_at TIMESTAMP WITH TIME ZONE,
  rewarded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_referral_referrer ON referral_program(referrer_user_id);
CREATE INDEX idx_referral_referee ON referral_program(referee_user_id);
CREATE INDEX idx_referral_code ON referral_program(referrer_code);
```

---

## 🤖 AI-Powered Listing Assistant

### Features:

**1. Smart Title Generation**
- Analyzes category, description, key features
- Suggests SEO-optimized titles
- Examples:
  * Input: "Carro Civic 2020"
  * AI: "Honda Civic EXL 2.0 2020 - Completo, Baixa KM, Único Dono - Goiânia/GO"

**2. Description Enhancement**
- Expands brief descriptions
- Adds relevant keywords
- Structures information professionally
- Highlights key selling points

**3. Pricing Suggestions**
- Compares similar active listings
- Analyzes sold items in category
- Considers location, condition, age
- Provides price range recommendation

**4. Category Auto-Detection**
- Uses ML to suggest best category/subcategory
- Prevents misclassification

**5. Photo Quality Analysis**
- Checks image quality, lighting
- Suggests optimal photo order
- Identifies missing angles (e.g., odometer for cars)

**6. Compliance Checker**
- Flags prohibited items
- Warns about missing required info
- Ensures legal compliance

---

### Implementation: AI Component

```typescript
// apps/publimicro/src/components/ai/ListingAssistant.tsx
"use client";

import { useState } from "react";
import { Sparkles, Wand2, DollarSign, Tag, Image as ImageIcon } from "lucide-react";

interface AIsuggestions {
  title: string[];
  description: string;
  price_range: { min: number; max: number; recommended: number };
  category: string;
  subcategory: string;
  tags: string[];
  photo_feedback: string[];
}

export default function AIListingAssistant({ 
  category, 
  currentData,
  onApply 
}: {
  category: string;
  currentData: any;
  onApply: (suggestions: Partial<AIsuggestions>) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AIsuggestions | null>(null);

  const enhanceListing = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/enhance-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, ...currentData })
      });

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-2 border-purple-500/30 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-purple-300">
          Assistente IA - Otimize seu Anúncio
        </h3>
      </div>

      {!suggestions ? (
        <button
          onClick={enhanceListing}
          disabled={loading}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Analisando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Wand2 className="w-5 h-5" />
              Melhorar com IA
            </span>
          )}
        </button>
      ) : (
        <div className="space-y-6">
          {/* Title Suggestions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-purple-400" />
              <h4 className="font-semibold text-purple-300">Títulos Sugeridos:</h4>
            </div>
            <div className="space-y-2">
              {suggestions.title.map((title, i) => (
                <button
                  key={i}
                  onClick={() => onApply({ title })}
                  className="w-full text-left p-3 bg-purple-900/30 hover:bg-purple-800/40 rounded-lg text-white transition"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-blue-300">Descrição Otimizada:</h4>
            </div>
            <div className="p-4 bg-blue-900/30 rounded-lg">
              <p className="text-white text-sm whitespace-pre-wrap">
                {suggestions.description}
              </p>
              <button
                onClick={() => onApply({ description: suggestions.description })}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold"
              >
                Usar Esta Descrição
              </button>
            </div>
          </div>

          {/* Price Recommendation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-green-300">Sugestão de Preço:</h4>
            </div>
            <div className="p-4 bg-green-900/30 rounded-lg">
              <p className="text-white mb-2">
                Baseado em anúncios similares:
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-green-400">Mínimo</p>
                  <p className="text-lg font-bold text-white">
                    R$ {suggestions.price_range.min.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex-1 h-2 bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 rounded-full" />
                <div>
                  <p className="text-xs text-yellow-400">Recomendado</p>
                  <p className="text-xl font-bold text-yellow-300">
                    R$ {suggestions.price_range.recommended.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-red-400">Máximo</p>
                  <p className="text-lg font-bold text-white">
                    R$ {suggestions.price_range.max.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onApply({ price: suggestions.price_range.recommended })}
                className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black rounded-lg text-sm font-semibold"
              >
                Usar Preço Recomendado
              </button>
            </div>
          </div>

          {/* Photo Feedback */}
          {suggestions.photo_feedback.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-orange-400" />
                <h4 className="font-semibold text-orange-300">Dicas para Fotos:</h4>
              </div>
              <ul className="space-y-2">
                {suggestions.photo_feedback.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-white text-sm">
                    <span className="text-orange-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🔐 Authentication Schema Flows

### Scenario 1: Email/Password Registration
```
User Signup → Email Verification → Create user_profile → Create user_credits (Free tier) → Create user_subscriptions (Free)
```

### Scenario 2: Google OAuth First-Time
```
Google Sign-In → Check if email exists in auth.users
  ├─ YES → Link to existing account → Create oauth_accounts record
  └─ NO  → Create new auth.users → Create oauth_accounts → Create user_profile → Create user_credits (Free + 2 bonus) → Create user_subscriptions (Free)
```

### Scenario 3: User with Email/Password Adds Google OAuth
```
Logged in → Connect Google → Verify email matches → Create oauth_accounts record → Mark as additional login method
```

### Scenario 4: Multiple OAuth Providers (Google + Microsoft)
```
Has Google → Add Microsoft → Check emails match → Create second oauth_accounts record → Set primary_account flag on preferred
```

### Scenario 5: OAuth Email Conflict
```
Try Google Sign-in → Email exists with password → Show merge account prompt → Require password verification → Link accounts
```

---

## 🛡️ Anti-Abuse & Fraud Prevention

### Duplicate Account Detection
- Track device fingerprints
- Monitor IP addresses
- Check phone number uniqueness
- CPF validation (Brazilian tax ID)
- Email domain reputation

### Posting Limits Enforcement
```typescript
async function canUserPost(userId: string, category: string): Promise<boolean> {
  // Get user subscription
  const subscription = await getActiveSubscription(userId);
  
  // Get current month usage
  const credits = await getUserCredits(userId);
  
  // Check limits based on tier
  const limits = {
    free: { items: 2, properties: 1, vehicles: 1 },
    premium: { items: 10, properties: 3, vehicles: 3 },
    pro: { items: Infinity, properties: Infinity, vehicles: Infinity }
  };
  
  const tierLimits = limits[subscription.tier];
  
  // Check category-specific limit
  switch(category) {
    case 'items':
      return credits.items_posted_this_month < tierLimits.items;
    case 'properties':
      return credits.properties_posted_this_month < tierLimits.properties;
    case 'vehicles':
      return credits.vehicles_posted_this_month < tierLimits.vehicles;
    default:
      return true; // Other categories
  }
}
```

---

## 📱 User Flows

### Creating First Announcement (Free User)
1. Click "Criar Anúncio"
2. Choose category (Items / Property / Vehicle)
3. Fill basic info (title, description, price)
4. Upload photos (max 6)
5. **AI Assistant appears**: "Quer melhorar seu anúncio com IA?" ✨
6. User clicks "Sim" → AI enhances listing
7. Review changes, apply suggestions
8. Preview listing
9. Submit for publication
10. **Free tier check**: "Você usou 1 de 2 anúncios gratuitos de AcheMeCoisas este mês"

### Exceeded Free Limit
1. User tries to post 3rd item
2. System blocks: "Limite de anúncios gratuitos atingido"
3. Options shown:
   - ⭐ Upgrade to Premium (R$ 39,90/mês) - 10 anúncios
   - 💰 Buy 5 Credits (R$ 19,90) - Pay per listing
   - ⏳ Wait until next month reset

### Premium User Creating Listing
1. Same flow, but no limits
2. Additional features unlocked:
   - Up to 15 photos
   - Video embed
   - Featured badge automatically
   - Auto-refresh enabled

---

## 💳 Payment Integration (Stripe)

### Subscription Flow
```typescript
// Create Stripe Checkout Session
const session = await stripe.checkout.sessions.create({
  customer_email: user.email,
  payment_method_types: ['card', 'boleto'], // Brazilian payment methods
  line_items: [{
    price: 'price_premium_monthly', // Stripe Price ID
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: `${YOUR_DOMAIN}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${YOUR_DOMAIN}/pagamento/cancelado`,
  metadata: {
    user_id: user.id,
    tier: 'premium'
  }
});
```

### Webhook Handler
```typescript
// Handle Stripe webhooks
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // User completed payment
      await activateSubscription(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      // Recurring payment succeeded
      await renewSubscription(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      // User canceled
      await cancelSubscription(event.data.object);
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

---

## 📊 Admin Dashboard Features

### Overview
- Total active announcements
- Revenue this month
- Active subscriptions (Free/Premium/Pro breakdown)
- Pending moderation queue

### Moderation Queue
- New listings requiring approval
- Flagged content
- Quick approve/reject buttons
- Bulk actions

### Analytics
- Most popular categories
- Conversion rates (views → contacts)
- Geographic distribution
- User growth charts

### User Management
- Search users
- View subscription history
- Manually add/remove credits
- Ban/unban users

---

## 🎯 Next Implementation Steps

1. ✅ Create database migration with all tables
2. ✅ Build subscription management API routes
3. ✅ Implement posting limits middleware
4. ✅ Create AI enhancement API endpoint
5. ✅ Build Stripe integration
6. ✅ Create announcement creation form
7. ✅ Build admin moderation panel
8. ✅ Add analytics tracking

---

**Status:** Ready to implement! Let's build this enterprise-grade system. 🚀
