# BE STEM READY — Level 3 Final Build: owner-authorized delivery

**Date:** 2026-11-23  
**Source worker PR:** #110 (`feat/final-build-level-3`)  
**Shared integration PR:** #114 (`integration/final-build-levels-1-6`)  
**Wix:** Steam, site `fe3fa828-9f74-45e8-97f7-8d00cbb7fba0`

## Delivered and verified
- **42/42 registered official Building-manual variants** mapped to **39/39 Building-source projects** (out of 48 syllabus projects). There are **40 distinct original Wix Building PDF media files**. The nine presentation-only/syllabus-only activities are not silently invented as new official Building-manual variants.
- **42/42 existing source-PDF-derived WebP files uploaded to Steam Wix**. All Media Manager file descriptors were subsequently re-read: `READY`, `OK`, `private=false`, matching site, original GitHub source URL/display name, and image width/height. All 42 hosted CDN URLs responded HTTP 200 with `image/webp` content type.
- All **42 GitHub WebP binary files were re-fetched from pinned source commit `0827f2b26d35d5340075c969e1df1ed69ed31d85`**. SHA-256 and byte length independently calculated and compared against Wix CDN original bytes. **42/42 exact SHA-256 and byte-size matches** (batches of 12, 12, 12 and 6); no mismatch remained.
- **210/210 existing owner-authorized questions** (five per variant), with exact PDF SHA-256 and source-page mapping. Checked 42 unique variant IDs, 210 unique prompt strings, 39 project IDs and 40 PDF media IDs. Questions are *owner-authorized candidate construction self-checks*, **not 210 independently certified technical claims**.
- The full per-variant data ledger is `src/data/finalBuild/level-3-owner-authorized.json`. It retains source PDF URL/SHA/page, normalized crop, the pinned original GitHub WebP URL, the *actual* GitHub and CDN WebP SHA-256, byte size, dimensions, Wix Media ID, hosted URL, five question texts and review limitations.

## Critical provenance distinction
The former *uncommitted staging proposal* manifest lists different SHA-256 and dimensions from the actual optimized WebP files committed to GitHub. The new ledger separately preserves historic candidate details while recording the **exact source GitHub and Wix CDN binaries actually delivered**, so older staging hash assertions are never confused with the shipped image.

**Owner authorization is not independent completed-model approval.** The source-PDF identity and automated SIFT/RANSAC page matching provide authentic source provenance. Some images may show official construction illustrations rather than an independently confirmed fully finished model. In the UI, Level 3 displays an explicit owner-authorization/source-limitation statement and does not use a misleading independent-verification label.

## Shared integration
- New `src/data/finalBuildLevel3Verified.ts` is a dedicated Level 3 owner-authorized adapter with strict source, source-image SHA256/byte-equality, five-question and public Wix media gates.
- `src/data/finalBuildVerified.ts` now dispatches Level 3 through that adapter, and preserves all existing Level 1–2 and Level 4–6 adapters and the common scanner engine.
- The Level 3 pool expands registered versions, including Cycle Sport (two) and Race Walking (three), into **all 42 actual variants** rather than one variant per project.
- The existing scanner, motion, 15-minute limit, self-assessment scoring (4/5 required) and retry behaviour remain unchanged.
- When a Level 3 Wix image errors, the original registered PDF link is offered and the same shared exam can continue using its source-backed fallback; no fictional model picture is introduced.

## Tests and limitations
- This session checked **601/601 in-memory registry / per-variant data / integration-code invariants**, with no failures. A further direct reconciliation of the official syllabus and `practicalProjects` source found **48 syllabus projects, 39 registered Building projects, 42 matching variants and zero mapping mismatches**.
- New Node test modules committed: `tests/final-build-level-3-owner-authorized.test.mjs` (both branches) and `tests/final-build-level-3-integration.test.mjs` (shared branch). The latter two are appended to the integration branch's `test:final-build` command.
- **Not executed in this session:** the actual Node test runner, full TypeScript type check/Vite production build, visual image-decoding via real browsers, and Safari/iOS mobile/browser tests. The container cannot resolve the private GitHub remote; connector-backed static checks and direct Wix API/CDN HTTP checks are *not* a substitute for a build or browser test. Previously recorded worker QA belongs to its earlier source snapshot, not to this integrated head.
- **Independent visual/technical sign-off remains 0/42**; the owner authorized all 42 for inclusion without that sign-off.
- **No production deployment, GitHub Actions, or merge** was initiated. Both PRs remain drafts.

## Sources
- GitHub: `feat/final-build-level-3`, PR #110, `src/data/finalBuild/level-3-owner-authorized.json`
- Integration: PR #114, `src/data/finalBuildLevel3Verified.ts` and `src/data/finalBuildVerified.ts`
- Wix: All 42 public hosted links and per-file media/state/hash fields are enumerated in the owner-authorized JSON ledger.
