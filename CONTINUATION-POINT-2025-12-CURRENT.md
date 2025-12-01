# Continuation Point - Current Session

## 🎯 Current Status: DATABASE QUERY FIXES + CORRUPTED FILES CLEANUP

**Branch:** `audit/initial-fixes`  
**Last Commits:**
- `fb2e214` - "fix(db): migrate all queries from non-existent 'properties' table to 'sitios'"
- `8ccb74c` - "fix: clean up corrupted files with leftover duplicate code"  
- `fe59622` - "fix: rebuild corrupted pages with proper content"

---

## ✅ What Was Just Completed

### Critical Discovery: Non-Existent Table References
The main `publimicro` app was querying a `properties` table that **doesn't exist** in the database. The actual table is `sitios` with Portuguese column names.

### Database Query Migrations (17+ files)
Fixed all queries from `properties` to `sitios` table with correct column names:

| Before (Wrong) | After (Correct) |
|----------------|-----------------|
| `title` | `nome` |
| `location` | `localizacao` |
| `price` | `preco` |
| `description` | `descricao` |
| `photos` | `fotos` |
| `total_area` | `area_total` |

**Files Modified:**
1. `apps/publimicro/src/app/comparar/page.tsx`
2. `apps/publimicro/src/lib/carcaraHelpers.ts`
3. `apps/publimicro/src/app/conta/page.tsx`
4. `apps/publimicro/src/app/minhas-propostas/page.tsx`
5. `apps/publimicro/src/app/admin/page.tsx`
6. `apps/publimicro/src/components/account/ListingsTab.tsx`
7. `apps/publimicro/src/app/api/admin/cleanup-listings/route.ts`
8. `apps/publimicro/src/app/api/visits/route.ts`
9. `apps/publimicro/src/app/api/proposals/route.ts`
10. `apps/publimicro/src/app/api/admin/property-media/route.ts`
11. `apps/publimicro/src/app/api/admin/property-media/proxy/route.ts`
12. `apps/publimicro/src/app/postar/page.tsx`

### Corrupted Files Rebuilt
Several pages had wrong content (duplicate posting forms instead of their proper pages):

| File | Issue | Fix |
|------|-------|-----|
| `/entrar/page.tsx` | Had posting form | Proper login/auth page |
| `/contato/page.tsx` | Had posting form | Proper contact form |
| `/assinatura/page.tsx` | Had posting form | Proper subscription page |
| `/projetos/carcara/page.tsx` | Had posting form | Proper Carcará showcase |
| `/acheme-coisas/postar/page.tsx` | Had wrong table | Proper listings table insert |
| `/acheme-coisas/publicado/page.tsx` | Had wrong content | Proper success page |

### TypeScript Validation
```powershell
pnpm type-check  # 0 errors ✅
```

---

## ⚠️ Known Issues (For Future Sessions)

### `proper` App Still Uses Non-Existent `properties` Table
The `proper` app (separate Next.js app for real estate) references a `properties` table that doesn't exist:

- `apps/proper/src/app/post/page.tsx`
- `apps/proper/src/app/search/page.tsx`
- `apps/proper/src/app/proposta/page.tsx`
- `apps/proper/src/app/property/[slug]/page.tsx`

**Options to resolve:**
1. Create `properties` table migration (requires schema design)
2. Migrate `proper` app to use `sitios` table
3. Disable/remove `proper` app if not needed

**Note:** This is a runtime issue, not build-time. The app compiles but will fail at runtime.

---

## 📊 Database Tables Reference

| Table | Purpose | App |
|-------|---------|-----|
| `sitios` | Rural properties (Sítios Carcará) | publimicro |
| `listings` | General classifieds | publimicro (AcheMeCoisas) |
| `user_profiles` | User accounts | all |
| `proposals` | Property bids | publimicro |
| `contacts` | Contact form submissions | publimicro |
| `visit_requests` | Property visit scheduling | publimicro |

### Column Mapping (sitios table)
```sql
-- sitios table columns (Portuguese)
id, nome, slug, localizacao, preco, area_total, descricao, fotos, 
video_url, projeto, caracteristicas, kml_url, user_id, created_at
```

---

## 🔧 Next Steps

### Immediate
1. Push the commits (user skipped push)
2. Verify Vercel deployment succeeds

### Short-term
1. Decide on `proper` app strategy
2. Update `.env.local` with rotated Supabase/Stripe keys
3. Test email flows in production

### Medium-term
1. Implement test suite
2. Performance profiling
3. UX improvements from audit

---

## 📁 File References

### Key Auth Helpers
```typescript
// Server Components
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// Client Components  
import { createBrowserSupabaseClient } from '@/lib/supabaseClient';

// Route Handlers
import { createRouteSupabaseClient } from '@/lib/supabaseServer';
```

### 6 Carcará Sítios
```typescript
const CANONICAL_SLUGS = ['abare', 'bigua', 'mergulhao', 'seriema', 'juriti', 'surucua'];
```
