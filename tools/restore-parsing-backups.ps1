# Restore files reporting parsing errors from backups found in %TEMP%
$summaryPath = "tools/lint-summary/apps-publimicro.json"
if (!(Test-Path $summaryPath)) { Write-Error "Summary not found: $summaryPath"; exit 2 }
$json = Get-Content -Raw $summaryPath | ConvertFrom-Json
$filesWithParsing = @()
foreach ($f in $json) {
  if ($null -ne $f.messages) {
    foreach ($m in $f.messages) {
      if ($m.message -and $m.message -match "Parsing error") { $filesWithParsing += $f.filePath; break }
    }
  }
}
$filesWithParsing = $filesWithParsing | Sort-Object -Unique
Write-Output "Found $($filesWithParsing.Count) files with Parsing errors."
foreach ($file in $filesWithParsing) {
  $basename = [System.IO.Path]::GetFileName($file)
  Write-Output "\nProcessing: $file"
  $candidates = @()
  try {
    $candidates = Get-ChildItem -Path $env:TEMP -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "*$basename*.bak" }
  } catch {
    Write-Warning "Error searching %TEMP%: $_"
  }
  if ($candidates.Count -gt 0) {
    $chosen = $candidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    # make pre-restore backup if current file exists
    if (Test-Path $file) {
      $pre = "$file.pre-restore.bak"
      Copy-Item -Path $file -Destination $pre -Force
      Write-Output "Saved current file to: $pre"
    } else {
      $parent = Split-Path $file -Parent
      if (!(Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    }
    Copy-Item -Path $chosen.FullName -Destination $file -Force
    Write-Output "Restored $file from backup: $($chosen.Name)"
  } else {
    Write-Warning "No backup found in %TEMP% for: $basename"
  }
}
Write-Output "Restore script complete." 
