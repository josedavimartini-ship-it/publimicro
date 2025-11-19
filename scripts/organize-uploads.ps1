param(
  [Parameter(Mandatory=$true)][string]$SourceFolder,
  [Parameter(Mandatory=$true)][string]$RanchName,
  [string]$Target,
  [switch]$Recurse,
  [switch]$CompressVideos,
  [switch]$Zip,
  [switch]$ProcessZips
)

# Resolve paths
$SourceFolder = (Resolve-Path -Path $SourceFolder)[0].ProviderPath
$ScriptDir = Split-Path -Parent $PSCommandPath
$RepoRoot = (Resolve-Path -Path (Join-Path $ScriptDir '..'))[0].ProviderPath
$UploadsRoot = Join-Path $RepoRoot 'Uploads'
# If caller provided a Target path, prefer it (resolve to provider path); otherwise derive from uploads root + ranch name
if ($Target) {
  $Target = (Resolve-Path -Path $Target)[0].ProviderPath
} else {
  $Target = Join-Path $UploadsRoot $RanchName
}
$PhotosDir = Join-Path $Target 'photos'
$VideosDir = Join-Path $Target 'videos'

# Ensure target folders exist
foreach ($d in @($UploadsRoot, $Target, $PhotosDir, $VideosDir)) {
  if (-not (Test-Path $d)) {
    New-Item -ItemType Directory -Path $d -Force | Out-Null
    Write-Host "Created: $d"
  }
}

# Extension lists
$imgExt = '.jpg','.jpeg','.png','.webp','.gif','.heic','.heif','.avif'
$videoExt = '.mp4','.mov','.mkv','.webm','.avi','.m4v','.flv','.ts'

# Gather files
$searchOption = @{ Path = $SourceFolder; File = $true }
if ($Recurse) { $searchOption['Recurse'] = $true }
$files = Get-ChildItem @searchOption | Where-Object { -not $_.PSIsContainer }

if (-not $files -or $files.Count -eq 0) {
  Write-Host "No files found in $SourceFolder"
  exit 0
}

# Helper: paths to optional compress scripts
$CompressScriptNode = Join-Path $RepoRoot 'scripts\compress_videos.mjs'
$CompressScriptPs = Join-Path $RepoRoot 'scripts\compress-video.ps1'
$HaveCompressScriptNode = Test-Path $CompressScriptNode
$HaveCompressScriptPs = Test-Path $CompressScriptPs

# Copy and optionally compress/unpack zips
$summary = @{
  movedPhotos = 0
  movedVideos = 0
  skipped = 0
  compressed = 0
}

foreach ($f in $files) {
  $ext = $f.Extension.ToLower()
  try {
    if ($imgExt -contains $ext) {
      $dest = Join-Path $PhotosDir $f.Name
      Copy-Item -Path $f.FullName -Destination $dest -Force
      Write-Host "Copied image: $($f.Name) -> $dest"
      $summary.movedPhotos++
    } elseif ($videoExt -contains $ext) {
      $dest = Join-Path $VideosDir $f.Name

      if ($CompressVideos -and ($HaveCompressScriptNode -or $HaveCompressScriptPs)) {
        # Create temp compressed filename
        $tempCompressed = Join-Path $env:TEMP ("{0}-{1}{2}" -f $f.BaseName, (Get-Date -Format yyyyMMddHHmmss), $f.Extension)
        Write-Host "Compressing video: $($f.Name) -> $tempCompressed"
        $compressOk = $false
        if ($HaveCompressScriptPs) {
          # Use PowerShell ffmpeg wrapper which supports input/output args
          $psArgs = @('-NoProfile','-ExecutionPolicy','Bypass','-File', $CompressScriptPs, '-InputFile', $f.FullName, '-OutputFile', $tempCompressed)
          $proc = Start-Process -FilePath 'pwsh' -ArgumentList $psArgs -NoNewWindow -Wait -PassThru
          if ($proc.ExitCode -eq 0 -and (Test-Path $tempCompressed)) { $compressOk = $true }
        } elseif ($HaveCompressScriptNode) {
          # Fallback: call node-based compressor (expects different args; may fail)
          $nodeArgs = @($CompressScriptNode, $f.FullName, $tempCompressed)
          $proc = Start-Process -FilePath 'node' -ArgumentList $nodeArgs -NoNewWindow -Wait -PassThru
          if ($proc.ExitCode -eq 0 -and (Test-Path $tempCompressed)) { $compressOk = $true }
        }
        if ($compressOk) {
          # Copy compressed file to destination (preserve original)
          Copy-Item -Path $tempCompressed -Destination $dest -Force
          Write-Host "Compressed & copied: $($f.Name) -> $dest"
          $summary.compressed++
          $summary.movedVideos++
        } else {
          # fallback: copy original
          Copy-Item -Path $f.FullName -Destination $dest -Force
          Write-Host "Compression failed, copied original: $($f.Name) -> $dest"
          $summary.movedVideos++
        }
      } else {
        Copy-Item -Path $f.FullName -Destination $dest -Force
        Write-Host "Copied video: $($f.Name) -> $dest"
        $summary.movedVideos++
      }
    } elseif ($ext -eq '.zip') {
      # Copy zip file to target root for server-side processing
      $dest = Join-Path $Target $f.Name
      Copy-Item -Path $f.FullName -Destination $dest -Force
      Write-Host "Copied ZIP: $($f.Name) -> $dest"
      # Optionally process zip locally: extract, compress videos inside, and recreate processed zip
      if ($ProcessZips) {
        Write-Host "Processing ZIP: $dest"
        $tmpExtract = Join-Path $env:TEMP ("extract_{0}_{1}" -f $RanchName, (Get-Date -Format yyyyMMddHHmmss))
        New-Item -ItemType Directory -Path $tmpExtract | Out-Null
        Add-Type -AssemblyName System.IO.Compression.FileSystem

        function Extract-ZipRecursively {
          param($zipPath, $outDir)
          try {
            if ($zipPath) { [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $outDir) }
            else { Write-Verbose "No initial zip path provided, skipping direct extract." }
          } catch {
            $msg = if ($_.Exception) { $_.Exception.Message } else { $_.ToString() }
            Write-Warning ("Failed to extract {0}: {1}" -f $zipPath, $msg)
            return
          }
          # Look for nested zips and extract them in-place into folders
          $nested = Get-ChildItem -Path $outDir -Recurse -Filter '*.zip' -File
          foreach ($nz in $nested) {
            $parent = Split-Path $nz.FullName -Parent
            $innerOut = Join-Path $parent ([System.IO.Path]::GetFileNameWithoutExtension($nz.Name))
            if (-not (Test-Path $innerOut)) { New-Item -ItemType Directory -Path $innerOut | Out-Null }
            try {
              [System.IO.Compression.ZipFile]::ExtractToDirectory($nz.FullName, $innerOut)
            } catch {
              Write-Warning "Failed to extract nested zip $($nz.FullName): $_"
            }
            # remove nested zip after extraction to avoid reprocessing
            Remove-Item -Path $nz.FullName -Force -ErrorAction SilentlyContinue
          }
          # If extracting nested zip produced new zips, run again until none left
          if (Get-ChildItem -Path $outDir -Recurse -Filter '*.zip' -File) {
            Extract-ZipRecursively -zipPath $null -outDir $outDir
          }
        }

        # initial extraction
        Extract-ZipRecursively -zipPath $dest -outDir $tmpExtract

        # Find videos inside extract and optionally compress
        $extractedVideos = Get-ChildItem -Path $tmpExtract -Recurse -File | Where-Object { $videoExt -contains $_.Extension.ToLower() }
        foreach ($ev in $extractedVideos) {
          if ($CompressVideos -and ($HaveCompressScriptPs -or $HaveCompressScriptNode)) {
            $tempCompressed = Join-Path $env:TEMP ("{0}-{1}{2}" -f $ev.BaseName, (Get-Date -Format yyyyMMddHHmmss), $ev.Extension)
            Write-Host "Compressing inside zip: $($ev.Name) -> $tempCompressed"
            $compressOk = $false
            if ($HaveCompressScriptPs) {
              $psArgs = @('-NoProfile','-ExecutionPolicy','Bypass','-File', $CompressScriptPs, '-InputFile', $ev.FullName, '-OutputFile', $tempCompressed)
              $proc = Start-Process -FilePath 'pwsh' -ArgumentList $psArgs -NoNewWindow -Wait -PassThru
              if ($proc.ExitCode -eq 0 -and (Test-Path $tempCompressed)) { $compressOk = $true }
            } elseif ($HaveCompressScriptNode) {
              $nodeArgs = @($CompressScriptNode, $ev.FullName, $tempCompressed)
              $proc = Start-Process -FilePath 'node' -ArgumentList $nodeArgs -NoNewWindow -Wait -PassThru
              if ($proc.ExitCode -eq 0 -and (Test-Path $tempCompressed)) { $compressOk = $true }
            }
            if ($compressOk) {
              Copy-Item -Path $tempCompressed -Destination $ev.FullName -Force
              Remove-Item -Path $tempCompressed -Force -ErrorAction SilentlyContinue
              Write-Host "Replaced extracted video with compressed version: $($ev.Name)"
              $summary.compressed++
            } else {
              Write-Host "Compression failed for extracted video: $($ev.Name)"
            }
          }
        }

        # Recreate a processed zip
        $processedZip = Join-Path $Target ("{0}-processed.zip" -f ([System.IO.Path]::GetFileNameWithoutExtension($f.Name)))
        if (Test-Path $processedZip) { Remove-Item $processedZip -Force }
        try {
          [System.IO.Compression.ZipFile]::CreateFromDirectory($tmpExtract, $processedZip)
          Write-Host "Created processed ZIP: $processedZip"
        } catch {
          Write-Warning "Failed to create processed zip: $_"
        }
        # Clean up extracted temp
        Remove-Item -Path $tmpExtract -Recurse -Force -ErrorAction SilentlyContinue
      }
    } else {
      Write-Host "Skipped (unknown ext): $($f.Name)"
      $summary.skipped++
    }
  } catch {
    Write-Warning "Failed to move $($f.FullName): $_"
  }
}

Write-Host "\nSummary: Photos=$($summary.movedPhotos) Videos=$($summary.movedVideos) Skipped=$($summary.skipped) Compressed=$($summary.compressed)"

if ($Zip) {
  $zipPath = Join-Path $UploadsRoot ("$RanchName.zip")
  if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
  Write-Host "Creating ZIP: $zipPath"
  Compress-Archive -Path (Join-Path $Target '*') -DestinationPath $zipPath -Force
  Write-Host "ZIP created at: $zipPath"
}

Write-Host "Done. Target folder: $Target"
