
-- Supabase table definitions for forms
create table if not exists public.contatos_visitas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  telefone text,
  cidade text,
  pais text,
  prop_id uuid, -- reference to items.id (optional)
  mensagem text,
  preferencia_date text,
  created_at timestamptz default now()
);

create table if not exists public.propostas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  telefone text,
  cidade text,
  pais text,
  prop_id uuid, -- reference to items.id
  valor numeric,
  condicoes text,
  justificativa text,
  doc_url text[], -- array of uploaded docs URLs
  status text default 'pendente',
  created_at timestamptz default now()
);
