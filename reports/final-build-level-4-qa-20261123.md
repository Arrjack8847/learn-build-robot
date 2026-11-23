# BE STEM READY — Level 4 Final Build · Independent Audit and QA

**Date:** 2026-11-23 (Asia/Kuala_Lumpur)  
**Branch:** `feat/final-build-level-4`  
**Master PR:** [#108](https://github.com/Arrjack8847/learn-build-robot/pull/108)  
**Exact coordinated base SHA:** `1fe5c5336d45295e6e3252d0450b662337a1db50`  
**Scope:** Level 4 data, Level 4 assets, isolated tests and this report only.

## Decision: not integration-ready; no student approvals

The registry has **56 official syllabus activities**, **48 registered Building-source projects**, **50 mapped official Building PDF variants**, and **8 activities without a separately registered Building source**. Two projects have Basic and Optimized variants: **Warrior With Claws** and **Dangerous Assassin**.

**Approved references: 0/50. Approved five-question checklists: 0/50. Blocked variants: 50/50.** This is an evidence-preserving audit, not completed image/checklist production. The user requirement to retain uncertain records blocked takes precedence over any target approval count.

The source data were re-read from the PR #108 base registry and matched exactly by canonical project ID and registered Wix URL. Previous `level4-building-cover-audit-20261119.json` records PDF page counts of repository original files, and the 2026-11-20 Wix descriptor report previously says the registered media existed. Neither fact proves present-day downloaded Wix byte identity, the finished-model image, or a valid crop.

### Limits and verification evidence

- **Current-registry reconciliation:** Completed for all 50 registrations. Each maps to one Level 4 syllabus ID and one current Level 4 Wix Building URL.
- **Historical PDF evidence:** The prior Level 4 cover audit covers 50 original PDFs; its `blob_sha` values are **Git SHA-1 object IDs**, not hosted PDF SHA-256 hashes. Its page counts are historical original-file observations, not fresh Wix page-count checks.
- **Historical English restorations:** 4 Level 4 hosted PDFs have prior repaired English versions (Swimming Plesiosaur, Telegraph, Turbo Drop, Lucky Cat), according to the 2026-11-19 delivery manifest. A previous report says those repaired uploads were byte-verified; they were **not** independently re-downloaded in this run.
- **Hosted PDFs:** Direct binary access/download was unavailable in the accessible runtime. An attempted Git PDF-blob read failed with an incompatible binary/text decoding error, and a representative direct Wix URL could not be opened by the web source. Consequently **no hosted PDF SHA-256, authoritative page count or visual identity** was independently established.
- **WebP:** No finished-model photos were extracted, no images were synthesized, and no files were marked approved. No decoder or visual inspection claim is made.
- **Checklists:** No per-manual evidence pages were readable; rather than invent five questions from titles, each variant has an explicit blocked checklist entry. Five specific questions and independent sign-off are required for *each* approved variant.
- **Tests:** The new `tests/final-build-level-4.test.mjs` checks all 50 registrations, URL/variant identity, fallback exclusions, historical evidence types, checklist gates and byte-level WebP decode when any approved file exists. The new test file was **not executed with Node against a local repository checkout**: network and checkout access in this runtime were unavailable. In-memory source reconciliation and manifest invariants were evaluated during preparation. Do not interpret that as a passed Node suite.
- **Mobile:** No authorized rendered mobile test environment was used; visual checks at 320, 375, 390 and 430 px remain outstanding.

## Blocked syllabus-only projects (8)

- `level-4-super-trajectory-robot-2` — Super Trajectory Robot 2: no independently registered official Building PDF; Learning fallback is excluded.
- `level-4-tag-recognition` — Tag Recognition: no independently registered official Building PDF; Learning fallback is excluded.
- `level-4-probe-vehicle` — Probe Vehicle: no independently registered official Building PDF; Learning fallback is excluded.
- `level-4-vending-machine` — Vending machine: no independently registered official Building PDF; Learning fallback is excluded.
- `level-4-voice-control` — Voice Control: no independently registered official Building PDF; Learning fallback is excluded.
- `level-4-safe-box` — Safe Box: no independently registered official Building PDF; Learning fallback is excluded.
- `level-4-back-up-buzzer` — Back-up buzzer: no independently registered official Building PDF; Learning fallback is excluded.
- `level-4-counting-system` — Counting system: no independently registered official Building PDF; Learning fallback is excluded.

## Every blocked/uncertain Building variant (50)

**Common required evidence for each entry:** hosted PDF SHA-256 and page count; English/robot/variant identity inspection; genuine finished-model page and crop; extracted and decoder-validated WebP plus image SHA-256; five variant-specific questions with manual page evidence and independent reviewer sign-off.

† Pages below are from the **prior original-repository PDF audit**, **not** independently validated current Wix PDF page counts.

| # | Canonical variant ID | Variant label | Prior pages† | Prior English repair | Approval |
|---:|---|---|---:|---|---|
| 1 | `level-4-a-timid-mouse` | Official Building Manual | 19† | No | **Blocked** |
| 2 | `level-4-acoustic-control-lamp` | Official Building Manual | 8† | No | **Blocked** |
| 3 | `level-4-architectural-design` | Official Building Manual | 24† | No | **Blocked** |
| 4 | `level-4-basketball-shooting-machine` | Official Building Manual | 28† | No | **Blocked** |
| 5 | `level-4-biped-robot` | Official Building Manual | 57† | No | **Blocked** |
| 6 | `level-4-card-machine` | Official Building Manual | 9† | No | **Blocked** |
| 7 | `level-4-card-reader` | Official Building Manual | 12† | No | **Blocked** |
| 8 | `level-4-dancing-robot` | Official Building Manual | 22† | No | **Blocked** |
| 9 | `level-4-dangerous-assassin` | Basic | 25† | No | **Blocked** |
| 10 | `level-4-dangerous-assassin:optimized` | Optimized | 10† | No | **Blocked** |
| 11 | `level-4-drop-proof-robot` | Official Building Manual | 7† | No | **Blocked** |
| 12 | `level-4-electric-piano` | Official Building Manual | 24† | No | **Blocked** |
| 13 | `level-4-elf-in-the-tree` | Official Building Manual | 22† | No | **Blocked** |
| 14 | `level-4-energy-detector` | Official Building Manual | 20† | No | **Blocked** |
| 15 | `level-4-guide-dogs` | Official Building Manual | 13† | No | **Blocked** |
| 16 | `level-4-horizontal-bar` | Official Building Manual | 13† | No | **Blocked** |
| 17 | `level-4-induction-desk-lamp` | Official Building Manual | 32† | No | **Blocked** |
| 18 | `level-4-keeping-distance` | Official Building Manual | 21† | No | **Blocked** |
| 19 | `level-4-laser-rangefinder` | Official Building Manual | 13† | No | **Blocked** |
| 20 | `level-4-lucky-cat` | Official Building Manual | 28† | Yes | **Blocked** |
| 21 | `level-4-magnetically-controlled-door` | Official Building Manual | 22† | No | **Blocked** |
| 22 | `level-4-nocturnal-beetle` | Official Building Manual | 19† | No | **Blocked** |
| 23 | `level-4-obstacle-avoidance-in-snow` | Official Building Manual | 6† | No | **Blocked** |
| 24 | `level-4-obstacle-avoidance-robot` | Official Building Manual | 16† | No | **Blocked** |
| 25 | `level-4-obstacle-avoidance-robot-2` | Official Building Manual | 14† | No | **Blocked** |
| 26 | `level-4-obstacle-avoiding-scorpion` | Official Building Manual | 22† | No | **Blocked** |
| 27 | `level-4-oscillating-fan` | Official Building Manual | 22† | No | **Blocked** |
| 28 | `level-4-parts-sorter` | Official Building Manual | 18† | No | **Blocked** |
| 29 | `level-4-password-box` | Official Building Manual | 18† | No | **Blocked** |
| 30 | `level-4-personal-bodyguard` | Official Building Manual | 21† | No | **Blocked** |
| 31 | `level-4-radar-vehicle` | Official Building Manual | 9† | No | **Blocked** |
| 32 | `level-4-ranging-robot` | Official Building Manual | 13† | No | **Blocked** |
| 33 | `level-4-reaction-tester` | Official Building Manual | 12† | No | **Blocked** |
| 34 | `level-4-remote-control-car` | Official Building Manual | 24† | No | **Blocked** |
| 35 | `level-4-scan-to-open-the-gate` | Official Building Manual | 22† | No | **Blocked** |
| 36 | `level-4-scorpion` | Official Building Manual | 17† | No | **Blocked** |
| 37 | `level-4-skiing-robot` | Official Building Manual | 31† | No | **Blocked** |
| 38 | `level-4-smart-curtain` | Official Building Manual | 10† | No | **Blocked** |
| 39 | `level-4-smart-luggage` | Official Building Manual | 26† | No | **Blocked** |
| 40 | `level-4-smart-speaker` | Official Building Manual | 20† | No | **Blocked** |
| 41 | `level-4-spinning-cups` | Official Building Manual | 25† | No | **Blocked** |
| 42 | `level-4-swimming-plesiosaur` | Official Building Manual | 40† | Yes | **Blocked** |
| 43 | `level-4-tail-wagging-stegosaurus` | Official Building Manual | 45† | No | **Blocked** |
| 44 | `level-4-telegraph` | Official Building Manual | 25† | Yes | **Blocked** |
| 45 | `level-4-telegraph-machine` | Official Building Manual | 11† | No | **Blocked** |
| 46 | `level-4-transformer-robot` | Official Building Manual | 26† | No | **Blocked** |
| 47 | `level-4-tumbler` | Official Building Manual | 22† | No | **Blocked** |
| 48 | `level-4-turbo-drop` | Official Building Manual | 34† | Yes | **Blocked** |
| 49 | `level-4-warrior-with-claws` | Basic | 19† | No | **Blocked** |
| 50 | `level-4-warrior-with-claws:optimized` | Optimized | 13† | No | **Blocked** |

## Shared engine compatibility and integration blockers

1. **Approved-only project discovery is not enforced at scanner pool creation.** Shared `getFinalBuildPool` currently uses `variants.length > 0`; it does not filter to evidence-approved projects. Shared `FinalBuildExam` blocks Start on unapproved references, which is useful but **not** the same as approved-only discovery. Integration owner must fix; this Level 4 worker must not edit shared code.
2. **The shared exam currently generates generic `checkDescriptions(name)` questions.** It does not consume independently checked per-variant Level 4 checklists. Integration must load the approved checklist source, with no fallback to title heuristics in student mode.
3. **The shared viewer renders PDF page/crop approval, not optimized local WebP assets.** Integration must adapt the approved reference contract without bypassing PDF/source/image hash gates.
4. The master source supports a 4,200 ms scan, cryptographically unbiased random index with repeats, 15-minute absolute deadline, persisted storage, self-assessment, and retry. These were reviewed as source-level contracts, **not browser-verified end-to-end behavior**.
5. Timeout with assessment allowed but not timed-pass, 4/5 pass threshold, persistent finish, scanner appearances and 320/375/390/430 mobile widths all need integration/device regression tests. No shared-engine files were edited.

## Release gates

- [x] Reconcile current registrations to 56 / 48 / 50 / 8
- [x] Record exact coordinated base SHA and isolate Level 4 branch
- [x] Preserve separate Basic/Optimized variant identities
- [x] Trace previous original-file hashes/page counts and four previously repaired hosted PDFs without calling them SHA-256
- [x] Create 50 blocked reference records, 50 blocked checklist records and audit record for all eight missing-source projects
- [x] Author Level 4 regression tests; source/manifest structural assertions evaluated during preparation
- [ ] Independently download and inspect all 50 actual Wix Building PDFs; capture SHA-256 and hosted page count
- [ ] Extract and visually verify model-only cropped WebP references
- [ ] Write and independently approve five manual-specific questions per approved variant, with evidence pages
- [ ] Decode final WebPs and run `node --test tests/final-build-level-4.test.mjs` against a checked-out repository
- [ ] Complete mobile device test and shared-engine integration
- [ ] Separate integration approval and release decision

**No GitHub Actions, Browser Use, production deployment or merge was performed.**
