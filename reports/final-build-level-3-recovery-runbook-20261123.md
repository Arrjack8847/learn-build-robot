# Level 3 Official Source Recovery — Reproduction Guide (2026-11-23)

**Status:** 40/40 source PDFs authenticated; 42/42 strong automated source-page matches; 42 local source-extracted WebP staging proposals; 210 source-linked checklist **drafts**; **0 independently approved references or question sets**. These files must not be used for student-visible Wix image mapping.

## Reproduce in an isolated Linux checkout

Use the `feat/final-build-level-3` GitHub worker branch; do not merge and do not use GitHub Actions.

```bash
python3 -m pip install pymupdf pillow numpy opencv-python-headless
python3 scripts/final-build/level3-official-source-run.py
python3 scripts/final-build/level3-source-match.py
python3 scripts/final-build/level3-extract-proposals.py
node --test tests/final-build-level-3.test.mjs tests/final-build-level-3-visual-review.test.mjs tests/final-build-level-3-source-drafts.test.mjs
npm install --no-save --no-audit
npm run assets:webp
npm run test:final-build
npx vite build
npx tsc --noEmit
```

Files are staged only under `.cache/level3-review/proposals/` (ignored ephemeral workspace). Each extracted image is generated from exact official PDF pixels; image SHA-256, dimensions, actual PDF page and crop are in `reports/final-build-level-3-extracted-source-artwork-proposals-20261123.json`. The 42 proposed WebP binaries have not been committed to the worker repository or approved for Wix upload.

`scripts/final-build/level3-source-match.py` uses PyMuPDF to rasterize each registered PDF page and OpenCV SIFT/RANSAC to match candidate artwork. This is **source correspondence**, not proof of a completed model. Most candidates match the last page; eight do not. The crop proposal script therefore uses the final page as a fallback in those eight, which requires especially careful manual review.

## Independent review still mandatory

Before approving any variant, examine the actual PDF pages and candidate/proposal side by side; confirm complete robot, correct assembly version, complete visible parts, no instructions/page borders and the correct crop. Separately verify all five exact question assertions against the cited registered PDF page, and record two distinct evidence-based reviews. Only then promote `draftQuestions` into the official `questions` list, mark both gates approved and upload the verified WebP to Steam Wix. Record Wix media ID, CDN URL, readiness, public visibility, dimensions and MIME. The current unapproved values must remain blocked, and the shared scanner must not be rebuilt.

## QA caveats

Executed **13/13 Level 3 tests** and **38/38 shared Final Build tests** passed. Vite build passed in a complete source checkout. Four local Chromium viewports (320, 375, 390, 430 px) passed responsive/JS and blocked assessment start tests. Initial unapproved robot discovery messaging remains misleading (advertises 39 discoverable robots despite 0 approvals); update approved-only pool gating only through the integration owner. Five pre-existing TypeScript errors are present in shared Final Build files, not fixed here because this worker owns only Level 3 content. iOS Safari and approved challenge end-to-end completion/retry remain unverified.

**Release: HOLD. No merge, production deploy, student mapping or Wix WebP upload authorized.**
