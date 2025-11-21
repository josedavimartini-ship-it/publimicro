$env:PNPM_NETWORK_CONCURRENCY='1'
$env:NODE_OPTIONS='--max-old-space-size=1536'
New-Item -ItemType Directory -Force -Path tools\lint-summary | Out-Null
$files = Get-ChildItem -Path apps\publimicro\src -Recurse -Include *.ts,*.tsx | Where-Object { -not $_.Name.EndsWith('.d.ts') }
$results = @()
$batchSize=20
for($i=0;$i -lt $files.Count; $i+=$batchSize) {
  $batch = $files[$i..([math]::Min($i+$batchSize-1,$files.Count-1))]
  foreach($f in $batch) {
    Write-Host "Linting $($f.FullName)"
    & pnpm exec eslint $f.FullName --ext .ts,.tsx --format json > stdout.txt 2>$null
    $json = Get-Content stdout.txt -Raw
    if($json -and $json.Trim()) {
      try { $parsed = $json | ConvertFrom-Json; $results += $parsed } catch { Write-Host "Parse error for $($f.FullName)" }
    }
  }
}
$results | ConvertTo-Json -Depth 10 | Out-File -Encoding utf8 tools\lint-summary\apps-publimicro.json
$totalFiles = $results.Count
$totalErrors = ($results | ForEach-Object { $_.errorCount } | Measure-Object -Sum).Sum
$totalWarnings = ($results | ForEach-Object { $_.warningCount } | Measure-Object -Sum).Sum
$rules = @{}
foreach($r in $results) {
  foreach($m in $r.messages) {
    $rule = $m.ruleId
    if($rule) {
      if(-not $rules.ContainsKey($rule)) { $rules[$rule]=0 }
      $rules[$rule] += 1
    }
  }
}
$top = $rules.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 20
$summaryObj = @{ files = $totalFiles; errors = $totalErrors; warnings = $totalWarnings; topRules = $top }
$summaryObj | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 tools\lint-summary\apps-publimicro-summary.json
$sb = New-Object System.Text.StringBuilder
$sb.AppendLine("Files: $totalFiles") | Out-Null
$sb.AppendLine("Errors: $totalErrors") | Out-Null
$sb.AppendLine("Warnings: $totalWarnings") | Out-Null
$sb.AppendLine("Top rules:") | Out-Null
foreach($t in $top) { $sb.AppendLine("  $($t.Name): $($t.Value)") | Out-Null }
$sb.ToString() | Out-File -Encoding utf8 tools\lint-summary\apps-publimicro-summary.txt
Write-Host "Wrote tools/lint-summary/apps-publimicro.json and summary files"
