# 💳 Stripe Payment Integration - Setup Guide

## Step 1: Create Stripe Account (if you don't have one)

1. Go to: https://stripe.com
2. Click **"Start now"** or **"Sign in"**
3. Create account with your email
4. Complete business verification (for Brazil: add CPF/CNPJ)

---

## Step 2: Get Your API Keys

### Test Mode (Development)

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy your keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

### Live Mode (Production - after testing)

1. Toggle to **Live mode** in Stripe Dashboard
2. Go to: https://dashboard.stripe.com/apikeys
3. Copy your live keys:
   - **Publishable key** (starts with `pk_live_...`)
   - **Secret key** (starts with `sk_live_...`)

---

## Step 3: Add Keys to Your Project

### For Development (.env.local)

Create/edit `apps/publimicro/.env.local`:

```bash
# Stripe Test Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Stripe Webhook Secret (we'll get this in Step 5)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### For Production (Vercel Environment Variables)

1. Go to: https://vercel.com/josedavimartini-ship-it/publimicro/settings/environment-variables
2. Add these variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
   - `STRIPE_SECRET_KEY` = `sk_live_...`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...`
3. Select **Production** environment
4. Click **Save**

---

## Step 4: Install Stripe Package

Already installed in your project! ✅

If you need to reinstall:
```bash
pnpm add stripe @stripe/stripe-js
```

---

## Step 5: Configure Webhooks (for payment confirmations)

### Development (Local Testing)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run in terminal:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. Copy the webhook signing secret (starts with `whsec_...`)
4. Add to `.env.local`

### Production

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://publimicro.vercel.app/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (whsec_...)
7. Add to Vercel environment variables

---

## Step 6: Configure Products in Stripe

### Create Products

1. Go to: https://dashboard.stripe.com/test/products
2. Click **"Add product"**

**Product 1: Destaque (Featured Listing)**
- Name: `Destaque na Home - 30 dias`
- Description: `Anúncio em destaque na página inicial por 30 dias`
- Pricing:
  - Price: `R$ 20.00` (or `2000` cents)
  - Billing period: `One time`
- Click **"Save product"**
- **Copy the Price ID** (starts with `price_...`)

**Product 2: Marketing Orgânico**
- Name: `Marketing Orgânico - 30 dias`
- Description: `Campanha completa de marketing orgânico por 30 dias`
- Pricing:
  - Price: `R$ 120.00` (or `12000` cents)
  - Billing period: `One time`
- Click **"Save product"**
- **Copy the Price ID** (starts with `price_...`)

### Add Price IDs to .env.local

```bash
# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_DESTAQUE=price_YOUR_DESTAQUE_PRICE_ID
NEXT_PUBLIC_STRIPE_PRICE_MARKETING=price_YOUR_MARKETING_PRICE_ID
```

---

## Step 7: Configure Payment Settings (Brazil)

1. Go to: https://dashboard.stripe.com/settings/payment_methods
2. Enable payment methods for Brazil:
   - ✅ **Credit Cards** (Visa, Mastercard, Amex)
   - ✅ **Pix** (instant payment - most popular in Brazil!)
   - ✅ **Boleto** (bank slip - optional)
3. Go to: https://dashboard.stripe.com/settings/public
4. Set:
   - **Country**: Brazil
   - **Currency**: BRL (Brazilian Real)

---

## Step 8: Test Stripe Integration

### Test Card Numbers (for testing)

- **Successful payment**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

**Use any:**
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### Test Pix (Brazil)

In test mode, Pix payments are auto-completed after 5 seconds.

---

## Your Checklist

- [ ] Create Stripe account
- [ ] Get test API keys from dashboard
- [ ] Add keys to `.env.local`
- [ ] Create "Destaque" product (R$ 20)
- [ ] Create "Marketing Orgânico" product (R$ 120)
- [ ] Copy Price IDs to `.env.local`
- [ ] Enable Pix payment method
- [ ] Test checkout with test card
- [ ] Configure webhooks (after I create the webhook handler)

---

## Next Steps After You Get Keys

1. **Send me your keys** (I'll add them to the code)
2. **I'll create**:
   - Stripe checkout integration
   - Webhook handler for payment confirmations
   - Payment success/cancel pages
   - Automatic listing upgrade after payment

---

## Quick Start URLs

- **Stripe Dashboard**: https://dashboard.stripe.com
- **API Keys**: https://dashboard.stripe.com/test/apikeys
- **Products**: https://dashboard.stripe.com/test/products
- **Webhooks**: https://dashboard.stripe.com/test/webhooks
- **Payment Methods**: https://dashboard.stripe.com/settings/payment_methods

---

**Get your keys and send them to me, then I'll integrate everything!** 🚀
