-- ============================================
-- SITIOS TABLE - Legacy Sítios Carcará Properties
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.sitios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  localizacao VARCHAR(255),
  preco DECIMAL(15, 2),
  lance_inicial DECIMAL(15, 2),
  current_bid DECIMAL(15, 2),
  area_total DECIMAL(12, 2),
  area_construida DECIMAL(12, 2),
  quartos INTEGER DEFAULT 0,
  banheiros INTEGER DEFAULT 0,
  vagas INTEGER DEFAULT 0,
  zona VARCHAR(100),
  coordenadas JSONB,
  fotos TEXT[],
  video_url TEXT,
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  slug VARCHAR(300) UNIQUE,
  keywords TEXT[]
);

CREATE INDEX IF NOT EXISTS idx_sitios_user_id ON public.sitios(user_id);
CREATE INDEX IF NOT EXISTS idx_sitios_preco ON public.sitios(preco);
CREATE INDEX IF NOT EXISTS idx_sitios_zona ON public.sitios(zona);
CREATE INDEX IF NOT EXISTS idx_sitios_destaque ON public.sitios(destaque) WHERE destaque = true;
CREATE INDEX IF NOT EXISTS idx_sitios_slug ON public.sitios(slug);

GRANT ALL ON public.sitios TO authenticated;
GRANT ALL ON public.sitios TO service_role;

ALTER TABLE public.sitios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active sitios" ON public.sitios;
CREATE POLICY "Public can view active sitios"
  ON public.sitios FOR SELECT
  USING (ativo = true);

DROP POLICY IF EXISTS "Users can view own sitios" ON public.sitios;
CREATE POLICY "Users can view own sitios"
  ON public.sitios FOR SELECT
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

DROP POLICY IF EXISTS "Users can insert own sitios" ON public.sitios;
CREATE POLICY "Users can insert own sitios"
  ON public.sitios FOR INSERT
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

DROP POLICY IF EXISTS "Users can update own sitios" ON public.sitios;
CREATE POLICY "Users can update own sitios"
  ON public.sitios FOR UPDATE
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  )
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

DROP POLICY IF EXISTS "Users can delete own sitios" ON public.sitios;
CREATE POLICY "Users can delete own sitios"
  ON public.sitios FOR DELETE
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

DROP TRIGGER IF EXISTS sitios_updated_at ON public.sitios;
CREATE TRIGGER sitios_updated_at
  BEFORE UPDATE ON public.sitios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION generate_sitio_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := lower(trim(regexp_replace(NEW.nome, '[^a-zA-Z0-9\s-]', '', 'g')));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := substring(base_slug, 1, 250);
    final_slug := base_slug;
    WHILE EXISTS (SELECT 1 FROM public.sitios WHERE slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sitios_generate_slug ON public.sitios;
CREATE TRIGGER sitios_generate_slug
  BEFORE INSERT OR UPDATE ON public.sitios
  FOR EACH ROW
  EXECUTE FUNCTION generate_sitio_slug();

COMMENT ON TABLE public.sitios IS 'Legacy table for Sítios Carcará properties - can be migrated to properties table';
-- ============================================
-- SITIOS TABLE - Legacy Sítios Carcará Properties
-- ============================================
-- This table supports existing sitios data and code references
-- Eventually can be migrated to the properties table

-- First, ensure the update_updated_at function exists
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.sitios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  localizacao VARCHAR(255),
  preco DECIMAL(15, 2),
  lance_inicial DECIMAL(15, 2),
  current_bid DECIMAL(15, 2),
  area_total DECIMAL(12, 2),
  area_construida DECIMAL(12, 2),
  quartos INTEGER DEFAULT 0,
  banheiros INTEGER DEFAULT 0,
  vagas INTEGER DEFAULT 0,
  zona VARCHAR(100),
  coordenadas JSONB,
  fotos TEXT[],
  video_url TEXT,
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  slug VARCHAR(300) UNIQUE,
  keywords TEXT[]
);

CREATE INDEX IF NOT EXISTS idx_sitios_user_id ON public.sitios(user_id);
CREATE INDEX IF NOT EXISTS idx_sitios_preco ON public.sitios(preco);
CREATE INDEX IF NOT EXISTS idx_sitios_zona ON public.sitios(zona);
CREATE INDEX IF NOT EXISTS idx_sitios_destaque ON public.sitios(destaque) WHERE destaque = true;
CREATE INDEX IF NOT EXISTS idx_sitios_slug ON public.sitios(slug);

GRANT ALL ON public.sitios TO authenticated;
GRANT ALL ON public.sitios TO service_role;

ALTER TABLE public.sitios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active sitios" ON public.sitios;
CREATE POLICY "Public can view active sitios"
  ON public.sitios FOR SELECT
  USING (ativo = true);

DROP POLICY IF EXISTS "Users can view own sitios" ON public.sitios;
CREATE POLICY "Users can view own sitios"
  ON public.sitios FOR SELECT
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

DROP POLICY IF EXISTS "Users can insert own sitios" ON public.sitios;
CREATE POLICY "Users can insert own sitios"
  ON public.sitios FOR INSERT
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

DROP POLICY IF EXISTS "Users can update own sitios" ON public.sitios;
CREATE POLICY "Users can update own sitios"
  ON public.sitios FOR UPDATE
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  )
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

DROP POLICY IF EXISTS "Users can delete own sitios" ON public.sitios;
CREATE POLICY "Users can delete own sitios"
  ON public.sitios FOR DELETE
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

DROP TRIGGER IF EXISTS sitios_updated_at ON public.sitios;
CREATE TRIGGER sitios_updated_at
  BEFORE UPDATE ON public.sitios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION generate_sitio_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := lower(trim(regexp_replace(NEW.nome, '[^a-zA-Z0-9\s-]', '', 'g')));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := substring(base_slug, 1, 250);
    final_slug := base_slug;
    WHILE EXISTS (SELECT 1 FROM public.sitios WHERE slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sitios_generate_slug ON public.sitios;
CREATE TRIGGER sitios_generate_slug
  BEFORE INSERT OR UPDATE ON public.sitios
  FOR EACH ROW
  EXECUTE FUNCTION generate_sitio_slug();

COMMENT ON TABLE public.sitios IS 'Legacy table for Sítios Carcará properties - can be migrated to properties table';
-- Placeholder migration to match remote state (no-op)
DO $$ BEGIN RAISE NOTICE 'placeholder 20251107000000'; END $$;
