# Fix all SQL migration files with proper encoding
$files = @{
  "apps/publimicro/sql/01_create_profiles.sql" = @"
-- PROFILES: basic user profile data and ad quotas
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  full_name text,
  email text UNIQUE,
  phone text,
  verified_minimal boolean DEFAULT false,
  ads_remaining int DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS `$`$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
`$`$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
"@

  "apps/publimicro/sql/02_create_ads.sql" = @"
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
"@

  "apps/publimicro/sql/03_create_visits.sql" = @"
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
RETURNS trigger AS `$`$
BEGIN
  IF new.verification_passed = true AND new.status = 'requested' THEN
    UPDATE public.visits
      SET status = 'confirmed'
      WHERE id = new.id
        AND new.scheduled_at > now() + interval '24 hours';
  END IF;
  RETURN new;
END;
`$`$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_confirm_visits ON public.visits;
CREATE TRIGGER trg_auto_confirm_visits
  AFTER INSERT ON public.visits
  FOR EACH ROW EXECUTE PROCEDURE public.auto_confirm_visits();

CREATE OR REPLACE FUNCTION public.notify_new_visit()
RETURNS trigger AS `$`$
BEGIN
  PERFORM pg_notify('new_visit', json_build_object(
    'visit_id', new.id,
    'user_id', new.user_id,
    'scheduled_at', new.scheduled_at,
    'ad_id', new.ad_id
  )::text);
  RETURN new;
END;
`$`$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_new_visit ON public.visits;
CREATE TRIGGER trg_notify_new_visit
  AFTER INSERT ON public.visits
  FOR EACH ROW EXECUTE PROCEDURE public.notify_new_visit();
"@

  "apps/publimicro/sql/04_create_proposals.sql" = @"
-- PROPOSALS: purchase/bid offers
CREATE TABLE IF NOT EXISTS public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visit_id uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  status text DEFAULT 'pending',
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User can read own proposals" ON public.proposals;
CREATE POLICY "User can read own proposals"
  ON public.proposals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User can insert proposals" ON public.proposals;
CREATE POLICY "User can insert proposals"
  ON public.proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.auto_accept_proposals()
RETURNS trigger AS `$`$
DECLARE
  current_price numeric;
  threshold numeric;
BEGIN
  SELECT COALESCE(current_bid, price, 0) INTO current_price 
  FROM public.ads WHERE id = new.ad_id;
  
  threshold := current_price * 1.10;

  IF new.amount >= threshold THEN
    UPDATE public.proposals SET status = 'accepted' WHERE id = new.id;

    INSERT INTO public.bids(ad_id, user_id, proposal_id, amount)
    VALUES (new.ad_id, new.user_id, new.id, new.amount);

    UPDATE public.ads SET current_bid = new.amount WHERE id = new.ad_id;

    PERFORM pg_notify('proposal_auto_accepted', json_build_object(
      'ad_id', new.ad_id,
      'user_id', new.user_id,
      'amount', new.amount
    )::text);
  END IF;

  RETURN new;
END;
`$`$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_accept_proposals ON public.proposals;
CREATE TRIGGER trg_auto_accept_proposals
  AFTER INSERT ON public.proposals
  FOR EACH ROW EXECUTE PROCEDURE public.auto_accept_proposals();
"@

  "apps/publimicro/sql/05_create_bids.sql" = @"
-- BIDS: accepted proposals / bid history
CREATE TABLE IF NOT EXISTS public.bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.update_current_bid()
RETURNS trigger AS `$`$
BEGIN
  UPDATE public.ads 
  SET current_bid = GREATEST(COALESCE(current_bid, 0), new.amount),
      updated_at = now()
  WHERE id = new.ad_id;
  RETURN new;
END;
`$`$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_bid ON public.bids;
CREATE TRIGGER trg_update_bid
  AFTER INSERT ON public.bids
  FOR EACH ROW EXECUTE PROCEDURE public.update_current_bid();

CREATE INDEX IF NOT EXISTS idx_bids_ad ON public.bids(ad_id);
CREATE INDEX IF NOT EXISTS idx_bids_user ON public.bids(user_id);
"@

  "apps/publimicro/sql/06_create_sitios.sql" = @"
-- SITIOS: Carcara properties
CREATE TABLE IF NOT EXISTS public.sitios (
  id text PRIMARY KEY,
  nome text NOT NULL,
  localizacao text,
  zona text,
  preco numeric,
  lance_inicial numeric,
  fotos text[] DEFAULT '{}',
  destaque boolean DEFAULT false,
  descricao text,
  area_total numeric,
  area_construida numeric,
  quartos int,
  banheiros int,
  vagas int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.sitios (id, nome, localizacao, zona, preco, lance_inicial, fotos, destaque, descricao)
VALUES 
  ('surucua', 'Surucuá', 'Margem da Represa', 'Zona da Mata', 1700000, 1050000, 
   ARRAY['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/surucua.jpg'], 
   true, '6.8 hectares de natureza preservada'),
  ('juriti', 'Juriti', 'Margem da Represa', 'Zona da Mata', 2000000, 1200000,
   ARRAY['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/solposto.jpg'],
   true, '7.2 hectares com acesso direto à água'),
  ('seriema', 'Seriema', 'Margem da Represa', 'Zona da Mata', 2350000, 1550000,
   ARRAY['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol7.jpg'],
   true, '8.5 hectares com vista panorâmica'),
  ('mergulhao', 'Mergulhão', 'Margem da Represa', 'Beira-Rio', 2950000, 1950000,
   ARRAY['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mutum.jpg'],
   true, '9.3 hectares premium'),
  ('bigua', 'Biguá', 'Margem da Represa', 'Beira-Rio', 3250000, 2250000,
   ARRAY['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol1.jpg'],
   true, '10.1 hectares com pier'),
  ('abare', 'Abaré', 'Margem da Represa', 'Beira-Rio', 3650000, 2550000,
   ARRAY['https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosolOrange.jpg'],
   true, '11.5 hectares com praia privativa')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.sitios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read sitios" ON public.sitios;
CREATE POLICY "Anyone can read sitios"
  ON public.sitios FOR SELECT
  USING (true);
"@
}

foreach ($file in $files.Keys) {
  $content = $files[$file]
  [System.IO.File]::WriteAllText((Join-Path $PWD $file), $content, [System.Text.Encoding]::UTF8)
  Write-Host "Updated: $file"
}

Write-Host "`nAll SQL files updated successfully!"
