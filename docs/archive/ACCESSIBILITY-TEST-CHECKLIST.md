# ♿ Accessibility Testing Checklist

## Automated Testing

### Run Lighthouse Audit
```powershell
# Open Chrome DevTools
# Navigate to: http://localhost:3000
# Lighthouse tab → Generate report
# Target: Accessibility score 95+
```

### Tools to Use
- ✅ Chrome Lighthouse
- ✅ axe DevTools Extension
- ✅ WAVE Browser Extension
- ✅ Contrast Checker

---

## Manual Keyboard Testing

### Navigation Flow
- [ ] Press `Tab` - focus moves forward through interactive elements
- [ ] Press `Shift+Tab` - focus moves backward
- [ ] Press `Enter` or `Space` - activates buttons/links
- [ ] Press `Esc` - closes modals/dropdowns
- [ ] Press `/` or `Ctrl+K` - focuses search bar
- [ ] All focus states are visible (orange 3px outline)

### Interactive Elements to Test
- [ ] Search bar and filters
- [ ] Property cards (click to open)
- [ ] Favorite buttons (Heart icons)
- [ ] Modal dialogs (Visit Scheduler, Proposal)
- [ ] Bottom sheets (mobile filters)
- [ ] Swipe gallery (arrow keys work)
- [ ] Navigation links
- [ ] Form inputs

---

## Screen Reader Testing

### Install Screen Reader
**Windows**: NVDA (Free)
```powershell
# Download from: https://www.nvaccess.org/download/
```

**Mac**: VoiceOver (Built-in)
```
Cmd + F5 to toggle
```

### Test Pages
1. **Homepage**
   - [ ] Page title announced
   - [ ] Skip to content link works
   - [ ] Property cards are labeled correctly
   - [ ] Buttons have descriptive labels

2. **Property Detail Page**
   - [ ] All images have alt text
   - [ ] Gallery navigation is announced
   - [ ] Form labels are associated
   - [ ] Errors are announced

3. **Search & Filters**
   - [ ] Filter labels are clear
   - [ ] Results count is announced
   - [ ] Loading states are announced

---

## Color Contrast Testing

### Check Contrast Ratios (WCAG AA: 4.5:1)
Using: https://webaim.org/resources/contrastchecker/

**Text Colors on Dark Background**:
- [ ] `#E6C98B` on `#0a0a0a` - Should pass ✅
- [ ] `#D4A574` on `#1a1a1a` - Should pass ✅
- [ ] `#8B9B6E` on `#0a0a0a` - Check this
- [ ] `#A8C97F` on `#0a0a0a` - Check this

**Interactive Elements**:
- [ ] Buttons have 3:1 contrast ratio (minimum)
- [ ] Focus indicators are visible
- [ ] Links are distinguishable from text

---

## Verified Accessibility Features

### ✅ Already Implemented
1. **Semantic HTML**
   - Proper heading hierarchy (h1, h2, h3)
   - `<main>`, `<nav>`, `<section>` landmarks
   - Skip to content link

2. **ARIA Labels**
   - FavoritesButton has aria-label
   - Modals have aria-label
   - Form inputs have labels

3. **Keyboard Support**
   - Focus lock in modals (FocusLock)
   - Escape key closes modals
   - Tab navigation works

4. **Visual Indicators**
   - Focus visible: 3px orange outline
   - `:focus-visible` CSS
   - Screen reader only text (`.sr-only`)

5. **Forms**
   - Labels associated with inputs
   - Required fields marked
   - Error messages visible

---

## Accessibility Fixes Needed

### High Priority
1. **Add Role to Image Gallery**
   ```tsx
   <div role="region" aria-label="Property photo gallery">
     <SwipeGallery ... />
   </div>
   ```

2. **Announce Live Regions**
   ```tsx
   <div aria-live="polite" aria-atomic="true">
     {searchResults.length} properties found
   </div>
   ```

3. **Focus Management in Bottom Sheet**
   - Focus first interactive element when opened
   - Return focus to trigger when closed

### Medium Priority
4. **Add Loading Announcements**
   ```tsx
   <div aria-live="assertive" aria-busy={loading}>
     {loading ? 'Loading properties...' : 'Loaded'}
   </div>
   ```

5. **Improve Error Messages**
   - Associate errors with form fields
   - Use `aria-describedby`

### Low Priority
6. **Add Keyboard Shortcuts**
   - `/` or `Ctrl+K` for search (already works)
   - `F` for favorites
   - `Ctrl+M` for map view

---

## Testing Procedure

### 1. Visual Inspection (10 min)
```powershell
cd apps/publimicro
pnpm dev
# Open http://localhost:3000
# Navigate through all pages
# Check focus indicators are visible
```

### 2. Keyboard Navigation (15 min)
- Start at homepage
- Use only keyboard (no mouse)
- Navigate to property detail
- Open modal
- Fill form
- Submit

### 3. Screen Reader Test (15 min)
- Enable NVDA/VoiceOver
- Listen to page structure
- Verify all content is announced
- Check button labels are clear

### 4. Contrast Check (10 min)
- Screenshot key pages
- Check with contrast tool
- Fix any failing ratios

---

## Expected Results

### Pass Criteria
- ✅ Lighthouse Accessibility: 95+ score
- ✅ axe DevTools: 0 critical violations
- ✅ Keyboard: All features accessible
- ✅ Screen Reader: Clear, logical flow
- ✅ Contrast: All text passes WCAG AA

### Current Status
Based on implementation:
- **Estimated Score**: 90-95
- **Critical Issues**: 0
- **Warnings**: 2-3 (minor)

---

## Quick Fixes for Common Issues

### Missing Alt Text
```tsx
<Image src={url} alt="Property in Brasília - 5 hectares" />
```

### Button Without Label
```tsx
<button aria-label="Close dialog" onClick={onClose}>
  <X className="w-6 h-6" />
</button>
```

### Form Input Without Label
```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-required="true" />
```

### Non-Descriptive Link
```tsx
{/* Bad */}
<a href="/property/123">Click here</a>

{/* Good */}
<a href="/property/123">View property: Rural land in Goiás</a>
```

---

## Post-Testing Actions

### If Score < 95
1. Review axe violations
2. Fix critical issues first
3. Retest
4. Document remaining issues

### If Score ≥ 95
1. ✅ Mark accessibility complete
2. Schedule quarterly audits
3. Add to CI/CD pipeline
4. Document for team

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Last Updated**: November 6, 2025  
**Next Review**: After all fixes applied  
**Status**: Ready for testing
