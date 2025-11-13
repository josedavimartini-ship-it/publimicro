-- Audit table for media uploads attached to properties
CREATE TABLE IF NOT EXISTS public.property_media_audit (
  id BIGSERIAL PRIMARY KEY,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  uploads jsonb NOT NULL,
  changed_by text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_property_media_audit_property ON public.property_media_audit (property_id);
