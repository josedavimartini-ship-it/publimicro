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