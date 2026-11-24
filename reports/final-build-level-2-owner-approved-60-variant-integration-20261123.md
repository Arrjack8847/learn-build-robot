# BE STEM READY — Level 2 owner-authorized 60-variant PDF fallback integration

Date: 2026-11-23
Status: DRAFT, committed to worker PR #109 and shared integration PR #114; NOT released.
Wix: Steam, `fe3fa828-9f74-45e8-97f7-8d00cbb7fba0`

## What was actually implemented

- **59 syllabus projects / 60 registered variants**, including the two See Saw variants. The shared scanner selects projects uniformly, then samples a Level 2 variant uniformly within the selected project.
- **Original 30 independently verified PDF-derived WebPs preserved unchanged**, together with their 30 five-question page-backed checklists and the exact 30 READY Steam Wix URLs in `src/data/finalBuild/level-2-wix-image-urls.json`.
- **Remaining 30 variants are now owner-authorized for student selection using their EXACT registered Wix PDF source URLs as an explicit fallback**. Their source URL, existing downloaded-PDF SHA-256, page count, recorded byte size, source classification, source limitations, authorization, and 5 question records are stored in `src/data/finalBuild/level-2-owner-approved-pdf-fallbacks.json`.
- **All 300 questions represented**: 150 original independently PDF-image-backed questions retained without edits; 150 new owner-authorized general-observable self-assessment questions explicitly labeled **not independently PDF page-verified**.
- Level 2 source-limited cases render an `Open original PDF reference` link, explain possible presentation/incomplete manual provenance, and permit beginning the 15-minute build without inventing a standalone model image. If a verified Level 2 Wix WebP fails to load, the student is given the PDF link rather than stranded.
- The Level 2 shared adapter now checks the exact canonical source URL/hash and authorization record before allowing a fallback. It never promotes a source-limited case into the strict independently approved WebP cohort.
- 4.2-second scanner, 15-minute persisted deadline, 4/5 pass threshold, retry/reload/overtime semantics, and Level 1 source unchanged. Level 5/6 source files and hosted Wix URL manifests not replaced.

## Current provenance / precise limitations

The earlier full Level 2 source audit previously downloaded and hashed 60/60 registered source PDFs (1,056 total pages), finding **30** entries with an independently qualified finished-model illustration and **30** entries visually screened as `presentation-or-inadequate-Building-source`. Owner authorization changes eligibility but does not change those findings. An existing original PDF URL is a genuine registration, not proof the PDF is an authentic standalone Building manual.

Steam Wix currently has **30 original approved Level 2 WebPs**. They remain READY with previously completed Media Manager metadata checks (390/390) and direct hosted CDN SHA-256/byte-count/dimension evidence (30/30), in `reports/final-build-level-2-wix-upload-20261123.json` and `reports/final-build-level-2-wix-cdn-sha256-20261123.json`. **No new standalone authentic finished-model WebPs were recovered or uploaded in this change.** The 30 fallbacks use the original registered PDFs; they are not relabeled as hosted WebPs. No page or crop coordinates were invented for these fallbacks.

The detailed prior Media Manager source-candidate search (including pagination for Hammer Robot and Robot War) remains in `reports/final-build-level-2-blocked-source-discovery-20261123.json` on PR #109. No alternative was promoted without verified PDF page/model evidence. Retain this distinction in any downstream release report.

## Actually executed checks

Executed **563/563 connector-side JavaScript checks** on latest GitHub file contents, including all 60 unique variant IDs, 59 project IDs, 60 distinct registered URLs and recorded source hashes/page counts, the preservation of exact original approval/checklist/Wix manifest blob SHAs, the 30-fallback source identity mappings, 30 x 5 general question provenance, complete 300-question count, and scanner/15-minute/4-of-5/PDF-link/error-fallback static code contracts. **0 failures.**

Git blob SHAs for preserved originals:
- References: `41c43be053aa18038d850391a8adfa42662c8356`
- Approved checklists: `11e51712454544c1ca89d52f1dfab9a32747e183`
- Approved Wix URL map: `dd3cb1db617aa7127123f0edcab8d010eb1c7581`

Updated/added automated regression test source files:
- Worker: `tests/final-build-level-2.test.mjs`
- Integration: `tests/final-build-level-2-integration.test.mjs`

**Not executed**: an isolated `npm run test:final-build`, current-head `npm run build`/TypeScript/Vite, current-head browser/mobile/Safari QA or real external PDF-link load tests. Local container cannot resolve GitHub for an isolated checkout; browser runner was unavailable due to insufficient connected Browser Use credits. Do not infer these tests passed from static checks. Current automated Node test sources are committed, but their latest execution is pending.

No main merge, production deployment, GitHub Actions, Level 1 modification, or unsupported source/Wix upload was performed.

## Exact record lookup

- Existing 30 hosted WebP URLs: `src/data/finalBuild/level-2-wix-image-urls.json`
- Original 30 approved source/image references: `src/data/finalBuild/level-2-references.json`
- Original 150 verified checklist questions: `src/data/finalBuild/level-2-checklists.json`
- Owner-approved 30 PDF URLs and 150 general questions: `src/data/finalBuild/level-2-owner-approved-pdf-fallbacks.json`
- Source/image provenance for original WebPs: `src/data/finalBuild/level-2-image-provenance.json` (worker PR #109)
- Active adapter: `src/data/finalBuildLevel2Verified.ts` (shared PR #114)

### Completion boundary

**Complete for the requested owner-approved 60-variant draft inclusion and explicit PDF fallback data/UI integration.** Not complete as 60 independently recovered model-artwork WebPs; 30 remain PDF-only with honestly classified source. Not approved for production until actual latest-head Node, build, and mobile tests pass.
