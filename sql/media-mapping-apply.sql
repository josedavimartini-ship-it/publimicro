-- Generated media mapping SQL (apply). Run after verifying dry-run output.
-- Insert placeholder cover for 'abare' if none exists
WITH s AS (SELECT id FROM sitios WHERE slug = 'abare' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg', NULL, true, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.resource_id = s.id AND m.is_cover = true AND m.resource_type = 'sitio');

-- Insert placeholder cover for 'bigua' if none exists
WITH s AS (SELECT id FROM sitios WHERE slug = 'bigua' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg', NULL, true, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.resource_id = s.id AND m.is_cover = true AND m.resource_type = 'sitio');

-- Mapping files for slug: mergulhao (count=23)
WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988792202-20251107_163212.jpg', NULL, true, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988792202-20251107_163212.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988798001-20251107_163239.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988798001-20251107_163239.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988804234-20251107_163252.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988804234-20251107_163252.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988808343-20251107_163306.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988808343-20251107_163306.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988811097-20251107_163415.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988811097-20251107_163415.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988818468-20251107_163506.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988818468-20251107_163506.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988827710-20251107_163720.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988827710-20251107_163720.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988836535-20251107_163820.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988836535-20251107_163820.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988845235-20251107_163847.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988845235-20251107_163847.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988852528-20251107_163856.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988852528-20251107_163856.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988860014-20251107_163903.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762988860014-20251107_163903.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762993950579-20251107_163934_compressed.mp4', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/1762993950579-20251107_163934_compressed.mp4');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163212.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163212.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163239.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163239.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163252.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163252.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163306.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163306.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163415.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163415.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163506.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163506.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163720.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163720.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163820.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163820.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163847.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163847.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163856.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163856.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163903.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/mergulhao/20251107_163903.jpg');

-- Insert placeholder cover for 'seriema' if none exists
WITH s AS (SELECT id FROM sitios WHERE slug = 'seriema' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg', NULL, true, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.resource_id = s.id AND m.is_cover = true AND m.resource_type = 'sitio');

-- Mapping files for slug: juriti (count=23)
WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988625017-20251107_162023.jpg', NULL, true, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988625017-20251107_162023.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988635593-20251107_162025.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988635593-20251107_162025.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988648710-20251107_162052.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988648710-20251107_162052.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988664370-20251107_162100.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988664370-20251107_162100.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988673341-20251107_162143.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988673341-20251107_162143.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988680911-20251107_162155.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988680911-20251107_162155.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988692444-20251107_162239.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988692444-20251107_162239.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988702080-20251107_162336.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988702080-20251107_162336.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988708242-20251107_162356.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988708242-20251107_162356.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988716151-20251107_162403.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988716151-20251107_162403.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988783376-20251107_162537.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762988783376-20251107_162537.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762993930787-20251107_162422_compressed.mp4', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/1762993930787-20251107_162422_compressed.mp4');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162023.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162023.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162025.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162025.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162052.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162052.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162100.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162100.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162143.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162143.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162155.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162155.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162239.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162239.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162336.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162336.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162356.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162356.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162403.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162403.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162537.jpg', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/juriti/20251107_162537.jpg');

-- Insert placeholder cover for 'surucua' if none exists
WITH s AS (SELECT id FROM sitios WHERE slug = 'surucua' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg', NULL, true, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.resource_id = s.id AND m.is_cover = true AND m.resource_type = 'sitio');
