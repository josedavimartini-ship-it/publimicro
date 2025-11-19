<#
Apply suggested repair updates to property_photos via PostgREST.

Usage examples:
# Dry-run (shows what would run):
pwsh ./tmp/apply-repair-updates.ps1 -DryRun

# Test a single id (reads suggestions file) using env var SUPABASE_SERVICE_ROLE_KEY:
$env:SUPABASE_SERVICE_ROLE_KEY = '<SERVICE_ROLE_KEY>'
pwsh ./tmp/apply-repair-updates.ps1 -TestOnly

# Test a specific id:
pwsh ./tmp/apply-repair-updates.ps1 -TestOnly -TestId '1385b2e9-f84c-4088-877a-62f3b5ba5355' -ServiceRoleKey '<SERVICE_ROLE_KEY>'

# Apply all updates (will PATCH each suggested update):
pwsh ./tmp/apply-repair-updates.ps1 -ApplyAll -ServiceRoleKey '<SERVICE_ROLE_KEY>'

Outputs:
- tmp/repair-applied-results.json : array of {id, suggested_url, statusCode, response}
- tmp/repair-applied-log.sql : applied SQL UPDATE lines
#>

param(
    [string]$ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY,
    [switch]$TestOnly,
    [string]$TestId,
    [switch]$ApplyAll,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $basePath

$repoRoot = Resolve-Path (Join-Path $basePath "..")
$found = Get-ChildItem -Path $repoRoot -Filter 'repair-suggested-updates.json' -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $found) {
    Write-Error "Suggestions file 'repair-suggested-updates.json' not found under repo root $repoRoot"
    exit 2
}
$suggestionsPath = $found.FullName
$suggestions = Get-Content $suggestionsPath -Raw | ConvertFrom-Json
$candidates = $suggestions | Where-Object { $_.suggested_url -ne $null }
if (-not $candidates -or $candidates.Count -eq 0) {
    Write-Output "No suggested updates to apply."
    Pop-Location
    exit 0
}

$restBase = 'https://irrzpwzyqcubhhjeuakc.supabase.co/rest/v1/property_photos'

if ($DryRun) {
    Write-Output "Dry run: would PATCH the following (id -> suggested_url):"
    foreach ($c in $candidates) { Write-Output " - $($c.id) -> $($c.suggested_url)" }
    Pop-Location
    exit 0
}

if (-not $ServiceRoleKey) {
    Write-Error "No service role key provided. Set the SUPABASE_SERVICE_ROLE_KEY env var or pass -ServiceRoleKey '<key>'"
    Pop-Location
    exit 3
}

function Patch-Row($id, $newUrl) {
    $uri = "$($restBase)?id=eq.$id"
    $headers = @{
        apikey = $ServiceRoleKey
        Authorization = "Bearer $ServiceRoleKey"
        Prefer = 'return=representation'
        'Content-Type' = 'application/json'
    }
    $body = @(@{ url = $newUrl }) | ConvertTo-Json -Depth 5
    try {
        $res = Invoke-RestMethod -Method Patch -Uri $uri -Headers $headers -Body $body -ErrorAction Stop
        return @{ id = $id; suggested_url = $newUrl; statusCode = 200; response = $res }
    } catch {
        $err = $_.Exception.Message
        return @{ id = $id; suggested_url = $newUrl; statusCode = 'error'; response = $err }
    }
}

# If TestOnly: pick TestId or first candidate and run one PATCH
if ($TestOnly) {
    $target = $null
    if ($TestId) { $target = $candidates | Where-Object { $_.id -eq $TestId } }
    if (-not $target) { $target = $candidates | Select-Object -First 1 }
    if (-not $target) { Write-Error "No target found for test."; Pop-Location; exit 4 }

    Write-Output "Testing single PATCH for id $($target.id) -> $($target.suggested_url)"
    $result = Patch-Row $target.id $target.suggested_url
    $outPath = Join-Path $basePath 'tmp/repair-applied-results.json'
    $result | ConvertTo-Json -Depth 5 | Out-File -FilePath $outPath -Encoding utf8
    Write-Output "Wrote test result to $outPath"
    Pop-Location
    if ($result.statusCode -eq 200) { Write-Output "Test PATCH reported success."; exit 0 } else { Write-Error "Test PATCH failed: $($result.response)"; exit 5 }
}

# ApplyAll
if ($ApplyAll) {
    $results = @()
    $sqlLines = @()
    foreach ($c in $candidates) {
        Write-Output "Patching $($c.id) -> $($c.suggested_url)"
        $r = Patch-Row $c.id $c.suggested_url
        $results += $r
        if ($r.statusCode -eq 200) {
            $escaped = $c.suggested_url -replace "'","''"
            $sqlLines += "UPDATE property_photos SET url = '$escaped' WHERE id = '$($c.id)';"
        } else {
            $sqlLines += "-- FAILED to apply for id $($c.id) ; error: $($r.response)"
        }
    }
    $outPath = Join-Path $basePath 'tmp/repair-applied-results.json'
    $results | ConvertTo-Json -Depth 8 | Out-File -FilePath $outPath -Encoding utf8
    $sqlOut = Join-Path $basePath 'tmp/repair-applied-log.sql'
    $sqlLines | Out-File -FilePath $sqlOut -Encoding utf8
    Write-Output "Applied updates; wrote results to $outPath and SQL log to $sqlOut"
    Pop-Location
    exit 0
}

Write-Output "No action specified. Use -TestOnly or -ApplyAll. Use -DryRun to preview."
Pop-Location
