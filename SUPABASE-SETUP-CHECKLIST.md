# ✅ PubliMicro Supabase Setup Checklist

**Project ID**: `irrzpwzyqcubhhjeuakc`  
**Dashboard**: https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc  

---

## 🎯 STEP-BY-STEP CONFIGURATION

### ☐ Step 1: Open Supabase Dashboard (NOW)

**Action**: Click this link to open your Supabase project:
```
https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc
```

✅ **Dashboard opened** ← Check when done

---

### ☐ Step 2: Enable Email Authentication (5 min)

**Navigate to**:
```
Left Sidebar → Authentication → Providers
```

**Actions**:
1. ☐ Click on "Email" provider
2. ☐ Toggle "Enable Email Provider" to ON
3. ☐ Set "Confirm email" to "REQUIRED" (recommended)
4. ☐ Toggle "Secure email change" to ON
5. ☐ Click "Save" button

**Screenshot location**: Top of the page should show "Email is enabled"

✅ **Email authentication enabled** ← Check when done

---

### ☐ Step 3: Configure URL Settings (5 min)

**Navigate to**:
```
Left Sidebar → Authentication → URL Configuration
```

**Action 3.1 - Set Site URL**:
```
Site URL: http://localhost:3000
```
☐ **Site URL set**

**Action 3.2 - Add Redirect URLs** (Click "Add URL" for each):

1. ☐ `http://localhost:3000/auth/callback`
2. ☐ `http://localhost:3000/entrar`
3. ☐ `http://localhost:3000`
4. ☐ `https://publimicro.vercel.app/auth/callback`
5. ☐ `https://publimicro.vercel.app/entrar`
6. ☐ `https://publimicro.vercel.app`

**Important**: Click "Save" after adding all URLs!

✅ **All redirect URLs added** ← Check when done

---

### ☐ Step 4: Configure Google OAuth (15 min)

**Step 4.1 - Update Google Cloud Console**:

1. ☐ Go to: https://console.cloud.google.com/apis/credentials
2. ☐ Find OAuth 2.0 Client ID: `1069930870605-3dguc58fcbb40r0h339kt33t4a713nv5`
3. ☐ Click to edit
4. ☐ Under "Authorized redirect URIs", click "Add URI"
5. ☐ Add this EXACT URL:
   ```
   https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
   ```
6. ☐ Click "Save"

✅ **Google Cloud Console updated** ← Check when done

**Step 4.2 - Configure in Supabase**:

**Navigate to**:
```
Left Sidebar → Authentication → Providers
```

1. ☐ Scroll down to "Google" provider
2. ☐ Toggle "Enable Sign in with Google" to ON
3. ☐ Paste Client ID:
   ```
   1069930870605-3dguc58fcbb40r0h339kt33t4a713nv5.apps.googleusercontent.com
   ```
4. ☐ Paste Client Secret:
   ```
   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
   ```
5. ☐ Verify "Authorized Redirect URL" shows:
   ```
   https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback
   ```
6. ☐ Click "Save"

✅ **Google OAuth configured** ← Check when done

---

### ☐ Step 5: Create Storage Bucket (3 min)

**Navigate to**:
```
Left Sidebar → Storage
```

**Actions**:
1. ☐ Click "Create Bucket" button
2. ☐ Name: `imagens-sitios`
3. ☐ Toggle "Public bucket" to ON (important!)
4. ☐ Click "Create bucket"

✅ **Storage bucket created** ← Check when done

**Configure Bucket Policies**:

1. ☐ Click on `imagens-sitios` bucket
2. ☐ Go to "Policies" tab
3. ☐ Click "New Policy" button
4. ☐ Select "For full customization" (Custom policy)
5. ☐ Paste this policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'imagens-sitios');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagens-sitios');

-- Allow users to delete their own files
CREATE POLICY "User Delete Own Files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'imagens-sitios' AND auth.uid()::text = (storage.foldername(name))[1]);
```

6. ☐ Click "Save policy"

✅ **Storage policies configured** ← Check when done

---

### ☐ Step 6: Run Database Migrations (10 min)

**Option A - Via SQL Editor** (Recommended):

**Navigate to**:
```
Left Sidebar → SQL Editor
```

**Run each migration** (copy/paste content and click "Run"):

1. ☐ **Migration 1**: `supabase\migrations\20251103000000_create_user_profiles.sql`
   - Creates `user_profiles` table
   - Creates auto-creation trigger

2. ☐ **Migration 2**: `supabase\migrations\20251104000000_create_properties_system.sql`
   - Creates `properties` table
   - Creates `property_favorites` table

3. ☐ **Migration 3**: `supabase\migrations\20251105000000_create_visits_system.sql`
   - Creates `visits` table
   - Creates `proposals` table

4. ☐ **Migration 4**: `supabase\migrations\20250105000001_add_neighborhood_data.sql`
   - Creates `neighborhood_data` table

**Option B - Via PowerShell Script**:

```powershell
cd c:\projetos\publimicro
.\apply-migrations.ps1
```

✅ **All migrations applied** ← Check when done

---

### ☐ Step 7: Verify Tables Exist (2 min)

**Navigate to**:
```
Left Sidebar → Database → Tables
```

**Verify these tables exist**:

- ☐ `user_profiles` (with columns: id, full_name, email, phone, profile_completed, etc.)
- ☐ `properties` (with columns: id, title, description, price, fotos, etc.)
- ☐ `property_favorites` (with columns: id, user_id, property_id, folder_id)
- ☐ `visits` (with columns: id, property_id, user_id, scheduled_at, status)
- ☐ `proposals` (with columns: id, property_id, user_id, amount, status)
- ☐ `neighborhood_data` (with columns: id, property_id, poi_type, distance)

**Alternatively**, run verification query:
```
Left Sidebar → SQL Editor → New Query
```

Paste contents of `verify-database.sql` and run.

✅ **All tables verified** ← Check when done

---

### ☐ Step 8: Test Authentication (10 min)

**Start dev server**:
```powershell
cd c:\projetos\publimicro\apps\publimicro
pnpm dev
```

☐ **Dev server started**

**Test 8.1 - Email Signup**:

1. ☐ Open: http://localhost:3000/entrar
2. ☐ Click "Criar Conta" tab
3. ☐ Fill in:
   - Email: `teste@publimicro.com`
   - Password: `Teste123!`
   - Confirm Password: `Teste123!`
   - Full Name: `Usuario Teste`
   - Phone: `(11) 98765-4321`
4. ☐ Click "Criar Conta" button
5. ☐ Check for success message
6. ☐ Check email for confirmation link
7. ☐ Click confirmation link
8. ☐ Verify you're logged in (redirected to homepage)

✅ **Email signup works** ← Check when done

**Test 8.2 - Email Login**:

1. ☐ Logout (if logged in)
2. ☐ Go to: http://localhost:3000/entrar
3. ☐ Enter:
   - Email: `teste@publimicro.com`
   - Password: `Teste123!`
4. ☐ Click "Entrar" button
5. ☐ Verify you're logged in

✅ **Email login works** ← Check when done

**Test 8.3 - Google OAuth**:

1. ☐ Logout (if logged in)
2. ☐ Go to: http://localhost:3000/entrar
3. ☐ Click "Continuar com Google" button
4. ☐ Select your Google account
5. ☐ Verify you're redirected back and logged in

✅ **Google OAuth works** ← Check when done

**Test 8.4 - Profile Auto-Creation**:

1. ☐ After login, go to: http://localhost:3000/conta
2. ☐ Verify your profile data appears
3. ☐ Go to Supabase Dashboard → Database → Tables → `user_profiles`
4. ☐ Verify your user appears in the table

✅ **Profile auto-creation works** ← Check when done

---

### ☐ Step 9: Test User Features (15 min)

**Test 9.1 - Property Posting**:

1. ☐ Login at: http://localhost:3000/entrar
2. ☐ Go to: http://localhost:3000/anunciar
3. ☐ Fill in property details:
   - Title: "Sítio Teste"
   - Description: "Propriedade para teste"
   - Price: "500000"
   - Area: "5000"
4. ☐ Upload 1-2 test photos
5. ☐ Click "Publicar Anúncio"
6. ☐ Verify property appears on homepage
7. ☐ Check Supabase Dashboard → Database → Tables → `properties`

✅ **Property posting works** ← Check when done

**Test 9.2 - Favorites**:

1. ☐ Go to homepage: http://localhost:3000
2. ☐ Click ❤️ heart icon on any property card
3. ☐ Verify heart turns red (favorited)
4. ☐ Go to: http://localhost:3000/conta → "Favoritos" tab
5. ☐ Verify property appears in favorites list
6. ☐ Check Supabase Dashboard → Database → Tables → `property_favorites`

✅ **Favorites work** ← Check when done

**Test 9.3 - Visit Scheduling**:

1. ☐ Go to any property detail page
2. ☐ Click "Agendar Visita" button
3. ☐ Select date/time (future date)
4. ☐ Fill in notes (optional)
5. ☐ Click "Agendar" button
6. ☐ Verify success message
7. ☐ Go to: http://localhost:3000/conta → "Minhas Visitas" tab
8. ☐ Verify visit appears
9. ☐ Check Supabase Dashboard → Database → Tables → `visits`

✅ **Visit scheduling works** ← Check when done

**Test 9.4 - Proposals**:

1. ☐ Go to any property detail page
2. ☐ Click "Fazer Proposta" button
3. ☐ Enter bid amount: `450000`
4. ☐ Add message: "Interessado na propriedade"
5. ☐ Click "Enviar Proposta"
6. ☐ Verify success message
7. ☐ Go to: http://localhost:3000/conta → "Minhas Propostas" tab
8. ☐ Verify proposal appears
9. ☐ Check Supabase Dashboard → Database → Tables → `proposals`

✅ **Proposals work** ← Check when done

---

## 🎉 FINAL CHECKLIST

### Configuration Complete:
- ☐ Email authentication enabled
- ☐ URL settings configured
- ☐ Google OAuth configured
- ☐ Storage bucket created
- ☐ Database migrations applied
- ☐ All tables verified

### Testing Complete:
- ☐ Email signup works
- ☐ Email login works
- ☐ Google OAuth works
- ☐ Profile auto-creation works
- ☐ Property posting works
- ☐ Favorites work
- ☐ Visit scheduling works
- ☐ Proposals work

---

## 🚀 NEXT STEPS

### If Everything Works:
```powershell
# Commit your changes
git add -A
git commit -m "Configure Supabase authentication and features"
git push
```

### If Issues Found:
See troubleshooting section in `SUPABASE-CONFIG-GUIDE.md`

---

## 📊 PROGRESS TRACKER

**Started**: __________ (time)  
**Completed**: __________ (time)  
**Total Time**: __________ minutes  

**Status**:
- ☐ Not Started
- ☐ In Progress
- ☐ Testing
- ☐ Complete ✅

---

## 🐛 Common Issues & Quick Fixes

### "Invalid login credentials"
✓ Check email is confirmed in Supabase Dashboard → Authentication → Users

### "Email not confirmed"
✓ Resend confirmation email from Supabase Dashboard → Authentication → Users → Click user → "Send confirmation email"

### "Redirect URL not allowed"
✓ Add the URL to Authentication → URL Configuration → Redirect URLs

### "Table does not exist"
✓ Run migrations again via SQL Editor

### "Storage bucket not found"
✓ Create `imagens-sitios` bucket in Storage

### Google OAuth "redirect_uri_mismatch"
✓ Add `https://irrzpwzyqcubhhjeuakc.supabase.co/auth/v1/callback` to Google Cloud Console

---

## 📞 Need Help?

**Documentation**:
- `SUPABASE-CONFIG-GUIDE.md` - Detailed step-by-step guide
- `SYSTEM-AUDIT-DEEP-ANALYSIS.md` - Complete system analysis
- `AUTH-CHECKLIST.md` - Authentication setup checklist

**Supabase Resources**:
- Dashboard: https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc
- Docs: https://supabase.com/docs
- Community: https://github.com/supabase/supabase/discussions

---

**💡 TIP**: Work through this checklist step-by-step. Don't skip steps!

**⏱️ Estimated Total Time**: 45-60 minutes

**🎯 Goal**: Fully working authentication and user features by end of session
