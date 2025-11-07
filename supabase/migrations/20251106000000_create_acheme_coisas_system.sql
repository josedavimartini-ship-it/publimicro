-- AcheMeCoisas Categories and General Classifieds System
-- Migration: 20251106000000_create_acheme_coisas_system.sql

-- Enable ltree extension for hierarchical categories
CREATE EXTENSION IF NOT EXISTS ltree;

-- Create enum for item condition
DO $$ BEGIN
    CREATE TYPE item_condition AS ENUM (
        'new',
        'like_new',
        'good',
        'fair',
        'for_parts'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for listing type
DO $$ BEGIN
    CREATE TYPE listing_type AS ENUM (
        'sell',
        'buy',
        'trade',
        'free',
        'wanted'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Categories table with hierarchical structure
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    path ltree NOT NULL, -- Hierarchical path (e.g., 'electronics.computers.laptops')
    description TEXT,
    icon VARCHAR(50), -- Emoji or icon name
    custom_fields JSONB, -- Category-specific fields (e.g., {"size": "required", "brand": "optional"})
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for hierarchical queries
CREATE INDEX IF NOT EXISTS idx_categories_path ON categories USING GIST(path);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);

-- General listings table (extends properties table concept)
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) NOT NULL,
    
    -- Basic info
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    listing_type listing_type DEFAULT 'sell',
    
    -- Pricing
    price DECIMAL(15, 2),
    is_negotiable BOOLEAN DEFAULT false,
    accepts_trade BOOLEAN DEFAULT false,
    
    -- Item details
    condition item_condition,
    brand VARCHAR(100),
    model VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    custom_fields JSONB, -- Category-specific data
    
    -- Media
    photos TEXT[], -- Array of image URLs
    video_url TEXT,
    
    -- Location
    state VARCHAR(50),
    city VARCHAR(100),
    neighborhood VARCHAR(100),
    zip_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- SEO & Search
    slug VARCHAR(250) UNIQUE NOT NULL,
    tags TEXT[],
    search_vector tsvector,
    
    -- Status & Metrics
    status property_status DEFAULT 'draft',
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    featured_until TIMESTAMPTZ,
    
    -- Shipping
    shipping_available BOOLEAN DEFAULT false,
    shipping_cost DECIMAL(10, 2),
    weight_kg DECIMAL(10, 2),
    dimensions_cm VARCHAR(50), -- Format: "10x20x30"
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
    
    CONSTRAINT listings_price_positive CHECK (price IS NULL OR price >= 0),
    CONSTRAINT listings_quantity_positive CHECK (quantity > 0)
);

-- Indexes for listings
CREATE INDEX IF NOT EXISTS idx_listings_user ON listings (user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings (category_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings (state, city);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings (price);
CREATE INDEX IF NOT EXISTS idx_listings_created ON listings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_search ON listings USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_listings_tags ON listings USING GIN(tags);

-- Auto-update search vector
CREATE OR REPLACE FUNCTION listings_search_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.brand, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_search_vector_update
BEFORE INSERT OR UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION listings_search_update();

-- Auto-update timestamps
CREATE TRIGGER listings_updated_at
BEFORE UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- RLS Policies for listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Public can view active listings
CREATE POLICY "Public can view active listings"
ON listings FOR SELECT
TO public
USING (status = 'active' AND expires_at > NOW());

-- Users can view their own listings (any status)
CREATE POLICY "Users can view own listings"
ON listings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create listings
CREATE POLICY "Users can create listings"
ON listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete own listings"
ON listings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Listing favorites (similar to property_favorites)
CREATE TABLE IF NOT EXISTS listing_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_listing_favorites_user ON listing_favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_listing_favorites_listing ON listing_favorites (listing_id);

ALTER TABLE listing_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own listing favorites"
ON listing_favorites FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Insert root categories
INSERT INTO categories (name, slug, path, description, icon, display_order) VALUES
('Eletrônicos', 'eletronicos', 'eletronicos', 'Computadores, celulares, TVs e mais', '📱', 1),
('Casa e Jardim', 'casa-jardim', 'casa_jardim', 'Móveis, decoração e ferramentas', '🏠', 2),
('Moda e Acessórios', 'moda-acessorios', 'moda', 'Roupas, calçados e acessórios', '👔', 3),
('Esportes e Lazer', 'esportes-lazer', 'esportes', 'Equipamentos esportivos e hobbies', '🎮', 4),
('Bebês e Crianças', 'bebes-criancas', 'bebes', 'Produtos infantis e brinquedos', '👶', 5),
('Animais de Estimação', 'animais', 'animais', 'Pets e acessórios', '🐾', 6),
('Livros e Entretenimento', 'livros-entretenimento', 'livros', 'Livros, filmes e música', '📚', 7),
('Escritório e Negócios', 'escritorio-negocios', 'escritorio', 'Material de escritório e equipamentos', '💼', 8),
('Serviços', 'servicos', 'servicos', 'Freelancers e serviços profissionais', '⚡', 9),
('Empregos', 'empregos', 'empregos', 'Vagas de emprego', '🏢', 10),
('Eventos e Ingressos', 'eventos-ingressos', 'eventos', 'Shows, teatro e eventos', '🎟️', 11),
('Viagens', 'viagens', 'viagens', 'Pacotes e acomodações', '🌍', 12),
('Grátis e Trocas', 'gratis-trocas', 'gratis', 'Itens gratuitos e escambo', '🎨', 13)
ON CONFLICT (slug) DO NOTHING;

-- Grant permissions
GRANT ALL ON categories TO postgres, authenticated, service_role;
GRANT SELECT ON categories TO anon;
GRANT ALL ON listings TO postgres, authenticated, service_role;
GRANT SELECT ON listings TO anon;
GRANT ALL ON listing_favorites TO postgres, authenticated, service_role;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'AcheMeCoisas system created successfully!';
    RAISE NOTICE 'Tables: categories, listings, listing_favorites';
    RAISE NOTICE 'Ready for general classifieds posting!';
END $$;
