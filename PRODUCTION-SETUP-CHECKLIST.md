# Production Setup Checklist

## Status: 🔧 IN PROGRESS

---

## 1. Email Service (Resend) - **ACTION REQUIRED**

### Step 1: Create Resend Account
1. Go to https://resend.com
2. Sign up with your email
3. Verify your email address

### Step 2: Get API Key
1. Navigate to **API Keys** in Resend dashboard
2. Click **Create API Key**
3. Name: `PubliMicro Production`
4. Copy the key (starts with `re_`)

**⚠️ I NEED FROM YOU:**
```
RESEND_API_KEY=re_________________________
```

### Step 3: Domain Verification (Optional for now, required for production)
For now, emails will be sent from `onboarding@resend.dev`
For production domain:
1. Add your domain in Resend
2. Add DNS records (I'll help with this later)
3. Update `EMAIL_FROM` variable

---

## 2. Supabase Configuration - ✅ READY

**Current Status:**
```
✅ NEXT_PUBLIC_SUPABASE_URL configured
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configured
⚠️ SUPABASE_SERVICE_ROLE_KEY is placeholder - needs real key
```

### Get Real Service Role Key
1. Go to https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc
2. Navigate to **Settings** → **API**
3. Copy **service_role** key (secret, never expose to client)

**⚠️ I NEED FROM YOU:**
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc________________________
```

---

## 3. Stripe Configuration - ⏳ OPTIONAL (for payments)

**Current Status:**
```
⚠️ Using placeholder test key
```

If you want to enable payments now:
1. Go to https://dashboard.stripe.com/test/apikeys
2. Get **Secret key** (starts with `sk_test_`)
3. Get **Publishable key** (starts with `pk_test_`)

**⚠️ I NEED FROM YOU (optional):**
```
STRIPE_SECRET_KEY=sk_test_________________________
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_________________________
```

---

## 4. Site URL Configuration - ✅ CAN CONFIGURE NOW

For local development:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production (once deployed):
```
NEXT_PUBLIC_SITE_URL=https://publimicro.com.br
```

---

## 5. Vercel Deployment - **READY TO DEPLOY**

### Apps Ready for Deployment:
- ✅ `publimicro` (main app) - configured
- ✅ `proper` - configured  
- ✅ `motors` - configured
- ✅ `journey` - configured
- ✅ `tudo` - configured
- ✅ `share` - configured
- ✅ `machina` - configured
- ✅ `outdoor` - configured
- ✅ `global` - configured

### Deployment Steps (I can help):
1. Connect GitHub repo to Vercel
2. Create project for main app
3. Set environment variables (see below)
4. Deploy!

---

## 6. Environment Variables Summary

### Required for Production:

```bash
# Supabase (CRITICAL)
NEXT_PUBLIC_SUPABASE_URL=https://irrzpwzyqcubhhjeuakc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlycnpwd3p5cWN1YmhoamV1YWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTEwMzcsImV4cCI6MjA3NjI4NzAzN30.pTIM3oukbYVAqWAI8TFbKQySLur3PZP-4VIlVt9FJpE
SUPABASE_SERVICE_ROLE_KEY=[NEED FROM YOU]

# Email Service (CRITICAL for notifications)
RESEND_API_KEY=[NEED FROM YOU]
EMAIL_FROM=PubliMicro <noreply@publimicro.com.br>

# Site Configuration (CRITICAL)
NEXT_PUBLIC_SITE_URL=https://publimicro.com.br

# Stripe (OPTIONAL - for payments)
STRIPE_SECRET_KEY=[OPTIONAL]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[OPTIONAL]
```

### How to Set in Vercel:
1. Go to Vercel project settings
2. Navigate to **Environment Variables**
3. Add each variable above
4. Apply to: **Production**, **Preview**, **Development**

---

## 7. Database Setup - ✅ READY

**Migrations Status:**
- All migrations in `supabase/migrations/` folder
- Run migrations: `pnpm run-migrations` (already done?)

**Tables Verified:**
- ✅ `user_profiles` (with role column for admin)
- ✅ `properties`
- ✅ `visits`
- ✅ `proposals`
- ✅ `user_verifications`
- ✅ `property_favorites`

---

## 8. Build Test - **CAN DO NOW**

Let me test if everything builds:

```bash
pnpm turbo build --filter=@publimicro/publimicro
```

This will verify:
- All TypeScript compiles
- No build errors
- Production bundle can be created

---

## 9. Pre-Launch Testing Checklist

### Core Flows to Test:
- [ ] User signup (with welcome email)
- [ ] User login
- [ ] Property listing browsing
- [ ] Property posting
- [ ] Visit request (with email notification)
- [ ] Proposal submission (with email notification)
- [ ] Admin dashboard access
- [ ] User verification workflow

---

## 10. Production Readiness Score

**Current Status: 70% Ready**

### Ready ✅
- [x] Code deployed to GitHub (24 commits pushed)
- [x] Dark theme implemented
- [x] Eagle 3D model integrated
- [x] API features implemented
- [x] Routing optimized
- [x] Type-check passing
- [x] Vercel config ready
- [x] Database schema ready

### Need Before Launch ⚠️
- [ ] **Resend API key** (critical for emails)
- [ ] **Real Supabase service role key** (critical for admin functions)
- [ ] Vercel deployment (15 mins)
- [ ] Environment variables set in Vercel (10 mins)
- [ ] Production build test (5 mins)
- [ ] Basic flow testing (30 mins)

### Optional 🔵
- [ ] Stripe keys (can add later when enabling payments)
- [ ] Domain verification for emails (can use onboarding@resend.dev for now)
- [ ] Custom domain setup
- [ ] SSL certificate (Vercel provides free)
- [ ] Analytics setup (Google Analytics, Vercel Analytics)

---

## What I Need From You RIGHT NOW:

Please provide these 2 critical keys:

### 1. Resend API Key
```
RESEND_API_KEY=re_________________________
```
**How to get:**
- Go to https://resend.com
- Sign up (free, takes 2 minutes)
- Create API key
- Copy and paste here

### 2. Supabase Service Role Key
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc________________________
```
**How to get:**
- Go to https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc/settings/api
- Copy the **service_role** secret key (the long one under "Project API keys")
- Paste here

---

## What I'll Do Once You Provide Keys:

1. ✅ Update `.env.local` with real keys
2. ✅ Test production build locally
3. ✅ Create `.env.production` template
4. ✅ Guide you through Vercel deployment
5. ✅ Help set environment variables in Vercel
6. ✅ Deploy to production
7. ✅ Test all critical flows
8. 🚀 **GO LIVE!**

---

## Timeline Estimate:

**With keys provided:**
- Environment setup: 5 minutes
- Local build test: 5 minutes  
- Vercel deployment: 15 minutes
- Environment variables: 10 minutes
- Testing: 30 minutes
- **Total: ~1 hour to production**

**Without keys (using placeholders):**
- Can deploy, but emails won't work
- Admin functions may fail
- Not recommended for production

---

## Ready to proceed?

Please share the 2 keys above and I'll complete the setup! 🚀
