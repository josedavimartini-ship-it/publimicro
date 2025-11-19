-- ============================================
-- STRIPE PAYMENT ENHANCEMENTS
-- Add marketing campaign field & payments table
-- ============================================

-- Add marketing_campaign_active to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS marketing_campaign_active BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS marketing_activated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS marketing_expires_at TIMESTAMPTZ;

-- Create payments table for audit trail
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Stripe Data
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  
  -- Payment Details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  product_type VARCHAR(50) NOT NULL, -- 'destaque' or 'marketing'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'refunded', 'failed'
  
  -- Metadata
  payment_method VARCHAR(50), -- 'card', 'pix'
  receipt_url TEXT,
  customer_email TEXT,
  
  -- Activation & Expiration
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Refund
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_listing_id ON public.payments(listing_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON public.payments(stripe_session_id);

-- RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can manage all payments
DROP POLICY IF EXISTS "Service role can manage payments" ON public.payments;
CREATE POLICY "Service role can manage payments"
  ON public.payments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grants
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

-- Auto-update timestamp
DROP TRIGGER IF EXISTS payments_updated_at ON public.payments;
CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Comments
COMMENT ON TABLE public.payments IS 'Payment transactions for featured listings and marketing campaigns';
COMMENT ON COLUMN public.listings.marketing_campaign_active IS 'Whether listing has active marketing campaign (R$ 120/30 days)';
COMMENT ON COLUMN public.listings.marketing_activated_at IS 'When marketing campaign was activated';
COMMENT ON COLUMN public.listings.marketing_expires_at IS 'When marketing campaign expires';
