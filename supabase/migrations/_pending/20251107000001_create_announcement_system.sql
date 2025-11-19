-- MOVED: This migration was restored into `supabase/migrations/20251107000001_create_announcement_system.sql` and
-- should no longer be applied from `_pending`. Kept as inert marker to avoid accidental double-application.
CREATE TABLE IF NOT EXISTS public.oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Provider Info
  provider VARCHAR(50) NOT NULL CHECK (provider IN (
    'google',
    'microsoft',
    -- MOVED: This migration was restored into `supabase/migrations/20251107000001_create_announcement_system.sql`.
    -- FILE PURPOSE: inert marker only — no DDL should be executed from `_pending`.
    -- If you need to re-apply, use the file under `supabase/migrations` instead.
