# Deploy all PubliMicro apps to Vercel
# This script opens the Vercel import page for each app

Write-Host "Opening Vercel deployment pages for all apps..." -ForegroundColor Green
Write-Host ""

$apps = @(
    @{name="global"; displayName="PubliGlobal"}
    @{name="journey"; displayName="PubliJourney"}
    @{name="motors"; displayName="PubliMotors"}
    @{name="proper"; displayName="PubliProper"}
    @{name="outdoor"; displayName="PubliOutdoor"}
    @{name="machina"; displayName="PubliMachina"}
    @{name="share"; displayName="PubliShare"}
    @{name="tudo"; displayName="PubliTudo"}
)

$repoUrl = "https://github.com/josedavimartini-ship-it/publimicro"

foreach ($app in $apps) {
    $url = "https://vercel.com/new/clone?repository-url=$repoUrl&project-name=publi$($app.name)"
    Write-Host "Opening deployment for $($app.displayName)..." -ForegroundColor Cyan
    Write-Host "   URL: $url" -ForegroundColor Gray
    Write-Host "   IMPORTANT: Leave Root Directory EMPTY or set to '.' in Vercel UI" -ForegroundColor Yellow
    Start-Process $url
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "All deployment pages opened!" -ForegroundColor Green
Write-Host "Now click Deploy on each browser tab to deploy all apps." -ForegroundColor Yellow
