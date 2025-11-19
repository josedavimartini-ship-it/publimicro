<#
Uploads processed zip files listed in a queue JSON directly to Supabase Storage.
- Requires the Supabase service_role key available in environment: $env:SUPABASE_SERVICE_ROLE_KEY
- Usage example:
    $env:SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key'
    pwsh -NoProfile -ExecutionPolicy Bypass .\scripts\upload-to-supabase.ps1 -ProjectUrl 'https://irrzpwzyqcubhhjeuakc.supabase.co' -Bucket 'property-photos' -QueueJson '.\upload-queue.cleaned.json'

Behavior:
- Reads JSON array of { zipPath, propertyId }
- Uploads each zip as `properties/<propertyId>/<filename>` in the specified bucket
- Prints a short result table and writes failures to `upload-to-supabase.failures.json`
- NOTE: This only stores files in Supabase Storage — it does NOT run the server-side extraction/transcoding or insert DB rows.
#>
param(
  [string]$ProjectUrl = 'https://irrzpwzyqcubhhjeuakc.supabase.co',
  [string]$Bucket = 'property-photos',
  [string]$ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY,
  [string]$QueueJson = '.\upload-queue.cleaned.json',
  [switch]$DryRun,
  [int]$Retries = 2,
  [int]$BackoffSeconds = 3
)

if (-not $ServiceRoleKey) {
  Write-Error "Supabase service role key not provided. Set the environment variable `SUPABASE_SERVICE_ROLE_KEY` or pass -ServiceRoleKey."
  exit 2
}

if (-not (Test-Path $QueueJson)) {
  Write-Error "Queue JSON not found: $QueueJson"
  exit 2
}

$queue = Get-Content $QueueJson -Raw | ConvertFrom-Json
$failures = @()
$successes = @()

Add-Type -AssemblyName System.Net.Http
$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AllowAutoRedirect = $false
$client = New-Object System.Net.Http.HttpClient($handler)
# Set auth headers
$client.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue('Bearer', $ServiceRoleKey)
# also include apikey header as some Supabase endpoints expect it
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
      # When adding the file to multipart form-data, pass the filename including the desired remote path (Supabase will use this)
      $content.Add($streamContent, 'file', $remotePath)

      $uri = [string]::Format('{0}/storage/v1/object/{1}', $ProjectUrl.TrimEnd('/'), $Bucket)
      # use upsert=true to overwrite if file exists (optional)
      $uri = $uri + '?upsert=true'

      $resp = $client.PostAsync($uri, $content).Result
      $status = [int]$resp.StatusCode
      $body = $null
      try { $body = $resp.Content.ReadAsStringAsync().Result } catch {}

      $fs.Dispose()
      $streamContent.Dispose()
      $content.Dispose()

      if ($status -ge 200 -and $status -lt 300) {
        return @{ ok = $true; status = $status; body = $body }
      } else {
        $attempt++
        if ($attempt -le $Retries) {
          Start-Sleep -Seconds ($BackoffSeconds * $attempt)
        } else {
          return @{ ok = $false; status = $status; body = $body }
        }
      }
    } catch {
      $attempt++
      if ($attempt -le $Retries) { Start-Sleep -Seconds ($BackoffSeconds * $attempt) } else { return @{ ok = $false; error = $_.Exception.Message } }
    }
  }
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
    if ($r.dry) { Write-Host "  (dry run)" -ForegroundColor Yellow } else { Write-Host "  [OK]" -ForegroundColor Green }
    $publicUrl = "{0}/storage/v1/object/public/{1}/{2}" -f $ProjectUrl.TrimEnd('/'), $Bucket, [uri]::EscapeDataString($remotePath)
    $successes += @{ zip = $zipPath; property = $propId; publicUrl = $publicUrl }
  } else {
    Write-Host "  [FAIL]" -ForegroundColor Red
    $failures += @{ zip = $zipPath; property = $propId; details = $r }
  }
}

# Write summary
Write-Host "`nUpload summary: Successes=$($successes.Count) Failures=$($failures.Count)`n"
if ($successes.Count -gt 0) {
  Write-Host "Successful uploads (public URLs):" -ForegroundColor Cyan
  foreach ($s in $successes) { Write-Host "- $($s.property): $($s.publicUrl)" }
}
if ($failures.Count -gt 0) {
  $failures | ConvertTo-Json -Depth 6 | Set-Content .\upload-to-supabase.failures.json -Encoding utf8
  Write-Host "Wrote failures to ./upload-to-supabase.failures.json" -ForegroundColor Yellow
}

$client.Dispose()

exit 0
