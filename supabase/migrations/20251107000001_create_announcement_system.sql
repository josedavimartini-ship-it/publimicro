-- PubliMicro Advanced Announcement System
-- Migration: Create complete subscription & posting system
-- Date: 2025-11-07

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- =============================================
-- 1. USER SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Subscription Details
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'premium', 'pro')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'past_due', 'trialing')),
  
  -- Billing
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  price_paid DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Period
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '30 days',
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- Auto-renewal
  auto_renew BOOLEAN DEFAULT TRUE,
  
  -- Trial (7 days Premium for new users)
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  is_trial BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Only one active subscription per user (partial unique index)
CREATE UNIQUE INDEX idx_subscriptions_user_active_unique ON user_subscriptions(user_id) WHERE status = 'active';

CREATE INDEX idx_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_subscriptions_tier ON user_subscriptions(tier);
CREATE INDEX idx_subscriptions_expires ON user_subscriptions(current_period_end);

-- =============================================
-- 2. USER CREDITS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Credits Balance
  total_credits INT NOT NULL DEFAULT 0 CHECK (total_credits >= 0),
  free_credits INT NOT NULL DEFAULT 0 CHECK (free_credits >= 0),
  paid_credits INT NOT NULL DEFAULT 0 CHECK (paid_credits >= 0),
  
  -- Monthly Usage Limits (Reset on 1st of each month)
  items_posted_this_month INT NOT NULL DEFAULT 0 CHECK (items_posted_this_month >= 0),
  properties_posted_this_month INT NOT NULL DEFAULT 0 CHECK (properties_posted_this_month >= 0),
  vehicles_posted_this_month INT NOT NULL DEFAULT 0 CHECK (vehicles_posted_this_month >= 0),
  machinery_posted_this_month INT NOT NULL DEFAULT 0 CHECK (machinery_posted_this_month >= 0),
  
  -- Last reset date
  last_monthly_reset DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Lifetime stats
  total_posts_lifetime INT NOT NULL DEFAULT 0,
  total_credits_earned_lifetime INT NOT NULL DEFAULT 0,
  total_credits_spent_lifetime INT NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX idx_credits_user ON user_credits(user_id);
CREATE INDEX idx_credits_reset_date ON user_credits(last_monthly_reset);

-- =============================================
-- 3. ANNOUNCEMENTS TABLE (Unified for all categories)
-- =============================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Category & Type
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'items',        -- AcheMeCoisas (general classifieds)
    'properties',   -- AcheMeProper (real estate)
    'vehicles',     -- AcheMeMotors (cars, motorcycles)
    'machinery',    -- AcheMeMachina (tractors, construction)
    'marine',       -- AcheMeMarine (boats, jet-skis)
    'outdoor',      -- AcheMeOutdoor (camping, sports)
    'travel',       -- AcheMeJourney (trips, experiences)
    'global',       -- AcheMeGlobal (international trade)
    'shared'        -- AcheMeShare (sharangas - shared items)
  )),
  
  subcategory VARCHAR(100), -- Flexible subcategory (electronics, apartment, sedan, etc.)
  condition VARCHAR(20) CHECK (condition IN ('new', 'used', 'refurbished', 'for_parts')),
  
  -- Basic Info
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  
  -- Pricing
  price DECIMAL(12,2),
  original_price DECIMAL(12,2), -- For showing discounts
  price_negotiable BOOLEAN DEFAULT TRUE,
  accepts_trade BOOLEAN DEFAULT FALSE,
  
  -- Media
  photos JSONB DEFAULT '[]'::jsonb, -- Array of {url: string, order: number, is_cover: boolean}
  video_url TEXT, -- YouTube, Vimeo, or direct video URL
  video_thumbnail TEXT,
  
  -- Location
  cep VARCHAR(9),
  street TEXT,
  number VARCHAR(10),
  complement TEXT,
  neighborhood TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  country VARCHAR(3) DEFAULT 'BRA',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  show_exact_location BOOLEAN DEFAULT FALSE, -- Privacy option
  
  -- Contact Info
  contact_phone VARCHAR(20),
  contact_whatsapp VARCHAR(20),
  contact_email TEXT,
  contact_name VARCHAR(100),
  hide_phone BOOLEAN DEFAULT FALSE, -- Only show after interest
  
  -- Status & Moderation
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',      -- User is creating (not visible)
    'pending',    -- Awaiting admin approval
    'active',     -- Live and visible to public
    'sold',       -- Marked as sold/rented
    'expired',    -- Listing period ended
    'paused',     -- User temporarily paused
    'removed',    -- User removed
    'rejected',   -- Admin rejected
    'flagged'     -- Flagged for review
  )),
  
  -- Visibility & Features
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE, -- Verified seller badge
  auto_refresh BOOLEAN DEFAULT FALSE,
  boost_count INT DEFAULT 0,
  last_boosted_at TIMESTAMP WITH TIME ZONE,
  
  -- Engagement Metrics
  views_count INT DEFAULT 0,
  unique_views_count INT DEFAULT 0,
  favorites_count INT DEFAULT 0,
  contacts_count INT DEFAULT 0,
  whatsapp_clicks INT DEFAULT 0,
  phone_reveals INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  
  -- Publication Dates
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_refreshed_at TIMESTAMP WITH TIME ZONE,
  sold_at TIMESTAMP WITH TIME ZONE,
  
  -- Moderation
  admin_approved_by UUID REFERENCES auth.users(id),
  admin_approved_at TIMESTAMP WITH TIME ZONE,
  admin_rejected_by UUID REFERENCES auth.users(id),
  admin_rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  flagged_count INT DEFAULT 0,
  flag_reasons JSONB DEFAULT '[]'::jsonb,
  
  -- AI Enhancement
  ai_enhanced BOOLEAN DEFAULT FALSE,
  ai_suggestions JSONB, -- Stores AI-generated improvements
  ai_score DECIMAL(3,2), -- Quality score 0-1
  
  -- SEO & Search
  slug VARCHAR(300),
  meta_title VARCHAR(200),
  meta_description VARCHAR(300),
  tags TEXT[], -- Searchable tags
  
  -- Extended Attributes (category-specific data)
  attributes JSONB DEFAULT '{}'::jsonb, -- Flexible JSON for category-specific fields
  -- Examples:
  -- Properties: {bedrooms: 3, bathrooms: 2, parking: 1, area: 120}
  -- Vehicles: {brand: "Honda", model: "Civic", year: 2020, km: 30000, fuel: "flex"}
  -- Electronics: {brand: "Samsung", warranty: true, specs: {...}}
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_announcements_user ON announcements(user_id);
CREATE INDEX idx_announcements_category ON announcements(category);
CREATE INDEX idx_announcements_subcategory ON announcements(category, subcategory);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_active ON announcements(status, published_at DESC) WHERE status = 'active';
CREATE INDEX idx_announcements_location ON announcements(city, state) WHERE status = 'active';
CREATE INDEX idx_announcements_price ON announcements(price) WHERE price IS NOT NULL AND status = 'active';
CREATE INDEX idx_announcements_featured ON announcements(is_featured, published_at DESC) WHERE is_featured = TRUE AND status = 'active';
CREATE INDEX idx_announcements_slug ON announcements(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_announcements_expires ON announcements(expires_at) WHERE expires_at IS NOT NULL;

-- Geographic search (PostGIS required)
-- CREATE INDEX idx_announcements_location_gist ON announcements USING GIST(
--   ll_to_earth(latitude, longitude)
-- ) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Full-text search (Portuguese)
ALTER TABLE announcements ADD COLUMN search_vector tsvector;

CREATE INDEX idx_announcements_search ON announcements USING GIN(search_vector);

CREATE OR REPLACE FUNCTION announcements_search_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.city, '')), 'C') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.neighborhood, '')), 'C') ||
    setweight(to_tsvector('portuguese', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER announcements_search_vector_update
  BEFORE INSERT OR UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION announcements_search_update();

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_announcement_slug() RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  -- Only generate if slug is null
  IF NEW.slug IS NULL THEN
    -- Convert title to slug format (without unaccent to avoid immutability issues)
    base_slug := lower(trim(NEW.title));
    -- Replace special characters with nothing
    base_slug := regexp_replace(base_slug, '[àáâãäåāă]', 'a', 'g');
    base_slug := regexp_replace(base_slug, '[èéêëēėę]', 'e', 'g');
    base_slug := regexp_replace(base_slug, '[ìíîïīį]', 'i', 'g');
    base_slug := regexp_replace(base_slug, '[òóôõöøōő]', 'o', 'g');
    base_slug := regexp_replace(base_slug, '[ùúûüūů]', 'u', 'g');
    base_slug := regexp_replace(base_slug, '[ç]', 'c', 'g');
    base_slug := regexp_replace(base_slug, '[ñ]', 'n', 'g');
    -- Remove all non-alphanumeric except spaces and hyphens
    base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
    -- Replace spaces with hyphens
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    -- Remove duplicate hyphens
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    -- Trim hyphens from start and end
    base_slug := trim(both '-' from base_slug);
    -- Limit length
    base_slug := substring(base_slug, 1, 250);
    
    final_slug := base_slug;
    
    -- Check for uniqueness, add counter if needed
    WHILE EXISTS (SELECT 1 FROM announcements WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_slug_trigger
  BEFORE INSERT OR UPDATE OF title ON announcements
  FOR EACH ROW EXECUTE FUNCTION generate_announcement_slug();

-- =============================================
-- 4. CREDIT TRANSACTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction Type
  type VARCHAR(20) NOT NULL CHECK (type IN (
    'purchase',      -- User bought credits
    'earned',        -- Referral reward, promotion
    'spent',         -- Used for creating listing
    'refund',        -- Payment refunded
    'expired',       -- Free credits expired
    'bonus',         -- Admin granted bonus
    'subscription'   -- Credits from subscription tier
  )),
  
  -- Amount (positive = add, negative = subtract)
  amount INT NOT NULL,
  balance_before INT NOT NULL,
  balance_after INT NOT NULL,
  
  -- Description
  description TEXT NOT NULL,
  
  -- Related Records
  announcement_id UUID REFERENCES announcements(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_created ON credit_transactions(created_at DESC);
CREATE INDEX idx_credit_transactions_announcement ON credit_transactions(announcement_id) WHERE announcement_id IS NOT NULL;

-- =============================================
-- 5. ANNOUNCEMENT VIEWS TRACKING
-- =============================================
CREATE TABLE IF NOT EXISTS public.announcement_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  
  -- Viewer Info (can be anonymous)
  viewer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_ip VARCHAR(45),
  viewer_user_agent TEXT,
  
  -- Location (from IP geolocation or user profile)
  viewer_city VARCHAR(100),
  viewer_state VARCHAR(2),
  viewer_country VARCHAR(3),
  
  -- Session & Source Tracking
  session_id UUID,
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  -- Engagement
  time_spent_seconds INT, -- How long viewed
  scrolled_percentage INT, -- How far scrolled (0-100)
  clicked_whatsapp BOOLEAN DEFAULT FALSE,
  clicked_phone BOOLEAN DEFAULT FALSE,
  added_to_favorites BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_views_announcement ON announcement_views(announcement_id);
CREATE INDEX idx_views_user ON announcement_views(viewer_user_id) WHERE viewer_user_id IS NOT NULL;
CREATE INDEX idx_views_created ON announcement_views(created_at DESC);
CREATE INDEX idx_views_session ON announcement_views(session_id);

-- Note: Hourly deduplication will be handled at application level
-- Cannot create index with DATE_TRUNC due to immutability constraints

-- =============================================
-- 6. OAUTH ACCOUNTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Provider Info
  provider VARCHAR(50) NOT NULL CHECK (provider IN (
    'google',
    'microsoft',
    'apple',
    'facebook',
    'github',
    'linkedin'
  )),
  provider_user_id TEXT NOT NULL,
  
  -- Profile Data from Provider
  email TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  display_name TEXT,
  given_name TEXT,
  family_name TEXT,
  photo_url TEXT,
  locale VARCHAR(10),
  
  -- Tokens (should be encrypted in production)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  id_token TEXT,
  
  -- Scope granted
  scopes TEXT[],
  
  -- Account Linking
  primary_account BOOLEAN DEFAULT FALSE,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Activity
  last_sign_in TIMESTAMP WITH TIME ZONE,
  sign_in_count INT DEFAULT 1,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_oauth_user ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_provider ON oauth_accounts(provider, provider_user_id);
CREATE INDEX idx_oauth_email ON oauth_accounts(email);

-- =============================================
-- 7. REFERRAL PROGRAM TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.referral_program (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referrer (person who invited)
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referrer_code VARCHAR(20) NOT NULL,
  
  -- Referee (person who was invited)
  referee_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referee_email TEXT,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',     -- Invitation sent, not signed up yet
    'signed_up',   -- Signed up but not verified
    'completed',   -- Verified and active
    'rewarded'     -- Both parties received rewards
  )),
  
  -- Rewards
  referrer_credits_awarded INT DEFAULT 0,
  referee_credits_awarded INT DEFAULT 0,
  referrer_discount_percent INT, -- e.g., 20% off next subscription
  referee_discount_percent INT,
  
  -- Timestamps
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  signed_up_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rewarded_at TIMESTAMP WITH TIME ZONE,
  
  -- Tracking
  invitation_method VARCHAR(50), -- email, whatsapp, link
  ip_address VARCHAR(45),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_referrer ON referral_program(referrer_user_id);
CREATE INDEX idx_referral_referee ON referral_program(referee_user_id);
CREATE INDEX idx_referral_code ON referral_program(referrer_code);
CREATE INDEX idx_referral_status ON referral_program(status);

CREATE UNIQUE INDEX idx_referral_code_unique ON referral_program(referrer_code);

-- =============================================
-- 8. ANNOUNCEMENT FAVORITES
-- =============================================
CREATE TABLE IF NOT EXISTS public.announcement_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  
  -- Organization
  folder_name VARCHAR(100) DEFAULT 'Salvos',
  notes TEXT, -- User's private notes about the listing
  
  -- Alerts
  price_alert_enabled BOOLEAN DEFAULT FALSE,
  price_alert_below DECIMAL(12,2), -- Notify if price drops below this
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, announcement_id)
);

CREATE INDEX idx_favorites_user ON announcement_favorites(user_id);
CREATE INDEX idx_favorites_announcement ON announcement_favorites(announcement_id);
CREATE INDEX idx_favorites_folder ON announcement_favorites(user_id, folder_name);

-- =============================================
-- 9. ANNOUNCEMENT REPORTS (Flagging)
-- =============================================
CREATE TABLE IF NOT EXISTS public.announcement_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_ip VARCHAR(45),
  
  -- Report Details
  reason VARCHAR(50) NOT NULL CHECK (reason IN (
    'spam',
    'fraud',
    'inappropriate',
    'duplicate',
    'wrong_category',
    'prohibited_item',
    'misleading',
    'offensive',
    'other'
  )),
  description TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending',
    'investigating',
    'resolved',
    'dismissed'
  )),
  
  -- Resolution
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_note TEXT,
  action_taken VARCHAR(50), -- 'removed', 'warned_user', 'no_action', etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reports_announcement ON announcement_reports(announcement_id);
CREATE INDEX idx_reports_status ON announcement_reports(status);
CREATE INDEX idx_reports_reporter ON announcement_reports(reporter_user_id) WHERE reporter_user_id IS NOT NULL;

-- Note: Duplicate report prevention will be handled at application level
-- to avoid issues with COALESCE in unique indexes

-- =============================================
-- 10. ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reports ENABLE ROW LEVEL SECURITY;

-- User Subscriptions Policies
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON user_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON user_subscriptions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- User Credits Policies
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Announcements Policies
CREATE POLICY "Anyone can view active announcements" ON announcements
  FOR SELECT TO public
  USING (status = 'active');

CREATE POLICY "Users can view own announcements" ON announcements
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own announcements" ON announcements
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own announcements" ON announcements
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own announcements" ON announcements
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Credit Transactions Policies
CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- OAuth Accounts Policies
CREATE POLICY "Users can view own oauth accounts" ON oauth_accounts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Favorites Policies
CREATE POLICY "Users can manage own favorites" ON announcement_favorites
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- 11. HELPER FUNCTIONS
-- =============================================

-- Function to initialize free tier for new users
CREATE OR REPLACE FUNCTION initialize_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Create free tier subscription
  INSERT INTO user_subscriptions (user_id, tier, status, current_period_start, current_period_end)
  VALUES (
    NEW.id,
    'free',
    'active',
    NOW(),
    NOW() + INTERVAL '365 days' -- Free tier never expires
  );
  
  -- Create credits record with free tier limits
  INSERT INTO user_credits (user_id, total_credits, free_credits)
  VALUES (NEW.id, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-initialize subscription for new users
CREATE TRIGGER initialize_user_subscription_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_new_user_subscription();

-- Function to reset monthly limits
CREATE OR REPLACE FUNCTION reset_monthly_posting_limits()
RETURNS void AS $$
BEGIN
  UPDATE user_credits
  SET 
    items_posted_this_month = 0,
    properties_posted_this_month = 0,
    vehicles_posted_this_month = 0,
    machinery_posted_this_month = 0,
    last_monthly_reset = CURRENT_DATE
  WHERE last_monthly_reset < DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can post in category
CREATE OR REPLACE FUNCTION can_user_post(
  p_user_id UUID,
  p_category VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription user_subscriptions%ROWTYPE;
  v_credits user_credits%ROWTYPE;
  v_limit INT;
  v_current INT;
BEGIN
  -- Get active subscription
  SELECT * INTO v_subscription
  FROM user_subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;
  
  -- If no subscription, deny
  IF v_subscription IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Pro tier has unlimited posts
  IF v_subscription.tier = 'pro' THEN
    RETURN TRUE;
  END IF;
  
  -- Get credits/usage
  SELECT * INTO v_credits
  FROM user_credits
  WHERE user_id = p_user_id;
  
  -- Set limits based on tier
  IF v_subscription.tier = 'free' THEN
    IF p_category = 'items' THEN
      v_limit := 2;
      v_current := v_credits.items_posted_this_month;
    ELSIF p_category = 'properties' THEN
      v_limit := 1;
      v_current := v_credits.properties_posted_this_month;
    ELSIF p_category IN ('vehicles', 'machinery', 'marine') THEN
      v_limit := 1;
      v_current := v_credits.vehicles_posted_this_month;
    ELSE
      v_limit := 1;
      v_current := 0;
    END IF;
  ELSIF v_subscription.tier = 'premium' THEN
    IF p_category = 'items' THEN
      v_limit := 10;
      v_current := v_credits.items_posted_this_month;
    ELSIF p_category = 'properties' THEN
      v_limit := 3;
      v_current := v_credits.properties_posted_this_month;
    ELSIF p_category IN ('vehicles', 'machinery', 'marine') THEN
      v_limit := 3;
      v_current := v_credits.vehicles_posted_this_month;
    ELSE
      v_limit := 5;
      v_current := 0;
    END IF;
  END IF;
  
  RETURN v_current < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment posting count
CREATE OR REPLACE FUNCTION increment_posting_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Only increment when status changes to 'active' or 'pending'
  IF NEW.status IN ('active', 'pending') AND (OLD.status IS NULL OR OLD.status = 'draft') THEN
    UPDATE user_credits
    SET
      items_posted_this_month = CASE 
        WHEN NEW.category = 'items' THEN items_posted_this_month + 1 
        ELSE items_posted_this_month 
      END,
      properties_posted_this_month = CASE 
        WHEN NEW.category = 'properties' THEN properties_posted_this_month + 1 
        ELSE properties_posted_this_month 
      END,
      vehicles_posted_this_month = CASE 
        WHEN NEW.category IN ('vehicles', 'marine') THEN vehicles_posted_this_month + 1 
        ELSE vehicles_posted_this_month 
      END,
      machinery_posted_this_month = CASE 
        WHEN NEW.category = 'machinery' THEN machinery_posted_this_month + 1 
        ELSE machinery_posted_this_month 
      END,
      total_posts_lifetime = total_posts_lifetime + 1,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_user_posting_count
  AFTER INSERT OR UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION increment_posting_count();

-- =============================================
-- 12. INITIAL DATA / SEED
-- =============================================

-- Create admin notification function for new announcements
CREATE OR REPLACE FUNCTION notify_new_announcement()
RETURNS TRIGGER AS $$
BEGIN
  -- Send notification via pg_notify for real-time admin dashboard
  PERFORM pg_notify(
    'new_announcement',
    json_build_object(
      'id', NEW.id,
      'title', NEW.title,
      'category', NEW.category,
      'user_id', NEW.user_id,
      'status', NEW.status
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_new_announcement_trigger
  AFTER INSERT ON announcements
  FOR EACH ROW EXECUTE FUNCTION notify_new_announcement();

-- Grant permissions
GRANT ALL ON user_subscriptions TO authenticated;
GRANT ALL ON user_credits TO authenticated;
GRANT ALL ON announcements TO authenticated, anon;
GRANT ALL ON credit_transactions TO authenticated;
GRANT ALL ON announcement_views TO authenticated, anon;
GRANT ALL ON oauth_accounts TO authenticated;
GRANT ALL ON referral_program TO authenticated;
GRANT ALL ON announcement_favorites TO authenticated;
GRANT ALL ON announcement_reports TO authenticated, anon;

-- Service role needs full access
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

COMMENT ON TABLE user_subscriptions IS 'Manages user subscription tiers (Free, Premium, Pro) with Stripe integration';
COMMENT ON TABLE user_credits IS 'Tracks user credits and monthly posting limits based on subscription tier';
COMMENT ON TABLE announcements IS 'Unified table for all classified listings across all categories (items, properties, vehicles, etc.)';
COMMENT ON TABLE credit_transactions IS 'Audit log of all credit purchases, earnings, and usage';
COMMENT ON TABLE announcement_views IS 'Analytics tracking for announcement views with geolocation and engagement metrics';
COMMENT ON TABLE oauth_accounts IS 'Manages OAuth login providers (Google, Microsoft, Apple) linked to user accounts';
COMMENT ON TABLE referral_program IS 'Referral system for user acquisition with rewards tracking';
COMMENT ON TABLE announcement_favorites IS 'User saved/favorited listings with folders and price alerts';
COMMENT ON TABLE announcement_reports IS 'User reports for inappropriate content with admin moderation workflow';
