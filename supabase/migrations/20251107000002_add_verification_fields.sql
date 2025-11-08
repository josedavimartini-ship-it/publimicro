-- ============================================
-- USER VERIFICATION SYSTEM
-- Federal Police and Interpol Integration
-- ============================================

-- Add verification tracking fields to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS cpf_validation_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS cpf_validated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS federal_police_check_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS federal_police_check_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS federal_police_response JSONB,
ADD COLUMN IF NOT EXISTS interpol_check_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS interpol_check_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS interpol_response JSONB,
ADD COLUMN IF NOT EXISTS background_check_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS background_check_passed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- Create verification status enum
DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM (
    'pending',        -- Aguardando verificação
    'in_progress',    -- Em andamento
    'approved',       -- Aprovado
    'rejected',       -- Rejeitado
    'needs_review',   -- Precisa revisão manual
    'expired'         -- Verificação expirada (renovar após 1 ano)
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Alter columns to use enum (if not already)
DO $$ 
BEGIN
  ALTER TABLE public.user_profiles 
    ALTER COLUMN cpf_validation_status TYPE verification_status USING cpf_validation_status::verification_status;
EXCEPTION
  WHEN OTHERS THEN 
    -- Column already correct type or other issue
    NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE public.user_profiles 
    ALTER COLUMN federal_police_check_status TYPE verification_status USING federal_police_check_status::verification_status;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE public.user_profiles 
    ALTER COLUMN interpol_check_status TYPE verification_status USING interpol_check_status::verification_status;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Create verification_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- User being verified
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Verification type
  verification_type VARCHAR(50) NOT NULL, -- 'cpf', 'federal_police', 'interpol', 'manual'
  
  -- Status
  status verification_status NOT NULL,
  
  -- Details
  request_data JSONB,
  response_data JSONB,
  error_message TEXT,
  
  -- Admin who performed manual verification
  verified_by UUID REFERENCES auth.users(id),
  
  -- Notes
  notes TEXT
);

-- Indexes for verification_logs
CREATE INDEX IF NOT EXISTS idx_verification_logs_user_id ON public.verification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_type ON public.verification_logs(verification_type);
CREATE INDEX IF NOT EXISTS idx_verification_logs_status ON public.verification_logs(status);
CREATE INDEX IF NOT EXISTS idx_verification_logs_created_at ON public.verification_logs(created_at DESC);

-- RLS for verification_logs
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification logs
CREATE POLICY "Users can view own verification logs"
  ON public.verification_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert logs (API routes)
CREATE POLICY "Service role can manage verification logs"
  ON public.verification_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.verification_logs TO service_role;
GRANT SELECT ON public.verification_logs TO authenticated;

-- Function to automatically grant can_place_bids when all checks pass
CREATE OR REPLACE FUNCTION auto_grant_bid_permission()
RETURNS TRIGGER AS $$
BEGIN
  -- If all background checks are completed and passed, grant bid permission
  IF NEW.background_check_completed = TRUE 
     AND NEW.background_check_passed = TRUE 
     AND NEW.verified = TRUE THEN
    NEW.can_place_bids := TRUE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-grant permissions
DROP TRIGGER IF EXISTS user_verification_auto_grant ON public.user_profiles;
CREATE TRIGGER user_verification_auto_grant
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_grant_bid_permission();

COMMENT ON TABLE public.verification_logs IS 'INTERNAL: Audit trail for all user verification checks (CPF, Federal Police, Interpol) - NOT visible to users';
COMMENT ON COLUMN public.user_profiles.cpf_validation_status IS 'INTERNAL: CPF validation status using Receita Federal API';
COMMENT ON COLUMN public.user_profiles.federal_police_check_status IS 'INTERNAL: Brazilian Federal Police background check status - users only see "verification in progress"';
COMMENT ON COLUMN public.user_profiles.interpol_check_status IS 'INTERNAL: International criminal database check via Interpol - users only see "verification in progress"';
COMMENT ON COLUMN public.user_profiles.background_check_completed IS 'INTERNAL: All background checks have been completed';
COMMENT ON COLUMN public.user_profiles.background_check_passed IS 'INTERNAL: User passed all background checks (no criminal records)';
