# Level 3 Building — English cover binary delivery (Windows PowerShell).
# Does NOT invoke Codex, Browser Use or GitHub Actions.
# Execute only in authenticated local checkout after reviewing the generated PDF.
$ErrorActionPreference = 'Stop'
$branch = 'fix/level3-building-english-covers-20261119'
$sha = '82871820203830b6932c5b314ab7afa70183f215'
$pdf = 'public/Gyro transmitter_Building.pdf'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
Push-Location $root
try {
  if ((& git branch --show-current).Trim() -ne $branch) { throw "Checkout branch $branch first." }
  if ((& git status --porcelain -- $pdf)) { throw "PDF already locally edited. Do not overwrite." }
  if ((& git hash-object -- $pdf).Trim() -ne $sha) { throw "Original Git blob mismatch: $pdf" }

  $python = if (Get-Command py -ErrorAction SilentlyContinue) { 'py' } elseif (Get-Command python -ErrorAction SilentlyContinue) { 'python' } else { throw "Python is required." }
  & $python -m pip install pymupdf pillow numpy opencv-python-headless
  if ($LASTEXITCODE -ne 0) { throw "Python dependencies failed." }

  & $python scripts/pdf/generate_level3_building_english_cover.py --source-dir public --output-dir build/level3-building-english --write-public
  if ($LASTEXITCODE -ne 0) { throw "Local PDF restoration or regression check failed. No commit." }

  & git add -- $pdf
  if ($LASTEXITCODE -ne 0) { throw "Unable to stage replacement PDF." }
  $staged = @(& git diff --cached --name-only)
  if ($staged.Count -ne 1 -or $staged[0] -ne $pdf) {
    throw "Expected only $pdf staged, got: $($staged -join ', ')"
  }
  $newSha = (& git hash-object -- $pdf).Trim()
  if ($newSha -eq $sha) { throw "Binary did not change; refusing empty delivery." }

  & git commit -m 'fix(level3-building): deliver verified Gyro Transmitter English PDF [skip ci]'
  if ($LASTEXITCODE -ne 0) { throw "Binary commit failed." }
  & git push origin $branch
  if ($LASTEXITCODE -ne 0) { throw "Push failed; the verified local commit is retained. Authenticate Git then retry." }
  Write-Host "Binary PDF pushed to $branch as $newSha" -ForegroundColor Green
} finally {
  Pop-Location
}
