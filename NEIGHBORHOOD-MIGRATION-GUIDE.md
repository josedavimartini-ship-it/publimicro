# Neighborhood Data Migration Guide

## Quick Start - Run the Migration

To enable neighborhood features (POI distances, infrastructure info), you need to run the database migration.

### Option 1: Supabase Dashboard (Recommended - 2 minutes)

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc/sql/new
   - Or navigate: Project > SQL Editor > New Query

2. **Copy & Paste Migration SQL:**
   - Open file: `supabase/migrations/20250105000001_add_neighborhood_data.sql`
   - Copy ALL contents (169 lines)
   - Paste into SQL Editor

3. **Run the Migration:**
   - Click "Run" or press `Ctrl+Enter`
   - Wait for success message (~5-10 seconds)

4. **Verify:**
   ```sql
   SELECT COUNT(*) FROM public.neighborhood_data;
   ```
   Should return some records (properties with sample neighborhood data)

5. **Enable Features:**
   - Features will auto-activate once table exists
   - Neighborhood filters in search will start working
   - POI distances will display on property pages

### Option 2: Supabase CLI (For Developers)

```powershell
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref irrzpwzyqcubhhjeuakc

# Run migration
supabase db push
```

### Option 3: Direct Database Connection

If you have PostgreSQL client tools installed:

```powershell
$env:DATABASE_URL = "postgresql://postgres.irrzpwzyqcubhhjeuakc:P16r8C3_q7%40@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
psql $env:DATABASE_URL -f supabase/migrations/20250105000001_add_neighborhood_data.sql
```

## What This Migration Does

### Creates Table: `neighborhood_data`

Stores Points of Interest (POI) data for each property:

**Healthcare:**
- Hospital name & distance
- Clinic name & distance

**Education:**
- School name & distance  
- University name & distance

**Shopping & Services:**
- Supermarket, pharmacy, gas station, bank (names & distances)

**Infrastructure:**
- Road condition (paved/gravel/dirt/mixed)
- Road quality (excellent/good/fair/poor)
- Public transport availability & distance

**Connectivity:**
- Internet type (fiber/cable/satellite/4G/5G/none)
- Internet speed (Mbps)
- Mobile signal quality

**Utilities:**
- Electricity availability
- Water source (public/well/river/cistern/truck)
- Sewage system (public/septic/none)

**Location:**
- Urban/rural classification
- Distance to city center
- Nearest city name

### Sample Data

Migration automatically inserts sample data for existing Carcará properties with:
- Hospital: 8.5 km away
- School: 3.2 km away
- Supermarket: 4.7 km away
- Fiber internet: 100 Mbps
- Paved roads in good condition

## Features Unlocked After Migration

### 1. Search Filters (Already Integrated)
- Filter by max hospital distance (5/10/20 km)
- Filter by max school distance (5/10/15 km)
- Filter by internet type (fiber/cable/4G/5G)
- Filter by road condition (paved/gravel/dirt)

### 2. Property Detail Pages
- "Vizinhança" section showing nearby POIs
- Color-coded distance badges (green/blue/yellow/orange)
- Infrastructure quality indicators

### 3. Map View
- Properties with better infrastructure highlighted
- Filter properties by amenities on map

## Troubleshooting

### Migration Fails with "relation already exists"
Table was already created. Safe to ignore - features are already enabled.

### No sample data showing
Run this to check:
```sql
SELECT * FROM public.neighborhood_data LIMIT 5;
```

If empty, insert sample data:
```sql
INSERT INTO public.neighborhood_data (property_id, nearest_hospital_distance_km, internet_type)
SELECT id, 8.5, 'fiber' FROM public.properties LIMIT 10;
```

### Features not working after migration
1. Clear browser cache
2. Rebuild app: `pnpm turbo build --filter=@publimicro/publimicro`
3. Check browser console for errors

## Next Steps After Migration

1. **Add Real POI Data:**
   - Integrate with Google Places API / OpenStreetMap
   - Calculate real distances using Haversine formula (already implemented in `distanceUtils.ts`)

2. **Bulk Update Properties:**
   ```javascript
   // Example: Update all properties with geocoding
   const properties = await supabase.from('properties').select('*');
   for (const property of properties) {
     const poiData = await geocodeAndFindPOIs(property.coordinates);
     await supabase.from('neighborhood_data').upsert({
       property_id: property.id,
       ...poiData
     });
   }
   ```

3. **Enable User Reports:**
   - Allow users to report/verify POI data
   - Update `data_quality` field to 'user_reported'

## Files Modified for Neighborhood Features

- ✅ `supabase/migrations/20250105000001_add_neighborhood_data.sql` - Database schema
- ✅ `apps/publimicro/src/lib/distanceUtils.ts` - Distance calculations
- ✅ `apps/publimicro/src/components/NeighborhoodInfo.tsx` - POI display
- ✅ `apps/publimicro/src/components/SearchBar.tsx` - Filters (desktop + mobile)
- ✅ `apps/publimicro/src/app/projetos/carcara/page.tsx` - Shows neighborhood data

All features are ready - just need the migration to run! 🚀
