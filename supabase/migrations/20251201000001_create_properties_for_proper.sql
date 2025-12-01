-- ============================================
-- PROPERTIES TABLE AND RELATED TABLES FOR PROPER APP
-- ============================================

-- Properties table for the real estate app (proper)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  -- Owner
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(300) UNIQUE,
  keywords TEXT[],
  
  -- Property Classification
  property_type VARCHAR(50) NOT NULL CHECK (property_type IN (
    'apartment', 'house', 'chacara', 'sitio', 'fazenda', 'rancho', 
    'commercial', 'land', 'condo', 'townhouse', 'office', 'warehouse'
  )),
  transaction_type VARCHAR(50) NOT NULL DEFAULT 'sale' CHECK (transaction_type IN (
    'sale', 'rent', 'lease', 'auction', 'exchange'
  )),
  
  -- Pricing
  price DECIMAL(15, 2) NOT NULL,
  condominium_fee DECIMAL(12, 2),
  iptu_annual DECIMAL(12, 2),
  accepts_financing BOOLEAN DEFAULT true,
  accepts_exchange BOOLEAN DEFAULT false,
  
  -- Location
  country VARCHAR(100) DEFAULT 'Brazil',
  state VARCHAR(100),
  city VARCHAR(100),
  neighborhood VARCHAR(255),
  address TEXT,
  zip_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Area
  total_area DECIMAL(12, 2),
  built_area DECIMAL(12, 2),
  land_area DECIMAL(12, 2),
  
  -- Urban Features
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  parking_spaces INTEGER DEFAULT 0,
  floors INTEGER DEFAULT 1,
  year_built INTEGER,
  furnished BOOLEAN DEFAULT false,
  
  -- Rural Features
  water_source VARCHAR(100),
  has_electricity BOOLEAN DEFAULT true,
  has_internet BOOLEAN DEFAULT false,
  soil_quality VARCHAR(100),
  topography VARCHAR(100),
  vegetation_type VARCHAR(100),
  near_water BOOLEAN DEFAULT false,
  water_distance_meters INTEGER,
  
  -- Documentation
  has_deed BOOLEAN DEFAULT false,
  has_registration BOOLEAN DEFAULT false,
  
  -- Media
  video_url TEXT,
  virtual_tour_url TEXT,
  
  -- Status & Metrics
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
    'draft', 'pending', 'active', 'sold', 'rented', 'inactive', 'expired'
  )),
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0
);

-- Property photos table
CREATE TABLE IF NOT EXISTS public.property_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption VARCHAR(255),
  is_cover BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property amenities table
CREATE TABLE IF NOT EXISTS public.property_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  amenity_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, amenity_type)
);

-- Property favorites table
CREATE TABLE IF NOT EXISTS public.property_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_name VARCHAR(100) DEFAULT 'Favorites',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, user_id)
);

-- Property views table for analytics
CREATE TABLE IF NOT EXISTS public.property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visits table for scheduling property visits
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'completed', 'cancelled', 'no_show'
  )),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property proposals/bids table
CREATE TABLE IF NOT EXISTS public.property_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  use_financing BOOLEAN DEFAULT false,
  down_payment DECIMAL(15, 2),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
    'pending', 'accepted', 'rejected', 'countered', 'expired', 'withdrawn'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON public.properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_state ON public.properties(state);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);

CREATE INDEX IF NOT EXISTS idx_property_photos_property_id ON public.property_photos(property_id);
CREATE INDEX IF NOT EXISTS idx_property_amenities_property_id ON public.property_amenities(property_id);
CREATE INDEX IF NOT EXISTS idx_property_favorites_user_id ON public.property_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_property_id ON public.visits(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON public.visits(user_id);
CREATE INDEX IF NOT EXISTS idx_property_proposals_property_id ON public.property_proposals(property_id);

-- Auto-update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_updated_at ON public.properties;
CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS visits_updated_at ON public.visits;
CREATE TRIGGER visits_updated_at
  BEFORE UPDATE ON public.visits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS property_proposals_updated_at ON public.property_proposals;
CREATE TRIGGER property_proposals_updated_at
  BEFORE UPDATE ON public.property_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Generate slug function for properties
CREATE OR REPLACE FUNCTION generate_property_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := lower(trim(regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g')));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := substring(base_slug, 1, 250);
    
    final_slug := base_slug;
    
    WHILE EXISTS (SELECT 1 FROM public.properties WHERE slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_generate_slug ON public.properties;
CREATE TRIGGER properties_generate_slug
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION generate_property_slug();

-- Increment views count function
CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.properties 
  SET views_count = views_count + 1 
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS property_views_increment ON public.property_views;
CREATE TRIGGER property_views_increment
  AFTER INSERT ON public.property_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_property_views();

-- Update favorites count function
CREATE OR REPLACE FUNCTION update_property_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.properties 
    SET favorites_count = favorites_count + 1 
    WHERE id = NEW.property_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.properties 
    SET favorites_count = favorites_count - 1 
    WHERE id = OLD.property_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS property_favorites_count_insert ON public.property_favorites;
CREATE TRIGGER property_favorites_count_insert
  AFTER INSERT ON public.property_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_property_favorites_count();

DROP TRIGGER IF EXISTS property_favorites_count_delete ON public.property_favorites;
CREATE TRIGGER property_favorites_count_delete
  AFTER DELETE ON public.property_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_property_favorites_count();

-- Grant permissions
GRANT ALL ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
GRANT SELECT ON public.properties TO anon;

GRANT ALL ON public.property_photos TO authenticated;
GRANT ALL ON public.property_photos TO service_role;
GRANT SELECT ON public.property_photos TO anon;

GRANT ALL ON public.property_amenities TO authenticated;
GRANT ALL ON public.property_amenities TO service_role;
GRANT SELECT ON public.property_amenities TO anon;

GRANT ALL ON public.property_favorites TO authenticated;
GRANT ALL ON public.property_favorites TO service_role;

GRANT ALL ON public.property_views TO authenticated;
GRANT ALL ON public.property_views TO service_role;
GRANT INSERT ON public.property_views TO anon;

GRANT ALL ON public.visits TO authenticated;
GRANT ALL ON public.visits TO service_role;

GRANT ALL ON public.property_proposals TO authenticated;
GRANT ALL ON public.property_proposals TO service_role;

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_proposals ENABLE ROW LEVEL SECURITY;

-- Properties RLS policies
CREATE POLICY "properties_select_public"
  ON public.properties FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "properties_insert_authenticated"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "properties_update_owner"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "properties_delete_owner"
  ON public.properties FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Property photos RLS policies
CREATE POLICY "property_photos_select_all"
  ON public.property_photos FOR SELECT
  USING (true);

CREATE POLICY "property_photos_insert_owner"
  ON public.property_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "property_photos_update_owner"
  ON public.property_photos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "property_photos_delete_owner"
  ON public.property_photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

-- Property amenities RLS policies
CREATE POLICY "property_amenities_select_all"
  ON public.property_amenities FOR SELECT
  USING (true);

CREATE POLICY "property_amenities_insert_owner"
  ON public.property_amenities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "property_amenities_delete_owner"
  ON public.property_amenities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

-- Property favorites RLS policies
CREATE POLICY "property_favorites_select_own"
  ON public.property_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "property_favorites_insert_own"
  ON public.property_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "property_favorites_delete_own"
  ON public.property_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Property views RLS policies
CREATE POLICY "property_views_insert_all"
  ON public.property_views FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "property_views_select_service"
  ON public.property_views FOR SELECT
  TO service_role
  USING (true);

-- Visits RLS policies
CREATE POLICY "visits_select_own"
  ON public.visits FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "visits_insert_authenticated"
  ON public.visits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "visits_update_involved"
  ON public.visits FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

-- Property proposals RLS policies
CREATE POLICY "property_proposals_select_involved"
  ON public.property_proposals FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "property_proposals_insert_authenticated"
  ON public.property_proposals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "property_proposals_update_involved"
  ON public.property_proposals FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.properties IS 'Real estate properties for the Proper app';
COMMENT ON TABLE public.property_photos IS 'Photos associated with properties';
COMMENT ON TABLE public.property_amenities IS 'Amenities available at properties';
COMMENT ON TABLE public.property_favorites IS 'User favorite properties';
COMMENT ON TABLE public.property_views IS 'Property view analytics';
COMMENT ON TABLE public.visits IS 'Scheduled property visits';
COMMENT ON TABLE public.property_proposals IS 'Purchase/rental proposals for properties';
