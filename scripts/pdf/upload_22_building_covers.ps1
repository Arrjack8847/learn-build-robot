# BE STEM READY — upload the 22 verified Building PDF binaries to main.
# NO GitHub Actions. Replaces ONLY verified Building PDFs from the approved archive.
# Usage (Windows PowerShell from the repository root):
# powershell -ExecutionPolicy Bypass -File scripts/pdf/upload_22_building_covers.ps1 -Archive "D:\Downloads\be-stem-ready-building-english-pdfs-22-20261119.zip"
param(
  [string]$Archive
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$temporaryArchive = $null
if ([string]::IsNullOrWhiteSpace($Archive)) {
  # Optional one-command mode; the link is a temporary sandbox release,
  # so save the ZIP locally if you need to run the uploader later.
  $temporaryArchive = Join-Path ([IO.Path]::GetTempPath()) ("bsr-building-22-" + [guid]::NewGuid().ToString('N') + '.zip')
  $deliveryUrl = 'https://sb-6djsojuxftdz.vercel.run/be-stem-ready-building-english-pdfs-22-20261119.zip'
  Invoke-WebRequest -Uri $deliveryUrl -OutFile $temporaryArchive -UseBasicParsing
  $archiveFile = $temporaryArchive
} else {
  $archiveFile = (Resolve-Path $Archive).Path
}
$staging = Join-Path ([IO.Path]::GetTempPath()) ("bsr-building-english-" + [guid]::NewGuid().ToString('N'))
function RunGit([string[]]$gitArgs) {
  $result = & git @gitArgs
  if ($LASTEXITCODE -ne 0) { throw ("git failed: git " + ($gitArgs -join ' ')) }
  return $result
}
Push-Location $root
try {
  $current = (RunGit @('branch', '--show-current') | Out-String).Trim()
  if ($current -ne 'main') { throw "Use main, not $current. No files changed." }
  $dirty = @(RunGit @('status', '--porcelain'))
  if ($dirty.Count -ne 0) { throw 'Working tree is not clean. Commit/stash first. No files changed.' }
  RunGit @('fetch', '--quiet', 'origin', 'main') | Out-Null
  $head = (RunGit @('rev-parse', 'HEAD') | Out-String).Trim()
  $remote = (RunGit @('rev-parse', 'origin/main') | Out-String).Trim()
  if ($head -ne $remote) { throw 'main is not up to date with origin/main. Update first. No files changed.' }

  Expand-Archive -LiteralPath $archiveFile -DestinationPath $staging -Force
  $manifestFile = Join-Path $staging 'manifest.json'
  if (-not (Test-Path -LiteralPath $manifestFile)) { throw 'Archive lacks manifest.json.' }
  $manifest = Get-Content -LiteralPath $manifestFile -Raw | ConvertFrom-Json
  $pdfs = @($manifest.files)
  if ($manifest.file_count -ne 22 -or $pdfs.Count -ne 22) { throw 'Expected exactly 22 repaired PDFs.' }
  $expectedPaths = @($pdfs | ForEach-Object { [string]$_.path })
  if (@($expectedPaths | Sort-Object -Unique).Count -ne 22) { throw 'Duplicate PDF destination.' }
  if (@($pdfs | Where-Object { $_.level -notin @(1,2,3) }).Count -ne 0) {
    throw 'Archive contains non-target levels.'
  }

  # Validate EVERY original and replacement before touching a single repo file.
  foreach ($item in $pdfs) {
    $relative = [string]$item.path
    if ($relative -notmatch '^public/[^\\/]+[.]pdf$' -or $relative.Contains('..')) {
      throw "Unsafe path in archive: $relative"
    }
    $old = Join-Path $root $relative
    $new = Join-Path $staging $relative
    if (-not (Test-Path -LiteralPath $old) -or -not (Test-Path -LiteralPath $new)) {
      throw "Missing source or destination for $relative"
    }
    $actualGitBlob = (RunGit @('hash-object', '--', $relative) | Out-String).Trim()
    if ($actualGitBlob -ne [string]$item.original_blob_sha) {
      throw "Original PDF changed since approval: $relative. No files changed."
    }
    $actualSha256 = (Get-FileHash -LiteralPath $new -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actualSha256 -ne [string]$item.sha256) {
      throw "Damaged or incorrect replacement PDF: $relative. No files changed."
    }
    if ((Get-Item -LiteralPath $new).Length -ne [long]$item.bytes) {
      throw "Wrong file length for $relative. No files changed."
    }
  }

  foreach ($item in $pdfs) {
    $relative = [string]$item.path
    Copy-Item -LiteralPath (Join-Path $staging $relative) -Destination (Join-Path $root $relative) -Force
    RunGit @('add', '--', $relative) | Out-Null
  }
  $staged = @(RunGit @('diff', '--cached', '--name-only', '--diff-filter=M'))
  if ($staged.Count -ne 22 -or @($staged | Where-Object { $_ -notin $expectedPaths }).Count -gt 0) {
    throw ("Staged file mismatch. Inspect git status; no commit created. Got " + ($staged -join ', '))
  }
  RunGit @('commit', '-m', 'fix(building-pdf): deliver 22 verified English cover PDFs Levels 1-3 [skip ci]') | Out-Null
  RunGit @('push', 'origin', 'main') | Out-Null
  Write-Host 'Success: All 22 verified Building PDF binaries are now pushed to main.' -ForegroundColor Green
} finally {
  Pop-Location
  if (Test-Path -LiteralPath $staging) { Remove-Item -LiteralPath $staging -Recurse -Force }
  if ($temporaryArchive -and (Test-Path -LiteralPath $temporaryArchive)) { Remove-Item -LiteralPath $temporaryArchive -Force }
}
