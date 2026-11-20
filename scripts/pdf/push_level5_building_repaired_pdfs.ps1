# Upload the five verified Level 5 Building English repair PDFs only.
# Works from any PowerShell working directory. No GitHub Actions are invoked.
# Example:
# & "D:\my project\BE STEM READY\learn-build-robot-main\scripts\pdf\push_level5_building_repaired_pdfs.ps1" -ZipPath "$env:USERPROFILE\Downloads\Level5_Building_English_Repairs_5_PDFs.zip"
[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)][string]$ZipPath = (Join-Path $env:USERPROFILE 'Downloads\Level5_Building_English_Repairs_5_PDFs.zip'),
    [Parameter(Mandatory=$false)][string]$RepoPath = (Join-Path (Split-Path -Parent $PSScriptRoot) '..')
)
$ErrorActionPreference = 'Stop'
$branch = 'fix/level5-complete-building-english-20261119'
$files = @(
    @{ Name='03.Spanish Bullfight-Building Manual.pdf'; Path='public/Level 5/Building/Action-Oriented/Spanish Bullfight/03.Spanish Bullfight-Building Manual.pdf'; Old='cba54570389c192fbaf13d9bb1ba0fe8cae5ea52'; New='3bc2b5a8a9bb8c57b23d979f3aeddfce3af010c8' },
    @{ Name='02.Smart Cash Register-Building Manual.pdf'; Path='public/Level 5/Building/Automation & Security/Smart Cash Register/02.Smart Cash Register-Building Manual.pdf'; Old='2838117dc5e3b62b074c5bd5d8e3f224396c3e70'; New='b27254ab5ae6a3b0f907750944c38d433aae97f7' },
    @{ Name='08. Welcome Sign-Building Manual.pdf'; Path='public/Level 5/Building/Display & Movement/Welcome Sign/08. Welcome Sign-Building Manual.pdf'; Old='6bb08061338f5dbca693b4de3ac55074cdc276cb'; New='5ada5ba8b3e4fea89bea80837f9e32ab8dcb126c' },
    @{ Name='27. Chairoplane-Building Manual.pdf'; Path='public/Level 5/Building/Mechanisms & Simulators/Chairoplane/27. Chairoplane-Building Manual.pdf'; Old='08c7fcfadc98f5b149268fc26c8926e182ec6ada'; New='a866bd4cd98b2a6e21dae3aafa26636d656f39c1' },
    @{ Name='10.Machine Gun-Building Manual.pdf'; Path='public/Level 5/Building/Mechanisms & Simulators/Machine Gun/10.Machine Gun-Building Manual.pdf'; Old='5cf32ac3e629f6878c778a9fe5a5f77661c2ffff'; New='4280fa96fd8be96bc662b4328860fe806d2bdbc5' }
)
function CheckGit {
    if ($LASTEXITCODE -ne 0) { throw "Git failed with exit code $LASTEXITCODE." }
}
if (-not (Test-Path -LiteralPath $ZipPath -PathType Leaf)) { throw "Repair ZIP not found: $ZipPath" }
if (-not (Test-Path -LiteralPath $RepoPath -PathType Container)) { throw "Repository checkout not found: $RepoPath" }
$repo = (Resolve-Path -LiteralPath $RepoPath).Path
$archive = (Resolve-Path -LiteralPath $ZipPath).Path
$origin = (& git -C $repo remote get-url origin).Trim()
CheckGit
if ($origin -notmatch 'Arrjack8847/learn-build-robot(\.git)?$') { throw "Unexpected Git origin: $origin" }
$before = @(& git -C $repo status --porcelain)
CheckGit
if ($before.Count -gt 0) { throw "Repository has uncommitted changes. Upload stopped; save your work first." }
& git -C $repo fetch origin $branch
CheckGit
$local = (& git -C $repo branch --list $branch)
CheckGit
if (-not $local) {
    & git -C $repo switch --track "origin/$branch"
} else {
    & git -C $repo switch $branch
}
CheckGit
& git -C $repo pull --ff-only origin $branch
CheckGit
$temp = Join-Path ([System.IO.Path]::GetTempPath()) ('level5-upload-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $temp | Out-Null
try {
    Expand-Archive -LiteralPath $archive -DestinationPath $temp -Force
    $actual = @(Get-ChildItem -LiteralPath $temp -Recurse -File -Filter '*.pdf')
    if ($actual.Count -ne 5) { throw "Archive must contain exactly 5 PDF files; found $($actual.Count)." }
    foreach ($f in $files) {
        $matches = @($actual | Where-Object { $_.Name -ceq $f.Name })
        if ($matches.Count -ne 1) { throw "Missing or duplicate PDF in ZIP: $($f.Name)" }
        $f.Source = $matches[0].FullName
        $originalFile = Join-Path $repo ($f.Path.Replace('/', [System.IO.Path]::DirectorySeparatorChar))
        if (-not (Test-Path -LiteralPath $originalFile -PathType Leaf)) { throw "Missing original: $($f.Path)" }
        $oldHash = (& git -C $repo hash-object -- $f.Path).Trim()
        CheckGit
        if ($oldHash -cne $f.Old) { throw "Original PDF differs from audited version: $($f.Path) (got $oldHash)" }
        $newHash = (& git -C $repo hash-object -- $f.Source).Trim()
        CheckGit
        if ($newHash -cne $f.New) { throw "Repaired PDF SHA mismatch for $($f.Name): $newHash" }
        Write-Host "PASS original/repaired hashes: $($f.Name)"
    }
    foreach ($f in $files) {
        Copy-Item -LiteralPath $f.Source -Destination (Join-Path $repo ($f.Path.Replace('/', [System.IO.Path]::DirectorySeparatorChar))) -Force
    }
    $paths = @($files | ForEach-Object { $_.Path })
    & git -C $repo add -- $paths
    CheckGit
    $staged = @(& git -C $repo diff --cached --name-only)
    CheckGit
    if ($staged.Count -ne 5) { throw "Expected five staged PDFs, found $($staged.Count). STOP." }
    foreach ($path in $staged) {
        if ($paths -cnotcontains $path) { throw "Unexpected staged path: $path" }
    }
    & git -C $repo commit -m '[skip ci] fix(level5): upload verified English Building PDF repairs'
    CheckGit
    & git -C $repo push origin ("HEAD:" + $branch)
    CheckGit
    $head = (& git -C $repo rev-parse HEAD).Trim()
    CheckGit
    Write-Host "SUCCESS: all five English-repaired PDFs pushed to $branch"
    Write-Host "Commit: $head"
    Write-Host 'PR: https://github.com/Arrjack8847/learn-build-robot/pull/87'
} finally {
    Remove-Item -LiteralPath $temp -Recurse -Force -ErrorAction SilentlyContinue
}
