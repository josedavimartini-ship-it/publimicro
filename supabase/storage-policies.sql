-- ========================================
-- POLÍTICAS COMPLETAS PARA STORAGE BUCKET
-- Execute este SQL no Supabase SQL Editor
-- ========================================

-- Política 1: Upload de imagens (INSERT)
-- Permite que usuários autenticados façam upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagens-sitios');

-- Política 2: Leitura pública (SELECT)
-- Permite que qualquer pessoa visualize as imagens
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'imagens-sitios');

-- Política 3: Atualizar próprias imagens (UPDATE)
-- Permite que usuários atualizem apenas suas próprias imagens
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'imagens-sitios' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política 4: Deletar próprias imagens (DELETE)
-- Permite que usuários deletem apenas suas próprias imagens
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'imagens-sitios' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Verificar políticas criadas
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
