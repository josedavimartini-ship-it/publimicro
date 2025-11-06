-- ====================================================================
-- PubliMicro - Verify Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ====================================================================

-- Check which tables exist
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check user_profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Check properties table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'properties'
ORDER BY ordinal_position;

-- Check if triggers exist
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Count rows in each table (optional - shows if data exists)
SELECT 
    'user_profiles' as table_name, 
    COUNT(*) as row_count 
FROM user_profiles
UNION ALL
SELECT 
    'properties' as table_name, 
    COUNT(*) as row_count 
FROM properties
UNION ALL
SELECT 
    'property_favorites' as table_name, 
    COUNT(*) as row_count 
FROM property_favorites
UNION ALL
SELECT 
    'visits' as table_name, 
    COUNT(*) as row_count 
FROM visits
UNION ALL
SELECT 
    'proposals' as table_name, 
    COUNT(*) as row_count 
FROM proposals;
