-- Create taxonomy and attribute system for hierarchical categories
-- Idempotent migration: creates categories, attributes, options, product_models

-- Ensure uuid generator available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Categories table: hierarchical via parent_id and path (slash-separated)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '',
  depth INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (parent_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_path ON public.categories USING GIN (to_tsvector('simple', path::text));

-- Category attributes: define fields per category
CREATE TABLE IF NOT EXISTS public.category_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  key TEXT NOT NULL, -- machine key e.g. "ram"
  label TEXT NOT NULL, -- human label
  type TEXT NOT NULL CHECK (type IN ('select','multiselect','number','text','boolean','range')),
  options JSONB DEFAULT '[]'::jsonb, -- for select/multiselect: [{"value":"8gb","label":"8 GB"}, ...]
  required BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (category_id, key)
);

CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON public.category_attributes(category_id);

-- Attribute options table (optional normalized storage)
CREATE TABLE IF NOT EXISTS public.attribute_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id UUID NOT NULL REFERENCES public.category_attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT,
  position INTEGER DEFAULT 0,
  UNIQUE (attribute_id, value)
);

CREATE INDEX IF NOT EXISTS idx_attribute_options_attribute ON public.attribute_options(attribute_id);

-- Canonical product models to speed selection (brand/model/variant)
CREATE TABLE IF NOT EXISTS public.product_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT,
  model TEXT,
  sku TEXT,
  canonical_attributes JSONB DEFAULT '{}'::jsonb, -- e.g. {"ram":"8gb","storage":"128gb"}
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (category_id, brand, model, sku)
);

CREATE INDEX IF NOT EXISTS idx_product_models_category ON public.product_models(category_id);
CREATE INDEX IF NOT EXISTS idx_product_models_brand_model ON public.product_models(brand, model);

-- Listings will reference category and optionally product_model; those are in listing tables already (media migration uses 'media' table). For general use, we add a small helper table to map listing attributes (if needed later)
CREATE TABLE IF NOT EXISTS public.listing_attributes (
  listing_id UUID NOT NULL,
  attribute_key TEXT NOT NULL,
  attribute_value JSONB,
  PRIMARY KEY (listing_id, attribute_key)
);

CREATE INDEX IF NOT EXISTS idx_listing_attributes_key ON public.listing_attributes(attribute_key);

-- Trigger to maintain category path and depth
CREATE OR REPLACE FUNCTION public.categories_set_path()
RETURNS TRIGGER AS $$
DECLARE
  parent_path TEXT;
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path := NEW.slug;
    NEW.depth := 0;
  ELSE
    SELECT path || '/' || NEW.slug, (depth + 1) INTO parent_path, NEW.depth FROM public.categories WHERE id = NEW.parent_id;
    IF parent_path IS NULL THEN
      -- parent not found yet (deferred), set temporary
      NEW.path := NEW.slug;
    ELSE
      NEW.path := parent_path;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_categories_set_path ON public.categories;
CREATE TRIGGER trg_categories_set_path
  BEFORE INSERT OR UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.categories_set_path();

-- Ensure updated_at maintained
CREATE OR REPLACE FUNCTION public.ts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.ts_updated_at();

-- Useful indexes for attribute search (JSONB GIN)
CREATE INDEX IF NOT EXISTS idx_product_models_canonical_attributes ON public.product_models USING GIN (canonical_attributes);
CREATE INDEX IF NOT EXISTS idx_category_attributes_options ON public.category_attributes USING GIN (options);

-- Grant minimal rights to authenticated/service_role as needed
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.category_attributes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attribute_options TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_models TO authenticated;

-- End of taxonomy migration
