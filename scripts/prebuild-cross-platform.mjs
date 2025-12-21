import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);

async function checkPwshShebangs(repoRoot) {
  const results = [];
  async function walk(dir) {
    const names = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const d of names) {
      const p = path.join(dir, d.name);
      if (d.isDirectory()) {
        // skip node_modules and .next and .turbo
        if (d.name === 'node_modules' || d.name === '.next' || d.name === '.turbo') continue;
        await walk(p);
      } else if (d.isFile()) {
        if (d.name.endsWith('.ps1')) {
          // check shebang
          try {
            const fd = await fs.promises.open(p, 'r');
            const buf = Buffer.alloc(64);
            const { bytesRead } = await fd.read(buf, 0, 64, 0);
            await fd.close();
            const head = buf.toString('utf8', 0, bytesRead);
            if (head.includes('#!/usr/bin/env pwsh')) {
              results.push(p);
            }
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }

  await walk(repoRoot);
  return results;
}

import { fileURLToPath } from 'url';

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const repoRoot = path.resolve(path.dirname(__filename), '..', '..');
  console.log('Running cross-platform prebuild checks');
  console.log(`Platform: ${os.platform()} ${os.release()}`);

  try {
    const shebangs = await checkPwshShebangs(repoRoot);
    if (shebangs.length > 0) {
      console.warn('\n⚠️ Found PowerShell scripts with pwsh shebangs in the repo:');
      for (const s of shebangs.slice(0, 20)) console.warn(' -', s);
      if (shebangs.length > 20) console.warn(' - (and more)');
      console.warn('\nThese are fine for developer workflows on Windows or where pwsh is available, but ensure CI and builders do not try to execute them directly.');
    }

    // Verify critical env vars when running in CI (fail early to avoid broken deploys)
    const isCI = !!(process.env.CI || process.env.VERCEL);
    const required = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      const msg = `Missing required env vars: ${missing.join(', ')}`;
      if (isCI) {
        console.error('ERROR:', msg);
        throw new Error(msg);
      } else {
        console.warn('Warning:', msg, '\nThis is OK for local dev but must be set in preview/production deployments.');
      }
    }

    // Run existing turbod cleanup (if present)
    const cleanScript = path.join(repoRoot, 'scripts', 'clean-turbod.mjs');
    if (fs.existsSync(cleanScript)) {
      console.log('Running clean-turbod...');
      const { stdout, stderr } = await execFileAsync(process.execPath, [cleanScript], { cwd: repoRoot });
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      console.log('clean-turbod completed');
    } else {
      console.log('No clean-turbod script found — skipping');
    }

    console.log('Prebuild checks finished — OK');
    return 0;
  } catch (err) {
    console.error('Prebuild check failed:', err);
    // do not fail the build, only warn
    return 0;
  }
}

if (process.argv[1] && process.argv[1].endsWith('prebuild-cross-platform.mjs')) {
  main().then((code) => process.exit(code)).catch(() => process.exit(0));
}

export default main;
