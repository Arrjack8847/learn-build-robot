# BE STEM READY — Level 2 Final Build QA (2026-11-23)

## Scope and ownership
- Repository: `Arrjack8847/learn-build-robot`
- Reference PR: [#108](https://github.com/Arrjack8847/learn-build-robot/pull/108), branch `feat/final-build-exams-levels-1-6`
- **Exact reference base SHA**: `1fe5c5336d45295e6e3252d0450b662337a1db50` (read from PR metadata immediately before the isolated branch was created)
- Worker branch: `feat/final-build-level-2`
- No main merge; no GitHub Actions; no Browser Use; no shared scanner, timer, CSS, Level 1 or Levels 3–6 edits.

## Registry reconciliation
| Metric | Expected baseline | Derived from live PR #108 registries |
| --- | ---: | ---: |
| Official syllabus projects | 59 | 59 |
| Building source projects (canonical syllabus identities) | 59 | 59 |
| Registered Building PDF variants | 60 | 60 |
| Distinct Wix PDF URLs | 60 | 60 |
| Previously repaired Wix mappings | not specified | 36 |
| Other (legacy) Wix mappings | not specified | 24 |
| **Independently approved** | n/a | **0** |
| **Blocked** | n/a | **60** |
| **Unresolved registration identities** | n/a | **0** |

**Discrepancy explained:** The 59-to-60 difference is *See Saw*, whose two legitimate separately registered variant IDs are `level-2-see-saw-v1` (`Balance.pdf`) and `level-2-see-saw-v2` (`Balance_v2.pdf`). This is a two-manual project, not a 60th syllabus activity. The existing shared registry groups both under scanner project ID `level-2-see-saw-v1`. Category-specific Crane entries are distinct projects and retain their canonical IDs.

### Registration source evidence
- `src/data/advancedSyllabus.ts`: official Level 2 source entries/categories.
- `src/data/practical.ts`: canonical Level 2 project registrations.
- `src/data/pdfActivityManuals.ts`: Building PDF mappings.
- `src/data/levelOneToThreeWixPdfUrls.ts`: current hosted Wix URLs.
- `reports/building-english-levels1-4-wix-links-20261119.json`: historical repaired Wix mapping and **Git-object SHA-1** records (36 Level 2).
- `reports/level1-4-building-wix-final-verification-20261120.json`: historical Wix Media Manager descriptor/byte-check claims. They are not a new worker review.
- `reports/level2-eight-cjk-wix-remediation-20261120.json`: **Learning** PDF cleanup of 43 eligible documents; does **not** establish the 60 Building source identities.

## Source verification: blocked, not falsely approved
The available GitHub integration fetched the current text registries and prior reports, but its GitHub retrieval endpoint rejects binary/non-UTF-8 PDF payloads. The isolated local container could not resolve the external GitHub host; direct public-Wix document access also failed in the available document viewer. **Consequently no actual hosted Building PDF bytes were acquired in this run.** No SHA-256 hashes, source page counts, page-by-page visual identities, English-cleaning pass confirmations, model image crops, or WebP outputs were computed.

All 60 variants are **blocked pending independent PDF-byte and visual inspection**. Historical SHA-1 values are separately labeled in the audit; they must not be treated as document SHA-256. Blocked is an approval state, not a claim that all URLs are defective. All 60 variants have reconciled source identity mappings, so unresolved *registration* identities = 0; pending source verification = 60.

## Images, checklist and approval passes
- Approved images: **0**. No invented or AI-generated finished-robot pictures.
- Approved manual-specific five-question checklists: **0**. No title-heuristic substitutes.
- First-pass independently approved: **0**; second-pass independently approved: **0**.
- `level-2-references.json` and `level-2-checklists.json` intentionally have zero approvals; the 60 explicit blocked IDs are recorded.
- The global approvals manifest was not edited.
- No new PDFs or WebPs were committed: no WebP can be authentic without visual source confirmation.

## Shared architecture review — integration-worker issues (no shared files changed)
1. **Scanner draw eligibility:** `getFinalBuildPool(2)` currently selects all registered Wix Building candidates; `FinalBuildExam` gates **Start** on approval only after discovery. The user requires fair random discovery from *approved projects only*. Integration must apply the exact approved-project/variant filter **before** unbiased selection (and handle an empty approved set).
2. **Checklist fidelity:** shared `checkDescriptions(name)` currently invents five generic checks based on name heuristics; it does not read page-cited Level 2 checklist records. Integration must substitute exact approved variant-specific five-question checklists, never generic guessed checks.
3. **Image consumption:** shared approval structure expects `page` + normalized PDF `crop` and renders the Wix PDF dynamically, while Level 2 deliverable requires separately extracted, independently verified WebPs. Integration needs an explicit approved WebP reference contract, URL+hash binding, and fallback denial; do not silently replace a blocked or missing image with a PDF crop.
4. **Parity checks from source review only:** 4,200 ms scanner constant, 15-minute deadline, persistent storage, five-checkbox threshold 4/5, retry and simple result are present. These are **static source observations**, not interactive QA.

## Tests and QA
- **PASS (connector-side code-data reconciliation):** 59 syllabus identities; 60 Level 2 project/manual registrations; 60 resolvable distinct Wix links; 36 historical remediated links; 24 other registered links; See Saw V1/V2 correctly grouped.
- **Not run:** local `node --test tests/final-build-level-2.test.mjs` against the complete repository (checkout unavailable in this execution environment); pending integration runner or authorized local workspace.
- **Not run:** actual source PDF hashing and page counts, screenshot checks, visual WebP double-pass QA, and client-rendered viewport tests at 320, 375, 390 and 430 px.
- **Not run:** interactive browser/device QA; not inferred from source inspection.
- New level-owned test file checks 60-variant manifest consistency, historical SHA attribution, blocked exclusion, source registration, approved-image metadata/checklist evidence when approval becomes available, and static route parity.

## Status and next authorized execution requirements
**NOT independently verified; NOT integration-ready; NOT production-ready.** Before a source variant can be approved, use a runtime able to download each actual Wix Building PDF, inspect original/cleaned source with page screenshots, compute PDF SHA-256 and page count, isolate a genuine finished-model photograph, export/reopen its WebP, write five page-cited checks, perform a second independent verification, and run tests. Integration should resolve the three shared-contract defects above.

This report reports only work that was actually performed; historical report claims remain historical evidence.
