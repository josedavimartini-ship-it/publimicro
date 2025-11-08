-- ============================================
-- SITIOS TABLE - Simplified Version Without RLS First
-- ============================================

-- First, ensure the update_updated_at function exists
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop table if exists (for clean migration)
DROP TABLE IF EXISTS public.sitios CASCADE;

-- Create the table
CREATE TABLE public.sitios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Owner
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  localizacao VARCHAR(255),
  
  -- Pricing
  preco DECIMAL(15, 2),
  lance_inicial DECIMAL(15, 2),
  current_bid DECIMAL(15, 2),
  
  -- Area
  area_total DECIMAL(12, 2),
  area_construida DECIMAL(12, 2),
  
  -- Property Features
  quartos INTEGER DEFAULT 0,
  banheiros INTEGER DEFAULT 0,
  vagas INTEGER DEFAULT 0,
  
  -- Location
  zona VARCHAR(100),
  coordenadas JSONB,
  
  -- Media
  fotos TEXT[],
  video_url TEXT,
  
  -- Status
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  
  -- Legacy Fields
  slug VARCHAR(300) UNIQUE,
  keywords TEXT[]
);

-- Indexes
CREATE INDEX idx_sitios_user_id ON public.sitios(user_id);
CREATE INDEX idx_sitios_preco ON public.sitios(preco);
CREATE INDEX idx_sitios_zona ON public.sitios(zona);
CREATE INDEX idx_sitios_destaque ON public.sitios(destaque) WHERE destaque = true;
CREATE INDEX idx_sitios_slug ON public.sitios(slug);

-- Auto-update timestamp trigger
DROP TRIGGER IF EXISTS sitios_updated_at ON public.sitios;
CREATE TRIGGER sitios_updated_at
  BEFORE UPDATE ON public.sitios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Generate slug function
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

-- Slug generation trigger
DROP TRIGGER IF EXISTS sitios_generate_slug ON public.sitios;
CREATE TRIGGER sitios_generate_slug
  BEFORE INSERT OR UPDATE ON public.sitios
  FOR EACH ROW
  EXECUTE FUNCTION generate_sitio_slug();

-- Grant permissions
GRANT ALL ON public.sitios TO authenticated;
GRANT ALL ON public.sitios TO service_role;
GRANT SELECT ON public.sitios TO anon;

-- Enable RLS
ALTER TABLE public.sitios ENABLE ROW LEVEL SECURITY;

-- Simple policies without CASE statements
CREATE POLICY "sitios_select_public"
  ON public.sitios FOR SELECT
  USING (ativo = true OR auth.uid() = user_id);

CREATE POLICY "sitios_insert_authenticated"
  ON public.sitios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sitios_update_owner"
  ON public.sitios FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "sitios_delete_owner"
  ON public.sitios FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.sitios IS 'Legacy table for Sítios Carcará properties';
