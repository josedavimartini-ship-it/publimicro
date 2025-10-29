# 🚀 PubliMicro Setup & Deployment Guide

## 📋 Pre-requisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Supabase account created
- Google Cloud Console (for OAuth)
- Microsoft Azure (for OAuth - optional)

## 1️⃣ Environment Variables

Create `.env.local` in `apps/publimicro/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://irrzpwzyqcubhhjeuakc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 2️⃣ Install Dependencies

```powershell
cd C:\projetos\publimicro
pnpm install
```

## 3️⃣ Setup Supabase Database

1. Go to Supabase SQL Editor
2. Run each migration file in order:
   - `sql/01_create_profiles.sql`
   - `sql/02_create_ads.sql`
   - `sql/03_create_visits.sql`
   - `sql/04_create_proposals.sql`
   - `sql/05_create_bids.sql`
   - `sql/06_create_sitios.sql`

3. Verify tables created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

## 4️⃣ Setup OAuth Providers

### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project "PubliMicro"
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret
7. In Supabase Dashboard → Authentication → Providers → Google
8. Paste Client ID and Secret
9. Enable Google provider

### Microsoft OAuth:
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register new application
3. Add redirect URI: `https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback`
4. Create client secret
5. In Supabase Dashboard → Authentication → Providers → Azure
6. Paste Application ID and Secret
7. Enable Azure provider

## 5️⃣ Build Shared Packages

```powershell
cd C:\projetos\publimicro\packages\ui
pnpm build

cd C:\projetos\publimicro\packages\db
pnpm build
```

## 6️⃣ Download Section Images

Run the PowerShell script:

```powershell
cd C:\projetos\publimicro
.\download-section-images.ps1
```

Or download manually to:
```
apps/publimicro/public/images/sections/
```

## 7️⃣ Run Development Server

```powershell
cd C:\projetos\publimicro
pnpm dev
```

Visit: `http://localhost:3000`

## 8️⃣ Test Checklist

- [ ] Home page loads with all sections
- [ ] TopNav shows correctly (no duplicates)
- [ ] World Regions sidebar on RIGHT side
- [ ] Bird animation visible (not covered)
- [ ] WhatsApp button floating bottom-right
- [ ] Section images load
- [ ] Carcará project images load
- [ ] Click "Conta" opens login modal
- [ ] Google/Microsoft OAuth buttons work
- [ ] Schedule visit modal works
- [ ] Proposal modal validates visit requirement
- [ ] All placeholder pages accessible

## 9️⃣ Production Deployment (Vercel)

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd C:\projetos\publimicro\apps\publimicro
vercel --prod
```

### Environment Variables on Vercel:
Add in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BASE_URL` (your production URL)

## 🔧 Common Issues & Fixes

### Issue: Images not loading from Supabase
**Fix:** 
1. Check Supabase Storage → `imagens-sitios` bucket is PUBLIC
2. Verify URLs in browser (incognito mode)
3. Add `unoptimized` prop to Next.js Image components

### Issue: OAuth not working locally
**Fix:**
- Use `http://localhost:3000` (not 127.0.0.1)
- Add `http://localhost:3000` to OAuth redirect URIs in Google/Microsoft consoles

### Issue: "sitios" table empty
**Fix:**
Run the insert statements from `06_create_sitios.sql`

### Issue: Proposals blocked even after visit
**Fix:**
Manually update visit status:
```sql
UPDATE visits SET status = 'completed' WHERE id = 'your-visit-id';
```

## 📊 Database Queries for Testing

```sql
-- Check profiles
SELECT * FROM profiles;

-- Check visits
SELECT * FROM visits ORDER BY created_at DESC;

-- Check proposals
SELECT * FROM proposals ORDER BY created_at DESC;

-- Check bids
SELECT * FROM bids ORDER BY created_at DESC;

-- Get Carcará sites
SELECT * FROM sitios WHERE destaque = true;
```

## 🎯 Next Steps

1. Add real property data to `ads` table
2. Implement admin dashboard for visit/proposal management
3. Add email notifications (Supabase Edge Functions + Resend)
4. Add WhatsApp notifications (Twilio API)
5. Implement payment system (Stripe) for featured ads
6. Add analytics (Vercel Analytics + Google Analytics)
7. SEO optimization (sitemap.xml, robots.txt, metadata)

## 📞 Support

- GitHub Issues: [repo/issues](https://github.com/josedavimartini-ship-it/publimicro/issues)
- Email: contato@publimicro.com.br
- WhatsApp: +55 34 99261-0004
```