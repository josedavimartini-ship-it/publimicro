-- Migration: Add free ads quota and enforce single active subscription
-- Created: 2025-11-19

-- 1) Add columns to users table (idempotent)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS free_ads_remaining integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_state text DEFAULT 'unverified';

-- 2) Trigger function to set free ads on insert if not provided
CREATE OR REPLACE FUNCTION public.set_free_ads_on_insert()
RETURNS trigger AS $$
BEGIN
  IF NEW.free_ads_remaining IS NULL THEN
    NEW.free_ads_remaining := 2;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_set_free_ads_on_insert') THEN
    EXECUTE 'CREATE TRIGGER tr_set_free_ads_on_insert
      BEFORE INSERT ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION public.set_free_ads_on_insert()';
  END IF;
END;
$$;

-- 3) Enforce single active subscription per user using a partial unique index
-- This expects a `subscriptions` table with at least `user_id` and `status` columns.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='subscriptions') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='subscriptions' AND indexname='uniq_active_subscription_per_user'
    ) THEN
      -- Create concurrently to avoid locking large tables in production.
      EXECUTE 'CREATE UNIQUE INDEX CONCURRENTLY uniq_active_subscription_per_user ON public.subscriptions (user_id) WHERE status = ''active''';
    END IF;
  END IF;
END;
$$;

-- Rollback notes:
-- To rollback, DROP the trigger, function and index, and drop the columns if desired.
-- Use caution when dropping columns; archive data first.
