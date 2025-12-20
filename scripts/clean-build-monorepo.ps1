# Clean build artifacts and run full monorepo build (safe, idempotent)
Write-Host "Cleaning .next folders, build markers and .turbo cache..."

# Remove .next and .next-build-complete in apps
Get-ChildItem -Path .\apps -Directory -ErrorAction SilentlyContinue | ForEach-Object {
    $next = Join-Path $_.FullName ".next"
    if (Test-Path $next) { Remove-Item -Recurse -Force $next -ErrorAction SilentlyContinue; Write-Host "Removed $next" }
    $nbc = Join-Path $_.FullName ".next-build-complete"
    if (Test-Path $nbc) { Remove-Item -Force $nbc -ErrorAction SilentlyContinue; Write-Host "Removed $nbc" }
}

# Remove .build-complete in packages
Get-ChildItem -Path .\packages -Directory -ErrorAction SilentlyContinue | ForEach-Object {
    $marker = Join-Path $_.FullName ".build-complete"
    if (Test-Path $marker) { Remove-Item -Force $marker -ErrorAction SilentlyContinue; Write-Host "Removed $marker" }
}

# Optionally clear turborepo cache for a full cold build
if (Test-Path ".\.turbo") { Remove-Item -Recurse -Force .\.turbo -ErrorAction SilentlyContinue; Write-Host "Removed .turbo" }

Write-Host "Starting full monorepo build (pnpm -w turbo run build)..."

Write-Host "Invoking pnpm..."
& pnpm -w turbo run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
} else {
    Write-Host "Build completed successfully"
}
