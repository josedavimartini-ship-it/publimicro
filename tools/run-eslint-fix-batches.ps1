$env:PNPM_NETWORK_CONCURRENCY='1'
$env:NODE_OPTIONS='--max-old-space-size=1536'
$files = Get-ChildItem -Path apps\publimicro\src -Recurse -Include *.ts,*.tsx | Where-Object { -not $_.Name.EndsWith('.d.ts') }
$batchSize = 20
for($i=0; $i -lt $files.Count; $i += $batchSize) {
  $batch = $files[$i..([math]::Min($i+$batchSize-1, $files.Count-1))]
  Write-Host "Running eslint --fix on files $i..$([math]::Min($i+$batchSize-1, $files.Count-1))"
  foreach($f in $batch) {
    & pnpm exec eslint $f.FullName --ext .ts,.tsx --fix 2>$null
  }
}
Write-Host 'ESLint --fix batches complete.'
