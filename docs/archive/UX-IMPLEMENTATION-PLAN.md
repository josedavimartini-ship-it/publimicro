# UX Implementation Plan - PubliMicro

## ✅ Completed Features

### 1. Search & Filters System
- ✅ **SearchBar Component** (`src/components/SearchBar.tsx`)
  - Autocomplete search with live results
  - Price range slider (R$ 0 - R$ 10M)
  - Area range slider (0 - 1000 ha)
  - Location dropdown with preset cities
  - Sort options (relevance, price, area, newest)
  - Active filters counter badge
  - Collapsible filters panel
  - Real-time search as you type

- ✅ **Search Results Page** (`src/app/buscar/page.tsx`)
  - Dedicated search page with full results
  - Grid layout with property cards
  - Loading skeletons
  - Empty state with reset filters button
  - Results count display

- ✅ **Properties Listing Page** (`src/app/imoveis/page.tsx`)
  - Integrated SearchBar component
  - Grid/List view toggle
  - Favorite button on cards
  - Price and lance_inicial display
  - Area and location info
  - Loading states with skeletons
  - Empty state handling

- ✅ **Homepage Integration** (`src/app/page.tsx`)
  - SearchBar featured in hero section
  - Prominent placement above Sítios Carcará

## 🎨 High Priority UX Improvements (Next)

### 2. Color Audit & Replacement
**Status**: In Progress  
**Estimated Time**: 1-2 hours  
**Files to Update**: 30+ files identified in UX-AUDIT.md

#### White Color Replacements
- `text-white` → `text-[#0a0a0a]` (on light backgrounds) or `text-[#D4A574]` (on dark backgrounds)
- `bg-white` → `bg-[#1a1a1a]` with `border-2 border-[#2a2a1a]`
- Exception: Keep white on images and external logos

#### Blue Color Replacements
- `text-blue-500/600/700` → `text-[#8B9B6E]` or `text-[#D4A574]`
- `bg-blue-500` → `bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]`
- `hover:text-blue-600` → `hover:text-[#FF6B35]`
- `border-blue-500` → `border-[#FF6B35]`

#### Priority Files List (from grep_search)
1. **Components**
   - `src/components/FavoritesButton.tsx` - text-white on buttons
   - `src/components/WhatsAppButton.tsx` - text-white
   - `src/components/Navbar.tsx` - hover:text-blue-600
   - `home/FeaturedProperties.tsx` - text-blue-600, bg-white cards

2. **Pages**
   - `src/app/conta/page.tsx` - bg-blue-500 button
   - `src/app/contato/page.tsx` - text-white elements
   - `src/app/projetos/carcara/page.tsx` - text-blue-500 water icon, text-white
   - `src/app/imoveis/page.tsx` - bg-white cards (UPDATED ✅)

3. **Cards & UI Elements**
   - `SectionCard.tsx` - bg-white
   - `SiteCard.tsx` - bg-white
   - `ContactForm.tsx` - bg-white
   - `PropertyCard.tsx` - white elements

### 3. Loading States Enhancement
**Status**: Not Started  
**Estimated Time**: 1 hour  
**Priority**: High

#### Implement Loading Skeletons
- Replace "Carregando..." text with animated skeletons
- Property cards skeleton (already done in search ✅)
- Map loading skeleton
- Stats/dashboard skeleton
- Form submission loading states

#### Skeleton Component
```tsx
// Create reusable Skeleton component
<div className="animate-pulse">
  <div className="h-4 bg-[#2a2a1a] rounded"></div>
</div>
```

### 4. Schedule Visit Flow Fix
**Status**: Not Started  
**Estimated Time**: 30 minutes  
**Priority**: High

#### Current Issue
- Shows browser alert() instead of modal
- Poor UX and not consistent with design

#### Solution
- Remove alert() call
- Open VisitScheduler modal directly
- Pre-fill propertyId and propertyTitle
- Show success confirmation after scheduling
- Add to calendar button in confirmation

### 5. Breadcrumbs Navigation
**Status**: Not Started  
**Estimated Time**: 1 hour  
**Priority**: Medium

#### Implementation
- Create Breadcrumbs component
- Add to all pages except homepage
- Dynamic path generation
- Example: Home > PubliProper > Sítios Carcará > Surucuá

```tsx
// Breadcrumbs.tsx
<nav className="flex items-center gap-2 text-sm">
  <Link href="/" className="text-[#8B9B6E] hover:text-[#FF6B35]">Home</Link>
  <ChevronRight className="w-4 h-4 text-[#676767]" />
  <Link href="/proper" className="text-[#8B9B6E] hover:text-[#FF6B35]">PubliProper</Link>
  <ChevronRight className="w-4 h-4 text-[#676767]" />
  <span className="text-[#D4A574]">Sítios Carcará</span>
</nav>
```

### 6. Back to Top Button
**Status**: Not Started  
**Estimated Time**: 30 minutes  
**Priority**: Medium

#### Features
- Fixed position bottom-right
- Show when scrolled > 500px
- Smooth scroll to top
- Fade in/out animation
- Uses ArrowUp icon from lucide-react

```tsx
// BackToTop.tsx
const [showButton, setShowButton] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowButton(window.scrollY > 500);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### 7. Highest Bid Display on Property Cards
**Status**: Not Started  
**Estimated Time**: 1 hour  
**Priority**: Medium

#### Implementation
- Fetch highest bid for each property in listings
- Display with 🔥 emoji if bid > lance_inicial
- Show "Sem lances" if no bids yet
- Update in real-time when new bid submitted

```tsx
// Add to property card query
const { data: bids } = await supabase
  .from("bids")
  .select("bid_amount")
  .eq("property_id", property.id)
  .order("bid_amount", { ascending: false })
  .limit(1);

const highestBid = bids?.[0]?.bid_amount;
```

## 🎯 Medium Priority Features

### 8. Property Comparison Tool
**Estimated Time**: 3 hours

#### Features
- Select up to 3 properties to compare
- Side-by-side comparison table
- Compare: price, area, location, amenities, bids
- Sticky header on scroll
- Export comparison as PDF

### 9. Saved Searches
**Estimated Time**: 2 hours

#### Features
- Save filter combinations
- Email alerts for new matching properties
- Manage saved searches in account page
- One-click reload saved search

### 10. Analytics Dashboard (Public)
**Estimated Time**: 2 hours

#### Display
- Average property price by region
- Most viewed properties
- Recent activity timeline
- Market trends chart

### 11. Virtual Tours Badge
**Estimated Time**: 1 hour

#### Features
- Badge on cards with virtual tours
- "🌐 Tour Virtual Disponível"
- Filter by properties with tours
- Prominent display on property page

### 12. Mortgage Calculator
**Estimated Time**: 2 hours

#### Features
- Down payment slider
- Interest rate input
- Loan term selector (12-360 months)
- Monthly payment calculation
- Total interest display
- Amortization table

## 🔧 Low Priority Enhancements

### 13. Accessibility Improvements
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader optimization
- High contrast mode toggle
- Focus indicators with palette colors

### 14. Mobile Optimizations
- Touch-friendly button sizes (min 44x44px)
- Mobile-first responsive design
- Swipe gestures for image galleries
- Bottom sheet modals for filters on mobile

### 15. Performance Optimizations
- Image lazy loading (Next.js Image component)
- Code splitting for routes
- Prefetch links on hover
- Cache Supabase queries
- Optimize bundle size

### 16. Social Features
- Share property to WhatsApp, Facebook, Twitter
- QR code for property
- Embed property card on external sites
- Social proof: "X pessoas visualizaram"

## 📊 Implementation Timeline

### Week 1
- ✅ Search & Filters System (Completed)
- 🔄 Color Audit (Day 1-2)
- Loading Skeletons (Day 3)
- Schedule Visit Fix (Day 4)
- Breadcrumbs (Day 5)

### Week 2
- Back to Top Button (Day 1)
- Highest Bid on Cards (Day 2-3)
- Property Comparison (Day 4-5)

### Week 3
- Saved Searches (Day 1-2)
- Analytics Dashboard (Day 3-4)
- Virtual Tours Badge (Day 5)

### Week 4
- Mortgage Calculator (Day 1-2)
- Accessibility Improvements (Day 3-4)
- Mobile Optimizations (Day 5)

## 🎨 Design System Reference

### Colors
- Primary Gold: `#D4A574`
- Secondary Moss: `#8B9B6E`
- Accent Orange: `#FF6B35`
- Bronze: `#B7791F`
- Purple Gradient: `from-[#4A148C] to-[#6A1B9A]`
- Background Dark: `#0a0a0a`
- Background Medium: `#1a1a1a`
- Border: `#2a2a1a`
- Text Secondary: `#676767`

### Spacing
- Section padding: `py-12` to `py-20`
- Card padding: `p-6` to `p-8`
- Gap between elements: `gap-4` to `gap-6`

### Border Radius
- Small: `rounded-lg` (8px)
- Medium: `rounded-xl` (12px)
- Large: `rounded-2xl` (16px)
- Extra Large: `rounded-3xl` (24px)
- Full: `rounded-full`

### Transitions
- Default: `transition-all duration-300`
- Hover scale: `hover:scale-105`
- Transform: `transition-transform duration-700`

### Shadows
- Small: `shadow-lg`
- Medium: `shadow-xl`
- Large: `shadow-2xl`
- Hover: `hover:shadow-2xl`

## 📈 Success Metrics

### User Engagement
- Search usage rate
- Filter application frequency
- Time on property pages
- Property comparison usage
- Saved searches created

### Performance
- Page load time < 2s
- Time to interactive < 3s
- Search results < 500ms
- Lighthouse score > 90

### Conversion
- Property inquiry rate
- Bid submission rate
- Contact form completion rate
- Property favorites added

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation success
- Screen reader compatibility
- Color contrast ratio > 4.5:1

## 🚀 Next Steps

1. **Complete Color Audit** (In Progress)
   - Update all 30+ files with white/blue colors
   - Test visual consistency
   - Update screenshots/documentation

2. **Implement Loading Skeletons**
   - Create reusable Skeleton component
   - Replace all "Carregando..." text
   - Add to map, forms, cards

3. **Fix Schedule Visit Flow**
   - Remove alert() calls
   - Integrate VisitScheduler modal
   - Add confirmation screen

4. **Add Breadcrumbs**
   - Create component
   - Integrate on all pages
   - Test navigation flow

5. **Continue with Medium Priority**
   - Back to Top button
   - Highest bid on cards
   - Property comparison tool

## 📝 Notes

- All new components follow established color palette
- No white or blue colors in new code
- Loading states mandatory for all async operations
- Accessibility considerations in all new features
- Mobile-first responsive design
- Performance monitoring throughout implementation
