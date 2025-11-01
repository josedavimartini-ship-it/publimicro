-- Create bids/proposals table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.sitios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bid_amount NUMERIC(15, 2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'counter')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS bids_property_id_idx ON public.bids(property_id);
CREATE INDEX IF NOT EXISTS bids_user_id_idx ON public.bids(user_id);
CREATE INDEX IF NOT EXISTS bids_status_idx ON public.bids(status);
CREATE INDEX IF NOT EXISTS bids_created_at_idx ON public.bids(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own bids
CREATE POLICY "Users can view their own bids"
  ON public.bids
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own bids
CREATE POLICY "Users can create bids"
  ON public.bids
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Property owners can view bids on their properties
CREATE POLICY "Property owners can view bids on their properties"
  ON public.bids
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sitios
      WHERE sitios.id = bids.property_id
      AND sitios.user_id = auth.uid()
    )
  );

-- Property owners can update bid status
CREATE POLICY "Property owners can update bid status"
  ON public.bids
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.sitios
      WHERE sitios.id = bids.property_id
      AND sitios.user_id = auth.uid()
    )
  );

-- Function to auto-update lance_inicial when new bid is higher
CREATE OR REPLACE FUNCTION update_lance_inicial_on_bid()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if the new bid is higher than current lance_inicial
  UPDATE public.sitios
  SET lance_inicial = NEW.bid_amount,
      updated_at = NOW()
  WHERE id = NEW.property_id
  AND (lance_inicial IS NULL OR NEW.bid_amount > lance_inicial);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update lance_inicial after each bid
DROP TRIGGER IF EXISTS trigger_update_lance_inicial ON public.bids;
CREATE TRIGGER trigger_update_lance_inicial
  AFTER INSERT ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION update_lance_inicial_on_bid();

-- Function to get current highest bid for a property
CREATE OR REPLACE FUNCTION get_highest_bid(property_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT COALESCE(MAX(bid_amount), 0)
  FROM public.bids
  WHERE property_id = property_uuid
  AND status != 'rejected';
$$ LANGUAGE sql STABLE;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bids_updated_at ON public.bids;
CREATE TRIGGER update_bids_updated_at
  BEFORE UPDATE ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT ON public.bids TO authenticated;
GRANT SELECT ON public.bids TO anon;
