param(
  [switch]$DryRun = $true,
  [string]$UploadsDir = "Uploads",
  [string]$Bucket = 'imagens-sitios',
  [string]$ProjectHost = 'irrzpwzyqcubhhjeuakc.supabase.co',
  [string]$MappingFile = '',  # optional JSON file mapping slug -> uuid
  [string[]]$IncludeExtensions = @('jpg','jpeg','png','gif','webp','heic','mp4','mov','mkv')
)

if (-not (Test-Path $UploadsDir)) {
  Write-Error "Uploads directory '$UploadsDir' not found. Create and populate it, or set -UploadsDir to the correct path."
  exit 1
}

if (-not $env:SUPABASE_SERVICE_ROLE_KEY) {
  Write-Error "Set $env:SUPABASE_SERVICE_ROLE_KEY before running this script."
  exit 1
}

$hdr = @{ Authorization = "Bearer $env:SUPABASE_SERVICE_ROLE_KEY"; apikey = $env:SUPABASE_SERVICE_ROLE_KEY; Prefer = 'return=representation'; 'Content-Type' = 'application/json' }

# Build list of slugs from folder names under UploadsDir
$folders = Get-ChildItem -Path $UploadsDir -Directory | Select-Object -ExpandProperty Name
if (-not $folders -or $folders.Count -eq 0) {
  Write-Host "No subfolders found under $UploadsDir. Nothing to do."
  exit 0
}

Write-Host "Found folders: $($folders -join ', ')"

# Load mapping if provided
$mapping = @{}
if ($MappingFile -ne '' -and (Test-Path $MappingFile)) {
  try {
    $raw = Get-Content $MappingFile -Raw
    $json = $raw | ConvertFrom-Json
    # Normalize mapping into a Hashtable so we can use ContainsKey safely
    if ($null -eq $json) {
      Write-Warning "Mapping file $MappingFile is empty or invalid JSON."
    } else {
      foreach ($p in $json.PSObject.Properties) {
        $mapping[$p.Name] = $p.Value
      }
      Write-Host "Loaded mapping from $MappingFile"
    }
  } catch {
    Write-Error "Failed to load mapping file: $($_.Exception.Message)"
    exit 1
  }
}

# Function to resolve slug -> uuid (either from mapping or by querying properties table)
function Resolve-PropertyId($slug) {
  # Try direct mapping first (exact folder name)
  if ($mapping.ContainsKey($slug)) {
    $val = $mapping[$slug]
    if ($val -is [System.Management.Automation.PSCustomObject] -and $val.id) { return $val.id }
    return $val
  }

  # Normalize slug: remove diacritics, lowercase, replace spaces with hyphens
  function Normalize-Slug($s) {
    if ($null -eq $s) { return $s }
    $norm = $s.Normalize([System.Text.NormalizationForm]::FormD)
    $chars = $norm.ToCharArray() | Where-Object { [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark }
    $joined = ($chars -join '') -replace '\s+','-'
    return $joined.ToLowerInvariant()
  }

  $normalized = Normalize-Slug($slug)
  if ($mapping.ContainsKey($normalized)) {
    $val = $mapping[$normalized]
    if ($val -is [System.Management.Automation.PSCustomObject] -and $val.id) { return $val.id }
    return $val
  }

  Write-Host "Querying properties for slug: $slug (normalized: $normalized)"
  $enc = [System.Uri]::EscapeDataString($normalized)
  $uri = "https://$ProjectHost/rest/v1/properties?slug=eq.$enc&select=id,slug"
  try {
    $res = Invoke-RestMethod -Uri $uri -Method Get -Headers $hdr -ErrorAction Stop
    if ($res -and $res.Count -gt 0) { return $res[0].id }
    return $null
  } catch {
    Write-Warning "Failed to query properties for '$slug': $($_.Exception.Message)"
    return $null
  }
}

# Collect payloads
$allInserts = @()
foreach ($slug in $folders) {
  $propId = Resolve-PropertyId $slug
  if (-not $propId) {
    Write-Warning "No property id found for slug '$slug' — skipping this folder."
    continue
  }

  $files = Get-ChildItem -Path (Join-Path $UploadsDir $slug) -File -Recurse | Where-Object { $_.Name -notlike '*.zip' }
  if (-not $files -or $files.Count -eq 0) {
    Write-Host "No files found in folder $slug — skipping."
    continue
  }
  if (-not $files -or $files.Count -eq 0) {
    Write-Host "No files found in folder $slug — skipping."
    continue
  }

  $displayOrder = 0
  # dedupe by url
  $seen = @{}
  foreach ($f in $files) {
    $filename = $f.Name
    # skip dotfiles like .gitkeep
    if ($filename.StartsWith('.')) { continue }
    $ext = $f.Extension.TrimStart('.').ToLowerInvariant()
    if ($ext -and ($IncludeExtensions -notcontains $ext)) { continue }
    $encoded = [System.Web.HttpUtility]::UrlPathEncode("$slug/$filename")
    $publicUrl = "https://$ProjectHost/storage/v1/object/public/$Bucket/$encoded"
    if ($seen.ContainsKey($publicUrl)) { continue }
    $seen[$publicUrl] = $true
    $item = @{ property_id = $propId; url = $publicUrl; thumbnail_url = $null; caption = $filename; display_order = $displayOrder; is_cover = $false }
    $allInserts += $item
    $displayOrder += 1
  }
}

if ($allInserts.Count -eq 0) {
  Write-Host "No inserts prepared. Exiting."
  exit 0
}

Write-Host "Prepared $($allInserts.Count) photo rows for insertion."

if ($DryRun) {
  Write-Host "DryRun = true. Previewing payload (first 50 items):"
  $allInserts[0..([Math]::Min(49, $allInserts.Count-1))] | ConvertTo-Json -Depth 6
  Write-Host "To perform insertion, re-run with -DryRun:$false"
  exit 0
}

# Perform insert
$insertUri = "https://$ProjectHost/rest/v1/property_photos"
$body = $allInserts | ConvertTo-Json -Depth 6
try {
  $result = Invoke-RestMethod -Uri $insertUri -Method Post -Headers $hdr -Body $body -ContentType 'application/json' -ErrorAction Stop
  Write-Host "Insert completed. Server returned (truncated):"
  $result | ConvertTo-Json -Depth 6
} catch {
  Write-Error "Bulk insert failed: $($_.Exception.Message)"
  exit 1
}
