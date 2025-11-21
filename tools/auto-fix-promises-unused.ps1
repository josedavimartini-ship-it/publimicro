Param()

# Automated pass:
# - Inserts `void ` for remaining `no-floating-promises` and `no-misused-promises` locations
# - Prefixes simple unused variable declarations with `_` when ESLint reports `no-unused-vars`
# Backups are created in %TEMP% before any change.

$report = 'tools\\lint-summary\\apps-publimicro.json'
if (-not (Test-Path $report)) { Write-Error "ESLint report not found: $report"; exit 1 }

$json = Get-Content $report -Raw | ConvertFrom-Json

$voidRules = @('@typescript-eslint/no-floating-promises','@typescript-eslint/no-misused-promises')
$unusedRule = '@typescript-eslint/no-unused-vars'

$opsByFile = @{}

foreach ($fileRec in $json) {
    $filePath = $fileRec.filePath
    foreach ($m in $fileRec.messages) {
        if ($m.ruleId -in $voidRules) {
            if (-not $opsByFile.ContainsKey($filePath)) { $opsByFile[$filePath] = [System.Collections.ArrayList]::new() }
            $opsByFile[$filePath].Add(@{ kind='void'; line=$m.line; column=$m.column }) | Out-Null
        }
        elseif ($m.ruleId -eq $unusedRule) {
            if (-not $opsByFile.ContainsKey($filePath)) { $opsByFile[$filePath] = [System.Collections.ArrayList]::new() }
            $opsByFile[$filePath].Add(@{ kind='unused'; line=$m.line; column=$m.column; message=$m.message }) | Out-Null
        }
    }
}

if ($opsByFile.Keys.Count -eq 0) { Write-Host "No target operations found in ESLint report."; exit 0 }

foreach ($file in $opsByFile.Keys) {
    if (-not (Test-Path $file)) { Write-Warning "File missing: $file"; continue }
    Write-Host "Processing $file ($($opsByFile[$file].Count) ops)"

    # Backup
    $ts = Get-Date -Format "yyyyMMdd-HHmmss"
    $bak = Join-Path $env:TEMP ("autofix-bak-{0}-{1}.bak" -f ([IO.Path]::GetFileName($file), $ts))
    Copy-Item -Path $file -Destination $bak -Force
    Write-Host "Backup -> $bak"

    $raw = Get-Content -LiteralPath $file -Raw -Encoding UTF8
    $lines = $raw -split "`n"

    # Process void inserts first (sorted by line asc, column desc)
    $voids = $opsByFile[$file] | Where-Object { $_.kind -eq 'void' } | Sort-Object @{Expression={$_.line};Ascending=$true}, @{Expression={$_.column};Ascending=$false}
    foreach ($v in $voids) {
        $li = [int]$v.line - 1
        $col = [int]$v.column - 1
        if ($li -lt 0 -or $li -ge $lines.Count) { Write-Warning "Invalid void location $($v.line):$($v.column)"; continue }
        $line = $lines[$li]
        # Determine insertion column: move left to start of token if column points near '(' or '.'
        if ($col -gt $line.Length) { $col = $line.Length }
        # Skip if already has 'void' before
        $preStart = [Math]::Max(0,$col-6)
        $pre = $line.Substring($preStart, [Math]::Min(6, $line.Length - $preStart))
        if ($pre -match '\bvoid\b') { continue }
        # Find next non-space char after col
        $rest = if ($col -lt $line.Length) { $line.Substring($col) } else { '' }
        $m = $rest -match '^\s*([\<\{])'
        if ($m) { Write-Host "Skipping void at $($v.line): starts with <$ or { - avoid JSX/blocks"; continue }
        # Insert
        $newLine = $line.Substring(0,$col) + 'void ' + $line.Substring($col)
        $lines[$li] = $newLine
        Write-Host "Inserted void at $($v.line):$($v.column)"
    }

    # Process unused vars: attempt to prefix simple declarations or params with '_'
    $unuseds = $opsByFile[$file] | Where-Object { $_.kind -eq 'unused' } | Sort-Object @{Expression={$_.line};Ascending=$true}
    foreach ($u in $unuseds) {
        $li = [int]$u.line - 1
        if ($li -lt 0 -or $li -ge $lines.Count) { Write-Warning "Invalid unused location $($u.line)"; continue }
        $line = $lines[$li]
        # Try match simple declarations: const|let|var <name>
        $decl = [regex]::Match($line, '^\s*(const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\b')
        if ($decl.Success) {
            $name = $decl.Groups[2].Value
            # Skip if already underscored
            if ($name.StartsWith('_')) { continue }
            $newName = '_' + $name
            $idx = $line.IndexOf($name)
            if ($idx -ge 0) {
                $newline = $line.Substring(0,$idx) + $newName + $line.Substring($idx + $name.Length)
            } else {
                $newline = $line
            }
            $lines[$li] = $newline
            Write-Host ("Prefixed variable '{0}' -> '{1}' in {2}:{3}" -f $name, $newName, $file, $u.line)
            continue
        }
        # Try function param list simple replacement (first pass): replace (name[,)] or , name
        $paramPattern = '\(([^)]*)\)'
        $p = [regex]::Match($line, $paramPattern)
        if ($p.Success) {
            $params = $p.Groups[1].Value
            # find single identifier occurrences matching message text (best-effort)
            # extract likely name from ESLint message: "'name' is assigned a value but never used." or "'name' is defined but never used."
            $msg = $u.message
            $nm = ''
            $mname = [regex]::Match($msg, "'([A-Za-z_$][A-Za-z0-9_$]*)'")
            if ($mname.Success) { $nm = $mname.Groups[1].Value }
            if ($nm -and $params -match ('\b' + [regex]::Escape($nm) + '\b')) {
                if ($nm.StartsWith('_')) { continue }
                $newParams = $params -replace ('\b' + [regex]::Escape($nm) + '\b'), ('_' + $nm)
                $lines[$li] = $line.Substring(0,$p.Index) + '(' + $newParams + ')' + $line.Substring($p.Index + $p.Length)
                Write-Host ("Prefixed param '{0}' -> '_{0}' in {1}:{2}" -f $nm, $file, $u.line)
                continue
            }
        }
        # Otherwise, try to prefix simple identifier usage in assignment like "name = ...;" but skip complex patterns
    }

    # Write back file
    ($lines -join "`n") | Set-Content -LiteralPath $file -Encoding UTF8
}

Write-Host "Auto-fix pass complete. Next: revert any voids before JSX/blocks, then run eslint --fix and aggregate." 
