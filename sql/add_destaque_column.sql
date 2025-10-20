-- Run this in Supabase SQL editor to add 'destaque' column (boolean)
alter table public.items add column if not exists destaque boolean default false;
