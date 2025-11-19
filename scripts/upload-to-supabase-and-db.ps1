<#
Uploads processed zip files listed in a queue JSON directly to Supabase Storage
and inserts a record into the `property_photos` table for each uploaded file.

Requirements:
- Set the environment variable `SUPABASE_SERVICE_ROLE_KEY` (recommended) or pass `-ServiceRoleKey`.
- The service role key must have permission to write to Storage and the `property_photos` table.

Usage example:
  $env:SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key'
  pwsh -NoProfile -ExecutionPolicy Bypass .\scripts\upload-to-supabase-and-db.ps1 \
    -ProjectUrl 'https://irrzpwzyqcubhhjeuakc.supabase.co' -Bucket 'property-photos' -QueueJson '.\upload-queue.cleaned.json'

Notes:
- This will upload the entire zip file as a single object at `properties/<propertyId>/<filename>`.
- The inserted DB row will reference the public URL of the uploaded object. It will not extract zip contents.
#>
param(
  [string]$ProjectUrl = 'https://irrzpwzyqcubhhjeuakc.supabase.co',
  [string]$Bucket = 'property-photos',
  [string]$ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY,
  [string]$QueueJson = '.\upload-queue.cleaned.json',
  [switch]$DryRun,
  [int]$Retries = 2,
  [int]$BackoffSeconds = 3,
  [string]$Schema = 'public',
  [string]$Table = 'property_photos'
)

if (-not $ServiceRoleKey) { Write-Error "Supabase service role key not provided. Set `SUPABASE_SERVICE_ROLE_KEY` or pass -ServiceRoleKey."; exit 2 }
if (-not (Test-Path $QueueJson)) { Write-Error "Queue JSON not found: $QueueJson"; exit 2 }

$queue = Get-Content $QueueJson -Raw | ConvertFrom-Json
$failures = @()
$successes = @()

Add-Type -AssemblyName System.Net.Http
$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AllowAutoRedirect = $false
$client = New-Object System.Net.Http.HttpClient($handler)
$client.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue('Bearer', $ServiceRoleKey)
if (-not $client.DefaultRequestHeaders.Contains('apikey')) { $client.DefaultRequestHeaders.Add('apikey', $ServiceRoleKey) }

function Upload-File($localPath, $remotePath) {
  if (-not (Test-Path $localPath)) { return @{ ok = $false; error = 'Local file not found' } }
  $attempt = 0
  while ($attempt -le $Retries) {
    try {
      if ($DryRun) { return @{ ok = $true; dry = $true } }
      $content = New-Object System.Net.Http.MultipartFormDataContent
      $fs = [System.IO.File]::OpenRead($localPath)
      $streamContent = New-Object System.Net.Http.StreamContent($fs)
      $streamContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse('application/zip')
      $content.Add($streamContent, 'file', $remotePath)
      $uri = [string]::Format('{0}/storage/v1/object/{1}', $ProjectUrl.TrimEnd('/'), $Bucket)
      $uri = $uri + '?upsert=true'
      $resp = $client.PostAsync($uri, $content).Result
      $status = [int]$resp.StatusCode
      $body = $null
      try { $body = $resp.Content.ReadAsStringAsync().Result } catch {}
      $fs.Dispose(); $streamContent.Dispose(); $content.Dispose()
      if ($status -ge 200 -and $status -lt 300) { return @{ ok = $true; status = $status; body = $body } }
      else { $attempt++; if ($attempt -le $Retries) { Start-Sleep -Seconds ($BackoffSeconds * $attempt) } else { return @{ ok = $false; status = $status; body = $body } } }
    } catch { $attempt++; if ($attempt -le $Retries) { Start-Sleep -Seconds ($BackoffSeconds * $attempt) } else { return @{ ok = $false; error = $_.Exception.Message } } }
  }
}

function Insert-DbRow($propertyId, $publicUrl, $filename) {
  if ($DryRun) { return @{ ok = $true; dry = $true } }
  $payload = @{ property_id = $propertyId; url = $publicUrl; thumbnail_url = $null; caption = $filename; display_order = 0; is_cover = $false }
  $json = $payload | ConvertTo-Json -Depth 6
  $uri = [string]::Format('{0}/rest/v1/{1}', $ProjectUrl.TrimEnd('/'), $Table)
  $content = New-Object System.Net.Http.StringContent($json, [System.Text.Encoding]::UTF8, 'application/json')
  # Ask Supabase to return the inserted row (optional)
  if (-not $client.DefaultRequestHeaders.Contains('Prefer')) { $client.DefaultRequestHeaders.Add('Prefer','return=representation') }
  $resp = $client.PostAsync($uri, $content).Result
  $status = [int]$resp.StatusCode
  $body = $null
  try { $body = $resp.Content.ReadAsStringAsync().Result } catch {}
  if ($status -ge 200 -and $status -lt 300) { return @{ ok = $true; status = $status; body = $body } }
  return @{ ok = $false; status = $status; body = $body }
}

Write-Host "Uploading $($queue.Count) items to bucket '$Bucket' on $ProjectUrl`n" -ForegroundColor Cyan

foreach ($item in $queue) {
  $zipPath = $item.zipPath
  $propId = $item.propertyId
  if (-not $zipPath) { Write-Warning "Skipping item with no zipPath"; continue }
  if (-not (Test-Path $zipPath)) { Write-Warning "Missing file: $zipPath"; $failures += @{ zip = $zipPath; property = $propId; error = 'Missing local file' }; continue }

  $fileName = [System.IO.Path]::GetFileName($zipPath)
  $remotePath = "properties/$propId/$fileName"
  Write-Host "-> $zipPath  ->  $remotePath" -NoNewline

  $r = Upload-File -localPath $zipPath -remotePath $remotePath
  if ($r.ok) {
    if ($r.dry) { Write-Host "  (dry run)" -ForegroundColor Yellow; $successes += @{ zip = $zipPath; property = $propId; publicUrl = $null } }
    else {
      Write-Host "  [OK]" -ForegroundColor Green
      $publicUrl = "{0}/storage/v1/object/public/{1}/{2}" -f $ProjectUrl.TrimEnd('/'), $Bucket, [uri]::EscapeDataString($remotePath)
      # Insert DB row
      $ins = Insert-DbRow -propertyId $propId -publicUrl $publicUrl -filename $fileName
      if ($ins.ok) {
        Write-Host "    DB insert OK" -ForegroundColor Green
        $successes += @{ zip = $zipPath; property = $propId; publicUrl = $publicUrl; insert = $ins }
      } else {
        Write-Host "    DB insert FAIL (status $($ins.status))" -ForegroundColor Yellow
        Write-Host "    Body: $($ins.body)" -ForegroundColor Yellow
        $failures += @{ zip = $zipPath; property = $propId; details = $ins }
      }
    }
  } else {
    Write-Host "  [FAIL]" -ForegroundColor Red
    $failures += @{ zip = $zipPath; property = $propId; details = $r }
  }
}

Write-Host "`nUpload+DB summary: Successes=$($successes.Count) Failures=$($failures.Count)`n"
if ($successes.Count -gt 0) {
  Write-Host "Successful uploads (public URLs):" -ForegroundColor Cyan
  foreach ($s in $successes) { Write-Host "- $($s.property): $($s.publicUrl)" }
}
if ($failures.Count -gt 0) {
  $failures | ConvertTo-Json -Depth 6 | Set-Content .\upload-to-supabase-and-db.failures.json -Encoding utf8
  Write-Host "Wrote failures to ./upload-to-supabase-and-db.failures.json" -ForegroundColor Yellow
}

$client.Dispose()

exit 0
