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

    // Try to require Firefox (fall back if Chromium is unstable on the host)
    let firefox = null;
    try {
      ({ firefox } = require('playwright-firefox'));
    } catch (err) {
      try {
        const req = createRequire(process.cwd() + '/');
        ({ firefox } = req('playwright-firefox'));
      } catch (err2) {
        firefox = null;
      }
    }

    // Launch a browser with retries; prefer Chromium but fall back to Firefox on repeated failures
    let browserName = 'chromium';
    async function launchBrowserWithRetry(retries = 3, delayMs = 1000) {
      const baseArgs = [
        '--disable-gpu',
        '--disable-gpu-compositing',
        '--disable-accelerated-2d-canvas',
        '--disable-software-rasterizer',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--no-zygote',
        '--disable-setuid-sandbox',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-background-networking',
        '--no-first-run',
        '--no-default-browser-check'
      ];

      // Try Chromium first
      for (let i = 0; i < retries; i++) {
        try {
          return await chromium.launch({ headless: true, args: baseArgs });
        } catch (err) {
          console.warn(`Chromium launch failed (attempt ${i + 1}/${retries}): ${err.message}`);
          if (i < retries - 1) await new Promise(r => setTimeout(r, delayMs));
        }
      }

      // If Chromium failed, try Firefox if available
      if (firefox) {
        for (let i = 0; i < retries; i++) {
          try {
            browserName = 'firefox';
            return await firefox.launch({ headless: true });
          } catch (err) {
            console.warn(`Firefox launch failed (attempt ${i + 1}/${retries}): ${err.message}`);
            if (i < retries - 1) await new Promise(r => setTimeout(r, delayMs));
          }
        }
      }

      // final attempt: try Chromium without extra args
      return await chromium.launch({ headless: true });
    }
    let browser = await launchBrowserWithRetry();
    console.log(`Launched browser: ${browserName}`);
  page = null;
  try {
    const viewports = [
      { name: 'desktop', width: 1280, height: 800 },
      { name: 'mobile', width: 375, height: 812 }
    ];

    // If user passed a root URL (no path), also try common pages that are likely
    // to contain the WhatsApp CTA or important UI (imoveis, entrar, conta, carcará)
    // This improves the chance of finding anchors without extra manual navigation.
    const extraPaths = [];
    try {
      const u = new URL(url);
      if (u.pathname === '/' || u.pathname === '') {
        extraPaths.push('/projetos/carcara');
        // Additional pages to smoke by default
        extraPaths.push('/imoveis');
        extraPaths.push('/entrar');
        extraPaths.push('/conta');
      }
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
      let context, page;
      // If a Vercel protection bypass token is provided via env var, use it
      const bypassToken = process.env.VERCEL_PROTECTION_BYPASS;
      let extraHeaders = {};
      if (bypassToken) {
        // Do not print the raw token; log a masked indicator instead
        const masked = `${bypassToken.slice(0, 4)}...${bypassToken.slice(-4)}`;
        console.log(`Using Vercel protection bypass header (masked=${masked})`);
        extraHeaders['x-vercel-protection-bypass'] = bypassToken;
      }

      // Attempt to create context/page and recover by relaunching browser if needed
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          // If the browser object is no longer connected, relaunch it
          if (typeof browser.isConnected === 'function' && !browser.isConnected()) {
            console.warn('Browser disconnected; relaunching...');
            try { await browser.close(); } catch (e) {}
            browser = await launchBrowserWithRetry();
          }

          context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            userAgent,
            extraHTTPHeaders: extraHeaders,
          });
          page = await context.newPage();
          page.on('console', msg => console.log('PAGE:', msg.text()));
          break; // success
        } catch (err) {
          console.warn(`Failed to create context/page (attempt ${attempt + 1}/3): ${err.message}`);
          try { if (context) await context.close(); } catch (e) {}
          try { await browser.close(); } catch (e) {}
          if (attempt === 2) throw err;
          browser = await launchBrowserWithRetry();
          await new Promise(r => setTimeout(r, 800));
        }
      }

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
              // Try to navigate and capture the response status. If networkidle times out
              // fall back to domcontentloaded and still capture the final response.
              let navResponse = null;
              try {
                navResponse = await page.goto(target, { waitUntil: 'networkidle', timeout: 30000 });
              } catch (navErr) {
                // networkidle can hang in dev mode (HMR / ServiceWorker / streaming); fallback
                if (/Timeout/.test(navErr.message)) {
                  console.warn('networkidle timeout, retrying with domcontentloaded for', target);
                  navResponse = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 45000 });
                } else throw navErr;
              }

              // Save response status when available so we can detect 404/500 pages
              entry.status = navResponse ? navResponse.status() : null;

              await page.waitForTimeout(1200);
            // scroll to trigger scroll-based CTAs
            await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
            await page.waitForTimeout(600);

            // Record whether the page includes the main content container (quick health check)
            try {
              entry.mainContentExists = await page.$eval('#main-content', () => true);
            } catch (e) {
              entry.mainContentExists = false;
            }

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
              const base = `${vp.name}--${browserName}--${safeName(new URL(target).pathname || 'root')}`;
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
    try {
      if (browser) await browser.close();
    } catch (e) {
      console.warn('Error closing browser:', e.message);
    }
  }
})();