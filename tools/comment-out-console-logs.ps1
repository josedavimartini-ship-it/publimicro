Param(
  [string]$Root = "c:\projetos\publimicro\apps\publimicro\src"
)
$bakDir = Join-Path $env:TEMP ("autofix-console-bak-" + (Get-Date -Format yyyyMMdd-HHmmss))
New-Item -ItemType Directory -Force -Path $bakDir | Out-Null
Get-ChildItem -Path $Root -Recurse -Include *.ts,*.tsx | ForEach-Object {
  $path = $_.FullName
  $content = Get-Content -Raw -LiteralPath $path
  if($content -match "console\.log\s*\(") {
    Copy-Item -LiteralPath $path -Destination (Join-Path $bakDir ($_.Name + ".bak")) -Force
    $new = $content -replace "(^|\n)(\s*)console\.log\s*\(", "`$1`$2// console.log("
    Set-Content -LiteralPath $path -Value $new -Encoding utf8
    Write-Host "Commented console.log in: $path"
  }
}
Write-Host "Backups in: $bakDir"
