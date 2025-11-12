<#
tools/setup-ngrok.ps1
Helper to download ngrok (if you provide a direct download URL) and configure authtoken.

Usage:
  # Show help and example URL
  .\setup-ngrok.ps1 -Help

  # Download from a direct url (example is provided but may change). The script will prompt for authtoken.
  .\setup-ngrok.ps1 -DownloadUrl 'https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip' -InstallPath 'tools\ngrok' -AuthToken 'YOUR_NGROK_AUTHTOKEN'

Notes:
- If you don't pass a DownloadUrl, the script prints instructions to download manually and how to place ngrok.exe under tools\ngrok.
- The script avoids silently downloading from hard-coded URLs unless you explicitly provide one.
#>
param(
    [string]$DownloadUrl,
    [string]$InstallPath = "tools\\ngrok",
    [string]$AuthToken,
    [switch]$Help
)

if ($Help) {
    Write-Host "Usage examples:`n .\setup-ngrok.ps1 -DownloadUrl '<direct-zip-url>' -InstallPath 'tools\\ngrok' -AuthToken '<your-token>'"
    Write-Host "If you don't have a direct URL, visit https://ngrok.com/download and download the Windows ZIP, then run this script with -InstallPath pointing to the folder containing ngrok.exe."
    exit 0
}

$installFull = Join-Path (Resolve-Path .).Path $InstallPath
if (-not (Test-Path $installFull)) { New-Item -Path $installFull -ItemType Directory -Force | Out-Null }

if (-not $DownloadUrl) {
    Write-Host "No download URL provided. Please download ngrok manually from https://ngrok.com/download (Windows) and unzip ngrok.exe into: $installFull"
    Write-Host "After placing ngrok.exe there, run: `n  & '$installFull\\ngrok.exe' authtoken <your-token>"
    exit 0
}

# download and extract
$zipPath = Join-Path $env:TEMP ([System.IO.Path]::GetRandomFileName() + '.zip')
Write-Host "Downloading ngrok from: $DownloadUrl"
try {
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $zipPath -UseBasicParsing -ErrorAction Stop
} catch {
    Write-Warning "Failed to download ngrok: $_"
    exit 1
}

Write-Host "Extracting to: $installFull"
try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $installFull)
} catch {
    Write-Warning "Extraction failed: $_"
    Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
    exit 1
}

Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

$ngrokExe = Join-Path $installFull 'ngrok.exe'
if (-not (Test-Path $ngrokExe)) {
    Write-Warning "ngrok.exe not found in $installFull after extraction. Place ngrok.exe there manually and re-run this script with -AuthToken if you want to set auth token."
    exit 1
}

if ($AuthToken) {
    Write-Host "Configuring authtoken"
    & $ngrokExe authtoken $AuthToken
    if ($LASTEXITCODE -ne 0) { Write-Warning "ngrok authtoken command returned non-zero exit code: $LASTEXITCODE" }
}

Write-Host "ngrok setup complete. To run a tunnel to port 3000:"
Write-Host "    & '$ngrokExe' http 3000"
Write-Host "You can place ngrok.exe somewhere in your PATH or call it via full path."
