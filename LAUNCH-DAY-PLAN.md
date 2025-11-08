# 🚀 AcheMe Launch Day - Implementation Plan
**Date**: November 7, 2025
**Objective**: Complete production-ready launch with all systems operational

## 🎯 Critical Path (Must Complete Today)

### Phase 1: Brand Consolidation (30 min)
- [ ] Replace all "PubliMicro" text with "AcheMe" across UI
- [ ] Update manifest.json branding
- [ ] Update meta tags and SEO
- [ ] Verify EmuLogo is used everywhere
- [ ] Check favicon and PWA icons

### Phase 2: Fazenda Carcará - 6 Ranch Setup (90 min)
**Ranch Names & IDs:**
1. **Buriti** (buriti) - R$ 350.000
2. **Cedro** (cedro) - R$ 375.000  
3. **Ipê** (ipe) - R$ 385.000
4. **Jatobá** (jatoba) - R$ 360.000
5. **Pequi** (pequi) - R$ 370.000
6. **Sucupira** (sucupira) - R$ 380.000

**Each Ranch Needs:**
- ✅ Database entry in `properties` table
- ✅ 8-12 high-quality photos in Supabase Storage
- ✅ Complete location data (Buriti Alegre, GO, Lago das Brisas)
- ✅ Accurate measurements (2 hectares = 20,000 m²)
- ✅ Amenities (water, electricity, road access)
- ✅ Nearby facilities (schools, hospitals, stores with distances)
- ✅ Compelling descriptions highlighting unique features
- ✅ KML boundary data (already have coordinates)
- ✅ Linked to "Sítios Carcará" project

**Photo Requirements:**
- Aerial views
- Entrance/gate
- Internal roads
- Water access
- Vegetation/trees
- Nearby lake views
- Sunset/landscape shots
- Infrastructure (if any)

### Phase 3: Ranch Distribution Across Platform (60 min)
**Display Locations:**

1. **Home Page** (`apps/publimicro/src/app/page.tsx`)
   - ✅ Highlight section with 6 ranches
   - ✅ "Sítios Carcará" featured banner
   - ✅ Map showing all locations
   - ✅ Quick access buttons

2. **Sítios Carcará Landing** (`apps/publimicro/src/app/projetos/carcara/page.tsx`)
   - ✅ All 6 ranches with full details
   - ✅ Interactive map with KML boundaries
   - ✅ Comparison feature
   - ✅ "Agendar Visita" button on each
   - ✅ "Fazer Proposta" button on each

3. **AcheMeRuralPropers** (`apps/proper/src/app/page.tsx`)
   - ✅ Show in search results
   - ✅ Filter by location (Buriti Alegre)
   - ✅ Sort by price
   - ✅ Featured property badges

### Phase 4: Visit Scheduling System (45 min)
**Current State Audit:**
- Check `VisitScheduler` component functionality
- Verify Supabase `visit_requests` table
- Test photo upload to `visit-photos` storage bucket
- Verify RLS policies

**Fixes Needed:**
- ✅ Calendar integration (date picker)
- ✅ Time slot selection (morning/afternoon/evening)
- ✅ Contact form (name, phone, email)
- ✅ Photo upload for ID verification
- ✅ Confirmation email/notification
- ✅ Admin view of scheduled visits

**Button Locations:**
- Property detail pages
- Carcará project page
- Property cards (on hover/click)

### Phase 5: Proposal System (45 min)
**Current State Audit:**
- Check `ProposalModal` component
- Verify `property_proposals` table
- Test bid submission flow
- Check seller notifications

**Fixes Needed:**
- ✅ Price validation (must be >= minimum)
- ✅ User authentication check
- ✅ Proposal history tracking
- ✅ Counter-offer system
- ✅ Status updates (pending/accepted/rejected)
- ✅ Notification system

**Button Locations:**
- Property detail pages
- Carcará project page
- Comparison page

### Phase 6: Enhanced Property Details (60 min)
**For Each Ranch:**

**Location Intelligence:**
- 📍 Exact address: Lago das Brisas, Buriti Alegre, GO
- 🏥 Nearest hospital: 15km (Buriti Alegre city center)
- 🏫 Nearest school: 12km (Escola Municipal)
- 🛒 Nearest supermarket: 14km (Supermercado São José)
- ⛽ Gas station: 13km
- 🏦 Bank: 15km
- 🚑 Emergency services: 15km
- 📡 Internet: 4G/5G coverage, fiber optic available

**Amenities:**
- ✅ Paved road access (last 2km gravel)
- ✅ Electricity available
- ✅ Water well potential (water table at 40m)
- ✅ Lake access within 1km
- ✅ Forest preservation area
- ✅ Flat terrain (perfect for construction)
- ✅ Property boundaries defined
- ✅ Clean title deed

**Descriptions:**
Each ranch should have:
- **Hero Description** (2-3 sentences): Emotional hook
- **Technical Details** (bullet points): Size, access, utilities
- **Lifestyle Benefits** (paragraph): What living here offers
- **Investment Potential** (paragraph): Why it's a good buy
- **Unique Features** (bullets): What makes THIS ranch special

### Phase 7: Search & Filter System (90 min)
**Search Engine Requirements:**

**Global Search Bar** (Top Nav):
- ✅ Autocomplete suggestions
- ✅ Recent searches
- ✅ Category filtering
- ✅ Location-based results
- ✅ Price range quick filters

**Advanced Filters** (Sidebar/Modal):
- **Price**: Min/Max slider
- **Size**: Hectares range
- **Location**: State > City > District dropdown
- **Property Type**: Sitio, Fazenda, Chácara, Lote
- **Amenities**: Checkboxes (water, electricity, paved road, etc.)
- **Distance from facilities**: Hospital, school, store (5/10/20km)
- **Internet availability**: Fiber/4G/5G
- **Transaction type**: Buy/Rent
- **Status**: Active/Sold/Reserved

**Sort Options:**
- Relevance (default)
- Price: Low to High
- Price: High to Low
- Newest first
- Size: Smallest to Largest
- Size: Largest to Smallest
- Distance (if location selected)

**Map Integration:**
- ✅ Properties shown as pins
- ✅ Click pin → property card preview
- ✅ Draw search radius on map
- ✅ Filter properties in view
- ✅ Cluster markers when zoomed out

### Phase 8: Authentication & User Flow (60 min)
**Login/Signup:**
- ✅ Email/password authentication
- ✅ Google OAuth
- ✅ Facebook OAuth (optional)
- ✅ Remember me checkbox
- ✅ Password strength indicator
- ✅ Email verification flow
- ✅ Redirect after login

**Password Reset:**
- ✅ "Forgot password" link
- ✅ Email with reset link
- ✅ Secure token expiration (24h)
- ✅ Password reset confirmation

**Session Management:**
- ✅ Persistent sessions (30 days)
- ✅ Auto-logout on inactivity (disabled for UX)
- ✅ Session refresh on activity
- ✅ Logout button in account menu

**Protected Routes:**
- `/conta` - Account dashboard
- `/favoritos` - Saved properties
- `/propostas` - My proposals
- `/visitas` - Scheduled visits
- `/anunciar` - Create listing
- `/assinatura` - Subscriptions
- `/verificacao` - Verification

**User Flow:**
```
Landing → Browse → Like Property → Click "Fazer Proposta"
  ↓
Not logged in? → Redirect to /entrar with ?redirect=/property/[id]
  ↓
Login/Signup → Redirect back to property
  ↓
Complete Profile (if needed) → Submit Proposal
  ↓
Verification Required? → /verificacao → Complete wizard
  ↓
Premium Feature? → /assinatura → Choose plan → Stripe checkout
  ↓
Success → Feature unlocked → Continue with action
```

### Phase 9: UI/UX Polish (90 min)
**Visual Consistency:**
- ✅ All buttons use brand colors (bronze, copper, gold, moss)
- ✅ No white or bright blue anywhere
- ✅ Dark backgrounds (#0a0a0a, #0d0d0d)
- ✅ Consistent hover states (scale 105%, glow effect)
- ✅ Smooth transitions (300ms cubic-bezier)
- ✅ Loading skeletons for all async content
- ✅ Error states with retry buttons
- ✅ Empty states with helpful CTAs

**Responsive Design:**
- ✅ Mobile-first approach
- ✅ Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- ✅ Touch-friendly buttons (min 44px height)
- ✅ Swipeable galleries on mobile
- ✅ Collapsible filters on mobile
- ✅ Bottom navigation on mobile
- ✅ Hamburger menu on mobile

**Performance:**
- ✅ Images lazy-loaded
- ✅ Next.js Image component everywhere
- ✅ Code splitting per route
- ✅ Prefetching on hover
- ✅ Cached API responses
- ✅ Optimistic UI updates

**Accessibility:**
- ✅ Semantic HTML
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ Alt text on all images
- ✅ Color contrast ratio > 4.5:1

### Phase 10: Payment Integration (30 min)
**Verification → Subscription → Payment Flow:**

1. **User clicks premium feature** (e.g., "Destacar Anúncio")
2. **Check verification status** (`/api/verification/status`)
   - Not verified → Redirect to `/verificacao`
   - Verified → Continue
3. **Check subscription** (`/api/subscriptions/current`)
   - No active subscription → Redirect to `/assinatura`
   - Active but tier insufficient → Show upgrade modal
4. **Create checkout session** (`/api/checkout/create-session`)
   - Includes verification check (403 if not verified)
   - Creates Stripe session
   - Returns checkout URL
5. **Redirect to Stripe Checkout**
   - User completes payment
   - Stripe redirects to `/assinatura/sucesso`
6. **Webhook processes payment** (`/api/webhooks/stripe`)
   - Creates subscription record
   - Unlocks premium features
   - Sends confirmation email
7. **User accesses premium features**

**Testing Checklist:**
- [ ] Unverified user blocked from checkout
- [ ] Verified user can access checkout
- [ ] Payment succeeds → subscription created
- [ ] Payment fails → user notified
- [ ] Webhook processes correctly
- [ ] Features unlock immediately
- [ ] Confirmation email sent

## 📸 Photo Upload Strategy

### Supabase Storage Setup:
**Buckets:**
1. `property-photos` (public) - Property listings
2. `verification-documents` (private) - ID verification
3. `visit-photos` (private) - Visit request attachments

**Upload Flow:**
```typescript
// Client-side
const upload = async (file: File, bucket: string, folder: string) => {
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return publicUrl;
};
```

## 🎨 Branding Consistency

### Replace All Instances:
```bash
# Find all "PubliMicro" references
find . -type f -name "*.tsx" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | xargs grep -l "PubliMicro"

# Replace with "AcheMe" (manual review recommended)
```

**Key Files:**
- `apps/publimicro/public/manifest.json`
- `apps/publimicro/src/app/layout.tsx`
- `packages/ui/src/components/TopNav.tsx`
- `apps/publimicro/src/components/TopNavWithAuth.tsx`
- All README files
- All meta tags

### Logo Usage:
- **Primary**: `EmuLogo` component (Emu with binoculars)
- **Compact**: `AchemeLogo` component (magnifying glass version)
- **Favicon**: SVG version of Emu head
- **PWA Icons**: Full Emu logo with transparent background

## ⚙️ Database Insertions for 6 Ranches

```sql
-- Insert Sítio Buriti
INSERT INTO properties (
  id, title, description, location, price, area_total, 
  bedrooms, bathrooms, property_type, transaction_type,
  status, published_at, featured, projeto, fotos,
  latitude, longitude, amenities, nearby_facilities
) VALUES (
  'buriti',
  'Sítio Buriti - Lago das Brisas',
  'Sitio de 2 hectares com acesso privilegiado ao Lago das Brisas. Terreno plano, ideal para construção de casa de campo ou investimento. Localizado em área de preservação ambiental, com fauna e flora exuberantes.',
  'Lago das Brisas, Buriti Alegre, GO',
  350000,
  20000, -- 2 hectares in m²
  0, 0, 'rural', 'sale',
  'active', NOW(), true, 'Sítios Carcará',
  ARRAY[
    'https://your-supabase-url/storage/v1/object/public/property-photos/buriti/aerial.jpg',
    'https://your-supabase-url/storage/v1/object/public/property-photos/buriti/entrance.jpg',
    -- Add more photos
  ],
  -18.279131, -48.830966, -- Coordinates from KML
  jsonb_build_object(
    'water_access', true,
    'electricity', true,
    'paved_road', false,
    'gravel_road', true,
    'internet_4g', true,
    'internet_fiber_available', true
  ),
  jsonb_build_object(
    'hospital_distance_km', 15,
    'school_distance_km', 12,
    'supermarket_distance_km', 14,
    'gas_station_distance_km', 13
  )
);

-- Repeat for: cedro, ipe, jatoba, pequi, sucupira
-- Each with unique coordinates from KML data
```

## 🚦 Launch Checklist

### Pre-Launch (Today):
- [ ] All 6 ranches in database with photos
- [ ] Home page displays ranches correctly
- [ ] Carcará landing page fully functional
- [ ] Visit scheduling works end-to-end
- [ ] Proposal system accepts bids
- [ ] Search filters all properties
- [ ] Map shows correct locations
- [ ] Auth flow seamless
- [ ] Payment flow tested
- [ ] Mobile responsive
- [ ] All "PubliMicro" → "AcheMe"

### Post-Launch (Week 1):
- [ ] Monitor error logs
- [ ] Track user signups
- [ ] Analyze search queries
- [ ] Review visit requests
- [ ] Check proposal submissions
- [ ] Optimize slow queries
- [ ] Fix reported bugs
- [ ] Add missing features

### Marketing (Ongoing):
- [ ] Social media posts
- [ ] Google Ads campaign
- [ ] Facebook Ads
- [ ] Local real estate groups
- [ ] Email newsletter
- [ ] Blog content
- [ ] Video tours

## 🎯 Success Metrics

**Day 1:**
- 100+ unique visitors
- 10+ signups
- 5+ property views
- 1+ visit request

**Week 1:**
- 1,000+ unique visitors
- 100+ signups
- 50+ property views
- 10+ visit requests
- 3+ proposals

**Month 1:**
- 10,000+ unique visitors
- 1,000+ signups
- 500+ property views
- 50+ visit requests
- 10+ proposals
- 1+ sale

---

**Let's ship it! 🚀**
