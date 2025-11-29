-- ADS: general classified items
CREATE TABLE IF NOT EXISTS public.ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  price numeric,
  currency text DEFAULT 'BRL',
  location text,
  images text[] DEFAULT '{}',
  status text DEFAULT 'published',
  featured_until timestamptz,
  views_count int DEFAULT 0,
  current_bid numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner can manage own ads" ON public.ads;
CREATE POLICY "Owner can manage own ads"
  ON public.ads FOR ALL 
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Anyone can read published ads" ON public.ads;
CREATE POLICY "Anyone can read published ads"
  ON public.ads FOR SELECT
  USING (status IN ('published','featured'));

CREATE INDEX IF NOT EXISTS idx_ads_category ON public.ads(category);
CREATE INDEX IF NOT EXISTS idx_ads_status ON public.ads(status);
CREATE INDEX IF NOT EXISTS idx_ads_location ON public.ads(location);