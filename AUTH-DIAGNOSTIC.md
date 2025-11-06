# 🔍 Quick Diagnostic - Check Your Signup Status

## Step 1: Check if you're signed up

**Go to Supabase Dashboard**:
```
https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc/auth/users
```

**Look for**:
- Your email in the users list
- If it's there, check the "Confirmed" column
- If it says "Waiting for verification", you need to confirm your email

---

## Step 2: Manually Confirm Your Email (if needed)

**In Supabase Dashboard → Authentication → Users**:

1. Find your user
2. Click on the user row
3. Look for **"Email Confirmed"** field
4. If it's `false`, click the **"..."** menu → **"Confirm email"**

**OR** run this SQL:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW() 
WHERE email = 'your-email@example.com';
```

---

## Step 3: Check Profile Created

**Go to**: Database → Tables → `user_profiles`

**Look for**: A row with your user ID

**If missing**, run this SQL to manually create it:

```sql
-- Get your user ID first
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert profile (replace 'USER_ID_HERE' with the actual ID)
INSERT INTO user_profiles (id, full_name, phone, profile_completed)
VALUES ('USER_ID_HERE', 'Your Name', '(11) 98765-4321', false)
ON CONFLICT (id) DO NOTHING;
```

---

## Step 4: Test Login

1. Go to: http://localhost:3000/entrar
2. Enter your email and password
3. Click "Entrar"
4. **Check browser console** (F12) for any errors
5. **Expected**: Redirect to http://localhost:3000

---

## Step 5: If Login Still Fails

Run the complete fix SQL in Supabase:

```sql
-- Complete auth fix
-- 1. Fix trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, user_profiles.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Fix policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, anon, authenticated, service_role;
```

---

## 📋 Checklist

- [ ] User exists in Supabase Dashboard → Authentication → Users
- [ ] Email is confirmed (or manually confirmed)
- [ ] Profile exists in user_profiles table
- [ ] Can login successfully
- [ ] Redirected to homepage after login
- [ ] No errors in browser console

---

**Next**: Once login works, we'll test all the features (Postar, Favorites, Visits, Proposals, Chat)
