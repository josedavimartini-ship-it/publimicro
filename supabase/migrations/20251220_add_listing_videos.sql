-- Add listing_videos table to store processed video metadata
CREATE TABLE IF NOT EXISTS public.listing_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer,
  display_order integer DEFAULT 0,
  is_cover boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_listing_videos_listing_id ON public.listing_videos(listing_id);
