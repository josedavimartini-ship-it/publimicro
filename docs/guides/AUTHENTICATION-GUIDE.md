# 🔐 PubliMicro Authentication Guide

Complete guide for authentication setup including Supabase, OAuth providers, and admin configuration.

**Last Updated:** December 2, 2025

---

## 📋 Overview

PubliMicro uses Supabase for authentication with multiple providers:
- ✅ Email/Password (configured)
- ✅ Google OAuth (optional)
- ✅ Microsoft OAuth (optional)
- ⏳ Apple Sign In (requires $99/year Apple Developer account)
- ⏳ Phone/SMS (requires Twilio)

---

## 🔧 Current Configuration

**Supabase Project ID:** `irrzpwzyqcubhhjeuakc`

**Configured:**
- Email/Password authentication
- User profiles table with auto-creation
- Auth callback handler at `/auth/callback`
- Protected routes with redirect

---

## 1️⃣ Supabase URL Configuration

### Access Settings
1. Go to: https://supabase.com/dashboard
2. Select project: `publimicro`
3. Navigate to: **Authentication** → **URL Configuration**

### Configure URLs
| Setting | Development | Production |
|---------|-------------|------------|
| Site URL | `http://localhost:3000` | `https://publimicro.com.br` |
| Redirect URLs | `http://localhost:3000/auth/callback` | `https://publimicro.com.br/auth/callback` |

**Add ALL redirect URLs:**
```
http://localhost:3000/auth/callback
https://publimicro.vercel.app/auth/callback
https://publimicro.com.br/auth/callback
```

---

## 2️⃣ Google OAuth Setup

### Step 1: Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Create project: **"PubliMicro"**
3. Navigate to: **APIs & Services** → **Credentials**
4. Click: **Create Credentials** → **OAuth client ID**

### Step 2: Configure OAuth Client
- Application type: **Web application**
- Name: `PubliMicro Production`
- Authorized redirect URIs:
  ```
  https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
  ```

### Step 3: Enable in Supabase
1. Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Enable and paste:
   - **Client ID** (e.g., `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (e.g., `GOCSPX-abc123xyz`)
3. Save

---

## 3️⃣ Microsoft (Azure) OAuth Setup

### Step 1: Azure Portal
1. Go to: https://portal.azure.com/
2. Navigate to: **Azure Active Directory** → **App registrations**
3. Click: **New registration**

### Step 2: Configure Registration
- Name: `PubliMicro`
- Account types: **Accounts in any organizational directory and personal Microsoft accounts**
- Redirect URI: `https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback`

### Step 3: Create Client Secret
1. Go to: **Certificates & secrets** → **New client secret**
2. Description: `PubliMicro Production`
3. Expires: 24 months
4. **Copy the Value immediately** (shown only once!)

### Step 4: Enable in Supabase
1. Supabase Dashboard → **Authentication** → **Providers** → **Azure**
2. Enable and paste:
   - **Client ID** (Application ID from Overview)
   - **Client Secret** (Value from Step 3)
3. Save

---

## 4️⃣ Code Implementation

### Supabase Client Helpers

**Location:** `apps/publimicro/src/lib/supabaseServer.ts`

```typescript
// Server Components
import { createServerSupabaseClient } from '@/lib/supabaseServer';
const supabase = createServerSupabaseClient();

// Client Components
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
const supabase = createClientComponentClient();

// Route Handlers
import { createRouteSupabaseClient } from '@/lib/supabaseServer';
const supabase = createRouteSupabaseClient();
```

### Auth Provider Component

**Location:** `apps/publimicro/src/components/providers/AuthProvider.tsx`

```typescript
import { useAuth } from '@/components/providers/AuthProvider';

function MyComponent() {
  const { user, profile, isLoading, signOut } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <LoginPrompt />;
  
  return <div>Welcome, {profile?.nome}</div>;
}
```

### Protected Route Pattern

```typescript
'use client';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/entrar?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) return <div>Carregando...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

---

## 5️⃣ Auth Callback Handler

**Location:** `apps/publimicro/src/app/auth/callback/route.ts`

This route handles OAuth redirects and creates user profiles.

**Key behaviors:**
1. Exchanges auth code for session
2. Creates/updates `user_profiles` record
3. Redirects to original path or home

---

## 6️⃣ Admin User Setup

### Option 1: Via Supabase SQL Editor
```sql
-- Make a user admin by email
UPDATE user_profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

### Option 2: Via Supabase Dashboard
1. Go to: **Authentication** → **Users**
2. Find user → Click → Edit **Raw user meta data**
3. Add: `{ "role": "admin" }`

### Check Admin Status in Code
```typescript
const { profile } = useAuth();
const isAdmin = profile?.role === 'admin';
```

---

## 7️⃣ Testing Checklist

### Local Development
- [ ] Email signup creates account
- [ ] Email login works
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Auth callback handles OAuth redirect
- [ ] User profile auto-created on first login
- [ ] Redirect parameter works after login

### OAuth Testing
- [ ] Google login button works
- [ ] Microsoft login button works
- [ ] OAuth creates user profile

### Production
- [ ] Redirect URLs configured in Supabase
- [ ] OAuth providers configured with production domains
- [ ] Email templates customized

---

## ⚠️ Troubleshooting

### "Invalid redirect URI"
- Add the exact callback URL to Supabase URL Configuration
- Check for trailing slashes

### "OAuth consent screen not configured"
- Google: Configure consent screen in Google Cloud Console
- Microsoft: Configure app permissions in Azure Portal

### User profile not created
- Check `user_profiles` table exists
- Check RLS policies allow inserts
- Check auth callback route is handling profile creation

### Session not persisting
- Check cookies are enabled
- Check NEXT_PUBLIC_SITE_URL matches actual domain
- Clear browser cookies and try again

---

## 📚 Related Files

- `apps/publimicro/src/lib/supabaseServer.ts` - Server client helpers
- `apps/publimicro/src/components/providers/AuthProvider.tsx` - Auth context
- `apps/publimicro/src/app/auth/callback/route.ts` - OAuth callback
- `apps/publimicro/src/app/entrar/page.tsx` - Login page
- `supabase/migrations/` - Database schema for user_profiles
