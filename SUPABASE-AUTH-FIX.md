# Supabase Authentication Fix Guide

## Issue: "requested path is invalid" Error

This error occurs when Supabase OAuth redirect URLs are not properly configured. The code is correct, but Supabase Dashboard settings need to be updated.

## Solution Steps

### 1. Configure Supabase Authentication URLs

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `irrzpwzyqcubhhjeuakc`
3. Navigate to **Authentication** → **URL Configuration**
4. Add the following URLs:

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs** (Add all of these):
```
http://localhost:3000/api/auth/callback
http://localhost:3000
https://publimicro.vercel.app/api/auth/callback
https://publimicro.vercel.app
```

### 2. Configure Google OAuth Provider

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Add your Google OAuth credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)

4. In **Authorized redirect URIs**, add:
```
https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
```

### 3. Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Navigate to **APIs & Services** → **Credentials**
3. Create or edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
```
https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
```

5. Add to **Authorized JavaScript origins**:
```
http://localhost:3000
https://publimicro.vercel.app
```

### 4. Test the Authentication Flow

1. Start your dev server: `pnpm dev`
2. Navigate to http://localhost:3000
3. Click "Conta" or go to http://localhost:3000/entrar
4. Click "Continuar com Google"
5. You should be redirected to Google login
6. After login, you'll be redirected back to http://localhost:3000/api/auth/callback
7. Then redirected to home page as authenticated user

## Current Code Status

### ✅ Already Implemented Correctly

1. **AccountModal.tsx** - OAuth provider login
   - Uses correct redirect URL construction
   - Handles errors properly
   - Includes offline access and consent prompt

2. **API Callback Route** - `/api/auth/callback/route.ts`
   - Exchanges code for session
   - Handles errors gracefully
   - Redirects to requested page

3. **FavoritesButton.tsx** - Authentication gate
   - Checks if user is logged in
   - Shows alert if not authenticated
   - Redirects to `/entrar` for login

4. **Heart Icon Position**
   - Already positioned at top-right
   - Code: `<div className="absolute top-3 right-3">`
   - Located in: `apps/publimicro/src/app/page.tsx:394`

## Authentication Flow Diagram

```
User clicks "Google Login"
  ↓
AccountModal.tsx → supabase.auth.signInWithOAuth()
  ↓
Redirects to Google
  ↓
User logs in on Google
  ↓
Google redirects to: /api/auth/callback?code=...
  ↓
route.ts → exchangeCodeForSession(code)
  ↓
Success → Redirect to home page
Error → Redirect to /?error=auth_failed
```

## Troubleshooting

### If OAuth still doesn't work:

1. **Check browser console** for error messages
2. **Check Supabase logs**: Dashboard → Logs → Auth
3. **Verify environment variables**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://irrzpwzyqcubhhjeuakc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Clear browser cookies** and try again
5. **Test in incognito mode** to avoid cached issues

### Common Issues

**Issue**: "requested path is invalid"
**Fix**: Add redirect URLs to Supabase Dashboard (see step 1 above)

**Issue**: "OAuth provider not enabled"
**Fix**: Enable Google provider in Supabase Dashboard

**Issue**: "Invalid client credentials"
**Fix**: Check Google OAuth Client ID and Secret in Supabase

**Issue**: Redirect loop
**Fix**: Ensure Site URL is set correctly in Supabase

## Next Steps

After fixing OAuth, test these flows:

1. ✅ Login with Google
2. ✅ Click heart icon when not logged in → redirects to /entrar
3. ✅ Click heart icon when logged in → adds to favorites
4. ✅ Visit schedule button → checks authentication
5. ✅ Place bid → requires login

All authentication is centralized through:
- `/lib/supabaseClient.ts` - Client instance
- `/components/AccountModal.tsx` - Login modal
- `/app/api/auth/callback/route.ts` - OAuth callback handler
