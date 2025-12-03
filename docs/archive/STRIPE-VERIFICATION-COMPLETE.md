# Stripe + Verification System - Implementation Complete ✅

## 🎉 What's Been Built

### 1. Database (13 Tables Total)
- ✅ **9 Announcement System Tables** (subscriptions, credits, announcements, etc.)
- ✅ **1 Listing Enhancements Table** (highlight, organic marketing, bundles)
- ✅ **3 Verification Tables** (user_verifications, verification_rules, audit_log)

### 2. Stripe Products (11 Total)
All created in your Stripe test account:

**Enhancement Products (9):**
| Category | Highlight 30d | Organic Marketing | Bundle |
|----------|--------------|-------------------|--------|
| Items (AcheMeCoisas, Outdoor, Travel, Global, Shared) | R$ 12.00 | R$ 70.00 | R$ 75.00 |
| Motors (AcheMeMotors, Machina, Marine) | R$ 20.00 | R$ 120.00 | R$ 130.00 |
| Properties (AcheMeProper) | R$ 30.00 | R$ 180.00 | R$ 195.00 |

**Subscription Products (2):**
- Premium: R$ 39.90/month (7-day trial)
- Pro: R$ 99.90/month

### 3. Verification API Routes (5)
All located in `apps/publimicro/src/app/api/verification/`:

1. **POST /api/verification/start** - Initialize verification with CPF, name, DOB
2. **POST /api/verification/upload-documents** - Upload ID photos + selfie to Supabase Storage
3. **POST /api/verification/check-cpf** - Validate CPF with Serpro (Brazilian gov)
4. **POST /api/verification/check-criminal** - Background check with Serasa Experian
5. **GET /api/verification/status** - Check verification progress

**Dev Mode:** All routes work without API keys (use mocks for testing)

### 4. Enhancement Purchase APIs (2)
1. **POST /api/enhancements/create-checkout**
   - Checks if user is verified ✅
   - Blocks unverified users (returns 403)
   - Creates Stripe checkout session
   - Redirects to Stripe payment page

2. **POST /api/webhooks/stripe-enhancements**
   - Receives Stripe webhook events
   - Creates `listing_enhancements` records
   - Activates highlights automatically (30 days)
   - Marks marketing campaigns as pending

### 5. Configuration Files
- ✅ `enhancementPricing.ts` - Price IDs updated
- ✅ `subscriptionPricing.ts` - Subscription price IDs updated

---

## 🔐 Security Flow

### Purchase Flow (Enforced)
```
User tries to buy enhancement
  ↓
Check user_verifications table
  ↓
Status = 'approved'? 
  ├─ YES → Create Stripe checkout ✅
  └─ NO  → Redirect to /verificacao ❌
```

### Verification Flow (Automated)
```
User submits documents
  ↓
Check CPF with Serpro
  ↓
Check criminal record with Serasa
  ↓
Calculate risk score (0-100)
  ↓
Apply verification rules:
  ├─ Clean record + valid CPF → AUTO-APPROVE ✅
  ├─ Serious crimes → AUTO-REJECT ❌
  └─ Borderline → MANUAL REVIEW ⏳
```

---

## 📋 Next Steps

### Required for Production:

#### 1. Setup Stripe Webhook
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe-enhancements`
4. Events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
   ```

#### 2. Setup External API Accounts

**Serpro (CPF Validation):**
- Website: https://www.serpro.gov.br/
- Cost: ~R$ 0.10 per CPF query
- Add to `.env.local`:
  ```
  SERPRO_API_KEY=your_serpro_key
  ```

**Serasa Experian (Background Checks):**
- Website: https://desenvolvedores.serasaexperian.com.br/
- Cost: R$ 5-15 per background check
- Add to `.env.local`:
  ```
  SERASA_API_KEY=your_serasa_key
  SERASA_API_SECRET=your_serasa_secret
  ```

**AWS Rekognition (Face Matching - Optional):**
- Website: https://aws.amazon.com/rekognition/
- Cost: $0.001 per image
- Add to `.env.local`:
  ```
  AWS_ACCESS_KEY_ID=your_aws_key
  AWS_SECRET_ACCESS_KEY=your_aws_secret
  AWS_REGION=us-east-1
  ```

**Twilio (SMS Verification - Optional):**
- Website: https://www.twilio.com/
- Cost: ~R$ 0.20 per SMS
- Add to `.env.local`:
  ```
  TWILIO_ACCOUNT_SID=your_twilio_sid
  TWILIO_AUTH_TOKEN=your_twilio_token
  TWILIO_PHONE_NUMBER=+551199999999
  ```

#### 3. Add to Supabase Storage

Create storage bucket for verification documents:
1. Go to Supabase Dashboard → Storage
2. Create new bucket: `verification-documents`
3. Set as **private** (only authenticated users)
4. Add RLS policy:
   ```sql
   -- Users can upload their own documents
   CREATE POLICY "Users can upload own documents"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'verification-documents' 
     AND (storage.foldername(name))[1] = auth.uid()::text
   );
   
   -- Users can view their own documents
   CREATE POLICY "Users can view own documents"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (
     bucket_id = 'verification-documents'
     AND (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

---

## 🧪 Testing

### Test Verification Flow (Development)
```bash
# All APIs work without external service keys
# They use mock responses

# 1. Start verification
curl -X POST http://localhost:3000/api/verification/start \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "João Silva",
    "cpf": "12345678900",
    "date_of_birth": "1990-01-01"
  }'

# 2. Check status
curl http://localhost:3000/api/verification/status \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

### Test Stripe Checkout
```bash
# Will return 403 if user not verified
curl -X POST http://localhost:3000/api/enhancements/create-checkout \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "announcement_id": "some-uuid",
    "category": "items",
    "enhancement_type": "highlight"
  }'
```

### Stripe Test Cards
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires authentication:** 4000 0025 0000 3155

---

## 💰 Cost Breakdown

### Per Verified User:
- Serpro CPF check: R$ 0.10
- Serasa background check: R$ 10.00
- AWS Rekognition (optional): R$ 0.01
- Twilio SMS (optional): R$ 0.20
- **Total: ~R$ 10.31 per verification**

### Per Enhancement Sale:
- Stripe fee: 3.99% + R$ 0.39
- Example: R$ 12.00 sale → You keep R$ 10.92

### Per Subscription:
- Same Stripe fee structure
- Example: R$ 39.90/month → You keep R$ 37.51/month

---

## 🎨 Remaining UI Work

1. **Verification UI (`/verificacao` page)**
   - 4-step wizard: Personal Info → Documents → Photo → Processing
   - Document upload with preview
   - Real-time status updates
   - Success/rejection screens

2. **Admin Verification Queue (`/admin/verificacoes`)**
   - List pending verifications
   - Review documents side-by-side
   - Approve/reject with notes
   - Filter by risk level

3. **Enhancement Purchase UI**
   - "Buy Highlight" button on listing page
   - Shows verification requirement if not verified
   - Redirects to Stripe checkout
   - Success confirmation page

4. **Integration Points**
   - Block subscription upgrades for unverified users
   - Show "Verify to unlock" badges
   - Add verification status to user profile

---

## ✅ What Works Right Now

1. ✅ Database fully migrated
2. ✅ All Stripe products created
3. ✅ Verification APIs functional (dev mode)
4. ✅ Checkout API blocks unverified users
5. ✅ Webhook handler ready for payments
6. ✅ Auto-approve/reject rules working
7. ✅ Risk scoring algorithm active

---

## 📞 Support

For issues:
1. Check Supabase logs: Dashboard → Logs
2. Check Stripe logs: Dashboard → Developers → Webhooks → Logs
3. Check API route logs in terminal
4. Verify environment variables are set

---

**Status:** Backend 100% complete. Frontend UI pending.
**Ready for:** Testing verification flow + building UI components
