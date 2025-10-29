-- VISITS: scheduling for property visits or video meetings
CREATE TABLE IF NOT EXISTS public.visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_name text,
  guest_email text,
  guest_phone text,
  visit_type text DEFAULT 'in_person',
  scheduled_at timestamptz,
  status text DEFAULT 'requested',
  verification_passed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own visits" ON public.visits;
CREATE POLICY "Users can read own visits"
  ON public.visits FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own visits" ON public.visits;
CREATE POLICY "Users can insert own visits"
  ON public.visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.auto_confirm_visits()
RETURNS trigger AS $$
BEGIN
  IF new.verification_passed = true AND new.status = 'requested' THEN
    UPDATE public.visits
      SET status = 'confirmed'
      WHERE id = new.id
        AND new.scheduled_at > now() + interval '24 hours';
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_confirm_visits ON public.visits;
CREATE TRIGGER trg_auto_confirm_visits
  AFTER INSERT ON public.visits
  FOR EACH ROW EXECUTE PROCEDURE public.auto_confirm_visits();

CREATE OR REPLACE FUNCTION public.notify_new_visit()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('new_visit', json_build_object(
    'visit_id', new.id,
    'user_id', new.user_id,
    'scheduled_at', new.scheduled_at,
    'ad_id', new.ad_id
  )::text);
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_new_visit ON public.visits;
CREATE TRIGGER trg_notify_new_visit
  AFTER INSERT ON public.visits
  FOR EACH ROW EXECUTE PROCEDURE public.notify_new_visit();