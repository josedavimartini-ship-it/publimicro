-- PubliMicro Listing Enhancements System
-- Migration: Add per-listing enhancement products (Highlight + Organic Marketing)
-- Date: 2025-11-07

-- =============================================
-- LISTING ENHANCEMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.listing_enhancements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Enhancement Type
  enhancement_type VARCHAR(50) NOT NULL CHECK (enhancement_type IN (
    'highlight',           -- Homepage & category highlight (30 days)
    'organic_marketing',   -- Full marketing campaign
    'bundle'              -- Both highlight + marketing (discounted)
  )),
  
  -- Category-specific pricing (stored for record keeping)
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'items',        -- AcheMeCoisas: R$ 12 / R$ 70 / R$ 75
    'vehicles',     -- AcheMeMotors: R$ 20 / R$ 120 / R$ 130
    'machinery',    -- AcheMeMachina: R$ 20 / R$ 120 / R$ 130
    'marine',       -- AcheMeMarine: R$ 20 / R$ 120 / R$ 130
    'properties',   -- AcheMeProper: R$ 30 / R$ 180 / R$ 195
    'outdoor',      -- AcheMeOutdoor: R$ 12 / R$ 70 / R$ 75
    'travel',       -- AcheMeJourney: R$ 12 / R$ 70 / R$ 75
    'global',       -- AcheMeGlobal: R$ 12 / R$ 70 / R$ 75
    'shared'        -- AcheMeShare: R$ 12 / R$ 70 / R$ 75
  )),
  
  price_paid DECIMAL(10,2) NOT NULL CHECK (price_paid > 0),
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Stripe Payment Details
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
    'pending',    -- Awaiting payment confirmation
    'paid',       -- Payment successful
    'failed',     -- Payment failed
    'refunded'    -- Payment refunded
  )),
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Highlight Details (for 'highlight' & 'bundle' types)
  highlight_starts_at TIMESTAMP WITH TIME ZONE,
  highlight_ends_at TIMESTAMP WITH TIME ZONE, -- 30 days after start
  highlight_active BOOLEAN DEFAULT FALSE,
  
  -- Organic Marketing Details (for 'organic_marketing' & 'bundle' types)
  marketing_status VARCHAR(20) CHECK (marketing_status IN (
    'pending',      -- Payment confirmed, awaiting campaign setup
    'in_progress',  -- Campaign actively running
    'completed',    -- Campaign finished
    'paused',       -- Temporarily paused by admin
    'canceled'      -- User or admin canceled
  )),
  marketing_started_at TIMESTAMP WITH TIME ZONE,
  marketing_completed_at TIMESTAMP WITH TIME ZONE,
  marketing_notes TEXT, -- Admin notes about campaign progress
  marketing_deliverables JSONB DEFAULT '[]'::jsonb, -- Array of {type: 'social_post', url: '...', created_at: '...'}
  
  -- Performance Metrics
  total_impressions INT DEFAULT 0 CHECK (total_impressions >= 0),
  total_clicks INT DEFAULT 0 CHECK (total_clicks >= 0),
  total_leads INT DEFAULT 0 CHECK (total_leads >= 0),
  conversion_rate DECIMAL(5,2), -- Calculated: (leads / clicks) * 100
  
  -- Admin Management
  assigned_to UUID REFERENCES auth.users(id), -- Marketing team member assigned
  priority INT DEFAULT 0 CHECK (priority BETWEEN 0 AND 5), -- 0=low, 5=urgent
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_listing_enhancements_announcement ON listing_enhancements(announcement_id);
CREATE INDEX idx_listing_enhancements_user ON listing_enhancements(user_id);
CREATE INDEX idx_listing_enhancements_type ON listing_enhancements(enhancement_type);
CREATE INDEX idx_listing_enhancements_category ON listing_enhancements(category);
CREATE INDEX idx_listing_enhancements_payment_status ON listing_enhancements(payment_status);

-- Active highlights (for homepage queries)
-- Note: Cannot use NOW() in index predicate due to immutability
-- Filter will be handled at application level
CREATE INDEX idx_listing_enhancements_active_highlights 
  ON listing_enhancements(highlight_active, highlight_ends_at, created_at DESC) 
  WHERE highlight_active = TRUE;

-- Pending marketing campaigns (for admin dashboard)
CREATE INDEX idx_listing_enhancements_marketing_pending 
  ON listing_enhancements(marketing_status, created_at) 
  WHERE marketing_status IN ('pending', 'in_progress');

-- User's enhancement history
CREATE INDEX idx_listing_enhancements_user_history 
  ON listing_enhancements(user_id, created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

ALTER TABLE listing_enhancements ENABLE ROW LEVEL SECURITY;

-- Users can view their own enhancements
CREATE POLICY "Users can view own enhancements" ON listing_enhancements
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert enhancements (via Stripe webhook)
CREATE POLICY "Users can insert own enhancements" ON listing_enhancements
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view enhancements for announcements they own
CREATE POLICY "Users can view enhancements for own announcements" ON listing_enhancements
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM announcements 
      WHERE announcements.id = listing_enhancements.announcement_id 
      AND announcements.user_id = auth.uid()
    )
  );

-- Anyone can see that an announcement is highlighted (for display purposes)
-- This will be handled via announcements.is_featured field instead

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to activate highlight after payment confirmation
CREATE OR REPLACE FUNCTION activate_highlight()
RETURNS TRIGGER AS $$
BEGIN
  -- Only activate if payment is confirmed and highlight hasn't started yet
  IF NEW.payment_status = 'paid' 
     AND (NEW.enhancement_type = 'highlight' OR NEW.enhancement_type = 'bundle')
     AND NEW.highlight_active = FALSE 
     AND NEW.highlight_starts_at IS NULL THEN
    
    -- Set highlight period (30 days from now)
    NEW.highlight_starts_at := NOW();
    NEW.highlight_ends_at := NOW() + INTERVAL '30 days';
    NEW.highlight_active := TRUE;
    NEW.paid_at := NOW();
    
    -- Update announcement to show as featured
    UPDATE announcements
    SET is_featured = TRUE
    WHERE id = NEW.announcement_id;
  END IF;
  
  -- Set marketing status to pending if organic marketing purchased
  IF NEW.payment_status = 'paid' 
     AND (NEW.enhancement_type = 'organic_marketing' OR NEW.enhancement_type = 'bundle')
     AND NEW.marketing_status IS NULL THEN
    
    NEW.marketing_status := 'pending';
    NEW.paid_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activate_highlight_on_payment
  BEFORE INSERT OR UPDATE ON listing_enhancements
  FOR EACH ROW EXECUTE FUNCTION activate_highlight();

-- Function to deactivate expired highlights (run via cron job)
CREATE OR REPLACE FUNCTION deactivate_expired_highlights()
RETURNS void AS $$
BEGIN
  -- Find all active highlights that have expired
  UPDATE listing_enhancements
  SET 
    highlight_active = FALSE,
    updated_at = NOW()
  WHERE 
    highlight_active = TRUE 
    AND highlight_ends_at < NOW();
  
  -- Update announcements to remove featured flag if no active highlights remain
  UPDATE announcements
  SET is_featured = FALSE
  WHERE id IN (
    SELECT DISTINCT a.id
    FROM announcements a
    LEFT JOIN listing_enhancements le ON a.id = le.announcement_id
      AND le.highlight_active = TRUE
      AND le.highlight_ends_at > NOW()
    WHERE a.is_featured = TRUE
      AND le.id IS NULL
  );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate conversion rate
CREATE OR REPLACE FUNCTION update_enhancement_conversion_rate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_clicks > 0 THEN
    NEW.conversion_rate := ROUND((NEW.total_leads::DECIMAL / NEW.total_clicks::DECIMAL) * 100, 2);
  ELSE
    NEW.conversion_rate := 0;
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_conversion_rate
  BEFORE UPDATE ON listing_enhancements
  FOR EACH ROW 
  WHEN (OLD.total_clicks IS DISTINCT FROM NEW.total_clicks OR OLD.total_leads IS DISTINCT FROM NEW.total_leads)
  EXECUTE FUNCTION update_enhancement_conversion_rate();

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

GRANT ALL ON listing_enhancements TO authenticated;
GRANT ALL ON listing_enhancements TO service_role;

-- =============================================
-- TABLE COMMENTS
-- =============================================

COMMENT ON TABLE listing_enhancements IS 'Paid enhancement features for individual announcements: Homepage Highlight (30 days) and Organic Marketing campaigns. Separate from subscription tiers.';

COMMENT ON COLUMN listing_enhancements.enhancement_type IS 'Type of enhancement: highlight (R$12-30), organic_marketing (R$70-180), or bundle (both with discount)';
COMMENT ON COLUMN listing_enhancements.category IS 'Announcement category determines pricing: items (cheapest), vehicles/machinery/marine (mid), properties (premium)';
COMMENT ON COLUMN listing_enhancements.highlight_active IS 'TRUE if highlight is currently active (within 30-day window)';
COMMENT ON COLUMN listing_enhancements.marketing_status IS 'Campaign status: pending → in_progress → completed. NULL for highlight-only purchases.';
COMMENT ON COLUMN listing_enhancements.marketing_deliverables IS 'JSON array of campaign deliverables: social posts, blog articles, SEO work, etc.';
COMMENT ON COLUMN listing_enhancements.total_impressions IS 'Total views of highlighted announcement or marketing campaign reach';
COMMENT ON COLUMN listing_enhancements.total_clicks IS 'Clicks from highlighted position or marketing campaign';
COMMENT ON COLUMN listing_enhancements.total_leads IS 'Contact form submissions, WhatsApp clicks, phone reveals from this enhancement';
COMMENT ON COLUMN listing_enhancements.conversion_rate IS 'Automatically calculated: (leads / clicks) × 100';
