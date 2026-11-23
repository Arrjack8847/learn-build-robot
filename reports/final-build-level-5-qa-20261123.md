# BE STEM READY — Level 5 Final Build Challenge · QA / evidence report

Date: 2026-11-23 (Asia/Kuala_Lumpur)  
Branch: `feat/final-build-level-5`  
Coordinated PR #108 head: `1fe5c5336d45295e6e3252d0450b662337a1db50`  
Scope: Level 5-only audit/data/tests. No shared scanner, source PDFs, lockfiles or production files edited.

## Outcome — not release-ready

The source registration and URL mapping audit was completed from the exact coordinated Git commit. **No variant can safely enter the student scanner yet.** Robot images, evidence-page checklist questions and independently verified Wix PDF SHA-256 values are required before approvals. This worker intentionally does not fabricate finished-model pictures, behavior claims, page counts or green test results.

| Audit metric | Observed |
| --- | ---: |
| Official Level 5 syllabus registrations | 51 |
| Projects with registered official Building PDFs | 43 |
| Unique registered Building manual variants | 45 |
| Syllabus projects lacking official Building PDF registrations | 8 |
| Variants fully approved for student scanner | **0** |
| Variants blocked pending visual / source / checklist evidence | **45** |
| Faithfully extracted and reopened WebP files | 0 |
| Verified five-question assessment sets | 0 |

## Completed source-registration checks

- Reconciled 51 official entries from `src/data/levelFiveSixContent.ts`, 43 with registered Building manuals and 8 without.
- Cross-matched **45 distinct path records** against the exact Git tree, the Level 5 Wix URL mapping and `reports/level5-building-link-only-paths-20261119.json` with no missing registration.
- Captured the registered Git blob SHA-1 and byte size for each tracked original PDF, without mislabeling those values as SHA-256.
- Confirmed Curling Game and Crack Shot each have separate Basic and Optimized variant paths; their registrations are kept distinct.
- Confirmed the five recorded repaired projects currently resolve to the newest known corrected link. Chairoplane's November 20 replacement supersedes its older November 19 repaired link.

| Repaired project | Corrected mapping basis | Audit |
| --- | --- | --- |
| Spanish Bullfight | November 19 repaired link | Matched canonical mapping |
| Smart Cash Register | November 19 repaired link | Matched canonical mapping |
| Welcome Sign | November 19 repaired link | Matched canonical mapping |
| Chairoplane | November 20 superseding link | Matched canonical mapping |
| Machine Gun | November 19 repaired link | Matched canonical mapping |

## Historical PDF evidence and limits

`reports/level5-6-building-independent-verification-20261120.json` records 45 Level 5 Building PDFs and 1,031 pages, plus earlier hosted-byte and OCR checks across Levels 5–6. The report itself marks full independent human page-by-page certification as **false**. Its Level 5 Chairoplane entry identifies a 34-page corrected PDF with a November 20 replacement URL. Historical claims are recorded as provenance, not re-executed results.

This isolated worker could inspect registered GitHub source text and Git tree metadata, **but could not download and visually inspect the 45 Wix-hosted PDF binaries, calculate their live SHA-256 hashes, crop completed-model images or reopen exported WebP artwork**. Therefore neither English-only certification nor an image/crop approval is asserted. No source PDF or repository original was changed.

## Content files and gate

- `src/data/finalBuild/level-5-audit.json` — all 45 variants, original Git blob identity/size, Wix URL, correction provenance, missing evidence, blocked reasons; eight excluded syllabus activities.
- `src/data/finalBuild/level-5-references.json` — one blocked image-record per registered variant; no renderable approved references.
- `src/data/finalBuild/level-5-checklists.json` — one blocked checklist-record per variant; no speculative questions.
- `tests/final-build-level-5.test.mjs` — regression checks for exact source inventory, five repairs, Basic/Optimized pairs, approval integrity, WebP signature/dimensions and five page-evidenced checks when future images/questions are supplied.

**Approval rule:** source/hash/page/model crop/WebP/question claim evidence AND independent recheck must all pass together. Never approve solely because a Wix URL exists or an earlier PDF-cleaning report said it was repaired.

## Execution evidence

- Executed isolated connector-side JavaScript source assertions before commit: 51 projects, 43 Building projects, 45 variant paths, 8 excluded projects, 45 Wix mappings, 45 matching tracked Git objects, 5 corrected mappings, two variant pairs, unique IDs and explicit zero approvals.
- No GitHub Actions or Browser Use were invoked.
- `node --test tests/final-build-level-5.test.mjs`: **not executed here** because the remote repository and binary PDFs cannot be mounted into the available shell; the test file is prepared for a later isolated checkout.
- Interactive mobile rendering at 320 / 375 / 390 / 430 px: **not executed**. The integration worker owns shared Level 1 UI parity and browser-access security.
- No local PDF bytes, new exported robot WebPs, or independent visual recheck evidence are available. **Zero approved robots.**

## Next required approvals

For each variant: obtain current Wix PDF bytes and SHA-256, compare against its authoritative approved repaired binary, inspect finished-model page/crop visually, export original-faithful WebP and reopen it, author exactly five manual-cited checks, revalidate independently, and only then mark it approved. Preserve both Basic/Optimized entries, review Chairoplane against the November 20 repair, run the Node regression test on a real checkout, and perform viewport QA under integration ownership.

**Release recommendation:** Keep all 45 variants unavailable until individually approved. Do not merge this draft as a release candidate.
