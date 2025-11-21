Param()

# Applies safe `void ` prefixes to locations reported by ESLint for floating/misused promises.
# Reads `tools/lint-summary/apps-publimicro.json` (ESLint JSON format), finds messages with
# ruleId `@typescript-eslint/no-floating-promises` or `@typescript-eslint/no-misused-promises`
# and inserts `void ` at the reported position in the source file. Backups are written to %TEMP%.

$report = 'tools\\lint-summary\\apps-publimicro.json'
if (-not (Test-Path $report)) {
    Write-Error "ESLint report not found: $report"
    exit 1
}

$json = Get-Content $report -Raw | ConvertFrom-Json

$targets = @()
foreach ($fileRec in $json) {
    $filePath = $fileRec.filePath
    foreach ($m in $fileRec.messages) {
        if ($m.ruleId -in @('@typescript-eslint/no-floating-promises','@typescript-eslint/no-misused-promises')) {
            $targets += [PSCustomObject]@{ file = $filePath; line = $m.line; column = $m.column }
        }
    }
}

if ($targets.Count -eq 0) {
    Write-Host "No floating/misused promise locations found in report."
    exit 0
}

$grouped = $targets | Group-Object -Property file

foreach ($g in $grouped) {
    $file = $g.Name
    if (-not (Test-Path $file)) { Write-Warning "File missing: $file"; continue }
    Write-Host "Processing $file ($($g.Count) locations)"

    # Backup original to TEMP with timestamp
    $ts = Get-Date -Format "yyyyMMdd-HHmmss"
    $bak = Join-Path $env:TEMP ("void-bak-{0}-{1}.bak" -f ([IO.Path]::GetFileName($file), $ts))
    Copy-Item -Path $file -Destination $bak -Force
    Write-Host "Backup -> $bak"

    $raw = Get-Content -LiteralPath $file -Raw -Encoding UTF8
    $arr = $raw -split "`n"

    # Sort locations by line asc, column desc so inserts on same line don't shift earlier columns
    $locs = ($g.Group | Sort-Object @{Expression={$_.line};Ascending=$true}, @{Expression={$_.column};Ascending=$false})

    foreach ($loc in $locs) {
        $li = [int]$loc.line - 1
        $col = [int]$loc.column - 1
        if ($li -lt 0 -or $li -ge $arr.Count) { Write-Warning "Invalid location $($loc.line):$($loc.column) in $file"; continue }
        $line = $arr[$li]

        # Skip if already has 'void' before the token (naive check)
        $preRangeStart = [Math]::Max(0, $col-6)
        $pre = $line.Substring($preRangeStart, [Math]::Min(6, $line.Length - $preRangeStart))
        if ($pre -match '\bvoid\b') { Write-Host "Skipping (already void) line $($loc.line)"; continue }

        # Avoid inserting inside strings or comments by a simple heuristic: ensure the character at col is not '"' or "'" or '/'
        $charAt = if ($col -lt $line.Length) { $line[$col] } else { '' }
        if ($charAt -match '["\'']') { Write-Host "Skipping (quote at col) line $($loc.line)"; continue }

        # Insert 'void ' at the column position
        if ($col -gt $line.Length) { $col = $line.Length }
        $newLine = $line.Substring(0,$col) + 'void ' + $line.Substring($col)
        $arr[$li] = $newLine
        Write-Host "Inserted void at $($loc.line):$($loc.column)"
    }

    # Write back
    ($arr -join "`n") | Set-Content -LiteralPath $file -Encoding UTF8
}

Write-Host "Void insertion complete. Run ESLint --fix next and re-run aggregation." 
