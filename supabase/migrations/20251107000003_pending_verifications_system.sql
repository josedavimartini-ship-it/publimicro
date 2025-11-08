-- ============================================
-- PENDING VERIFICATIONS SYSTEM
-- Users/Guests in verification process
-- ============================================

-- Table for users pending background checks
CREATE TABLE IF NOT EXISTS public.pending_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Personal Information (collected during signup or visit request)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  
  -- Address (if provided)
  cep VARCHAR(9),
  street TEXT,
  number VARCHAR(10),
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state VARCHAR(2),
  
  -- Verification Status
  cpf_validation_status verification_status DEFAULT 'pending',
  cpf_validated_at TIMESTAMPTZ,
  federal_police_check_status verification_status DEFAULT 'pending',
  federal_police_check_date TIMESTAMPTZ,
  federal_police_response JSONB,
  interpol_check_status verification_status DEFAULT 'pending',
  interpol_check_date TIMESTAMPTZ,
  interpol_response JSONB,
  
  -- Overall Status
  verification_status verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verification_passed BOOLEAN,
  rejection_reason TEXT,
  
  -- Source of verification request
  source VARCHAR(50) NOT NULL, -- 'signup', 'visit_request', 'proposal_request'
  source_id UUID, -- ID of related visit/proposal if applicable
  
  -- Account Creation
  account_created BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id), -- Set after account creation
  
  -- Notifications
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pending_verifications_cpf ON public.pending_verifications(cpf);
CREATE INDEX IF NOT EXISTS idx_pending_verifications_email ON public.pending_verifications(email);
CREATE INDEX IF NOT EXISTS idx_pending_verifications_status ON public.pending_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_pending_verifications_created_at ON public.pending_verifications(created_at DESC);

-- RLS
ALTER TABLE public.pending_verifications ENABLE ROW LEVEL SECURITY;

-- Only service role can access (internal system only)
DROP POLICY IF EXISTS "Service role can manage pending verifications" ON public.pending_verifications;
CREATE POLICY "Service role can manage pending verifications"
  ON public.pending_verifications FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.pending_verifications TO service_role;

-- Auto-update timestamp
DROP TRIGGER IF EXISTS pending_verifications_updated_at ON public.pending_verifications;
CREATE TRIGGER pending_verifications_updated_at
  BEFORE UPDATE ON public.pending_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- VISIT REQUESTS - Enhanced for Guest Visits
-- ============================================

-- Add fields to visits table for guest information
ALTER TABLE public.visits 
ADD COLUMN IF NOT EXISTS guest_cpf VARCHAR(14),
ADD COLUMN IF NOT EXISTS guest_birth_date DATE,
ADD COLUMN IF NOT EXISTS guest_address TEXT,
ADD COLUMN IF NOT EXISTS verification_pending_id UUID REFERENCES public.pending_verifications(id),
ADD COLUMN IF NOT EXISTS background_check_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS background_check_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS background_check_passed BOOLEAN;

-- Index for verification lookup
CREATE INDEX IF NOT EXISTS idx_visits_verification_pending_id ON public.visits(verification_pending_id);

-- ============================================
-- PROPERTY BID TRACKING
-- ============================================

-- Add current bid tracking to properties table (if not exists)
DO $$ 
BEGIN
  ALTER TABLE public.properties 
  ADD COLUMN IF NOT EXISTS expected_value DECIMAL(15, 2),
  ADD COLUMN IF NOT EXISTS current_highest_bid DECIMAL(15, 2),
  ADD COLUMN IF NOT EXISTS total_bids_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_bid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accepts_proposals BOOLEAN DEFAULT TRUE;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Add to sitios as well
ALTER TABLE public.sitios 
ADD COLUMN IF NOT EXISTS expected_value DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS current_highest_bid DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS total_bids_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_bid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS accepts_proposals BOOLEAN DEFAULT TRUE;

-- Function to update property bid stats when proposal is made
CREATE OR REPLACE FUNCTION update_property_bid_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update properties table
  UPDATE public.properties
  SET 
    current_highest_bid = (
      SELECT MAX(amount) 
      FROM public.proposals 
      WHERE property_id = NEW.property_id::text
    ),
    total_bids_count = (
      SELECT COUNT(*) 
      FROM public.proposals 
      WHERE property_id = NEW.property_id::text
    ),
    last_bid_at = NEW.created_at
  WHERE id = NEW.property_id::text;
  
  -- Also update sitios if it's a sitio
  UPDATE public.sitios
  SET 
    current_highest_bid = (
      SELECT MAX(amount) 
      FROM public.proposals 
      WHERE property_id = NEW.property_id::text
    ),
    total_bids_count = (
      SELECT COUNT(*) 
      FROM public.proposals 
      WHERE property_id = NEW.property_id::text
    ),
    last_bid_at = NEW.created_at
  WHERE id::text = NEW.property_id::text;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update bid stats
DROP TRIGGER IF EXISTS update_bid_stats ON public.proposals;
CREATE TRIGGER update_bid_stats
  AFTER INSERT OR UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_property_bid_stats();

COMMENT ON TABLE public.pending_verifications IS 'INTERNAL: Users/guests pending background checks before account creation or visit approval';
COMMENT ON COLUMN public.visits.background_check_required IS 'Whether this visit request requires background verification';
COMMENT ON COLUMN public.visits.background_check_passed IS 'Result of background check (null = pending, true = passed, false = failed)';
