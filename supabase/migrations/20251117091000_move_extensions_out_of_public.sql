-- Create an "extensions" schema and move known extensions out of public
-- Safe to re-run: checks if extension is installed and moves if present

BEGIN;

CREATE SCHEMA IF NOT EXISTS extensions;

-- Move ltree if installed in public
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'ltree') THEN
    -- Only set schema if not already in 'extensions'
    IF (SELECT extnamespace::regnamespace::text FROM pg_extension WHERE extname = 'ltree') <> 'extensions' THEN
      ALTER EXTENSION ltree SET SCHEMA extensions;
    END IF;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- swallow errors to keep migration idempotent/safe
  RAISE NOTICE 'Skipping moving ltree extension: %', SQLERRM;
END$$;

-- Move unaccent if installed in public
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'unaccent') THEN
    IF (SELECT extnamespace::regnamespace::text FROM pg_extension WHERE extname = 'unaccent') <> 'extensions' THEN
      ALTER EXTENSION unaccent SET SCHEMA extensions;
    END IF;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipping moving unaccent extension: %', SQLERRM;
END$$;

COMMIT;

-- Notes:
-- Moving extensions can change schema qualification; ensure your application
-- references the extension objects with schema qualification if needed.
