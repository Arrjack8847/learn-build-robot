# BE STEM READY — Level 4 Final Build · Source, Artwork and QA Report

**Audit date:** 2026-11-23 (Asia/Kuala_Lumpur)  
**Repository:** `Arrjack8847/learn-build-robot`  
**Worker branch:** `feat/final-build-level-4`  
**Coordinated base:** `1fe5c5336d45295e6e3252d0450b662337a1db50` (PR #108)  
**Draft delivery:** [PR #111](https://github.com/Arrjack8847/learn-build-robot/pull/111)  
**Disposition:** **NOT YET APPROVED FOR STUDENT INTEGRATION.** Completed technical extraction and a 50-variant evidence package; approval is held for semantic/manual checklist review and mobile integration tests.

## Exact Level 4 source reconciliation

| Measure | Reconciled |
|---|---:|
| Official syllabus project records | 56 |
| Projects with independently registered Building PDFs | 48 |
| Wix-registered official Building variants | 50 |
| Distinct Basic/Optimized variant pairs | 2 |
| Syllabus projects lacking separate Building manuals | 8 |
| Hosted PDFs downloaded, parsed, SHA-256 calculated | **50/50** |
| Hosted PDF bytes matching historical canonical Git-blob SHA-1 | **50/50** |
| Hosted PDF page counts matching canonical audit | **50/50** |
| Total pages in current hosted Building PDFs | **1,029** |
| Hosted PDFs previously restored/cleaned in English | 4 (verified byte-for-byte canonical copies) |
| PDF-derived WebP files generated and committed | **50/50** |
| Image files decoded and re-hashed independently | **50/50** |
| Individual source-specific five-question *draft* sets | **50/50 (250 questions)** |
| Fully approved student variants / checklists | **0/50** |

The 50 PDFs were fetched **directly from their exact current Wix-hosted URLs** in an isolated Vercel Sandbox; the source corpus totaled **477,428,407 bytes**. Every PDF was parsed with PyMuPDF, SHA-256 calculated from actual bytes, page-count checked, and compared to the exact previously audited Git blob SHA-1, including all four repaired/English variants. Source filename, Wix URL or media descriptor alone never counted as verification.

Extractable Chinese character count was zero. This is **not** proof that Chinese is absent from every rasterized illustration. No inference of complete English visual sign-off is made.

## WebP extraction and independent validation

All 50 assets in `public/final-build/level-4/` were cropped by rendering a genuine completed-model page of the exact verified Wix-hosted Building PDF; not a synthetic reconstruction and not AI artwork. Each variant has its original PDF URL, PDF SHA-256, page count, exact 1-indexed source page, normalized crop geometry, decoded pixel width/height, WebP bytes and WebP SHA-256 in `level-4-references.json`.

A separate follow-on check rerendered every original PDF page and confirmed:

- 50/50 actual PDF SHA-256 matches, canonical Git blob matches and PDF page counts.
- 50/50 WebP hashes and decoder checks pass.
- 50/50 crops reproduce their source PDF render, with mean absolute per-channel pixel error **≤ 6.18 / 255**, median **2.81 / 255** after lossy WebP optimization.
- Eight visually busy final pages were improved by selecting only a completed-model image region already present on the **same page**, excluding neighboring intermediate-stage illustrations. The refined references are: `level-4-acoustic-control-lamp`, `level-4-card-machine`, `level-4-obstacle-avoidance-robot-2`, `level-4-radar-vehicle`, `level-4-ranging-robot`, `level-4-scorpion`, `level-4-smart-curtain`, `level-4-telegraph-machine`.

The independent report is `reports/final-build-level-4-independent-verification-20261123.json`, with each variant's outcome and pixel-reproduction measurements.

**Still unapproved:** visual crop fidelity checks do not alone prove each original image is sufficiently informative for every mechanical assembly or that all raster text is English; a separate semantic reviewer must confirm each model and the five questions. Authentic blue backgrounds in some original PDF drawings are retained, not painted away. The crops are deliberately labeled `candidate` and student approvals remain blocked.

## Checklists

Exactly five **different project/variant-specific draft questions** are present for each of the 50 variants: **250 questions** total. They refer to observable structures, mechanical connections, stable assembly, and intended actions as relevant, rather than copying one five-question template. Basic and Optimized Warrior With Claws and Dangerous Assassin have separate checklists.

Each draft carries its exact PDF SHA-256 and the genuine final-model source page as a citation. **The cited final-model page is sufficient to support the overall visual shape, not necessarily to prove every proposed operation or exact assembly-stage connector.** Questions requiring mechanism functionality or detailed construction remain explicitly `candidate-unverified`; they are not student-approved, and no reviewer identity is fabricated.

A manual-by-manual secondary audit of earlier assembly stages, operational requirements, physical validation where needed, and final checklist sign-off remains an acceptance gate.

## Syllabus-only projects blocked (8)

- `level-4-super-trajectory-robot-2` — Super Trajectory Robot 2: no separate registered official Building PDF; Learning material explicitly excluded.
- `level-4-tag-recognition` — Tag Recognition: no separate registered official Building PDF; Learning material explicitly excluded.
- `level-4-probe-vehicle` — Probe Vehicle: no separate registered official Building PDF; Learning material explicitly excluded.
- `level-4-vending-machine` — Vending machine: no separate registered official Building PDF; Learning material explicitly excluded.
- `level-4-voice-control` — Voice Control: no separate registered official Building PDF; Learning material explicitly excluded.
- `level-4-safe-box` — Safe Box: no separate registered official Building PDF; Learning material explicitly excluded.
- `level-4-back-up-buzzer` — Back-up buzzer: no separate registered official Building PDF; Learning material explicitly excluded.
- `level-4-counting-system` — Counting system: no separate registered official Building PDF; Learning material explicitly excluded.

## Every Level 4 Building variant (50)

All variants below have verified hosted source identity and an actual WebP candidate but are **not approved** because independent semantic crop and question sign-off is outstanding. Hash values shown are abbreviated; full SHA-256 digests and exact crop coordinates are stored in the manifests.

| # | Canonical variant | PDF pages | Hosted PDF SHA-256 | WebP SHA-256 | Checklist | Status |
|---:|---|---:|---|---|---|---|
| 01 | `level-4-a-timid-mouse` | 19 | `e9ac5e593ddd…` | `97dc96cbffc9…` | 5 drafted / 0 approved | Blocked |
| 02 | `level-4-acoustic-control-lamp` | 8 | `45920a00abe7…` | `1d9e0da1ed43…` | 5 drafted / 0 approved | Blocked |
| 03 | `level-4-architectural-design` | 24 | `f72353f118c8…` | `ac21c6efcc21…` | 5 drafted / 0 approved | Blocked |
| 04 | `level-4-basketball-shooting-machine` | 28 | `93bf7707b227…` | `58e7da729a34…` | 5 drafted / 0 approved | Blocked |
| 05 | `level-4-biped-robot` | 57 | `169d650bd25c…` | `13ca4f7465af…` | 5 drafted / 0 approved | Blocked |
| 06 | `level-4-card-machine` | 9 | `671419b9ba58…` | `82da7924cae9…` | 5 drafted / 0 approved | Blocked |
| 07 | `level-4-card-reader` | 12 | `775a08e70c33…` | `00544e9f0f78…` | 5 drafted / 0 approved | Blocked |
| 08 | `level-4-dancing-robot` | 22 | `56fc12edd9b8…` | `c95eeb48a19f…` | 5 drafted / 0 approved | Blocked |
| 09 | `level-4-dangerous-assassin` | 25 | `483cf6fc93e6…` | `f4334cc5f6b0…` | 5 drafted / 0 approved | Blocked |
| 10 | `level-4-dangerous-assassin:optimized` | 10 | `b7124c72dfe4…` | `ce3471643cba…` | 5 drafted / 0 approved | Blocked |
| 11 | `level-4-drop-proof-robot` | 7 | `4d03563a0b23…` | `065d838f0b98…` | 5 drafted / 0 approved | Blocked |
| 12 | `level-4-electric-piano` | 24 | `f213d33e8360…` | `da440fe9fdd1…` | 5 drafted / 0 approved | Blocked |
| 13 | `level-4-elf-in-the-tree` | 22 | `8959eefb533d…` | `2a5e34652934…` | 5 drafted / 0 approved | Blocked |
| 14 | `level-4-energy-detector` | 20 | `e9640dd6f2c4…` | `334032d3d3f2…` | 5 drafted / 0 approved | Blocked |
| 15 | `level-4-guide-dogs` | 13 | `9a7d464a2c40…` | `d15bcb7015ae…` | 5 drafted / 0 approved | Blocked |
| 16 | `level-4-horizontal-bar` | 13 | `738d2d9f9494…` | `1ddd868a96e8…` | 5 drafted / 0 approved | Blocked |
| 17 | `level-4-induction-desk-lamp` | 32 | `d9e7d3f86b14…` | `bb879443e8cc…` | 5 drafted / 0 approved | Blocked |
| 18 | `level-4-keeping-distance` | 21 | `5eb349561cd6…` | `c1d845aa0338…` | 5 drafted / 0 approved | Blocked |
| 19 | `level-4-laser-rangefinder` | 13 | `11a83c1c827a…` | `c116872ac97f…` | 5 drafted / 0 approved | Blocked |
| 20 | `level-4-lucky-cat` | 28 | `89b73dcd3a18…` | `f523fbf16899…` | 5 drafted / 0 approved | Blocked |
| 21 | `level-4-magnetically-controlled-door` | 22 | `34a31867abac…` | `0acc895312e7…` | 5 drafted / 0 approved | Blocked |
| 22 | `level-4-nocturnal-beetle` | 19 | `69dc6b1cf324…` | `fc74f46e52c8…` | 5 drafted / 0 approved | Blocked |
| 23 | `level-4-obstacle-avoidance-in-snow` | 6 | `314f2b6de021…` | `00e1cbb953de…` | 5 drafted / 0 approved | Blocked |
| 24 | `level-4-obstacle-avoidance-robot` | 16 | `cdabe137bad9…` | `686f7bcd1ffd…` | 5 drafted / 0 approved | Blocked |
| 25 | `level-4-obstacle-avoidance-robot-2` | 14 | `7f8d3a590ae9…` | `338550adfa55…` | 5 drafted / 0 approved | Blocked |
| 26 | `level-4-obstacle-avoiding-scorpion` | 22 | `68d46fa0e564…` | `a63d75d65d5a…` | 5 drafted / 0 approved | Blocked |
| 27 | `level-4-oscillating-fan` | 22 | `66c2a1fe6d97…` | `3c3542f00a5a…` | 5 drafted / 0 approved | Blocked |
| 28 | `level-4-parts-sorter` | 18 | `2d63f6103b58…` | `0d3127f5ec1b…` | 5 drafted / 0 approved | Blocked |
| 29 | `level-4-password-box` | 18 | `e8a7a80287ef…` | `0fcb71e90d54…` | 5 drafted / 0 approved | Blocked |
| 30 | `level-4-personal-bodyguard` | 21 | `49699fb79c9a…` | `c36ce68d7378…` | 5 drafted / 0 approved | Blocked |
| 31 | `level-4-radar-vehicle` | 9 | `547bdaf09766…` | `a5a0e395996b…` | 5 drafted / 0 approved | Blocked |
| 32 | `level-4-ranging-robot` | 13 | `d1805410ea68…` | `c6e13cdd0a68…` | 5 drafted / 0 approved | Blocked |
| 33 | `level-4-reaction-tester` | 12 | `500a49778f09…` | `1520b42773f7…` | 5 drafted / 0 approved | Blocked |
| 34 | `level-4-remote-control-car` | 24 | `404225c14b06…` | `132fb007788a…` | 5 drafted / 0 approved | Blocked |
| 35 | `level-4-scan-to-open-the-gate` | 22 | `63e04fa217e8…` | `b854199da122…` | 5 drafted / 0 approved | Blocked |
| 36 | `level-4-scorpion` | 17 | `720b56e9b045…` | `10f68ef4789a…` | 5 drafted / 0 approved | Blocked |
| 37 | `level-4-skiing-robot` | 31 | `35b4a3f0fccd…` | `355e1ad3f665…` | 5 drafted / 0 approved | Blocked |
| 38 | `level-4-smart-curtain` | 10 | `ac5df22f08de…` | `7bc020e70474…` | 5 drafted / 0 approved | Blocked |
| 39 | `level-4-smart-luggage` | 26 | `ca207ebacbf5…` | `2679d2cec317…` | 5 drafted / 0 approved | Blocked |
| 40 | `level-4-smart-speaker` | 20 | `1e0e24c20dd4…` | `e68f8cf36571…` | 5 drafted / 0 approved | Blocked |
| 41 | `level-4-spinning-cups` | 25 | `d5db4886f87a…` | `7b6afafebaa8…` | 5 drafted / 0 approved | Blocked |
| 42 | `level-4-swimming-plesiosaur` | 40 | `e4ef8698645f…` | `9b45d3963d0d…` | 5 drafted / 0 approved | Blocked |
| 43 | `level-4-tail-wagging-stegosaurus` | 45 | `f6eab78cbd9d…` | `3fd3105a4dac…` | 5 drafted / 0 approved | Blocked |
| 44 | `level-4-telegraph` | 25 | `4998a0fac5c0…` | `b41dd0975911…` | 5 drafted / 0 approved | Blocked |
| 45 | `level-4-telegraph-machine` | 11 | `b7ca205bfbc5…` | `67bcc9c0e209…` | 5 drafted / 0 approved | Blocked |
| 46 | `level-4-transformer-robot` | 26 | `26b60e1daa34…` | `63efd0a9e5c4…` | 5 drafted / 0 approved | Blocked |
| 47 | `level-4-tumbler` | 22 | `81374a0d4e3a…` | `8e7d83d056f6…` | 5 drafted / 0 approved | Blocked |
| 48 | `level-4-turbo-drop` | 34 | `e55cd2a9e9fd…` | `417ea5db9e1a…` | 5 drafted / 0 approved | Blocked |
| 49 | `level-4-warrior-with-claws` | 19 | `9f1f958c5853…` | `ccfcc6fa475a…` | 5 drafted / 0 approved | Blocked |
| 50 | `level-4-warrior-with-claws:optimized` | 13 | `a78fb82129ea…` | `7366eee03117…` | 5 drafted / 0 approved | Blocked |

## Locked shared challenge behavior — reviewed, not rewritten

The shared source contains the required 4.2-second scan, unbiased `crypto.getRandomValues` rejection sampling (repeats permitted), 15-minute absolute deadline, localStorage persistence, timeout-to-assessment transition and four-out-of-five self-assessment threshold. This worker made **no modifications** to Level 1, the scanner, timer, shared UI, other levels, or global approval file.

**Shared integration blockers remain:**

1. `getFinalBuildPool` still selects any source-registered variant rather than filtering the discovery pool to *approved* variants. The individual Start button is independently approval-gated; this alone does not meet the approved-only discovery requirement.
2. `FinalBuildExam` still calls its generic `checkDescriptions(name)` instead of reading the 50 Level 4 variant-specific checklists.
3. The shared approval rendering contract is PDF-page/crop based; it does not consume a Level 4 verified local WebP path.
4. An integration owner must implement those three changes without violating Level 4 worker scope. The global `finalBuildApprovals.json` stays all-unreviewed.

## Executed tests and mobile review

**Executed locally in the isolated Vercel Sandbox (not GitHub Actions):**

- `node --test tests/final-build-level-4.test.mjs`: **7 passed, 0 failed**, after all WebP files and final crop replacements were committed.
- Separate Python/Pillow independent decoder pass: **50/50 passed**.
- Separate hosted-PDF-vs-manifest-vs-image second pass: **50/50 passed** for byte hashes, page counts and crop-pixel fidelity.
- Both Basic/Optimized pairs maintain distinct URLs, WebP hashes, variant IDs and question text; all eight unavailable-source activities remain excluded.

**Not performed:** end-to-end browser/mobile visual QA at 320, 375, 390 or 430 CSS px. No authorized in-session device/browser test environment was used, and no unsupported claim of mobile-browser pass is made. Motion and refresh behavior are code-contract reviews, not fully exercised interactive tests.

## Release decision and unresolved evidence

**Complete:** current-source reconciliation, actual 50-PDF byte verification, 50 real-source WebP candidates (eight refined), complete source-and-artwork manifests, 250 individually drafted check items, independent pixel/decoder QA, exact URL mappings, local Node tests, isolated draft PR and detailed blocked-record inventory.

**Not complete / held:** independent close visual approval of every robot crop including fine mechanisms and raster language, source-manual verification and approval of five checklists per variant, approved-only discovery integration, local-WebP integration, real interactive/mobile device QA, production release. No unsupported question or image has been approved just to reach a count.

**No GitHub Actions, Browser Use, production deployment or merge were performed.**
