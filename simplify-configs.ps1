$root = "c:\projetos\publimicro"
$apps = @("publimicro", "proper", "motors", "journey", "share", "global", "machina", "outdoor", "tudo")

Write-Host "Simplifying vercel.json files..." -ForegroundColor Cyan

foreach ($app in $apps) {
  $vercelJson = Join-Path $root "apps\$app\vercel.json"
  
  $content = @"
{
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build"
}
"@
  
  Set-Content -Path $vercelJson -Value $content -Encoding UTF8
  Write-Host "Updated: apps\$app\vercel.json" -ForegroundColor Green
}

Write-Host "Done!" -ForegroundColor Cyan
