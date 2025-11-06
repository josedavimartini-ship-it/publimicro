-- ============================================
-- VISITS SYSTEM - Property Visit Scheduling
-- ============================================

-- Visit Status Enum
CREATE TYPE visit_status AS ENUM (
  'requested',      -- Solicitação enviada
  'confirmed',      -- Confirmada
  'completed',      -- Realizada
  'cancelled',      -- Cancelada
  'no_show'         -- Não compareceu
);

-- Visit Type Enum
CREATE TYPE visit_type AS ENUM (
  'in_person',      -- Presencial
  'video',          -- Vídeo chamada
  'both'            -- Ambos
);

-- ============================================
-- VISITS Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Property Reference (supports both legacy sitios and new properties)
  ad_id TEXT NOT NULL, -- Can be UUID string or sitio slug like 'surucua', 'abare'
  
  -- User Information
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  
  -- Visit Details
  visit_type visit_type DEFAULT 'in_person',
  scheduled_at TIMESTAMPTZ NOT NULL,
  status visit_status DEFAULT 'requested',
  verification_passed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  -- Admin Notes
  admin_notes TEXT,
  confirmed_by UUID REFERENCES auth.users(id),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  CONSTRAINT valid_scheduled_time CHECK (scheduled_at > NOW())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON public.visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_ad_id ON public.visits(ad_id);
CREATE INDEX IF NOT EXISTS idx_visits_status ON public.visits(status);
CREATE INDEX IF NOT EXISTS idx_visits_scheduled_at ON public.visits(scheduled_at);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Users can read their own visits
DROP POLICY IF EXISTS "Users can read own visits" ON public.visits;
CREATE POLICY "Users can read own visits"
  ON public.visits FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own visits
DROP POLICY IF EXISTS "Users can insert own visits" ON public.visits;
CREATE POLICY "Users can insert own visits"
  ON public.visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own visits (cancel only)
DROP POLICY IF EXISTS "Users can cancel own visits" ON public.visits;
CREATE POLICY "Users can cancel own visits"
  ON public.visits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND status IN ('requested', 'confirmed')
  );

-- Admins can read all visits (if admin_users table exists)
DROP POLICY IF EXISTS "Admins can read all visits" ON public.visits;
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_users') THEN
    EXECUTE '
      CREATE POLICY "Admins can read all visits"
        ON public.visits FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.id = auth.uid()
          )
        )';
  END IF;
END $$;

-- Admins can update all visits (if admin_users table exists)
DROP POLICY IF EXISTS "Admins can update all visits" ON public.visits;
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_users') THEN
    EXECUTE '
      CREATE POLICY "Admins can update all visits"
        ON public.visits FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.id = auth.uid()
          )
        )';
  END IF;
END $$;

-- ============================================
-- Triggers & Functions
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_visits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_visits_updated_at ON public.visits;
CREATE TRIGGER trg_update_visits_updated_at
  BEFORE UPDATE ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.update_visits_updated_at();

-- Auto-confirm visits for verified users
CREATE OR REPLACE FUNCTION public.auto_confirm_visits()
RETURNS TRIGGER AS $$
BEGIN
  -- If user is verified and visit is at least 24 hours in the future
  IF NEW.verification_passed = TRUE 
     AND NEW.status = 'requested' 
     AND NEW.scheduled_at > NOW() + INTERVAL '24 hours' THEN
    
    NEW.status = 'confirmed';
    NEW.confirmed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_confirm_visits ON public.visits;
CREATE TRIGGER trg_auto_confirm_visits
  BEFORE INSERT ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_visits();

-- Notify on new visit (for real-time updates)
CREATE OR REPLACE FUNCTION public.notify_new_visit()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('new_visit', json_build_object(
    'visit_id', NEW.id,
    'user_id', NEW.user_id,
    'ad_id', NEW.ad_id,
    'scheduled_at', NEW.scheduled_at,
    'status', NEW.status
  )::TEXT);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_new_visit ON public.visits;
CREATE TRIGGER trg_notify_new_visit
  AFTER INSERT ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_visit();

-- ============================================
-- PROPOSALS/BIDS Table (related to visits)
-- ============================================
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Property Reference
  property_id TEXT NOT NULL, -- Can be UUID or sitio slug
  
  -- User Information
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Proposal Details
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  message TEXT,
  financing BOOLEAN DEFAULT FALSE,
  down_payment DECIMAL(15, 2),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'counter')),
  admin_response TEXT,
  counter_offer DECIMAL(15, 2),
  
  -- Requirements
  visit_completed BOOLEAN DEFAULT FALSE, -- Must visit before proposing
  visit_id UUID REFERENCES public.visits(id),
  
  -- Timestamps
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON public.proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_property_id ON public.proposals(property_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_visit_id ON public.proposals(visit_id);

-- RLS for proposals
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own proposals" ON public.proposals;
CREATE POLICY "Users can read own proposals"
  ON public.proposals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create proposals" ON public.proposals;
CREATE POLICY "Users can create proposals"
  ON public.proposals FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    -- Optionally enforce visit requirement:
    -- AND visit_completed = TRUE
  );

DROP POLICY IF EXISTS "Admins can manage proposals" ON public.proposals;
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_users') THEN
    EXECUTE '
      CREATE POLICY "Admins can manage proposals"
        ON public.proposals FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.id = auth.uid()
          )
        )';
  END IF;
END $$;

-- Auto-update proposals timestamp
DROP TRIGGER IF EXISTS trg_update_proposals_updated_at ON public.proposals;
CREATE TRIGGER trg_update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_visits_updated_at();

-- Comments for documentation
COMMENT ON TABLE public.visits IS 'Property visit scheduling and tracking';
COMMENT ON TABLE public.proposals IS 'Property purchase proposals/bids with visit requirement';
COMMENT ON COLUMN public.visits.ad_id IS 'Property identifier - can be UUID or legacy sitio slug (surucua, abare, etc)';
COMMENT ON COLUMN public.visits.verification_passed IS 'Whether user has completed profile verification';
COMMENT ON COLUMN public.proposals.visit_completed IS 'User must complete a visit before making a proposal';
