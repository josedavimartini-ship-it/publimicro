# PubliMicro AI Agent Instructions

## Project Overview
**PubliMicro** is a Brazilian classified ads marketplace monorepo with 9 specialized Next.js apps sharing a unified tech stack. It's a TurboPack-managed monorepo using pnpm workspaces, Supabase for auth/db, and Vercel for deployment.

## Architecture

### Monorepo Structure
- **Apps** (`apps/`): 9 independent Next.js 16 apps (App Router) - `publimicro` (main), `proper` (real estate), `motors` (vehicles), `machina` (machinery), `outdoor`, `journey`, `global`, `share`, `tudo`
- **Packages** (`packages/`): Shared libraries
  - `@publimicro/ui`: Shared React components (Navbar, Footer, Carcara3D, TopNav, FloatingWhatsApp, etc.)
  - `db/`: Database schemas (legacy - Supabase migrations are the source of truth)
  - `tsconfig/`: Shared TypeScript configs
- **Build System**: TurboRepo with caching, filters for targeted builds
- **Package Manager**: pnpm@10.20.0 with workspace protocol (`workspace:*`)

### Tech Stack
- **Frontend**: Next.js 16, React 19, TailwindCSS 4.1, TypeScript 5.9
- **Backend**: Supabase (PostgreSQL + Auth + SSR helpers)
- **3D/Maps**: React Three Fiber, Leaflet, react-leaflet
- **State**: Zustand, React Hook Form
- **Deployment**: Vercel (each app has separate `vercel.json`)

## Critical Workflows

### Development
```powershell
# Install dependencies (first time)
pnpm install

# Build shared UI package (REQUIRED before running apps)
pnpm turbo build --filter=@publimicro/ui

# Run specific app
pnpm dev:publimicro  # Port 3000
pnpm dev:journey     # Port varies

# Run all apps (parallel)
pnpm dev

# Type checking
pnpm type-check
```

### Database Management
- **Migrations**: Located in `supabase/migrations/` (NOT `packages/db/schema.sql`)
- **Run migrations**: Use `setup-database.ps1` or `run-migrations.ps1` PowerShell scripts
- **Schema changes**: Always create new migration files, never edit existing ones
- **Key tables**: `user_profiles`, `properties`, `sitios`, `property_favorites`, `visit_requests`, `property_proposals`

### Deployment
Each app deploys independently to Vercel via:
```json
// apps/[app-name]/vercel.json
{
  "buildCommand": "pnpm turbo run build --filter=@publimicro/[app-name]",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": "nextjs"
}
```
Root directory is `.` (repo root), not app folder. See `VERCEL-SETUP.md` for details.

## Project-Specific Patterns

### Supabase Client Creation
**NEVER** instantiate Supabase directly. Use these helpers:

**Server Components** (`apps/publimicro/src/lib/supabaseServer.ts`):
```typescript
import { createServerSupabaseClient } from '@/lib/supabaseServer';
const supabase = createServerSupabaseClient(); // Uses cookies
```

**Client Components**:
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
const supabase = createClientComponentClient();
```

**Route Handlers** (`apps/publimicro/src/app/auth/callback/route.ts`):
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
const supabase = createRouteHandlerClient({ cookies });
```

### Authentication Flow
1. User signs up/in via `apps/publimicro/src/app/entrar/page.tsx`
2. Callback handled at `apps/publimicro/src/app/auth/callback/route.ts`
3. Profile auto-created/upserted in `user_profiles` table
4. Auth state managed by `AuthProvider` component with `useAuth()` hook
5. Protected routes check auth in `useEffect` and redirect to `/entrar?redirect=/original-path`

### Shared Component Usage
Import from `@publimicro/ui` workspace package:
```typescript
import { TopNav, Carcara3D, FloatingWhatsApp, Navbar, Footer } from "@publimicro/ui";
```
**Important**: Rebuild UI package after changes: `pnpm turbo build --filter=@publimicro/ui`

### Image Handling
- Property photos stored as JSON array: `fotos: string[]` (Supabase Storage URLs or Unsplash)
- Use `getFirstPhoto()` utility from `apps/publimicro/src/lib/photoUtils.ts`
- Unsplash integration via `useUnsplashImages()` hook for demo content

### KML/GeoJSON Property Boundaries
- KML files in `apps/publimicro/public/kml/`
- Mapping logic in `apps/publimicro/src/lib/kmlMapping.ts`
- Dynamic map component: `LeafletMapKML` (SSR disabled)

### Common Component Patterns
- **Breadcrumbs**: Auto-generate from pathname, used on all non-home pages
- **Toasts**: Use `useToast()` hook from `ToastProvider`
- **Modals**: Use `FocusLock` + `Escape` key handling
- **Skeletons**: Import from `components/Skeleton.tsx`, 4 variants (text, rectangular, circular, card)
- **PWA**: Manifest in `apps/publimicro/public/manifest.json`, install prompt component

### UX Features
- **Recently Viewed**: Stored in localStorage, max 5 items
- **Favorites**: User-specific in `property_favorites` table with folder organization
- **Comparison**: Side-by-side property comparison (localStorage)
- **Visit Scheduling**: `VisitScheduler` component, requires profile completion
- **Bid System**: `ProposalModal`, tracks proposals in `property_proposals`

## Environment Variables
Each app needs (`.env.local`):
```bash
# Supabase (critical - apps won't work without these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # Server-only!

# Stripe (optional for payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Unsplash (optional for demo images)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=...
```

## Testing & Quality
- **Linting**: `pnpm lint` (ESLint 9 with TypeScript)
- **Type Checking**: `pnpm type-check` before commits
- **No Frozen Lockfile**: Vercel uses `--no-frozen-lockfile` for flexibility

## Common Issues

### Build Failures
1. **"Module not found: @publimicro/ui"**: Run `pnpm turbo build --filter=@publimicro/ui`
2. **"Cannot find module 'supabase'"**: Check env vars are set
3. **TurboRepo cache issues**: Run `pnpm clean:deep` (removes node_modules, .next, .turbo)

### Supabase Errors
- **PGRST116 (Row not found)**: Expected for new users, handle gracefully
- **Auth errors**: Check callback route at `/auth/callback` has proper error handling

### Deployment
- Each app needs separate Vercel project with root directory set to `.` (empty/repository root)
- Build command auto-detected from `vercel.json` in each app
- Use `VERCEL_ENV` to differentiate preview vs production

## Key Files Reference
- `turbo.json` - Build orchestration, caching config
- `pnpm-workspace.yaml` - Workspace catalog, package extensions
- `apps/publimicro/src/lib/supabaseServer.ts` - Server-side Supabase clients
- `packages/ui/src/index.ts` - Shared component exports
- `supabase/migrations/` - Database schema (source of truth)
- Setup scripts: `setup-database.ps1`, `deploy-all-apps.ps1`, `quick-setup.ps1`

## Conventions
- **File naming**: Use kebab-case for files (`auth-callback.tsx`), PascalCase for components
- **Imports**: Prefer `@/` alias for app-local imports, `@publimicro/ui` for shared
- **Colors**: Use theme from `packages/ui/src/theme.ts` - primary: `#FF6B35`, secondary: `#8B9B6E`, accent: `#D4A574`
- **Responsive**: Mobile-first with breakpoints at 768px (md), 1024px (lg)
- **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation support
- **Error Handling**: Always wrap async operations in try/catch, show user-friendly messages via toast

## When Stuck
1. Check relevant `.md` docs: `VERCEL-SETUP.md`, `ADMIN-PANEL.md`, `AUTHENTICATION-SETUP-GUIDE.md`
2. Search for similar patterns: `grep -r "pattern" apps/publimicro/src/`
3. Verify Supabase schema in latest migration file
4. Test with: `pnpm type-check && pnpm lint`
