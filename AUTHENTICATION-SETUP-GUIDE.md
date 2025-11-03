# 🔐 PubliMicro Authentication & Admin Setup Guide

## Current Status
✅ **Already Configured:**
- Supabase project created (ID: `irrzpwzyqcubhhjeuakc`)
- Email/Password authentication enabled
- Phone/OTP authentication code ready
- AccountModal component fully implemented

⚠️ **Needs Configuration:**
- OAuth providers (Google, Microsoft, Apple)
- Phone authentication provider
- Admin user designation
- Production redirect URLs

---

## Part 1: Enable OAuth Providers in Supabase

### Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select your project: `irrzpwzyqcubhhjeuakc`
3. Navigate to: **Authentication** → **Providers**

---

### Step 2: Configure Google OAuth

#### 2.1 Create Google OAuth Credentials
1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing: **"PubliMicro"**
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Name: `PubliMicro Production`

#### 2.2 Authorized Redirect URIs
Add these URLs:
```
https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
http://localhost:3000/api/auth/callback
```

#### 2.3 Get Credentials
- Copy **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
- Copy **Client Secret** (looks like: `GOCSPX-abc123xyz`)

#### 2.4 Configure in Supabase
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** → Click **Enable**
3. Paste **Client ID**
4. Paste **Client Secret**
5. Click **Save**

---

### Step 3: Configure Microsoft (Azure AD) OAuth

#### 3.1 Create Azure AD App Registration
1. Go to: https://portal.azure.com/
2. Navigate to: **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Name: `PubliMicro`
5. Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**

#### 3.2 Configure Redirect URIs
1. In your app registration, go to **Authentication**
2. Click **Add a platform** → **Web**
3. Add these Redirect URIs:
```
https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
http://localhost:3000/api/auth/callback
```

#### 3.3 Create Client Secret
1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Description: `PubliMicro Production`
4. Expires: **24 months** (or your preference)
5. Click **Add**
6. **⚠️ IMPORTANT:** Copy the **Value** immediately (you won't see it again!)

#### 3.4 Get Application IDs
- Copy **Application (client) ID** from Overview page
- Copy **Directory (tenant) ID** from Overview page

#### 3.5 Configure in Supabase
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Azure** → Click **Enable**
3. **Azure Client ID:** Paste Application (client) ID
4. **Azure Secret:** Paste Client Secret value
5. Click **Save**

---

### Step 4: Configure Apple Sign In

#### 4.1 Apple Developer Account Required
⚠️ **You need an Apple Developer Account ($99/year)**

1. Go to: https://developer.apple.com/account/
2. Navigate to: **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** (Add)
4. Select **App IDs** → **Continue**

#### 4.2 Create App ID
- Description: `PubliMicro`
- Bundle ID: `com.publimicro.app` (or your domain)
- Check: **Sign in with Apple**
- Configure **Sign in with Apple**

#### 4.3 Create Service ID
1. Go back to **Identifiers** → **+**
2. Select **Services IDs** → **Continue**
3. Description: `PubliMicro Web`
4. Identifier: `com.publimicro.web`
5. Check: **Sign in with Apple**
6. Click **Configure**

#### 4.4 Configure Redirect URLs
- Primary App ID: Select your App ID
- Website URLs:
  - Domains: `irrzpwzyqcubhhjeuakc.supabase.co`, `localhost`
  - Return URLs: 
    ```
    https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
    ```

#### 4.5 Create Private Key
1. Go to **Keys** → **+**
2. Key Name: `PubliMicro Sign in with Apple`
3. Check: **Sign in with Apple**
4. Configure → Select your Primary App ID
5. Click **Register**
6. **Download** the `.p8` file (you only get one chance!)
7. Note your **Key ID**

#### 4.6 Configure in Supabase
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Apple** → Click **Enable**
3. **Services ID:** `com.publimicro.web`
4. **Team ID:** Found in Apple Developer Account (top right)
5. **Key ID:** From the key you created
6. **Private Key:** Open the `.p8` file and paste contents
7. Click **Save**

---

## Part 2: Configure Phone Authentication

### Step 1: Choose SMS Provider
Supabase supports:
- **Twilio** (recommended, most popular)
- **MessageBird**
- **Vonage**

### Step 2: Setup Twilio (Recommended)

#### 2.1 Create Twilio Account
1. Go to: https://www.twilio.com/try-twilio
2. Sign up for free trial ($15 credit)
3. Verify your email and phone

#### 2.2 Get Credentials
1. Go to Twilio Console: https://console.twilio.com/
2. From the Dashboard, copy:
   - **Account SID** (looks like: `AC...`)
   - **Auth Token** (click to reveal)

#### 2.3 Get Phone Number
1. In Twilio Console → **Phone Numbers** → **Buy a number**
2. Select country: **Brazil (+55)** or your preference
3. Capabilities: Check **SMS**
4. Buy the number
5. Copy your **Twilio Phone Number** (format: `+5511xxxxx`)

#### 2.4 Configure in Supabase
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Phone** → Click **Enable**
3. Select **Twilio** as provider
4. Paste **Account SID**
5. Paste **Auth Token**
6. **Message Service SID:** Leave blank for now
7. **Sender (From):** Paste your Twilio phone number
8. Click **Save**

---

## Part 3: Admin User Setup

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user (or create one first by signing up)
3. Click on the user
4. Under **Raw user meta data**, click **Edit**
5. Add this JSON:
```json
{
  "role": "admin",
  "is_admin": true
}
```
6. Click **Save**

### Option 2: Via Database SQL (More Permanent)

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query to create an admin profile:

```sql
-- Create admin_users table if not exists
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  permissions TEXT[] DEFAULT ARRAY['read', 'write', 'delete', 'manage_users']
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view admin_users
CREATE POLICY "Only admins can view admin users" ON public.admin_users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- Insert your user as admin (replace with your actual user ID)
-- Get your user ID from: Authentication → Users
INSERT INTO public.admin_users (id)
VALUES ('YOUR-USER-UUID-HERE')
ON CONFLICT (id) DO NOTHING;
```

3. Replace `'YOUR-USER-UUID-HERE'` with your actual user UUID
4. Click **Run**

---

## Part 4: Update Environment Variables

### Add to `.env.local`:

```bash
# OAuth Redirect URL (production)
NEXT_PUBLIC_SITE_URL=https://publimicro.vercel.app

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com

# Twilio (if using phone auth)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+5511...
```

---

## Part 5: Test Authentication

### Test Login Flow:

1. Start development server:
```bash
cd c:\projetos\publimicro\apps\publimicro
pnpm dev
```

2. Go to: http://localhost:3000/entrar

3. Test each method:
   - ✅ Email/Password (should work now)
   - ⏳ Google OAuth (after configuration)
   - ⏳ Microsoft OAuth (after configuration)  
   - ⏳ Apple Sign In (after configuration)
   - ⏳ Phone/OTP (after Twilio setup)

---

## Summary of What You Need to Provide

### For Google OAuth:
- [ ] Google Client ID
- [ ] Google Client Secret

### For Microsoft OAuth:
- [ ] Azure Application (client) ID
- [ ] Azure Client Secret
- [ ] Azure Directory (tenant) ID

### For Apple Sign In (Optional):
- [ ] Apple Services ID
- [ ] Apple Team ID
- [ ] Apple Key ID
- [ ] Apple Private Key (.p8 file contents)

### For Phone Authentication:
- [ ] Twilio Account SID
- [ ] Twilio Auth Token
- [ ] Twilio Phone Number

### For Admin:
- [ ] Your email address for admin account
- [ ] Your user UUID (after first sign-up)

---

## Quick Start Steps

**I recommend starting with this order:**

1. **✅ Test Email/Password** (already working)
2. **🔵 Setup Google OAuth** (most popular, easiest)
3. **🔵 Setup Microsoft OAuth** (good for business users)
4. **🟡 Setup Phone Auth** (optional but good for Brazil)
5. **🟡 Setup Apple Sign In** (optional, requires paid developer account)
6. **✅ Designate Admin** (after you create your account)

---

## Let me know which providers you want to setup first, and I'll guide you through each step! 🚀
