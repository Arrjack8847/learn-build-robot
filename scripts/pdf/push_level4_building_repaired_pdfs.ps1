# BE STEM READY — Level 4 Building English PDF binary delivery
# Run from PowerShell within an authenticated local checkout.
# Does NOT run GitHub Actions. Does NOT touch Learning PDFs.
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$targetBranch = "fix/level4-complete-building-english-20261119"
if (-not (Test-Path ".git")) {
    throw "Run this script from the root of the learn-build-robot repository."
}
$repoRoot = (& git rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0) { throw "Cannot locate repository root." }
Set-Location $repoRoot
$remote = (& git remote get-url origin).Trim()
if ($remote -notmatch "Arrjack8847/learn-build-robot(\.git)?$") {
    throw "Unexpected repository origin: $remote"
}
$dirty = @(& git status --porcelain)
if ($LASTEXITCODE -ne 0) { throw "Git status failed." }
if ($dirty.Count -gt 0) {
    throw "Your working tree has uncommitted changes. Preserve them before running this script."
}
& git fetch origin $targetBranch
if ($LASTEXITCODE -ne 0) { throw "Could not fetch Level 4 branch." }
& git show-ref --verify --quiet "refs/heads/$targetBranch"
if ($LASTEXITCODE -eq 0) {
    & git switch $targetBranch
} else {
    & git switch --track "origin/$targetBranch"
}
if ($LASTEXITCODE -ne 0) { throw "Could not switch to Level 4 branch." }
& git pull --ff-only origin $targetBranch
if ($LASTEXITCODE -ne 0) { throw "Could not fast-forward Level 4 branch." }

$reportPath = "reports/level4-building-complete-interior-audit-20261119.json"
$report = Get-Content $reportPath -Raw | ConvertFrom-Json
$expected = @($report.files | Where-Object { @($_.confirmed_regions).Count -gt 0 } | ForEach-Object { $_.path })
if ($expected.Count -ne 4) {
    throw "Expected exactly four target PDFs, found $($expected.Count)."
}
foreach ($pdf in $expected) {
    if (-not (Test-Path -LiteralPath $pdf)) { throw "Missing original PDF: $pdf" }
    if (-not $pdf.StartsWith("public/Level 4/Building/")) { throw "Unexpected path outside Level 4 Building: $pdf" }
}

& python -m pip install pymupdf pillow
if ($LASTEXITCODE -ne 0) { throw "PDF packages could not be installed." }
& python scripts/pdf/repair_level4_building_interior_chinese.py --in-place
if ($LASTEXITCODE -ne 0) { throw "PDF repair/validation failed. No PDF commit was attempted." }

$validation = "reports/level4-building-local-repair-validation.json"
if (-not (Test-Path -LiteralPath $validation)) { throw "Validation report missing." }
$results = @(Get-Content -LiteralPath $validation -Raw | ConvertFrom-Json)
if ($results.Count -ne 4) { throw "Expected four validated PDF outcomes." }
foreach ($row in $results) {
    if (-not $row.unmodified_pages_pixel_identical -or
        -not $row.all_modified_pixels_within_annotation_boxes -or
        -not $row.english_extractable) {
        throw "Validation failed for $($row.pdf_path)"
    }
}
$actualChanged = @(& git diff --name-only -- "public/Level 4/Building")
$expectedSorted = @($expected | Sort-Object)
$actualSorted = @($actualChanged | Sort-Object)
$delta = @(Compare-Object -ReferenceObject $expectedSorted -DifferenceObject $actualSorted)
if ($delta.Count -ne 0) {
    Write-Host ("Expected PDFs: " + ($expectedSorted -join "; "))
    Write-Host ("Actual PDFs: " + ($actualSorted -join "; "))
    throw "Actual modified Building PDFs differ from the four permitted originals."
}
& git add -- $expected
if ($LASTEXITCODE -ne 0) { throw "Git add failed." }
& git add -- $validation
if ($LASTEXITCODE -ne 0) { throw "Git add validation report failed." }

$staged = @(& git diff --cached --name-only)
$allowed = @($expected + $validation | Sort-Object)
$diff = @(Compare-Object -ReferenceObject $allowed -DifferenceObject @($staged | Sort-Object))
if ($diff.Count -ne 0) { throw "Staged file list differs from the four PDFs and validation report." }
& git commit -m "fix(pdf): replace confirmed Chinese in four Level 4 Building manuals"
if ($LASTEXITCODE -ne 0) { throw "Git commit failed." }
& git push origin $targetBranch
if ($LASTEXITCODE -ne 0) { throw "Push failed. Your local commit is intact; retry push manually." }
Write-Host "SUCCESS: Four repaired Level 4 Building PDF binaries and local validation report pushed to $targetBranch"
Write-Host "PR: https://github.com/Arrjack8847/learn-build-robot/pull/91"
