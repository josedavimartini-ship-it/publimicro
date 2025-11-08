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
  
  -- Owner
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  nome VARCHAR(255) NOT NULL,  -- Property name (e.g., "Sítio Carcará 1")
  descricao TEXT,
  localizacao VARCHAR(255),    -- Location description
  
  -- Pricing
  preco DECIMAL(15, 2),        -- Sale price
  lance_inicial DECIMAL(15, 2), -- Initial bid/auction price
  current_bid DECIMAL(15, 2),  -- Current highest bid
  
  -- Area
  area_total DECIMAL(12, 2),   -- Total area in m² or hectares
  area_construida DECIMAL(12, 2), -- Built area in m²
  
  -- Property Features
  quartos INTEGER DEFAULT 0,
  banheiros INTEGER DEFAULT 0,
  vagas INTEGER DEFAULT 0,     -- Parking spaces
  
  -- Location
  zona VARCHAR(100),           -- Zone/region
  coordenadas JSONB,           -- Geographic coordinates {lat, lng}
  
  -- Media
  fotos TEXT[],                -- Array of photo URLs
  video_url TEXT,
  
  -- Status
  destaque BOOLEAN DEFAULT false,  -- Featured property
  ativo BOOLEAN DEFAULT true,
  
  -- Legacy Fields
  slug VARCHAR(300) UNIQUE,
  keywords TEXT[]
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sitios_user_id ON public.sitios(user_id);
CREATE INDEX IF NOT EXISTS idx_sitios_preco ON public.sitios(preco);
CREATE INDEX IF NOT EXISTS idx_sitios_zona ON public.sitios(zona);
CREATE INDEX IF NOT EXISTS idx_sitios_destaque ON public.sitios(destaque) WHERE destaque = true;
CREATE INDEX IF NOT EXISTS idx_sitios_slug ON public.sitios(slug);

-- Grant permissions first
GRANT ALL ON public.sitios TO authenticated;
GRANT ALL ON public.sitios TO service_role;

-- RLS
ALTER TABLE public.sitios ENABLE ROW LEVEL SECURITY;

-- Public can view active sitios
DROP POLICY IF EXISTS "Public can view active sitios" ON public.sitios;
CREATE POLICY "Public can view active sitios"
  ON public.sitios FOR SELECT
  USING (ativo = true);

-- Users can view own sitios
DROP POLICY IF EXISTS "Users can view own sitios" ON public.sitios;
CREATE POLICY "Users can view own sitios"
  ON public.sitios FOR SELECT
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

-- Users can insert own sitios
DROP POLICY IF EXISTS "Users can insert own sitios" ON public.sitios;
CREATE POLICY "Users can insert own sitios"
  ON public.sitios FOR INSERT
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

-- Users can update own sitios
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

-- Users can delete own sitios
DROP POLICY IF EXISTS "Users can delete own sitios" ON public.sitios;
CREATE POLICY "Users can delete own sitios"
  ON public.sitios FOR DELETE
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );

-- Auto-update timestamp
DROP TRIGGER IF EXISTS sitios_updated_at ON public.sitios;
CREATE TRIGGER sitios_updated_at
  BEFORE UPDATE ON public.sitios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Generate slug if not provided
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
