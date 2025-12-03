# 🚀 PubliMicro Setup Guide

Complete setup guide for getting the PubliMicro monorepo running on a new machine.

**Last Updated:** December 2, 2025  
**Required Node.js:** ≥18.0.0  
**Package Manager:** pnpm@10.22.0

---

## 📋 Prerequisites

### Required Software
1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **pnpm 10+** - Install with: `npm install -g pnpm@latest`
3. **Git** - [Download](https://git-scm.com/)
4. **VS Code** - [Download](https://code.visualstudio.com/) (recommended)

### Required Accounts
- **Supabase** - [supabase.com](https://supabase.com) (database + auth)
- **Vercel** - [vercel.com](https://vercel.com) (deployment)
- **Stripe** - [stripe.com](https://stripe.com) (payments - optional for dev)
- **Resend** - [resend.com](https://resend.com) (emails - optional for dev)

---

## 🔧 Quick Start (5 minutes)

```powershell
# 1. Clone the repository
git clone https://github.com/josedavimartini-ship-it/publimicro.git
cd publimicro

# 2. Install dependencies
pnpm install

# 3. Copy environment template
Copy-Item apps/publimicro/.env.example apps/publimicro/.env.local

# 4. Build shared packages (REQUIRED before running apps)
pnpm turbo build --filter=@publimicro/ui --filter=@publimicro/stripe

# 5. Run the main app
pnpm dev:publimicro
```

Open: http://localhost:3000

---

## 🔑 Environment Variables

Create `apps/publimicro/.env.local` with these values:

### Required (App won't work without these)
```bash
# Supabase - Get from: supabase.com/dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URL (for auth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Optional (for full features)
```bash
# Stripe - Get from: dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (Resend) - Get from: resend.com/api-keys
RESEND_API_KEY=re_...
EMAIL_FROM=PubliMicro <noreply@publimicro.com.br>

# Unsplash (for demo images) - Get from: unsplash.com/developers
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=...
```

---

## 📦 Project Structure

```
publimicro/
├── apps/                     # Next.js applications
│   ├── publimicro/          # Main marketplace app (port 3000)
│   ├── proper/              # Real estate vertical
│   ├── motors/              # Vehicles vertical
│   ├── machina/             # Machinery vertical
│   ├── outdoor/             # Outdoor sports vertical
│   ├── journey/             # Travel vertical
│   ├── global/              # Global marketplace
│   ├── share/               # Rentals vertical
│   └── tudo/                # Everything marketplace
├── packages/                 # Shared libraries
│   ├── ui/                  # React components (@publimicro/ui)
│   ├── stripe/              # Stripe integration (@publimicro/stripe)
│   ├── db/                  # Database types (legacy)
│   └── tsconfig/            # TypeScript configs
├── supabase/                 # Database migrations
│   └── migrations/          # SQL migration files (source of truth)
├── docs/                     # Documentation
│   ├── guides/              # Setup and reference guides
│   └── archive/             # Historical documentation
└── scripts/                  # CI/CD and utility scripts
```

---

## 🏗️ Build Commands

```powershell
# Install all dependencies
pnpm install

# Build everything (with TurboRepo caching)
pnpm turbo build

# Build specific package
pnpm turbo build --filter=@publimicro/ui
pnpm turbo build --filter=@publimicro/publimicro

# Type check entire monorepo
pnpm type-check

# Lint all code
pnpm lint

# Clean all build artifacts
pnpm clean:deep
```

---

## 🖥️ Development Commands

```powershell
# Run main app
pnpm dev:publimicro      # Port 3000

# Run all apps in parallel
pnpm dev

# Run specific app by name
pnpm --filter @publimicro/proper dev
pnpm --filter @publimicro/motors dev
```

---

## 🗄️ Database Setup

### Option 1: Use Existing Supabase Project
1. Get credentials from Supabase Dashboard → Project Settings → API
2. Add to `.env.local` as shown above
3. Tables should already exist from previous migrations

### Option 2: Fresh Supabase Project
1. Create new project at [supabase.com](https://supabase.com)
2. Get credentials from Project Settings → API
3. Run migrations using the setup script:

```powershell
# Run all migrations in order
.\setup-database.ps1

# Or run individually
.\run-migrations.ps1
```

### Key Database Tables
| Table | Purpose |
|-------|---------|
| `user_profiles` | Extended user data |
| `properties` | Real estate listings |
| `sitios` | Rural property listings |
| `property_favorites` | User favorites |
| `visit_requests` | Scheduled visits |
| `property_proposals` | Bids/offers |
| `contacts` | Contact form submissions |

---

## 🔐 Authentication Setup

### Supabase Auth Configuration
1. Go to: Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL**: `http://localhost:3000` (or production URL)
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback`

### OAuth Providers (Optional)
See `docs/guides/AUTHENTICATION-GUIDE.md` for Google/Microsoft OAuth setup.

---

## 🚀 Deployment

### Vercel Deployment
Each app deploys independently. The key configuration:

1. **Root Directory**: `.` (repository root, NOT app folder)
2. **Build Command**: Auto-detected from `vercel.json`
3. **Install Command**: `pnpm install --no-frozen-lockfile`

See `VERCEL-SETUP.md` for detailed Vercel configuration.

### Environment Variables in Vercel
Add all `.env.local` variables to Vercel:
- Project Settings → Environment Variables
- Select: ✅ Production ✅ Preview ✅ Development

---

## 🧪 Testing Locally

### Basic Test Checklist
- [ ] Home page loads at http://localhost:3000
- [ ] TopNav displays correctly
- [ ] Can navigate to `/imoveis`, `/classificados`
- [ ] Auth works: Can sign up/login
- [ ] Property cards display with images
- [ ] Map components render (Leaflet)

### Testing with ngrok (External Access)
```powershell
# Install ngrok if needed
choco install ngrok

# Expose local server
ngrok http 3000
```

Update Supabase redirect URLs with ngrok URL for external testing.

---

## ⚠️ Troubleshooting

### "Module not found: @publimicro/ui"
```powershell
# Rebuild the UI package
pnpm turbo build --filter=@publimicro/ui
```

### "Cannot find module 'supabase'"
- Check that all environment variables are set in `.env.local`
- Restart the dev server after changing env vars

### TypeScript Errors
```powershell
# Full type check to see all errors
pnpm type-check

# Check specific app
pnpm --filter @publimicro/publimicro type-check
```

### TurboRepo Cache Issues
```powershell
# Clear all caches
pnpm clean:deep

# Rebuild from scratch
pnpm install
pnpm turbo build
```

### Port Already in Use
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

---

## 📚 Related Documentation

- **Authentication**: `docs/guides/AUTHENTICATION-GUIDE.md`
- **Stripe/Payments**: `docs/guides/STRIPE-GUIDE.md`
- **Database**: `docs/guides/DATABASE-GUIDE.md`
- **Deployment**: `VERCEL-SETUP.md`
- **Testing**: `docs/guides/TESTING-GUIDE.md`
- **Dependencies**: `docs/DEPENDENCIES.md`
