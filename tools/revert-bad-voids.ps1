Param()

# Revert 'void ' insertions that were followed by '<' or '{', which break JSX or blocks.
# Scans all files under apps/publimicro/src and replaces 'void <' -> '<' and 'void {' -> '{'.

$root = 'apps\\publimicro\\src'
if (-not (Test-Path $root)) { Write-Error "Path not found: $root"; exit 1 }

$files = Get-ChildItem -Path $root -Recurse -Include *.ts,*.tsx -File | Select-Object -ExpandProperty FullName
$changed = 0
foreach ($f in $files) {
    $content = Get-Content -LiteralPath $f -Raw -Encoding UTF8
    $new = $content -replace 'void\s+<', '<' -replace 'void\s+{', '{'
    if ($new -ne $content) {
        Copy-Item -Path $f -Destination (Join-Path $env:TEMP ("void-repair-{0}-{1}.bak" -f ([IO.Path]::GetFileName($f), (Get-Date -Format 'yyyyMMdd-HHmmss')))) -Force
        $new | Set-Content -LiteralPath $f -Encoding UTF8
        Write-Host "Fixed occurrences in: $f"
        $changed++
    }
}
Write-Host "Revert script complete. Files changed: $changed"
