-- Migration: create a simple key/value table for application settings
-- Key is text PK, value is JSONB to allow booleans/objects, updated_at for auditing
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Insert default bidding flag (false) if missing
INSERT INTO public.app_settings (key, value)
SELECT 'bidding_open', 'false'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.app_settings WHERE key = 'bidding_open');
