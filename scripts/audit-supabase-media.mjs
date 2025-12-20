import process from 'process';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

async function main() {
  const args = process.argv.slice(2);
  let outPath = null;
  let failOnFindings = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out') outPath = args[++i];
    if (args[i] === '--fail-on-findings') failOnFindings = true;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not set in env. Set it and re-run.');
    process.exitCode = 2;
    return;
  }

  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found. The script will only display caution and NOT run service-role queries.');
  }

  const supabase = createClient(url, serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const summary = {
    timestamp: new Date().toISOString(),
    sitios_no_photos: { count: 0, sample: [] },
    sitios_empty_photos: { count: 0, sample: [] },
    listings_missing_cover: { count: 0, sample: [] },
    media_placeholders: { count: 0, sample: [] }
  };

  // 1) Sitios with no photos
  console.log('\n== Sitios with no fotos ==');
  try {
    const { data: noPhotos, error: e1 } = await supabase
      .from('sitios')
      .select('id, nome')
      .filter('fotos', 'is', null)
      .limit(100);

    if (e1) throw e1;
    summary.sitios_no_photos.count = noPhotos?.length || 0;
    summary.sitios_no_photos.sample = (noPhotos || []).slice(0, 100);
    console.log(`Found ${summary.sitios_no_photos.count} sitios with fotos IS NULL (showing up to 100):`);
    console.log(summary.sitios_no_photos.sample || []);
  } catch (err) {
    console.error('Error fetching sitios with no fotos:', err.message || err);
  }

  // 2) Sitios with empty fotos array
  console.log('\n== Sitios with empty fotos array ==');
  try {
    const { data: rows, error } = await supabase
      .from('sitios')
      .select('id, nome, fotos')
      .limit(500);
    if (error) throw error;
    const empties = (rows || []).filter(r => !r.fotos || (Array.isArray(r.fotos) && r.fotos.length === 0));
    summary.sitios_empty_photos.count = empties.length;
    summary.sitios_empty_photos.sample = empties.slice(0, 200).map(r => ({ id: r.id, nome: r.nome }));
    console.log(`Found ${summary.sitios_empty_photos.count} sitios with empty fotos (showing up to 200):`);
    console.log(summary.sitios_empty_photos.sample);
  } catch (err) {
    console.error('Error fetching sitios with empty fotos:', err.message || err);
  }

  // 3) Listings missing a cover row in listing_photos
  console.log('\n== Listings missing cover photo (listing_photos.is_cover) ==');
  try {
    let missingCover = null;
    try {
      const resp = await supabase.rpc('get_listings_missing_cover');
      missingCover = resp?.data ?? null;
    } catch (e) {
      console.warn('RPC get_listings_missing_cover failed or not present:', e.message || e);
      missingCover = null;
    }

    if (missingCover && missingCover.length) {
      summary.listings_missing_cover.count = missingCover.length;
      summary.listings_missing_cover.sample = missingCover.slice(0, 200);
      console.log('Listings missing cover (via RPC):', summary.listings_missing_cover.sample);
    } else {
      // Best-effort ad-hoc: find listings without is_cover true
      // Try several column names for compatibility across schemas
      let ls = null;
      let triedFields = null;
      try {
        const res = await supabase.from('listings').select('id, nome').limit(200);
        if (!res.error) { ls = res.data; triedFields = 'nome'; }
        else throw res.error;
      } catch (e) {
        try {
          const res2 = await supabase.from('listings').select('id, title').limit(200);
          if (!res2.error) { ls = res2.data; triedFields = 'title'; }
          else throw res2.error;
        } catch (e2) {
          const res3 = await supabase.from('listings').select('id').limit(200);
          if (!res3.error) { ls = res3.data; triedFields = 'id-only'; }
          else throw e2;
        }
      }

      const missing = [];
      for (const l of ls || []) {
        const { data: p } = await supabase.from('listing_photos').select('id').eq('listing_id', l.id).eq('is_cover', true).limit(1);
        if (!p || p.length === 0) {
          const sampleName = (triedFields === 'nome' && l.nome) ? l.nome : (triedFields === 'title' && l.title) ? l.title : undefined;
          missing.push({ id: l.id, nome: sampleName });
        }
      }
      summary.listings_missing_cover.count = missing.length;
      summary.listings_missing_cover.sample = missing.slice(0, 200);
      console.log(`Checked ${ls?.length || 0} listings (fields tried: ${triedFields}); found ${missing.length} without a cover (showing up to 200):`);
      console.log(summary.listings_missing_cover.sample);
    }
  } catch (err) {
    console.error('Error checking listings missing cover:', err.message || err);
  }

  // 4) Media placeholders not processed in `media` table
  console.log('\n== Media placeholders not processed ==');
  try {
    const { data: placeholders, error: e4 } = await supabase
      .from('media')
      .select('id, resource_type, resource_id, placeholder_id, status, url')
      .in('status', ['processing', 'uploaded'])
      .limit(200);
    if (e4) throw e4;
    summary.media_placeholders.count = placeholders?.length || 0;
    summary.media_placeholders.sample = (placeholders || []).slice(0, 200);
    console.log(`Found ${summary.media_placeholders.count} media rows with status processing/uploaded (showing up to 200):`);
    console.log(summary.media_placeholders.sample || []);
  } catch (err) {
    console.error('Error fetching media placeholders:', err.message || err);
  }

  // Write summary JSON if requested
  if (outPath) {
    try {
      await import('fs/promises').then(fs => fs.writeFile(outPath, JSON.stringify(summary, null, 2), 'utf8'));
      console.log('Wrote summary to', outPath);
    } catch (e) {
      console.error('Failed to write summary file:', e.message || e);
    }
  }

  console.log('\nAudit script finished.');

  const totalFindings = summary.sitios_no_photos.count + summary.sitios_empty_photos.count + summary.listings_missing_cover.count + summary.media_placeholders.count;
  if (failOnFindings && totalFindings > 0) {
    console.error('Fatal: findings detected:', totalFindings);
    process.exitCode = 3;
  }
}

// Run when executed directly
main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
