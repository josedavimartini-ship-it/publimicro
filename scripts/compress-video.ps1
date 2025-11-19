param(
  [Parameter(Mandatory = $true)][string]$InputFile,
  [Parameter(Mandatory = $true)][string]$OutputFile
)

function Exit-WithError($msg, $code=1) {
  Write-Error $msg
  exit $code
}

# Check ffmpeg
$ff = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ff) { Exit-WithError "ffmpeg not found in PATH. Please install ffmpeg and ensure it's available." 2 }

if (-not (Test-Path $InputFile)) { Exit-WithError "Input file not found: $InputFile" 3 }

# Ensure output dir exists
$outDir = Split-Path $OutputFile -Parent
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

Write-Host "Compressing video: $InputFile -> $OutputFile"

$args = @('-y', '-i', $InputFile, '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-c:a', 'aac', '-b:a', '128k', $OutputFile)
$proc = Start-Process -FilePath $ff.Source -ArgumentList $args -NoNewWindow -Wait -PassThru

if ($proc.ExitCode -ne 0) {
  Exit-WithError "ffmpeg failed with exit code $($proc.ExitCode)" $proc.ExitCode
}

Write-Host "Compression finished: $OutputFile"
exit 0
