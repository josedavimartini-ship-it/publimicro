-- Create contacts table for form submissions
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em_analise', 'respondido', 'arquivado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS contacts_status_idx ON public.contacts(status);
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON public.contacts(email);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can insert (public contact form)
CREATE POLICY "Anyone can submit contact form"
  ON public.contacts
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view their own contacts
CREATE POLICY "Users can view their own contacts"
  ON public.contacts
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT INSERT ON public.contacts TO anon;
GRANT SELECT, INSERT ON public.contacts TO authenticated;
