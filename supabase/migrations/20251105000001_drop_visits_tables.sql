-- Drop visits and proposals tables if they exist
DROP TABLE IF EXISTS public.proposals CASCADE;
DROP TABLE IF EXISTS public.visits CASCADE;

-- Drop types if they exist
DROP TYPE IF EXISTS visit_status CASCADE;
DROP TYPE IF EXISTS visit_type CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS public.update_visits_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.auto_confirm_visits() CASCADE;
DROP FUNCTION IF EXISTS public.notify_new_visit() CASCADE;
