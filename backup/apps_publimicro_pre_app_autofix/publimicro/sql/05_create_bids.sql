-- BIDS: accepted proposals / bid history
CREATE TABLE IF NOT EXISTS public.bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.update_current_bid()
RETURNS trigger AS $$
BEGIN
  UPDATE public.ads 
  SET current_bid = GREATEST(COALESCE(current_bid, 0), new.amount),
      updated_at = now()
  WHERE id = new.ad_id;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_bid ON public.bids;
CREATE TRIGGER trg_update_bid
  AFTER INSERT ON public.bids
  FOR EACH ROW EXECUTE PROCEDURE public.update_current_bid();

CREATE INDEX IF NOT EXISTS idx_bids_ad ON public.bids(ad_id);
CREATE INDEX IF NOT EXISTS idx_bids_user ON public.bids(user_id);