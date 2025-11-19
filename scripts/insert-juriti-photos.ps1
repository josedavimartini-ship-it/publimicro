param(
  [switch]$DryRun = $true,
  [string]$Bucket = 'imagens-sitios',
  [string]$Prefix = 'juriti/',
  [string]$PropertyId = 'juriti'
)

# Configuration
$ProjectHost = 'irrzpwzyqcubhhjeuakc.supabase.co'

# Debug: print resolved values
Write-Host "Debug: Bucket=$Bucket Prefix=$Prefix PropertyId=$PropertyId"

# Ensure key exists
if (-not $env:SUPABASE_SERVICE_ROLE_KEY) {
  Write-Error "Set $env:SUPABASE_SERVICE_ROLE_KEY first. Example:\n$env:SUPABASE_SERVICE_ROLE_KEY = '<your-service-role-key>'"
  exit 1
}

$hdr = @{
  Authorization = "Bearer $env:SUPABASE_SERVICE_ROLE_KEY"
  apikey        = $env:SUPABASE_SERVICE_ROLE_KEY
  Prefer        = 'return=representation'
  'Content-Type' = 'application/json'
}

# 1) List objects in bucket/prefix (build URI safely)
# Use explicit concatenation and URL-encoding for prefix to avoid interpolation issues
$escapedPrefix = [System.Uri]::EscapeDataString($Prefix)
$listBase = "https://$ProjectHost/storage/v1/object/list/"
$listUri = $listBase + $Bucket + "?prefix=" + $escapedPrefix
Write-Host "Listing objects: $listUri"
try {
  $objects = Invoke-RestMethod -Uri $listUri -Method Get -Headers @{ Authorization = "Bearer $env:SUPABASE_SERVICE_ROLE_KEY"; apikey = $env:SUPABASE_SERVICE_ROLE_KEY } -ErrorAction Stop
} catch {
  Write-Error "Failed to list objects: $($_.Exception.Message)"
  Write-Host "Note: If the Storage list endpoint is unavailable for this project you can still insert rows pointing to known public URLs."
  exit 1
}

if (-not $objects) {
  Write-Host "No objects found in $Bucket with prefix $Prefix"
  exit 0
}

# Normalize to array of names
$objectNames = @()
foreach ($o in $objects) { $objectNames += $o.name }

Write-Host "Found $($objectNames.Count) objects."

# 2) Build public URLs
$publicBase = "https://$ProjectHost/storage/v1/object/public/$Bucket"
$items = $objectNames | ForEach-Object {
  [PSCustomObject]@{
    name = $_
    publicUrl = "$publicBase/$($_ -replace ' ','%20')"
    filename = [System.IO.Path]::GetFileName($_)
  }
}

# 3) Query existing property_photos URLs for this property
$encodedProp = [Uri]::EscapeDataString($PropertyId)
$queryUri = "https://$ProjectHost/rest/v1/property_photos?property_id=eq.$encodedProp&select=url"
Write-Host "Querying existing rows: $queryUri"
try {
  $existingRows = Invoke-RestMethod -Uri $queryUri -Method Get -Headers $hdr -ErrorAction Stop
} catch {
  Write-Error "Failed to query property_photos: $($_.Exception.Message)"
  exit 1
}

$existingUrls = @{}
foreach ($r in $existingRows) { $existingUrls[$r.url] = $true }

# 4) Prepare insert payload for items not already present
$toInsert = @()
$displayOrder = 0
foreach ($it in $items) {
  if ($existingUrls.ContainsKey($it.publicUrl)) {
    Write-Host "Skipping (already exists): $($it.publicUrl)"
    continue
  }
  $payloadItem = @{
    property_id    = $PropertyId
    url            = $it.publicUrl
    thumbnail_url  = $null
    caption        = $it.filename
    display_order  = $displayOrder
    is_cover       = $false
  }
  $toInsert += $payloadItem
  $displayOrder += 1
}

if ($toInsert.Count -eq 0) {
  Write-Host "No new rows to insert for property_id = $PropertyId"
  exit 0
}

Write-Host "Prepared $($toInsert.Count) rows to insert."

# 5) Dry run: show what would be inserted
if ($DryRun) {
  Write-Host "DryRun = true. Review the payload below. Re-run with -DryRun:$false to insert."
  $toInsert | ConvertTo-Json -Depth 6
  exit 0
}

# 6) Insert rows into property_photos
$insertUri = "https://$ProjectHost/rest/v1/property_photos"
$body = $toInsert | ConvertTo-Json -Depth 6
Write-Host "Inserting rows..."
try {
  $result = Invoke-RestMethod -Uri $insertUri -Method Post -Headers $hdr -Body $body -ContentType 'application/json' -ErrorAction Stop
} catch {
  Write-Error "Insert failed: $($_.Exception.Message)"
  exit 1
}

Write-Host "Insert completed. Server returned:"
$result | ConvertTo-Json -Depth 6
