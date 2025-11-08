-- ========================================
-- STORAGE POLICIES FOR VERIFICATION DOCUMENTS ONLY
-- Execute este SQL no Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Cole este código → Run
-- ========================================

-- ============================================
-- BUCKET: verification-documents (PRIVATE)
-- ============================================
-- Users upload ID photos, selfies, proof of address
-- SECURITY: Users can only access their own documents

-- Policy 1: Users can upload their own documents
CREATE POLICY "Users can upload own verification documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can view their own documents
CREATE POLICY "Users can view own verification documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can update their own documents
CREATE POLICY "Users can update own verification documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'verification-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Users can delete their own documents
CREATE POLICY "Users can delete own verification documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'verification-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 5: Admins (service_role) can view all documents for verification
CREATE POLICY "Service role can view all verification documents"
ON storage.objects FOR SELECT
TO service_role
USING (bucket_id = 'verification-documents');

-- ============================================
-- VERIFY POLICIES CREATED
-- ============================================
SELECT 
  policyname, 
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%verification%'
ORDER BY policyname;
