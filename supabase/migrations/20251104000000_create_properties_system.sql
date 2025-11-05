-- ============================================
-- ACHEME PROPERS - Comprehensive Property System
-- ============================================

-- Property Types Enum
CREATE TYPE property_type AS ENUM (
  'apartment',      -- Apartamento
  'house',          -- Casa
  'chacara',        -- Chácara (< 2 hectares, near cities/villages)
  'sitio',          -- Sítio (2-50 hectares)
  'fazenda',        -- Fazenda (50+ hectares)
  'rancho',         -- Rancho (2+ hectares near water)
  'commercial',     -- Comercial (stores, offices)
  'land',           -- Terreno
  'penthouse',      -- Cobertura
  'studio',         -- Kitnet/Studio
  'townhouse',      -- Sobrado
  'condominium'     -- Condomínio fechado
);

-- Transaction Type Enum
CREATE TYPE transaction_type AS ENUM (
  'sale',           -- Venda
  'rent',           -- Aluguel
  'lease',          -- Arrendamento
  'auction'         -- Leilão
);

-- Property Status Enum
CREATE TYPE property_status AS ENUM (
  'draft',          -- Rascunho
  'pending',        -- Aguardando aprovação
  'active',         -- Ativo
  'sold',           -- Vendido
  'rented',         -- Alugado
  'inactive',       -- Inativo
  'rejected'        -- Rejeitado
);

-- ============================================
-- Properties Table (Main)
-- ============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Owner & Status
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status property_status DEFAULT 'draft',
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  
  -- Basic Info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  transaction_type transaction_type NOT NULL,
  
  -- Pricing
  price DECIMAL(15, 2),
  price_per_sqm DECIMAL(10, 2),
  condominium_fee DECIMAL(10, 2),
  iptu_annual DECIMAL(10, 2), -- Property tax
  accepts_financing BOOLEAN DEFAULT true,
  accepts_exchange BOOLEAN DEFAULT false,
  
  -- Location
  country VARCHAR(100) DEFAULT 'Brazil',
  state VARCHAR(100),
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  address TEXT,
  zip_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Area & Dimensions
  total_area DECIMAL(12, 2), -- m² or hectares
  built_area DECIMAL(12, 2), -- m²
  usable_area DECIMAL(12, 2), -- m²
  land_area DECIMAL(12, 2), -- m² (for houses) or hectares (for rural)
  
  -- Rooms & Features (Urban Properties)
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  parking_spaces INTEGER DEFAULT 0,
  living_rooms INTEGER DEFAULT 0,
  kitchens INTEGER DEFAULT 1,
  
  -- Rural Features
  water_source VARCHAR(100), -- 'river', 'well', 'lake', 'reservoir', 'public'
  has_electricity BOOLEAN DEFAULT false,
  has_internet BOOLEAN DEFAULT false,
  soil_quality VARCHAR(50), -- 'excellent', 'good', 'average', 'poor'
  topography VARCHAR(50), -- 'flat', 'hilly', 'mountainous', 'mixed'
  vegetation_type VARCHAR(100), -- 'forest', 'pasture', 'crops', 'mixed'
  near_water BOOLEAN DEFAULT false, -- For ranchos
  water_distance_meters INTEGER, -- Distance to river/sea
  
  -- Building Features
  year_built INTEGER,
  floors INTEGER DEFAULT 1,
  floor_number INTEGER, -- For apartments
  total_floors_building INTEGER, -- For apartments
  furnished BOOLEAN DEFAULT false,
  
  -- Security & Infrastructure
  has_security BOOLEAN DEFAULT false,
  has_concierge BOOLEAN DEFAULT false,
  has_elevator BOOLEAN DEFAULT false,
  has_generator BOOLEAN DEFAULT false,
  has_solar_panels BOOLEAN DEFAULT false,
  
  -- Documents & Legal
  has_deed BOOLEAN DEFAULT false, -- Escritura
  has_registration BOOLEAN DEFAULT false, -- Matrícula
  has_building_permit BOOLEAN DEFAULT false,
  legal_notes TEXT,
  
  -- SEO & Marketing
  slug VARCHAR(300) UNIQUE,
  keywords TEXT[],
  featured BOOLEAN DEFAULT false,
  video_url VARCHAR(500),
  virtual_tour_url VARCHAR(500),
  
  -- Analytics
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  contacts_count INTEGER DEFAULT 0,
  
  -- Timestamps
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- ============================================
-- Property Amenities Table
-- ============================================
CREATE TABLE property_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amenity_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Common amenities list
COMMENT ON TABLE property_amenities IS 
'Amenities: pool, gym, playground, sports_court, party_room, sauna, garden, 
barbecue, gourmet_kitchen, home_office, balcony, terrace, garage, storage,
laundry_room, service_area, maid_room, solar_heating, air_conditioning,
fireplace, wine_cellar, home_theater, stable, barn, warehouse, chicken_coop,
orchard, crop_field, pasture_land, fencing, irrigation_system';

-- ============================================
-- Property Photos Table
-- ============================================
CREATE TABLE property_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Property Documents Table
-- ============================================
CREATE TABLE property_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL, -- 'deed', 'registration', 'tax_bill', 'floor_plan', 'other'
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Property Views (Analytics)
-- ============================================
CREATE TABLE property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Property Favorites
-- ============================================
CREATE TABLE property_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, user_id)
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_transaction ON properties(transaction_type);
CREATE INDEX idx_properties_location ON properties(country, state, city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_featured ON properties(featured) WHERE featured = true;
CREATE INDEX idx_properties_published ON properties(published_at) WHERE published_at IS NOT NULL;

CREATE INDEX idx_property_photos_property ON property_photos(property_id);
CREATE INDEX idx_property_amenities_property ON property_amenities(property_id);
CREATE INDEX idx_property_favorites_user ON property_favorites(user_id);
CREATE INDEX idx_property_views_property ON property_views(property_id);

-- Composite index for location queries (latitude, longitude)
CREATE INDEX idx_properties_location_coords ON properties(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================
-- Functions
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Generate slug from title
CREATE OR REPLACE FUNCTION generate_property_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- Create base slug from title
    base_slug := lower(trim(regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g')));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := substring(base_slug, 1, 250);
    
    final_slug := base_slug;
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM properties WHERE slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_generate_slug
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION generate_property_slug();

-- Increment views count
CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties
  SET views_count = views_count + 1
  WHERE id = NEW.property_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_view_increment
  AFTER INSERT ON property_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_property_views();

-- Update favorites count
CREATE OR REPLACE FUNCTION update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties
    SET favorites_count = favorites_count - 1
    WHERE id = OLD.property_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_favorite_count
  AFTER INSERT OR DELETE ON property_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_favorites_count();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Properties Policies
CREATE POLICY "Public can view active properties"
  ON properties FOR SELECT
  USING (status = 'active' AND published_at IS NOT NULL);

CREATE POLICY "Users can view own properties"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);

-- Photos Policies
CREATE POLICY "Public can view photos of active properties"
  ON property_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_photos.property_id
        AND properties.status = 'active'
        AND properties.published_at IS NOT NULL
    )
  );

CREATE POLICY "Users can manage own property photos"
  ON property_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_photos.property_id
        AND properties.user_id = auth.uid()
    )
  );

-- Amenities Policies
CREATE POLICY "Public can view amenities"
  ON property_amenities FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own property amenities"
  ON property_amenities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_amenities.property_id
        AND properties.user_id = auth.uid()
    )
  );

-- Favorites Policies
CREATE POLICY "Users can view own favorites"
  ON property_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
  ON property_favorites FOR ALL
  USING (auth.uid() = user_id);

-- Views Policies
CREATE POLICY "Anyone can create property views"
  ON property_views FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Sample Data (Optional)
-- ============================================
-- Insert sample property types for testing
-- (Remove in production)
