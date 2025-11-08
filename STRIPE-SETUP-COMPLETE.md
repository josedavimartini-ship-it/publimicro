# ✅ Stripe Webhook Setup - COMPLETE

## What We Did

1. ✅ **Installed Stripe CLI** → `C:\Users\Usuario\stripe-cli\stripe.exe`
2. ✅ **Verified your .env.local** → All Stripe keys already configured
3. ✅ **Created guides** → Step-by-step instructions ready

---

## 🚀 Quick Start (Copy & Run These Commands)

### Option 1: Automated Script

```powershell
.\stripe-quickstart.ps1
```

This will:
- Authenticate with Stripe (opens browser)
- Show you the next steps

### Option 2: Manual Steps

**Terminal 1 - Authenticate:**
```powershell
& "$env:USERPROFILE\stripe-cli\stripe.exe" login
```
→ Browser opens → Sign in → Authorize

**Terminal 2 - Start Next.js:**
```powershell
pnpm dev:publimicro
```

**Terminal 3 - Start Webhook Listener:**
```powershell
& "$env:USERPROFILE\stripe-cli\stripe.exe" listen --forward-to http://localhost:3000/api/webhooks/stripe-enhancements
```
→ Copy the `whsec_` secret it prints

**Update .env.local:**
Replace `STRIPE_WEBHOOK_SECRET` in `apps/publimicro/.env.local` with the new `whsec_` secret from CLI (if different)

**Terminal 4 - Test Event:**
```powershell
& "$env:USERPROFILE\stripe-cli\stripe.exe" trigger checkout.session.completed
```

---

## 📝 What to Look For

### ✅ Success Indicators:

1. **CLI Listener Window:**
   ```
   Ready! Your webhook signing secret is whsec_XXXXXXX
   2025-11-07 XX:XX:XX --> checkout.session.completed [200]
   ```

2. **Next.js Server Logs:**
   ```
   Processing checkout.session.completed: cs_test_XXXXX
   Enhancement created: uuid-here
   ```

3. **Supabase Database:**
   - Open Supabase → Table Editor → `listing_enhancements`
   - Should see a new row with `status='active'`

---

## 🎯 Testing Scenarios

### Scenario 1: Trigger Sample Events
```powershell
# Successful checkout
& "$env:USERPROFILE\stripe-cli\stripe.exe" trigger checkout.session.completed

# Successful payment
& "$env:USERPROFILE\stripe-cli\stripe.exe" trigger payment_intent.succeeded

# Failed payment
& "$env:USERPROFILE\stripe-cli\stripe.exe" trigger payment_intent.payment_failed
```

### Scenario 2: Real Checkout Flow (When UI is Built)
1. User clicks "Buy Highlight" button
2. System checks if user is verified
3. If verified → Creates Stripe Checkout session
4. User completes payment with test card: `4242 4242 4242 4242`
5. Stripe sends webhook → Your endpoint processes it
6. Enhancement activated in database

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `STRIPE-CLI-SETUP-GUIDE.md` | Detailed step-by-step guide with troubleshooting |
| `stripe-quickstart.ps1` | Automated authentication script |
| `STRIPE-VERIFICATION-COMPLETE.md` | Overall system architecture and status |

---

## 🌐 Production Setup (When Ready)

### Stripe Dashboard Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://publimicro.vercel.app/api/webhooks/stripe-enhancements`
4. Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy signing secret (starts with `whsec_`)

### Vercel Environment Variables

Add to your Vercel project:
```
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
STRIPE_WEBHOOK_SECRET=whsec_PRODUCTION_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
```

**IMPORTANT:** Use **LIVE** keys (not test) for production!

---

## 🐛 Common Issues & Solutions

### "stripe command not found"
Use full path:
```powershell
& "$env:USERPROFILE\stripe-cli\stripe.exe" login
```

### "Webhook signature verification failed"
1. The CLI generates a NEW `whsec_` secret each time you run `listen`
2. Copy it to `STRIPE_WEBHOOK_SECRET` in `.env.local`
3. Restart Next.js dev server

### "404 Not Found" on webhook
1. Verify Next.js is running on port 3000
2. Check file exists: `apps/publimicro/src/app/api/webhooks/stripe-enhancements/route.ts`
3. Try accessing: http://localhost:3000/api/webhooks/stripe-enhancements (should return 405)

### Events forwarded but no DB records
1. Check `SUPABASE_SERVICE_ROLE_KEY` is set
2. Look for errors in Next.js server logs
3. Verify the `listing_enhancements` table exists

---

## ✅ Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Stripe CLI | ✅ Installed | v1.21.8 at C:\Users\Usuario\stripe-cli |
| Environment Variables | ✅ Configured | .env.local has all keys |
| Webhook Handler | ✅ Ready | /api/webhooks/stripe-enhancements |
| Products Created | ✅ Complete | 11 products in Stripe account |
| Database Schema | ✅ Deployed | listing_enhancements table ready |
| Verification System | ✅ Ready | Auto-approve/reject rules active |

**Next:** Build verification UI and admin queue

---

## 🎨 Next Steps (UI Components)

1. **Verification Wizard** (`/verificacao`)
   - Step 1: Personal info (CPF, name, DOB)
   - Step 2: Upload documents (ID + selfie)
   - Step 3: Processing (auto checks)
   - Step 4: Result (approved/rejected/manual review)

2. **Admin Verification Queue** (`/admin/verificacoes`)
   - List pending verifications
   - Review documents
   - Approve/reject with notes

3. **Purchase Buttons**
   - "Buy Highlight" on listing pages
   - Check verification before checkout
   - Redirect to Stripe payment

---

## 📞 Support

If stuck:
1. Check Stripe Dashboard → Developers → Events for webhook delivery logs
2. Check Supabase logs for database errors
3. Check Next.js terminal for handler errors
4. See `STRIPE-CLI-SETUP-GUIDE.md` troubleshooting section

---

**Ready to test!** Run `.\stripe-quickstart.ps1` to get started.
