// ESM-compatible logger wrapper
// Mirrors the functionality of scripts/logger.cjs but exports ESM named functions
const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const envLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
let currentLevel = levels[envLevel] ?? levels.info;
const silent = process.env.LOG_SILENT === '1' || process.env.LOG_SILENT === 'true';

function formatArgs(args) {
  return args
    .map(a => {
      if (typeof a === 'string') return a;
      try {
        return JSON.stringify(a);
      } catch (_) {
        return String(a);
      }
    })
    .join(' ');
}

function write(levelName, fn, ...args) {
  if (silent) return;
  if (levels[levelName] <= currentLevel) {
    fn(`[${levelName.toUpperCase()}] ${formatArgs(args)}`);
  }
}

export function setLevel(name) {
  if (levels[name] !== undefined) currentLevel = levels[name];
}

export function info(...args) { write('info', console.log, ...args); }
export function warn(...args) { write('warn', console.warn, ...args); }
export function error(...args) { write('error', console.error, ...args); }
export function debug(...args) { write('debug', console.debug || console.log, ...args); }
