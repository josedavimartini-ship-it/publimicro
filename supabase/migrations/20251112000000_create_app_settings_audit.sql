-- Create audit table for app_settings changes
CREATE TABLE IF NOT EXISTS public.app_settings_audit (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_by TEXT,
  changed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_app_settings_audit_key ON public.app_settings_audit (key);
CREATE INDEX IF NOT EXISTS idx_app_settings_audit_changed_at ON public.app_settings_audit (changed_at DESC);
