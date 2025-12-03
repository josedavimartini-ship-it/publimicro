# 🔴 CRITICAL AUTH FIX - Email Confirmation Disabled

## The Problem

Supabase has **email confirmation REQUIRED** but you can't receive/confirm emails during development. This blocks all signups.

## The Solution - Disable Email Confirmation

### Option 1: Via Supabase Dashboard (EASIEST)

1. Go to: https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc/auth/providers

2. Scroll to **"Email"** section

3. Find **"Confirm email"** toggle

4. **Turn it OFF** (disable it)

5. Click **"Save"**

6. **Try signup again** at http://localhost:3000/entrar

---

### Option 2: Via SQL (If dashboard doesn't work)

Open Supabase SQL Editor and run:

```sql
-- Disable email confirmation requirement
UPDATE auth.config 
SET value = 'false'
WHERE key = 'MAILER_AUTOCONFIRM';

-- If that doesn't work, try this:
ALTER DATABASE postgres 
SET app.settings.auth_confirm_email = 'false';
```

---

## Verify Your Current Settings

Run this in SQL Editor:

```sql
-- Check current auth settings
SELECT * FROM auth.config 
WHERE key IN ('MAILER_AUTOCONFIRM', 'SITE_URL');

-- Check if any users exist
SELECT 
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

---

## After Disabling Email Confirmation

1. **Try signup again**: http://localhost:3000/entrar

2. **Fill the form**:
   - Full Name: "Your Name"
   - Email: "test@example.com" (or your real email)
   - Phone: "(61) 98765-4321"
   - Password: At least 6 characters

3. **Click "Criar Conta"**

4. **Should immediately**:
   - ✅ Create user in `auth.users`
   - ✅ Create profile in `user_profiles` (via trigger)
   - ✅ Log you in automatically
   - ✅ Redirect to homepage

---

## If Still Not Working

### Check Browser Console (F12)

Look for errors in Console tab and send me:
1. Any red error messages
2. The exact message that appears

### Check Network Tab (F12 → Network)

1. Open F12 → Network tab
2. Try signup again
3. Look for **failed requests** (red)
4. Click the failed request
5. Look at **Response** tab
6. Send me the error message

---

## Manual User Creation (Last Resort)

If signup form still doesn't work, run this SQL:

```sql
-- Create user manually
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_sent_at,
  confirmed_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'YOUR_EMAIL@example.com', -- CHANGE THIS
  crypt('YOUR_PASSWORD', gen_salt('bf')), -- CHANGE THIS
  NOW(), -- Email confirmed immediately
  '',
  '',
  '',
  '',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Your Name","phone":"(61) 98765-4321"}', -- CHANGE THIS
  NOW(),
  NOW(),
  NOW(),
  NOW() -- Confirmed immediately
)
RETURNING id, email;

-- The trigger will auto-create the profile
```

Then you can login with that email/password at http://localhost:3000/entrar

---

## 🎯 DO THIS NOW:

1. **Go to Supabase Dashboard** → Authentication → Providers
2. **Disable "Confirm email"** toggle
3. **Save**
4. **Try signup again** at http://localhost:3000/entrar
5. **Open F12 console** to see any errors
6. **Report back**: What happens?

---

**The email confirmation is blocking you. Disable it and signup should work immediately!** 🔓
