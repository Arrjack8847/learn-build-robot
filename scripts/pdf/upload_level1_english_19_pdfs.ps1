# BE STEM READY — deliver 19 validated Level 1 English Building PDFs to main.
# Includes 18 interior cleanups (34 interior pages) and First Robot Model cover fix.
# No Learning PDFs; GitHub Actions skipped via [skip ci].
# Run from an authenticated, clean Windows Git checkout of this repository:
# powershell -ExecutionPolicy Bypass -File scripts/pdf/upload_level1_english_19_pdfs.ps1
# Or supply a downloaded archive to avoid the temporary sandbox URL:
# powershell -ExecutionPolicy Bypass -File scripts/pdf/upload_level1_english_19_pdfs.ps1 -Archive "C:\Downloads\level1-building-english-all19-20261119.zip"
param([string]$Archive = "")
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$temp = Join-Path ([IO.Path]::GetTempPath()) ("bsr-l1-english-" + [guid]::NewGuid().ToString('N'))
$download = $null
$releaseUrl = 'https://sb-6djsojuxftdz.vercel.run/level1/level1-building-english-all19-20261119.zip'

function Invoke-Git {
  param([string[]]$Arguments)
  $result = @(& git @Arguments)
  if ($LASTEXITCODE -ne 0) { throw ("Git command failed: git " + ($Arguments -join ' ')) }
  return $result
}

Push-Location $repo
try {
  $branch = (Invoke-Git -Arguments @('branch','--show-current') | Out-String).Trim()
  if ($branch -ne 'main') { throw "Checkout main before uploading. Current: $branch" }
  if (@(Invoke-Git -Arguments @('status','--porcelain')).Count -ne 0) {
    throw 'Working tree must be clean before the upload.'
  }
  Invoke-Git -Arguments @('fetch','--quiet','origin','main') | Out-Null
  $localHead = (Invoke-Git -Arguments @('rev-parse','HEAD') | Out-String).Trim()
  $remoteHead = (Invoke-Git -Arguments @('rev-parse','origin/main') | Out-String).Trim()
  if ($localHead -ne $remoteHead) { throw 'Local main is not at origin/main. Pull first.' }

  if ([string]::IsNullOrWhiteSpace($Archive)) {
    $download = Join-Path ([IO.Path]::GetTempPath()) ("bsr-l1-english-" + [guid]::NewGuid().ToString('N') + '.zip')
    Invoke-WebRequest -Uri $releaseUrl -OutFile $download -UseBasicParsing
    $archivePath = $download
  } else {
    $archivePath = (Resolve-Path -LiteralPath $Archive).Path
  }
  Expand-Archive -LiteralPath $archivePath -DestinationPath $temp -Force
  $manifestPath = Join-Path $temp 'manifest.json'
  if (-not (Test-Path -LiteralPath $manifestPath)) { throw 'Archive has no verification manifest.' }
  $manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
  $files = @($manifest.files)
  if ($manifest.total_repaired_pdfs -ne 19 -or $manifest.interior_repaired_pdfs -ne 18 -or
      $manifest.interior_pages -ne 34 -or $manifest.cover_repaired_pdfs -ne 1 -or
      $files.Count -ne 19) {
    throw 'Unexpected file counts in verification manifest.'
  }
  $expected = @($files | ForEach-Object { [string]$_.path })
  if (@($expected | Sort-Object -Unique).Count -ne 19) { throw 'Duplicate destination path.' }

  # Fail closed: validate every source and every replacement BEFORE modifying the repository.
  foreach ($entry in $files) {
    $relative = [string]$entry.path
    if ($relative -notmatch '^public/[^\\/]+[.]pdf$' -or $relative.Contains('..')) {
      throw "Unsafe archive path: $relative"
    }
    $sourcePath = Join-Path $temp $relative
    $repoPath = Join-Path $repo $relative
    if (-not (Test-Path -LiteralPath $sourcePath) -or -not (Test-Path -LiteralPath $repoPath)) {
      throw "Missing Building PDF: $relative"
    }
    $actualOriginalSha = (Invoke-Git -Arguments @('hash-object','--',$relative) | Out-String).Trim()
    if ($actualOriginalSha -ne [string]$entry.source_blob_sha) {
      throw "Original PDF changed since verification: $relative"
    }
    $actualReplacementSha = (Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actualReplacementSha -ne [string]$entry.sha256) {
      throw "Replacement checksum does not match: $relative"
    }
    if ((Get-Item -LiteralPath $sourcePath).Length -ne [long]$entry.bytes) {
      throw "Replacement size does not match: $relative"
    }
  }

  foreach ($entry in $files) {
    $relative = [string]$entry.path
    Copy-Item -LiteralPath (Join-Path $temp $relative) -Destination (Join-Path $repo $relative) -Force
    Invoke-Git -Arguments @('add','--',$relative) | Out-Null
  }
  $staged = @(Invoke-Git -Arguments @('diff','--cached','--name-only','--diff-filter=M'))
  if ($staged.Count -ne 19 -or @($staged | Where-Object { $_ -notin $expected }).Count -ne 0) {
    throw ("Unexpected staged files; no commit created: " + ($staged -join ', '))
  }
  Invoke-Git -Arguments @('commit','-m','fix(level1-building): replace verified Chinese cover and interior text in 19 PDFs [skip ci]') | Out-Null
  Invoke-Git -Arguments @('push','origin','main') | Out-Null
  Write-Host 'SUCCESS: 19 Level 1 English Building PDFs pushed to main.' -ForegroundColor Green
} finally {
  Pop-Location
  if (Test-Path -LiteralPath $temp) { Remove-Item -LiteralPath $temp -Recurse -Force }
  if ($download -and (Test-Path -LiteralPath $download)) { Remove-Item -LiteralPath $download -Force }
}
