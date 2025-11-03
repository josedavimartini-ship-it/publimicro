# Complete Authentication Setup Guide - Publimicro

## 🚨 CRITICAL: This guide will fix ALL authentication issues

### Current Issues
1. ✅ **Code is correct** - No code changes needed for basic OAuth
2. ❌ **Supabase Dashboard** - Missing configuration
3. ❌ **Google Cloud Console** - OAuth credentials need setup
4. ❌ **Environment Variables** - May need verification

---

## Step 1: Supabase Dashboard Configuration (5 minutes)

### A. Access Your Project
1. Go to: https://supabase.com/dashboard
2. Select project: `irrzpwzyqcubhhjeuakc`

### B. Configure Site URL
1. Navigate to: **Authentication** → **URL Configuration**
2. Set **Site URL**:
   ```
   http://localhost:3000
   ```
3. For production, also add:
   ```
   https://publimicro.vercel.app
   ```

### C. Configure Redirect URLs
1. In **Redirect URLs**, add ALL of these (one per line):
   ```
   http://localhost:3000/api/auth/callback
   http://localhost:3000
   http://localhost:3000/entrar
   https://publimicro.vercel.app/api/auth/callback
   https://publimicro.vercel.app
   https://publimicro.vercel.app/entrar
   ```

2. Click **Save**

### D. Enable Google Provider
1. Navigate to: **Authentication** → **Providers**
2. Find **Google** in the list
3. Toggle it **ON** (enabled)
4. You'll need Google OAuth credentials (we'll get them in Step 2)

---

## Step 2: Google Cloud Console Setup (10 minutes)

### A. Create/Access Project
1. Go to: https://console.cloud.google.com
2. Select or create a project (e.g., "Publimicro")

### B. Enable Google+ API
1. Go to: **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### C. Create OAuth 2.0 Credentials
1. Go to: **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - **User Type**: External
   - **App name**: Publimicro
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
   - Click **Save and Continue** through all steps

4. Back in Create OAuth client ID:
   - **Application type**: Web application
   - **Name**: Publimicro Web Client

5. **Authorized JavaScript origins** - Add:
   ```
   http://localhost:3000
   https://publimicro.vercel.app
   ```

6. **Authorized redirect URIs** - Add (CRITICAL):
   ```
   https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
   ```

7. Click **CREATE**
8. **IMPORTANT**: Copy the **Client ID** and **Client Secret** shown

### D. Add Credentials to Supabase
1. Go back to Supabase Dashboard
2. Navigate to: **Authentication** → **Providers** → **Google**
3. Paste:
   - **Client ID**: (from Google Console)
   - **Client Secret**: (from Google Console)
4. Click **Save**

---

## Step 3: Environment Variables Check

### Verify .env.local file
1. Open: `apps/publimicro/.env.local` (or create if doesn't exist)
2. Ensure it contains:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://irrzpwzyqcubhhjeuakc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Get your **Anon Key** from:
   - Supabase Dashboard → **Settings** → **API**
   - Copy the `anon` `public` key

---

## Step 4: Email/Password Authentication

### A. Enable Email Provider in Supabase
1. Navigate to: **Authentication** → **Providers**
2. Find **Email** in the list
3. Toggle it **ON**
4. **Confirm Email**: Toggle ON (recommended)
5. **Secure email change**: Toggle ON
6. Click **Save**

### B. Configure Email Templates (Optional but Recommended)
1. Navigate to: **Authentication** → **Email Templates**
2. Customize:
   - **Confirm signup**: Welcome email with confirmation link
   - **Magic Link**: For passwordless login
   - **Change Email Address**: Confirmation for email changes
   - **Reset Password**: Password reset link

3. Use these variables in templates:
   - `{{ .ConfirmationURL }}` - Email confirmation link
   - `{{ .Token }}` - One-time token
   - `{{ .Email }}` - User's email

---

## Step 5: Phone/SMS Authentication (Optional)

### A. Choose SMS Provider
Supabase supports:
- **Twilio** (most popular)
- **MessageBird**
- **Textlocal**
- **Vonage**

### B. Configure Twilio (Example)
1. Sign up at: https://www.twilio.com
2. Get your:
   - Account SID
   - Auth Token
   - Phone Number

3. In Supabase Dashboard:
   - Navigate to: **Authentication** → **Providers**
   - Find **Phone**
   - Toggle **ON**
   - Select **Twilio**
   - Enter credentials
   - Click **Save**

4. Add to `.env.local`:
```bash
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Step 6: Test Authentication Flow

### A. Restart Dev Server
```bash
pnpm dev
```

### B. Test Google OAuth
1. Open: http://localhost:3000/entrar
2. Click "Continuar com Google"
3. Select your Google account
4. Should redirect back to home page
5. Check if you're logged in (user icon in navbar)

### C. Test Email/Password
1. Open: http://localhost:3000/entrar
2. Switch to "Cadastrar" tab
3. Fill in:
   - Email
   - Password
   - Full Name
4. Click "Cadastrar"
5. Check email for confirmation link
6. Click link to confirm
7. Try logging in

### D. Test Phone (if configured)
1. Open: http://localhost:3000/entrar
2. Click "Telefone" tab
3. Enter phone number
4. Enter OTP sent via SMS
5. Should log in

---

## Step 7: Verify User in Database

### Check user_profiles Table
1. Go to Supabase Dashboard → **Table Editor**
2. Select `user_profiles` table
3. You should see your user with:
   - `id` (UUID)
   - `full_name`
   - `email` (in auth.users)
   - `profile_completed`: false initially

---

## Troubleshooting

### Issue: "requested path is invalid"
**Fix**: Add redirect URLs to Supabase (Step 1C)

### Issue: "OAuth provider not enabled"
**Fix**: Enable Google provider in Supabase (Step 1D)

### Issue: "Invalid client credentials"
**Fix**: Check Google Client ID/Secret in Supabase (Step 2D)

### Issue: Email not sending
**Fix**: 
- Check Supabase email quota (free tier: 3 emails/hour)
- Verify email provider settings
- Check spam folder

### Issue: Phone SMS not sending
**Fix**:
- Verify Twilio credentials
- Check Twilio phone number is SMS-capable
- Verify destination number format (+country code)

### Issue: Redirect loop
**Fix**: Clear browser cookies and localStorage

### Issue: User not in database
**Fix**: Check `handle_new_user` trigger exists:
```sql
SELECT * FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

---

## Security Best Practices

### 1. RLS Policies
Verify in Supabase Dashboard → **Authentication** → **Policies**:
```sql
-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

### 2. HTTPS Only in Production
In production `.env`:
```bash
NEXT_PUBLIC_APP_URL=https://publimicro.vercel.app
```

### 3. Secure Secrets
Never commit `.env.local` to git. It's already in `.gitignore`.

---

## Brazilian User Verification (Advanced)

### CPF Validation
Already implemented in: `apps/publimicro/src/lib/validation.ts`

```typescript
export function validateCPF(cpf: string): boolean {
  // Removes non-numeric characters
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validate check digits
  // ... algorithm implementation
}
```

### Federal Police API Integration (Future)
To check criminal records:
1. **API Needed**: Brazilian Federal Police doesn't have a public API
2. **Alternative**: Serasa Experian or similar services
3. **Integration**:
   ```typescript
   async function verifyCriminalRecord(cpf: string) {
     // Call third-party verification service
     const response = await fetch('https://api.verification-service.com/check', {
       method: 'POST',
       headers: { 'Authorization': `Bearer ${API_KEY}` },
       body: JSON.stringify({ cpf })
     });
     return response.json();
   }
   ```

### Recommended Services
- **Serasa Experian**: Credit and background checks
- **CredDefense**: Anti-fraud verification
- **Boa Vista SCPC**: Credit bureau
- **Receita Federal**: CPF validation (limited)

---

## Current Code Status

### ✅ Already Implemented
1. **OAuth Flow** - AccountModal.tsx
2. **Email/Password** - AccountModal.tsx
3. **Phone/SMS** - AccountModal.tsx
4. **Callback Handler** - /api/auth/callback/route.ts
5. **User Profiles** - user_profiles table with RLS
6. **CPF Validation** - lib/validation.ts
7. **Auto Profile Creation** - handle_new_user trigger

### ⚠️ Needs Configuration
1. **Supabase Dashboard** - URLs and providers
2. **Google Cloud Console** - OAuth credentials
3. **Environment Variables** - Keys and secrets
4. **Email Provider** - Twilio/MessageBird (for SMS)

### 🔄 Future Enhancements
1. **2FA** - Two-factor authentication
2. **Social Logins** - Facebook, Apple, Microsoft
3. **Criminal Check** - Integration with verification services
4. **KYC** - Know Your Customer compliance
5. **Document Upload** - RG, CNH verification

---

## Quick Start Checklist

- [ ] Configure Supabase URLs (Step 1)
- [ ] Enable Google provider (Step 1D)
- [ ] Create Google OAuth credentials (Step 2)
- [ ] Add credentials to Supabase (Step 2D)
- [ ] Verify .env.local (Step 3)
- [ ] Enable Email provider (Step 4)
- [ ] Restart dev server
- [ ] Test Google login
- [ ] Test email signup
- [ ] Verify user in database

**Estimated Time**: 20-30 minutes

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs: Dashboard → Logs → Auth
3. Verify all URLs match exactly (no trailing slashes)
4. Test in incognito mode
5. Clear browser cache and cookies

**Remember**: The code is correct. This is purely a configuration issue!
