# 🔧 Supabase Configuration Guide - Step by Step

**Your Project**: `irrzpwzyqcubhhjeuakc` (https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc)

---

## ✅ Step 1: Enable Email Authentication (5 min)

### Navigate to Authentication Settings:
```
Supabase Dashboard → Authentication → Providers
```

### Configure Email Provider:
1. Click on **"Email"** provider
2. **Enable Email Provider**: ✅ Toggle ON
3. **Confirm email**: Set to **REQUIRED** (recommended)
4. **Secure email change**: ✅ Toggle ON
5. Click **"Save"**

**What this does**: Allows users to sign up with email/password

---

## ✅ Step 2: Configure URL Settings (5 min)

### Navigate to URL Configuration:
```
Supabase Dashboard → Authentication → URL Configuration
```

### Set Site URL:
```
Site URL: http://localhost:3000
```
(Change to `https://publimicro.vercel.app` when deploying)

### Add Redirect URLs (CRITICAL):
Click **"Add URL"** for each of these:

**Local Development:**
```
http://localhost:3000/auth/callback
http://localhost:3000/entrar
http://localhost:3000
```

**Production (Vercel):**
```
https://publimicro.vercel.app/auth/callback
https://publimicro.vercel.app/entrar
https://publimicro.vercel.app
```

**All Other Apps** (add when needed):
```
https://proper.publimicro.com/auth/callback
https://motors.publimicro.com/auth/callback
https://journey.publimicro.com/auth/callback
etc.
```

Click **"Save"** after adding all URLs

**What this does**: Tells Supabase where to redirect users after login/OAuth

---

## ✅ Step 3: Enable Google OAuth (15 min)

### A. Get Google OAuth Credentials

**You already have credentials in .env.local:**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1069930870605-3dguc58fcbb40r0h339kt33t4a713nv5.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### B. Update Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID: `1069930870605-3dguc58fcbb40r0h339kt33t4a713nv5`
3. Click to edit
4. **Add Authorized Redirect URI**:
   ```
   https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
   ```
5. Click **"Save"**

### C. Configure in Supabase Dashboard

1. Navigate to: `Authentication → Providers → Google`
2. **Enable Google Provider**: ✅ Toggle ON
3. **Client ID**: Paste `1069930870605-3dguc58fcbb40r0h339kt33t4a713nv5.apps.googleusercontent.com`
4. **Client Secret**: Paste `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`
5. **Authorized Redirect URL** (should auto-fill):
   ```
   https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
   ```
6. Click **"Save"**

**What this does**: Enables "Sign in with Google" button

---

## ✅ Step 4: Configure Email Templates (Optional - 10 min)

### Navigate to Email Templates:
```
Supabase Dashboard → Authentication → Email Templates
```

### Customize Templates (Recommended):

**1. Confirm Signup**
- Subject: `Confirme seu cadastro - PubliMicro`
- Template:
```html
<h2>Bem-vindo ao PubliMicro!</h2>
<p>Confirme seu email clicando no link abaixo:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
```

**2. Magic Link**
- Subject: `Seu link de acesso - PubliMicro`

**3. Change Email Address**
- Subject: `Confirme a mudança de email - PubliMicro`

**4. Reset Password**
- Subject: `Redefinir senha - PubliMicro`

**What this does**: Sends Portuguese emails instead of English

---

## ✅ Step 5: Configure Security Settings (5 min)

### Navigate to Security Settings:
```
Supabase Dashboard → Authentication → Policies
```

### Recommended Settings:

**Rate Limiting:**
- Enable rate limiting: ✅ ON
- Max requests per hour: `100` (per IP)

**Password Requirements:**
- Minimum password length: `8` characters
- Require uppercase: ✅ ON (recommended)
- Require lowercase: ✅ ON
- Require numbers: ✅ ON
- Require special characters: ❌ OFF (optional)

**Session Settings:**
- JWT expiry: `3600` seconds (1 hour)
- Refresh token rotation: ✅ ON

Click **"Save"**

**What this does**: Protects against brute force attacks

---

## ✅ Step 6: Verify Storage Bucket (2 min)

### Navigate to Storage:
```
Supabase Dashboard → Storage
```

### Create Bucket for Property Photos:

1. Click **"Create Bucket"**
2. **Name**: `imagens-sitios`
3. **Public bucket**: ✅ YES (so photos are publicly accessible)
4. Click **"Create"**

### Set Bucket Policy:

1. Click on `imagens-sitios` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"** → **"Custom Policy"**
4. **Policy name**: `Allow public read access`
5. **Policy definition**:
```sql
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'imagens-sitios');
```
6. Click **"Save"**

### Allow Authenticated Users to Upload:

1. Click **"New Policy"** → **"Custom Policy"**
2. **Policy name**: `Authenticated users can upload`
3. **Policy definition**:
```sql
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'imagens-sitios');
```
4. Click **"Save"**

**What this does**: Allows users to upload property photos

---

## ✅ Step 7: Check Database Tables (5 min)

### Navigate to Database:
```
Supabase Dashboard → Database → Tables
```

### Verify These Tables Exist:

- ✅ `user_profiles` - User account data
- ✅ `properties` - Property listings
- ✅ `property_favorites` - User favorites
- ✅ `visits` - Visit scheduling
- ✅ `proposals` - Bids/proposals
- ✅ `neighborhood_data` - POI data

### If Tables Don't Exist:

Run the migration script:
```powershell
cd c:\projetos\publimicro
.\setup-database.ps1
```

Or manually run migrations:
```powershell
# 1. User Profiles
supabase\migrations\20251103000000_create_user_profiles.sql

# 2. Visits & Proposals
supabase\migrations\20251105000000_create_visits_system.sql

# 3. Neighborhood Data
supabase\migrations\20250105000001_add_neighborhood_data.sql
```

**What this does**: Creates all required database tables

---

## ✅ Step 8: Test Authentication (10 min)

### A. Test Email Signup

1. Start your dev server:
   ```powershell
   cd apps/publimicro
   pnpm dev
   ```

2. Open: http://localhost:3000/entrar

3. Click **"Criar Conta"** tab

4. Fill in:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Confirm Password: `Test123!`
   - Full Name: `Test User`
   - Phone: `(11) 98765-4321`

5. Click **"Criar Conta"**

6. Check your email for confirmation link

7. Click confirmation link

8. You should be redirected to homepage (logged in)

### B. Test Login

1. Logout (if logged in)

2. Go to: http://localhost:3000/entrar

3. Enter:
   - Email: `test@example.com`
   - Password: `Test123!`

4. Click **"Entrar"**

5. You should be logged in

### C. Test Google OAuth

1. Logout (if logged in)

2. Go to: http://localhost:3000/entrar

3. Click **"Continuar com Google"** button

4. Select your Google account

5. You should be redirected back (logged in)

### D. Verify Profile Auto-Creation

1. After signup/login, go to: http://localhost:3000/conta

2. You should see your profile data

3. Check Supabase Dashboard → Database → `user_profiles` table

4. Your user should appear in the table

**If this works**: ✅ Authentication is fully configured!

---

## ✅ Step 9: Test User Features (15 min)

### Test Property Posting:

1. Login at http://localhost:3000/entrar

2. Go to: http://localhost:3000/anunciar

3. Fill in property details

4. Upload 1-2 photos

5. Click **"Publicar Anúncio"**

6. Property should appear on homepage

### Test Favorites:

1. Go to homepage: http://localhost:3000

2. Click ❤️ heart icon on any property

3. Heart should turn red (favorited)

4. Go to: http://localhost:3000/conta → **"Favoritos"** tab

5. Property should appear in favorites

### Test Visit Scheduling:

1. Go to any property detail page

2. Click **"Agendar Visita"** button

3. Fill in visit date/time

4. Click **"Agendar"**

5. Visit should be scheduled

6. Go to: http://localhost:3000/conta → **"Minhas Visitas"** tab

7. Visit should appear

### Test Proposals:

1. Go to any property detail page

2. Click **"Fazer Proposta"** button

3. Enter bid amount

4. Add message

5. Click **"Enviar Proposta"**

6. Go to: http://localhost:3000/conta → **"Minhas Propostas"** tab

7. Proposal should appear

**If all tests pass**: 🎉 System is fully working!

---

## 🐛 Troubleshooting

### Error: "Invalid login credentials"
**Fix**: Check if email is confirmed in Supabase Dashboard → Authentication → Users

### Error: "Email not confirmed"
**Fix**: 
1. Go to Supabase Dashboard → Authentication → Users
2. Click on user
3. Click **"Send confirmation email"**
4. Or manually set `email_confirmed_at` to current timestamp

### Error: "Redirect URL not allowed"
**Fix**: Add the redirect URL to Authentication → URL Configuration

### Error: "Table 'user_profiles' does not exist"
**Fix**: Run `.\setup-database.ps1` to create tables

### Error: "Storage bucket not found"
**Fix**: Create `imagens-sitios` bucket in Supabase Dashboard → Storage

### Google OAuth Error: "redirect_uri_mismatch"
**Fix**: 
1. Go to Google Cloud Console
2. Add `https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback` to authorized redirect URIs

---

## 📋 Configuration Checklist

Copy this and check off as you complete each step:

- [ ] Email provider enabled
- [ ] Confirm email set to REQUIRED
- [ ] Site URL configured
- [ ] All redirect URLs added (6 total)
- [ ] Google Cloud Console redirect URI updated
- [ ] Google OAuth enabled in Supabase
- [ ] Google Client ID configured
- [ ] Google Client Secret configured
- [ ] Email templates customized (optional)
- [ ] Rate limiting enabled
- [ ] Password requirements set
- [ ] Storage bucket `imagens-sitios` created
- [ ] Storage bucket is public
- [ ] Storage upload policy created
- [ ] All database tables verified
- [ ] Email signup tested ✅
- [ ] Email login tested ✅
- [ ] Google OAuth tested ✅
- [ ] Profile auto-creation verified ✅
- [ ] Property posting tested ✅
- [ ] Favorites tested ✅
- [ ] Visit scheduling tested ✅
- [ ] Proposals tested ✅

---

## 🎯 Quick Start Commands

**Run Migrations:**
```powershell
cd c:\projetos\publimicro
.\setup-database.ps1
```

**Start Dev Server:**
```powershell
cd apps/publimicro
pnpm dev
```

**Test Authentication:**
```
http://localhost:3000/entrar
```

**Check User Account:**
```
http://localhost:3000/conta
```

**Post Property:**
```
http://localhost:3000/anunciar
```

---

## 🚀 After Configuration

Once everything is working locally, deploy to production:

1. Update `.env.local` for production:
   - Change `NEXTAUTH_URL` to `https://publimicro.vercel.app`
   - Add production URLs to Supabase redirect list

2. Push to GitHub:
   ```powershell
   git add -A
   git commit -m "Configure Supabase authentication"
   git push
   ```

3. Vercel will auto-deploy

4. Test on production: https://publimicro.vercel.app/entrar

---

## 📚 Additional Resources

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Google OAuth Setup**: https://supabase.com/docs/guides/auth/social-login/auth-google
- **RLS Policies**: https://supabase.com/docs/guides/auth/row-level-security
- **Email Templates**: https://supabase.com/docs/guides/auth/auth-email-templates

