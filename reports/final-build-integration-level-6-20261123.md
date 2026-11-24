# BE STEM READY — Level 6 integration handoff, Wix media and release gates

**Date:** 2026-11-23  
**Worker:** [draft PR #112](https://github.com/Arrjack8847/learn-build-robot/pull/112), `feat/final-build-level-6`  
**Shared integration:** [draft PR #114](https://github.com/Arrjack8847/learn-build-robot/pull/114), `integration/final-build-levels-1-6`  
**Wix:** Steam — `fe3fa828-9f74-45e8-97f7-8d00cbb7fba0`  
**Release policy:** DRAFT, no production merge/deploy.

## Completed

- Read canonical source manifests on Level 6 worker PR: **43** official syllabus projects; **39** source-registered projects; **41** distinct Building manual variants.
- Selected **exactly the 39 approved records** from `src/data/finalBuild/level-6-references.json` and matched them against existing source WebPs at source GitHub commit `41eb797c2accb97180678e3c9c393f30a83a0936`.
- Uploaded the **39 approved WebPs to Steam Wix** via its Media Manager upload tool in one batch: **39 successful; 39 READY; 0 failed**; no blocked candidate and no Level 5 reupload.
- Independently read back all 39 Media Manager file descriptors by media ID. Validated **312/312** correlated metadata checks covering exact filename, immutable source URL, original file byte count, dimensions, media/WebP type, READY status, public site visibility, and unique hosted Wix URL. No mismatches.
- Recorded 39 unique URLs in `src/data/finalBuild/level-6-wix-image-urls.json`; retained 39 detailed source/media records in `reports/final-build-level-6-wix-upload-20261123.json`.
- Brought verified Level 6 reference/checklist JSON into integration without adding any `.webp` binary to integration.
- Added `src/data/finalBuildLevel6Verified.ts` and a limited dispatch in existing `src/data/finalBuildVerified.ts`. Level 6 draws remain **fail-closed**: only 39 approved image+checklist pairs, with exact official Building PDF provenance and usable Wix URL; five independently verified questions per variant, **195** approved questions total.
- Preserved existing shared scanner and exam component: **4.2 second** scan, **15-minute** strict timer, **4-of-5** pass check, retry and same Level 1 scanner artwork/animation. A narrow exam-shell CSS change allows internal vertical scroll on short/narrow screens, without modifying the scanner component.
- Added `tests/final-build-level-6-integration.test.mjs` containing four Node regression tests covering 39/2 status, provenance/Wix metadata, 195 approved questions, fail-closed integration and timer/scroll contract.
- Inspected source manifests and current integration code in the connector environment and evaluated **290 in-memory source assertions without errors**. These were *not* local Node/TypeScript/build/browser test executions.
- Compared the integration `src/data/finalBuild/level-5-wix-image-urls.json` Git blob SHA to its original SHA (`a91003d468226e4bf29f05ebf6342cb0bc9c04f1`): unchanged.

## Two blocked robots: no fabricated approvals

1. **Super Scorpion — Optimized** (`level-6-super-scorpion:optimized`). Prior 3-page PDF audit found complete base image before optimized alterations and close-up optimized construction views, but no conclusively complete optimized final-model composition. No standard Scorpion substitution. **BLOCKED**.
2. **Rock-paper-scissors Robot** (`level-6-rock-paper-scissors-robot`). Prior official PDF page 14 candidate contains annotation artifacts and a model-intersecting crop boundary. No fabricated or destructive cropping. **BLOCKED**.

Both candidates remain out of the student pool, with **ten unverified candidate questions**. **Newly approved questions = 0**. A new original PDF page-render review was attempted in this session but could not be completed with the available binary-PDF access; this follow-up did not acquire a newly clean, complete official illustration. Recovery review details are in worker report `reports/final-build-level-6-recovery-20261123.md`.

## QA evidence and unresolved release blockers

| QA | Actual result |
|---|---|
| Steam Wix uploads | **39/39 READY**, 0 failures |
| Independent Wix metadata checks | **312/312 pass** |
| Integration source assertions (in-memory) | **290 checked, 0 errors** |
| New dedicated Level 6 integration Node tests | **Committed, not executed in a local checkout** |
| Integrated TypeScript compile / production build | **Not executed in current integration checkout** |
| Integrated timer, timeout, reload and mobile browser QA | **Not executed after integration** |
| 320 / 375 / 390 / 430 px mobile Chromium | **Previously failed vertical CTA clipping; new CSS patch unverified** |
| Real iOS Safari / media display | **Not executed** |
| Raw Wix CDN GET, served-image SHA-256 | **Not independently verified** |
| Reinspected complete official PDFs for two blocked variants | **Not completed; remain blocked** |

The worker's **earlier** isolated audit reported 10/10 Level 6, 21/21 level56, 38/38 FinalBuild tests and a passing build. Those results were obtained before this integration and do **not** certify these latest changes.

Do not merge or publish until a fresh isolated checkout runs `node --test tests/final-build-level-6-integration.test.mjs`, `npm run test:final-build`, `npm run build`, and actual Chromium + iOS Safari mobile QA; check Wix image display and timeouts. Do not use GitHub Actions or Browser Use.

**Scope:** Level 6 evidence and related shared approved-only routing + mobile scrolling; no Level 5 media changes, no robot binary media in integration, no merge, no deployment.
