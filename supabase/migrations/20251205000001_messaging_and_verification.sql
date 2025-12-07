-- ============================================
-- MESSAGING SYSTEM AND USER VERIFICATION ENHANCEMENTS
-- Migration: 20251205000001
-- ============================================

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID,
  item_type VARCHAR(50), -- 'property', 'listing', 'vehicle'
  item_title TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate conversations for same item between same users
  UNIQUE(participant_1, participant_2, item_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  item_id UUID,
  item_type VARCHAR(50),
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing favorites table (for non-property items)
CREATE TABLE IF NOT EXISTS public.listing_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type VARCHAR(50) DEFAULT 'listing',
  folder_name VARCHAR(100) DEFAULT 'Favoritos',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, user_id)
);

-- Add verification and free listing tracking to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS documents_pending BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS document_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS selfie_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gov_br_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gov_br_level INTEGER DEFAULT 0, -- 0=none, 1=bronze, 2=prata, 3=ouro
ADD COLUMN IF NOT EXISTS fully_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_level VARCHAR(50) DEFAULT 'unverified',
ADD COLUMN IF NOT EXISTS free_listing_used BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS free_listing_id UUID,
ADD COLUMN IF NOT EXISTS free_listing_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS background_check_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS background_check_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS facial_recognition_passed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS facial_recognition_date TIMESTAMPTZ;

-- User documents table for verification
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL, -- 'cpf', 'rg', 'cnh', 'passport', 'proof_address', 'selfie_doc'
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Background check results table
CREATE TABLE IF NOT EXISTS public.background_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  check_type VARCHAR(50) NOT NULL, -- 'criminal_federal', 'criminal_state', 'cpf_status', 'fraud_alerts', 'debit_restrictions'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'clear', 'flagged', 'error'
  result JSONB,
  provider VARCHAR(100),
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON public.conversations(participant_1);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON public.conversations(participant_2);
CREATE INDEX IF NOT EXISTS idx_conversations_item_id ON public.conversations(item_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(receiver_id) WHERE read = FALSE;

CREATE INDEX IF NOT EXISTS idx_listing_favorites_user ON public.listing_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_listing_favorites_listing ON public.listing_favorites(listing_id);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON public.user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_status ON public.user_documents(status);

CREATE INDEX IF NOT EXISTS idx_background_checks_user ON public.background_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_background_checks_status ON public.background_checks(status);

-- RLS Policies

-- Conversations: Users can only see their own conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = participant_1);

-- Messages: Users can only see messages in their conversations
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark their received messages as read" ON public.messages
  FOR UPDATE USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Listing favorites
ALTER TABLE public.listing_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their favorites" ON public.listing_favorites
  FOR ALL USING (auth.uid() = user_id);

-- User documents: Users can only see their own documents
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their documents" ON public.user_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload documents" ON public.user_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Background checks: Users can only see their own checks
ALTER TABLE public.background_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their background checks" ON public.background_checks
  FOR SELECT USING (auth.uid() = user_id);

-- Function to update conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations 
  SET last_message_at = NEW.created_at,
      last_message_preview = LEFT(NEW.content, 100)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_message_insert ON public.messages;
CREATE TRIGGER on_message_insert
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Function to check if user can post free listing
CREATE OR REPLACE FUNCTION can_post_free_listing(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record RECORD;
BEGIN
  SELECT free_listing_used, email_verified 
  INTO profile_record
  FROM public.user_profiles 
  WHERE id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- User must have verified email and not used free listing
  RETURN profile_record.email_verified = TRUE AND COALESCE(profile_record.free_listing_used, FALSE) = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to mark free listing as used
CREATE OR REPLACE FUNCTION mark_free_listing_used(user_uuid UUID, listing_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_profiles 
  SET free_listing_used = TRUE,
      free_listing_id = listing_uuid,
      free_listing_date = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;
