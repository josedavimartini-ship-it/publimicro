param(
  [Parameter(Mandatory=$true)][string]$QueueJsonPath,
  [string]$ApiUrl = 'http://localhost:3000',
  [string]$AdminKey = $env:ADMIN_KEY,
  [switch]$ContinueOnError,
  [int]$Retries = 2,
  [int]$BackoffSeconds = 5
)

if (-not (Test-Path $QueueJsonPath)) { Write-Error "Queue file not found: $QueueJsonPath"; exit 2 }

if (-not $AdminKey) {
  $AdminKey = Read-Host -Prompt 'Enter x-admin-key (will not be saved)'
}

$queue = Get-Content $QueueJsonPath -Raw | ConvertFrom-Json

$failures = @()
$successCount = 0

function Invoke-Upload($zipPath, $propId) {
  $scriptPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'upload-zip.ps1'
  & pwsh -NoProfile -ExecutionPolicy Bypass -File $scriptPath -ZipPath $zipPath -PropertyId $propId -ApiUrl $ApiUrl -AdminKey $AdminKey
  return $LASTEXITCODE
}

foreach ($item in $queue) {
  $zip = $item.zipPath
  $prop = $item.propertyId
  if (-not (Test-Path $zip)) { Write-Warning "Skipping missing file: $zip"; continue }

  # Determine best candidate to send: prefer any file in same folder that ends with -processed.zip
  $parent = Split-Path $zip -Parent
  $base = [System.IO.Path]::GetFileNameWithoutExtension($zip)
  # normalize base by stripping repeated -processed suffixes
  while ($base -match '-processed$') { $base = $base -replace '-processed$','' }
  $processedCandidates = Get-ChildItem -Path $parent -Filter "${base}*-processed.zip" -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
  if ($processedCandidates -and $processedCandidates.Count -gt 0) { $toSend = $processedCandidates[0].FullName } else { $toSend = $zip }

  Write-Host "Uploading: $toSend -> property $prop"

  $attempt = 0
  $ok = $false
  while ($attempt -le $Retries -and -not $ok) {
    $exit = Invoke-Upload -zipPath $toSend -propId $prop
    if ($exit -eq 0) { $ok = $true; break }
    $attempt++
    if ($attempt -le $Retries) {
      $sleep = $BackoffSeconds * $attempt
      Write-Warning "Upload attempt $attempt failed for $toSend (exit $exit). Retrying in $sleep seconds..."
      Start-Sleep -Seconds $sleep
    }
  }

  if ($ok) {
    Write-Host "Upload complete: $toSend"
    $successCount++
  } else {
    Write-Error "Upload failed for $toSend after $attempt attempts."
    $failures += @{ zip = $toSend; property = $prop; exit = $exit }
    if (-not $ContinueOnError) {
      Write-Error "Aborting queue due to failure (use -ContinueOnError to continue on errors)."
      $failures | ConvertTo-Json -Depth 6 | Set-Content .\upload-queue.failures.json -Encoding utf8
      exit $exit
    } else {
      Write-Warning "Continuing to next item because -ContinueOnError was specified."
    }
  }
}

Write-Host "Queue finished. Successes: $successCount. Failures: $($failures.Count)"
if ($failures.Count -gt 0) {
  $failures | ConvertTo-Json -Depth 6 | Set-Content .\upload-queue.failures.json -Encoding utf8
  Write-Host "Wrote failures to .\upload-queue.failures.json"
}
exit 0
