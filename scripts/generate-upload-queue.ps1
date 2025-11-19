param(
  [string]$UploadsRoot = 'C:\projetos\publimicro\Uploads',
  [string]$OutFile = 'upload-queue.json'
)

Write-Host "Scanning uploads root: $UploadsRoot"
if (-not (Test-Path $UploadsRoot)) { Write-Error "Uploads root not found: $UploadsRoot"; exit 2 }

# Mapping from folder name (normalized) to property id/slug used in the app
$mapping = @{
  'bigua'   = 'bigua'
  'abare'   = 'abare'
  'surucua' = 'surucua'
  'juriti'  = 'juriti'
  'seriema' = 'seriema'
}

$entries = @()

Get-ChildItem -Path $UploadsRoot -Directory | ForEach-Object {
  $ranchDir = $_.FullName
  # Normalize name: lowercase, decompose unicode to remove diacritics, strip combining marks, keep a-z0-9
  $name = $_.Name.ToLower()
  try {
    $decomposed = $name.Normalize([System.Text.NormalizationForm]::FormD)
    $withoutDiacritics = $decomposed -replace '\p{M}',''
  } catch {
    # Fallback: remove non-ascii characters
    $withoutDiacritics = $name -replace '[^\u0000-\u007F]',''
  }
  $ranchKey = $withoutDiacritics -replace '[^a-z0-9]',''
  $propId = $mapping[$ranchKey]
  if (-not $propId) {
    Write-Warning "No property mapping for folder: $($_.Name). Skipping."
    return
  }

  # search for processed zip first, then any zip
  $zips = Get-ChildItem -Path $ranchDir -Recurse -Filter '*-processed.zip' -File -ErrorAction SilentlyContinue
  if (-not $zips -or $zips.Count -eq 0) {
    $zips = Get-ChildItem -Path $ranchDir -Recurse -Filter '*.zip' -File -ErrorAction SilentlyContinue
  }

  foreach ($z in $zips) {
    $entries += @{ zipPath = $z.FullName; propertyId = $propId }
  }
}

if ($entries.Count -eq 0) {
  Write-Warning "No zip files found under $UploadsRoot. Nothing to write."
  exit 0
}

$entries | ConvertTo-Json -Depth 6 | Out-File -FilePath $OutFile -Encoding UTF8
Write-Host "Wrote $($entries.Count) queue entries to $OutFile"
exit 0
