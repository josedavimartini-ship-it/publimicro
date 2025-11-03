# Authentication and Image Issues - Complete Fix Summary

## Issues Reported

1. ❌ Google OAuth login error: `{"error":"requested path is invalid"}`
2. ✅ Heart icons on ranch cards appearing at top-left instead of top-right
3. ❌ Supabase photos not loading properly in card backgrounds
4. ✅ Google Authentication not centralized across the website
5. ✅ Favorite heart icon not properly redirecting to login

## Current Status

### ✅ Already Fixed in Code (No Changes Needed)

1. **Heart Icon Position** ✅
   - Location: `apps/publimicro/src/app/page.tsx:394`
   - Code: `<div className="absolute top-3 right-3">`
   - Status: **Already on top-right**

2. **Authentication Centralization** ✅
   - Centralized through: `apps/publimicro/src/lib/supabaseClient.ts`
   - Modal component: `apps/publimicro/src/components/AccountModal.tsx`
   - Callback handler: `apps/publimicro/src/app/api/auth/callback/route.ts`
   - Status: **Already centralized**

3. **Favorite Icon Auth Flow** ✅
   - Component: `apps/publimicro/src/components/FavoritesButton.tsx`
   - Behavior: Shows alert and redirects to `/entrar` when not logged in
   - When logged in: Toggles favorite in database
   - Status: **Already working correctly**

### ⚠️ Requires Supabase Dashboard Configuration

4. **Google OAuth Login Error** ⚠️
   - Problem: Supabase Site URL and Redirect URLs not configured
   - Code Status: **Already correct**
   - Action Required: Configure in Supabase Dashboard
   - Guide: See `SUPABASE-AUTH-FIX.md`

5. **Supabase Photos Not Loading** ⚠️
   - Problem: Storage bucket may not be public
   - Code Status: **Helper function added** (`photoUtils.ts`)
   - Action Required: Enable public bucket in Supabase
   - Guide: See `IMAGE-FIX-GUIDE.md`

## Code Changes Made

### New Files Created

1. **`SUPABASE-AUTH-FIX.md`**
   - Complete OAuth configuration guide
   - Step-by-step Supabase Dashboard setup
   - Google Cloud Console configuration
   - Troubleshooting section

2. **`IMAGE-FIX-GUIDE.md`**
   - Supabase Storage bucket configuration
   - SQL queries to fix photo URLs
   - Helper function usage guide
   - Testing procedures

3. **`apps/publimicro/src/lib/photoUtils.ts`**
   - `getPhotoUrl()` - Converts any path format to full URL
   - `getFirstPhoto()` - Gets first photo from array
   - `getAllPhotos()` - Gets all photos with proper URLs
   - `isValidPhotoUrl()` - Validates photo URLs

### Files Modified

4. **`apps/publimicro/src/app/page.tsx`**
   - Added import: `import { getFirstPhoto } from "@/lib/photoUtils"`
   - Changed: `const fotoUrl = sitio.fotos && sitio.fotos.length > 0 ? sitio.fotos[0] : "/images/fallback-rancho.jpg"`
   - To: `const fotoUrl = getFirstPhoto(sitio.fotos)`
   - Benefit: Consistent URL handling with proper fallbacks

## Required Actions (Supabase Dashboard)

### Fix OAuth Login (5 minutes)

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/api/auth/callback
   http://localhost:3000
   https://publimicro.vercel.app/api/auth/callback
   https://publimicro.vercel.app
   ```

4. Go to **Authentication** → **Providers** → **Google**
5. Enable Google provider
6. Add Google Client ID and Secret (from Google Cloud Console)
7. Save changes

### Fix Image Storage (3 minutes)

1. Go to **Supabase Dashboard** → **Storage**
2. Find bucket `imagens-sitios`
3. Click settings (⚙️) → Enable **Public bucket**
4. Go to **Storage** → **Policies**
5. Add policy:
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   TO public
   USING ( bucket_id = 'imagens-sitios' );
   ```

### Optional: Fix Photo URLs in Database

Run in **Supabase SQL Editor**:

```sql
-- Check current photo format
SELECT id, nome, fotos 
FROM sitios 
WHERE destaque = true 
LIMIT 5;

-- If photos are null, add placeholder
UPDATE sitios 
SET fotos = '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"]'::jsonb
WHERE fotos IS NULL 
   OR jsonb_array_length(fotos) = 0;
```

## Testing Checklist

After configuring Supabase Dashboard:

### Test OAuth Login
- [ ] Navigate to http://localhost:3000/entrar
- [ ] Click "Continuar com Google"
- [ ] Should redirect to Google login
- [ ] After login, should return to home page
- [ ] No "requested path is invalid" error
- [ ] User should be logged in (check "Conta" button)

### Test Images
- [ ] Navigate to http://localhost:3000
- [ ] Scroll to "Destaques de Sítios" section
- [ ] All ranch cards should show photos (not placeholders)
- [ ] Open browser console and check photo URLs
- [ ] URLs should be `https://irrzpwzyqcubhhjeuakc.supabase.co/storage/...`

### Test Heart Icons
- [ ] Heart icons appear at **top-right** of each card ✅ (already working)
- [ ] Click heart when **not logged in**
- [ ] Should show alert: "Você precisa fazer login..."
- [ ] Should redirect to `/entrar`
- [ ] Login, then click heart again
- [ ] Should toggle favorite (heart fills with color)

### Test Authentication Flow
- [ ] Click any protected feature when not logged in
- [ ] Should redirect to `/entrar`
- [ ] Login with Google
- [ ] Should redirect back to original page
- [ ] Feature should now work (schedule visit, place bid, etc.)

## Architecture Summary

### Authentication Flow
```
User → AccountModal.tsx
  ↓
supabaseClient.ts → supabase.auth.signInWithOAuth()
  ↓
Google OAuth
  ↓
Redirect → /api/auth/callback/route.ts
  ↓
exchangeCodeForSession()
  ↓
Home page (authenticated)
```

### Photo URL Processing
```
Database: sitios.fotos = ["path/to/photo.jpg"]
  ↓
photoUtils.ts → getFirstPhoto(fotos)
  ↓
Checks format: relative path? full URL? null?
  ↓
Returns: Full Supabase Storage URL or fallback
  ↓
Image component renders
```

### Favorite Toggle Flow
```
User clicks heart → FavoritesButton.tsx
  ↓
Check: userId exists?
  NO → Alert + redirect to /entrar
  YES → Toggle favorite in database
  ↓
Update UI (heart fills/unfills)
```

## Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `SUPABASE-AUTH-FIX.md` | OAuth configuration guide | 📝 Documentation |
| `IMAGE-FIX-GUIDE.md` | Image storage setup guide | 📝 Documentation |
| `apps/publimicro/src/lib/photoUtils.ts` | Photo URL helper | ✅ Implemented |
| `apps/publimicro/src/app/page.tsx` | Home page | ✅ Updated |
| `apps/publimicro/src/lib/supabaseClient.ts` | Supabase client | ✅ Already correct |
| `apps/publimicro/src/components/AccountModal.tsx` | Auth modal | ✅ Already correct |
| `apps/publimicro/src/app/api/auth/callback/route.ts` | OAuth callback | ✅ Already correct |
| `apps/publimicro/src/components/FavoritesButton.tsx` | Favorite button | ✅ Already correct |

## Commit History

- **1f8ed67** - "fix: Add comprehensive OAuth and image storage documentation with photoUtils helper"
  - 4 files changed, 451 insertions(+)
  - New documentation and helper utilities

## Next Steps

1. **Immediate** (5 min):
   - Configure OAuth URLs in Supabase Dashboard
   - Enable Google OAuth provider
   - Test login flow

2. **Soon** (3 min):
   - Make `imagens-sitios` bucket public
   - Add storage policy for public access
   - Test images load correctly

3. **Optional** (10 min):
   - Upload actual property photos to Supabase Storage
   - Update `sitios` table with correct photo paths
   - Replace placeholders with real images

## Support

If issues persist after configuration:

1. Check browser console for error messages
2. Check Supabase Dashboard → Logs → Auth
3. Verify environment variables in `.env.local`
4. Test in incognito mode
5. Clear browser cookies and cache

All code is ready - only Supabase Dashboard configuration is needed! 🚀
