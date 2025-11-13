"use strict";

// Compress videos in uploads/{slug} using ffmpeg (must be installed locally).
// Usage (PowerShell):
//  node .\scripts\compress_videos.js --slugs=juriti,mergulhao
//  node .\scripts\compress_videos.js --all
// Produces compressed files under uploads/{slug}/compressed/*.mp4

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkFFmpeg() {
  const res = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (res.error || res.status !== 0) {
    console.error('ffmpeg not found in PATH. Install ffmpeg and retry.');
    process.exit(1);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { slugs: [] };
  for (const a of args) {
    if (a.startsWith('--slugs=')) opts.slugs = a.split('=')[1].split(',').map(s => s.trim()).filter(Boolean);
    if (a === '--all') opts.slugs = ['abare','bigua','mergulhao','seriema','juriti','surucua'];
    if (a === '--help' || a === '-h') { opts.help = true; }
  }
  return opts;
}

function listVideoFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.mp4', '.mov', '.mkv', '.webm'].includes(ext);
  });
}

function compressFile(inputPath, outputPath) {
  // Use ffmpeg to compress: H.264, CRF 28, 720p, AAC 128k
  const args = ['-y', '-i', inputPath,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '28',
    '-vf', 'scale=-2:720',
    '-c:a', 'aac', '-b:a', '128k',
    outputPath
  ];

  console.log('Compressing:', path.basename(inputPath));
  const res = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  return res.status === 0;
}

async function main() {
  const opts = parseArgs();
  if (opts.help) {
    console.log('Usage: node scripts/compress_videos.js --slugs=juriti,mergulhao  OR  --all');
    process.exit(0);
  }

  checkFFmpeg();

  if (!opts.slugs || opts.slugs.length === 0) {
    console.error('No slugs provided. Use --slugs=juriti,mergulhao or --all');
    process.exit(1);
  }

  const repoRoot = path.join(__dirname, '..');
  for (const slug of opts.slugs) {
    const dir = path.join(repoRoot, 'uploads', slug);
    if (!fs.existsSync(dir)) {
      console.warn('Uploads folder not found for', slug, '- skipping');
      continue;
    }

    const videos = listVideoFiles(dir);
    if (videos.length === 0) {
      console.log('No video files found for', slug);
      continue;
    }

    const outDir = path.join(dir, 'compressed');
    fs.mkdirSync(outDir, { recursive: true });

    for (const v of videos) {
      const inputPath = path.join(dir, v);
      const outName = path.parse(v).name + '_compressed.mp4';
      const outputPath = path.join(outDir, outName);
      if (fs.existsSync(outputPath)) {
        console.log('Existing compressed file found, skipping:', outName);
        continue;
      }
      const ok = compressFile(inputPath, outputPath);
      if (!ok) console.error('Compression failed for', v);
      else console.log('Created', outputPath);
    }
  }
}

main().catch(err => {
  console.error('Error', err && err.message ? err.message : err);
  process.exit(1);
});
