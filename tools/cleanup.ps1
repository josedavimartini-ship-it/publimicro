<#
tools/cleanup.ps1
Safe workspace cleanup for low-memory/dev machines.

Usage (PowerShell):
  # Dry run (shows what would be removed)
  .\cleanup.ps1 -WhatIf

  # Safe cleanup (recommended): removes .next, .turbo, artifacts, caches, logs
  .\cleanup.ps1

  # Aggressive cleanup: also removes node_modules across workspace (requires confirmation)
  .\cleanup.ps1 -Aggressive

This script is interactive and will ask for confirmation before deleting large folders.
#>
param(
    [switch]$Aggressive,
    [switch]$Force
)

function Get-DirSizeMB($path) {
    if (-not (Test-Path $path)) { return 0 }
    $sum = Get-ChildItem -LiteralPath $path -Recurse -Force -ErrorAction SilentlyContinue | Where-Object { -not $_.PSIsContainer } | Measure-Object -Property Length -Sum
    return [math]::Round(($sum.Sum/1MB),2)
}

$root = Resolve-Path .
Write-Host "Workspace root: $root"

# Patterns for safe cleanup
$safeNames = @('.next', '.turbo', 'artifacts', '.cache')
# Add any local dev artifacts we created earlier
$extraPaths = @(
    "tools\playwright-smoke\artifacts",
    "tools\playwright-smoke\node_modules"
)

$targets = @()
foreach ($name in $safeNames) {
    $found = Get-ChildItem -Path $root -Directory -Recurse -Force -ErrorAction SilentlyContinue -Filter $name | Select-Object -ExpandProperty FullName -ErrorAction SilentlyContinue
    if ($found) { $targets += $found }
}

foreach ($p in $extraPaths) {
    $full = Join-Path $root $p
    if (Test-Path $full) { $targets += (Resolve-Path $full).Path }
}

if ($Aggressive) {
    # Find node_modules directories (can be many)
    Write-Host "Aggressive mode: will include workspace 'node_modules' folders (can be large)."
    $nm = Get-ChildItem -Path $root -Directory -Recurse -Force -ErrorAction SilentlyContinue -Filter node_modules | Select-Object -ExpandProperty FullName -ErrorAction SilentlyContinue
    if ($nm) { $targets += $nm }
}

# Remove duplicates and compute sizes
$targets = $targets | Sort-Object -Unique
if (-not $targets -or $targets.Count -eq 0) {
    Write-Host "No matching cleanup targets found."
    exit 0
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
    $answer = Read-Host "Proceed to delete these directories? Type 'YES' to proceed"
    if ($answer -ne 'YES') { Write-Host 'Aborting cleanup.'; exit 0 }
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

# remove loose log files at repo root (and under apps)
Write-Host "Removing *.log files..."
try {
    Get-ChildItem -Path $root -Recurse -Include *.log,*.log.* -File -ErrorAction SilentlyContinue | ForEach-Object { Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue }
} catch {
    Write-Warning ("Error removing log files: {0}" -f $_)
}

# Compute reclaimed size (best-effort)
$totalAfter = 0.0
foreach ($t in $targets) {
    if (Test-Path $t) { $totalAfter += Get-DirSizeMB $t }
}

$reclaimed = $totalBefore - $totalAfter
Write-Host "Cleanup finished. Claimed space before: $([math]::Round($totalBefore,2)) MB, after: $([math]::Round($totalAfter,2)) MB, reclaimed approx: $([math]::Round($reclaimed,2)) MB"

$helpText = @'
Tip: restart VS Code with extensions disabled if it's still unresponsive:
    code --disable-extensions

To disable/uninstall extensions from the CLI:
    List installed extensions:
        code --list-extensions
    Disable an extension temporarily:
        code --disable-extension publisher.extension
    Uninstall an extension:
        code --uninstall-extension publisher.extension

If you used Aggressive mode, you'll need to run:
    pnpm install
in the workspace root to reinstall dependencies before running the apps again.
'@

Write-Host $helpText
