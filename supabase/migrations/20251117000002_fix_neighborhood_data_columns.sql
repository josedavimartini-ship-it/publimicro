-- Placeholder migration to match remote state (no-op)
DO $$ BEGIN RAISE NOTICE 'placeholder 20251117000002'; END $$;
-- Add missing columns and indexes for neighborhood_data (idempotent)
BEGIN;

ALTER TABLE public.neighborhood_data
  ADD COLUMN IF NOT EXISTS urban_area BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS rural_area BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_neighborhood_data_urban
  ON public.neighborhood_data(urban_area, rural_area);

COMMIT;

-- Note: This migration is intentionally small and idempotent to repair
-- diverging schemas where `neighborhood_data` existed without the
-- `urban_area`/`rural_area` columns. It is safe to run multiple times.
