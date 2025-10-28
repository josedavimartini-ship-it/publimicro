Publimicro BLOCO 1 Package
--------------------------
Files created:
- src/app/... pages: home, imoveis, classificados, anunciar, contato
- src/components/...: Footer, SectionCard, home components
- src/lib/supabaseClient.ts (please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local)
- utils/formatCurrency.ts
- sql/add_destaque_column.sql : run this in Supabase to add 'destaque' column
- src/styles/globals.css : Tailwind entry
Instructions:
1) Extract the zip into the project root (C:\projetos\publimicro) and overwrite when asked.
2) Confirm .env.local contains NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
3) Run pnpm install (if needed) and pnpm run dev
4) In Supabase SQL editor run the SQL file to add the 'destaque' column.
5) In Supabase table 'items' mark destaque = true and status = 'aprovado' for items you want shown as highlights.
