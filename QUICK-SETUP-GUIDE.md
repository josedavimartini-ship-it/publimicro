# Quick Setup Guide - Bid System & Contact Form

## Step 1: Run SQL Migrations in Supabase

### Option A: Supabase Dashboard (Recommended)
1. Go to https://supabase.com/dashboard
2. Select your project: `publimicro`
3. Click "SQL Editor" in left sidebar
4. Click "New Query"
5. Copy/paste content from `sql/create_bids_table.sql`
6. Click "Run" button
7. Repeat for `sql/create_contacts_table.sql`

### Option B: Using psql or Database URL
```bash
# From project root
cd apps/publimicro

# Run bids table migration
psql YOUR_DATABASE_URL < sql/create_bids_table.sql

# Run contacts table migration
psql YOUR_DATABASE_URL < sql/create_contacts_table.sql
```

## Step 2: Verify Tables Created

In Supabase Dashboard → Table Editor, you should see:
- ✅ `bids` table with 8 columns
- ✅ `contacts` table with 7 columns
- ✅ Indexes on both tables
- ✅ RLS policies enabled

## Step 3: Test the Features

### Test Bidding System
1. Navigate to http://localhost:3000
2. Click on any property card
3. Scroll to "Fazer Lance" section (right sidebar)
4. Make sure you're logged in (if not, click "Enviar Lance" and you'll be redirected to login)
5. Enter a bid amount >= lance_inicial
6. Optionally add a message
7. Click "💰 Enviar Lance"
8. **Expected Result**:
   - Green success message appears
   - Form stays filled with your bid
   - If you refresh, lance_inicial should be updated to your bid (if it was higher)
   - Current highest bid shows with 🔥 emoji

### Test Contact Form
1. Navigate to http://localhost:3000/contato
2. Fill in the form:
   - Nome: Your name
   - Email: your@email.com
   - Telefone: Optional
   - Mensagem: Your message
3. Click "✉️ Enviar solicitação"
4. **Expected Result**:
   - Green checkmark success message
   - Form clears
   - Success message auto-hides after 5 seconds

## Step 4: Verify in Database

### Check Bids
```sql
-- View all bids
SELECT * FROM public.bids ORDER BY created_at DESC;

-- View highest bid per property
SELECT 
  property_id,
  MAX(bid_amount) as highest_bid,
  COUNT(*) as total_bids
FROM public.bids
WHERE status != 'rejected'
GROUP BY property_id;
```

### Check Contacts
```sql
-- View all contacts
SELECT * FROM public.contacts ORDER BY created_at DESC;

-- Count by status
SELECT status, COUNT(*) 
FROM public.contacts 
GROUP BY status;
```

### Verify Trigger Works
```sql
-- Before: Check current lance_inicial for a property
SELECT id, nome, lance_inicial FROM public.sitios LIMIT 1;

-- Insert a higher bid manually (replace UUIDs with actual values)
INSERT INTO public.bids (property_id, user_id, bid_amount, status)
VALUES (
  'YOUR_PROPERTY_ID',
  'YOUR_USER_ID',
  2000000,  -- R$ 2,000,000
  'pending'
);

-- After: Check if lance_inicial was updated automatically
SELECT id, nome, lance_inicial FROM public.sitios WHERE id = 'YOUR_PROPERTY_ID';
-- Should show 2000000
```

## Troubleshooting

### Error: "relation 'bids' does not exist"
- SQL migration didn't run successfully
- Re-run `sql/create_bids_table.sql` in Supabase SQL Editor

### Error: "permission denied for table bids"
- RLS policies not created correctly
- Check in Supabase Dashboard → Authentication → Policies
- Should see 4 policies on `bids` table

### Bid doesn't update lance_inicial
- Trigger might not be created
- Run this query to check:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'trigger_update_lance_inicial';
  ```
- If empty, re-run the CREATE TRIGGER part of the SQL

### Contact form shows error
- Check browser console for specific error
- Verify `contacts` table exists
- Check RLS policies allow INSERT for anon users

## Development Server

Make sure your development server is running:
```bash
cd apps/publimicro
pnpm dev
```

Then navigate to:
- Homepage: http://localhost:3000
- Property detail: http://localhost:3000/imoveis/[property-id]
- Contact: http://localhost:3000/contato

## Files Modified

### New Files
- ✅ `sql/create_bids_table.sql`
- ✅ `sql/create_contacts_table.sql`
- ✅ `BID-SYSTEM-IMPLEMENTATION.md`
- ✅ `QUICK-SETUP-GUIDE.md` (this file)

### Modified Files
- ✅ `apps/publimicro/src/app/imoveis/[id]/page.tsx` - Added bid submission logic
- ✅ `apps/publimicro/src/app/contato/page.tsx` - Added Supabase integration

## Success Checklist

- [ ] SQL migrations run successfully
- [ ] `bids` table visible in Supabase
- [ ] `contacts` table visible in Supabase
- [ ] Bid submission works on property page
- [ ] Highest bid displays correctly
- [ ] lance_inicial updates automatically
- [ ] Contact form submits successfully
- [ ] Success messages appear
- [ ] No console errors

## Next Features to Implement

1. **Admin Panel** - View/manage all bids and contacts
2. **Email Notifications** - Notify property owners of new bids
3. **Bid History** - Show all bids on a property
4. **Counter Offers** - Allow property owners to counter-propose
5. **Bid Expiration** - Auto-reject bids after X days

---

**Need Help?** Check the main documentation: `BID-SYSTEM-IMPLEMENTATION.md`
