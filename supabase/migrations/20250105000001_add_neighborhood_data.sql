-- Add neighborhood data table for storing Points of Interest (POI) information
-- This table stores distances and information about nearby amenities for each property

-- Create neighborhood_data table
CREATE TABLE IF NOT EXISTS public.neighborhood_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  
  -- Healthcare
  nearest_hospital_name TEXT,
  nearest_hospital_distance_km DECIMAL(5,2),
  nearest_clinic_name TEXT,
  nearest_clinic_distance_km DECIMAL(5,2),
  
  -- Education
  nearest_school_name TEXT,
  nearest_school_distance_km DECIMAL(5,2),
  nearest_university_name TEXT,
  nearest_university_distance_km DECIMAL(5,2),
  
  -- Shopping & Services
  nearest_supermarket_name TEXT,
  nearest_supermarket_distance_km DECIMAL(5,2),
  nearest_pharmacy_name TEXT,
  nearest_pharmacy_distance_km DECIMAL(5,2),
  nearest_gas_station_name TEXT,
  nearest_gas_station_distance_km DECIMAL(5,2),
  nearest_bank_name TEXT,
  nearest_bank_distance_km DECIMAL(5,2),
  
  -- Infrastructure
  road_condition TEXT CHECK (road_condition IN ('paved', 'gravel', 'dirt', 'mixed')),
  road_quality TEXT CHECK (road_quality IN ('excellent', 'good', 'fair', 'poor')),
  public_transport_available BOOLEAN DEFAULT false,
  public_transport_distance_km DECIMAL(5,2),
  
  -- Connectivity
  internet_available BOOLEAN DEFAULT false,
  internet_type TEXT CHECK (internet_type IN ('fiber', 'cable', 'satellite', '4G', '5G', 'none')),
  internet_speed_mbps INTEGER,
  mobile_signal_quality TEXT CHECK (mobile_signal_quality IN ('excellent', 'good', 'fair', 'poor', 'none')),
  
  -- Utilities
  electricity_available BOOLEAN DEFAULT true,
  water_source TEXT CHECK (water_source IN ('public', 'well', 'river', 'cistern', 'truck')),
  sewage_system TEXT CHECK (sewage_system IN ('public', 'septic', 'none')),
  
  -- Location characteristics
  urban_area BOOLEAN DEFAULT false,
  rural_area BOOLEAN DEFAULT true,
  distance_to_city_center_km DECIMAL(6,2),
  nearest_city_name TEXT,
  
  -- Metadata
  data_quality TEXT CHECK (data_quality IN ('verified', 'estimated', 'user_reported')) DEFAULT 'estimated',
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint to ensure one record per property
CREATE UNIQUE INDEX IF NOT EXISTS idx_neighborhood_data_property 
  ON public.neighborhood_data(property_id);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_neighborhood_data_hospital 
  ON public.neighborhood_data(nearest_hospital_distance_km) 
  WHERE nearest_hospital_distance_km IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_neighborhood_data_school 
  ON public.neighborhood_data(nearest_school_distance_km) 
  WHERE nearest_school_distance_km IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_neighborhood_data_internet 
  ON public.neighborhood_data(internet_available, internet_type) 
  WHERE internet_available = true;

CREATE INDEX IF NOT EXISTS idx_neighborhood_data_urban 
  ON public.neighborhood_data(urban_area, rural_area);

-- Enable Row Level Security
ALTER TABLE public.neighborhood_data ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read neighborhood data
CREATE POLICY "Anyone can view neighborhood data"
  ON public.neighborhood_data
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only authenticated users can insert neighborhood data
CREATE POLICY "Authenticated users can insert neighborhood data"
  ON public.neighborhood_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update neighborhood data
CREATE POLICY "Authenticated users can update neighborhood data"
  ON public.neighborhood_data
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_neighborhood_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_neighborhood_data_timestamp
  BEFORE UPDATE ON public.neighborhood_data
  FOR EACH ROW
  EXECUTE FUNCTION update_neighborhood_data_updated_at();

-- Insert sample data for existing Carcará property (if exists)
-- This is mock data - in production, use actual geocoding and POI lookup
INSERT INTO public.neighborhood_data (
  property_id,
  nearest_hospital_name,
  nearest_hospital_distance_km,
  nearest_school_name,
  nearest_school_distance_km,
  nearest_supermarket_name,
  nearest_supermarket_distance_km,
  nearest_gas_station_name,
  nearest_gas_station_distance_km,
  road_condition,
  road_quality,
  internet_available,
  internet_type,
  internet_speed_mbps,
  mobile_signal_quality,
  water_source,
  sewage_system,
  rural_area,
  distance_to_city_center_km,
  nearest_city_name,
  data_quality
)
SELECT 
  id,
  'Hospital Regional de Planaltina',
  8.5,
  'Escola Classe 01 de Planaltina',
  3.2,
  'Supermercado BH',
  4.7,
  'Posto Shell BR-020',
  5.1,
  'paved',
  'good',
  true,
  'fiber',
  100,
  'good',
  'public',
  'septic',
  true,
  15.3,
  'Planaltina',
  'estimated'
FROM public.properties 
WHERE title ILIKE '%Carcará%' OR title ILIKE '%Sítio%'
ON CONFLICT (property_id) DO NOTHING;

COMMENT ON TABLE public.neighborhood_data IS 'Stores Points of Interest and infrastructure data for properties';
COMMENT ON COLUMN public.neighborhood_data.data_quality IS 'Indicates if data is verified by staff, estimated algorithmically, or reported by users';
COMMENT ON COLUMN public.neighborhood_data.internet_type IS 'Type of internet connection available at the property';
COMMENT ON COLUMN public.neighborhood_data.road_condition IS 'Surface type of the main access road to the property';
