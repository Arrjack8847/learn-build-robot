# BE STEM READY: deliver 18 Level 1 interior English cleanups + the First Robot Model cover.
# Checks original Git blob SHA and approved replacement SHA256 for all 19 Building PDFs.
# Does not modify Learning PDFs. No GitHub Actions.
# Run in Windows PowerShell:
# powershell -ExecutionPolicy Bypass -File scripts/pdf/upload_level1_19_english_building_pdfs.ps1
param([string]$Archive = "")
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$root = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$url = "https://sb-6djsojuxftdz.vercel.run/level1/level1-english-building-19-20261119.zip"
$packageSha256 = "9baa6c80bb78115e17b1e0631ad4c69f7c93ea058916776a369da8912d51b266"
$stage = Join-Path ([IO.Path]::GetTempPath()) ("bsr-level1-english-" + [guid]::NewGuid().ToString("N"))
$tempArchive = $null
Push-Location $root
try {
  if ((& git branch --show-current).Trim() -ne "main") {
    throw "Use main branch; no files modified."
  }
  if (@(& git status --porcelain).Count -ne 0) {
    throw "Working tree is not clean. No files modified."
  }
  & git fetch --quiet origin main
  if ($LASTEXITCODE -ne 0) { throw "Cannot fetch main." }
  if ((& git rev-parse HEAD).Trim() -ne (& git rev-parse origin/main).Trim()) {
    throw "Local main differs from origin/main. Update the local branch before running."
  }

  if ([string]::IsNullOrWhiteSpace($Archive)) {
    $tempArchive = Join-Path ([IO.Path]::GetTempPath()) ("bsr-level1-english-" + [guid]::NewGuid().ToString("N") + ".zip")
    Invoke-WebRequest -Uri $url -OutFile $tempArchive -UseBasicParsing
    $archivePath = $tempArchive
  } else {
    $archivePath = (Resolve-Path -LiteralPath $Archive).Path
  }
  $sha = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($sha -ne $packageSha256) { throw "The ZIP checksum does not match the approved replacement package." }

  Expand-Archive -LiteralPath $archivePath -DestinationPath $stage -Force
  $manifestFile = Join-Path $stage "manifest.json"
  if (-not (Test-Path -LiteralPath $manifestFile)) { throw "Missing verification manifest." }
  $manifest = Get-Content -LiteralPath $manifestFile -Raw | ConvertFrom-Json
  $items = @($manifest.files)
  if ([int]$manifest.pdf_count -ne 19 -or $items.Count -ne 19) {
    throw "Expected precisely 19 Building PDF replacements."
  }
  if (@($items | Where-Object { $_.type -eq "interior" }).Count -ne 18) {
    throw "Expected precisely 18 interior-cleaned PDFs."
  }
  if (@($items | Where-Object { $_.type -eq "cover" -and $_.path -eq "public/First Robot Model.pdf" }).Count -ne 1) {
    throw "Expected one First Robot Model cover."
  }
  $paths = @($items | ForEach-Object { [string]$_.path })
  if (@($paths | Sort-Object -Unique).Count -ne 19) { throw "Duplicate PDF path in package." }

  # Validate all originals and replacements before modifying any repository files.
  foreach ($item in $items) {
    $path = [string]$item.path
    if ($path -notmatch '^public/[^\\/]+[.]pdf$' -or $path.Contains("..")) {
      throw "Unexpected target path: $path"
    }
    $old = Join-Path $root $path
    $repaired = Join-Path $stage $path
    if (-not (Test-Path -LiteralPath $old) -or -not (Test-Path -LiteralPath $repaired)) {
      throw "Missing original or replacement: $path"
    }
    $gitHash = (& git hash-object -- $path).Trim()
    if ($LASTEXITCODE -ne 0 -or $gitHash -ne [string]$item.original_git_blob_sha) {
      throw "Source PDF was changed unexpectedly; refusing overwrite: $path"
    }
    $replacementHash = (Get-FileHash -LiteralPath $repaired -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($replacementHash -ne [string]$item.sha256) {
      throw "Replacement checksum mismatch: $path"
    }
    if ((Get-Item -LiteralPath $repaired).Length -ne [long]$item.bytes) {
      throw "Replacement size mismatch: $path"
    }
  }

  foreach ($item in $items) {
    $path = [string]$item.path
    Copy-Item -LiteralPath (Join-Path $stage $path) -Destination (Join-Path $root $path) -Force
    & git add -- $path
    if ($LASTEXITCODE -ne 0) { throw "Could not stage $path" }
  }
  $staged = @(& git diff --cached --name-only)
  if ($staged.Count -ne 19 -or @($staged | Where-Object { $_ -notin $paths }).Count -ne 0) {
    throw "Unexpected staged files: $($staged -join ', '). No commit was created."
  }
  & git commit -m "fix(level1-building): replace interior Chinese and English cover in 19 PDFs [skip ci]"
  if ($LASTEXITCODE -ne 0) { throw "Git commit failed." }
  & git push origin main
  if ($LASTEXITCODE -ne 0) {
    throw "Git push failed. The verified PDF commit is retained locally."
  }
  Write-Host "SUCCESS: 19 verified Level 1 Building PDFs pushed to main; 34 interior pages cleaned." -ForegroundColor Green
} finally {
  Pop-Location
  if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Force -Recurse }
  if ($tempArchive -and (Test-Path -LiteralPath $tempArchive)) {
    Remove-Item -LiteralPath $tempArchive -Force
  }
}
