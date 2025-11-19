<#
Upload all files under `Uploads/` (recursively) to Supabase Storage bucket `imagens-sitios` (by default)
and optionally insert rows into `property_photos`.

Behavior:
- For each file under `Uploads/<slug>/...`, it uploads to `imagens-sitios/<slug>/<relative-path>` preserving subfolders.
- Skips dotfiles and files with extensions not in the whitelist.
- After upload, optionally inserts a row into `property_photos` pointing to the public URL.

Usage example:
  $env:SUPABASE_SERVICE_ROLE_KEY = '<service-role-key>'
  pwsh .\scripts\upload-uploads-folder.ps1 -UploadsDir .\Uploads -DryRun -InsertDb

Parameters:
-UploadsDir: local folder root containing per-ranch subfolders
-Bucket: storage bucket to upload into (default: 'imagens-sitios')
-ProjectUrl: Supabase URL (default project)
-ServiceRoleKey: optional, defaults to $env:SUPABASE_SERVICE_ROLE_KEY
-DryRun: if set, no upload or DB insert will be performed (shows planned actions)
-InsertDb: if set, after successful upload will insert a `property_photos` row (needs service role key)
-IncludeExtensions: whitelist of file extensions
#>
param(
  [string]$UploadsDir = "Uploads",
  [string]$Bucket = 'imagens-sitios',
  [string]$ProjectUrl = 'https://irrzpwzyqcubhhjeuakc.supabase.co',
  [string]$ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY,
  [switch]$DryRun,
  [switch]$InsertDb,
  [string[]]$IncludeExtensions = @('jpg','jpeg','png','gif','webp','heic','mp4','mov','mkv')
)

if (-not (Test-Path $UploadsDir)) { Write-Error "UploadsDir '$UploadsDir' not found"; exit 2 }
if ($InsertDb -and -not $ServiceRoleKey) { Write-Error "Set SUPABASE_SERVICE_ROLE_KEY or pass -ServiceRoleKey to insert DB rows"; exit 2 }

Add-Type -AssemblyName System.Net.Http
$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AllowAutoRedirect = $false
$client = New-Object System.Net.Http.HttpClient($handler)
if ($ServiceRoleKey) {
  $client.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue('Bearer', $ServiceRoleKey)
  if (-not $client.DefaultRequestHeaders.Contains('apikey')) { $client.DefaultRequestHeaders.Add('apikey', $ServiceRoleKey) }
}

function Get-ContentType($ext) {
  switch ($ext.ToLower()) {
    'jpg' { return 'image/jpeg' }
    'jpeg' { return 'image/jpeg' }
    'png' { return 'image/png' }
    'gif' { return 'image/gif' }
    'webp' { return 'image/webp' }
    'heic' { return 'image/heif' }
    'mp4' { return 'video/mp4' }
    'mov' { return 'video/quicktime' }
    'mkv' { return 'video/x-matroska' }
    default { return 'application/octet-stream' }
  }
}

$files = Get-ChildItem -Path $UploadsDir -File -Recurse | Where-Object { -not $_.Name.StartsWith('.') }
$planned = @()
foreach ($f in $files) {
  $rel = Resolve-Path $f.FullName | ForEach-Object { $_.Path }
  $rel = $rel.Substring((Resolve-Path $UploadsDir).Path.Length).TrimStart('\','/')
  if (-not $rel) { continue }
  $segments = $rel -split '[\\/]'
  $slug = $segments[0]
  # Build remote path using canonical folder policy to avoid mismatches:
  # - images -> photos
  # - videos -> videos
  # - if filename or original path contains 'compressed' -> compressed
  if ($segments.Count -gt 1) { $origRestSegments = ($segments | Select-Object -Skip 1) } else { $origRestSegments = @() }
  $restFileName = $f.Name
  $ext = $f.Extension.TrimStart('.').ToLower()
  if ($ext -and ($IncludeExtensions -notcontains $ext)) { continue }
  # Determine canonical subfolder
  $imageExts = @('jpg','jpeg','png','gif','webp','heic')
  $videoExts = @('mp4','mov','mkv')
  $lowerName = $restFileName.ToLower()
  $hasCompressed = ($lowerName -like '*compressed*') -or ($origRestSegments -contains 'compressed')
  if ($hasCompressed) {
    $subfolder = 'compressed'
  } elseif ($imageExts -contains $ext) {
    $subfolder = 'photos'
  } elseif ($videoExts -contains $ext) {
    $subfolder = 'videos'
  } else {
    # fallback to preserving original subfolders if unknown
    if ($origRestSegments.Count -gt 0) { $subfolder = ($origRestSegments -join '/').TrimEnd('/') } else { $subfolder = '' }
  }

  if ($subfolder -ne '') { $remotePath = "$slug/$subfolder/$restFileName" } else { $remotePath = "$slug/$restFileName" }
  $remotePath = $remotePath -replace '\\','/'
  $planned += [pscustomobject]@{ local = $f.FullName; remote = $remotePath; slug = $slug; ext = $ext }
}

if ($planned.Count -eq 0) { Write-Host "No files to upload (after filters)."; exit 0 }
Write-Host "Planned uploads: $($planned.Count) files" -ForegroundColor Cyan
$planned | Select-Object local,remote | Format-Table -AutoSize

function UploadSingle($localPath, $remotePath, $contentType) {
  if ($DryRun) { return @{ ok=$true; dry=$true } }
  try {
    # Use PUT to write the file to the bucket (works when multipart POST route is unavailable)
    $fs = [System.IO.File]::OpenRead($localPath)
    $streamContent = New-Object System.Net.Http.StreamContent($fs)
    $streamContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse($contentType)
    $escaped = [uri]::EscapeDataString($remotePath)
    $uri = "{0}/storage/v1/object/{1}/{2}?upsert=true" -f $ProjectUrl.TrimEnd('/'), $Bucket, $escaped
    $resp = $client.PutAsync($uri, $streamContent).Result
    $status = [int]$resp.StatusCode
    $body = $resp.Content.ReadAsStringAsync().Result
    $fs.Dispose(); $streamContent.Dispose()
    if ($status -ge 200 -and $status -lt 300) { return @{ ok=$true; status=$status; body=$body } }
    return @{ ok=$false; status=$status; body=$body }
  } catch { return @{ ok=$false; error=$_.Exception.Message } }
}

function InsertPhotoRow($propertyId, $publicUrl, $filename) {
  if ($DryRun) { return @{ ok=$true; dry=$true } }
  $payload = @{ property_id = $propertyId; url = $publicUrl; thumbnail_url = $null; caption = $filename; display_order = 0; is_cover = $false }
  $json = $payload | ConvertTo-Json -Depth 6
  $uri = "{0}/rest/v1/property_photos" -f $ProjectUrl.TrimEnd('/')
  $content = New-Object System.Net.Http.StringContent($json, [System.Text.Encoding]::UTF8, 'application/json')
  if (-not $client.DefaultRequestHeaders.Contains('Prefer')) { $client.DefaultRequestHeaders.Add('Prefer','return=representation') }
  $resp = $client.PostAsync($uri, $content).Result
  $status = [int]$resp.StatusCode
  $body = $resp.Content.ReadAsStringAsync().Result
  if ($status -ge 200 -and $status -lt 300) { return @{ ok=$true; status=$status; body=$body } }
  return @{ ok=$false; status=$status; body=$body }
}

$success = @(); $fails = @()
foreach ($p in $planned) {
  Write-Host "Uploading $($p.local) -> $Bucket/$($p.remote)" -NoNewline
  $ctype = Get-ContentType $p.ext
  $up = UploadSingle -localPath $p.local -remotePath $p.remote -contentType $ctype
  if ($up.ok) {
    if ($up.dry) { Write-Host "  (dry)" -ForegroundColor Yellow; $success += @{ local=$p.local; remote=$p.remote } ; continue }
    Write-Host "  Uploaded" -ForegroundColor Green
    $publicUrl = "{0}/storage/v1/object/public/{1}/{2}" -f $ProjectUrl.TrimEnd('/'), $Bucket, [uri]::EscapeDataString($p.remote)
    if ($InsertDb) {
      # Try to resolve property id from slug via properties table
      $propId = $null
      try {
        $q = "{0}/rest/v1/properties?slug=eq.{1}&select=id" -f $ProjectUrl.TrimEnd('/'), [uri]::EscapeDataString($p.slug)
        $res = $client.GetAsync($q).Result
        $body = $res.Content.ReadAsStringAsync().Result
        $json = $null
        try { $json = $body | ConvertFrom-Json } catch {}
        if ($json -and $json.Count -gt 0) { $propId = $json[0].id }
      } catch {}
      if (-not $propId) { Write-Warning "  Could not resolve property id for slug $($p.slug); skipping DB insert"; $fails += @{ local=$p.local; remote=$p.remote; note='no-property-id' }; continue }
      # Avoid duplicate DB rows: check if a property_photos row already references this URL
      $encodedUrl = [uri]::EscapeDataString($publicUrl)
      $checkUri = "{0}/rest/v1/property_photos?url=eq.{1}&select=id" -f $ProjectUrl.TrimEnd('/'), $encodedUrl
      try {
        $checkRes = $client.GetAsync($checkUri).Result
        $checkBody = $checkRes.Content.ReadAsStringAsync().Result
        $checkJson = $null
        try { $checkJson = $checkBody | ConvertFrom-Json } catch {}
        if ($checkJson -and $checkJson.Count -gt 0) { Write-Host "  DB row already exists for this URL; skipping insert" -ForegroundColor Yellow; $success += @{ local=$p.local; remote=$p.remote; note='already-in-db' }; continue }
      } catch {
        # continue to attempt insert if check fails
      }

      $ins = InsertPhotoRow -propertyId $propId -publicUrl $publicUrl -filename ([IO.Path]::GetFileName($p.local))
      if ($ins.ok) { Write-Host "  DB row inserted" -ForegroundColor Green; $success += @{ local=$p.local; remote=$p.remote; property=$propId } }
      else { Write-Warning "  DB insert failed: $($ins.status) $($ins.body)"; $fails += @{ local=$p.local; remote=$p.remote; error=$ins } }
    } else {
      $success += @{ local=$p.local; remote=$p.remote }
    }
  } else {
    Write-Warning "  Upload failed: $($up.status) $($up.error) $($up.body)"; $fails += @{ local=$p.local; remote=$p.remote; error=$up }
  }
}

Write-Host "\nDone. Successes=$($success.Count) Failures=$($fails.Count)"
if ($fails.Count -gt 0) { $fails | ConvertTo-Json -Depth 6 | Set-Content .\upload-uploads-folder.failures.json -Encoding utf8; Write-Host "Wrote failures to ./upload-uploads-folder.failures.json" }
# After successful DB inserts, run verification for affected properties to ensure URLs are reachable.
$appliedProps = @()
foreach ($s in $success) { if ($s.ContainsKey('property')) { $appliedProps += $s.property } }
$appliedProps = $appliedProps | Select-Object -Unique
if (-not $DryRun -and $appliedProps.Count -gt 0) {
  $idList = $appliedProps -join ','
  Write-Host "Running post-upload verification for properties: $idList" -ForegroundColor Cyan
  try {
    pwsh -NoProfile -ExecutionPolicy Bypass ./scripts/verify-uploads.ps1 -PropertyIds $idList
  } catch {
    Write-Warning "Post-upload verification failed to run: $($_.Exception.Message)"
  }
}

$client.Dispose()
exit 0
