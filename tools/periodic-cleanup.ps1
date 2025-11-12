<#
tools/periodic-cleanup.ps1
Lightweight periodic cleanup for low-RAM/dev machines.

Usage (PowerShell):
  # Dry run (shows what would be removed)
  .\periodic-cleanup.ps1 -WhatIf

  # Safe cleanup (recommended): removes .vercel, dist, build, .next, .turbo, artifacts, .cache
  .\periodic-cleanup.ps1 -Force

  # Aggressive cleanup: also removes node_modules across workspace (requires -Aggressive -Force)
  .\periodic-cleanup.ps1 -Aggressive -Force

  # Run git gc after cleanup (careful on low-RAM). Use -RunGitGc to enable.
  .\periodic-cleanup.ps1 -Force -RunGitGc

This script deliberately uses -WhatIf unless -Force is specified.
#>
param(
    [switch]$Aggressive,
    [switch]$Force,
    [switch]$RunGitGc
)

$root = Resolve-Path .
Write-Host "Workspace root: $root"

$patterns = @('.vercel', '.next', '.turbo', 'artifacts', '.cache', 'dist', 'build')
$targets = @()

foreach ($name in $patterns) {
    $found = Get-ChildItem -Path $root -Directory -Recurse -Force -ErrorAction SilentlyContinue -Filter $name | Select-Object -ExpandProperty FullName -ErrorAction SilentlyContinue
    if ($found) { $targets += $found }
}

# add package-level dist folders
$pkgDists = Get-ChildItem -Path $root -Directory -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq 'dist' -or $_.Name -eq 'build' } | Select-Object -ExpandProperty FullName -ErrorAction SilentlyContinue
if ($pkgDists) { $targets += $pkgDists }

if ($Aggressive) {
    Write-Host "Aggressive mode: including workspace 'node_modules' folders (can be very large)."
    $nm = Get-ChildItem -Path $root -Directory -Recurse -Force -ErrorAction SilentlyContinue -Filter node_modules | Select-Object -ExpandProperty FullName -ErrorAction SilentlyContinue
    if ($nm) { $targets += $nm }
}

$targets = $targets | Sort-Object -Unique
if (-not $targets -or $targets.Count -eq 0) {
    Write-Host "No matching cleanup targets found."
    exit 0
}

function Get-DirSizeMB($path) {
    if (-not (Test-Path $path)) { return 0 }
    $sum = Get-ChildItem -LiteralPath $path -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { -not $_.PSIsContainer } | Measure-Object -Property Length -Sum
    return [math]::Round(($sum.Sum/1MB),2)
}

$totalBefore = 0.0
Write-Host "Found the following targets (size in MB):"
foreach ($t in $targets) {
    $size = Get-DirSizeMB $t
    $totalBefore += $size
    Write-Host " - $t : $size MB"
}
Write-Host "Estimated total reclaimable space: $([math]::Round($totalBefore,2)) MB"

if (-not $Force) {
    Write-Host "Dry-run mode (no files will be deleted). Re-run with -Force to perform deletions."
    Write-Host "To perform an aggressive (node_modules) cleanup run with: .\periodic-cleanup.ps1 -Aggressive -Force"
    # perform a WhatIf pass to show Remove-Item targets
    foreach ($t in $targets) {
        Remove-Item -LiteralPath $t -Recurse -Force -WhatIf
    }
    exit 0
}

# Perform deletion
foreach ($t in $targets) {
    try {
        Write-Host "Removing: $t"
        Remove-Item -LiteralPath $t -Recurse -Force -ErrorAction Stop
    } catch {
        Write-Warning ("Failed to remove {0}: {1}" -f $t, $_)
    }
}

# optional git gc
if ($RunGitGc) {
    Write-Host "Running: git gc --auto --prune=now (may use CPU/RAM)"
    try {
        git gc --auto --prune=now
    } catch {
        Write-Warning ("git gc failed: {0}" -f $_)
    }
}

Write-Host "Periodic cleanup finished. Reclaimed approx: $([math]::Round($totalBefore,2)) MB"
Write-Host "Tip: run this on a schedule (Task Scheduler) when idle, or run manually before large installs/builds."