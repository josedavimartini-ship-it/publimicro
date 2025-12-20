import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const turboTemp = path.join(os.tmpdir(), 'turbod');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readPid(pidFile) {
  try {
    const txt = await fs.readFile(pidFile, 'utf8');
    return parseInt(txt.trim(), 10);
  } catch (err) {
    return null;
  }
}

async function isAlive(pid) {
  try {
    // process.kill with signal 0 only tests if process exists
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return false;
  }
}

async function main() {
  if (!(await exists(turboTemp))) {
    console.log(`No turbod folder: ${turboTemp}`);
    return 0;
  }

  const entries = await fs.readdir(turboTemp, { withFileTypes: true });
  for (const dirent of entries) {
    if (!dirent.isDirectory()) continue;
    const candidate = path.join(turboTemp, dirent.name);
    const pidFile = path.join(candidate, 'turbod.pid');
    if (!(await exists(pidFile))) {
      console.log(`No pid file in ${candidate} — removing`);
      await fs.rm(candidate, { recursive: true, force: true });
      continue;
    }

    const pid = await readPid(pidFile);
    if (!pid) {
      console.log(`Unreadable PID file: ${pidFile} — removing folder`);
      await fs.rm(candidate, { recursive: true, force: true });
      continue;
    }

    const alive = await isAlive(pid);
    if (!alive) {
      console.log(`No process ${pid} — removing ${candidate}`);
      await fs.rm(candidate, { recursive: true, force: true });
      continue;
    }

    console.log(`Process ${pid} alive — keeping ${candidate}`);
  }

  return 0;
}

main().then((code) => process.exit(code)).catch((err) => {
  console.error('clean-turbod failed:', err);
  process.exit(0);
});
