# 🔍 Stripe Payment System Audit - November 7, 2025

## ✅ Current Configuration

### Products & Pricing

**Product 1: Super Destaque (Featured Listing)**
- **Price:** R$ 20,00 (BRL)
- **Duration:** 30 days
- **Price ID:** `price_1SQXY4FTa31reGpf1w2KTfGA`
- **Type:** Should be ONE-TIME payment
- **Features:**
  - Appears on homepage
  - Featured badge
  - Priority in search results
  - Up to 10x more views

**Product 2: Organic Marketing Campaign**
- **Price:** R$ 120,00 (BRL)
- **Duration:** 30 days
- **Price ID:** `price_1SQXZxFTa31reGpf7HGHw8In`
- **Type:** Should be ONE-TIME payment
- **Features:**
  - Everything from Featured Listing
  - Email marketing campaign
  - Social media promotion
  - WhatsApp broadcasts
  - SEO optimization

---

## 📊 System Architecture

### Environment Variables (.env.local)
```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SQX6gFTa31reGpfMijcLrYJAacTsMci34Zq1e7gPJ5xYZgsV9tIgYNiELfwn2lVhqLTMILMMJ3gVs7c4DnCEYbo006QPd0311
STRIPE_SECRET_KEY=sk_test_51SQX6gFTa31reGpfVAEfcZhTBhcxRMxf7SnU5JrBmpb8qfRzyMBCtKpwizy02HXhkCmaeNvhvgcBQHQYZfbnJaSO0056kUgOM8

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_DESTAQUE=price_1SQXY4FTa31reGpf1w2KTfGA
NEXT_PUBLIC_STRIPE_PRICE_MARKETING=price_1SQXZxFTa31reGpf7HGHw8In

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_a04b24f71bdb6b47f682ac5bf8bf1596e33f3d7c8e49825d34cafe67a6d7e4a2
```

**Status:** ✅ All keys configured

---

### Code Implementation

#### 1. Stripe Client (`src/lib/stripe.ts`)
```typescript
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia", // Latest API version ✅
  typescript: true,
});

export const STRIPE_PRICES = {
  DESTAQUE: process.env.NEXT_PUBLIC_STRIPE_PRICE_DESTAQUE || "",
  MARKETING: process.env.NEXT_PUBLIC_STRIPE_PRICE_MARKETING || "",
};
```

**Features:**
- ✅ PIX payment enabled (`payment_method_types: ["card", "pix"]`)
- ✅ Brazilian Portuguese locale (`locale: "pt-BR"`)
- ✅ Metadata tracking (listingId, userId)

**Status:** ✅ Correctly configured

---

#### 2. Checkout Session Creation (`src/app/api/checkout/create-session/route.ts`)

**Flow:**
1. User authentication check ✅
2. Verify listing ownership ✅
3. Select correct price ID (destaque or marketing) ✅
4. Create Stripe checkout session ✅
5. Redirect to Stripe hosted checkout ✅

**Success URL:** `/acheme-coisas/publicado?id={listingId}&payment=success`
**Cancel URL:** `/acheme-coisas/publicado?id={listingId}&payment=cancelled`

**Metadata Stored:**
- `listingId` - Property ID
- `userId` - User ID
- `productType` - "destaque" or "marketing"
- `listingTitle` - Property title

**Status:** ✅ Correctly implemented

---

#### 3. Webhook Handler (`src/app/api/webhooks/stripe/route.ts`)

**Event Handling:**
- ✅ `checkout.session.completed` - Payment successful

**Actions on Payment Success:**

**For "destaque" product:**
```typescript
{
  is_featured: true,
  featured_until: NOW + 30 days
}
```

**For "marketing" product:**
```typescript
{
  marketing_campaign_active: true
}
```

**Security:**
- ✅ Signature verification (`stripe.webhooks.constructEvent`)
- ✅ Uses service role for database updates
- ✅ Error logging

**Status:** ✅ Correctly implemented

---

#### 4. UI Display (`src/app/acheme-coisas/publicado/page.tsx`)

**Pricing Cards:**
- ✅ Super Destaque: R$ 20/30 dias
- ✅ Marketing Orgânico: R$ 120/30 dias
- ✅ Feature list displayed
- ✅ Click handlers connected
- ✅ Loading states

**Status:** ✅ Correctly displayed

---

## ⚠️ Potential Issues to Verify

### 1. Price Type Configuration
**Check:** Are the Price IDs configured as ONE-TIME payment?

**To Verify:**
1. Go to https://dashboard.stripe.com/test/products
2. Click on each product
3. Check if price shows "One-time" or "Recurring"

**If RECURRING:**
- Follow instructions in `FIX-STRIPE-PRICES.md`
- Create new prices with "One-time" payment
- Update `.env.local` with new Price IDs

---

### 2. Payment Methods
**Current:** Card + PIX ✅

**Recommendation:**
- Keep both enabled for Brazilian market
- PIX is very popular in Brazil
- Card is standard for international

**Status:** ✅ Optimal configuration

---

### 3. Webhook Endpoint
**URL:** `https://your-domain.vercel.app/api/webhooks/stripe`

**To Configure in Stripe:**
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter: `https://your-production-url.vercel.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`
5. Copy webhook signing secret
6. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`

**Status:** ⚠️ Verify webhook is configured in Stripe Dashboard

---

### 4. Database Schema
**Tables Used:**
- `listings` - Main listing table

**Fields Updated by Webhook:**
- `is_featured` (BOOLEAN)
- `featured_until` (TIMESTAMPTZ)
- `marketing_campaign_active` (BOOLEAN)

**Check if fields exist:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name IN ('is_featured', 'featured_until', 'marketing_campaign_active');
```

**Status:** ⏳ Needs verification

---

## 🧪 Testing Checklist

### Test 1: Destaque Purchase Flow
- [ ] Create a listing (as authenticated user)
- [ ] Go to `/acheme-coisas/publicado?id={listing_id}`
- [ ] Click "Destacar Anúncio" (R$ 20)
- [ ] Redirected to Stripe Checkout ✅
- [ ] Complete test payment (use card `4242 4242 4242 4242`)
- [ ] Redirected back to success page ✅
- [ ] Listing now has `is_featured: true` ✅
- [ ] Listing appears on homepage with badge ✅

### Test 2: Marketing Purchase Flow
- [ ] Click "Ativar Marketing" (R$ 120)
- [ ] Redirected to Stripe Checkout ✅
- [ ] Complete test payment
- [ ] Listing now has `marketing_campaign_active: true` ✅

### Test 3: PIX Payment
- [ ] Start checkout flow
- [ ] Select PIX as payment method ✅
- [ ] Complete PIX payment (test mode)
- [ ] Verify webhook receives event ✅

### Test 4: Webhook Verification
- [ ] Make a test payment
- [ ] Check webhook logs in Stripe Dashboard
- [ ] Verify `checkout.session.completed` event received ✅
- [ ] Check database update occurred ✅

---

## 🔧 Recommended Improvements

### 1. Add Payment History Table
```sql
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  listing_id UUID REFERENCES public.listings(id),
  user_id UUID REFERENCES auth.users(id),
  
  -- Stripe Data
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  
  -- Payment Details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  product_type VARCHAR(50) NOT NULL, -- 'destaque' or 'marketing'
  status VARCHAR(50) DEFAULT 'pending',
  
  -- Metadata
  payment_method VARCHAR(50), -- 'card', 'pix'
  receipt_url TEXT,
  
  -- Activation
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_payments_listing_id ON public.payments(listing_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
```

**Benefits:**
- Full payment audit trail
- Revenue tracking
- Refund management
- Analytics

---

### 2. Add Expiration Checker (Cron Job)
```typescript
// app/api/cron/check-featured-expiry/route.ts
export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Find expired featured listings
  const { data: expired } = await supabase
    .from('listings')
    .select('id, title, user_id')
    .eq('is_featured', true)
    .lt('featured_until', new Date().toISOString());
  
  // Remove featured status
  if (expired && expired.length > 0) {
    await supabase
      .from('listings')
      .update({ is_featured: false })
      .in('id', expired.map(l => l.id));
    
    // TODO: Send notification to user
    console.log(`Removed featured status from ${expired.length} listings`);
  }
  
  return new Response('OK');
}
```

**Setup in Vercel:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/check-featured-expiry",
      "schedule": "0 0 * * *" // Daily at midnight
    }
  ]
}
```

---

### 3. Add Refund Handler
```typescript
// Webhook handler addition
if (event.type === 'charge.refunded') {
  const charge = event.data.object;
  
  // Find payment by session ID
  const { data: payment } = await supabase
    .from('payments')
    .select('listing_id, product_type')
    .eq('stripe_payment_intent_id', charge.payment_intent)
    .single();
  
  if (payment) {
    // Revert listing features
    if (payment.product_type === 'destaque') {
      await supabase
        .from('listings')
        .update({ is_featured: false })
        .eq('id', payment.listing_id);
    }
    
    // Update payment status
    await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('stripe_payment_intent_id', charge.payment_intent);
  }
}
```

---

### 4. Email Notifications

**On Payment Success:**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'PubliMicro <noreply@publimicro.com>',
  to: user.email,
  subject: productType === 'destaque' 
    ? 'Seu anúncio está em destaque! 🌟' 
    : 'Sua campanha de marketing foi ativada! 🎯',
  html: `
    <h2>Pagamento confirmado!</h2>
    <p>Seu anúncio "${listingTitle}" está ativo com:</p>
    <ul>
      ${productType === 'destaque' 
        ? '<li>Destaque na página inicial por 30 dias</li>' 
        : '<li>Campanha de marketing orgânico por 30 dias</li>'
      }
    </ul>
    <p>Válido até: ${expiryDate}</p>
  `
});
```

---

### 5. Analytics Dashboard

Track:
- Total revenue (by product type)
- Conversion rate (listings → purchases)
- Average order value
- PIX vs Card usage
- Refund rate
- Customer lifetime value

**Implementation:**
```typescript
// Analytics API endpoint
export async function GET() {
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('status', 'completed');
  
  const analytics = {
    total_revenue: payments.reduce((sum, p) => sum + p.amount, 0),
    destaque_count: payments.filter(p => p.product_type === 'destaque').length,
    marketing_count: payments.filter(p => p.product_type === 'marketing').length,
    pix_usage: payments.filter(p => p.payment_method === 'pix').length,
    card_usage: payments.filter(p => p.payment_method === 'card').length,
  };
  
  return Response.json(analytics);
}
```

---

## 🎯 Action Items

### IMMEDIATE (Do Now)
1. ✅ Verify Price IDs are ONE-TIME payment (not recurring)
   - Go to https://dashboard.stripe.com/test/products
   - Check each price configuration
   - If recurring, follow `FIX-STRIPE-PRICES.md` to create new prices

2. ⏳ Verify Database Schema
   - Check if `listings` table has required fields:
     - `is_featured` (BOOLEAN)
     - `featured_until` (TIMESTAMPTZ)
     - `marketing_campaign_active` (BOOLEAN)

3. ⏳ Configure Webhook in Stripe Dashboard
   - Add endpoint URL
   - Select `checkout.session.completed` event
   - Verify webhook secret matches `.env.local`

### SHORT TERM (This Week)
1. Create `payments` table for audit trail
2. Test complete purchase flow (destaque + marketing)
3. Set up expiration checker cron job
4. Add email notifications

### LONG TERM (This Month)
1. Analytics dashboard
2. Refund handling
3. Marketing campaign automation
4. A/B testing for pricing

---

## 📈 Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Stripe Client | ✅ Working | Latest API, PIX enabled |
| Price IDs | ⚠️ Verify | Need to confirm ONE-TIME vs recurring |
| Checkout Flow | ✅ Working | Proper auth, metadata, redirects |
| Webhook Handler | ✅ Working | Signature verification, DB updates |
| UI Display | ✅ Working | R$ 20 & R$ 120 shown correctly |
| Database Schema | ⏳ Verify | Need to confirm fields exist |
| Webhook Config | ⏳ Verify | Need to confirm in Stripe Dashboard |
| Payment History | ❌ Missing | Recommended to add |
| Expiration Logic | ❌ Missing | Recommended to add |
| Email Notifications | ❌ Missing | Recommended to add |

---

## 🚀 Next Steps

1. **Run verification queries** to check database schema
2. **Login to Stripe Dashboard** to verify price configuration
3. **Test purchase flow** with test card
4. **Check webhook logs** in Stripe Dashboard
5. **Implement payment history table** for better tracking
6. **Set up cron job** for expiration checking

Would you like me to:
- Create the database migration for the payments table?
- Set up the expiration cron job?
- Add email notifications?
- Create analytics dashboard?
