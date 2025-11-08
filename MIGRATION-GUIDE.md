# Quick Migration Guide

## Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your **PubliMicro** project
3. Click **SQL Editor** in left sidebar
4. Click **New Query** button

## Step 2: Copy Migration File

Open the migration file:
```
c:\projetos\publimicro\supabase\migrations\20251107000003_pending_verifications_system.sql
```

Copy **ENTIRE CONTENTS** (Ctrl+A, Ctrl+C)

## Step 3: Paste and Run

1. Paste into SQL Editor (Ctrl+V)
2. Click **RUN** button (bottom right)
3. Wait for "Success. No rows returned" message

## What This Migration Does

✅ Creates `pending_verifications` table  
✅ Adds guest fields to `visits` table  
✅ Adds bid tracking to `properties` and `sitios` tables  
✅ Creates `update_property_bid_stats()` trigger  
✅ Sets up RLS policies  

## Expected Result

```
Success. No rows returned
```

If you see this, the migration ran successfully! ✅

## Troubleshooting

### Error: "relation already exists"
**Solution:** Migration already ran. Skip to next step.

### Error: "permission denied"
**Solution:** Make sure you're using the **service_role** key or running from Supabase Dashboard.

### Error: "column does not exist"
**Solution:** Make sure migration `20251107000002_add_verification_fields.sql` ran first.

## Verification

After running, verify tables exist:

```sql
-- Check pending_verifications table
SELECT COUNT(*) FROM pending_verifications;

-- Check visits table has new columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'visits' 
AND column_name IN ('guest_cpf', 'guest_birth_date', 'verification_pending_id');

-- Check properties table has bid tracking
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN ('expected_value', 'current_highest_bid', 'total_bids_count');
```

All queries should return results! ✅

---

## Next Steps After Migration

1. ✅ Migration complete
2. 🧪 Test guest visit scheduling
3. 🧪 Test background check APIs
4. 🎨 Continue color transformation
5. 📊 Update property cards with bid info
6. 🛠️ Create admin verification dashboard

See `NEW-VERIFICATION-ECOSYSTEM.md` for complete implementation guide.
