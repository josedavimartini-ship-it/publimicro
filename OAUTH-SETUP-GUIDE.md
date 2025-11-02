# 🔐 OAuth Setup Guide - PubliMicro

**Status:** Code Implementation ✅ Complete | Provider Configuration ⚠️ Pending

This guide explains how to configure Google, Microsoft, and Apple OAuth providers in your Supabase project.

---

## ✅ What's Already Done

- ✅ **AccountModal Component** - Full OAuth UI implemented
- ✅ **Auth Callback Route** - `/api/auth/callback/route.ts` configured
- ✅ **Phone Authentication** - OTP via SMS/WhatsApp ready
- ✅ **Email Authentication** - Sign up/sign in with password
- ✅ **User Experience** - Clean UI with all provider buttons

---

## ⚙️ Supabase Dashboard Configuration

### 1. Google OAuth Setup

1. **Go to** [Google Cloud Console](https://console.cloud.google.com/)
2. **Create a new project** (or select existing)
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: `PubliMicro Production`
   
5. **Add Authorized Redirect URIs**:
   ```
   https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
   ```
   (Replace with your Supabase project URL if different)

6. **Copy Credentials**:
   - Save your **Client ID**
   - Save your **Client Secret**

7. **Configure in Supabase**:
   - Go to your [Supabase Dashboard](https://app.supabase.com/)
   - Navigate to **Authentication** → **Providers**
   - Find **Google** provider
   - Enable it
   - Paste **Client ID** and **Client Secret**
   - Save changes

---

### 2. Microsoft (Azure AD) OAuth Setup

1. **Go to** [Azure Portal](https://portal.azure.com/)
2. **Navigate to** "Azure Active Directory" → "App registrations"
3. **Click** "New registration"
   - Name: `PubliMicro`
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
   - Redirect URI: 
     - Type: **Web**
     - URL: `https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback`
   - Click "Register"

4. **Get Application (client) ID**:
   - Copy the **Application (client) ID** from the Overview page

5. **Create Client Secret**:
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Description: `PubliMicro Production`
   - Expires: **24 months** (recommended)
   - Click "Add"
   - **IMPORTANT:** Copy the secret VALUE immediately (you won't see it again)

6. **Configure API Permissions** (optional but recommended):
   - Go to "API permissions"
   - Click "Add a permission"
   - Choose "Microsoft Graph"
   - Select delegated permissions:
     - `User.Read`
     - `email`
     - `profile`
     - `openid`
   - Click "Add permissions"

7. **Configure in Supabase**:
   - Go to your Supabase Dashboard
   - Navigate to **Authentication** → **Providers**
   - Find **Azure (Microsoft)** provider
   - Enable it
   - Paste **Application (client) ID** as Client ID
   - Paste **Client Secret** VALUE
   - Save changes

---

### 3. Apple OAuth Setup

1. **Go to** [Apple Developer Portal](https://developer.apple.com/account/)
2. **Navigate to** "Certificates, Identifiers & Profiles"
3. **Create an App ID**:
   - Click "Identifiers" → "+" button
   - Select "App IDs" → Continue
   - Description: `PubliMicro`
   - Bundle ID: `com.publimicro.app` (or your domain)
   - Capabilities: Enable "Sign In with Apple"
   - Click "Continue" → "Register"

4. **Create a Service ID**:
   - Click "Identifiers" → "+" button
   - Select "Services IDs" → Continue
   - Description: `PubliMicro Web`
   - Identifier: `com.publimicro.web`
   - Click "Continue" → "Register"

5. **Configure Service ID**:
   - Select your Service ID from the list
   - Enable "Sign In with Apple"
   - Click "Configure"
   - Primary App ID: Select the App ID you created
   - Domains and Subdomains: `irrzpwzyqcubhhjeuakc.supabase.co`
   - Return URLs: `https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback`
   - Click "Save" → "Continue" → "Register"

6. **Create a Private Key**:
   - Go to "Keys" → "+" button
   - Key Name: `PubliMicro Sign In`
   - Enable "Sign In with Apple"
   - Click "Configure"
   - Select your Primary App ID
   - Click "Save" → "Continue" → "Register"
   - **Download the .p8 file** (you can only download once!)
   - Note the **Key ID** shown

7. **Get Team ID**:
   - Go to "Membership" in the sidebar
   - Copy your **Team ID**

8. **Configure in Supabase**:
   - Go to your Supabase Dashboard
   - Navigate to **Authentication** → **Providers**
   - Find **Apple** provider
   - Enable it
   - **Services ID**: `com.publimicro.web` (your Service ID)
   - **Team ID**: (from step 7)
   - **Key ID**: (from step 6)
   - **Private Key**: Open the .p8 file and paste its entire contents
   - Save changes

---

### 4. Phone Authentication Setup

Phone authentication is **already configured** in the code, but requires:

1. **Twilio Account** (recommended) or another SMS provider
2. **Configure in Supabase**:
   - Go to **Authentication** → **Providers**
   - Enable **Phone** provider
   - Choose SMS provider (Twilio recommended)
   - Add your Twilio credentials:
     - Account SID
     - Auth Token
     - Phone Number (your Twilio number)
   - Save changes

**Alternative**: Use Supabase's built-in phone auth (limited free tier)

---

### 5. Email Authentication

Email authentication is **already enabled by default** in Supabase. No additional configuration needed!

Optional improvements:
- **Custom SMTP**: Configure custom email server in Settings → Auth
- **Email Templates**: Customize confirmation/reset emails in Auth → Email Templates

---

## 🧪 Testing Your OAuth Setup

### Test Each Provider:

1. **Start your development server**:
   ```bash
   cd apps/publimicro
   pnpm dev
   ```

2. **Navigate to**: `http://localhost:3000/entrar`

3. **Test each button**:
   - ✅ Click "Continuar com Google" → Should redirect to Google login
   - ✅ Click "Continuar com Microsoft" → Should redirect to Microsoft login
   - ✅ Click "Continuar com Apple" → Should redirect to Apple login
   - ✅ Click "Entrar com Telefone/WhatsApp" → Should send OTP code
   - ✅ Use email/password form → Should work immediately

### Expected Flow:
1. User clicks OAuth button
2. Redirects to provider login page
3. User authenticates with provider
4. Provider redirects back to: `/api/auth/callback?code=...`
5. Callback exchanges code for session
6. User redirected to home page (logged in)

---

## 🔒 Production Checklist

Before going live, ensure:

- [ ] All OAuth redirect URIs point to production domain
- [ ] Update `redirectTo` in AccountModal.tsx (line 28) to production URL
- [ ] Test all providers in production environment
- [ ] Enable email confirmations (Supabase → Auth → Email Auth → Confirm email)
- [ ] Set up custom email templates
- [ ] Configure rate limiting (Supabase → Auth → Rate limits)
- [ ] Add privacy policy and terms of service links
- [ ] Test phone auth with real phone numbers
- [ ] Monitor auth errors in Supabase logs

---

## 📱 Phone Number Format

The code automatically formats Brazilian phone numbers:
- Input: `11999887766` or `(11) 99988-7766`
- Sent as: `+5511999887766`

To support other countries, modify line 90 in `AccountModal.tsx`:
```typescript
phone: phone.startsWith('+') ? phone : `+55${phone.replace(/\D/g, '')}`,
```

Change `+55` to your country code or add country selection.

---

## 🆘 Troubleshooting

### "Invalid redirect URI" error
- Double-check the redirect URI in provider console matches exactly
- No trailing slashes
- HTTPS required (except localhost)

### Google OAuth not working
- Make sure Google+ API is enabled
- Check OAuth consent screen is configured
- Verify authorized JavaScript origins include your domain

### Microsoft OAuth not working
- Ensure "Accounts in any organizational directory and personal Microsoft accounts" is selected
- Check client secret hasn't expired
- Verify API permissions are granted

### Apple OAuth not working
- Double-check all identifiers match exactly (case-sensitive)
- Ensure .p8 key is pasted correctly (including BEGIN/END lines)
- Team ID and Key ID must match

### Phone auth not working
- Check Twilio credits
- Verify phone number format
- Check Supabase logs for SMS errors
- Ensure phone number is verified in Twilio for test mode

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
- [Twilio SMS Docs](https://www.twilio.com/docs/sms)

---

## ✅ Summary

**What Works Now:**
- ✅ Full UI with all auth options
- ✅ OAuth code implementation complete
- ✅ Phone OTP implementation complete
- ✅ Email/password authentication
- ✅ Callback handler configured

**Next Steps:**
1. Configure Google OAuth in Cloud Console
2. Configure Microsoft OAuth in Azure Portal
3. Configure Apple OAuth in Developer Portal
4. Set up Twilio for phone authentication
5. Test all providers
6. Deploy and update redirect URIs to production

**Estimated Time:** 30-60 minutes per provider (first time setup)

---

*Last Updated: November 2, 2025*
*PubliMicro - Complete OAuth Implementation*
