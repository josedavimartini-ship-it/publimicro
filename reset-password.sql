-- Reset password for your accounts to: Teste123!

-- Update password for davimartini@gmail.com
UPDATE auth.users 
SET 
  encrypted_password = crypt('Teste123!', gen_salt('bf'))
WHERE email = 'davimartini@gmail.com';

-- Update password for josedavimartini@gmail.com
UPDATE auth.users 
SET 
  encrypted_password = crypt('Teste123!', gen_salt('bf'))
WHERE email = 'josedavimartini@gmail.com';

-- Verify users are ready to login
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  encrypted_password IS NOT NULL as has_password,
  'Password reset to: Teste123!' as new_password
FROM auth.users
WHERE email IN ('davimartini@gmail.com', 'josedavimartini@gmail.com')
ORDER BY created_at DESC;
