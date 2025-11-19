-- Migration: create canonical taxonomy tables and polymorphic media table
-- Date: 2025-11-17

-- Ensure pgcrypto available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- Sections table (top-level segments)
CREATE TABLE IF NOT EXISTS sections (
  id uuid primary key default gen_random_uuid(),
  key text unique,
  name_en text not null,
  name_pt text not null,
  name_es text not null,
  slug text not null unique,
  bucket text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories (under sections)
CREATE TABLE IF NOT EXISTS categories (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references sections(id) on delete cascade,
  key text,
  name_en text not null,
  name_pt text not null,
  name_es text not null,
  slug text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subcategories (under categories)
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  key text,
  name_en text not null,
  name_pt text not null,
  name_es text not null,
  slug text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Polymorphic media table normalized across listing types
CREATE TABLE IF NOT EXISTS media (
  id uuid primary key default gen_random_uuid(),
  resource_type text not null, -- e.g. 'property','motor','marine','listing'
  resource_id uuid not null,
  placeholder_id uuid,
  url text,
  thumbnail_url text,
  caption_en text,
  caption_pt text,
  caption_es text,
  status text not null default 'processing', -- processing, ready, flagged, failed
  moderation jsonb,
  metadata jsonb,
  display_order integer default 0,
  is_cover boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_media_resource ON media(resource_type, resource_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_placeholder_id ON media(placeholder_id);
CREATE INDEX IF NOT EXISTS idx_media_status ON media(status);

-- Timestamp trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION fn_set_timestamp() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_timestamp_sections BEFORE UPDATE ON sections FOR EACH ROW EXECUTE PROCEDURE fn_set_timestamp();
CREATE TRIGGER trg_timestamp_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE fn_set_timestamp();
CREATE TRIGGER trg_timestamp_subcategories BEFORE UPDATE ON subcategories FOR EACH ROW EXECUTE PROCEDURE fn_set_timestamp();
CREATE TRIGGER trg_timestamp_media BEFORE UPDATE ON media FOR EACH ROW EXECUTE PROCEDURE fn_set_timestamp();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'property_photos' AND n.nspname = 'public'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns ic
    WHERE ic.table_schema = 'public' AND ic.table_name = 'property_photos' AND ic.column_name = 'updated_at'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns ic2
    WHERE ic2.table_schema = 'public' AND ic2.table_name = 'property_photos' AND ic2.column_name = 'created_at'
  ) THEN
    INSERT INTO media (resource_type, resource_id, url, thumbnail_url, caption_pt, status, display_order, is_cover, created_at, updated_at)
    SELECT 'property' AS resource_type, property_id AS resource_id, url, thumbnail_url, caption AS caption_pt, 'ready' AS status, display_order, is_cover, coalesce(created_at, now()), coalesce(updated_at, now())
    FROM property_photos
    WHERE url IS NOT NULL;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

COMMIT;
-- Migration: create canonical taxonomy tables and polymorphic media table
-- Date: 2025-11-17

-- Ensure pgcrypto available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- Sections table (top-level segments)
CREATE TABLE IF NOT EXISTS sections (
  id uuid primary key default gen_random_uuid(),
  key text unique,
  name_en text not null,
  name_pt text not null,
  name_es text not null,
  slug text not null unique,
  bucket text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories (under sections)
CREATE TABLE IF NOT EXISTS categories (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references sections(id) on delete cascade,
  key text,
  name_en text not null,
  name_pt text not null,
  name_es text not null,
  slug text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subcategories (under categories)
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  key text,
  name_en text not null,
  name_pt text not null,
  name_es text not null,
  slug text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Polymorphic media table normalized across listing types
CREATE TABLE IF NOT EXISTS media (
  id uuid primary key default gen_random_uuid(),
  resource_type text not null, -- e.g. 'property','motor','marine','listing'
  resource_id uuid not null,
  placeholder_id uuid,
  url text,
  thumbnail_url text,
  caption_en text,
  caption_pt text,
  caption_es text,
  status text not null default 'processing', -- processing, ready, flagged, failed
  moderation jsonb,
  metadata jsonb,
  display_order integer default 0,
  is_cover boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_media_resource ON media(resource_type, resource_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_media_placeholder_id ON media(placeholder_id);
CREATE INDEX IF NOT EXISTS idx_media_status ON media(status);

-- Timestamp trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION fn_set_timestamp() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_timestamp_sections BEFORE UPDATE ON sections FOR EACH ROW EXECUTE PROCEDURE fn_set_timestamp();
CREATE TRIGGER trg_timestamp_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE fn_set_timestamp();
CREATE TRIGGER trg_timestamp_subcategories BEFORE UPDATE ON subcategories FOR EACH ROW EXECUTE PROCEDURE fn_set_timestamp();
CREATE TRIGGER trg_timestamp_media BEFORE UPDATE ON media FOR EACH ROW EXECUTE PROCEDURE fn_set_timestamp();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE c.relname = 'property_photos' AND n.nspname = 'public'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns ic
    WHERE ic.table_schema = 'public' AND ic.table_name = 'property_photos' AND ic.column_name = 'updated_at'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns ic2
    WHERE ic2.table_schema = 'public' AND ic2.table_name = 'property_photos' AND ic2.column_name = 'created_at'
  ) THEN
    INSERT INTO media (resource_type, resource_id, url, thumbnail_url, caption_pt, status, display_order, is_cover, created_at, updated_at)
    SELECT 'property' AS resource_type, property_id AS resource_id, url, thumbnail_url, caption AS caption_pt, 'ready' AS status, display_order, is_cover, coalesce(created_at, now()), coalesce(updated_at, now())
    FROM property_photos
    WHERE url IS NOT NULL;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

COMMIT;
