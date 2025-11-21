$env:PNPM_NETWORK_CONCURRENCY='1'
$env:NODE_OPTIONS='--max-old-space-size=1536'
Write-Host "Running revert-bad-voids.ps1 with tuned env"
& 'c:\projetos\publimicro\tools\revert-bad-voids.ps1'