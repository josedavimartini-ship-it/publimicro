#!/usr/bin/env node
import fs from 'fs/promises';
import process from 'process';

// Usage:
// node scripts/generate-media-sql.mjs --in artifacts/storage-files.json --out-sql sql/media-mapping-apply.sql --out-dry sql/media-mapping-dryrun.sql --placeholder-url '<url>'

async function main() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--in') params.in = args[++i];
    if (args[i] === '--out-sql') params.out = args[++i];
    if (args[i] === '--out-dry') params.outDry = args[++i];
    if (args[i] === '--placeholder-url') params.placeholder = args[++i];
  }
  const infile = params.in || 'artifacts/storage-files.json';
  const out = params.out || 'sql/media-mapping-apply.sql';
  const outDry = params.outDry || 'sql/media-mapping-dryrun.sql';
  const placeholder = params.placeholder || 'https://irrzpwzyqcubhhjeuakc.supabase.co/storage/v1/object/public/imagens-sitios/pordosol4mediumearthwide.jpg';

  const raw = await fs.readFile(infile, 'utf8');
  const data = JSON.parse(raw);
  const slugs = Object.keys((data.by_slug) || {});

  const linesApply = [];
  const linesDry = [];

  linesApply.push('-- Generated media mapping SQL (apply). Run after verifying dry-run output.');
  linesDry.push('-- Generated media mapping dry-run (preview). Shows what would be inserted.');

  for (const slug of slugs) {
    const entry = data.by_slug[slug] || { files: [] };
    const files = entry.files || [];
    if (!files.length) {
      // placeholder cover insert (only if no cover exists)
      linesDry.push(`-- [DRY] Sitio '${slug}' has no detected files; would insert placeholder cover URL=${placeholder}`);
      linesApply.push(`-- Insert placeholder cover for '${slug}' if none exists`);
      linesApply.push(`WITH s AS (SELECT id FROM sitios WHERE slug = '${slug}' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, '${placeholder}', NULL, true, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.resource_id = s.id AND m.is_cover = true AND m.resource_type = 'sitio');
`);
      linesDry.push(`SELECT 'placeholder' AS action, '${slug}' AS slug, (SELECT id FROM sitios WHERE slug='${slug}') AS sitio_id, '${placeholder}' AS url;`);
      continue;
    }

    // For each file, generate dry-run select and apply insert
    // Choose first image as cover
    const photos = files.filter(f => f.publicUrl.match(/\.(png|jpe?g|webp|avif)$/i));
    const videos = files.filter(f => f.publicUrl.match(/\.(mp4|webm|mov)$/i));

    // pick cover url
    const coverUrl = (photos.length ? photos[0].publicUrl : (files[0] && files[0].publicUrl));

    // Dry-run entries
    linesDry.push(`-- [DRY] sit ' ${slug}' found ${files.length} files`);
    for (const f of files) {
      const url = f.publicUrl.replace(/'/g, "''");
      linesDry.push(`SELECT '${slug}' AS slug, '${url}' AS url, (SELECT count(*) FROM media WHERE url='${url}') AS already_exists;`);
    }

    // Apply entries: insert each file if not exists
    linesApply.push(`-- Mapping files for slug: ${slug} (count=${files.length})`);
    // insert cover first as is_cover true
    if (coverUrl) {
      const u = coverUrl.replace(/'/g, "''");
      linesApply.push(`WITH s AS (SELECT id FROM sitios WHERE slug = '${slug}' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, '${u}', NULL, true, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = '${u}');
`);
    }

    // insert other photos/videos (is_cover false)
    for (const f of files) {
      const u = f.publicUrl.replace(/'/g, "''");
      // skip cover one (already added)
      if (u === (coverUrl || '').replace(/'/g, "''")) continue;
      linesApply.push(`WITH s AS (SELECT id FROM sitios WHERE slug = '${slug}' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, url, thumbnail_url, is_cover, status, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, '${u}', NULL, false, 'public', now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = '${u}');
`);
    }
  }

  await fs.mkdir('sql', { recursive: true }).catch(()=>{});
  await fs.writeFile(outDry, linesDry.join('\n'), 'utf8');
  await fs.writeFile(out, linesApply.join('\n'), 'utf8');

  console.log('Wrote dry-run SQL to', outDry);
  console.log('Wrote apply SQL to', out);
}

main().catch(e=>{ console.error(e); process.exit(1); });
