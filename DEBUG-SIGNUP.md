# 🔍 DEBUG SIGNUP ISSUE

## Problem
User filled signup form but account doesn't appear to be created in Supabase.

## Step-by-Step Debugging

### Step 1: Open Browser Console FIRST

**BEFORE trying to sign up**:
1. Press **F12** on your keyboard
2. Click the **"Console"** tab
3. Keep it open at the bottom of your browser
4. Clear any existing messages (click the 🚫 icon)

### Step 2: Try to Sign Up Again

1. Go to: http://localhost:3000/entrar
2. Click **"Criar Conta"** tab
3. Fill in ALL fields:
   ```
   Email: seuemail@exemplo.com
   Senha: SuaSenha123!
   Confirmar Senha: SuaSenha123!
   Nome Completo: Seu Nome
   Telefone: (11) 98765-4321
   ```
4. Click **"Criar Conta"** button
5. **IMMEDIATELY** look at the Console tab (F12)

### Step 3: What to Look For

**In the Console**, you should see ONE of these:

#### ✅ SUCCESS (Good):
```
User created successfully: [some-uuid-here]
```
**If you see this**: Account was created! Go to Step 4.

#### ❌ ERROR (Problem):
Look for red text with errors like:
- `Error: Email already registered`
- `Error: Invalid email format`
- `Network error`
- `Failed to fetch`
- Any other red error message

**If you see errors**: Copy the EXACT error message and send it to me.

#### ⚠️ NOTHING (Weird):
If you see nothing at all in console → Problem with the code or Supabase connection.

### Step 4: Check Supabase Dashboard

**Open this link**:
```
https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc/auth/users
```

**Look at the user list**:
- ☐ Is your email there?
- ☐ What is the "Email Confirmed" column value? (true or false)
- ☐ When was "Last Sign In"?

### Step 5: Manual Email Confirmation

**If your email IS in the list but "Email Confirmed" is FALSE**:

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Paste this SQL (replace with YOUR email):
   ```sql
   -- Check user status first
   SELECT 
     id,
     email,
     email_confirmed_at,
     confirmed_at,
     created_at
   FROM auth.users
   WHERE email = 'REPLACE_WITH_YOUR_EMAIL@example.com';
   ```
4. Click **"Run"** → You should see your user row
5. If `email_confirmed_at` is NULL, run this:
   ```sql
   -- Manually confirm email
   UPDATE auth.users 
   SET 
     email_confirmed_at = NOW(),
     confirmed_at = NOW()
   WHERE email = 'REPLACE_WITH_YOUR_EMAIL@example.com';
   ```
6. Click **"Run"** → Should show "Success. 1 rows affected"

### Step 6: Check Profile Was Created

**Still in SQL Editor**, run this:
```sql
-- Check if profile exists
SELECT * FROM user_profiles
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'REPLACE_WITH_YOUR_EMAIL@example.com'
);
```

**Expected result**: 1 row with your name, phone, etc.

**If NO rows**: Profile wasn't created. Run this:
```sql
-- Manually create profile
INSERT INTO user_profiles (id, full_name, phone, profile_completed)
SELECT 
  id,
  'Seu Nome Completo',
  '(11) 98765-4321',
  false
FROM auth.users 
WHERE email = 'REPLACE_WITH_YOUR_EMAIL@example.com'
ON CONFLICT (id) DO NOTHING;
```

### Step 7: Test Login

1. Go to: http://localhost:3000/entrar
2. Enter your email and password
3. Click **"Entrar"**
4. Watch the Console (F12) for errors
5. You should be redirected to homepage

---

## Quick Test: Create Test Account Manually

If signup still doesn't work, let's create a test account via SQL:

**Go to**: Supabase Dashboard → SQL Editor → New Query

```sql
-- 1. Create auth user manually
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Generate a UUID
  new_user_id := gen_random_uuid();
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    aud,
    role
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'teste@publimicro.com',  -- CHANGE THIS
    crypt('Teste123!', gen_salt('bf')),  -- CHANGE PASSWORD
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Usuario Teste","phone":"(11) 98765-4321"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  );
  
  -- Create profile
  INSERT INTO user_profiles (id, full_name, phone, profile_completed)
  VALUES (
    new_user_id,
    'Usuario Teste',  -- CHANGE THIS
    '(11) 98765-4321',  -- CHANGE THIS
    false
  );
  
  RAISE NOTICE 'User created with ID: %', new_user_id;
END $$;
```

**After running this**:
- Email: `teste@publimicro.com`
- Password: `Teste123!`
- Login at: http://localhost:3000/entrar

---

## Checklist: What to Send Me

After trying the steps above, send me:

1. ☐ Console errors (from F12 → Console)
2. ☐ Does your email appear in Supabase → Authentication → Users?
3. ☐ Is "Email Confirmed" true or false?
4. ☐ Does profile exist in user_profiles table?
5. ☐ Did login work after manual email confirmation?

---

## Alternative: Check Supabase Logs

**If nothing works**, check Supabase logs:

1. Go to: https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc/logs/explorer
2. Look for recent errors (last 10 minutes)
3. Screenshot any red errors and send to me

---

**Start with Step 1-3 and let me know what happens!** 🔍
