# BE STEM READY — Commit the 77 verified English Building PDFs (Levels 1-4) to GitHub main.
# Source is the new Wix Media Manager files; no temporary Vercel sandbox URLs.
# All originals and downloaded PDF bytes are checked against approved Git blob SHA-1s.
# No GitHub Actions. Uses [skip ci]. Does NOT modify Learning PDFs.
#
# Windows PowerShell, from a local authenticated clone:
#   git switch main
#   git pull --ff-only origin main
#   powershell -ExecutionPolicy Bypass -File scripts/pdf/upload_level1_to_4_english_building_pdfs.ps1
param([switch]$KeepDownloads)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$manifestFile = Join-Path $root 'reports/level1-4-english-building-binary-delivery-manifest-20261119.json'
$staging = Join-Path ([IO.Path]::GetTempPath()) ('bsr-level1-to-4-approved-' + [guid]::NewGuid().ToString('N'))
$completed = $false

function Invoke-CheckedGit {
  param([string[]]$GitArgs)
  $output = @(& git @GitArgs)
  if ($LASTEXITCODE -ne 0) {
    throw ('Git failed: git ' + ($GitArgs -join ' '))
  }
  return $output
}

Push-Location $root
try {
  $branch = (Invoke-CheckedGit -GitArgs @('branch','--show-current') | Out-String).Trim()
  if ($branch -ne 'main') {
    throw "Please switch to main; current branch is $branch."
  }
  $dirty = @(Invoke-CheckedGit -GitArgs @('status','--porcelain'))
  if ($dirty.Count -gt 0) {
    throw 'The working tree is not clean; no PDFs were modified.'
  }
  Invoke-CheckedGit -GitArgs @('fetch','--quiet','origin','main') | Out-Null
  $local = (Invoke-CheckedGit -GitArgs @('rev-parse','HEAD') | Out-String).Trim()
  $remote = (Invoke-CheckedGit -GitArgs @('rev-parse','origin/main') | Out-String).Trim()
  if ($local -ne $remote) {
    throw 'Local main differs from origin/main; pull --ff-only before continuing.'
  }

  $manifest = Get-Content -LiteralPath $manifestFile -Raw -Encoding UTF8 | ConvertFrom-Json
  $items = @($manifest.files)
  if ($manifest.distinct_approved_pdf_count -ne 77 -or $items.Count -ne 77) {
    throw 'Manifest must contain exactly 77 approved Building PDFs.'
  }
  $targets = @($items | ForEach-Object { [string]$_.repository_path })
  if (@($targets | Sort-Object -Unique).Count -ne 77) {
    throw 'Duplicate repository target in manifest; refusing upload.'
  }

  # Verify that every original still matches the exact hash used for restoration.
  # IMPORTANT: do this before downloading or replacing anything.
  foreach ($item in $items) {
    $relative = [string]$item.repository_path
    if ($relative -notmatch '^public/.+[.]pdf$' -or $relative.Contains('..') -or
        $relative -match '(^|/)Learning/') {
      throw "Manifest path not allowed: $relative"
    }
    $original = Join-Path $root $relative
    if (-not (Test-Path -LiteralPath $original -PathType Leaf)) {
      throw "Original Building PDF missing: $relative"
    }
    $originalSha = (Invoke-CheckedGit -GitArgs @('hash-object','--',$relative) | Out-String).Trim()
    if ($originalSha -ne [string]$item.original_git_blob_sha) {
      throw "Original source changed; stop and reconcile before overwriting: $relative"
    }
    $url = [string]$item.wix_media_url
    if (-not $url.StartsWith('https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/')) {
      throw "Not an approved BE STEM READY Wix URL: $relative"
    }
  }

  # Fetch every approved PDF and verify exact approved Git blob BEFORE changing the repo.
  New-Item -Path $staging -ItemType Directory -Force | Out-Null
  $index = 0
  foreach ($item in $items) {
    $index++
    $relative = [string]$item.repository_path
    $output = Join-Path $staging $relative
    $folder = Split-Path -Path $output -Parent
    New-Item -Path $folder -ItemType Directory -Force | Out-Null
    Invoke-WebRequest -Uri ([string]$item.wix_media_url) -OutFile $output -UseBasicParsing
    $size = (Get-Item -LiteralPath $output).Length
    if ($size -lt 100) { throw "Downloaded file too small: $relative" }
    $stream = [System.IO.File]::OpenRead($output)
    try {
      $header = New-Object byte[] 5
      if ($stream.Read($header,0,5) -ne 5 -or [Text.Encoding]::ASCII.GetString($header) -ne '%PDF-') {
        throw "Wix did not return a PDF: $relative"
      }
    } finally {
      $stream.Dispose()
    }
    $newSha = (Invoke-CheckedGit -GitArgs @('hash-object','--',$output) | Out-String).Trim()
    if ($newSha -ne [string]$item.approved_english_git_blob_sha) {
      throw "Wix PDF differs from locally approved restoration: $relative; got $newSha"
    }
    Write-Host ("Verified {0}/77: {1}" -f $index,$relative)
  }

  # All 77 downloads and all 77 source hashes must pass before making changes.
  foreach ($item in $items) {
    $relative = [string]$item.repository_path
    Copy-Item -LiteralPath (Join-Path $staging $relative) -Destination (Join-Path $root $relative) -Force
    Invoke-CheckedGit -GitArgs @('add','--',$relative) | Out-Null
  }
  $staged = @(Invoke-CheckedGit -GitArgs @('diff','--cached','--name-only','--diff-filter=M'))
  if ($staged.Count -ne 77 -or @($staged | Where-Object { $_ -notin $targets }).Count -gt 0) {
    throw ('Staged files do not match the 77 approved PDFs: ' + ($staged -join ', '))
  }

  Invoke-CheckedGit -GitArgs @(
    'commit','-m',
    'fix(building): deliver 77 verified English PDF binaries Levels 1-4 [skip ci]'
  ) | Out-Null
  Invoke-CheckedGit -GitArgs @('push','origin','main') | Out-Null
  Invoke-CheckedGit -GitArgs @('fetch','--quiet','origin','main') | Out-Null
  $mainAfter = (Invoke-CheckedGit -GitArgs @('rev-parse','HEAD') | Out-String).Trim()
  $remoteAfter = (Invoke-CheckedGit -GitArgs @('rev-parse','origin/main') | Out-String).Trim()
  if ($mainAfter -ne $remoteAfter) {
    throw 'Remote main differs from committed local main. Inspect the push.'
  }
  $completed = $true
  Write-Host 'SUCCESS: 77 actual English Building PDF binaries verified and pushed to main.' -ForegroundColor Green
} finally {
  Pop-Location
  if ($completed -or -not $KeepDownloads) {
    if (Test-Path -LiteralPath $staging) {
      Remove-Item -LiteralPath $staging -Recurse -Force
    }
  } else {
    Write-Host "Verified downloads retained at $staging" -ForegroundColor Yellow
  }
}
