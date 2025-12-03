# 🧪 PubliMicro Testing Guide

Complete testing checklist for the PubliMicro platform covering all features.

**Last Updated:** December 2, 2025

---

## 🏃 Quick Testing (5 minutes)

Run after any changes to verify basic functionality:

```powershell
# 1. Type check
pnpm type-check

# 2. Build
pnpm turbo build --filter=@publimicro/publimicro

# 3. Run locally
pnpm dev:publimicro
```

Open http://localhost:3000 and verify:
- [ ] Home page loads
- [ ] Navigation works
- [ ] No console errors (F12)

---

## 📱 Feature Testing Checklist

### Home Page
- [ ] TopNav displays correctly
- [ ] Hero section loads
- [ ] CarcaraHighlights component shows featured properties
- [ ] Category sections visible
- [ ] Footer displays
- [ ] Floating WhatsApp button appears

### Navigation
- [ ] All TopNav links work
- [ ] Mobile menu opens/closes
- [ ] Breadcrumbs show on inner pages
- [ ] Back button returns to previous page

### Property Listings (`/imoveis`)
- [ ] Property cards display
- [ ] Images load correctly
- [ ] Price formatting correct (R$)
- [ ] Click navigates to detail page
- [ ] Pagination/infinite scroll works

### Property Detail (`/imoveis/[id]`)
- [ ] All property info displays
- [ ] Image gallery works
- [ ] Map shows location
- [ ] "Agendar Visita" button works
- [ ] "Fazer Proposta" button works
- [ ] Share button works
- [ ] Favorite button works (when logged in)

### Search (`/buscar`)
- [ ] Search input accepts text
- [ ] Results update on search
- [ ] Filters work (price, location, type)
- [ ] Clear filters resets results
- [ ] No results message shows when appropriate

### Authentication
- [ ] Login page loads (`/entrar`)
- [ ] Email login works
- [ ] Google OAuth works (if configured)
- [ ] Sign up creates account
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Redirect parameter works after login

### User Account (`/conta`)
- [ ] Profile info displays
- [ ] Can edit profile
- [ ] My listings tab shows user's listings
- [ ] Favorites tab shows favorited items
- [ ] Visits tab shows scheduled visits
- [ ] Proposals tab shows sent proposals

### Favorites (`/favoritos`)
- [ ] Can add property to favorites
- [ ] Can remove from favorites
- [ ] Favorites persist after refresh
- [ ] Folder organization works

### Proposals & Visits
- [ ] Visit scheduler opens modal
- [ ] Can select date/time
- [ ] Visit request submits
- [ ] Proposal modal opens
- [ ] Bid validation works (minimum amount)
- [ ] Proposal submits successfully

### Classified Ads (`/classificados`)
- [ ] Categories display
- [ ] Listings load
- [ ] Can filter by category
- [ ] Post new ad works (when logged in)

### Payments (Stripe)
- [ ] Checkout redirects to Stripe
- [ ] Test payment succeeds
- [ ] Success page shows after payment
- [ ] Cancel returns to site

---

## 📲 Mobile Testing

### Responsive Breakpoints
Test at these widths:
- **Mobile:** 375px (iPhone SE)
- **Mobile Large:** 428px (iPhone 14 Pro Max)
- **Tablet:** 768px (iPad)
- **Desktop:** 1024px+

### Mobile-Specific Tests
- [ ] Touch targets ≥44px
- [ ] Text readable without zoom
- [ ] Forms usable on mobile
- [ ] Modal scrolls on small screens
- [ ] Navigation menu closes on link click
- [ ] Images don't overflow
- [ ] Horizontal scroll doesn't appear

### Device Testing
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] iOS Chrome
- [ ] Android Firefox

---

## ♿ Accessibility Testing

### Keyboard Navigation
- [ ] Can Tab through all interactive elements
- [ ] Focus visible on all elements
- [ ] Can operate dropdowns with keyboard
- [ ] Can close modals with Escape
- [ ] Skip link jumps to main content

### Screen Reader
- [ ] Images have alt text
- [ ] Buttons have labels
- [ ] Form inputs have labels
- [ ] Error messages announced
- [ ] Page title updates on navigation

### Color Contrast
- [ ] Text meets 4.5:1 ratio
- [ ] UI components meet 3:1 ratio
- [ ] Links distinguishable from text

### Tools
```powershell
# Lighthouse audit
# In Chrome DevTools → Lighthouse → Generate report

# axe DevTools extension
# Install from Chrome Web Store, run in DevTools
```

---

## 🔌 API Testing

### Endpoints to Test
| Endpoint | Method | Auth Required |
|----------|--------|---------------|
| `/api/search` | GET | No |
| `/api/categories` | GET | No |
| `/api/proposals` | POST | Yes |
| `/api/visits` | POST | Yes |
| `/api/checkout/create-session` | POST | Yes |

### Testing with Thunder Client (VS Code)
1. Install Thunder Client extension
2. Create requests for each endpoint
3. Set authorization headers for protected routes

---

## 🌐 External Service Testing

### Supabase
- [ ] Can connect to database
- [ ] Auth flows work
- [ ] RLS policies allow correct access
- [ ] Storage buckets accessible

### Stripe
- [ ] Checkout creates session
- [ ] Webhooks received
- [ ] Test payments succeed
- [ ] Products/prices correct

### Email (Resend)
- [ ] Visit confirmation emails send
- [ ] Proposal notification emails send
- [ ] Welcome emails send

---

## 🔄 Integration Testing with ngrok

For testing OAuth, webhooks, and mobile devices:

```powershell
# 1. Start dev server
pnpm dev:publimicro

# 2. Expose with ngrok
ngrok http 3000

# 3. Copy ngrok URL (e.g., https://abc123.ngrok.io)
```

### Update Redirect URLs
Add ngrok URL to:
1. Supabase Auth → URL Configuration → Redirect URLs
2. Stripe Webhooks (for testing)

### Test
- [ ] OAuth login works via ngrok URL
- [ ] Stripe webhooks received
- [ ] Mobile device can access site

---

## 🐛 Debugging

### Common Issues

**Images not loading:**
- Check Supabase Storage bucket permissions
- Verify image URLs in database
- Check Next.js Image component domains in `next.config.ts`

**Auth not working:**
- Clear cookies and localStorage
- Check Supabase project status
- Verify environment variables

**API errors:**
- Check browser Network tab
- Check server logs in terminal
- Verify request body format

### Debug Commands
```powershell
# Check TypeScript errors
pnpm type-check

# Check lint errors
pnpm lint

# View full build output
pnpm turbo build --filter=@publimicro/publimicro --verbose
```

---

## 📊 Performance Testing

### Lighthouse Scores (Target)
- **Performance:** ≥80
- **Accessibility:** ≥90
- **Best Practices:** ≥90
- **SEO:** ≥90

### Core Web Vitals
- **LCP:** <2.5s
- **FID:** <100ms
- **CLS:** <0.1

### Test Command
```powershell
# Build production and analyze
pnpm build

# Serve production build
pnpm start
```

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All type checks pass
- [ ] All lint rules pass
- [ ] Build succeeds
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Authentication works
- [ ] Payments work (test mode)
- [ ] Images load
- [ ] Forms submit
- [ ] Protected routes redirect
- [ ] Environment variables set in Vercel
