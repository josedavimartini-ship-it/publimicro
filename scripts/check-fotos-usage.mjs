import fs from 'fs/promises';
import { sync as globSync } from 'glob';

async function main() {
  const pattern = '**/*.{ts,tsx,js,jsx}';
  const ignore = ['**/node_modules/**', '**/.next/**', '**/.turbo/**', 'backup/**', 'tools/**'];
  const files = globSync(pattern, { ignore, nodir: true });
  const re = /\bfotos\s*\[\s*0\s*\]/g;
  const results = [];

  for (const f of files) {
    try {
      const text = await fs.readFile(f, 'utf8');
      let m;
      while ((m = re.exec(text)) !== null) {
        // compute line number
        const upto = text.slice(0, m.index);
        const line = upto.split('\n').length;
        results.push({ file: f, index: m.index, line });
      }
    } catch (e) {
      // ignore unreadable files
    }
  }

  const out = { timestamp: new Date().toISOString(), occurrences: results, count: results.length };
  await fs.writeFile('artifacts/fotos-usage.json', JSON.stringify(out, null, 2), 'utf8').catch(() => {});

  if (results.length > 0) {
    console.error(`Found ${results.length} direct fotos[0] usages (see artifacts/fotos-usage.json).`);
    for (const r of results.slice(0, 20)) console.error(`${r.file}:${r.line}`);
    process.exit(2);
  }

  console.log('No direct fotos[0] usages found.');
}

main().catch(e => { console.error('Fatal:', e.message || e); process.exit(1); });
