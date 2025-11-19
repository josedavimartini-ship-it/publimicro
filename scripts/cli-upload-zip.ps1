param(
  [Parameter(Mandatory=$true)][string]$FolderPath,
  [Parameter(Mandatory=$true)][string]$PropertyId,
  [Parameter(Mandatory=$false)][string]$AdminKey,
  [Parameter(Mandatory=$false)][string]$Endpoint = "http://localhost:3000/api/admin/property-media/zip"
)

$FolderPath = Resolve-Path -Path $FolderPath
if (-not (Test-Path $FolderPath)) {
  Write-Error "Folder path not found: $FolderPath"
  exit 1
}

# Create temp zip file
$zipName = [System.IO.Path]::GetFileName($FolderPath)
$zipFile = Join-Path -Path $env:TEMP -ChildPath ("{0}_{1}.zip" -f $zipName, (Get-Date -Format yyyyMMddHHmmss))
if (Test-Path $zipFile) { Remove-Item $zipFile -Force }

Write-Host "Zipping folder '$FolderPath' -> $zipFile"
Compress-Archive -Path (Join-Path $FolderPath "*" ) -DestinationPath $zipFile -Force

# Read and base64 encode
Write-Host "Reading and encoding zip..."
[byte[]]$bytes = [System.IO.File]::ReadAllBytes($zipFile)
$base64 = [System.Convert]::ToBase64String($bytes)

$body = @{ property_id = $PropertyId; zip = @{ name = [System.IO.Path]::GetFileName($zipFile); base64 = $base64 } } | ConvertTo-Json -Depth 5

$headers = @{}
if ($AdminKey) { $headers['x-admin-key'] = $AdminKey }

Write-Host "Posting ZIP to $Endpoint (property_id: $PropertyId)"
try {
  $response = Invoke-RestMethod -Uri $Endpoint -Method Post -Body $body -Headers $headers -ContentType 'application/json'
  Write-Host "Server response:`n" (ConvertTo-Json $response -Depth 5)
} catch {
  Write-Error "Upload failed: $_"
  exit 1
}

Write-Host "Done. Temporary zip: $zipFile"
