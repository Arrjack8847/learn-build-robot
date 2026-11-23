# BE STEM READY — Level 6 Final Build Challenge QA
**Audit date:** 2026-11-23 (Asia/Kuala_Lumpur)  
**Repository:** `Arrjack8847/learn-build-robot`  
**Dedicated worker branch:** `feat/final-build-level-6`  
**Coordinated base:** PR #108, `feat/final-build-exams-levels-1-6`, SHA `1fe5c5336d45295e6e3252d0450b662337a1db50`  
**Status:** DRAFT / BLOCKED — **NOT** approved for students, integration merge or production release.

## Executive outcome
| Metric | Actual result |
| --- | ---: |
| Official syllabus activities | 43 |
| Projects with registered Building manuals | 39 |
| Registered Building PDF variants reconciled | 41 |
| Activities missing separate Building PDFs | 4 |
| Individually approved finished-model WebPs | 0 |
| Verified 5-question checklists | 0 |
| Approved variants | 0 |
| Blocked variants | 41 |
| Independent metadata assertions passed | 339 |
| Direct PDF binaries downloaded and SHA-256-verified this run | 0 |
| Student-visible records released | 0 |

The 41 Building variants and four missing-source activities are represented explicitly in `src/data/finalBuild/level-6-audit.json`. The `level-6-references.json` and `level-6-checklists.json` files track the same 41 canonical IDs with blocked status. **No PDF identity, final-model crop, WebP hash, or question page reference has been invented.**

## Source status and version provenance
- Canonical Level 6 lessons: `src/data/levelFiveSixContent.ts`; official syllabus: `src/data/advancedSyllabus.ts`; live code mapping: `src/data/levelSixWixPdfUrls.ts` at the coordinated base.
- Prior dated evidence (`reports/level6-building-cover-audit-20261119.json`) records 41 original PDF blob SHA-1 values and 1,007 original pages. Those original Git blob hashes are **not** SHA-256 hashes of currently served Wix replacements.
- Prior dated evidence (`reports/level5-6-building-independent-verification-20261120.json` and `reports/level6-building-link-only-paths-20261120.json`) states that 41/41 Level 6 Wix Building URLs served expected or approved versions, with PDF HTTP range support and CORS on 2026-11-20. This worker did not repeat that byte comparison.
- The prior independent report explicitly says that complete human page-by-page visual English-only certification was **not** performed. This report makes no English-only claim.
- No existing source PDF binaries, cleaning work, other levels, or Wix mapping values were modified.

### Repaired source mappings preserved
| Manual | Current mapped Wix object | Current-turn status |
| --- | --- | --- |
| Rock-paper-scissors Robot | `78042f_ee943e948c6f4141b53d9d3e90481801.pdf` | Registered repaired mapping retained; fresh bytes not redownloaded |
| Pay by card | `78042f_4509b73b391142b3866b767bdb5bbc6e.pdf` | Registered repaired mapping retained; fresh bytes not redownloaded |
| Product Search | `78042f_6ece41989cab43b3a0a3a58f5586a493.pdf` | Registered repaired mapping retained; fresh bytes not redownloaded |
| Red Light Warning Device | `78042f_613e0c239ba64e96ba94d3088dff2c3d.pdf` | Registered repaired mapping retained; fresh bytes not redownloaded |

Red Light Warning Device has the separately documented page-9 replacement in the 2026-11-20 independent-verification report. The other three corrected mappings are preserved as found in the current registry. Historic English repairs are not used as new approval certificates.

## Full 41-variant registration and outcome audit
The complete URL, variant ID, source path, historical original SHA-1, reported page count, block reasons, review states and evidence provenance appear in `src/data/finalBuild/level-6-audit.json`. The table below provides a compact, complete index.

| # | Canonical project | Variant | Original pages (reported) | Status |
| ---: | --- | --- | ---: | --- |
| 1 | Gorilla | Official Building Manual | 24 | **Blocked** |
| 2 | Picture Projector | Official Building Manual | 11 | **Blocked** |
| 3 | The Flapping Pterosaur | Official Building Manual | 70 | **Blocked** |
| 4 | Code-scanning Gate | Official Building Manual | 27 | **Blocked** |
| 5 | Intelligent Passing Light | Official Building Manual | 18 | **Blocked** |
| 6 | Gesture-commanding Car | Official Building Manual | 18 | **Blocked** |
| 7 | Regional Weather Station | Official Building Manual | 51 | **Blocked** |
| 8 | Super Scorpion | Basic | 42 | **Blocked** |
| 9 | Super Scorpion | Optimized | 3 | **Blocked** |
| 10 | Clown | Official Building Manual | 20 | **Blocked** |
| 11 | Accurate Shooting | Official Building Manual | 30 | **Blocked** |
| 12 | Digital Countdown | Official Building Manual | 21 | **Blocked** |
| 13 | Red Light Warning Device | Official Building Manual | 12 | **Blocked** |
| 14 | Smart Flashlight | Official Building Manual | 15 | **Blocked** |
| 15 | Traffic Lights Display | Official Building Manual | 18 | **Blocked** |
| 16 | Pinball Machine | Official Building Manual | 24 | **Blocked** |
| 17 | Smart Fan | Official Building Manual | 37 | **Blocked** |
| 18 | The Interesting Rotor | Official Building Manual | 48 | **Blocked** |
| 19 | Combination Lock | Official Building Manual | 26 | **Blocked** |
| 20 | Gibbon | Basic | 16 | **Blocked** |
| 21 | Gibbon | Optimized | 10 | **Blocked** |
| 22 | Pay by card | Official Building Manual | 17 | **Blocked** |
| 23 | Product Search | Official Building Manual | 24 | **Blocked** |
| 24 | Punch Hard | Official Building Manual | 16 | **Blocked** |
| 25 | RC Airplane | Official Building Manual | 26 | **Blocked** |
| 26 | Ring Toss Game | Official Building Manual | 32 | **Blocked** |
| 27 | Robotic Arm | Official Building Manual | 37 | **Blocked** |
| 28 | Vending Machine | Official Building Manual | 23 | **Blocked** |
| 29 | Autonomous Driving | Official Building Manual | 17 | **Blocked** |
| 30 | Minesweeper Robot | Official Building Manual | 28 | **Blocked** |
| 31 | Remote Control Lift | Official Building Manual | 33 | **Blocked** |
| 32 | Saluting Robot | Official Building Manual | 20 | **Blocked** |
| 33 | Smart Electric Drill | Official Building Manual | 19 | **Blocked** |
| 34 | Altimeter | Official Building Manual | 13 | **Blocked** |
| 35 | High Temperature Alarm | Official Building Manual | 23 | **Blocked** |
| 36 | Intelligent Sorting Machine | Official Building Manual | 33 | **Blocked** |
| 37 | Parcel Sorting Machine | Official Building Manual | 39 | **Blocked** |
| 38 | Colorblind Assistant Robot | Official Building Manual | 14 | **Blocked** |
| 39 | Rock-paper-scissors Robot | Official Building Manual | 14 | **Blocked** |
| 40 | Smart Camera | Official Building Manual | 14 | **Blocked** |
| 41 | Tricycle | Official Building Manual | 24 | **Blocked** |

### Four syllabus activities without registered Building PDFs
- **Matador** (`level-6-matador`): no standalone registered Building manual; Learning slides are not substituted.
- **Dancing Robot** (`level-6-dancing-robot`): no standalone registered Building manual; Learning slides are not substituted.
- **Finger-guessing Robot** (`level-6-finger-guessing-robot`): no standalone registered Building manual; Learning slides are not substituted.
- **Ball Tracking** (`level-6-ball-tracking`): no standalone registered Building manual; Learning slides are not substituted.

## Verification process — actual execution
**Pass 1 (registry preparation): COMPLETE, metadata only.** Read the coordinated base directly through GitHub, parsed the official lesson/syllabus/Wix dictionaries, matched the 41 original cover-audit records and the Level 6 link-only path manifest, and wrote Level 6-only JSON files.

**Pass 2 (independent metadata check): PASS — 339 assertions.** In a separate execution, re-fetched the committed branch files and compared all IDs, paths, URLs, blocked states, image/checklist omissions, historic-vs-current hash separation and per-variant second-pass flags against the unchanged canonical registry. No image or PDF was approved.

**Current PDF access:** Direct public Wix PDF openings for Rock-paper-scissors Robot and Super Scorpion were attempted but the available PDF access path returned inaccessible-resource errors. No PDF bytes were downloaded here, so current PDF SHA-256 hashes, exact version bytes and completed-model pages remain unconfirmed.

**Node/TypeScript execution:** `node --test`, `npm run test:final-build`, and `npm run build` were **not run** against a local repository checkout; the runtime could not resolve GitHub for cloning. No success result is claimed. `tests/final-build-level-6.test.mjs` is committed for execution in an authorized isolated checkout. Tests are not added to global `package.json` scripts because this worker may not modify global files.

**Image QA:** No source-authentic robot was cropped. No `public/final-build/level-6/*.webp` files were generated, and image hashes, dimensions and post-conversion visual QA are not available. This is a required blocking condition, not a passed test.

**Mobile QA:** 320, 375, 390 and 430 px viewport testing was **not executed**. No authorized runnable local/interactive visual test environment was available under the worker's constraints. The shared code was read, but static review does not substitute for Safari/browser testing.

## Shared Final Build contract — inspection
- PR #108's shared engine defines `SCAN_MS = 4200` and `LIMIT_MS = 15 * 60 * 1000`; strict deadline, reload persistence, expiry into assessment, `acknowledgedFinish` gating, 4/5 checkbox pass criterion and unlimited retry choices exist in the inspected shared component.
- Uniform cryptographic rejection sampling is implemented in the existing `secureRandomIndex`; manual variants are grouped by registered project.
- **Integration issue:** `getFinalBuildPool(level)` currently filters for **registered Building PDFs**, not approved images. This means the scanner may discover locked, unapproved projects; student exam start remains separately gated by approved reference and successful PDF rendering. The final integration worker must change the selection pool to verified-only after approval data are populated.
- **Integration issue:** The shared `checkDescriptions(project.name)` currently generates generic five-item checklists, not source-page-supported Level 6-specific questions. The integration worker must wire the approved Level 6 checklist manifest by project/variant after substantive PDF review.
- These shared component changes are **out of this worker's allowed file scope**, so neither engine nor global approvals were altered.

## Test and review commands for an authorized isolated checkout
```bash
git fetch origin feat/final-build-level-6
git switch --detach origin/feat/final-build-level-6
node --test tests/final-build-level-6.test.mjs
npm run test:final-build
npm run test:level56
npm run build
```
Run mobile browser checks at **320, 375, 390 and 430 px** only in an authorized test environment; review the four repaired PDF variants first, then both distinct Basic/Optimized variants for Super Scorpion and Gibbon.

## Required before integration signoff
1. For each of 41 variants, freshly retrieve the current Wix-hosted Building PDF and record immutable SHA-256, actual page count, provenance and exact source identity; compare corrected Wix replacements instead of blindly comparing against obsolete GitHub original bytes.
2. Independently identify the real final assembled model, record the exact source PDF page and normalized crop, and exclude instruction diagrams/text from the student picture. Export original-authentic, optimized, individually inspected WebP and record its SHA-256 and dimensions.
3. Write exactly five observable questions tied to identified PDF pages for each approved variant; review Basic/Optimized differences independently. A project title or programming example alone is not sufficient evidence.
4. Conduct an independent image/content verifier pass. Only after source, WebP, questions, hashes and reviewer are all certified may a variant move from `blocked` to `approved`.
5. Integrate approved Level 6 references and question sets into the existing Level 1 shared engine, and ensure the random discovery pool is approved-only. No separate Level 6 engine.
6. Execute Node tests, existing regressions, production-equivalent isolated build, mobile viewport/device checks, timer expiry/reload/retry behavior. Capture actual logs, screenshots and failures.
7. Final integration worker alone handles global approval manifest and production deployment. Do not merge this blocked draft into main or release incomplete robots.

## File ownership / safety attestation
Only four new Level 6 scoped data/test files and this Level 6 report are proposed. No GitHub Actions, browser-use automation, edits to old source PDFs, global dependencies, shared screens, routes, other levels, main or production configurations were performed.

