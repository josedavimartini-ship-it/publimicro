$turboTemp = Join-Path $env:TEMP 'turbod'
if (-not (Test-Path $turboTemp)) { Write-Output "No turbod folder: $turboTemp"; exit 0 }

Get-ChildItem -Path $turboTemp -Filter 'turbod.pid' -File -Recurse -ErrorAction SilentlyContinue |
ForEach-Object {
  $pidFile = $_.FullName
  try {
    $filePid = [int](Get-Content $pidFile -ErrorAction Stop)
  } catch {
    Write-Output "Unreadable PID file: $pidFile — removing folder"
    Remove-Item -LiteralPath $_.DirectoryName -Recurse -Force -ErrorAction SilentlyContinue
    return
  }

  $proc = Get-Process -Id $filePid -ErrorAction SilentlyContinue
  if ($null -eq $proc) {
    Write-Output "No process $filePid — removing $($_.DirectoryName)"
    Remove-Item -LiteralPath $_.DirectoryName -Recurse -Force -ErrorAction SilentlyContinue
    continue
  }

  $c = (Get-CimInstance Win32_Process -Filter "ProcessId = $filePid" -ErrorAction SilentlyContinue).CommandLine
  if ($c -and $c -match 'turbod|turbo') {
    Write-Output "Active turbod (PID $filePid) detected — keeping $($_.DirectoryName)"
  } else {
    Write-Output "Process $filePid is not turbod — removing $($_.DirectoryName)"
    Remove-Item -LiteralPath $_.DirectoryName -Recurse -Force -ErrorAction SilentlyContinue
  }
}
