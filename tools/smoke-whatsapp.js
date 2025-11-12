// tools/smoke-whatsapp.js
// Use the lightweight Chromium-only package to save disk and CPU on dev machines
// Try to require from the script location first; if that fails (we may be
// invoked from a different working directory), fall back to creating a
// require function rooted at process.cwd() so local installs work (used by
// tools/playwright-smoke package).
const { createRequire } = require('module');
let chromium;
try {
  ({ chromium } = require('playwright-chromium'));
} catch (err) {
  try {
    const req = createRequire(process.cwd() + '/');
    ({ chromium } = req('playwright-chromium'));
  } catch (err2) {
    // rethrow original for clearer diagnostics
    throw err;
  }
}

(async () => {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node tools/smoke-whatsapp.js <URL>');
    process.exit(2);
  }

  const browser = await chromium.launch({ headless: true });
  page = null;
  try {
    const viewports = [
      { name: 'desktop', width: 1280, height: 800 },
      { name: 'mobile', width: 375, height: 812 }
    ];

    // If user passed a root URL (no path), also try the /projetos/carcara page which
    // is known to include a floating WhatsApp CTA in this app. This improves the
    // chance of finding anchors without extra manual navigation.
    const extraPaths = [];
    try {
      const u = new URL(url);
      if (u.pathname === '/' || u.pathname === '') extraPaths.push('/projetos/carcara');
    } catch (e) {
      // ignore — if URL parsing fails we'll just use the provided string
    }

    const results = {};

    const fs = require('fs');
    const path = require('path');
    const saveArtifacts = !!process.env.SAVE_ARTIFACTS;

    for (const vp of viewports) {
      const ctx = { viewport: vp, checks: [] };
      // create a fresh context + page per viewport to avoid cross-contamination
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent,
      });
      const page = await context.newPage();
      page.on('console', msg => console.log('PAGE:', msg.text()));

      const pathsToCheck = [url, ...extraPaths];
      for (const p of pathsToCheck) {
        // ensure we navigate to a full URL; if p is a path (starts with '/'),
        // resolve it against the provided base URL
        let target = p;
        try {
          if (typeof p === 'string' && p.startsWith('/')) {
            const base = new URL(url);
            target = base.origin + p;
          }
        } catch (e) {
          // if URL parsing fails, fall back to using p as-is
          target = p;
        }

        const entry = { path: target, waAnchors: [], floating: [] };
        try {
          await page.goto(target, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(1200);

          // scroll to trigger scroll-based CTAs
          await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
          await page.waitForTimeout(600);

          const waAnchors = await page.$$eval(
            'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="whatsapp:"]',
            els => els.map(e => ({ href: e.href, outerHTML: e.outerHTML }))
          );
          entry.waAnchors = waAnchors;

          const floatingSelectors = [
            '[data-testid="floating-whatsapp"]',
            '.floating-whatsapp',
            '.floating',
            '[aria-label*="whatsapp"]',
            '[title*="whatsapp"]'
          ];
          const floating = [];
          for (const sel of floatingSelectors) {
            const nodes = await page.$$eval(sel, els => els.map(e => e.outerHTML));
            for (const n of nodes) floating.push({ selector: sel, outerHTML: n });
          }
          entry.floating = floating;
          if (saveArtifacts) {
            try {
              const artifactsDir = path.join(process.cwd(), 'artifacts');
              if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
              const safeName = (s) => s.replace(/[^a-z0-9.-]/gi, '_').slice(0, 120);
              const base = `${vp.name}--${safeName(new URL(target).pathname || 'root')}`;
              const png = path.join(artifactsDir, `${base}.png`);
              const htmlFile = path.join(artifactsDir, `${base}.html`);
              await page.screenshot({ path: png, fullPage: true });
              const html = await page.content();
              fs.writeFileSync(htmlFile, html, 'utf8');
            } catch (e) {
              console.warn('Could not save artifacts', e.message);
            }
          }
        } catch (err) {
          entry.error = err.message;
        }

        ctx.checks.push(entry);
      }

  results[vp.name] = ctx;
  await context.close();
    }

    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('ERROR', err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();