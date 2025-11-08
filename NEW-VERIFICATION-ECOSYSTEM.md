# New Verification Ecosystem - Complete Implementation Guide

## 🎯 Overview

We've completely redesigned the authentication and visit scheduling system to prioritize security and user experience. Background checks now happen **BEFORE** account creation, and guest users can schedule visits without creating accounts.

---

## 📋 Architecture Changes

### OLD FLOW (❌ Deprecated)
1. User signs up → Account created immediately
2. Profile completion → Manual admin verification
3. Admin checks Federal Police/Interpol → Grant permissions
4. User can now schedule visits and make proposals

### NEW FLOW (✅ Implemented)
1. User signs up OR guest schedules visit
2. **Background checks run automatically** (CPF, Federal Police, Interpol)
3. If **APPROVED** → Account created automatically + Email sent
4. If **REJECTED** → Silent rejection (security)
5. If **NEEDS REVIEW** → Admin dashboard for manual approval
6. User can schedule visits immediately after verification
7. Proposals unlocked ONLY after first visit completion

---

## 🗄️ Database Changes

### Migration 1: `20251107000001_create_sitios_simple.sql`
**Status:** ✅ RAN SUCCESSFULLY

Creates `sitios` table for legacy property support with:
- Auto-slug generation
- RLS policies for security
- Indexes for performance

### Migration 2: `20251107000002_add_verification_fields.sql`
**Status:** ✅ RAN SUCCESSFULLY

Added to `user_profiles`:
- `cpf_validation_status`, `cpf_validated_at`
- `federal_police_check_status`, `federal_police_check_date`, `federal_police_response`
- `interpol_check_status`, `interpol_check_date`, `interpol_response`
- `background_check_completed`, `background_check_passed`
- `verified_by`, `verified_at`

Created `verification_logs` table for audit trail.

Created trigger `auto_grant_bid_permission()` - Automatically grants `can_place_bids` when all checks pass.

### Migration 3: `20251107000003_pending_verifications_system.sql`
**Status:** ⏳ PENDING - NEEDS TO BE RUN

**Critical Tables:**

#### `pending_verifications`
Stores users in verification limbo before account creation:
- Personal info: `full_name`, `email`, `cpf`, `phone`, `birth_date`, address fields
- Verification tracking: `cpf_validation_status`, `federal_police_check_status`, `interpol_check_status`
- Overall status: `verification_status` (pending/in_progress/approved/rejected/needs_review/expired)
- Source tracking: `source` (signup/visit_request/proposal_request), `source_id`
- Account linking: `account_created`, `user_id`

#### Enhanced `visits` table
Added guest support fields:
- `guest_cpf` - Guest's CPF for identification
- `guest_birth_date` - Required for background checks
- `guest_address` - Guest's address (JSON)
- `verification_pending_id` - Links to pending_verifications record
- `background_check_required`, `background_check_completed`, `background_check_passed`

#### Enhanced `properties` and `sitios` tables
Added bid tracking:
- `expected_value` - Property's expected sale price
- `current_highest_bid` - Current highest bid amount
- `total_bids_count` - Total number of bids received
- `last_bid_at` - Timestamp of last bid
- `accepts_proposals` - Whether property accepts bids

**Triggers:**
- `update_property_bid_stats()` - Auto-updates bid statistics when new proposals are inserted

---

## 🔌 API Routes

### `/api/signup` (NEW)
**Purpose:** Handle registration with pre-account background checks

**Flow:**
1. Collect user information (name, email, CPF, birth_date, etc.)
2. Check if CPF already exists
3. Validate CPF format and checksum
4. Create `pending_verifications` record
5. Run `/api/verify-cpf`
6. Run `/api/background-check`
7. **If APPROVED:**
   - Create auth.users account immediately
   - Create user_profile with verified=true
   - Send welcome email
8. **If REJECTED:**
   - Return generic error (don't reveal background check failed)
9. **If NEEDS REVIEW:**
   - Return "under review" message
   - Flag for admin manual review

**Usage:**
```typescript
const response = await fetch('/api/signup', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    full_name: 'João Silva',
    cpf: '123.456.789-00',
    phone: '(62) 99999-9999',
    birth_date: '1990-01-01',
    city: 'Goiânia',
    state: 'GO'
  })
});

// Possible responses:
// 201: { success: true, user_id: '...', verified: true }
// 202: { message: 'Under review', code: 'PENDING_REVIEW', verification_id: '...' }
// 403: { error: 'Unable to complete registration', code: 'REGISTRATION_DENIED' }
```

---

### `/api/verify-cpf` (NEW)
**Purpose:** Validate Brazilian CPF with algorithm + Receita Federal check

**Algorithm:**
1. Remove non-digits
2. Check length (11 digits)
3. Reject repeated digits (111.111.111-11)
4. Calculate first verification digit
5. Calculate second verification digit
6. Log all attempts to `verification_logs`

**TODO:** Integration with Receita Federal API for real validation

**Usage:**
```typescript
const response = await fetch('/api/verify-cpf', {
  method: 'POST',
  body: JSON.stringify({
    cpf: '123.456.789-00',
    full_name: 'João Silva',
    birth_date: '1990-01-01'
  })
});

// Response:
// { valid: true, cpf: '12345678900', message: 'CPF válido' }
```

---

### `/api/background-check` (NEW)
**Purpose:** Comprehensive Federal Police + Interpol verification

**Checks Performed:**

#### Federal Police Check
- Criminal records
- Wanted persons list
- Legal restrictions
- **TODO:** Integration with https://servicos.dpf.gov.br/api/antecedentes

#### Interpol Check
- Red notices (wanted internationally)
- Travel restrictions
- International alerts
- **TODO:** Integration with I-24/7 Database or third-party service (WorldCheck, ComplyAdvantage)

**Decision Logic:**
```typescript
if (has_criminal_record || is_wanted) {
  return { status: 'rejected', rejection_reason: '...' };
}

if (api_error || inconclusive) {
  return { status: 'needs_review' };
}

return { status: 'approved', passed: true };
```

**Auto-Updates:**
- Updates `pending_verifications` table with check results
- Logs all checks to `verification_logs` (JSONB responses)

**Usage:**
```typescript
const response = await fetch('/api/background-check', {
  method: 'POST',
  body: JSON.stringify({
    cpf: '12345678900',
    full_name: 'João Silva',
    birth_date: '1990-01-01',
    email: 'user@example.com',
    pending_verification_id: 'uuid-here'
  })
});

// Response:
// {
//   status: 'approved' | 'rejected' | 'needs_review',
//   passed: true | false,
//   checks: {
//     federal_police: { ... },
//     interpol: { ... }
//   }
// }
```

---

### `/api/schedule-visit` (ENHANCED)
**Purpose:** Schedule visits with support for guest users + background checks

**Guest Flow:**
1. Collect guest information (including CPF and birth_date)
2. Check if CPF already exists → Reject if yes
3. Check for existing pending verifications
4. Validate CPF
5. Create `pending_verifications` record with source='visit_request'
6. Run `/api/background-check`
7. **If APPROVED:**
   - Create visit request
   - Auto-create account
   - Link user_id to visit
   - Send welcome email
8. **If REJECTED:**
   - Return generic error
9. **If NEEDS REVIEW:**
   - Return "under review" message

**Authenticated User Flow:**
1. Simple visit scheduling
2. No background checks (already verified)
3. Immediate confirmation

**Usage:**
```typescript
// Guest visit (triggers background check)
const response = await fetch('/api/schedule-visit', {
  method: 'POST',
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'user@example.com',
    telefone: '(62) 99999-9999',
    cpf: '123.456.789-00',
    birth_date: '1990-01-01', // Required for guests!
    cidade: 'Goiânia',
    estado: 'GO',
    dataPreferencia: '2025-11-15',
    horarioPreferencia: 'manhã',
    visitType: 'presencial',
    propertyId: 'property-uuid',
    isGuest: true // Triggers background check
  })
});

// Authenticated visit (no background check)
const response = await fetch('/api/schedule-visit', {
  method: 'POST',
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'user@example.com',
    telefone: '(62) 99999-9999',
    cpf: '123.456.789-00',
    dataPreferencia: '2025-11-15',
    horarioPreferencia: 'tarde',
    visitType: 'video',
    propertyId: 'property-uuid',
    user_id: 'user-uuid' // Authenticated
  })
});
```

---

## 🎨 Component Updates

### `VisitScheduler.tsx` (COMPLETELY REDESIGNED)
**Location:** `apps/publimicro/src/components/scheduling/VisitScheduler.tsx`

**New Features:**
- Detects if user is authenticated or guest
- Shows different UI for guests vs authenticated users
- Collects birth_date for guest users (required for background check)
- Auto-fills form for authenticated users
- Shows verification status messages:
  - ✅ **Sent:** "Account created! Check your email"
  - ⏳ **Pending Review:** "Under review, email within 24-48h"
  - ✗ **Error:** "Unable to process, please verify data"

**Color Updates:**
- ❌ Removed: `amber-500`, `amber-600`, `amber-400`
- ✅ Added: `#D4AF37` (gold), `#CD7F32` (bronze), `#A8896B` (tan), `#8B9B6E` (sage)

**Guest Benefits Banner:**
```tsx
<div className="mb-6 p-4 bg-gradient-to-r from-[#CD7F32]/10 to-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg">
  <div className="flex items-start gap-3">
    <span className="text-2xl">✨</span>
    <div>
      <h3 className="font-semibold text-[#D4AF37] mb-1">
        Agende sem criar conta!
      </h3>
      <p className="text-sm text-[#A8896B]">
        Você pode agendar sua visita agora. Se aprovado, criaremos sua conta automaticamente.
      </p>
    </div>
  </div>
</div>
```

---

### `AchemeLogo.tsx` (PREMIUM REDESIGN)
**Location:** `apps/publimicro/src/components/AchemeLogo.tsx`

**Changes:**
- SVG viewBox: 120x120 → **140x140** (more detail space)
- **8 gradient definitions** (was 6):
  - `frameGradient`: 6-stop bronze/gold metallic
  - `lensGradient`: Realistic glass transparency
  - `emuHeadGradient`: Natural brown tones
  - `neckGradient`: Darker shading
  - `beakGradient`: Shiny horn effect
  - `handleGradient`, `handleShine`, `capGradient`
- **Filters:** Glow effect + drop shadow for depth
- **Emu Details:**
  - Neck with highlight curve
  - Head with feather texture
  - Realistic beak with ridges
  - Detailed eye with double highlights
  - Elaborate 4-feather crown
- **Magnifying Glass Details:**
  - Multi-layer glass shine (3 ellipses)
  - Inner frame ring
  - Metallic handle with shine overlay
  - Handle ridge detail
  - Enhanced cap with highlight

**New Exports:**
```tsx
import { AchemeLogo, AchemeWordmark, AchemeIcon } from '@/components/AchemeLogo';

// Default logo with animation
<AchemeLogo className="w-32 h-32" />

// Logo + enhanced wordmark
<AchemeWordmark className="w-64" />

// Icon only (sm/md/lg sizes)
<AchemeIcon size="lg" className="w-16 h-16" />
```

---

### `ProposalModal.tsx` (SECURITY FIX)
**Location:** `apps/publimicro/src/components/ProposalModal.tsx`

**Changes:**
- Fixed import: `@/contexts/AuthContext` → `./AuthProvider`
- Removed Federal Police/Interpol mentions from UI
- Changed text: "Polícia Federal e Interpol" → "Verificação de documentos"
- User only sees: "Seu perfil está em verificação" (generic)
- Internal permission logic unchanged: `can_place_bids && verified`

---

### `OnboardingModal.tsx` (PERMISSION FIX)
**Location:** `apps/publimicro/src/components/OnboardingModal.tsx`

**Changes:**
- Line 330: `can_place_bids: false` (was `true`)
- Added comment: "Only granted after verification"
- `can_schedule_visits: true` (immediate)
- Rationale: Users can schedule visits immediately, but proposals only after background checks pass

---

## 🔐 Security & Privacy

### Background Checks Are INTERNAL ONLY

**User Never Sees:**
- "Federal Police check"
- "Interpol check"
- Rejection reasons (if background check fails)

**User Only Sees:**
- "Verificação de documentos em andamento"
- "Seu cadastro está em análise"
- Generic error: "Não foi possível processar sua solicitação"

### Verification Status Enum
```sql
CREATE TYPE verification_status AS ENUM (
  'pending',      -- Initial state
  'in_progress',  -- Checks running
  'approved',     -- All checks passed
  'rejected',     -- Failed checks (silent)
  'needs_review', -- Manual admin review required
  'expired'       -- Verification window expired
);
```

### Audit Trail
All verifications logged to `verification_logs`:
```sql
INSERT INTO verification_logs (
  user_id,
  verification_type,  -- 'cpf' | 'federal_police' | 'interpol'
  status,             -- 'approved' | 'rejected' | 'error'
  request_data,       -- JSONB of request payload
  response_data       -- JSONB of API response
);
```

---

## 📊 Property Display Changes

### Current Implementation (OLD)
- Shows all proposal history
- Individual bid amounts visible
- Cluttered UI with too much info

### New Implementation (TODO - Next Priority)
**Show ONLY:**
1. **Expected Value** (large, prominent)
   ```tsx
   <div className="expected-value">
     <span className="label text-[#8B9B6E]">Valor Esperado</span>
     <span className="amount text-[#D4AF37]">R$ 850.000</span>
   </div>
   ```

2. **Current Highest Bid** (if exists)
   ```tsx
   {current_highest_bid && (
     <div className="current-bid">
       <span className="badge bg-gradient-to-r from-[#CD7F32] to-[#D4AF37]">
         🏆 Maior Lance: R$ {current_highest_bid.toLocaleString('pt-BR')}
       </span>
     </div>
   )}
   ```

3. **Total Bids Count** (engagement indicator)
   ```tsx
   {total_bids_count > 0 && (
     <span className="bid-count text-[#A8896B]">
       {total_bids_count} propostas recebidas
     </span>
   )}
   ```

---

## 🎨 Color Transformation Status

### Completed Files
✅ `VisitScheduler.tsx` - All amber → bronze/gold
✅ `AchemeLogo.tsx` - Premium metallic gradients
✅ `ProposalModal.tsx` - Partial (needs more work)

### High Priority Files (50+ remaining)
⏳ `SearchBar.tsx` - 13 instances of text-white, #0D7377 (teal)
⏳ `NeighborhoodInfo.tsx` - bg-blue-500/20, text-blue-400
⏳ `WelcomeModal.tsx`, `VisitModal.tsx`, `OnboardingModal.tsx` - text-white on buttons
⏳ `SiteCard.tsx`, `SectionCard.tsx`, `ContactForm.tsx` - bg-white
⏳ `Hero.tsx` - text-white, bg-white/10, border-white/40
⏳ `CategoryGrid.tsx` - bg-white sections
⏳ `SwipeGallery.tsx` - text-white overlays, bg-white/50

### Color Replacement Patterns
```typescript
// White backgrounds
bg-white → bg-[#1a1a1a] or bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]

// White text
text-white → text-[#E6C98B] or text-[#D4AF37]

// White borders
border-white → border-[#3a3a2a] or border-[#D4AF37]

// Blue backgrounds
bg-blue-500/20 → bg-[#A8C97F]/20
bg-blue-900/20 → bg-[#8B7355]/20

// Blue text
text-blue-300 → text-[#A8C97F]
text-blue-400 → text-[#8B9B6E]

// Blue borders
border-blue-500 → border-[#A8C97F]

// Teal/Cyan (#0D7377) - MUST REMOVE
from-[#A8C97F] to-[#0D7377] → from-[#CD7F32] to-[#D4AF37]
```

---

## 🚀 Next Steps

### Priority 1: Run Migration in Supabase ⏳
```sql
-- Go to Supabase Dashboard → SQL Editor → New Query
-- Copy entire contents of:
-- supabase/migrations/20251107000003_pending_verifications_system.sql
-- Paste and RUN
```

### Priority 2: Update Property Cards 📊
Files to modify:
- `apps/publimicro/src/components/listings/PropertyCard.tsx`
- `apps/publimicro/src/components/listings/SiteCard.tsx`
- `apps/publimicro/src/components/PropertyCardGrid.tsx`

Add fields to display:
- `expected_value`
- `current_highest_bid`
- `total_bids_count`

### Priority 3: Create Admin Dashboard 🛠️
New page: `/admin/verifications`

Features:
- List all `pending_verifications` with status='needs_review'
- Show: Name, CPF, Email, Source, Check Results (Federal Police, Interpol)
- Actions: Approve (create account), Reject (with reason), Request More Info
- Filters: By source, date, status
- Search: By CPF, email, name

### Priority 4: Systematic Color Replacement 🎨
Execute color audit across 50+ files in order:
1. SearchBar.tsx (highest priority - 13 instances)
2. ProposalModal.tsx
3. NeighborhoodInfo.tsx
4. Modal components (WelcomeModal, VisitModal, OnboardingModal)
5. Card components (SiteCard, SectionCard, ContactForm)
6. Hero section
7. CategoryGrid
8. SwipeGallery

### Priority 5: API Integration 🔌
- **Federal Police API:** https://servicos.dpf.gov.br/api/antecedentes
- **Interpol API:** I-24/7 Database or third-party (WorldCheck, ComplyAdvantage, Dow Jones)

### Priority 6: Email Notifications 📧
Create email templates for:
- Welcome email (account created after verification)
- Visit confirmation
- Verification under review
- Verification completed
- Proposal received

### Priority 7: Build & Test 🧪
```powershell
cd c:\projetos\publimicro
pnpm turbo build --filter=@publimicro/publimicro
# Fix TypeScript errors
# Target: 0 errors across 59 routes
```

### Priority 8: Final Commit 📦
```bash
git add .
git commit -m "feat: complete verification ecosystem redesign + premium branding"
git push origin main
```

---

## ✅ Testing Checklist

### Guest Visit Scheduling
- [ ] Guest fills form with CPF and birth_date
- [ ] CPF validation works (checksum algorithm)
- [ ] Background check runs automatically
- [ ] If approved → Account created + Email sent
- [ ] If rejected → Generic error shown (no details)
- [ ] If needs review → "Under review" message shown

### Authenticated Visit Scheduling
- [ ] Form pre-filled with user data
- [ ] Personal fields disabled (nome, email, CPF)
- [ ] Visit scheduled without background checks
- [ ] Immediate confirmation

### Signup Flow
- [ ] User fills signup form
- [ ] Background checks run before account creation
- [ ] If approved → Account created immediately
- [ ] If rejected → Generic error (don't reveal why)
- [ ] If needs review → "Under review" message

### Permission System
- [ ] New users have `can_place_bids: false`
- [ ] New users have `can_schedule_visits: true`
- [ ] After background check passes → `can_place_bids: true` (via trigger)
- [ ] Proposals blocked until verification complete

### UI/UX
- [ ] No mention of "Federal Police" or "Interpol" in user-facing UI
- [ ] Generic verification messages ("Verificação em andamento")
- [ ] Premium logo displays correctly
- [ ] All bronze/gold colors applied (no white/blue)
- [ ] Loading states show spinner
- [ ] Success messages are clear
- [ ] Error messages are helpful but don't reveal security details

---

## 📚 Documentation References

- **Verification Flow:** This document
- **Database Schema:** `supabase/migrations/20251107000003_pending_verifications_system.sql`
- **API Routes:** See `/api/signup`, `/api/verify-cpf`, `/api/background-check`, `/api/schedule-visit`
- **Component Guide:** See `VisitScheduler.tsx`, `AchemeLogo.tsx`, `ProposalModal.tsx`
- **Color Palette:** See project copilot-instructions.md
- **Deployment:** See `VERCEL-SETUP.md`

---

## 🔍 Troubleshooting

### "CPF already registered"
**Cause:** CPF exists in `user_profiles` table  
**Solution:** User should use "Entrar" (login) instead of signup

### "Verification under review"
**Cause:** Background check returned `needs_review` status  
**Solution:** Admin must manually review in `/admin/verifications`

### "Unable to process registration"
**Cause:** Background check failed (criminal record or wanted status)  
**Solution:** Silent rejection - user sees generic error

### Guest visit not creating account
**Cause:** Missing `birth_date` in visit request  
**Solution:** Ensure `birth_date` field is collected for guest users

### Background check API errors
**Cause:** Federal Police or Interpol API down  
**Solution:** System automatically flags as `needs_review` for manual admin check

---

## 🎉 Summary

This redesign creates a **sophisticated yet simple** system that:

✅ **Prioritizes security** - Background checks happen BEFORE account creation  
✅ **Removes friction** - Guests can schedule visits without creating accounts  
✅ **Protects privacy** - Verification checks are completely internal  
✅ **Streamlines UX** - Auto-account creation when checks pass  
✅ **Maintains compliance** - Full audit trail in verification_logs  
✅ **Premium branding** - Stunning emu logo with metallic bronze/gold palette  

**Next Action:** Run migration `20251107000003` in Supabase, then continue with property card updates and systematic color replacement! 🚀
