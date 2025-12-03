# Fixing Supabase Images in Card Backgrounds

## Issue
Ranch property cards on the Home Page are showing Supabase placeholder images or broken images instead of actual property photos.

## Root Cause
The `sitios` table's `fotos` column contains Supabase Storage URLs that may be:
1. Private (not publicly accessible)
2. Incorrectly formatted
3. Empty or null

## Solution

### Step 1: Check Supabase Storage Bucket Permissions

1. Go to Supabase Dashboard → **Storage**
2. Find the bucket `imagens-sitios` (or the bucket name used for property photos)
3. Click the bucket settings (⚙️ icon)
4. Make sure **Public bucket** is enabled
5. If not enabled, enable it now

### Step 2: Verify Bucket Policies

In Supabase Dashboard → Storage → Policies:

1. Check if there's a policy allowing public SELECT on the bucket
2. If not, add this policy:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'imagens-sitios' );
```

### Step 3: Check Photo URL Format in Database

Run this query in Supabase SQL Editor:

```sql
SELECT id, nome, fotos 
FROM sitios 
WHERE destaque = true 
LIMIT 5;
```

**Expected format for `fotos` column:**
```json
[
  "imagens-sitios/sitio-1-foto-1.jpg",
  "imagens-sitios/sitio-1-foto-2.jpg"
]
```

**OR full URLs:**
```json
[
  "https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/sitio-1.jpg"
]
```

### Step 4: Fix Photo URLs if Needed

If photos are stored as relative paths without the bucket name:

```sql
-- Example: Update to add full paths
UPDATE sitios 
SET fotos = jsonb_build_array(
  'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/' || id || '.jpg'
)
WHERE fotos IS NULL OR jsonb_array_length(fotos) = 0;
```

### Step 5: Add Fallback Images

For properties without photos, add placeholder images:

```sql
UPDATE sitios 
SET fotos = '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"]'::jsonb
WHERE fotos IS NULL 
   OR jsonb_array_length(fotos) = 0;
```

## Code Updates

The home page already has fallback logic (line 368 in page.tsx):

```tsx
const fotoUrl = sitio.fotos && sitio.fotos.length > 0 
  ? sitio.fotos[0] 
  : "/images/fallback-rancho.jpg";
```

### Add Helper Function for Photo URLs

Create a new file: `apps/publimicro/src/lib/photoUtils.ts`

```typescript
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 
  "https://irrzpwzyqcubhhjeuakc.supabase.co";

export function getPhotoUrl(photoPath: string | null | undefined): string {
  if (!photoPath) {
    return "/images/fallback-rancho.jpg";
  }

  // Already a full URL
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }

  // Relative path - construct full URL
  const cleanPath = photoPath.replace(/^\/+/, "");
  
  // Already includes storage path
  if (cleanPath.startsWith("storage/v1/object/public/")) {
    return `${SUPABASE_URL}/${cleanPath}`;
  }

  // Bucket path format: "imagens-sitios/photo.jpg"
  if (cleanPath.includes("/")) {
    return `${SUPABASE_URL}/storage/v1/object/public/${cleanPath}`;
  }

  // Just filename - assume default bucket
  return `${SUPABASE_URL}/storage/v1/object/public/imagens-sitios/${cleanPath}`;
}

export function getFirstPhoto(fotos: string[] | null | undefined): string {
  if (!fotos || fotos.length === 0) {
    return "/images/fallback-rancho.jpg";
  }
  return getPhotoUrl(fotos[0]);
}
```

### Update Home Page to Use Helper

In `apps/publimicro/src/app/page.tsx`:

```typescript
import { getFirstPhoto } from "@/lib/photoUtils";

// Inside the map function (around line 368):
const fotoUrl = getFirstPhoto(sitio.fotos);
```

## Testing

### Test Photo URL Format

In your browser console on the home page:

```javascript
// Check what URLs are being used
document.querySelectorAll('img').forEach(img => {
  if (img.src.includes('supabase')) {
    console.log(img.src);
  }
});
```

### Test Storage Access

Try accessing a photo URL directly in browser:
```
https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg
```

If you get 404 or Access Denied, the bucket is not public.

## Quick Fix: Use Placeholder Images

If you want to quickly test with working images while fixing storage:

```sql
UPDATE sitios 
SET fotos = jsonb_build_array(
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
)
WHERE destaque = true;
```

This will use high-quality Unsplash ranch photos as placeholders.

## Permanent Solution

1. ✅ Enable public bucket in Supabase Storage
2. ✅ Add storage policy for public read access
3. ✅ Upload actual property photos to `imagens-sitios` bucket
4. ✅ Update `sitios.fotos` with correct paths
5. ✅ Use helper function for consistent URL handling
6. ✅ Keep fallback image for properties without photos

## Current Status

✅ Heart icons are already on top-right
✅ OAuth code is correct (needs Supabase Dashboard configuration)
✅ Authentication is centralized
✅ Favorite button redirects properly when not logged in

⚠️ Photo URLs need to be fixed in database or storage permissions
