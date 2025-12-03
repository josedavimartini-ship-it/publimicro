# 💳 PubliMicro Stripe Integration Guide

Complete guide for Stripe payment integration including setup, webhooks, and testing.

**Last Updated:** December 2, 2025

---

## 📋 Overview

PubliMicro uses Stripe for:
- **One-time payments** - Featured listings, marketing packages
- **Subscriptions** - Premium tiers (Profissional, Empresarial)
- **Checkout Sessions** - Hosted payment pages

---

## 1️⃣ Get API Keys

### Test Mode (Development)
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`) - Click "Reveal"

### Live Mode (Production)
1. Toggle to **Live mode** in dashboard
2. Go to: https://dashboard.stripe.com/apikeys
3. Copy live keys (`pk_live_...`, `sk_live_...`)

---

## 2️⃣ Configure Environment Variables

### Development (`.env.local`)
```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY

# Webhook Secret (from Step 4)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

### Production (Vercel)
1. Go to: Vercel Project → Settings → Environment Variables
2. Add all variables above with live keys
3. Select: ✅ Production ✅ Preview

---

## 3️⃣ Create Products in Stripe

### Go to Products Page
https://dashboard.stripe.com/test/products

### Product 1: Featured Listing (Destaque)
- **Name:** `Destaque na Home - 30 dias`
- **Description:** `Anúncio em destaque na página inicial por 30 dias`
- **Price:** R$ 20,00 (one-time)
- **Copy Price ID:** `price_...`

### Product 2: Marketing Package
- **Name:** `Marketing Orgânico - 30 dias`
- **Description:** `Campanha completa de marketing orgânico por 30 dias`
- **Price:** R$ 120,00 (one-time)
- **Copy Price ID:** `price_...`

### Product 3: Profissional Subscription
- **Name:** `Plano Profissional`
- **Description:** `Acesso a recursos premium`
- **Price:** R$ 49,90/mês (recurring)
- **Copy Price ID:** `price_...`

### Product 4: Empresarial Subscription
- **Name:** `Plano Empresarial`
- **Description:** `Todos os recursos + suporte prioritário`
- **Price:** R$ 149,90/mês (recurring)
- **Copy Price ID:** `price_...`

### Add Price IDs to Environment
```bash
# Enhancement Price IDs
NEXT_PUBLIC_STRIPE_PRICE_DESTAQUE=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_MARKETING=price_xxx

# Subscription Price IDs
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_xxx
```

---

## 4️⃣ Configure Webhooks

### Local Development (Stripe CLI)

1. **Install Stripe CLI:**
   ```powershell
   # Using Chocolatey
   choco install stripe-cli
   
   # Or download from stripe.com/docs/stripe-cli
   ```

2. **Login:**
   ```powershell
   stripe login
   ```

3. **Forward webhooks:**
   ```powershell
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy webhook secret** (`whsec_...`) to `.env.local`

### Production Webhooks

1. Go to: https://dashboard.stripe.com/webhooks
2. Click: **Add endpoint**
3. **Endpoint URL:** `https://publimicro.com.br/api/webhooks/stripe`
4. **Events to listen:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy **Signing secret** to Vercel env vars

---

## 5️⃣ Code Implementation

### Stripe Package Location
`packages/stripe/` - Shared Stripe utilities

```typescript
// packages/stripe/src/index.ts
import { createStripe } from '@publimicro/stripe';

const stripe = createStripe(process.env.STRIPE_SECRET_KEY!);
```

### Checkout API Route
**Location:** `apps/publimicro/src/app/api/checkout/create-session/route.ts`

```typescript
import { stripe } from '@publimicro/stripe';

export async function POST(request: Request) {
  const { priceId, userId, metadata } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // or 'subscription'
    payment_method_types: ['card', 'pix', 'boleto'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pagamento/cancelado`,
    metadata: { userId, ...metadata },
  });
  
  return Response.json({ sessionId: session.id, url: session.url });
}
```

### Webhook Handler
**Location:** `apps/publimicro/src/app/api/webhooks/stripe/route.ts`

```typescript
import { stripe } from '@publimicro/stripe';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;
  
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful payment
      break;
    case 'customer.subscription.created':
      // Handle new subscription
      break;
    // ... other events
  }
  
  return Response.json({ received: true });
}
```

### Client-Side Checkout
```typescript
'use client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

async function handleCheckout(priceId: string) {
  const response = await fetch('/api/checkout/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });
  
  const { url } = await response.json();
  window.location.href = url; // Redirect to Stripe Checkout
}
```

---

## 6️⃣ Brazil Payment Methods

### Enable in Stripe Dashboard
1. Go to: https://dashboard.stripe.com/settings/payment_methods
2. Enable for Brazil:
   - ✅ **Credit Cards** (Visa, Mastercard, Amex, Elo, Hipercard)
   - ✅ **Pix** (instant, most popular!)
   - ✅ **Boleto** (bank slip, 3-day processing)

### Currency Settings
1. Go to: https://dashboard.stripe.com/settings/public
2. Set:
   - **Country:** Brazil
   - **Default currency:** BRL

---

## 7️⃣ Testing

### Test Card Numbers
| Card | Number | Behavior |
|------|--------|----------|
| Success | `4242 4242 4242 4242` | Payment succeeds |
| Decline | `4000 0000 0000 0002` | Card declined |
| 3D Secure | `4000 0027 6000 3184` | Requires authentication |

**For all test cards:**
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

### Test Pix
Pix payments in test mode auto-complete after a few seconds.

### Test Webhooks
```powershell
# Trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

---

## 8️⃣ Checklist

### Development
- [ ] Test keys in `.env.local`
- [ ] Products created in Stripe test mode
- [ ] Webhook forwarding with Stripe CLI
- [ ] Checkout flow works
- [ ] Webhook events processed

### Production
- [ ] Live keys in Vercel env vars
- [ ] Products created in live mode
- [ ] Webhook endpoint configured
- [ ] Brazil payment methods enabled
- [ ] Currency set to BRL

---

## ⚠️ Troubleshooting

### "No such price" Error
- Price ID doesn't exist or wrong mode (test vs live)
- Double-check the Price ID in Stripe dashboard

### Webhook Signature Failed
- `STRIPE_WEBHOOK_SECRET` doesn't match
- For local: Use secret from `stripe listen` output
- For production: Use secret from webhook endpoint settings

### Payment Method Not Available
- Enable payment method in Stripe Dashboard
- Check customer's country supports the method

### Pix Not Working
- Only available for Brazilian accounts
- Must have Brazilian bank account connected

---

## 📚 Related Files

- `packages/stripe/` - Stripe package with config
- `apps/publimicro/src/app/api/checkout/` - Checkout API routes
- `apps/publimicro/src/app/api/webhooks/stripe/` - Webhook handler
- `apps/publimicro/src/app/assinatura/` - Subscription pages
- `STRIPE-CLI-SETUP-GUIDE.md` - CLI installation details
