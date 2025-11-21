$env:PNPM_NETWORK_CONCURRENCY='1'
$env:NODE_OPTIONS='--max-old-space-size=1536'
Write-Host "Running auto-fix-promises-unused.ps1 with tuned env"
& 'c:\projetos\publimicro\tools\auto-fix-promises-unused.ps1'