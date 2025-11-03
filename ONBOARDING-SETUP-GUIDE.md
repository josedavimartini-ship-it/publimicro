# User Onboarding System - Setup Guide

## Overview
Complete user onboarding system with profile completion form for police verification, visit scheduling authorization, and bidding permissions.

## What Was Implemented

### 1. Database Schema (`user_profiles` table)
Location: `supabase/migrations/20251103000000_create_user_profiles.sql`

**Fields:**
- **Personal Info:** full_name, cpf (CPF), phone, birth_date
- **Address:** cep, street, number, complement, neighborhood, city, state
- **Profile Status:** profile_completed, verified
- **Permissions:** can_schedule_visits, can_place_bids, terms_accepted
- **Timestamps:** created_at, updated_at, terms_accepted_at

**Features:**
- Automatic profile creation on user signup (trigger)
- Row Level Security (RLS) policies
- Admin override permissions
- CPF and phone indexing for fast lookups
- Auto-update timestamp trigger

### 2. OnboardingModal Component
Location: `apps/publimicro/src/components/OnboardingModal.tsx`

**Step 1 - Personal Information:**
- Full name (required)
- CPF with validation and formatting (000.000.000-00)
- Phone/WhatsApp with formatting (+55 (00) 00000-0000)
- Birth date (must be 18+)

**Step 2 - Address:**
- CEP with auto-fill via ViaCEP API
- Street, number, complement
- Neighborhood, city, state (dropdown with all Brazilian states)

**Step 3 - Terms & Authorization:**
- Police verification consent
- Data usage authorization (LGPD compliant)
- Permission grants:
  * Schedule property visits
  * Place bids in auctions
  * Participate in negotiations

**Features:**
- Real-time CPF validation (check digits)
- CEP integration auto-fills address
- Progress bar showing current step
- Form validation before proceeding
- Mobile-responsive design

### 3. Auth Provider
Location: `apps/publimicro/src/components/AuthProvider.tsx`

**Features:**
- Global authentication state management
- Automatic profile loading on login
- Session persistence across page refreshes
- Triggers onboarding modal if profile incomplete
- Provides `useAuth()` hook for components

**Context API:**
```typescript
const { user, profile, loading, refreshProfile } = useAuth();
```

### 4. TopNav with Auth
Location: `apps/publimicro/src/components/TopNavWithAuth.tsx`

**User Account States:**
1. **Not Logged In:** Shows "Conta" button → Opens AccountModal
2. **Logged In:** Shows user's first name → Dropdown menu with:
   - My Profile
   - My Listings
   - My Visits (if authorized)
   - My Bids (if authorized)
   - Sign Out

**Features:**
- Real-time user state detection
- Profile completion indicator
- Verified badge for verified users
- Conditional menu items based on permissions

## Setup Instructions

### Step 1: Run Database Migration

Go to your Supabase Dashboard:
https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc

Navigate to: **SQL Editor** → **New Query**

Paste the entire contents of:
`supabase/migrations/20251103000000_create_user_profiles.sql`

Click **Run** to execute the migration.

**What this creates:**
- `user_profiles` table
- RLS policies for security
- Automatic triggers for profile creation
- Indexes for performance

### Step 2: Test the Onboarding Flow

1. **Start the development server:**
   ```powershell
   cd c:\projetos\publimicro\apps\publimicro
   pnpm dev
   ```

2. **Create a new account:**
   - Click "Conta" in top navigation
   - Choose "Não tem conta? Cadastre-se"
   - Sign up with email/password OR use Google OAuth

3. **Complete onboarding:**
   - Modal will automatically appear for new users
   - Fill in all 3 steps:
     * Step 1: Personal info (CPF, phone, birth date)
     * Step 2: Address (CEP auto-fills from ViaCEP)
     * Step 3: Accept terms

4. **Verify permissions:**
   - After completing onboarding, user should have:
     * `profile_completed = true`
     * `can_schedule_visits = true`
     * `can_place_bids = true`
   - Check in Supabase: **Table Editor** → `user_profiles`

### Step 3: Admin Verification (Optional)

For users who need manual verification:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query to verify a user:
   ```sql
   UPDATE public.user_profiles
   SET verified = true
   WHERE id = 'user-uuid-here';
   ```

3. To find user UUID:
   ```sql
   SELECT id, full_name, email, cpf
   FROM public.user_profiles
   JOIN auth.users ON user_profiles.id = users.id
   WHERE cpf = '12345678900'; -- or email = 'user@example.com'
   ```

## User Flow

```
New User Signs Up
       ↓
Profile Auto-Created (trigger)
       ↓
AuthProvider Detects Incomplete Profile
       ↓
OnboardingModal Opens Automatically
       ↓
User Fills 3-Step Form
       ↓
Data Saved to user_profiles
       ↓
Permissions Granted:
  - can_schedule_visits = true
  - can_place_bids = true
       ↓
Modal Closes
       ↓
User Can Now:
  ✓ Schedule property visits
  ✓ Place bids in auctions
  ✓ Access full platform features
```

## CPF Validation

The system includes proper CPF validation:

1. **Format:** 000.000.000-00 (auto-formatted as user types)
2. **Length:** Must be exactly 11 digits
3. **Check Digits:** Validates using official CPF algorithm
4. **Duplicates:** Rejects common invalid CPFs (111.111.111-11, etc.)

## CEP Integration

Automatic address lookup using ViaCEP API:

1. User enters CEP (00000-000)
2. System calls: `https://viacep.com.br/ws/{CEP}/json/`
3. Auto-fills: street, neighborhood, city, state
4. User only needs to enter: number and complement

## Data Privacy & LGPD Compliance

The onboarding includes explicit consent for:

- ✓ Police verification of personal data
- ✓ Processing and secure storage of information
- ✓ Use of CPF for identification purposes only
- ✓ Contact via provided phone/email
- ✓ Sharing basic info with property owners for visit scheduling

Users must check the acceptance box to proceed.

## Permissions System

Two key permissions are automatically granted after onboarding:

### `can_schedule_visits`
- Allows user to request property visit appointments
- Property owners can verify user before approving
- Linked to verified identity

### `can_place_bids`
- Enables participation in auctions
- Allows making offers on properties
- Requires profile completion for accountability

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] New user signup triggers profile creation
- [ ] Onboarding modal appears automatically
- [ ] CPF validation works (try invalid CPFs)
- [ ] CEP auto-fill populates address fields
- [ ] Form validation prevents incomplete submissions
- [ ] Terms must be accepted to proceed
- [ ] Profile marked as completed after submission
- [ ] Permissions granted correctly
- [ ] User profile dropdown shows after login
- [ ] "My Visits" and "My Bids" appear in menu
- [ ] Sign out works correctly
- [ ] Modal doesn't show again for completed profiles

## Troubleshooting

### Onboarding modal doesn't appear
- Check browser console for errors
- Verify AuthProvider is wrapping the app
- Confirm user_profiles table exists
- Check if profile_completed is false in database

### CEP lookup not working
- Verify internet connection
- Check CEP format (00000-000)
- Try a different valid CEP
- ViaCEP may be temporarily unavailable

### CPF validation failing
- Ensure 11 digits entered
- Check for common invalid patterns
- Verify check digit calculation

### Permissions not granted
- Check database: `SELECT * FROM user_profiles WHERE id = 'uuid';`
- Verify onboarding completed fully
- Re-run migration if columns missing

## Next Steps

1. **Implement Visit Scheduling System**
   - Create visits table
   - Build visit request form
   - Add approval workflow for property owners

2. **Build Bidding System**
   - Create bids table
   - Real-time bid updates
   - Bid history tracking

3. **Add Admin Dashboard**
   - User verification interface
   - Manual profile approval
   - Police verification status tracking

4. **Email Notifications**
   - Welcome email after registration
   - Profile verification confirmation
   - Visit/bid notifications

---

## Files Created/Modified

**New Files:**
- `supabase/migrations/20251103000000_create_user_profiles.sql`
- `apps/publimicro/src/components/OnboardingModal.tsx`
- `apps/publimicro/src/components/AuthProvider.tsx`
- `apps/publimicro/src/components/TopNavWithAuth.tsx`

**Modified Files:**
- `apps/publimicro/src/app/layout.tsx` (integrated AuthProvider)
- `apps/publimicro/src/components/AccountModal.tsx` (compacted OAuth buttons)
- `apps/publimicro/package.json` (added @supabase/auth-helpers-nextjs)

**Dependencies Added:**
- `@supabase/auth-helpers-nextjs@^0.10.0`

---

*System ready for user onboarding with police verification authorization!*
