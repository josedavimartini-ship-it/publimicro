# PWA Icon Generation Script
# This script creates placeholder PWA icons for the manifest.json

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
$iconsDir = "apps\publimicro\public\icons"

# Create icons directory if it doesn't exist
if (!(Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
    Write-Host "Created icons directory: $iconsDir" -ForegroundColor Green
}

Write-Host "`n🎨 PWA Icon Generation" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# SVG template for PubliMicro logo (placeholder)
$svgTemplate = @"
<svg width="SIZE" height="SIZE" xmlns="http://www.w3.org/2000/svg">
  <rect width="SIZE" height="SIZE" fill="#0a0a0a"/>
  <circle cx="HALF" cy="HALF" r="RADIUS" fill="#FF6B35"/>
  <text x="50%" y="55%" text-anchor="middle" fill="#0a0a0a" font-family="Arial, sans-serif" font-size="FONTSIZE" font-weight="bold">PM</text>
</svg>
"@

foreach ($size in $sizes) {
    $filename = "icon-${size}x${size}.png"
    $filepath = Join-Path $iconsDir $filename
    $half = $size / 2
    $radius = $size * 0.4
    $fontSize = $size * 0.3
    
    # Replace placeholders in SVG
    $svg = $svgTemplate -replace "SIZE", $size
    $svg = $svg -replace "HALF", $half
    $svg = $svg -replace "RADIUS", $radius
    $svg = $svg -replace "FONTSIZE", $fontSize
    
    # Save SVG file (temporary - can be converted to PNG manually or with tools)
    $svgPath = Join-Path $iconsDir "icon-${size}x${size}.svg"
    $svg | Out-File -FilePath $svgPath -Encoding UTF8
    
    Write-Host "✅ Generated: $filename (as SVG)" -ForegroundColor Green
}

Write-Host "`n📝 Note: SVG files generated. For production, convert to PNG using:" -ForegroundColor Yellow
Write-Host "   - Online tools: convertio.co, cloudconvert.com" -ForegroundColor Gray
Write-Host "   - ImageMagick: convert icon.svg icon.png" -ForegroundColor Gray
Write-Host "   - Inkscape: inkscape -w 512 -h 512 icon.svg -o icon.png" -ForegroundColor Gray

Write-Host "`n✅ All PWA icon placeholders created successfully!" -ForegroundColor Green
Write-Host "📁 Location: $iconsDir`n" -ForegroundColor Cyan
