# 🧪 Verification System Testing Guide

## Prerequisites
- ✅ Dev server running: `pnpm dev:publimicro`
- ✅ Supabase project configured
- ✅ `.env.local` has all keys (Supabase + Stripe)
- ✅ Database migrations applied
- ✅ `verification-documents` storage bucket created
- ✅ RLS policies applied

## Test Scenarios

### 1️⃣ User Verification Flow (Happy Path)

**Steps:**
1. Navigate to: `http://localhost:3000/verificacao`
2. If not logged in → Should redirect to `/entrar?redirect=/verificacao`
3. Login/Signup, then return to `/verificacao`
4. **Step 1 - Personal Info:**
   - Fill name, CPF (format: 000.000.000-00)
   - Date of birth (must be 18+)
   - Phone number (format: (11) 99999-9999)
   - Click "Próximo"
5. **Step 2 - Documents:**
   - Select document type (RG/CNH/Passport/CPF)
   - Enter document number
   - Upload front photo (max 5MB, JPG/PNG)
   - Upload back photo (if RG)
   - Upload selfie with document
   - Click "Enviar Documentos"
6. **Step 3 - Processing:**
   - Watch automated checks run:
     - CPF validation
     - Criminal background check
   - Status polls every 3 seconds
7. **Step 4 - Result:**
   - Should see one of:
     - ✅ **Approved** → "Verificação Aprovada!"
     - ⏳ **Manual Review** → "Verificação em Análise Manual"
     - ❌ **Rejected** → "Verificação Não Aprovada"

**Expected Database Changes:**
```sql
-- Check verification was created
SELECT * FROM user_verifications WHERE user_id = 'your-user-id';

-- Check profile was updated
SELECT verification_status, verified_at FROM user_profiles WHERE user_id = 'your-user-id';
```

### 2️⃣ Admin Verification Queue

**Setup:**
First, make yourself admin:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

**Steps:**
1. Navigate to: `http://localhost:3000/admin/verificacoes`
2. If not admin → Should redirect to home
3. If admin → See queue dashboard with:
   - Stats (pending, approved today, rejected today, total)
   - Filters (status dropdown + search)
   - Verification table
4. **Click "Ver Documentos"** on any verification:
   - Should open modal with all photos
   - User info displayed
   - Automated check results shown
5. **Test Approve:**
   - Click "Aprovar"
   - Add optional notes
   - Click "Confirmar Aprovação"
   - Verification should disappear from "Manual Review" filter
   - User's `verification_status` updated to `approved`
6. **Test Reject:**
   - Click "Rejeitar"
   - Select rejection reason (required)
   - Add optional notes
   - Click "Confirmar Rejeição"
   - User's `verification_status` updated to `rejected`

**Expected Behavior:**
- Only users with `role = 'admin'` can access
- Photos load from Supabase Storage
- Actions update both `user_verifications` and `user_profiles` tables
- Stats refresh after approve/reject

### 3️⃣ Subscription Integration (Verification Gate)

**Test Unverified User:**
1. Create new account (or use account with `verification_status != 'approved'`)
2. Navigate to: `http://localhost:3000/assinatura`
3. Should see:
   - Pricing plans displayed
   - **Básico** plan → "Plano Atual" (no verification needed)
   - **Profissional/Empresarial** → "🔐 Verificar para Assinar" button
4. Click "🔐 Verificar para Assinar"
   - Should redirect to `/verificacao`
5. Try to call API directly:
```javascript
fetch('/api/subscriptions/create-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ priceId: 'price_xxx' })
})
// Expected: 403 Forbidden with requiresVerification: true
```

**Test Verified User:**
1. Use verified account (`verification_status = 'approved'`)
2. Navigate to: `http://localhost:3000/assinatura`
3. Should see:
   - ✓ Verified badge at top
   - Premium plans show "Assinar Agora" button
4. Click "Assinar Agora":
   - Should redirect to Stripe Checkout
   - Complete payment
   - Redirect to `/assinatura/sucesso`

### 4️⃣ Edge Cases to Test

**Verification Status States:**
```sql
-- Test each status manually:
UPDATE user_profiles SET verification_status = 'not_started' WHERE user_id = 'xxx';
UPDATE user_profiles SET verification_status = 'pending' WHERE user_id = 'xxx';
UPDATE user_profiles SET verification_status = 'manual_review' WHERE user_id = 'xxx';
UPDATE user_profiles SET verification_status = 'approved' WHERE user_id = 'xxx';
UPDATE user_profiles SET verification_status = 'rejected' WHERE user_id = 'xxx';
```

Each status should show different UI in `/assinatura`:
- `not_started` → "Verificar para Assinar"
- `pending` → "Verificação em Andamento..."
- `manual_review` → "Verificação em Análise (até 24h)"
- `approved` → "Assinar Agora" + verified badge
- `rejected` → "Verificação Rejeitada - Tentar Novamente"

**File Upload Edge Cases:**
- Upload file > 5MB → Should show error
- Upload non-image file → Should show error
- Upload without selecting document type → Should show validation error
- Try to submit without required fields → Should show validation errors

**Admin Queue Edge Cases:**
- Search by partial CPF → Should filter results
- Search by partial name → Should filter results
- Filter by status → Should show only matching verifications
- Try to approve already approved verification → Should handle gracefully
- Try to reject without reason → Should show error

### 5️⃣ Automated Checks Testing

**CPF Check Scenarios:**
Mock responses are in `/api/verification/cpf-check/route.ts`:
- Valid CPF format → Returns `valid`
- Invalid format → Returns `invalid`

**Criminal Check Scenarios:**
Mock responses are in `/api/verification/criminal-check/route.ts`:
- Clean record → Auto-approves
- Minor offenses → Sends to manual review
- Serious crimes → Auto-rejects

**Auto-Approval Rules:**
```typescript
// In /api/verification/start/route.ts
if (cpfValid && criminalClean) {
  status = 'approved'; // Instant approval
}
```

**Auto-Rejection Rules:**
```typescript
if (seriousCrimes) {
  status = 'rejected';
  rejection_reason = 'Antecedentes criminais graves detectados';
}
```

**Manual Review Rules:**
```typescript
if (minorOffenses || cpfIssues) {
  status = 'manual_review'; // Admin must review
}
```

## Verification Flow Diagram

```
User Signup
    ↓
Tries to Subscribe → /assinatura
    ↓
Not Verified? → Redirect to /verificacao
    ↓
Step 1: Personal Info (CPF, DOB, Phone)
    ↓
Step 2: Upload Documents (ID + Selfie)
    ↓
Step 3: Automated Checks
    ├─→ CPF Check (Serpro API - mocked in dev)
    └─→ Criminal Check (Serasa API - mocked in dev)
    ↓
Automated Decision:
    ├─→ Clean Record → ✅ Auto-Approve
    ├─→ Minor Issues → ⏳ Manual Review
    └─→ Serious Issues → ❌ Auto-Reject
    ↓
If Manual Review:
    ├─→ Admin opens /admin/verificacoes
    ├─→ Views documents + check results
    └─→ Approves or Rejects with notes
    ↓
If Approved:
    ├─→ User returns to /assinatura
    ├─→ Sees "Assinar Agora" button
    ├─→ Completes Stripe checkout
    └─→ Premium features unlocked! 🎉
```

## Common Issues & Solutions

### Issue: "Bucket not found"
**Solution:** Create bucket in Supabase Dashboard:
```
Storage → New Bucket
Name: verification-documents
Public: OFF (private)
```

### Issue: "Policy already exists"
**Solution:** Drop existing policies first:
```sql
DROP POLICY IF EXISTS "Users can upload own verification documents" ON storage.objects;
-- Then re-run the policies from verification-storage-policies.sql
```

### Issue: "Admin access denied"
**Solution:** Verify role in database:
```sql
SELECT role FROM user_profiles WHERE email = 'your-email@example.com';
-- Should return 'admin'
```

### Issue: "Photos not loading in admin queue"
**Solution:** Check RLS policies allow service_role to view:
```sql
-- Policy 5 should exist:
SELECT * FROM pg_policies 
WHERE policyname = 'Service role can view all verification documents';
```

### Issue: "Checkout API returns 403"
**Solution:** Check user verification status:
```sql
SELECT verification_status FROM user_profiles WHERE user_id = 'xxx';
-- Must be 'approved' to create subscription checkout
```

## Testing Checklist

- [ ] User can access `/verificacao` (redirects if not logged in)
- [ ] CPF formatting works (000.000.000-00)
- [ ] Phone formatting works ((11) 99999-9999)
- [ ] Age validation works (must be 18+)
- [ ] File upload accepts images only
- [ ] File size validation works (max 5MB)
- [ ] Document back photo is optional for non-RG documents
- [ ] Automated checks run and display status
- [ ] Status polling works (checks every 3 seconds)
- [ ] Result page shows correct outcome
- [ ] Admin queue requires admin role
- [ ] Admin can view all documents
- [ ] Admin can approve with notes
- [ ] Admin can reject with reason
- [ ] Unverified users see "Verificar para Assinar"
- [ ] Verified users see "Assinar Agora"
- [ ] Checkout API blocks unverified users (403)
- [ ] Checkout API allows verified users
- [ ] Success page displays after payment

## Next Steps (Production)

1. **Setup Stripe Webhook:**
   - Dashboard → Developers → Webhooks
   - Add endpoint: `https://publimicro.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, etc.
   - Copy signing secret to `.env.local`

2. **External APIs (when ready to go live):**
   - Serpro (CPF): https://www.serpro.gov.br/
   - Serasa (Background checks): Contact sales

3. **Email Notifications:**
   - Configure in `/api/admin/verifications/[id]/approve/route.ts`
   - Use Resend, SendGrid, or similar
   - Send on approve/reject with status update

4. **Monitoring:**
   - Add logging for verification events
   - Track approval/rejection rates
   - Monitor manual review queue length
   - Alert if queue grows too large

---

**🎉 Ready to test! Start your dev server and work through scenarios 1-5 above.**
