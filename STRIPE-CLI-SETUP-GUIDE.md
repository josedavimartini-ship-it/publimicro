# Stripe CLI Setup Guide - Step by Step

## ✅ Step 1: Stripe CLI Installation (COMPLETED)

The Stripe CLI has been installed at:
```
C:\Users\Usuario\stripe-cli\stripe.exe
```

Version: 1.21.8

---

## 🔐 Step 2: Authenticate with Stripe

Run this command in PowerShell:

```powershell
& "$env:USERPROFILE\stripe-cli\stripe.exe" login
```

**What happens:**
1. Your browser will open automatically
2. You'll see a Stripe login page
3. Sign in with your Stripe account credentials
4. Click "Allow access" to authorize the CLI
5. The CLI will confirm: "Done! The Stripe CLI is configured"

---

## 🎯 Step 3: Start Webhook Forwarding to Local Dev

**First, start your Next.js dev server** (if not already running):

```powershell
# In one PowerShell window
pnpm dev:publimicro
```

**Then, in a NEW PowerShell window**, start the webhook listener:

```powershell
& "$env:USERPROFILE\stripe-cli\stripe.exe" listen --forward-to http://localhost:3000/api/webhooks/stripe-enhancements
```

**What you'll see:**
```
> Ready! Your webhook signing secret is whsec_XXXXXXXXXXXXXXXXXXXXXXXX (^C to quit)
```

**IMPORTANT:** Copy that `whsec_` secret! You need it for the next step.

---

## 📝 Step 4: Add Webhook Secret to .env.local

1. Open (or create) this file:
   ```
   apps/publimicro/.env.local
   ```

2. Add these lines (replace with your actual values):

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51SQX6gFTa31reGpfVAEfcZhTBhcxRMxf7SnU5JrBmpb8qfRzyMBCtKpwizy02HXhkCmaeNvhvgcBQHQYZfbnJaSO0056kUgOM8
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY

# Supabase Configuration (you should already have these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **RESTART your Next.js dev server** (stop and run `pnpm dev:publimicro` again)

---

## 🧪 Step 5: Test the Webhook

With both windows running (Next.js server + Stripe listener), open a **THIRD** PowerShell window:

```powershell
# Trigger a test checkout completion event
& "$env:USERPROFILE\stripe-cli\stripe.exe" trigger checkout.session.completed
```

**Expected output:**
```
Setting up fixture for: checkout.session.completed
Running fixture for: checkout.session.completed
Trigger succeeded! Check dashboard for event details.
```

**Check these places:**
1. **Stripe CLI listener window** - Should show:
   ```
   2025-11-07 XX:XX:XX   --> checkout.session.completed [200]
   ```

2. **Next.js dev server logs** - Should show:
   ```
   Processing checkout.session.completed: cs_test_XXXXXXX
   Enhancement created: uuid-here
   ```

3. **Supabase Database** - Check `listing_enhancements` table for a new row

---

## 🚀 Step 6: Test Real Checkout Flow (End-to-End)

### Option A: Via API (Postman/curl)

You need:
- A valid Supabase auth token
- An existing announcement ID
- User must be verified (status='approved' in user_verifications)

```powershell
# Example curl (replace values)
curl -X POST http://localhost:3000/api/enhancements/create-checkout `
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{
    "announcement_id": "uuid-of-announcement",
    "category": "items",
    "enhancement_type": "highlight"
  }'
```

Response will include `checkout_url` - open it in browser and use test card: `4242 4242 4242 4242`

### Option B: Build UI Button (next step)

We'll create the verification UI and purchase buttons in the next phase.

---

## 🌐 Step 7: Production Setup (When Ready to Deploy)

### A. Create Production Webhook in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-production-domain.com/api/webhooks/stripe-enhancements`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. **Copy the Signing Secret** (starts with `whsec_`)

### B. Add to Vercel Environment Variables

1. Go to your Vercel project → Settings → Environment Variables
2. Add these:
   - `STRIPE_SECRET_KEY` = `sk_live_YOUR_LIVE_KEY` (use LIVE key for production!)
   - `STRIPE_WEBHOOK_SECRET` = `whsec_PRODUCTION_SECRET` (from Dashboard)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_YOUR_LIVE_KEY`
3. Redeploy

### C. Switch to Live Mode

When ready for real payments:
1. Get your **LIVE** keys from Stripe Dashboard (not test keys)
2. Update all environment variables with live keys
3. Re-create products in live mode or use the same script with live API key

---

## 🐛 Troubleshooting

### "Webhook signature verification failed"
- Make sure `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the CLI output
- Restart Next.js server after changing `.env.local`
- The CLI secret is DIFFERENT from Dashboard secret (only use CLI secret for local dev)

### "404 Not Found" on webhook endpoint
- Verify file exists: `apps/publimicro/src/app/api/webhooks/stripe-enhancements/route.ts`
- Check Next.js is running on port 3000
- Try: http://localhost:3000/api/webhooks/stripe-enhancements (should return 405 Method Not Allowed for GET)

### Events forwarded but no DB records
- Check `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Check Next.js server logs for errors
- Verify `listing_enhancements` table exists in Supabase

### CLI says "stripe command not found"
- Use full path: `& "$env:USERPROFILE\stripe-cli\stripe.exe"`
- Or add to PATH (optional):
  ```powershell
  $env:PATH += ";$env:USERPROFILE\stripe-cli"
  ```

---

## 📋 Quick Reference Commands

```powershell
# Login to Stripe
& "$env:USERPROFILE\stripe-cli\stripe.exe" login

# Start webhook forwarding
& "$env:USERPROFILE\stripe-cli\stripe.exe" listen --forward-to http://localhost:3000/api/webhooks/stripe-enhancements

# Trigger test events
& "$env:USERPROFILE\stripe-cli\stripe.exe" trigger checkout.session.completed
& "$env:USERPROFILE\stripe-cli\stripe.exe" trigger payment_intent.succeeded
& "$env:USERPROFILE\stripe-cli\stripe.exe" trigger payment_intent.payment_failed

# View webhook logs
& "$env:USERPROFILE\stripe-cli\stripe.exe" logs tail

# List all products
& "$env:USERPROFILE\stripe-cli\stripe.exe" products list

# Get CLI version
& "$env:USERPROFILE\stripe-cli\stripe.exe" --version
```

---

## ✅ Checklist

- [x] Stripe CLI installed
- [ ] Authenticated with `stripe login`
- [ ] Dev server running (`pnpm dev:publimicro`)
- [ ] Webhook listener running (`stripe listen --forward-to ...`)
- [ ] `STRIPE_WEBHOOK_SECRET` added to `.env.local`
- [ ] Dev server restarted after adding secret
- [ ] Test event triggered successfully
- [ ] Verified record created in Supabase

Once all checked, you're ready to build the verification UI!

---

**Next Steps After Webhook Setup:**
1. Create Supabase Storage bucket for verification documents
2. Build verification wizard UI (`/verificacao` page)
3. Build admin verification queue
4. Test full flow: signup → verify → purchase enhancement
