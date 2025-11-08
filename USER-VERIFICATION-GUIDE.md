# PubliMicro - User Verification & Background Check System
**Date:** November 7, 2025

## 🛡️ Overview

Comprehensive user verification system with **automated background checks** that runs BEFORE allowing subscriptions or premium features. This protects the platform and ensures a safe marketplace.

---

## 🔍 Verification Flow

### 1. User Signs Up
```
User creates account → Email verification (Supabase) → Profile creation
```

### 2. Verification Request
When user tries to:
- ✅ Upgrade to Premium/Pro subscription
- ✅ Purchase enhancement (Highlight/Marketing)
- ✅ Post high-value items (R$ 10,000+)
- ✅ Become verified seller

**System automatically starts verification process**

### 3. Document Upload
User provides:
- ✅ CPF (Brazilian tax ID)
- ✅ Government-issued ID (RG, CNH, or Passport)
- ✅ Selfie holding ID (liveness check)
- ✅ Proof of address (utility bill)
- ✅ Phone number (SMS verification)

### 4. Automated Checks (2-5 minutes)
```sql
status: 'pending' → 'checking'
```

**System automatically runs:**

#### A. CPF Validation
- ✅ Format validation (XXX.XXX.XXX-XX)
- ✅ Check digit validation
- ✅ Status check via Receita Federal API
- ✅ Cross-reference with official databases

#### B. Criminal Background Check
**Integration with:** Serpro, Polícia Federal, Tribunal de Justiça

**Results:**
- `clean` - No criminal record ✅ **AUTO-APPROVE**
- `minor_offenses` - Traffic violations only ✅ **AUTO-APPROVE**
- `pending_cases` - Has pending legal cases ⚠️ **MANUAL REVIEW**
- `criminal_history` - Past convictions ⚠️ **MANUAL REVIEW**
- `serious_crimes` - Serious convictions ❌ **AUTO-REJECT**

#### C. Credit Check (Optional)
**Integration with:** Serasa, SPC Brasil

**Used for:** Users wanting to offer payment plans or rent/lease

#### D. Document Authenticity
- ✅ OCR extraction from ID
- ✅ Hologram/watermark detection
- ✅ Data cross-validation

#### E. Facial Recognition
- ✅ Compare selfie with ID photo
- ✅ Liveness detection (not a photo of photo)
- ✅ Match score: 70%+ required

#### F. Risk Scoring
Automated calculation (0-100):
- 0-29: **Low risk** → Auto-approve
- 30-49: **Medium risk** → Manual review
- 50-69: **High risk** → Manual review
- 70-100: **Critical risk** → Auto-reject or intensive review

### 5. Automated Decision

```sql
-- AUTO-APPROVE CONDITIONS (status → 'approved')
- criminal_record_status = 'clean'
- cpf_valid = true
- risk_score < 30
- face_match_score >= 70%
- liveness_check_passed = true
- email_verified = true
- phone_verified = true

-- AUTO-REJECT CONDITIONS (status → 'rejected')
- criminal_record_status = 'serious_crimes'
- cpf_valid = false
- age < 18
- face_match_score < 50%
- document validation failed

-- MANUAL REVIEW (status → 'manual_review')
- criminal_record_status IN ('pending_cases', 'criminal_history')
- risk_score >= 30
- Face match 50-70% (borderline)
- Conflicting data
```

### 6. Manual Review (If Needed)
Admin reviews:
- ✅ Uploaded documents
- ✅ Criminal history details
- ✅ Risk factors
- ✅ User appeal (if any)

**Decision:** Approve, Reject, or Request more info

### 7. Result Notification
User receives email/SMS:
- ✅ **Approved** → Can now subscribe/purchase
- ❌ **Rejected** → Reason + appeal option
- ⏳ **In Review** → ETA for decision

---

## 📋 Verification Rules Engine

### Default Rules (Priority Order)

| Priority | Rule | Condition | Action | Reason |
|----------|------|-----------|--------|--------|
| 100 | Reject serious crimes | `criminal_record_status = 'serious_crimes'` | ❌ Auto-reject | Platform safety |
| 100 | Reject underage | `age < 18` | ❌ Auto-reject | Legal requirement |
| 95 | Reject invalid documents | `cpf_valid = false` | ❌ Auto-reject | Identity fraud |
| 90 | Review pending cases | `criminal_record_status = 'pending_cases'` | ⚠️ Manual review | Case-by-case basis |
| 85 | Review criminal history | `criminal_record_status = 'criminal_history'` | ⚠️ Manual review | Assess severity |
| 80 | Auto-approve clean | `criminal_record_status = 'clean' AND cpf_valid = true` | ✅ Auto-approve | Safe user |
| 75 | Review high risk | `risk_score >= 70` | ⚠️ Manual review | High risk profile |

### Custom Rules

Admins can add custom rules via database:

```sql
INSERT INTO verification_rules (
  rule_name,
  rule_type,
  condition,
  action,
  priority,
  description
) VALUES (
  'Reject multiple fraudulent accounts',
  'fraud_detection',
  '{"has_multiple_accounts": true, "previous_fraud_flag": true}',
  'auto_reject',
  95,
  'User previously flagged for fraud with multiple accounts'
);
```

---

## 🔗 Integration with Other Systems

### Subscription System
```typescript
// Before creating subscription
const verification = await checkUserVerification(userId);

if (verification.status !== 'approved') {
  if (verification.status === 'pending' || verification.status === 'checking') {
    return { error: 'Verificação em andamento. Aguarde aprovação.' };
  }
  
  // Start verification process
  return {
    error: 'Verificação necessária',
    action: 'start_verification',
    redirectTo: '/verificacao/iniciar'
  };
}

// Proceed with subscription...
```

### Enhancement Purchases
```typescript
// Before creating Stripe checkout for highlight/marketing
if (!isUserVerified(userId)) {
  // Only require verification for high-value purchases (R$ 100+)
  if (enhancementPrice >= 100) {
    return redirectToVerification();
  }
}
```

### Announcement Publishing
```typescript
// Free tier: No verification needed
// Premium/Pro: Verification required
// High-value items (R$ 10k+): Verification required

if (userTier !== 'free' || announcementPrice > 10000) {
  requireVerification();
}
```

---

## 📊 Database Schema

### Tables
1. **`user_verifications`** - Main verification data
2. **`verification_rules`** - Configurable approval/rejection rules
3. **`verification_audit_log`** - Complete audit trail

### Key Fields

#### `user_verifications.status`
- `pending` - Initial state
- `checking` - Automated checks running
- `approved` - ✅ Verified
- `manual_review` - ⚠️ Needs admin review
- `rejected` - ❌ Denied
- `suspended` - Previously approved, now suspended
- `appealing` - User submitted appeal

#### `criminal_record_status`
- `not_checked` - Check not yet run
- `clean` - No record
- `minor_offenses` - Traffic violations, etc.
- `pending_cases` - Active legal cases
- `criminal_history` - Past convictions
- `serious_crimes` - Serious offenses

#### `risk_score` (0-100)
Automatically calculated based on:
- Criminal record: 0-50 points
- Credit status: 0-25 points
- Document validation: 0-30 points
- Face match: 0-20 points
- Email/phone verification: 0-10 points each

---

## 🔐 Security & Privacy

### Data Protection
- ✅ CPF encrypted at rest (use Supabase Vault in production)
- ✅ Documents stored in private Supabase Storage bucket
- ✅ PII (Personal Identifiable Information) access logged
- ✅ LGPD (Brazilian GDPR) compliant

### Access Control
- ✅ Users can only view their own verification
- ✅ Admins have audit log access
- ✅ RLS (Row Level Security) enforced
- ✅ Document URLs expire after 24 hours

### Compliance
- ✅ LGPD Article 7: Data processing legal basis
- ✅ LGPD Article 9: User consent for sensitive data
- ✅ Right to access (download verification data)
- ✅ Right to deletion (GDPR/LGPD compliance)

---

## 🛠️ External Service Integrations

### Required APIs

#### 1. ReceitaWS (Free) - CPF Validation
```
GET https://www.receitaws.com.br/v1/cnpj/{cpf}
```
**Free tier:** 3 requests/minute

#### 2. Serpro (Government) - Official CPF Check
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cpf/v1/cpf/{cpf}
```
**Pricing:** R$ 0.10 per query
**Setup:** https://www.serpro.gov.br/menu/contato

#### 3. Serasa Experian - Credit & Background Check
```
POST https://api.serasaexperian.com.br/v1/background-check
```
**Pricing:** R$ 5-15 per comprehensive check
**Setup:** https://www.serasa.com.br/empresa/

#### 4. AWS Rekognition - Face Matching
```
POST https://rekognition.us-east-1.amazonaws.com/
```
**Pricing:** $0.001 per image
**Features:** Face comparison, liveness detection

#### 5. Twilio - SMS Verification
```
POST https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages
```
**Pricing:** $0.04 per SMS (Brazil)

---

## 📱 User Experience

### Verification Steps UI

#### Step 1: Initial Prompt
```
┌─────────────────────────────────────────┐
│ 🛡️ Verificação de Identidade           │
├─────────────────────────────────────────┤
│ Para garantir a segurança da            │
│ plataforma, precisamos verificar sua    │
│ identidade antes de prosseguir.         │
│                                         │
│ O processo leva apenas 3-5 minutos.    │
│                                         │
│ [Iniciar Verificação] [Depois]         │
└─────────────────────────────────────────┘
```

#### Step 2: Document Upload
```
┌─────────────────────────────────────────┐
│ 📄 Envie seus Documentos                │
├─────────────────────────────────────────┤
│ ✅ CPF                                   │
│ [___.___.___-__]                        │
│                                         │
│ ✅ Documento com Foto                    │
│ [Upload RG/CNH/Passaporte - Frente]    │
│ [Upload Verso (se aplicável)]           │
│                                         │
│ ✅ Selfie Segurando Documento            │
│ [Tirar Foto Agora]                      │
│                                         │
│ [Continuar →]                           │
└─────────────────────────────────────────┘
```

#### Step 3: Processing
```
┌─────────────────────────────────────────┐
│ ⏳ Verificando suas Informações...      │
├─────────────────────────────────────────┤
│ ✅ Validando CPF                         │
│ ✅ Consultando antecedentes             │
│ ⏳ Verificando documentos...            │
│ ⏳ Analisando foto...                   │
│                                         │
│ [████████░░░░] 60%                      │
│                                         │
│ Aguarde, isso pode levar 2-3 minutos   │
└─────────────────────────────────────────┘
```

#### Step 4: Result

**✅ Approved:**
```
┌─────────────────────────────────────────┐
│ ✅ Verificação Aprovada!                 │
├─────────────────────────────────────────┤
│ Sua identidade foi verificada com       │
│ sucesso. Agora você pode acessar todos  │
│ os recursos da plataforma.              │
│                                         │
│ 🎉 Badge "Vendedor Verificado" ativo    │
│                                         │
│ [Continuar para Assinatura →]          │
└─────────────────────────────────────────┘
```

**⚠️ Manual Review:**
```
┌─────────────────────────────────────────┐
│ ⏳ Em Análise                            │
├─────────────────────────────────────────┤
│ Seus documentos estão sendo analisados  │
│ por nossa equipe. Você receberá um      │
│ e-mail em até 24 horas.                 │
│                                         │
│ Motivo: Análise adicional necessária    │
│                                         │
│ [OK, Entendi]                           │
└─────────────────────────────────────────┘
```

**❌ Rejected:**
```
┌─────────────────────────────────────────┐
│ ❌ Verificação Não Aprovada              │
├─────────────────────────────────────────┤
│ Infelizmente não foi possível aprovar   │
│ sua verificação neste momento.          │
│                                         │
│ Motivo: Documentos inválidos            │
│                                         │
│ Você pode:                              │
│ • Enviar novos documentos               │
│ • Entrar em contato com suporte         │
│ • Solicitar recurso                     │
│                                         │
│ [Tentar Novamente] [Recurso] [Suporte] │
└─────────────────────────────────────────┘
```

---

## 🚀 Implementation Steps

### 1. Run Migration
```sql
-- Run in Supabase SQL Editor
-- File: 20251107000003_create_user_verification_system.sql
```

### 2. Setup External Services
- [ ] Create Serpro API account
- [ ] Create Serasa API account
- [ ] Setup AWS Rekognition
- [ ] Setup Twilio SMS

### 3. Environment Variables
```bash
# .env.local
SERPRO_API_KEY=...
SERPRO_API_URL=https://gateway.apiserpro.serpro.gov.br
SERASA_API_KEY=...
SERASA_API_URL=https://api.serasaexperian.com.br
AWS_REKOGNITION_ACCESS_KEY=...
AWS_REKOGNITION_SECRET_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

### 4. Create API Routes
- `POST /api/verification/start` - Initialize verification
- `POST /api/verification/upload-documents` - Upload docs
- `POST /api/verification/check-status` - Get status
- `POST /api/verification/appeal` - Submit appeal
- `GET /api/admin/verifications/pending` - Admin queue

### 5. Background Jobs
```typescript
// Cron job to run checks
// Every 5 minutes: Process pending verifications
// Every hour: Check for expired verifications
// Daily: Re-verify high-risk users
```

---

## 💰 Cost Estimate

**Per verification:**
- CPF check (Serpro): R$ 0.10
- Background check (Serasa): R$ 10.00
- Face recognition (AWS): R$ 0.01
- SMS verification: R$ 0.20
**Total: ~R$ 10.31 per full verification**

**Monthly (100 verifications):**
- Total cost: R$ 1,031
- Revenue from 100 Premium subs: R$ 3,990
- **ROI: 287%**

---

**Status:** Ready to deploy! Run migration then integrate external services. 🛡️
