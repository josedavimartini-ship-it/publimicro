# Script para instalar Stripe CLI no Windows
Write-Host "Baixando Stripe CLI..." -ForegroundColor Cyan

$downloadUrl = "https://github.com/stripe/stripe-cli/releases/latest/download/stripe_latest_windows_x86_64.zip"
$zipFile = "$env:TEMP\stripe-cli.zip"
$extractPath = "$env:LOCALAPPDATA\stripe"

# Criar diretorio
if (!(Test-Path $extractPath)) {
    New-Item -ItemType Directory -Path $extractPath | Out-Null
}

# Baixar
Write-Host "Baixando..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile

# Extrair
Write-Host "Extraindo..." -ForegroundColor Yellow
Expand-Archive -Path $zipFile -DestinationPath $extractPath -Force

# Adicionar ao PATH
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$extractPath*") {
    Write-Host "Adicionando ao PATH..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$extractPath", "User")
    $env:Path = "$env:Path;$extractPath"
}

# Limpar
Remove-Item $zipFile -Force

Write-Host ""
Write-Host "SUCESSO! Stripe CLI instalado!" -ForegroundColor Green
Write-Host ""
Write-Host "Execute agora:" -ForegroundColor Yellow
Write-Host "  stripe login" -ForegroundColor White
Write-Host ""
