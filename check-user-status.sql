-- Check if user exists and their status
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Check if profile was created
SELECT 
  up.id,
  up.full_name,
  up.phone,
  up.profile_completed,
  up.created_at,
  au.email
FROM user_profiles up
LEFT JOIN auth.users au ON au.id = up.id
ORDER BY up.created_at DESC
LIMIT 5;

-- Check auth configuration
SELECT 
  key,
  value
FROM auth.config
WHERE key IN ('SITE_URL', 'MAILER_AUTOCONFIRM');
