$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

function New-IconPng {
  param([string]$Path, [int]$Size)

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "AntiAlias"

  $rect = New-Object Drawing.Rectangle 0, 0, $Size, $Size
  $brush = New-Object Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [Drawing.Color]::FromArgb(255, 245, 245, 247),
    [Drawing.Color]::FromArgb(255, 200, 210, 230),
    45
  )
  $g.FillRectangle($brush, $rect)
  $brush.Dispose()

  $cx = $Size / 2
  $cy = $Size * 0.42
  $faceR = [Math]::Max(8, $Size * 0.16)

  $faceBrush = New-Object Drawing.SolidBrush ([Drawing.Color]::FromArgb(255, 120, 82, 64))
  $g.FillEllipse($faceBrush, $cx - $faceR, $cy - $faceR, $faceR * 2, $faceR * 2)

  $hair = New-Object Drawing.SolidBrush ([Drawing.Color]::FromArgb(255, 42, 28, 22))
  for ($i = 0; $i -lt 14; $i++) {
    $angle = $i * 25.7 * [Math]::PI / 180
    $hx = $cx + [Math]::Cos($angle) * ($faceR * 0.85) - $faceR * 0.4
    $hy = $cy - $faceR * 0.45 + [Math]::Sin($angle) * ($faceR * 0.65) - $faceR * 0.4
    $g.FillEllipse($hair, [float]$hx, [float]$hy, [float]($faceR * 0.95), [float]($faceR * 0.95))
  }

  $g.Dispose()
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$root = Split-Path -Parent $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
$dir = Join-Path $root "public\icons"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

New-IconPng -Path (Join-Path $dir "icon-192.png") -Size 192
New-IconPng -Path (Join-Path $dir "icon-512.png") -Size 512
New-IconPng -Path (Join-Path $dir "apple-touch-icon.png") -Size 180
Copy-Item (Join-Path $dir "icon-512.png") (Join-Path $dir "icon-maskable-512.png") -Force

Write-Host "Icons written to $dir"
