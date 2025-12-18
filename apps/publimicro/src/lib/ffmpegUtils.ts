/**
 * Modern FFmpeg utilities using native child_process
 * Replaces deprecated fluent-ffmpeg package
 */
import { spawn } from 'child_process';

// Get ffmpeg path from @ffmpeg-installer/ffmpeg or environment
function getFfmpegPath(): string {
  // First try environment variable
  if (process.env.FFMPEG_PATH) {
    return process.env.FFMPEG_PATH;
  }
  
  // Try to get from @ffmpeg-installer/ffmpeg
  try {
    // Use dynamic require to avoid bundler issues
    const req = eval('require') as NodeRequire;
    type FfmpegInstaller = { path?: string };
    const ffmpegInstaller = req('@ffmpeg-installer/ffmpeg') as FfmpegInstaller;
    if (ffmpegInstaller?.path) {
      return ffmpegInstaller.path;
    }
  } catch {
    // Fall through to default
  }
  
  // Default to system ffmpeg
  return 'ffmpeg';
}

/**
 * Execute ffmpeg command with arguments
 */
function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegPath = getFfmpegPath();
    const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    
    let stderr = '';
    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
      }
    });
    
    proc.on('error', (err) => {
      reject(new Error(`Failed to start ffmpeg: ${err.message}`));
    });
  });
}

/**
 * Transcode video to web-friendly H.264 MP4
 */
export async function transcodeVideo(
  inputPath: string,
  outputPath: string,
  options: {
    maxHeight?: number;
    preset?: string;
    crf?: number;
  } = {}
): Promise<void> {
  const { maxHeight = 720, preset = 'veryfast', crf = 23 } = options;
  
  const args = [
    '-i', inputPath,
    '-c:v', 'libx264',
    '-preset', preset,
    '-crf', String(crf),
    '-movflags', '+faststart',
    '-vf', `scale=-2:${maxHeight}`,
    '-y', // Overwrite output
    outputPath
  ];
  
  await runFfmpeg(args);
}

/**
 * Generate thumbnail from video
 */
export async function generateThumbnail(
  inputPath: string,
  outputPath: string,
  options: {
    width?: number;
    timestamp?: string;
  } = {}
): Promise<void> {
  const { width = 640, timestamp = '00:00:01' } = options;
  
  const args = [
    '-i', inputPath,
    '-ss', timestamp,
    '-vframes', '1',
    '-vf', `scale=${width}:-1`,
    '-y', // Overwrite output
    outputPath
  ];
  
  await runFfmpeg(args);
}

/**
 * Get video duration in seconds
 */
export async function getVideoDuration(inputPath: string): Promise<number> {
  return new Promise((resolve) => {
    const ffmpegPath = getFfmpegPath();
    // Use ffprobe if available, otherwise use ffmpeg
    const ffprobePath = ffmpegPath.replace(/ffmpeg(\.exe)?$/i, 'ffprobe$1');
    
    const args = [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      inputPath
    ];
    
    const proc = spawn(ffprobePath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    
    let stdout = '';
    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        const duration = parseFloat(stdout.trim());
        resolve(isNaN(duration) ? 0 : duration);
      } else {
        // Fallback: return 0 if ffprobe fails
        resolve(0);
      }
    });
    
    proc.on('error', () => {
      resolve(0);
    });
  });
}

export default {
  transcodeVideo,
  generateThumbnail,
  getVideoDuration,
};
