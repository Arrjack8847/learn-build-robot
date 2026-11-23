# BE STEM READY — Level 5 Final Build Challenge QA and Source Evidence

Date: 2026-11-23 (Asia/Kuala_Lumpur)  
Repository: Arrjack8847/learn-build-robot  
Worker branch: `feat/final-build-level-5`  
Coordinated base: `1fe5c5336d45295e6e3252d0450b662337a1db50`

## Result and release boundary

| Evidence or deliverable | Verified outcome |
| --- | ---: |
| Official syllabus activities | 51 |
| Registered official Building projects | 43 |
| Independently mapped official manual variants | 45 |
| Syllabus items without independent Building PDF registration | 8 |
| Actual Wix PDF binaries downloaded, hashed and reopened | **45 / 45** |
| Total PDF pages counted | **1,031** |
| Matches to original tracked Git blob versions | **40** |
| Matches to five officially corrected PDF Git blobs | **5** |
| Unknown/mismatched Wix PDF bytes | **0** |
| Source-final-page WebP robot reference assets delivered | **39** |
| Approved variants in Level 5 data manifests | **39** |
| Blocked variants | **6** |
| Project/variant-specific evidenced assembly questions | **195** |

## Evidence process

Preparation first reconciled the 51 canonical Level 5 syllabus entries, 43 Building-source projects and 45 source variants against `src/data/levelFiveSixContent.ts`, `src/data/levelFiveWixPdfUrls.ts`, and the immutable coordinated Git tree.

An isolated, network-enabled, non-production sandbox downloaded all **45 actual Wix-hosted PDFs**. SHA-256 was computed on each full PDF and pages enumerated with PyMuPDF. Each file's Git blob fingerprint matched either (a) its tracked original Git source blob, or (b) one of five recorded official repaired versions. The latest **Chairoplane November 20 repair**, not its obsolete November 19 URL, matched its approved new blob. Curling Game and Crack Shot Basic/Optimized remain distinct and are never conflated.

The final source assembly pages were rendered into contact reviews. Crops were generated exclusively from PDF raster pixels, with normalized coordinates recorded, reopened and checked against an independent source-page render (pixel error threshold below 24 mean absolute levels after resizing and WebP encoding). No image generation, invented mechanism, raster retouching or altered source PDF was used. Each approved entry has a unique WebP, source and output SHA-256, source URL, exact final-model page, crop, dimensions, provenance, five construction observations and the matching evidence page.

## Blocked variants (excluded, not artificially approved)

- `level-5-remote-control-car` — final-page imagery contains multiple views, annotations, separated parts, or fails the independently unambiguous finished-model-only crop requirement.
- `level-5-crack-shot:optimized` — final-page imagery contains multiple views, annotations, separated parts, or fails the independently unambiguous finished-model-only crop requirement.
- `level-5-machine-gun` — final-page imagery contains multiple views, annotations, separated parts, or fails the independently unambiguous finished-model-only crop requirement.
- `level-5-facial-recognition-time-clock` — final-page imagery contains multiple views, annotations, separated parts, or fails the independently unambiguous finished-model-only crop requirement.
- `level-5-voice-control-snail` — final-page imagery contains multiple views, annotations, separated parts, or fails the independently unambiguous finished-model-only crop requirement.
- `level-5-voice-control-vehicle` — final-page imagery contains multiple views, annotations, separated parts, or fails the independently unambiguous finished-model-only crop requirement.

They remain `approved:false`, with empty checklist questions and no selectable WebP reference in Level 5 data. Eight syllabus-only projects likewise have no registered official Building manual and remain outside the candidate pool.

## Scope of checklist evidence

The 195 assessment prompts are **five observable assembly checks per approved robot variant** (component layout, specific joints/supports, completed frame and correspondence to the manual's finished model). Every prompt records `evidencePage` and the exact authoritative PDF SHA-256. Unverified automation, sensor sensing distance, motor speed or functional behavior is **not** claimed solely from a project title. These are source-artwork-grounded build checks, not tests proving electronic operation.

## QA and execution

- Source-registration assertions before first draft: **236 pass, 0 fail**.
- Level 5 Node suite on original fail-closed audit: **5 tests passed**.
- Updated Level 5 Node suite executed against commit `f236e26267ab0e475a32d9969b190aca8a8c51ae`: **5 tests passed, 0 failed**. This includes source identity, repaired links, Basic/Optimized variants, WebP existence/dimensions/hash, and 195 page-evidenced checks.
- Independent PDF/WebP source and pixel comparison executed against the exact committed 39 images, verifying source SHA-256, source Git blob identity, exact page count, output SHA-256, dimensions and normalized crop. All 39 WebPs reopened successfully. Resized source crop to delivered WebP mean absolute pixel difference ranged **1.38–4.41** (threshold 24).
- Final sandbox worktree reconciled **39 Git-tracked WebP assets** and **zero approved records with missing output files**. The six blocked IDs have no delivered student reference.
- HTML/mobile viewport validation at 320 / 375 / 390 / 430 pixels: **not executed** under the existing no-Browser-Use restriction. Shared engine, scanner, persistent timer, question interaction and browser-access security belong to final integration worker.
- GitHub Actions: **not invoked**. Browser Use: **not invoked**. Production and main: **untouched**.
- Only Level 5-scoped files, WebPs, tests and this report changed.

## Important integration distinction

Level 5 **content approval** is stored in the three Level 5 manifests. The shared `finalBuildApprovals.json` remains controlled by the coordinated integration worker and was deliberately not edited. Therefore this branch **does not by itself enable 39 student exams in the existing shared scanner**. The integration worker must translate approved Level 5 references and checklists into the shared runtime approval gate and verify scanner/timer/responsiveness without altering these verified source objects.

**Delivery status:** 39 evidence-backed Level 5 content candidates approved in isolated worker manifests; six blocked. Not a production release or a merged application. No blanket English-only or whole-course visual certification.

## Final commit QA record

- Validated delivery commit: `f236e26267ab0e475a32d9969b190aca8a8c51ae`.
- `node --test tests/final-build-level-5.test.mjs`: **PASS — 5/5**.
- Independent PDF/WebP comparison: **45/45 PDF SHA-256 + Git object checks, 39/39 image hashes/crops, 195/195 question evidence mappings, six blocked, zero mismatched source identities**.
- This supplemental QA report commit changes the report/test only; no scanner, deployment or source PDF changes.
