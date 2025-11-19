<#
Simple helper to invoke `verify-uploads.ps1` after a bulk upload.
Usage:
  # Verify specific property ids
  pwsh ./scripts/verify-after-upload.ps1 -PropertyIds '2ab5c902-536d-4693-a255-2de307c54f3d,883e906a-7f53-4e45-ad82-65754bcfaaab'

  # Verify all properties (may be slow)
  pwsh ./scripts/verify-after-upload.ps1 -All

This script only invokes the existing `verify-uploads.ps1` script and writes reminder notes to the console.
#>
param(
  [string]$PropertyIds,
  [switch]$All
)

if (-not $All -and -not $PropertyIds) {
  Write-Host "Specify -PropertyIds 'id1,id2' or -All" -ForegroundColor Yellow
  exit 2
}

if ($All) { Write-Host "Running verification for all properties (this may be slow)..." -ForegroundColor Cyan; pwsh -NoProfile -ExecutionPolicy Bypass ./scripts/verify-uploads.ps1 -All; exit $LASTEXITCODE }

# Sanitize input and run
$ids = $PropertyIds -replace "[\s<>']",""
Write-Host "Running verification for properties: $ids" -ForegroundColor Cyan
pwsh -NoProfile -ExecutionPolicy Bypass ./scripts/verify-uploads.ps1 -PropertyIds $ids
exit $LASTEXITCODE
