# Adds the tools FFmpeg bin to the current user's PATH (User environment variable)
# Usage: Run from project root: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\setup-ffmpeg.ps1
$binPath = Join-Path (Resolve-Path .).Path "tools\ffmpeg\ffmpeg-8.0.1-essentials_build\bin"
if (!(Test-Path $binPath)) { Write-Error "FFmpeg bin not found at $binPath. Extract it first (downloaded to tools/ffmpeg)."; exit 1 }
$current = [Environment]::GetEnvironmentVariable('PATH','User')
if ($current -and $current.Split(';') -contains $binPath) { Write-Host "FFmpeg path already present for current user: $binPath"; exit 0 }
$new = if ([string]::IsNullOrEmpty($current)) { $binPath } else { $current + ";" + $binPath }
[Environment]::SetEnvironmentVariable('PATH',$new,'User')
Write-Host "Added FFmpeg bin to user PATH. Restart your shells to pick up the change: $binPath"