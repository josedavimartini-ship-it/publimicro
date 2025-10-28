create table imoveis (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  localizacao text,
  preco text,
  descricao text,
  imagem text,
  criado_em timestamp default now()
);

create table usuarios (
  id uuid default gen_random_uuid() primary key,
  nome text,
  email text unique,
  senha_hash text,
  criado_em timestamp default now()
);

create table favoritos (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references usuarios(id),
  imovel_id uuid references imoveis(id)
);
