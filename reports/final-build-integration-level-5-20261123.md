# BE STEM READY — Level 5 shared scanner integration handoff
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
- Added `src/data/finalBuild/level-5-wix-image-urls.json` with deliberately empty URL mapping. **No Wix image uploads are represented as completed.**
- Prepared `reports/final-build-level-5-wix-upload-plan-20261123.json` for the 39 source-authentic, approved WebPs; includes source file URL, original hash, variant ID and dimensions.
- Restricted `?review=1` controls to `import.meta.env.DEV`. Development review retains full registered-pool access, while the student scanner uses approved-only records.
- Rejects persisted sessions for variants that are no longer in the approved pool; uses a single finish timestamp to avoid a deadline race.
- Updated `tests/final-build-exams.test.mjs` for approved-only scanner and 39/45 Level 5 content verification.

## Verification completed via read-only connector checks
- 45/45 reference/checklist manifest IDs present and aligned.
- 39 approved references, 39 exact five-item verified checklists, 195 source-page/sha256-evidenced questions.
- Six blocked variants retain empty approved questions and no selectable reference.
- 39/39 approved source URLs found in the canonical `src/data/levelFiveWixPdfUrls.ts` string registration.
- Wix URL map empty; no uploaded URL or Wix READY state fabricated.
- Inspected source diff to ensure no `public/final-build/**/*.webp` binaries were introduced into this integration branch.

## Still required — stop-ship
1. Choose/confirm the intended Wix site for media uploads; then upload 39 WebPs and record **actual** READY `static.wixstatic.com/media/*.webp` URLs, matching exact variant IDs and reviewing the served images. Media must not be guessed from a file name.
2. Run `node --test tests/final-build-exams.test.mjs`, Level 5 worker tests and the relevant existing regression suites in an authorized full-repository checkout.
3. Run build/TypeScript checks and real mobile-browser QA at 320/375/390/430 px, with the 4.2-s scan, strict 15-min deadline, reload/timeout, variant selection, 4/5 assessment and unlimited retries.
4. Integrate independent approved records for Levels 1, 2, 3, 4 and 6. Until then their student pools remain empty and fail closed.
5. Independently investigate the remaining six Level 5 finished-model references, use a source-verified PDF page/crop or original Wix WebP if suitable, and approve only with five independently supported questions.

No GitHub Actions or Browser Use were invoked. No direct production release or main merge. Existing Level 5 worker PR #113 remains separate.
