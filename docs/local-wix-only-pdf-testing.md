# BE STEM READY — local Wix-only PDF testing

This procedure tests the code **locally** without checking out any PDF binaries. The
frontend uses the Steam Wix-hosted PDF URLs for all registered Learning and
Building manuals. No GitHub Actions and no deployment are required.

## Requirements

- Git for Windows
- Node.js 22+ and npm
- Bun (to install the existing bun.lock without generating a new lockfile)

## Option A: clone source without downloading any PDFs (PowerShell)

Run these commands in PowerShell:

```powershell
git clone --filter=blob:none --depth=1 --no-checkout --single-branch --branch chore/local-wix-pdf-only-20261124 https://github.com/Arrjack8847/learn-build-robot.git learn-build-robot
cd learn-build-robot

git sparse-checkout set --no-cone "/src/**" "/tests/**" "/scripts/**" "/reports/**" "/3D for marksman/**" "/public/assets/level-artwork/**" "/package.json" "/bun.lock" "/tsconfig.json" "/vite.config.ts" "/.gitignore" "/index.html" "/postcss.config.js" "/tailwind.config.js" "/Car Steering.pptx" "/Cliff walk.pptx" "/Ferris wheel.pptx" "/Round-trip transportation.pptx" "/Shift gears.pptx"
git checkout chore/local-wix-pdf-only-20261124

bun install --frozen-lockfile
npm run test:pdf:wix-only
npm run dev:wix
```

Open http://127.0.0.1:5173 and navigate through Learning, Building and
Final Build for Levels 1–6. Keep the dev server open during the tests.

Suggested Final Build routes:
- http://127.0.0.1:5173/practical/level-1/final-build
- http://127.0.0.1:5173/practical/level-2/final-build
- http://127.0.0.1:5173/practical/level-3/final-build
- http://127.0.0.1:5173/practical/level-4/final-build
- http://127.0.0.1:5173/practical/level-5/final-build
- http://127.0.0.1:5173/practical/level-6/final-build

## PDF-free build verification

Stop the dev server with Ctrl+C and run:

```powershell
npm run build:wix
npx tsc --noEmit
(Get-ChildItem .output -Recurse -File -Filter *.pdf | Measure-Object).Count
git check-ignore -v --no-index sample-manual.pdf
```

Expected:
- All seven Wix-only source tests pass
- The Vite/Nitro build succeeds
- TypeScript reports no errors
- The generated output contains **zero** PDFs
- Git ignore identifies the PDF ignore rule

## Option B: use an existing full local checkout

```powershell
git fetch origin
git switch chore/local-wix-pdf-only-20261124
bun install --frozen-lockfile
npm run test:pdf:wix-only
npm run dev:wix
```

If old PDFs already exist in your checkout, they can stay locally for review,
but the application must use Wix URLs and the generated build will exclude PDF
copies. To test a completely PDF-free checkout, use Option A.

## Important distinctions

- `.gitignore` prevents **new, untracked** PDF files being committed by default.
  It cannot untrack old PDF files already present in Git history.
- At the time of this setup, Git tracked 598 PDFs: 590 source paths covered by
  the Learning/Building Wix registries and 8 supplementary Level 5–6 PDFs under
  `curriculum-source/`. These historical blobs are deliberately unchanged.
- The PDF-free build command is `npm run build:wix`. The existing
  `npm run build` runs a larger 80-test suite including older tests that read
  original PDF binaries. Continue running that larger suite in a full source
  checkout when needed; do not describe the 7 metadata tests as 80 tests.
- If an official Wix mapping is missing, the PDF resolver now throws an
  explicit error instead of secretly loading a local PDF.
- Existing Level 1 reference URLs, scanner geometry, timer and scoring remain
  unchanged. The separate Level 1 Final Build review approval gate was not
  modified as part of this Wix-only conversion.
- This setup does not merge into main or deploy anything. Review the PR before
  publishing the local-test changes.

## Troubleshooting

If `bun` is unavailable, install Bun before running `bun install
--frozen-lockfile`. If a Windows Git credential prompt appears when cloning
a private repository, authenticate with the account that owns the project.

If a lesson fails to load, check its request in the browser's Network tab:
PDF URLs should start with
`https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/`.
Do not replace missing links with `/Level .../*.pdf` paths. Fix the
canonical Wix registry instead.
