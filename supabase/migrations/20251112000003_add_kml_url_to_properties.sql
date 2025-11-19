-- Add kml_url column to properties (optional link to KML file for the property)
ALTER TABLE IF EXISTS properties
ADD COLUMN IF NOT EXISTS kml_url VARCHAR(1000);
-- Placeholder migration to match remote state (no-op)
DO $$ BEGIN RAISE NOTICE 'placeholder 20251112000003'; END $$;
