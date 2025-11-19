-- Migration: create canonical taxonomy tables and polymorphic media table
-- Date: 2025-11-17

-- Ensure pgcrypto available for gen_random_uuid()
create extension if not exists pgcrypto;

begin;

-- Sections table (top-level segments)
create table if not exists sections (
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
create table if not exists categories (
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
create table if not exists subcategories (
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
create table if not exists media (
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

create index if not exists idx_media_resource on media(resource_type, resource_id);
create unique index if not exists idx_media_placeholder_id on media(placeholder_id);
create index if not exists idx_media_status on media(status);

-- Timestamp trigger to keep updated_at fresh
create or replace function fn_set_timestamp() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_timestamp_sections before update on sections for each row execute procedure fn_set_timestamp();
create trigger trg_timestamp_categories before update on categories for each row execute procedure fn_set_timestamp();
create trigger trg_timestamp_subcategories before update on subcategories for each row execute procedure fn_set_timestamp();
create trigger trg_timestamp_media before update on media for each row execute procedure fn_set_timestamp();

-- Backfill existing property_photos rows into media (mark as ready)
-- This assumes `property_photos` already exists in the schema.
-- We insert as resource_type='property' and copy relevant fields.
insert into media (resource_type, resource_id, url, thumbnail_url, caption_pt, status, display_order, is_cover, created_at, updated_at)
select 'property' as resource_type, property_id as resource_id, url, thumbnail_url, caption as caption_pt, 'ready' as status, display_order, is_cover, coalesce(created_at, now()), coalesce(updated_at, now())
from property_photos
where url is not null;

commit;
