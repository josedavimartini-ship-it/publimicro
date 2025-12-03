# 📱 Mobile Testing Guide - PubliMicro

## Overview
Comprehensive mobile testing checklist for PubliMicro marketplace. Test all features across iOS and Android devices to ensure flawless mobile experience.

**Target Devices:**
- iPhone SE (smallest screen)
- iPhone 14/15 (standard)
- iPhone 15 Pro Max (largest)
- Android: Samsung Galaxy S23
- iPad (tablet experience)

---

## ✅ Pre-Testing Setup

### Install on Test Devices
```bash
# Development URL (local)
http://localhost:3000

# Staging URL (Vercel preview)
https://publimicro-preview.vercel.app

# Production URL
https://acheme.com
```

### Browser Testing Matrix
- **iOS**: Safari (primary), Chrome iOS (secondary)
- **Android**: Chrome (primary), Samsung Internet (secondary)

---

## 📋 Phase 1: Core Functionality (30 min)

### Navigation & Browsing
- [ ] Homepage loads correctly
- [ ] All section buttons (PubliProper, Motors, etc.) work
- [ ] Search bar is prominent and functional
- [ ] Bottom navigation visible and functional
- [ ] Back button works correctly
- [ ] Deep links work (share property → open in app)

### Property Listings
- [ ] Property cards render correctly
- [ ] Photos load in SwipeGallery
- [ ] Swipe left/right works smoothly
- [ ] Heart (favorite) button responds
- [ ] Price displays correctly formatted
- [ ] "Mais Informações" button navigates correctly

### Property Detail Pages
- [ ] Full property information displays
- [ ] Photo gallery swipes smoothly
- [ ] Zoom/fullscreen works
- [ ] Map displays correctly
- [ ] "Agendar Visita" button opens modal
- [ ] "Fazer Proposta" button opens modal
- [ ] Neighborhood data displays (if available)

---

## 📋 Phase 2: Touch Gestures (20 min)

### SwipeGallery Component
- [ ] Single finger swipe left (next photo)
- [ ] Single finger swipe right (previous photo)
- [ ] Tap dots to jump to photo
- [ ] Tap thumbnails (if enabled)
- [ ] Pinch to zoom in fullscreen
- [ ] Double tap to toggle fullscreen
- [ ] Swipe momentum feels natural

### BottomSheet Component
- [ ] Swipe up from bottom edge to open
- [ ] Swipe down to close
- [ ] Drag handle visible
- [ ] Backdrop tap closes sheet
- [ ] Content scrolls within sheet
- [ ] Doesn't close while scrolling content

### General Touch Interactions
- [ ] Buttons have 44x44px minimum tap target
- [ ] No accidental taps when scrolling
- [ ] Hover states work (if applicable)
- [ ] Long press doesn't trigger unwanted actions

---

## 📋 Phase 3: PWA Features (25 min)

### Installation
**iOS (Safari):**
1. [ ] Tap Share button (⬆️)
2. [ ] Scroll and find "Add to Home Screen"
3. [ ] Icon appears on home screen
4. [ ] App opens in standalone mode (no browser UI)
5. [ ] Splash screen displays correctly

**Android (Chrome):**
1. [ ] See "Add to Home Screen" prompt
2. [ ] Or: Menu → Add to Home Screen
3. [ ] Icon appears on home screen
4. [ ] App opens in standalone mode
5. [ ] Splash screen displays correctly

### PWA Behavior
- [ ] App opens without browser chrome
- [ ] Status bar color matches theme (#0a0a0a)
- [ ] Safe area padding works (notches)
- [ ] Can switch to other apps and return
- [ ] Maintains state across sessions
- [ ] Updates automatically in background

### Offline Capability
- [ ] Service worker registered
- [ ] Previously viewed pages load offline
- [ ] Shows offline indicator when no connection
- [ ] Gracefully handles connection loss
- [ ] Syncs favorites when back online

---

## 📋 Phase 4: Screen Sizes & Orientations (15 min)

### Portrait Mode
**iPhone SE (375x667):**
- [ ] All content fits without horizontal scroll
- [ ] Text readable (minimum 14px)
- [ ] Buttons not cut off
- [ ] Images scale properly

**iPhone 14 (390x844):**
- [ ] Standard layout looks good
- [ ] No wasted space
- [ ] Cards properly sized

**iPhone 15 Pro Max (430x932):**
- [ ] Content scales up appropriately
- [ ] Doesn't look stretched
- [ ] Grid adjusts to show more content

**iPad (768x1024):**
- [ ] Switches to 2-column grid
- [ ] Desktop navbar shows
- [ ] No mobile-only elements visible

### Landscape Mode
- [ ] All devices: Layout adapts correctly
- [ ] No content hidden
- [ ] Safe area padding works (notches)
- [ ] Keyboard doesn't cover input fields

---

## 📋 Phase 5: Forms & Input (20 min)

### Search Bar
- [ ] Tapping opens keyboard
- [ ] Keyboard type: text (iOS) or search (Android)
- [ ] Autocomplete suggestions visible above keyboard
- [ ] Return/Search key submits search
- [ ] Clear button (X) visible and works
- [ ] Keyboard closes on scroll

### Login/Signup Forms
- [ ] Email field: keyboard type = email
- [ ] Password field: keyboard type = password (secure)
- [ ] Phone field: keyboard type = tel
- [ ] Form validation shows inline errors
- [ ] Submit button enabled/disabled correctly
- [ ] Password show/hide toggle works

### Visit Scheduling Modal
- [ ] Date picker opens native iOS/Android picker
- [ ] Time picker works correctly
- [ ] Text area auto-expands
- [ ] Submit button accessible above keyboard
- [ ] Modal scrolls if keyboard covers content

### Proposal Modal
- [ ] Number input: keyboard type = decimal
- [ ] Currency formatting works as user types
- [ ] All fields accessible with keyboard open

---

## 📋 Phase 6: Performance (15 min)

### Load Times
- [ ] Initial page load < 3 seconds (3G)
- [ ] Navigation between pages < 1 second
- [ ] Images lazy load as user scrolls
- [ ] No janky animations
- [ ] Smooth 60fps scrolling

### Memory Usage
- [ ] App doesn't crash after 10 min use
- [ ] Swipe through 50+ photos without slowdown
- [ ] Multiple modals open/close smoothly
- [ ] Back button doesn't reload page unnecessarily

### Battery Impact
- [ ] No excessive battery drain
- [ ] Background processes minimal
- [ ] Location services only when needed

---

## 📋 Phase 7: Browser-Specific Issues (15 min)

### iOS Safari
- [ ] Viewport meta tag prevents zoom on input focus
- [ ] 100vh works correctly (not cut off by safari bar)
- [ ] Fixed position elements stay fixed
- [ ] Date/time inputs use iOS native picker
- [ ] Audio plays after user interaction (autoplay blocked)

### Chrome Android
- [ ] Pull-to-refresh disabled on property pages
- [ ] Navigation bar color matches theme
- [ ] File upload works (camera/gallery)
- [ ] Geolocation permission requests correctly

### Samsung Internet
- [ ] All features work same as Chrome
- [ ] Night mode doesn't break colors
- [ ] Reader mode disabled on listing pages

---

## 📋 Phase 8: Accessibility (10 min)

### Screen Reader
**iOS VoiceOver:**
1. [ ] Enable: Settings → Accessibility → VoiceOver
2. [ ] Navigate property cards with swipe
3. [ ] Buttons announce role and action
4. [ ] Images have alt text
5. [ ] Form labels read correctly

**Android TalkBack:**
1. [ ] Enable: Settings → Accessibility → TalkBack
2. [ ] Same tests as iOS VoiceOver

### Zoom & Text Size
- [ ] System font size changes respected
- [ ] Zoom to 200% doesn't break layout
- [ ] No text cut off at large sizes

### Color Contrast
- [ ] All text readable in sunlight
- [ ] Buttons distinguishable
- [ ] Error messages clearly visible

---

## 📋 Phase 9: Edge Cases (20 min)

### Network Conditions
- [ ] Slow 3G: Shows loading indicators
- [ ] Connection loss: Graceful error messages
- [ ] Reconnect: Resumes smoothly
- [ ] Image loading: Shows skeleton/placeholder

### Interruptions
- [ ] Phone call: App pauses, resumes correctly
- [ ] Low battery warning: Doesn't crash
- [ ] Screenshot: Works normally
- [ ] Lock screen: Returns to same view

### Unusual Interactions
- [ ] Rotate device mid-modal: Modal adjusts
- [ ] Switch apps mid-upload: Upload continues
- [ ] Force quit and reopen: State preserved
- [ ] Open many tabs: Each independent

---

## 🐛 Common Mobile Issues Checklist

### Visual Issues
- [ ] Images not loading → Check CORS, Supabase storage
- [ ] Layout broken → Check CSS media queries
- [ ] Text overlapping → Check z-index, positioning
- [ ] Colors wrong → Check dark mode, theme colors

### Interaction Issues
- [ ] Tap not working → Check tap target size (44x44)
- [ ] Scroll not smooth → Check overflow, touch-action CSS
- [ ] Modal not closing → Check z-index, backdrop click handler
- [ ] Swipe not responding → Check touch event listeners

### Performance Issues
- [ ] Slow loading → Check image sizes, lazy loading
- [ ] Janky animation → Check will-change, transform vs top/left
- [ ] High memory → Check image cleanup, event listener cleanup
- [ ] Battery drain → Check background timers, location polling

---

## 📊 Testing Metrics

### Pass Criteria
- **Functionality**: 95%+ of features work flawlessly
- **Performance**: Load < 3s, Interactions < 100ms
- **Accessibility**: VoiceOver/TalkBack 100% navigable
- **PWA**: Installs and works offline
- **Compatibility**: Works on all target devices/browsers

### Report Template
```markdown
## Mobile Test Report - [Date]

**Device**: iPhone 15 Pro, iOS 17.2  
**Browser**: Safari  
**Tester**: [Name]

### Results
- ✅ Core Functionality: 48/50 (96%)
- ✅ Touch Gestures: 15/15 (100%)
- ⚠️ PWA Features: 8/10 (80%) - Offline mode needs work
- ✅ Screen Sizes: 12/12 (100%)
- ✅ Forms: 18/20 (90%) - Date picker styling issue

### Issues Found
1. **[HIGH]** Offline mode doesn't cache property images
2. **[MEDIUM]** Date picker iOS styling inconsistent
3. **[LOW]** Back button animation slight delay

### Recommendations
- Implement image caching strategy for offline
- Use native date input styling
- Optimize page transitions
```

---

## 🚀 Quick Mobile Test (10 min)

If short on time, test these critical paths:

1. **Homepage → Property → Modal**
   - Load homepage
   - Swipe through photos
   - Tap property
   - Schedule visit

2. **Search → Results → Favorite**
   - Search "Corumbaíba"
   - Scroll results
   - Heart a property
   - Verify saved in Favorites

3. **PWA Install → Offline**
   - Install to home screen
   - Open standalone app
   - Turn off WiFi
   - Browse cached content

4. **Forms → Submit**
   - Open visit modal
   - Fill all fields
   - Submit successfully

---

## 📱 Device Emulation (Development)

### Chrome DevTools
```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
- Preset: iPhone 14 Pro
- Custom: 375x667 (iPhone SE)
- Throttling: Slow 3G
- Touch: Enable touch simulation
```

### Safari Responsive Design Mode
```
Develop → Enter Responsive Design Mode
- Preset: iPhone 14
- Custom dimensions
- User agent: iOS Safari
```

### Real Device Testing
Use BrowserStack or LambdaTest for real device testing:
- Live testing on 50+ devices
- Screenshot testing across devices
- Automated visual regression

---

## ✅ Final Checklist Before Launch

- [ ] All critical paths tested on 3+ devices
- [ ] iOS Safari (most restrictive browser) works
- [ ] PWA installable and functional
- [ ] No console errors on mobile
- [ ] Performance Lighthouse score > 90
- [ ] Accessibility score > 95
- [ ] Forms submit successfully
- [ ] Offline mode graceful
- [ ] Safe area padding correct
- [ ] Touch targets 44x44px minimum

---

**Testing Complete!** 🎉

Now proceed to SEO optimization and final audit.
