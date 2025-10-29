$root = "c:\projetos\publimicro"
$apps = @("publimicro", "proper", "motors", "journey", "share", "global", "machina", "outdoor", "tudo")

Write-Host "Redeploying all apps to production..." -ForegroundColor Cyan
Write-Host ""

foreach ($app in $apps) {
  $appPath = Join-Path $root "apps\$app"
  
  if (-not (Test-Path $appPath)) {
    Write-Host "[skip] $app - path not found" -ForegroundColor Yellow
    continue
  }
  
  Write-Host "=== Deploying $app ===" -ForegroundColor Cyan
  Set-Location $appPath
  
  vercel --prod
  
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[success] $app deployed" -ForegroundColor Green
  } else {
    Write-Host "[error] $app deployment failed" -ForegroundColor Red
  }
  Write-Host ""
}

Set-Location $root
Write-Host "All deployments queued!" -ForegroundColor Cyan
