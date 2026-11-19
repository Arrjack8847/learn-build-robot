# Upload only the verified Level 1 First Robot Model English cover PDF.
# Existing public filename is preserved. No GitHub Actions.
# Run from an authenticated Windows checkout:
# powershell -ExecutionPolicy Bypass -File scripts/pdf/upload_level1_first_robot_cover.ps1
param(
  [string]$PdfPath = ""
)
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$repo = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$target = "public/First Robot Model.pdf"
$originalGitBlob = "73c12dc37b41ed6a78b8786672ef1d19c3b8d781"
$approvedSha256 = "b99048fa06de1c7c70f102cb3b6eceaa26d2a7b1398109bf253b2922ca23bc25"
$url = "https://sb-6djsojuxftdz.vercel.run/level1/cleaned/First%20Robot%20Model.pdf"
$downloaded = $null
Push-Location $repo
try {
  if ((& git branch --show-current).Trim() -ne "main") {
    throw "Switch to main before running this uploader."
  }
  if (@(& git status --porcelain).Count -ne 0) {
    throw "Working tree must be clean."
  }
  & git fetch --quiet origin main
  if ($LASTEXITCODE -ne 0) { throw "Could not fetch origin/main." }
  if ((& git rev-parse HEAD).Trim() -ne (& git rev-parse origin/main).Trim()) {
    throw "Local main must be at the current origin/main HEAD."
  }
  if ((& git hash-object -- $target).Trim() -ne $originalGitBlob) {
    throw "Original PDF differs from the expected source. Refusing to overwrite."
  }

  if ([string]::IsNullOrWhiteSpace($PdfPath)) {
    $downloaded = Join-Path ([IO.Path]::GetTempPath()) ("first-robot-english-" + [Guid]::NewGuid().ToString("N") + ".pdf")
    Invoke-WebRequest -Uri $url -OutFile $downloaded -UseBasicParsing
    $source = $downloaded
  } else {
    $source = (Resolve-Path -LiteralPath $PdfPath).Path
  }
  if ((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant() -ne $approvedSha256) {
    throw "Replacement PDF SHA256 mismatch. The original file is unchanged."
  }
  $prefix = [System.IO.File]::ReadAllBytes($source)[0..4]
  if ([Text.Encoding]::ASCII.GetString($prefix) -ne "%PDF-") {
    throw "Replacement file is not a valid PDF header."
  }

  Copy-Item -LiteralPath $source -Destination (Join-Path $repo $target) -Force
  & git add -- $target
  if ($LASTEXITCODE -ne 0) { throw "Could not stage the verified PDF." }
  $staged = @(& git diff --cached --name-only)
  if ($staged.Count -ne 1 -or $staged[0] -ne $target) {
    throw "Unexpected staged files: $($staged -join ', ')"
  }
  & git -c core.hooksPath=NUL commit -m "fix(level1-building): upload verified First Robot Model English cover [skip ci]"
  if ($LASTEXITCODE -ne 0) { throw "Commit failed." }
  & git push origin main
  if ($LASTEXITCODE -ne 0) { throw "Push failed; local commit was retained." }
  Write-Host "SUCCESS: First Robot Model.pdf uploaded to main." -ForegroundColor Green
} finally {
  Pop-Location
  if ($downloaded -and (Test-Path -LiteralPath $downloaded)) {
    Remove-Item -LiteralPath $downloaded -Force
  }
}
