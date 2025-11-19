# Generate repair suggestions from verify-uploads.results.json
# Writes: tmp/repair-suggested-updates.json and tmp/repair-suggested-updates.sql and tmp/repair-suggested-updates-curl.txt

Param(
    [string]$VerifyFile = "verify-uploads.results.json"
)

Set-StrictMode -Version Latest
$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $basePath

if (-not (Test-Path $VerifyFile)) {
    Write-Error "File $VerifyFile not found in $PWD"
    exit 2
}

$json = Get-Content $VerifyFile -Raw | ConvertFrom-Json
$successes = $json | Where-Object { $_.status -eq 200 }
$errors = $json | Where-Object { $_.status -ne 200 }

function Get-BasenameFromUrl($url) {
    try {
        $u = [System.Uri]$url
        $path = $u.AbsolutePath.TrimStart('/')
        $unescaped = [System.Uri]::UnescapeDataString($path)
        $parts = $unescaped -split '/'
        return $parts[-1]
    } catch {
        # fallback: try to decode raw string
        $unescaped = [System.Uri]::UnescapeDataString($url)
        $parts = $unescaped -split '/'
        return $parts[-1]
    }
}

# Build candidate maps
$candidatesByBasename = @{}
$candidatesByStripped = @{}

foreach ($s in $successes) {
    $url = $s.url
    $bn = Get-BasenameFromUrl $url
    if (-not $bn) { continue }
    if (-not $candidatesByBasename.ContainsKey($bn)) { $candidatesByBasename[$bn] = @() }
    $candidatesByBasename[$bn] += $url

    $stripped = $bn -replace '^[0-9]{6,}-','' # remove long numeric prefix + dash
    if (-not $candidatesByStripped.ContainsKey($stripped)) { $candidatesByStripped[$stripped] = @() }
    $candidatesByStripped[$stripped] += $url
}

$suggestions = @()

foreach ($e in $errors) {
    $oid = $e.id
    $origUrl = $e.url
    $bn = Get-BasenameFromUrl $origUrl
    $strippedErr = $bn -replace '^[0-9]{6,}-',''

    $found = $null
    $reason = $null

    # 1) exact basename match
    if ($candidatesByBasename.ContainsKey($bn)) {
        $found = $candidatesByBasename[$bn][0]
        $reason = "Exact basename match"
    }

    # 2) match by stripped name (candidate had numeric prefix)
    if (-not $found -and $candidatesByStripped.ContainsKey($bn)) {
        $found = $candidatesByStripped[$bn][0]
        $reason = "Candidate object had numeric prefix with same final basename"
    }

    # 3) candidate where stripped equals strippedErr (i.e., error missing prefix but candidate has prefix)
    if (-not $found -and $candidatesByStripped.ContainsKey($strippedErr)) {
        $found = $candidatesByStripped[$strippedErr][0]
        $reason = "Candidate object had numeric prefix matching stripped error basename"
    }

    # 4) look for encoded variants where path includes the same filename in a different folder (encoded slashes)
    if (-not $found) {
        foreach ($k in $candidatesByBasename.Keys) {
            if ($k -like "*${bn}") {
                $found = $candidatesByBasename[$k][0]
                $reason = "Candidate basename contains error basename (folder/encoded variants)"
                break
            }
        }
    }

    if ($found) {
        $suggestions += [PSCustomObject]@{
            id = $oid
            original_url = $origUrl
            suggested_url = $found
            reason = $reason
        }
    } else {
        $suggestions += [PSCustomObject]@{
            id = $oid
            original_url = $origUrl
            suggested_url = $null
            reason = 'No candidate found'
        }
    }
}

# Write JSON output
$outJsonPath = Join-Path $basePath "tmp/repair-suggested-updates.json"
$outSqlPath = Join-Path $basePath "tmp/repair-suggested-updates.sql"
$outCurlPath = Join-Path $basePath "tmp/repair-suggested-updates-curl.txt"

# Ensure tmp exists
$dir = Join-Path $basePath 'tmp'
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

$suggestions | ConvertTo-Json -Depth 5 | Out-File -FilePath $outJsonPath -Encoding utf8

# Build SQL and curl examples
$sqlLines = @()
$curlLines = @()
$baseRest = 'https://irrzpwzyqcubhhjeuakc.supabase.co/rest/v1/property_photos'

foreach ($s in $suggestions) {
    if ($s.suggested_url) {
        $escaped = $s.suggested_url -replace "'","''"
        $sqlLines += "UPDATE property_photos SET url = '$escaped' WHERE id = '$($s.id)';"

        $curlLines += "# PATCH example for id $($s.id)"
        $patchBody = "[{`"url`": `"$($s.suggested_url)`"}]"
        $curlLine = "curl -X PATCH `"$($baseRest)?id=eq.$($s.id)`" -H 'apikey: <SERVICE_ROLE_KEY>' -H 'Authorization: Bearer <SERVICE_ROLE_KEY>' -H 'Content-Type: application/json' -H 'Prefer: return=representation' -d '$patchBody'"
        $curlLines += $curlLine
        $curlLines += ""
    } else {
        $sqlLines += "-- No candidate for id $($s.id) ; original URL: $($s.original_url)"
        $curlLines += "-- No candidate for id $($s.id)"
    }
}

$sqlLines | Out-File -FilePath $outSqlPath -Encoding utf8
$curlLines | Out-File -FilePath $outCurlPath -Encoding utf8

Write-Output "Wrote $($suggestions.Count) suggestion(s) to:`n - $outJsonPath`n - $outSqlPath`n - $outCurlPath"

Pop-Location
