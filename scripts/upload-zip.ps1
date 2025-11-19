param(
  [Parameter(Mandatory=$true)][string]$ZipPath,
  [Parameter(Mandatory=$true)][string]$PropertyId,
  [string]$ApiUrl = 'http://localhost:3000',
  [string]$AdminKey = $env:ADMIN_KEY
)

if (-not (Test-Path $ZipPath)) { Write-Error "Zip not found: $ZipPath"; exit 2 }

if (-not $AdminKey) {
  $AdminKey = Read-Host -Prompt 'Enter x-admin-key (will not be saved)'
}

$bytes = [System.IO.File]::ReadAllBytes($ZipPath)
$b64 = [System.Convert]::ToBase64String($bytes)

$body = @{ property_id = $PropertyId; zip = @{ name = [System.IO.Path]::GetFileName($ZipPath); base64 = $b64 } }

$headers = @{ 'x-admin-key' = $AdminKey }

if (-not $ApiUrl) { Write-Error 'ApiUrl is empty'; exit 4 }
# Build HTTP endpoint safely (avoid using Join-Path which is for filesystem paths)
$endpoint = ($ApiUrl.TrimEnd('/')) + '/api/admin/property-media/zip'

Write-Host "Uploading $ZipPath to $endpoint for property $PropertyId"

try {
  $resp = Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -Body ($body | ConvertTo-Json -Depth 6) -ContentType 'application/json'
  Write-Host "Upload response:`n$($resp | ConvertTo-Json -Depth 4)"
} catch {
  Write-Error "Upload failed: $($_.Exception.Message)"
  if ($_.Exception.Response) {
    try { $text = $_.Exception.Response.Content.ReadAsStringAsync().Result } catch { $text = $null }
    if ($text) { Write-Error "Server response: $text" }
  }
  exit 3
}

exit 0
