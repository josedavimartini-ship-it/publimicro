# 🔧 Como Criar o Bucket de Storage

## Erro Atual
```
StorageApiError: Bucket not found
```

## Solução: Criar Bucket no Supabase

### Passos:

1. **Acesse:** https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc/storage/buckets

2. **Clique em "New Bucket"**

3. **Configure:**
   - **Name:** `imagens-sitios`
   - **Public bucket:** ✅ **MARQUE ESTA OPÇÃO** (importante!)
   - **File size limit:** 5 MB (ou deixe padrão)
   - **Allowed MIME types:** `image/*` (ou deixe vazio para aceitar todos)

4. **Clique em "Create Bucket"**

5. **Configurar políticas RLS:**

Vá para: https://supabase.com/dashboard/project/irrzpwzyqcubhhjeuakc/storage/policies

Clique no bucket `imagens-sitios` e adicione estas 4 políticas:

**Política 1 - Upload (INSERT) para usuários autenticados:**
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagens-sitios');
```

**Política 2 - Leitura pública (SELECT) - Todos podem ver:**
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'imagens-sitios');
```

**Política 3 - Atualizar próprias imagens (UPDATE):**
```sql
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'imagens-sitios' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Política 4 - Deletar próprias imagens (DELETE):**
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'imagens-sitios' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## ✅ Pronto!

Depois de criar o bucket, tente fazer upload de fotos novamente.
