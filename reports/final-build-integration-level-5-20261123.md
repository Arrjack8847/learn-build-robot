> **Latest verified Level 5 result (supersedes the initial 39/45 handoff below):** 42/45 independently source-approved, 210 page-evidenced checks, 42 Steam Wix reference URLs, **three** complete-model-source blockers remain. Full current QA, exact hashes and release gates: [Level 5 42/45 recovery report](final-build-level-5-42-approved-release-gate-20261123.md). No production merge or deployment. The historical handoff below is preserved for provenance.\n\n# BE STEM READY — Level 5 shared scanner integration handoff
**Date:** 2026-11-23  
**Branch:** `integration/final-build-levels-1-6`  
**Base:** PR #108, `1fe5c5336d45295e6e3252d0450b662337a1db50`  
**Content source:** Level 5 worker PR #113 (`feat/final-build-level-5`).  
**Status:** DRAFT; NOT PRODUCTION-READY.

## Changes made
- Imported the Level 5 source audit, 45 reference records and 45 checklist records, with exactly 39 approved variants and six blocked variants.
- Added `src/data/finalBuildVerified.ts`, a common verified-only eligibility helper. The app scanner now samples only approved source-backed projects, not all registered PDF titles. A second verified variant does not increase a project's random selection odds.
- Loaded exactly five per-variant, page-evidenced Level 5 questions into the shared assessment. Removed title-derived generic `checkDescriptions` from the student exam.
- Upgraded `FinalBuildPrototype` to render a verified Wix-hosted WebP URL when present, otherwise use the already approved official Building PDF page/crop. No level-specific image files are copied into the integration branch.
- Uploaded the **39 approved Level 5 WebPs** to the user-confirmed **Steam** Wix Media Manager (site ID `fe3fa828-9f74-45e8-97f7-8d00cbb7fba0`) and populated `src/data/finalBuild/level-5-wix-image-urls.json` with **39 unique READY hosted WebP URLs**, keyed by exact approved variant ID.
- Completed `reports/final-build-level-5-wix-upload-plan-20261123.json` with all 39 source WebPs, exact source hashes, original filenames, Wix media IDs, hosted URLs, verified original source URLs, size, public state, WebP MIME and exact dimensions.
- Restricted `?review=1` controls to `import.meta.env.DEV`. Development review retains full registered-pool access, while the student scanner uses approved-only records.
- Rejects persisted sessions for variants that are no longer in the approved pool; uses a single finish timestamp to avoid a deadline race.
- Updated `tests/final-build-exams.test.mjs` for approved-only scanner, 39/45 Level 5 content, exact 39 unique Wix URLs and consistent source SHA-256 upload-audit mapping.

## Verification completed via read-only connector checks
- 45/45 reference/checklist manifest IDs present and aligned.
- 39 approved references, 39 exact five-item verified checklists, 195 source-page/sha256-evidenced questions.
- Six blocked variants retain empty approved questions and no selectable reference.
- 39/39 approved source URLs found in the canonical `src/data/levelFiveWixPdfUrls.ts` string registration.
- Wix accepted **39/39 uploads as READY** and returned 39 unique `https://static.wixstatic.com/media/*.webp` URLs. Re-queried the connected Steam site's Media Manager and matched every image by exact original file name, not bulk-result order.
- **312/312 metadata checks passed** across all 39 images (the imported source URL, public Wix CDN URL, expected dimensions, file name, WebP MIME/media type, public visibility, `READY`/`OK` state and valid URL structure). Wix metadata provided the imported original GitHub source URL for each.
- No blocked Level 5 robot was uploaded or mapped. The six blocked variant IDs remain without approved checklists and are excluded from student discovery.
- Wix Media Manager verified the hosted file records and states; a separate unauthenticated CDN HTTP GET, byte-for-byte hosted SHA-256 recheck and mobile-browser image-load test were **not performed** because the available read/HTTP paths could not fetch those binaries.
- Inspected source diff to ensure no `public/final-build/**/*.webp` binaries were introduced into this integration branch.

## Still required — stop-ship
1. Wix upload + metadata gate is **complete**. Still verify actual image loading and visual integrity in a local/preview mobile browser; compare source images and hosted media on a handful of reference variants, and check external CDN access/CORS where relevant.
2. Run `node --test tests/final-build-exams.test.mjs`, Level 5 worker tests and the relevant existing regression suites in an authorized full-repository checkout.
3. Run build/TypeScript checks and real mobile-browser QA at 320/375/390/430 px, with the 4.2-s scan, strict 15-min deadline, reload/timeout, variant selection, 4/5 assessment and unlimited retries.
4. Integrate independent approved records for Levels 1, 2, 3, 4 and 6. Until then their student pools remain empty and fail closed.
5. Independently investigate the remaining six Level 5 finished-model references, use a source-verified PDF page/crop or original Wix WebP if suitable, and approve only with five independently supported questions.

No GitHub Actions or Browser Use were invoked. No direct production release or main merge. Existing Level 5 worker PR #113 remains separate.
