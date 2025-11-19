<#
Wrapper script to copy provided local folders into repository Uploads/, process nested zips and videos,
generate an upload queue and upload sequentially to the admin ZIP endpoint.

USAGE (run from repo root):
  pwsh .\scripts\run-full-upload.ps1

The script will:
 - Copy each source path (from your OneDrive) into the appropriate Uploads/<ranch> subfolder
 - For video folders/zips it will call organize-uploads with -ProcessZips -CompressVideos
 - Generate upload-queue.json using generate-upload-queue.ps1
 - Prompt for ADMIN_KEY (unless $env:ADMIN_KEY is set) and ApiUrl, then run upload-queue.ps1

This script does NOT have access to your OneDrive remotely — you must run it locally on your machine.
#>

param(
  [switch]$DryRun
)

function Confirm-Ok($msg) {
  $r = Read-Host "$msg (Y/n)"
  return ($r -eq '' -or $r.ToLower().StartsWith('y'))
}

Write-Host "Run full upload wrapper — will copy files, process zips, compress videos, and upload sequentially."
if (-not (Confirm-Ok "Proceed?")) { Write-Host 'Aborting.'; exit 1 }

# Source paths provided by user
$sources = @{
  'bigua_photos' = 'C:\Users\Usuario\OneDrive\Documentos\JoseDavi\Carcará\PublimicroWebSite\Biguá\biguaphotos'
  'bigua_videos' = 'C:\Users\Usuario\OneDrive\Documentos\JoseDavi\Carcará\PublimicroWebSite\Biguá\biguavideos'
  'abare_photos' = 'C:\Users\Usuario\OneDrive\Documentos\JoseDavi\Carcará\PublimicroWebSite\Abaré\abarephotos'
  'abare_videos' = 'C:\Users\Usuario\OneDrive\Documentos\JoseDavi\Carcará\PublimicroWebSite\Abaré\abarevideos'
  'surucua_photos' = 'C:\Users\Usuario\OneDrive\Documentos\JoseDavi\Carcará\PublimicroWebSite\Surucuá\surucuaphotos'
  'surucua_videos' = 'C:\Users\Usuario\OneDrive\Documentos\JoseDavi\Carcará\PublimicroWebSite\Surucuá\surucuavideos'
  'juriti_photos' = 'C:\Users\Usuario\OneDrive\Documentos\JoseDavi\Carcará\PublimicroWebSite\Juriti\juritiphotos'
  'juriti_videos' = 'C:\Users\Usuario\OneDrive\Documentos\JoseDavi\Carcará\PublimicroWebSite\Juriti'
  'seriema_videos' = 'C:\Users\Usuario\OneDrive\Documentos\JoseDavi\Carcará\PublimicroWebSite\Seriema\seriemavideos'
}

# Target base
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
# Resolve uploads root robustly and ensure we end up with a single provider path string
$uploadsCandidate = Join-Path $repoRoot '..\Uploads'
try {
  $resolved = Resolve-Path -Path $uploadsCandidate -ErrorAction Stop
} catch {
  $uploadsCandidate = Join-Path (Get-Location) 'Uploads'
  if (-not (Test-Path $uploadsCandidate)) {
    New-Item -ItemType Directory -Path $uploadsCandidate -Force | Out-Null
  }
  $resolved = Resolve-Path -Path $uploadsCandidate -ErrorAction Stop
}
# Use the first resolved path to avoid arrays being passed to Join-Path later
$uploadsRoot = $resolved[0].ProviderPath

Write-Host "Uploads root: $uploadsRoot"

function Ensure-Create($path) {
  if (-not (Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
}

function Copy-One($source, $dest) {
  if (-not (Test-Path $source)) { Write-Warning "Source not found: $source. Skipping."; return }
  Ensure-Create $dest
  Write-Host "Copying from $source -> $dest"
  if ($DryRun) { Write-Host "DRY RUN: would copy"; return }
  Copy-Item -Path (Join-Path $source '*') -Destination $dest -Recurse -Force
}

# 1) Copy one-by-one (order preserved)
Write-Host "Step 1: Copying folders (one at a time)."

# bigua
Copy-One $sources['bigua_photos'] (Join-Path $uploadsRoot 'Biguá\photos')
Copy-One $sources['bigua_videos'] (Join-Path $uploadsRoot 'Biguá\videos')

# abare
Copy-One $sources['abare_photos'] (Join-Path $uploadsRoot 'Abaré\photos')
Copy-One $sources['abare_videos'] (Join-Path $uploadsRoot 'Abaré\videos')

# surucua
Copy-One $sources['surucua_photos'] (Join-Path $uploadsRoot 'Surucuá\photos')
Copy-One $sources['surucua_videos'] (Join-Path $uploadsRoot 'Surucuá\videos')

# juriti
Copy-One $sources['juriti_photos'] (Join-Path $uploadsRoot 'juriti\photos')
Copy-One $sources['juriti_videos'] (Join-Path $uploadsRoot 'juriti\videos')

# seriema (single video)
Copy-One $sources['seriema_videos'] (Join-Path $uploadsRoot 'seriema\videos')

Write-Host "Copy step complete."

# 2) Process zips and compress videos for video folders
if (-not $DryRun) {
  if (Confirm-Ok "Run nested-zip extraction and compress videos for all ranch video folders now? (This will call organize-uploads.ps1)") {
    $videoRanchDirs = @(
      Join-Path $uploadsRoot 'Biguá\videos',
      Join-Path $uploadsRoot 'Abaré\videos',
      Join-Path $uploadsRoot 'Surucuá\videos',
      Join-Path $uploadsRoot 'juriti\videos',
      Join-Path $uploadsRoot 'seriema\videos'
    )
    foreach ($dir in $videoRanchDirs) {
      if (-not (Test-Path $dir)) { Write-Warning "Video folder missing: $dir. Skipping."; continue }
      Write-Host "Processing videos in: $dir"
      pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'organize-uploads.ps1') -Source $dir -Target $dir -RanchName (Split-Path $dir -Leaf) -ProcessZips -CompressVideos
      if ($LASTEXITCODE -ne 0) { Write-Warning "organize-uploads.ps1 reported exit code $LASTEXITCODE for $dir" }
    }
  } else { Write-Host "Skipping video processing as requested." }
}

# 3) Generate upload queue JSON
Write-Host "Generating upload queue (upload-queue.json)"
pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'generate-upload-queue.ps1') -UploadsRoot $uploadsRoot -OutFile (Join-Path $repoRoot '..\upload-queue.json')

if (-not (Test-Path (Join-Path $repoRoot '..\upload-queue.json'))) {
  Write-Warning "upload-queue.json not created — aborting before upload."
  exit 0
}

# 4) Upload queue sequentially
if (-not $DryRun) {
  $apiUrl = Read-Host 'Enter API URL (e.g. https://your-app-host or http://localhost:3000)'
  if (-not $apiUrl) { $apiUrl = 'http://localhost:3000' }
  if (-not $env:ADMIN_KEY) {
    $env:ADMIN_KEY = Read-Host -AsSecureString 'Enter ADMIN KEY (will be used for this session)'
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:ADMIN_KEY)
    $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    Remove-Variable bstr -ErrorAction SilentlyContinue
    $env:ADMIN_KEY = $plain
  }

  Write-Host "Starting upload queue..."
  pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'upload-queue.ps1') -QueueJsonPath (Join-Path $repoRoot '..\upload-queue.json') -ApiUrl $apiUrl -AdminKey $env:ADMIN_KEY
  if ($LASTEXITCODE -ne 0) { Write-Error "upload-queue.ps1 failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }
  Write-Host "Upload queue finished."
}

Write-Host "All done. Review uploads in your admin UI and check server logs for any processing errors."
exit 0
