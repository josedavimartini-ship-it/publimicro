param([string]$Slugs = "abare,bigua,surucua", [string]$Out = "artifacts/processed-uploads-improved.json", [switch]$Dry)
if ($Dry.IsPresent) { $dryFlag = ' --dry-run' } else { $dryFlag = '' }

# Run a node script with FFmpeg bin from tools added to PATH for this session
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path "$scriptDir\.." | Select-Object -ExpandProperty Path
$ffbin = Join-Path $repoRoot 'tools\ffmpeg\ffmpeg-8.0.1-essentials_build\bin'
if (-not (Test-Path $ffbin)) { Write-Error "FFmpeg bin not found at $ffbin"; exit 1 }
$env:PATH = "$ffbin;$env:PATH"
Write-Host "Added to PATH:" $ffbin
Write-Host "ffmpeg at:" (Get-Command ffmpeg -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Path -ErrorAction SilentlyContinue)
Push-Location $repoRoot
try {
  & node scripts/process-and-upload-improved.mjs --slugs $Slugs --out $Out $dryFlag
} finally {
  Pop-Location
}
