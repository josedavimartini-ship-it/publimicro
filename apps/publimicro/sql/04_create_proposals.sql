-- PROPOSALS: purchase/bid offers
CREATE TABLE IF NOT EXISTS public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visit_id uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  status text DEFAULT 'pending', -- pending | accepted | rejected | cancelled
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own proposals"
  ON public.proposals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User can insert proposals"
  ON public.proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Auto-accept proposals above threshold
CREATE OR REPLACE FUNCTION public.auto_accept_proposals()
RETURNS trigger AS $$
DECLARE
  current_price numeric;
  threshold numeric;
BEGIN
  SELECT COALESCE(current_bid, price, 0) INTO current_price 
  FROM public.ads WHERE id = new.ad_id;
  
  threshold := current_price * 1.10; -- accept if >=10% higher

  IF new.amount >= threshold THEN
    UPDATE public.proposals SET status = 'accepted' WHERE id = new.id;

    INSERT INTO public.bids(ad_id, user_id, proposal_id, amount)
    VALUES (new.ad_id, new.user_id, new.id, new.amount);

    UPDATE public.ads SET current_bid = new.amount WHERE id = new.ad_id;

    PERFORM pg_notify('proposal_auto_accepted', json_build_object(
      'ad_id', new.ad_id,
      'user_id', new.user_id,
      'amount', new.amount
    )::text);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_accept_proposals ON public.proposals;
CREATE TRIGGER trg_auto_accept_proposals
  AFTER INSERT ON public.proposals
  FOR EACH ROW EXECUTE PROCEDURE public.auto_accept_proposals();