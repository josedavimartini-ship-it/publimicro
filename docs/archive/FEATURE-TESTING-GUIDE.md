# 🧪 PubliMicro Complete Feature Testing Guide

## 🔴 CRITICAL: First Steps

### 1. Check if you're signed up

Open this URL:
```
https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc/auth/users
```

**Do you see your email?**
- ✅ **YES** → Go to Step 2
- ❌ **NO** → Sign up again at http://localhost:3000/entrar

### 2. Confirm your email

**In Supabase Dashboard → Authentication → Users**:
1. Click on your user row
2. If "Email Confirmed" is `false`, click **"..."** → **"Confirm email"**
3. Or run this SQL:
   ```sql
   UPDATE auth.users 
   SET email_confirmed_at = NOW(), confirmed_at = NOW() 
   WHERE email = 'YOUR_EMAIL_HERE';
   ```

### 3. Test login

1. Go to: http://localhost:3000/entrar
2. Enter credentials
3. Click "Entrar"
4. **Press F12** → Check Console tab for errors
5. Should redirect to http://localhost:3000

---

## ✅ FEATURE TESTING CHECKLIST

Once logged in, test each feature:

### 🏠 Test 1: Property Posting (/anunciar)

**URL**: http://localhost:3000/anunciar

**Steps**:
1. Fill in all fields:
   - Title: "Sítio Teste Belo"
   - Description: "Linda propriedade rural"
   - Price: "500000"
   - Type: Select "Sítio"
   - Transaction: Select "Venda"
   - Location: "Planaltina, DF"
   - Area: "5000" (m²)
   - Bedrooms: "3"
   - Bathrooms: "2"

2. Upload photos (if working)

3. Click "Publicar Anúncio" or "Postar"

4. **Expected**:
   - Success message
   - Redirect to property page or list
   - Property appears in Supabase → Database → `properties` table

5. **Check Console** (F12) for errors

**Status**: ⬜ Not Tested | ✅ Working | ❌ Broken

**Notes**: _________________________________

---

### ❤️ Test 2: Favorites

**URL**: http://localhost:3000 (Homepage)

**Steps**:
1. Find any property card
2. Click the **❤️ heart icon**
3. Heart should turn **red**
4. Go to: http://localhost:3000/conta
5. Click **"Favoritos"** or **"Meus Favoritos"** tab
6. Property should appear in list

7. **Verify in Supabase**:
   - Database → `property_favorites` table
   - Should see row with your `user_id` and `property_id`

**Status**: ⬜ Not Tested | ✅ Working | ❌ Broken

**Notes**: _________________________________

---

### 📅 Test 3: Visit Scheduling

**URL**: Any property detail page

**Steps**:
1. Go to any property: http://localhost:3000/imoveis/[property-id]
   - OR Carcará page: http://localhost:3000/projetos/carcara

2. Click **"Agendar Visita"** button

3. Fill visit form:
   - Date: Tomorrow
   - Time: 14:00
   - Type: In-person or Video
   - Notes: "Gostaria de ver a propriedade"

4. Click **"Agendar"** or **"Solicitar Visita"**

5. **Expected**:
   - Success message: "Visita agendada com sucesso!"
   - Visit appears in Database → `visits` table

6. **Check your visits**:
   - Go to: http://localhost:3000/conta
   - Click **"Minhas Visitas"** tab
   - Visit should appear with status "requested"

**Status**: ⬜ Not Tested | ✅ Working | ❌ Broken

**Notes**: _________________________________

---

### 💰 Test 4: Proposals/Bids

**URL**: Any property detail page

**Steps**:
1. Go to any property page

2. Click **"Fazer Proposta"** button

3. Fill proposal form:
   - Amount: R$ 450.000
   - Message: "Tenho interesse na propriedade"
   - Payment: Select "À vista" or "Financiado"

4. Click **"Enviar Proposta"**

5. **Expected**:
   - Success message
   - Proposal in Database → `proposals` table
   - Status: "pending"

6. **Check your proposals**:
   - Go to: http://localhost:3000/conta
   - Click **"Minhas Propostas"** tab
   - Proposal should appear

**Status**: ⬜ Not Tested | ✅ Working | ❌ Broken

**Notes**: _________________________________

---

### 💬 Test 5: Chat/Messaging System

**Check if it exists**:
1. Search for "chat" or "messages" button on property pages
2. Check /conta page for messages tab
3. Look in navigation menu

**Status**: 
- ⬜ Feature exists and works
- ⬜ Feature exists but broken
- ✅ Feature doesn't exist (needs to be built)

**Notes**: _________________________________

---

### 👤 Test 6: User Account (/conta)

**URL**: http://localhost:3000/conta

**Tabs to test**:
1. ✅ **Perfil** (Profile)
   - Shows your name, email, phone
   - Can edit profile
   
2. ✅ **Meus Anúncios** (My Posts)
   - Lists your posted properties
   - Edit/Delete buttons work
   
3. ✅ **Favoritos**
   - Shows favorited properties
   
4. ✅ **Minhas Visitas**
   - Shows scheduled visits
   
5. ✅ **Minhas Propostas**
   - Shows your bids/proposals

**Status**: ⬜ Not Tested | ✅ Working | ❌ Broken

**Notes**: _________________________________

---

## 🔧 QUICK FIXES

### If Login Doesn't Work:

**Run this in Supabase SQL Editor**:
```sql
-- Manually confirm your email
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW() 
WHERE email = 'YOUR_EMAIL@example.com';

-- Check if profile exists
SELECT * FROM user_profiles WHERE id = (
  SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com'
);

-- If no profile, create it
INSERT INTO user_profiles (id, full_name, phone, profile_completed)
SELECT id, 'Your Name', '(11) 98765-4321', false
FROM auth.users 
WHERE email = 'YOUR_EMAIL@example.com'
ON CONFLICT (id) DO NOTHING;
```

### If Features Don't Work:

**Check browser console** (F12 → Console tab) for errors and send me:
1. The exact error message
2. Which feature failed
3. What you were trying to do

---

## 📊 TEST RESULTS SUMMARY

| Feature | Status | Notes |
|---------|--------|-------|
| Login | ⬜ | |
| Property Posting | ⬜ | |
| Favorites | ⬜ | |
| Visit Scheduling | ⬜ | |
| Proposals | ⬜ | |
| Chat | ⬜ | |
| User Account | ⬜ | |

---

## 🚀 NEXT: AcheMeMotors Schema

After testing, I'll create the posting schema for:
- **AcheMeMotors** (vehicles)
- **AcheMeMachina** (machinery)
- **AcheMeOutdoor** (outdoor equipment)

Each will have custom fields like:
- Vehicles: make, model, year, mileage, transmission, fuel_type
- Machinery: type, brand, hours_used, condition
- Outdoor: category, brand, condition, size

---

**Start testing now and let me know what works and what doesn't!** 🧪
