# Deploy all apps to Vercel production
# Run this from the repository root: C:\projetos\publimicro

$apps = @(
    @{name="global"; port=3101},
    @{name="journey"; port=3100},
    @{name="motors"; port=3002},
    @{name="proper"; port=3001},
    @{name="outdoor"; port=3003},
    @{name="machina"; port=3004},
    @{name="share"; port=3005},
    @{name="tudo"; port=3006}
)

Write-Host "🚀 Deploying all PubliMicro apps to Vercel..." -ForegroundColor Green
Write-Host ""

foreach ($app in $apps) {
    $appName = $app.name
    Write-Host "📦 Deploying $appName..." -ForegroundColor Cyan
    
    # Deploy from repository root
    vercel --prod --yes --scope publimicros-projects `
        --build-env NEXT_PUBLIC_APP_NAME=$appName `
        --name "publi$appName"
    
    Write-Host "✅ $appName deployed successfully!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🎉 All apps deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "Apps deployed:"
Write-Host "  ✅ publimicro (already deployed)"
foreach ($app in $apps) {
    Write-Host "  ✅ $($app.name)"
}
