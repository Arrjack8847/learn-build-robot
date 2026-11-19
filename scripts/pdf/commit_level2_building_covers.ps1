# BE STEM READY Level 2 Building cover delivery. Never runs GitHub Actions.
# Execute from the fix/level2-building-english-covers-20261118 branch.
$ErrorActionPreference = 'Stop'
$targetBranch = 'fix/level2-building-english-covers-20261118'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
Push-Location $root
try {
  $branch = (& git branch --show-current).Trim()
  if ($LASTEXITCODE -ne 0 -or $branch -ne $targetBranch) {
    throw "Checkout the $targetBranch branch first. Current branch: $branch"
  }

  $manifestPath = 'reports/level2-building-cover-sources-20261118.json'
  $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
  if ($manifest.files.Count -ne 20) { throw 'Expected exactly 20 Building PDF originals.' }

  # Fail closed before touching any original PDF.
  foreach ($item in $manifest.files) {
    $path = [string]$item.path
    $status = & git status --porcelain -- $path
    if ($LASTEXITCODE -ne 0 -or $status) { throw "PDF has local edits; refusing to overwrite: $path" }
    $sha = (& git hash-object -- $path).Trim()
    if ($LASTEXITCODE -ne 0 -or $sha -ne [string]$item.original_blob_sha) {
      throw "Original PDF hash mismatch: $path. Do not overwrite it."
    }
  }

  $py = if (Get-Command py -ErrorAction SilentlyContinue) { 'py' } elseif (Get-Command python -ErrorAction SilentlyContinue) { 'python' } else { throw 'Install Python first.' }
  & $py -m pip install pymupdf pillow numpy opencv-python-headless
  if ($LASTEXITCODE -ne 0) { throw 'Failed to install Python PDF dependencies.' }

  & $py scripts/pdf/generate_level2_building_english_covers.py --source-dir public --output-dir build/level2-building-english --write-public
  if ($LASTEXITCODE -ne 0) { throw 'PDF replacement or local validation failed. Not committing.' }

  foreach ($item in $manifest.files) {
    & git add -- ([string]$item.path)
    if ($LASTEXITCODE -ne 0) { throw "Could not stage $($item.path)" }
  }
  $staged = @(& git diff --cached --name-only --diff-filter=M)
  $expected = @($manifest.files | ForEach-Object { [string]$_.path })
  $missing = @($expected | Where-Object { $_ -notin $staged })
  if ($missing.Count -gt 0) { throw "Missing staged PDFs: $($missing -join ', ')" }
  $unexpected = @($staged | Where-Object { $_ -notin $expected })
  if ($unexpected.Count -gt 0) { throw "Unexpected staged files: $($unexpected -join ', ')" }

  & git commit -m 'fix(level2-building): deliver 20 approved English cover PDFs [skip ci]'
  if ($LASTEXITCODE -ne 0) { throw 'Git commit failed.' }
  & git push origin $targetBranch
  if ($LASTEXITCODE -ne 0) { throw 'Git push failed. Local commit is retained; retry with Git authentication.' }
  Write-Host 'Success: 20 approved Level 2 Building PDFs committed to the PR branch. No GitHub Actions used.' -ForegroundColor Green
} finally {
  Pop-Location
}
