-- Set a deterministic search_path for functions in the `public` schema.
-- This migration finds functions in public and issues ALTER FUNCTION ... SET search_path
-- so that functions do not depend on a mutable search_path at runtime.

-- The block is written to discover function argument lists dynamically and
-- apply ALTER FUNCTION to each matching function. It's safe to re-run.

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT p.oid,
           n.nspname AS schema_name,
           p.proname AS function_name,
           pg_get_function_identity_arguments(p.oid) AS args,
           pg_get_userbyid(p.proowner) AS owner_name
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      -- Only attempt to ALTER functions owned by the current role to avoid
      -- permission/ownership errors (e.g. extension-owned functions).
      AND pg_get_userbyid(p.proowner) = current_user
  LOOP
    BEGIN
      -- Compose and execute ALTER FUNCTION ... SET search_path
      EXECUTE format(
        'ALTER FUNCTION %I.%I(%s) SET search_path = %L',
        r.schema_name,
        r.function_name,
        r.args,
        'public, pg_temp'
      );
    EXCEPTION WHEN OTHERS THEN
      -- Skip functions we cannot alter; log a notice for visibility.
      RAISE NOTICE 'skipping ALTER FUNCTION % I.% I(%), reason: %', r.schema_name, r.function_name, r.args, SQLERRM;
    END;
  END LOOP;
END$$;

-- Notes:
-- - This sets the function-level configuration so that the function runs with
--   a predictable search_path. Adjust the search_path string if you need
--   different schema ordering.
-- - ALTER FUNCTION requires exact identity-argument list; we used
--   pg_get_function_identity_arguments to construct that automatically.
