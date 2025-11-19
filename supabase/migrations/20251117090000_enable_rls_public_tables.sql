-- Enable RLS and add conservative authenticated-only SELECT policies
-- Safe to re-run: uses ALTER TABLE and DROP/CREATE POLICY

BEGIN;

-- List of tables flagged by the Supabase linter as RLS disabled in public
-- Add or remove table names below as needed.

-- Note: these statements are idempotent and safe to re-run.

ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_select_authenticated_on_categories ON public.categories;
CREATE POLICY policy_select_authenticated_on_categories ON public.categories
  FOR SELECT USING (auth.uid() IS NOT NULL);

ALTER TABLE IF EXISTS public.bids ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_select_authenticated_on_bids ON public.bids;
CREATE POLICY policy_select_authenticated_on_bids ON public.bids
  FOR SELECT USING (auth.uid() IS NOT NULL);

ALTER TABLE IF EXISTS public.backup_listings_samsung_a07 ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_select_authenticated_on_backup_listings_samsung_a07 ON public.backup_listings_samsung_a07;
CREATE POLICY policy_select_authenticated_on_backup_listings_samsung_a07 ON public.backup_listings_samsung_a07
  FOR SELECT USING (auth.uid() IS NOT NULL);

ALTER TABLE IF EXISTS public.backup_user_profiles_test_user ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_select_authenticated_on_backup_user_profiles_test_user ON public.backup_user_profiles_test_user;
CREATE POLICY policy_select_authenticated_on_backup_user_profiles_test_user ON public.backup_user_profiles_test_user
  FOR SELECT USING (auth.uid() IS NOT NULL);

ALTER TABLE IF EXISTS public.app_settings_audit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_select_authenticated_on_app_settings_audit ON public.app_settings_audit;
CREATE POLICY policy_select_authenticated_on_app_settings_audit ON public.app_settings_audit
  FOR SELECT USING (auth.uid() IS NOT NULL);

ALTER TABLE IF EXISTS public.app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_select_authenticated_on_app_settings ON public.app_settings;
CREATE POLICY policy_select_authenticated_on_app_settings ON public.app_settings
  FOR SELECT USING (auth.uid() IS NOT NULL);

ALTER TABLE IF EXISTS public.property_media_audit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS policy_select_authenticated_on_property_media_audit ON public.property_media_audit;
CREATE POLICY policy_select_authenticated_on_property_media_audit ON public.property_media_audit
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Add additional RLS/policy blocks below for other tables flagged by the linter.

COMMIT;

-- Guidance:
-- These policies are conservative: they allow read access to any authenticated user.
-- For sensitive tables (bids, app_settings, backups), replace the USING/WITH CHECK
-- expressions with owner-based or role-based logic as appropriate, e.g.:
--   USING (auth.uid() = owner_id::text)
-- and add WITH CHECK for INSERT/UPDATE if needed.
