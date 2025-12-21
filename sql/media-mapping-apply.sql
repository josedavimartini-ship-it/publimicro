-- Generated media mapping SQL (apply). Run after verifying dry-run output.
-- Insert placeholder cover for 'mergulhao' if none exists
WITH s AS (SELECT id FROM sitios WHERE slug = 'mergulhao' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.resource_id = s.id AND m.is_cover = true AND m.resource_type = 'sitio');

-- Mapping files for slug: seriema (count=5)
WITH s AS (SELECT id FROM sitios WHERE slug = 'seriema' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/seriema/20251107_163156_compressed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/seriema/20251107_163156_compressed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'seriema' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/seriema/videos/seriemavideo1.mp4', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/seriema/videos/seriemavideo1.mp4');

-- Update dry-run entry for 20251107_163156_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/seriema/20251107_163156_compressed.jpg' WHERE url='dryrun://seriema/20251107_163156_compressed.jpg';
-- Update dry-run entry for 20251107_163156_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/seriema/20251107_163156_thumb.jpg' WHERE url='dryrun://seriema/20251107_163156_thumb.jpg';
-- Update dry-run entry for 20251113_170023_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/seriema/20251113_170023_compressed.jpg' WHERE url='dryrun://seriema/20251113_170023_compressed.jpg';
-- Update dry-run entry for 20251113_170023_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/seriema/20251113_170023_thumb.jpg' WHERE url='dryrun://seriema/20251113_170023_thumb.jpg';
-- Insert placeholder cover for 'juriti' if none exists
WITH s AS (SELECT id FROM sitios WHERE slug = 'juriti' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.resource_id = s.id AND m.is_cover = true AND m.resource_type = 'sitio');

-- Mapping files for slug: surucua (count=35)
WITH s AS (SELECT id FROM sitios WHERE slug = 'surucua' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/surucua.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/surucua.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'surucua' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/surucua.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/surucua.jpg');

-- Update dry-run entry for 20251113_163620_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_163620_compressed.jpg' WHERE url='dryrun://surucua/20251113_163620_compressed.jpg';
-- Update dry-run entry for 20251113_163620_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_163620_thumb.jpg' WHERE url='dryrun://surucua/20251113_163620_thumb.jpg';
-- Update dry-run entry for 20251113_164106_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164106_compressed.jpg' WHERE url='dryrun://surucua/20251113_164106_compressed.jpg';
-- Update dry-run entry for 20251113_164106_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164106_thumb.jpg' WHERE url='dryrun://surucua/20251113_164106_thumb.jpg';
-- Update dry-run entry for 20251113_164247_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164247_compressed.jpg' WHERE url='dryrun://surucua/20251113_164247_compressed.jpg';
-- Update dry-run entry for 20251113_164247_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164247_thumb.jpg' WHERE url='dryrun://surucua/20251113_164247_thumb.jpg';
-- Update dry-run entry for 20251113_164335_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164335_compressed.jpg' WHERE url='dryrun://surucua/20251113_164335_compressed.jpg';
-- Update dry-run entry for 20251113_164335_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164335_thumb.jpg' WHERE url='dryrun://surucua/20251113_164335_thumb.jpg';
-- Update dry-run entry for 20251113_164402_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164402_compressed.jpg' WHERE url='dryrun://surucua/20251113_164402_compressed.jpg';
-- Update dry-run entry for 20251113_164402_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164402_thumb.jpg' WHERE url='dryrun://surucua/20251113_164402_thumb.jpg';
-- Update dry-run entry for 20251113_164414_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164414_compressed.jpg' WHERE url='dryrun://surucua/20251113_164414_compressed.jpg';
-- Update dry-run entry for 20251113_164414_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164414_thumb.jpg' WHERE url='dryrun://surucua/20251113_164414_thumb.jpg';
-- Update dry-run entry for 20251113_164601_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164601_compressed.jpg' WHERE url='dryrun://surucua/20251113_164601_compressed.jpg';
-- Update dry-run entry for 20251113_164601_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164601_thumb.jpg' WHERE url='dryrun://surucua/20251113_164601_thumb.jpg';
-- Update dry-run entry for 20251113_164609_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164609_compressed.jpg' WHERE url='dryrun://surucua/20251113_164609_compressed.jpg';
-- Update dry-run entry for 20251113_164609_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164609_thumb.jpg' WHERE url='dryrun://surucua/20251113_164609_thumb.jpg';
-- Update dry-run entry for 20251113_164743_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164743_compressed.jpg' WHERE url='dryrun://surucua/20251113_164743_compressed.jpg';
-- Update dry-run entry for 20251113_164743_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164743_thumb.jpg' WHERE url='dryrun://surucua/20251113_164743_thumb.jpg';
-- Update dry-run entry for 20251113_164750_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164750_compressed.jpg' WHERE url='dryrun://surucua/20251113_164750_compressed.jpg';
-- Update dry-run entry for 20251113_164750_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164750_thumb.jpg' WHERE url='dryrun://surucua/20251113_164750_thumb.jpg';
-- Update dry-run entry for 20251113_164810_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164810_compressed.jpg' WHERE url='dryrun://surucua/20251113_164810_compressed.jpg';
-- Update dry-run entry for 20251113_164810_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164810_thumb.jpg' WHERE url='dryrun://surucua/20251113_164810_thumb.jpg';
-- Update dry-run entry for 20251113_164924_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164924_compressed.jpg' WHERE url='dryrun://surucua/20251113_164924_compressed.jpg';
-- Update dry-run entry for 20251113_164924_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164924_thumb.jpg' WHERE url='dryrun://surucua/20251113_164924_thumb.jpg';
-- Update dry-run entry for 20251113_170032_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_170032_compressed.jpg' WHERE url='dryrun://surucua/20251113_170032_compressed.jpg';
-- Update dry-run entry for 20251113_170032_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_170032_thumb.jpg' WHERE url='dryrun://surucua/20251113_170032_thumb.jpg';
-- Update dry-run entry for 20251113_164818_compressed.mp4 -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_164818_compressed.mp4' WHERE url='dryrun://surucua/20251113_164818_compressed.mp4';
-- Update dry-run entry for 20251113_164818_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_164818_thumb.jpg' WHERE url='dryrun://surucua/20251113_164818_thumb.jpg';
-- Update dry-run entry for 20251113_165014_compressed.mp4 -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_165014_compressed.mp4' WHERE url='dryrun://surucua/20251113_165014_compressed.mp4';
-- Update dry-run entry for 20251113_165014_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_165014_thumb.jpg' WHERE url='dryrun://surucua/20251113_165014_thumb.jpg';
-- Update dry-run entry for 20251113_165126_compressed.mp4 -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_165126_compressed.mp4' WHERE url='dryrun://surucua/20251113_165126_compressed.mp4';
-- Update dry-run entry for 20251113_165126_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_165126_thumb.jpg' WHERE url='dryrun://surucua/20251113_165126_thumb.jpg';
-- Update dry-run entry for 20251113_165330_compressed.mp4 -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/surucua/20251113_165330_compressed.mp4' WHERE url='dryrun://surucua/20251113_165330_compressed.mp4';
-- Update dry-run entry for 20251113_165330_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/surucua/20251113_165330_thumb.jpg' WHERE url='dryrun://surucua/20251113_165330_thumb.jpg';
-- Mapping files for slug: abare (count=28)
WITH s AS (SELECT id FROM sitios WHERE slug = 'abare' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_161829_compressed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_161829_compressed.jpg');

-- Update dry-run entry for 20251113_161829_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_161829_compressed.jpg' WHERE url='dryrun://abare/20251113_161829_compressed.jpg';
-- Update dry-run entry for 20251113_161829_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_161829_thumb.jpg' WHERE url='dryrun://abare/20251113_161829_thumb.jpg';
-- Update dry-run entry for 20251113_161836_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_161836_compressed.jpg' WHERE url='dryrun://abare/20251113_161836_compressed.jpg';
-- Update dry-run entry for 20251113_161836_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_161836_thumb.jpg' WHERE url='dryrun://abare/20251113_161836_thumb.jpg';
-- Update dry-run entry for 20251113_161841_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_161841_compressed.jpg' WHERE url='dryrun://abare/20251113_161841_compressed.jpg';
-- Update dry-run entry for 20251113_161841_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_161841_thumb.jpg' WHERE url='dryrun://abare/20251113_161841_thumb.jpg';
-- Update dry-run entry for 20251113_162420_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_162420_compressed.jpg' WHERE url='dryrun://abare/20251113_162420_compressed.jpg';
-- Update dry-run entry for 20251113_162420_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_162420_thumb.jpg' WHERE url='dryrun://abare/20251113_162420_thumb.jpg';
-- Update dry-run entry for 20251113_162521_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_162521_compressed.jpg' WHERE url='dryrun://abare/20251113_162521_compressed.jpg';
-- Update dry-run entry for 20251113_162521_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_162521_thumb.jpg' WHERE url='dryrun://abare/20251113_162521_thumb.jpg';
-- Update dry-run entry for 20251113_162529_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_162529_compressed.jpg' WHERE url='dryrun://abare/20251113_162529_compressed.jpg';
-- Update dry-run entry for 20251113_162529_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_162529_thumb.jpg' WHERE url='dryrun://abare/20251113_162529_thumb.jpg';
-- Update dry-run entry for 20251113_162707_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_162707_compressed.jpg' WHERE url='dryrun://abare/20251113_162707_compressed.jpg';
-- Update dry-run entry for 20251113_162707_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_162707_thumb.jpg' WHERE url='dryrun://abare/20251113_162707_thumb.jpg';
-- Update dry-run entry for 20251113_162724_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_162724_compressed.jpg' WHERE url='dryrun://abare/20251113_162724_compressed.jpg';
-- Update dry-run entry for 20251113_162724_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_162724_thumb.jpg' WHERE url='dryrun://abare/20251113_162724_thumb.jpg';
-- Update dry-run entry for 20251113_162844_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_162844_compressed.jpg' WHERE url='dryrun://abare/20251113_162844_compressed.jpg';
-- Update dry-run entry for 20251113_162844_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_162844_thumb.jpg' WHERE url='dryrun://abare/20251113_162844_thumb.jpg';
-- Update dry-run entry for 20251113_163020_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_163020_compressed.jpg' WHERE url='dryrun://abare/20251113_163020_compressed.jpg';
-- Update dry-run entry for 20251113_163020_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_163020_thumb.jpg' WHERE url='dryrun://abare/20251113_163020_thumb.jpg';
-- Update dry-run entry for 20251113_163038_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_163038_compressed.jpg' WHERE url='dryrun://abare/20251113_163038_compressed.jpg';
-- Update dry-run entry for 20251113_163038_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_163038_thumb.jpg' WHERE url='dryrun://abare/20251113_163038_thumb.jpg';
-- Update dry-run entry for 20251113_163801_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abare/20251113_163801_compressed.jpg' WHERE url='dryrun://abare/20251113_163801_compressed.jpg';
-- Update dry-run entry for 20251113_163801_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abare/20251113_163801_thumb.jpg' WHERE url='dryrun://abare/20251113_163801_thumb.jpg';
WITH s AS (SELECT id FROM sitios WHERE slug = 'abare' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'dryrun://abare/20251113_162434_compressed.mp4', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'dryrun://abare/20251113_162434_compressed.mp4');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abare' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'dryrun://abare/20251113_162434_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'dryrun://abare/20251113_162434_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abare' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'dryrun://abare/20251113_162729_compressed.mp4', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'dryrun://abare/20251113_162729_compressed.mp4');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abare' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'dryrun://abare/20251113_162729_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'dryrun://abare/20251113_162729_thumb.jpg');

-- Mapping files for slug: bigua (count=28)
WITH s AS (SELECT id FROM sitios WHERE slug = 'bigua' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_155928_compressed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_155928_compressed.jpg');

-- Update dry-run entry for 20251113_155928_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_155928_compressed.jpg' WHERE url='dryrun://bigua/20251113_155928_compressed.jpg';
-- Update dry-run entry for 20251113_155928_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_155928_thumb.jpg' WHERE url='dryrun://bigua/20251113_155928_thumb.jpg';
-- Update dry-run entry for 20251113_160350_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_160350_compressed.jpg' WHERE url='dryrun://bigua/20251113_160350_compressed.jpg';
-- Update dry-run entry for 20251113_160350_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_160350_thumb.jpg' WHERE url='dryrun://bigua/20251113_160350_thumb.jpg';
-- Update dry-run entry for 20251113_160356_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_160356_compressed.jpg' WHERE url='dryrun://bigua/20251113_160356_compressed.jpg';
-- Update dry-run entry for 20251113_160356_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_160356_thumb.jpg' WHERE url='dryrun://bigua/20251113_160356_thumb.jpg';
-- Update dry-run entry for 20251113_160616_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_160616_compressed.jpg' WHERE url='dryrun://bigua/20251113_160616_compressed.jpg';
-- Update dry-run entry for 20251113_160616_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_160616_thumb.jpg' WHERE url='dryrun://bigua/20251113_160616_thumb.jpg';
-- Update dry-run entry for 20251113_160647_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_160647_compressed.jpg' WHERE url='dryrun://bigua/20251113_160647_compressed.jpg';
-- Update dry-run entry for 20251113_160647_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_160647_thumb.jpg' WHERE url='dryrun://bigua/20251113_160647_thumb.jpg';
-- Update dry-run entry for 20251113_160833_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_160833_compressed.jpg' WHERE url='dryrun://bigua/20251113_160833_compressed.jpg';
-- Update dry-run entry for 20251113_160833_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_160833_thumb.jpg' WHERE url='dryrun://bigua/20251113_160833_thumb.jpg';
-- Update dry-run entry for 20251113_161036_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_161036_compressed.jpg' WHERE url='dryrun://bigua/20251113_161036_compressed.jpg';
-- Update dry-run entry for 20251113_161036_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_161036_thumb.jpg' WHERE url='dryrun://bigua/20251113_161036_thumb.jpg';
-- Update dry-run entry for 20251113_161200_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_161200_compressed.jpg' WHERE url='dryrun://bigua/20251113_161200_compressed.jpg';
-- Update dry-run entry for 20251113_161200_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_161200_thumb.jpg' WHERE url='dryrun://bigua/20251113_161200_thumb.jpg';
-- Update dry-run entry for 20251113_161216_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_161216_compressed.jpg' WHERE url='dryrun://bigua/20251113_161216_compressed.jpg';
-- Update dry-run entry for 20251113_161216_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_161216_thumb.jpg' WHERE url='dryrun://bigua/20251113_161216_thumb.jpg';
-- Update dry-run entry for 20251113_161239_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_161239_compressed.jpg' WHERE url='dryrun://bigua/20251113_161239_compressed.jpg';
-- Update dry-run entry for 20251113_161239_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_161239_thumb.jpg' WHERE url='dryrun://bigua/20251113_161239_thumb.jpg';
-- Update dry-run entry for 20251113_161300_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_161300_compressed.jpg' WHERE url='dryrun://bigua/20251113_161300_compressed.jpg';
-- Update dry-run entry for 20251113_161300_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_161300_thumb.jpg' WHERE url='dryrun://bigua/20251113_161300_thumb.jpg';
-- Update dry-run entry for 20251113_161320_compressed.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_161320_compressed.jpg' WHERE url='dryrun://bigua/20251113_161320_compressed.jpg';
-- Update dry-run entry for 20251113_161320_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_161320_thumb.jpg' WHERE url='dryrun://bigua/20251113_161320_thumb.jpg';
-- Update dry-run entry for 20251113_160845_compressed.mp4 -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_160845_compressed.mp4' WHERE url='dryrun://bigua/20251113_160845_compressed.mp4';
-- Update dry-run entry for 20251113_160845_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_160845_thumb.jpg' WHERE url='dryrun://bigua/20251113_160845_thumb.jpg';
-- Update dry-run entry for 20251113_161429_compressed.mp4 -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/bigua/20251113_161429_compressed.mp4' WHERE url='dryrun://bigua/20251113_161429_compressed.mp4';
-- Update dry-run entry for 20251113_161429_thumb.jpg -> real URL
UPDATE media SET url='https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/bigua/20251113_161429_thumb.jpg' WHERE url='dryrun://bigua/20251113_161429_thumb.jpg';
-- Mapping files for slug: abarephotos (count=24)
WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_161829_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_161829_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_161829_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_161829_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_161829_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_161829_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_161836_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_161836_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_161836_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_161836_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_161841_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_161841_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_161841_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_161841_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162420_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162420_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162420_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162420_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162521_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162521_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162521_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162521_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162529_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162529_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162529_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162529_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162707_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162707_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162707_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162707_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162724_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162724_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162724_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162724_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162844_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_162844_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162844_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_162844_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_163020_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_163020_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_163020_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_163020_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_163038_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_163038_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_163038_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_163038_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_163801_processed.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarephotos/abarephotos_20251113_163801_processed.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarephotos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_163801_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarephotos/abarephotos_20251113_163801_thumb.jpg');

-- Mapping files for slug: abarevideos (count=4)
WITH s AS (SELECT id FROM sitios WHERE slug = 'abarevideos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarevideos/abarevideos_20251113_162434_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarevideos/abarevideos_20251113_162434_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarevideos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarevideos/abarevideos_20251113_162434_processed.mp4', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarevideos/abarevideos_20251113_162434_processed.mp4');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarevideos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarevideos/abarevideos_20251113_162434_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarevideos/abarevideos_20251113_162434_thumb.jpg');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarevideos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarevideos/abarevideos_20251113_162729_processed.mp4', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-processed/abarevideos/abarevideos_20251113_162729_processed.mp4');

WITH s AS (SELECT id FROM sitios WHERE slug = 'abarevideos' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarevideos/abarevideos_20251113_162729_thumb.jpg', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios-thumbs/abarevideos/abarevideos_20251113_162729_thumb.jpg');
