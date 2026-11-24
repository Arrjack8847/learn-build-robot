# BE STEM READY — Level 6 blocked-reference recovery review

Date: 2026-11-23  
Source branch: `feat/final-build-level-6`  
Reference audit commit inspected: `41eb797c2accb97180678e3c9c393f30a83a0936`  
Status: **2 BLOCKED; zero newly promoted references or questions**

## Verified upload outcome

Exactly **39** records marked `approved: true` and `status: "approved"` in `level-6-references.json` were submitted to **Steam** Wix Media Manager. All 39 upload results were `READY`. An independent Wix Get File Descriptors lookup matched **312/312** source metadata checks (original filename, immutable raw GitHub URL, dimensions, source file size, WebP identity, READY status, public/site identity and unique hosted URL). No blocked variant was submitted.

See `src/data/finalBuild/level-6-wix-image-urls.json` and `reports/final-build-level-6-wix-upload-20261123.json`. This does **not** certify the CDN bytes by independent SHA-256; the original WebP SHA-256 values remain the source-audit hashes.

## 1. Super Scorpion — Optimized

- Variant: `level-6-super-scorpion:optimized`
- Official source path: `public/Level 6/Building/Biomimicry & Stimulus Response/Super Scorpion/16. Super Scorpion - Optimized Building Manual.pdf`
- Registered current PDF SHA-256: `e0c7b137eb0ce340cb334a7a36e4ea90172ae65337d8ffba8937b2839d368600`
- Previous inspected crop candidate: page 1 of 3; `(0.13, 0.10, 0.77, 0.85)`.
- Existing candidate WebP SHA-256: `7b9327616f92c5654540e294cf1366af4ebb1510c78887765677751ee4dec8ce`.
- Existing audit's specific problem: the complete pictured robot precedes optimized alterations, while subsequent optimized illustrations show partial close-ups. The available Level 6 evidence record does not prove a genuine single full-model optimized image.

**Current decision: remain BLOCKED.** Do not reuse the standard Super Scorpion image, combine assembly stages or fabricate mechanical parts. All five authored questions remain unverified. Requires independent full-PDF page-render examination and complete optimized assembly identification before another extraction is considered.

## 2. Rock-paper-scissors Robot

- Variant: `level-6-rock-paper-scissors-robot`
- Official source path: `public/Level 6/Building/Sensor-Focused Robots/Rock-paper-scissors Robot/30.Rock-paper-scissors Robot-Building Manual.pdf`
- Registered current PDF SHA-256: `1009562c300be9ec9bb86ea5c9420d8117d4399e848dbb1d1705f2b02db107fd`.
- Existing candidate: page 14 of 14; crop `(0.24, 0.28, 0.66, 0.65)`.
- Existing candidate WebP SHA-256: `580dad96839b36de5369a2005c596b5b26986472528247284a78bdadb739be3e`.
- Existing audit's specific problem: explanatory marks intrude into the full-model candidate and the crop boundary intersects the robot composition.

**Current decision: remain BLOCKED.** Do not crop through mechanical components, redraw, paint over or synthesize missing geometry. All five authored questions remain unverified. A clean complete-model PDF extraction is required for promotion.

## Verification boundary of this follow-up

This session re-read both blocked variants in the source reference/checklist/audit manifests and attempted to retrieve both original PDFs. Direct source PDF access in the available inspection environment failed, so **a new visual page-by-page audit was not completed**. GitHub's text-file connector also could not decode the optimized PDF binary for visual inspection. No new authentic completed-model image was obtained. The prior findings are preserved, **not asserted as newly confirmed by fresh PDF image rendering**.

### Recovery counts

| Measure | Value |
|---|---:|
| Approved WebP uploads | 39 |
| Uploaded failures | 0 |
| Metadata comparisons passing | 312 / 312 |
| Previously approved questions | 195 |
| Newly independently approved questions | **0** |
| Blocked WebPs promoted | **0** |
| Blocked candidate uploads | **0** |
| Remaining blocked variants | **2** |

## Release gate and integration handoff

The shared integration branch imports Level 6's 39 approved WebP URLs and exact five-question checklists into the existing approved-only scanner. The current 15-minute timer and 4.2-second scanner are retained, and the two blocked variants remain excluded.

A vertical scrolling change was committed to the shared mobile exam shell, but **new mobile browser results are not available**. The previously recorded clipping failure is not considered closed until independently checked on Chromium and iOS Safari at 320, 375, 390 and 430 px. Full Node suites, TypeScript build, real mobile/browser media load and raw CDN SHA-256 remain final integration gates.

No GitHub Actions, Browser Use, production deployment or merge were performed.
