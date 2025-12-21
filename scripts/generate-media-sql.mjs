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
    const rawFiles = entry.files || [];
    if (!rawFiles.length) {
      // placeholder cover insert (only if no cover exists)
      linesDry.push(`-- [DRY] Sitio '${slug}' has no detected files; would insert placeholder cover URL=${placeholder}`);
      linesApply.push(`-- Insert placeholder cover for '${slug}' if none exists`);
      linesApply.push(`WITH s AS (SELECT id FROM sitios WHERE slug = '${slug}' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, '${placeholder}', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.resource_id = s.id AND m.is_cover = true AND m.resource_type = 'sitio');
`);
      linesDry.push(`SELECT 'placeholder' AS action, '${slug}' AS slug, (SELECT id FROM sitios WHERE slug='${slug}') AS sitio_id, '${placeholder}' AS url;`);
      continue;
    }

    // Build a map of files by name, preferring real uploaded URLs over dryrun placeholders
    const fileMap = new Map();
    const isReal = (u) => /^https?:\/\//i.test(u);
    for (const f of rawFiles) {
      const name = f.name;
      const existing = fileMap.get(name);
      if (!existing) {
        fileMap.set(name, f);
      } else {
        // prefer a real URL over a dryrun one
        if (!isReal(existing.publicUrl) && isReal(f.publicUrl)) {
          fileMap.set(name, f);
        }
      }
    }

    const files = Array.from(fileMap.values());

    // Dry-run entries
    linesDry.push(`-- [DRY] sit '${slug}' found ${files.length} files`);
    for (const f of files) {
      const url = f.publicUrl.replace(/'/g, "''");
      linesDry.push(`SELECT '${slug}' AS slug, '${url}' AS url, (SELECT count(*) FROM media WHERE url='${url}') AS already_exists;`);
    }

    // Apply entries: insert or update each file as appropriate
    linesApply.push(`-- Mapping files for slug: ${slug} (count=${files.length})`);

    // helper to find thumbnail for a base name
    const findThumb = (base) => {
      const thumbName = `${base.replace(/\.[^/.]+$/, '')}_thumb.jpg`;
      const t = fileMap.get(thumbName);
      return t && t.publicUrl.replace(/'/g, "''");
    };

    // choose cover: prefer a real photo, otherwise placeholder
    const photos = files.filter(f => f.publicUrl.match(/\.(png|jpe?g|webp|avif)$/i));
    const videos = files.filter(f => f.publicUrl.match(/\.(mp4|webm|mov)$/i));
    let coverFile;
    if (photos.length) coverFile = photos[0];
    else if (videos.length) coverFile = null; // prefer placeholder over video for cover
    else coverFile = files[0];

    if (!coverFile && !photos.length && videos.length) {
      // insert placeholder cover when only videos exist
      linesApply.push(`WITH s AS (SELECT id FROM sitios WHERE slug = '${slug}' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, '${placeholder}', NULL, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media m WHERE m.resource_id = s.id AND m.is_cover = true AND m.resource_type = 'sitio');
`);
    } else if (coverFile) {
      const u = coverFile.publicUrl.replace(/'/g, "''");
      const thumb = findThumb(coverFile.name) || 'NULL';
      linesApply.push(`WITH s AS (SELECT id FROM sitios WHERE slug = '${slug}' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, '${u}', ${thumb === 'NULL' ? 'NULL' : `'${thumb}'`}, NULL, NULL, NULL, 'ready', NULL, NULL, 0, true, now(), now()
FROM s
WHERE s.id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM media WHERE url = '${u}');
`);
    }

    // For each file, either UPDATE an existing dryrun row to the real URL, or INSERT if new
    for (const f of files) {
      const u = f.publicUrl.replace(/'/g, "''");
      const thumb = findThumb(f.name);

      // detect if there is an original dryrun entry for the same name
      const originalDry = rawFiles.find(r => r.name === f.name && r.publicUrl.startsWith('dryrun://'));
      if (originalDry && isReal(u)) {
        const old = originalDry.publicUrl.replace(/'/g, "''");
        // update the existing media row's url to point to the real uploaded url
        linesApply.push(`-- Update dry-run entry for ${f.name} -> real URL
UPDATE media SET url='${u}' WHERE url='${old}';`);
        if (thumb) {
          linesApply.push(`UPDATE media SET thumbnail_url='${thumb}' WHERE url='${u}' OR url='${old}';`);
        }
        continue;
      }

      // If there's a thumbnail for an already-existing real URL, ensure it's set on the media row
      if (!originalDry && thumb) {
        linesApply.push(`-- Ensure thumbnail is set for ${f.name}
UPDATE media SET thumbnail_url='${thumb}' WHERE url='${u}';`);
      }

      // otherwise insert if not exists
      linesApply.push(`WITH s AS (SELECT id FROM sitios WHERE slug = '${slug}' LIMIT 1)
INSERT INTO media (id, resource_type, resource_id, placeholder_id, url, thumbnail_url, caption_en, caption_pt, caption_es, status, moderation, metadata, display_order, is_cover, created_at, updated_at)
SELECT gen_random_uuid(), 'sitio', s.id, NULL, '${u}', ${thumb ? `'${thumb}'` : 'NULL'}, NULL, NULL, NULL, 'ready', NULL, NULL, 0, false, now(), now()
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
