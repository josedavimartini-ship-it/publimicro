$apps = @(
  @{ Name = "proper";   Filter = "proper"; Domain = "proper.publimicro.com.br" },
  @{ Name = "motors";   Filter = "@publimicro/motors"; Domain = "motors.publimicro.com.br" },
  @{ Name = "journey";  Filter = "@publimicro/journey"; Domain = "journey.publimicro.com.br" },
  @{ Name = "share";    Filter = "@publimicro/share"; Domain = "share.publimicro.com.br" },
  @{ Name = "global";   Filter = "@publimicro/global"; Domain = "global.publimicro.com.br" },
  @{ Name = "machina";  Filter = "@publimicro/machina"; Domain = "machina.publimicro.com.br" },
  @{ Name = "outdoor";  Filter = "@publimicro/outdoor"; Domain = "outdoor.publimicro.com.br" },
  @{ Name = "tudo";     Filter = "@publimicro/tudo"; Domain = "tudo.publimicro.com.br" }
)

Write-Host "Setting up Vercel projects..." -ForegroundColor Cyan
Write-Host ""

foreach ($app in $apps) {
  $appPath = Join-Path "c:\projetos\publimicro" "apps\$($app.Name)"
  
  Write-Host ">>> $($app.Name)" -ForegroundColor Green
  Set-Location $appPath
  
  # Link to new Vercel project
  vercel link --yes
  
  # Add domain
  vercel domains add $($app.Domain)
  
  # Deploy
  vercel --prod
  
  Write-Host ""
}

Set-Location "c:\projetos\publimicro"
Write-Host "All done!" -ForegroundColor Cyan
