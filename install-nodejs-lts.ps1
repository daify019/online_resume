$ErrorActionPreference = 'Stop'

$installDir = 'D:\Download\nodejs-lts'
$downloadDir = 'D:\Download'
$indexUrl = 'https://nodejs.org/dist/index.json'

Write-Host "Resolving latest Node.js LTS release..."
$releases = Invoke-RestMethod -Uri $indexUrl
$release = $releases |
  Where-Object { $_.lts -and ($_.files -contains 'win-x64-zip') } |
  Select-Object -First 1

if (-not $release) {
  throw 'Could not find a Node.js LTS Windows x64 release from nodejs.org.'
}

$version = $release.version
$archiveName = "node-$version-win-x64.zip"
$url = "https://nodejs.org/dist/$version/$archiveName"
$zipPath = Join-Path $downloadDir $archiveName
$tmpDir = Join-Path $downloadDir "node-$version-win-x64-extract"

$downloadRoot = [System.IO.Path]::GetFullPath($downloadDir)
$tmpFull = [System.IO.Path]::GetFullPath($tmpDir)
$installFull = [System.IO.Path]::GetFullPath($installDir)

if (-not $tmpFull.StartsWith($downloadRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Unsafe temp path: $tmpFull"
}

if (-not $installFull.StartsWith($downloadRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Unsafe install path: $installFull"
}

New-Item -ItemType Directory -Force -Path $downloadDir | Out-Null
New-Item -ItemType Directory -Force -Path $installDir | Out-Null

if (-not (Test-Path -LiteralPath $zipPath)) {
  Write-Host "Downloading $url..."
  Invoke-WebRequest -Uri $url -OutFile $zipPath
}

if (Test-Path -LiteralPath $tmpDir) {
  Remove-Item -LiteralPath $tmpDir -Recurse -Force
}

Write-Host "Extracting $archiveName..."
Expand-Archive -LiteralPath $zipPath -DestinationPath $tmpDir -Force

$extracted = Join-Path $tmpDir "node-$version-win-x64"
if (-not (Test-Path -LiteralPath $extracted)) {
  throw "Archive did not contain expected folder: $extracted"
}

Get-ChildItem -LiteralPath $extracted -Force |
  Copy-Item -Destination $installDir -Recurse -Force
Remove-Item -LiteralPath $tmpDir -Recurse -Force

$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$parts = @($userPath -split ';' | Where-Object { $_ -and $_.Trim() })
if ($parts -notcontains $installDir) {
  [Environment]::SetEnvironmentVariable('Path', (($parts + $installDir) -join ';'), 'User')
  Write-Host "Added $installDir to the current user PATH."
}

$env:Path = "$installDir;$env:Path"
$nodeVersion = & (Join-Path $installDir 'node.exe') -v
$npmVersion = & (Join-Path $installDir 'npm.cmd') -v

Write-Host "Installed to: $installDir"
Write-Host "node: $nodeVersion"
Write-Host "npm:  $npmVersion"
Write-Host 'Open a new terminal to use node and npm from PATH.'
