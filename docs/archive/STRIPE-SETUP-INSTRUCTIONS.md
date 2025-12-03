# Stripe Products Setup Instructions

## Prerequisites

1. **Stripe Account**: Create account at https://stripe.com if you don't have one
2. **Get API Keys**: Dashboard → Developers → API keys
   - Copy **Secret key** (starts with `sk_test_...` for test mode)
   - Copy **Publishable key** (starts with `pk_test_...`)

## Step 1: Set Environment Variable

### Option A: PowerShell (Temporary - Current Session Only)
```powershell
$env:STRIPE_SECRET_KEY = "sk_test_YOUR_KEY_HERE"
```

### Option B: Add to .env.local (Permanent)
```bash
# Create or edit apps/publimicro/.env.local
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

## Step 2: Install Stripe SDK
```powershell
pnpm add stripe
```

## Step 3: Run Setup Script
```powershell
node setup-stripe-products.js
```

## Expected Output

The script will create **11 Stripe products**:

### Listing Enhancements (9 products)
1. **Items Category (AcheMeCoisas)**
   - Highlight 30 days: R$ 12.00
   - Organic Marketing: R$ 70.00  
   - Super Boost: R$ 75.00

2. **Motors Category (AcheMeMotors)**
   - Highlight 30 days: R$ 20.00
   - Organic Marketing: R$ 120.00
   - Super Boost: R$ 130.00

3. **Properties Category (AcheMePropers)**
   - Highlight 30 days: R$ 30.00
   - Organic Marketing: R$ 180.00
   - Super Boost: R$ 195.00

### Subscriptions (2 products)
1. **Premium**: R$ 29.90/month
2. **Pro**: R$ 89.90/month

## Step 4: Update Code with Price IDs

After running the script, it will output price IDs like:
```typescript
export const STRIPE_PRICE_IDS = {
  items: {
    highlight: 'price_XXX',
    organic_marketing: 'price_YYY',
    super_boost: 'price_ZZZ',
  },
  // ... etc
};
```

Copy this output and replace the content in:
- `apps/publimicro/src/lib/enhancementPricing.ts` (search for `STRIPE_PRICE_IDS`)

## Step 5: Test Payments

1. Use Stripe test cards: https://stripe.com/docs/testing
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

2. Check Stripe Dashboard → Payments to see test transactions

## Troubleshooting

### Error: "No such plan: basic"
- Script creates products from scratch, ignore this if Stripe account is new

### Error: "Invalid API key"
- Check that secret key starts with `sk_test_` (test mode) or `sk_live_` (production)
- Verify no extra spaces in environment variable

### Products already exist
- Script will skip existing products with same name
- Or delete existing products in Stripe Dashboard first

## Production Deployment

1. Switch to **live mode** in Stripe Dashboard
2. Get **live API keys** (start with `sk_live_` and `pk_live_`)
3. Update environment variables on Vercel:
   ```
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   ```
4. Re-run script in production environment
5. Update STRIPE_PRICE_IDS with live price IDs

## Cost Summary

### Per Enhancement Sale
- Stripe fee: 3.99% + R$ 0.39 per transaction
- Example: R$ 12.00 sale → You receive ~R$ 10.92

### Per Subscription
- Same fee structure for recurring payments
- Example: R$ 29.90/month → You receive ~R$ 28.11/month

## Next Steps

After Stripe setup is complete:
1. ✅ Verification API routes (DONE)
2. ⏳ Enhancement checkout API (creates Stripe sessions)
3. ⏳ Stripe webhooks handler (confirms payments)
4. ⏳ Frontend components (payment buttons, verification UI)
