-- Create taxonomy and attribute system: categories, attributes, options, product_models
-- Idempotent migration: safe to run multiple times

CREATE EXTENSION IF NOT EXISTS ltree;

BEGIN;

-- Categories: hierarchical taxonomy
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  depth INT DEFAULT 0,
  path ltree,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (parent_id, slug)
);

-- Attributes defined per category (facets / specs)
CREATE TABLE IF NOT EXISTS public.category_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  attribute_key TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL, -- select,multi,number,text,boolean,date
  options JSONB DEFAULT '[]'::jsonb, -- quick options list
  required BOOLEAN DEFAULT FALSE,
  ui_hint TEXT, -- e.g. radio, select, slider
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category_id, attribute_key)
);

-- Canonical attribute options (optional normalized table)
CREATE TABLE IF NOT EXISTS public.attribute_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id UUID NOT NULL REFERENCES public.category_attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Product models: canonical model inventory to allow one-click selection
CREATE TABLE IF NOT EXISTS public.product_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT,
  model_name TEXT,
  sku TEXT,
  variant_meta JSONB DEFAULT '{}'::jsonb, -- e.g. {"ram":"8GB","storage":"128GB"}
  searchable_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product model attributes (denormalized key/value for querying)
CREATE TABLE IF NOT EXISTS public.product_model_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_model_id UUID NOT NULL REFERENCES public.product_models(id) ON DELETE CASCADE,
  attribute_key TEXT NOT NULL,
  attribute_value TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE c.relname = 'categories') THEN
    PERFORM 1;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END$$;

CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_path ON public.categories USING GIST (path);

CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON public.category_attributes(category_id);
CREATE INDEX IF NOT EXISTS idx_attribute_options_attribute ON public.attribute_options(attribute_id);

CREATE INDEX IF NOT EXISTS idx_product_models_category ON public.product_models(category_id);
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'product_models' AND column_name = 'model_name'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_product_models_brand_model ON public.product_models(brand, model_name)';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END$$;

-- Create a tsvector expression index for product_models searchable text (guarded)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'product_models' AND indexname = 'idx_product_models_search'
  ) THEN
    -- Use searchable_text if present, otherwise build from brand + model_name
    EXECUTE '
      CREATE INDEX idx_product_models_search ON public.product_models USING GIN (
        to_tsvector(''simple'', coalesce(searchable_text, brand || '' '' || model_name))
      )';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END$$;

-- Trigger to maintain category path (ltree) and depth
CREATE OR REPLACE FUNCTION public.fn_update_category_path() RETURNS trigger AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path := NEW.slug::ltree;
    NEW.depth := 1;
  ELSE
    NEW.path := (SELECT (coalesce(path::text::ltree, '') || '.' || NEW.slug)::ltree FROM public.categories WHERE id = NEW.parent_id);
    NEW.depth := (SELECT coalesce(depth,0) + 1 FROM public.categories WHERE id = NEW.parent_id);
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_category_path ON public.categories;
CREATE TRIGGER trg_update_category_path
  BEFORE INSERT OR UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_update_category_path();

COMMIT;
-- Taxonomy and Attribute System
-- Creates hierarchical categories, category-specific attributes, attribute options, and canonical product models

-- Ensure ltree extension for hierarchical paths
CREATE EXTENSION IF NOT EXISTS ltree;

-- Attribute type enum (idempotent)
DO $$
BEGIN
  CREATE TYPE attribute_type AS ENUM ('select','multi','number','text','boolean','range','date');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Categories table: hierarchical taxonomy
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  path ltree NOT NULL,
  depth INT NOT NULL DEFAULT 1,
  order_idx INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_parent ON public.categories (parent_id, slug);
CREATE INDEX IF NOT EXISTS idx_categories_path ON public.categories USING GIST (path);
-- Ensure `metadata` column exists before creating GIN index (safe when earlier categories table lacked it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_categories_metadata ON public.categories USING GIN (metadata);

-- Category attributes: defines which attributes appear for listings in a category
CREATE TABLE IF NOT EXISTS public.category_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  attribute_key TEXT NOT NULL,
  label TEXT NOT NULL,
  type attribute_type NOT NULL,
  options JSONB DEFAULT '[]'::jsonb, -- structured options (for select/multi) or range hints
  required BOOLEAN DEFAULT FALSE,
  order_idx INT DEFAULT 0,
  ui_hint TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_category_attributes_category ON public.category_attributes(category_id);
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'category_attributes' AND column_name = 'attribute_key'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_category_attributes_key ON public.category_attributes(attribute_key)';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
CREATE INDEX IF NOT EXISTS idx_category_attributes_options ON public.category_attributes USING GIN (options);

-- Attribute options (optional normalized table) for very large option sets
CREATE TABLE IF NOT EXISTS public.attribute_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id UUID NOT NULL REFERENCES public.category_attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT,
  order_idx INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_attribute_options_attribute ON public.attribute_options(attribute_id);

-- Canonical product models for categories (helps selecting exact model/spec)
CREATE TABLE IF NOT EXISTS public.product_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT,
  model_name TEXT NOT NULL,
  sku TEXT,
  variant_meta JSONB DEFAULT '{}'::jsonb, -- structured key-values for specs (e.g., {"ram":"8GB","storage":"128GB"})
  searchable_text TEXT GENERATED ALWAYS AS (coalesce(brand,'') || ' ' || model_name) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_models_category ON public.product_models(category_id);
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'product_models' AND column_name = 'searchable_text'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_product_models_searchable ON public.product_models USING GIN (to_tsvector(''simple'', searchable_text))';
  ELSE
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_product_models_searchable ON public.product_models USING GIN (to_tsvector(''simple'', coalesce(brand,'''') || '' '' || model_name))';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'product_models' AND column_name = 'variant_meta'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_product_models_variant_meta ON public.product_models USING GIN (variant_meta)';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END$$;

-- Optional mapping table for explicit model -> attribute values (normalized)
CREATE TABLE IF NOT EXISTS public.product_model_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_model_id UUID NOT NULL REFERENCES public.product_models(id) ON DELETE CASCADE,
  attribute_key TEXT NOT NULL,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_model_attributes_model ON public.product_model_attributes(product_model_id);
CREATE INDEX IF NOT EXISTS idx_product_model_attributes_key ON public.product_model_attributes(attribute_key);

-- Trigger to maintain category path and depth
CREATE OR REPLACE FUNCTION public.fn_set_category_path()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path := NEW.slug::ltree;
    NEW.depth := 1;
  ELSE
    -- if parent exists, build path from parent.path
    NEW.path := (SELECT COALESCE(p.path::text || '.' || NEW.slug, NEW.slug) FROM public.categories p WHERE p.id = NEW.parent_id)::ltree;
    NEW.depth := (nlevel(NEW.path));
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_category_path ON public.categories;
CREATE TRIGGER trg_set_category_path
  BEFORE INSERT OR UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_category_path();

-- Convenience function to find full breadcrumb names
CREATE OR REPLACE FUNCTION public.fn_category_breadcrumb(cat_id UUID)
RETURNS TEXT AS $$
DECLARE
  p TEXT;
BEGIN
  SELECT string_agg(name, ' > ' ORDER BY nlevel(path)) INTO p
  FROM (
    SELECT name, path FROM public.categories WHERE id = ANY(string_to_array((SELECT path::text FROM public.categories WHERE id = cat_id), '.')::UUID[])
  ) s;
  RETURN p;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Basic grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO postgres, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.category_attributes TO postgres, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attribute_options TO postgres, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_models TO postgres, authenticated, service_role;

-- NOTES:
-- 1) Admin UI should allow adding categories, attributes, options and bulk-import product models.
-- 2) Listing creation flow should fetch `category_attributes` for the selected category and render fields accordingly.
-- 3) For search performance, we'll sync `product_models` and listing facets to a search engine (MeiliSearch) in a later phase.
