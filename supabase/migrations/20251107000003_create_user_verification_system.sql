-- PubliMicro User Verification & Background Check System
-- Migration: Add user verification with automatic and manual approval workflows
-- Date: 2025-11-07

-- =============================================
-- USER VERIFICATION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Verification Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',          -- Initial state, awaiting checks
    'checking',         -- Automated checks in progress
    'approved',         -- All checks passed, user verified
    'manual_review',    -- Flagged for manual review
    'rejected',         -- Verification rejected
    'suspended',        -- Previously approved, now suspended
    'appealing'         -- User appealed rejection
  )),
  
  -- Personal Information (for verification)
  full_name VARCHAR(200),
  cpf VARCHAR(14), -- Brazilian CPF (encrypted in production)
  date_of_birth DATE,
  
  -- Document Verification
  document_type VARCHAR(20) CHECK (document_type IN ('cpf', 'rg', 'cnh', 'passport')),
  document_number VARCHAR(50),
  document_front_url TEXT, -- Supabase Storage URL
  document_back_url TEXT,
  selfie_url TEXT, -- Selfie with document for verification
  
  -- Address Verification
  address_street TEXT,
  address_number VARCHAR(10),
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city VARCHAR(100),
  address_state VARCHAR(2),
  address_cep VARCHAR(9),
  proof_of_address_url TEXT, -- Utility bill, etc.
  
  -- Automated Checks Results
  cpf_valid BOOLEAN, -- CPF validation check
  cpf_status VARCHAR(50), -- 'regular', 'pending_issues', 'suspended', etc.
  
  -- Background Check Results (Integration with Brazilian systems)
  criminal_record_status VARCHAR(20) CHECK (criminal_record_status IN (
    'not_checked',
    'clean',              -- No criminal record
    'minor_offenses',     -- Traffic violations, minor issues
    'pending_cases',      -- Has pending legal cases
    'criminal_history',   -- Has criminal convictions
    'serious_crimes'      -- Serious criminal history
  )) DEFAULT 'not_checked',
  
  criminal_record_details JSONB DEFAULT '{}'::jsonb,
  criminal_check_date TIMESTAMP WITH TIME ZONE,
  
  -- Credit Check (optional, for financial transactions)
  credit_score INT CHECK (credit_score BETWEEN 0 AND 1000),
  credit_status VARCHAR(20) CHECK (credit_status IN (
    'not_checked',
    'excellent',     -- 800-1000
    'good',          -- 600-799
    'fair',          -- 400-599
    'poor',          -- 0-399
    'restricted'     -- Credit restrictions (SPC/Serasa)
  )) DEFAULT 'not_checked',
  
  credit_restrictions JSONB DEFAULT '[]'::jsonb, -- Array of restrictions
  credit_check_date TIMESTAMP WITH TIME ZONE,
  
  -- Facial Recognition / Liveness Check
  face_match_score DECIMAL(5,2), -- 0-100%, document photo vs selfie
  liveness_check_passed BOOLEAN,
  
  -- Phone Verification
  phone_number VARCHAR(20),
  phone_verified BOOLEAN DEFAULT FALSE,
  phone_verification_code VARCHAR(6),
  phone_verification_sent_at TIMESTAMP WITH TIME ZONE,
  phone_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Email Verification (from Supabase Auth)
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Risk Scoring (Automated)
  risk_score INT DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100), -- 0=low risk, 100=high risk
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_factors JSONB DEFAULT '[]'::jsonb, -- Array of risk indicators
  
  -- Manual Review
  requires_manual_review BOOLEAN DEFAULT FALSE,
  manual_review_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id), -- Admin who reviewed
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  
  -- Rejection Details
  rejection_reason VARCHAR(100) CHECK (rejection_reason IN (
    'criminal_history',
    'invalid_documents',
    'fraud_suspicion',
    'multiple_accounts',
    'underage',
    'high_risk_profile',
    'failed_verification',
    'user_request',
    'other'
  )),
  rejection_details TEXT,
  rejected_at TIMESTAMP WITH TIME ZONE,
  
  -- Appeal Process
  appeal_count INT DEFAULT 0,
  last_appeal_at TIMESTAMP WITH TIME ZONE,
  appeal_reason TEXT,
  appeal_status VARCHAR(20) CHECK (appeal_status IN ('none', 'pending', 'approved', 'rejected')),
  
  -- Re-verification
  next_verification_due DATE, -- Some users may need periodic re-verification
  verification_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- External Service Integration
  external_check_id VARCHAR(255), -- ID from verification service (Serpro, Serasa, etc.)
  external_check_provider VARCHAR(50), -- 'serpro', 'serasa', 'receitaws', etc.
  external_check_response JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_user_verifications_user ON user_verifications(user_id);
CREATE INDEX idx_user_verifications_status ON user_verifications(status);
CREATE INDEX idx_user_verifications_cpf ON user_verifications(cpf) WHERE cpf IS NOT NULL;
CREATE INDEX idx_user_verifications_pending_review ON user_verifications(status, created_at) 
  WHERE status IN ('pending', 'manual_review');
CREATE INDEX idx_user_verifications_risk_level ON user_verifications(risk_level, risk_score DESC);

-- =============================================
-- VERIFICATION RULES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.verification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Rule Configuration
  rule_name VARCHAR(100) NOT NULL,
  rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN (
    'criminal_check',
    'document_validation',
    'age_verification',
    'credit_check',
    'fraud_detection',
    'risk_assessment'
  )),
  
  -- Rule Logic
  condition JSONB NOT NULL, -- Rule conditions (e.g., {"criminal_history": "serious_crimes"})
  action VARCHAR(20) NOT NULL CHECK (action IN (
    'auto_approve',
    'auto_reject',
    'manual_review',
    'flag_risk'
  )),
  
  priority INT DEFAULT 0, -- Higher priority rules execute first
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default Verification Rules
INSERT INTO verification_rules (rule_name, rule_type, condition, action, priority, description) VALUES
  ('Auto-reject serious crimes', 'criminal_check', '{"criminal_record_status": "serious_crimes"}', 'auto_reject', 100, 'Automatically reject users with serious criminal convictions'),
  ('Manual review pending cases', 'criminal_check', '{"criminal_record_status": "pending_cases"}', 'manual_review', 90, 'Send to manual review if user has pending legal cases'),
  ('Auto-approve clean record', 'criminal_check', '{"criminal_record_status": "clean", "cpf_valid": true}', 'auto_approve', 80, 'Automatically approve users with clean record and valid CPF'),
  ('Manual review criminal history', 'criminal_check', '{"criminal_record_status": "criminal_history"}', 'manual_review', 85, 'Manual review for users with any criminal history to assess severity'),
  ('Reject underage', 'age_verification', '{"age_below": 18}', 'auto_reject', 100, 'Reject users under 18 years old'),
  ('Flag high risk score', 'risk_assessment', '{"risk_score_above": 70}', 'manual_review', 75, 'Send high-risk users to manual review'),
  ('Reject invalid documents', 'document_validation', '{"document_valid": false}', 'auto_reject', 95, 'Reject if documents fail validation');

-- =============================================
-- VERIFICATION AUDIT LOG
-- =============================================
CREATE TABLE IF NOT EXISTS public.verification_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_verification_id UUID NOT NULL REFERENCES user_verifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Event Details
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
    'verification_started',
    'document_uploaded',
    'automated_check_completed',
    'status_changed',
    'manual_review_assigned',
    'approved',
    'rejected',
    'appeal_submitted',
    'appeal_reviewed',
    'suspended',
    'reactivated'
  )),
  
  old_status VARCHAR(20),
  new_status VARCHAR(20),
  
  -- Additional Data
  event_data JSONB DEFAULT '{}'::jsonb,
  
  -- Actor
  performed_by UUID REFERENCES auth.users(id), -- User or admin who triggered event
  performed_by_type VARCHAR(20) CHECK (performed_by_type IN ('user', 'admin', 'system')),
  
  -- Context
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_verification_audit_verification ON verification_audit_log(user_verification_id);
CREATE INDEX idx_verification_audit_user ON verification_audit_log(user_id);
CREATE INDEX idx_verification_audit_event ON verification_audit_log(event_type, created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification
CREATE POLICY "Users can view own verification" ON user_verifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own verification (documents, info)
CREATE POLICY "Users can update own verification" ON user_verifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own verification
CREATE POLICY "Users can insert own verification" ON user_verifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own audit log
CREATE POLICY "Users can view own audit log" ON verification_audit_log
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can view active verification rules
CREATE POLICY "Anyone can view active rules" ON verification_rules
  FOR SELECT TO authenticated
  USING (active = TRUE);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to calculate risk score automatically
CREATE OR REPLACE FUNCTION calculate_risk_score()
RETURNS TRIGGER AS $$
DECLARE
  score INT := 0;
  risk_factors_array JSONB := '[]'::jsonb;
BEGIN
  -- Criminal Record Risk
  CASE NEW.criminal_record_status
    WHEN 'serious_crimes' THEN 
      score := score + 50;
      risk_factors_array := risk_factors_array || '["serious_criminal_history"]'::jsonb;
    WHEN 'criminal_history' THEN 
      score := score + 30;
      risk_factors_array := risk_factors_array || '["criminal_history"]'::jsonb;
    WHEN 'pending_cases' THEN 
      score := score + 20;
      risk_factors_array := risk_factors_array || '["pending_legal_cases"]'::jsonb;
    WHEN 'minor_offenses' THEN 
      score := score + 10;
    ELSE 
      score := score + 0;
  END CASE;
  
  -- Credit Risk
  CASE NEW.credit_status
    WHEN 'restricted' THEN 
      score := score + 25;
      risk_factors_array := risk_factors_array || '["credit_restricted"]'::jsonb;
    WHEN 'poor' THEN 
      score := score + 15;
      risk_factors_array := risk_factors_array || '["poor_credit_score"]'::jsonb;
    WHEN 'fair' THEN score := score + 5;
    ELSE score := score + 0;
  END CASE;
  
  -- Document Validation Risk
  IF NEW.cpf_valid = FALSE THEN
    score := score + 30;
    risk_factors_array := risk_factors_array || '["invalid_cpf"]'::jsonb;
  END IF;
  
  -- Face Match Risk
  IF NEW.face_match_score IS NOT NULL AND NEW.face_match_score < 70 THEN
    score := score + 20;
    risk_factors_array := risk_factors_array || '["low_face_match_score"]'::jsonb;
  END IF;
  
  -- Liveness Check Risk
  IF NEW.liveness_check_passed = FALSE THEN
    score := score + 15;
    risk_factors_array := risk_factors_array || '["failed_liveness_check"]'::jsonb;
  END IF;
  
  -- Phone/Email Not Verified
  IF NEW.phone_verified = FALSE THEN
    score := score + 10;
    risk_factors_array := risk_factors_array || '["phone_not_verified"]'::jsonb;
  END IF;
  
  IF NEW.email_verified = FALSE THEN
    score := score + 10;
    risk_factors_array := risk_factors_array || '["email_not_verified"]'::jsonb;
  END IF;
  
  -- Cap score at 100
  IF score > 100 THEN score := 100; END IF;
  
  NEW.risk_score := score;
  NEW.risk_factors := risk_factors_array;
  
  -- Set risk level
  IF score >= 70 THEN NEW.risk_level := 'critical';
  ELSIF score >= 50 THEN NEW.risk_level := 'high';
  ELSIF score >= 30 THEN NEW.risk_level := 'medium';
  ELSE NEW.risk_level := 'low';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_user_risk_score
  BEFORE INSERT OR UPDATE ON user_verifications
  FOR EACH ROW EXECUTE FUNCTION calculate_risk_score();

-- Function to apply verification rules automatically
CREATE OR REPLACE FUNCTION apply_verification_rules()
RETURNS TRIGGER AS $$
DECLARE
  rule RECORD;
  should_approve BOOLEAN := TRUE;
  should_reject BOOLEAN := FALSE;
  needs_review BOOLEAN := FALSE;
BEGIN
  -- Only apply rules when status is 'checking'
  IF NEW.status != 'checking' THEN
    RETURN NEW;
  END IF;
  
  -- Loop through active rules in priority order
  FOR rule IN 
    SELECT * FROM verification_rules 
    WHERE active = TRUE 
    ORDER BY priority DESC
  LOOP
    -- Check if rule conditions match
    -- (This is simplified - in production, use more sophisticated JSON matching)
    
    -- Auto-reject serious crimes
    IF rule.action = 'auto_reject' AND NEW.criminal_record_status = 'serious_crimes' THEN
      NEW.status := 'rejected';
      NEW.rejection_reason := 'criminal_history';
      NEW.rejection_details := 'Histórico criminal grave detectado nos sistemas oficiais.';
      NEW.rejected_at := NOW();
      should_reject := TRUE;
      EXIT; -- Stop processing rules
    END IF;
    
    -- Manual review for pending cases or criminal history
    IF rule.action = 'manual_review' THEN
      IF NEW.criminal_record_status IN ('pending_cases', 'criminal_history') THEN
        needs_review := TRUE;
        NEW.requires_manual_review := TRUE;
        NEW.manual_review_reason := 'Processos judiciais ou histórico criminal requer análise manual.';
      END IF;
      
      IF NEW.risk_score >= 70 THEN
        needs_review := TRUE;
        NEW.requires_manual_review := TRUE;
        NEW.manual_review_reason := 'Pontuação de risco elevada.';
      END IF;
    END IF;
    
    -- Auto-approve if clean record
    IF rule.action = 'auto_approve' 
       AND NEW.criminal_record_status = 'clean' 
       AND NEW.cpf_valid = TRUE 
       AND NEW.risk_score < 30 THEN
      should_approve := TRUE;
    ELSE
      should_approve := FALSE;
    END IF;
  END LOOP;
  
  -- Apply final decision
  IF should_reject THEN
    NEW.status := 'rejected';
  ELSIF needs_review THEN
    NEW.status := 'manual_review';
  ELSIF should_approve AND NOT needs_review THEN
    NEW.status := 'approved';
    NEW.approved_at := NOW();
  ELSE
    NEW.status := 'manual_review'; -- Default to manual review if uncertain
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER apply_auto_verification_rules
  BEFORE UPDATE ON user_verifications
  FOR EACH ROW 
  WHEN (NEW.status = 'checking')
  EXECUTE FUNCTION apply_verification_rules();

-- Function to log verification events
CREATE OR REPLACE FUNCTION log_verification_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO verification_audit_log (
      user_verification_id,
      user_id,
      event_type,
      old_status,
      new_status,
      performed_by_type,
      event_data
    ) VALUES (
      NEW.id,
      NEW.user_id,
      'status_changed',
      OLD.status,
      NEW.status,
      'system',
      json_build_object(
        'risk_score', NEW.risk_score,
        'risk_level', NEW.risk_level
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_verification_status_changes
  AFTER INSERT OR UPDATE ON user_verifications
  FOR EACH ROW EXECUTE FUNCTION log_verification_event();

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

GRANT ALL ON user_verifications TO authenticated;
GRANT ALL ON verification_rules TO authenticated;
GRANT ALL ON verification_audit_log TO authenticated;
GRANT ALL ON user_verifications TO service_role;
GRANT ALL ON verification_rules TO service_role;
GRANT ALL ON verification_audit_log TO service_role;

-- =============================================
-- TABLE COMMENTS
-- =============================================

COMMENT ON TABLE user_verifications IS 'User identity verification and background checks with automated approval/rejection based on criminal records, document validation, and risk scoring';
COMMENT ON TABLE verification_rules IS 'Configurable rules for automatic verification decisions (auto-approve, auto-reject, manual review)';
COMMENT ON TABLE verification_audit_log IS 'Complete audit trail of all verification events for compliance and debugging';
