-- Insert default admin_emails array into app_settings if missing
INSERT INTO public.app_settings (key, value)
SELECT 'admin_emails', '["admin@publimicro.com.br", "contato@publimicro.com.br"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.app_settings WHERE key = 'admin_emails');
-- Insert default admin_emails array into app_settings if missing
INSERT INTO public.app_settings (key, value)
SELECT 'admin_emails', '["admin@publimicro.com.br", "contato@publimicro.com.br"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.app_settings WHERE key = 'admin_emails');
-- Placeholder migration to match remote state (no-op)
DO $$ BEGIN RAISE NOTICE 'placeholder 20251112000001'; END $$;
