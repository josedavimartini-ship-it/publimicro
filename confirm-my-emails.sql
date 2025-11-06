-- Manually confirm both user emails so they can login

-- Check current status
SELECT 
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users
WHERE email IN ('davimartini@gmail.com', 'josedavimartini@gmail.com')
ORDER BY created_at DESC;

-- Confirm both emails (confirmed_at is auto-generated)
UPDATE auth.users 
SET 
  email_confirmed_at = NOW()
WHERE email IN ('davimartini@gmail.com', 'josedavimartini@gmail.com');

-- Verify confirmation worked
SELECT 
  email,
  email_confirmed_at,
  confirmed_at,
  'Email is now confirmed!' as status
FROM auth.users
WHERE email IN ('davimartini@gmail.com', 'josedavimartini@gmail.com')
ORDER BY created_at DESC;

-- Check if profiles exist
SELECT 
  up.id,
  up.full_name,
  up.phone,
  up.profile_completed,
  au.email
FROM user_profiles up
INNER JOIN auth.users au ON au.id = up.id
WHERE au.email IN ('davimartini@gmail.com', 'josedavimartini@gmail.com')
ORDER BY up.created_at DESC;
