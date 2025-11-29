-- Visits scheduling table
CREATE TABLE IF NOT EXISTS visitas_agendadas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  documento TEXT NOT NULL, -- CPF/RG
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  pais TEXT DEFAULT ''Brasil'',
  data_preferencia DATE NOT NULL,
  horario_preferencia TEXT NOT NULL,
  mensagem TEXT,
  tipo_visita TEXT NOT NULL CHECK (tipo_visita IN (''presencial'', ''video'')),
  property_id TEXT,
  property_title TEXT,
  status TEXT DEFAULT ''pendente'' CHECK (status IN (''pendente'', ''confirmada'', ''realizada'', ''cancelada'')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Authorization codes for proposals
CREATE TABLE IF NOT EXISTS authorization_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  property_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  visit_id UUID REFERENCES visitas_agendadas(id),
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL ''30 days'',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_visitas_property_id ON visitas_agendadas(property_id);
CREATE INDEX IF NOT EXISTS idx_visitas_status ON visitas_agendadas(status);
CREATE INDEX IF NOT EXISTS idx_auth_codes_code ON authorization_codes(code);
CREATE INDEX IF NOT EXISTS idx_auth_codes_property ON authorization_codes(property_id);

-- Function to generate authorization code after visit confirmation
CREATE OR REPLACE FUNCTION generate_authorization_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = ''confirmada'' AND OLD.status != ''confirmada'' THEN
    INSERT INTO authorization_codes (code, property_id, user_email, visit_id)
    VALUES (
      ''PROP-'' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)),
      NEW.property_id,
      NEW.email,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate authorization code
CREATE TRIGGER trigger_generate_auth_code
AFTER UPDATE ON visitas_agendadas
FOR EACH ROW
EXECUTE FUNCTION generate_authorization_code();
