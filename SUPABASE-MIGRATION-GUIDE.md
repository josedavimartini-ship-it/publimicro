# ============================================
# SUPABASE MIGRATION GUIDE - Sitios Table
# ============================================

## 🎯 How to Run the Migration in Supabase Dashboard

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc
2. Login if needed

### Step 2: Navigate to SQL Editor
1. Click on "SQL Editor" in the left sidebar
2. Click "New query" button

### Step 3: Copy the Migration SQL
Copy the ENTIRE contents of this file:
`supabase/migrations/20251107000000_create_sitios_table.sql`

### Step 4: Paste and Run
1. Paste the SQL into the query editor
2. Click "Run" button (or press Ctrl+Enter)
3. Wait for "Success. No rows returned" message

### Step 5: Verify Table Creation
Run this verification query in a new SQL tab:

```sql
-- Check if sitios table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'sitios'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'sitios';
```

## ✅ Expected Results

You should see:
- **Columns**: id, created_at, updated_at, user_id, nome, descricao, localizacao, preco, lance_inicial, current_bid, area_total, area_construida, quartos, banheiros, vagas, zona, coordenadas, fotos, video_url, destaque, ativo, slug, keywords

- **RLS Policies**: 
  - Public can view active sitios
  - Users can view own sitios
  - Users can insert own sitios
  - Users can update own sitios
  - Users can delete own sitios

## 🔧 Alternative: Use Supabase CLI (if installed)

If you have Supabase CLI installed:

```bash
# Link to your project (one time)
supabase link --project-ref irrzpwzyqcubhhjeuakc

# Run migrations
supabase db push
```

## 📝 Migration File Location
`c:\projetos\publimicro\supabase\migrations\20251107000000_create_sitios_table.sql`

## 🚀 What This Migration Creates

### Table: `public.sitios`
Legacy support table for Sítios Carcará properties with:
- Full property information (name, description, location)
- Pricing fields (sale price, initial bid, current bid)
- Area measurements (total, built)
- Property features (bedrooms, bathrooms, parking)
- Media (photos array, video URL)
- Geographic data (zone, coordinates)
- Status flags (featured, active)
- Auto-generated slug for URLs

### Security (RLS)
- Public users can view active (published) sitios
- Authenticated users can manage their own sitios
- Full CRUD operations protected by user ownership

### Performance
- Indexed on: user_id, preco, zona, destaque, slug
- Auto-updating timestamps
- Automatic slug generation from property name

## 🎉 After Migration

Test the integration:
1. Visit `/meus-anuncios` page
2. Check if sitios are loaded
3. Try creating a new sitio property
4. Verify delete functionality works

## 🆘 Troubleshooting

### Error: "relation already exists"
The table is already created. No action needed!

### Error: "permission denied"
Make sure you're using a service_role key or admin account in Supabase Dashboard.

### Error: "function update_updated_at() does not exist"
Run this first to create the helper function:

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Then re-run the sitios migration.
