
Publimicro - Forms & Pages Integration Package
==============================================

This package adds dedicated pages and components for:
- Contact & Visit form (page: /contato)
- Proposal form (page: /proposta)
- Home sections placeholders and classifieds overview
- Integration-ready API routes for inserting submissions to Supabase

How to use:
1. Extract this package into your project root (C:\projetos\publimicro) so it merges with your existing src/.
2. Ensure .env.local contains your Supabase keys (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
3. Run: pnpm install (if new deps added) and pnpm run dev
4. Create the DB tables using the SQL in the file `supabase_tables.sql` (open Supabase SQL editor and run).
5. Test pages:
   - Home: http://localhost:3000/
   - Contact: http://localhost:3000/contato
   - Proposal: http://localhost:3000/proposta
   - Property detail example: http://localhost:3000/imoveis/<id>
   - Classificados overview: http://localhost:3000/classificados

Notes:
- The forms send submissions to API routes (/api/contato and /api/proposta) which insert into Supabase.
- The forms accept an optional query param `?propId=<id>` so when opened from a listing, the propId is prefilled.
- Proposal submissions will be stored but the "active proposals" workflow (BID) is disabled until you choose to enable it.
