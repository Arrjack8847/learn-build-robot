# BE STEM READY — Level 3 Final Build Challenge QA / 2026-11-23

**Branch:** `feat/final-build-level-3`  
**Pinned PR #108 base SHA:** `1fe5c5336d45295e6e3252d0450b662337a1db50`  
**PR integration target:** `feat/final-build-exams-levels-1-6` — no main merge.

## Verdict: BLOCKED, fail closed

Canonical source registration audit succeeded, but remote Wix PDF bytes could not be fetched in this worker environment. Attempts via the document reader were refused and local container external DNS was unavailable. This worker did **not** compute current PDF SHA-256, review every current English-only page, extract actual finished-model WebPs, verify WebP crops or create evidence-grounded checklist questions. All 42 variants remain blocked. No guessed URL, synthetic artwork, speculative checklist or global approval was added.

## Current source-registration counts

| Metric | Recalculated | Expected |
|---|---:|---:|
| Syllabus projects | 48 | 48 |
| Building-source projects | 39 | 39 |
| Registered variants | 42 | 42 |
| Unique Building Wix PDFs | 40 | 40 |
| Missing independently verified Building projects | 9 | 9 |
| Approved WebP references | 0 | Verified only |
| Blocked references | 42 | 42 |
| Approved checklists | 0 | Only for approved references |

Recalculated from the pinned `advancedSyllabus`, `practicalProjects`, `pdfActivityManuals`, `staticPdfUrl` and `levelOneToThreeWixPdfUrls`. The 42 records include Cycle Sport Basic/Optimized, Race Walking Basic/Optimized/Optimized+Ratchet, and two shared PDFs across different syllabus categories (Bumper car and Electric fan).

## Nine excluded activities

- **Super Trajectory Robot 1** (`level-3-super-trajectory-robot-1`) — PowerPoint-derived source only; no separate eligible Building registration.
- **Stag beetle** (`level-3-stag-beetle`) — PowerPoint-derived source only; no separate eligible Building registration.
- **Line patrol car** (`level-3-line-patrol-car`) — PowerPoint-derived source only; no separate eligible Building registration.
- **Money detector** (`level-3-money-detector`) — PowerPoint-derived source only; no separate eligible Building registration.
- **Parking gate** (`level-3-parking-gate`) — PowerPoint-derived source only; no separate eligible Building registration.
- **Blood bank Centrifuge** (`level-3-blood-bank-centrifuge`) — PowerPoint-derived source only; no separate eligible Building registration.
- **Drawbridge** (`level-3-drawbridge`) — PowerPoint-derived source only; no separate eligible Building registration.
- **Fire ladder** (`level-3-fire-ladder`) — PowerPoint-derived source only; no separate eligible Building registration.
- **Sign** (`level-3-sign`) — PowerPoint-derived source only; no separate eligible Building registration.

## Complete variant ledger (42 / 42 outcomes)

Full registered Wix URLs, file/version IDs, prior SHA-1 and page-count evidence, null current SHA-256, model provenance fields and two-pass status live in `src/data/finalBuild/level-3-references.json` and `src/data/finalBuild/level-3-audit.json`. Listed page counts are historical (2026-11-19), not reverified.

| # | Project | Variant registration | PDF filename | Prior pages | Result |
|---:|---|---|---|---:|---|
| 1 | Clip robot | level-3-clip-robot | Clip robot_Building.pdf | 30 | BLOCKED |
| 2 | Cycle Sport | level-3-cycle-sport-basic | 3. Cycle Sport-Basic Building Manual.pdf | 21 | BLOCKED |
| 3 | Cycle Sport | level-3-cycle-sport-optimized | 3. Cycle Sport-Optimized Building Manual.pdf | 6 | BLOCKED |
| 4 | Automatic Seesaw | level-3-automatic-seesaw | 24. Automatic Seesaw -Building Manual.pdf | 29 | BLOCKED |
| 5 | Security door | level-3-security-door | Security door_Building.pdf | 10 | BLOCKED |
| 6 | Smart door | level-3-smart-door | Smart door_Building.pdf | 5 | BLOCKED |
| 7 | Following Robot | level-3-following-robot | Following Robot_Building.pdf | 9 | BLOCKED |
| 8 | Obstacle Avoidance Robot 1 | level-3-obstacle-avoidance-robot-1 | Obstacle Avoidance Robot 1_Building.pdf | 11 | BLOCKED |
| 9 | Sunflower | level-3-sunflower | Sunflower.pdf | 14 | BLOCKED |
| 10 | Electric Bulldozer | level-3-electric-bulldozer | 23.Electric Bulldozer -Building Manual.pdf | 26 | BLOCKED |
| 11 | Electric Fan | level-3-electric-fan-characters-structures | 05.Electric Fan-Building Manual.pdf | 12 | BLOCKED |
| 12 | Safe | level-3-safe | 15.Safe -Building Manual.pdf | 24 | BLOCKED |
| 13 | Smart Trash Bin | level-3-smart-trash-bin | 20.Smart Trash Bin-Building Manual.pdf | 22 | BLOCKED |
| 14 | Lifting Maintenance Vehicle | level-3-lifting-maintenance-vehicle | Lifting Maintenance Vehicle.pdf | 22 | BLOCKED |
| 15 | Automated Guided Vehicle | level-3-automated-guided-vehicle | 24.Automated Guided Vehicle-Building Manual.pdf | 24 | BLOCKED |
| 16 | Race Walking | level-3-race-walking-basic | 1. Race Walking - Basic Building Manual.pdf | 7 | BLOCKED |
| 17 | Race Walking | level-3-race-walking-optimized | 1. Race Walking - Optimized Building Manual.pdf | 6 | BLOCKED |
| 18 | Race Walking | level-3-race-walking-optimized-ratchet | 1. Race Walking - Optimized Building Manual - Added Ratchet.pdf | 2 | BLOCKED |
| 19 | Bumper car | level-3-bumper-car-foundational-robots | Bumper car_Building.pdf | 13 | BLOCKED |
| 20 | Disinfection Lamp | level-3-disinfection-lamp | 13.Disinfection Lamp-Building Manual.pdf | 20 | BLOCKED |
| 21 | Flashlight Sensor | level-3-flashlight-sensor | 04.Flashlight-Building Manual.pdf | 12 | BLOCKED |
| 22 | Light-sensitive Curtains | level-3-light-sensitive-curtains | 14.Light-sensitive Curtains -Building Manual.pdf | 28 | BLOCKED |
| 23 | Bumper car | level-3-bumper-car-interactive-mechanisms | Bumper car_Building.pdf | 13 | BLOCKED |
| 24 | Anti-fall Robot | level-3-anti-fall-robot | 11.Anti-fall Robot-Building Manual.pdf | 16 | BLOCKED |
| 25 | Automatic Door | level-3-automatic-door | 17.Automatic Door -Building Manual.pdf | 23 | BLOCKED |
| 26 | Juicer Machine | level-3-juicer-machine | 06..Juicer Machine-Building Manual.pdf | 14 | BLOCKED |
| 27 | Washing Machine | level-3-washing-machine | 08.Washing Machine-Building Manual.pdf | 18 | BLOCKED |
| 28 | Electronic scale | level-3-electronic-scale | Electronic scale.pdf | 27 | BLOCKED |
| 29 | Gyro transmitter | level-3-gyro-transmitter | Gyro transmitter_Building.pdf | 17 | BLOCKED |
| 30 | Electric fan | level-3-electric-fan-mechanisms-and-concepts | 05.Electric Fan-Building Manual.pdf | 12 | BLOCKED |
| 31 | Biting Monster | level-3-biting-monster | Biting Monster.pdf | 24 | BLOCKED |
| 32 | Electric Gyro Launcher | level-3-electric-gyro-launcher | Electric Gyro Launcher.pdf | 12 | BLOCKED |
| 33 | Responder | level-3-responder | Responder.pdf | 12 | BLOCKED |
| 34 | Electric guitar | level-3-electric-guitar | 10.Electric guitar_Building.pdf | 16 | BLOCKED |
| 35 | Music Box | level-3-music-box | 29.Music Box -Building Manual.pdf | 24 | BLOCKED |
| 36 | Music Doorbell | level-3-music-doorbell | 07.Music Doorbell-Building Manual.pdf | 12 | BLOCKED |
| 37 | Smart Audio | level-3-smart-audio | Smart Audio_Building.pdf | 11 | BLOCKED |
| 38 | Sonometer | level-3-sonometer | Sonometer_Building.pdf | 8 | BLOCKED |
| 39 | Sound Level Meter | level-3-sound-level-meter | 16.Sound Level Meter -Building Manual.pdf | 20 | BLOCKED |
| 40 | F1 racing car | level-3-f1-racing-car | F1 racing car_Building.pdf | 37 | BLOCKED |
| 41 | Long-Lived Turtle | level-3-long-lived-turtle | 11. The Long-lived Turtle - Basic Building Manual.pdf | 23 | BLOCKED |
| 42 | Lunar Rover | level-3-lunar-rover | Lunar Rover.pdf | 24 | BLOCKED |

## Source history and English-only limitations

- `reports/level3-building-cover-audit-20261119.json`: 40 Level 3 files, 691 reported pages, 40 historic original Git blob SHA-1 records. The cover audit explicitly deferred interior language verification.
- `reports/level1-4-building-wix-final-verification-20261120.json`: historical READY descriptor checks for 209 files and hash/page checks for 77 repaired files; this is not current PDF image inspection nor current SHA-256 verification.
- `Gyro transmitter_Building.pdf` — historical English-repair SHA-1 `e0c905c9b5affabddac75de96f7de0481d0a210d`, previously verified Wix ID `78042f_dc7bf8e56efd48aea4287a32059f0012.pdf`, 17 pages. Current bytes not inspected.
- `Electronic scale.pdf` — historical English-repair SHA-1 `a56708e48fb4f4337ea9578823a5cbace65eab06`, previously verified Wix ID `78042f_9ea1f915116b429895c75c161797983d.pdf`, 27 pages. Current bytes not inspected.
- Exact current registered Wix URLs were reconciled, but hosted content access was refused, so current `pdfSha256`, `currentPageCount`, `englishOnlyStatus`, and `completedModelSourcePage` remain unverified/null. Do **not** confuse Git blob SHA-1 with PDF SHA-256. Old automated CJK extraction cannot certify all rasterized Chinese text.

## Extraction, checklist, approval counts

- Approved extracted WebPs: **0**. Blocked image/reference candidates: **42**. No files were added under `public/final-build/level-3/` without actual extraction.
- Source + extraction verification pass: **0/42 approved**; independent result validation pass: **0/42 approved**.
- Approved source-backed five-item checklists: **0**. All 42 checklist entries intentionally contain zero questions and `blocked` status, to avoid inventing mechanical details. Five actual PDF page references and short explanations are mandatory before approval.
- Per-variant normalized crop/page, WebP dimensions/hash and reviewer attestations remain null or blocked pending authentic extraction and validation.

## Checks performed and execution results

| Action / command | Result |
|---|---|
| GitHub connector: fetch pinned PR #108 head, source files, prior reports | PASS |
| In-memory registration assertions (syllabus, category/project mapping, 42 unique variant IDs, 40 unique Wix PDFs, nine exclusions) | PASS |
| Cross-check 42 exact Wix paths/URLs and historical page counts/Git blob SHA-1 | PASS (historical metadata only) |
| Compare historical Gyro and Electronic Scale repair URL with currently registered link | PASS (historical metadata only) |
| Remote Wix PDF open via available document reader | BLOCKED (inaccessible) |
| Local `git ls-remote` | BLOCKED (could not resolve github.com) |
| `node --test tests/final-build-level-3.test.mjs` | NOT EXECUTED (full repo inaccessible to local runner) |
| Browser/device QA at 320, 375, 390, 430px | NOT EXECUTED (no Browser Use) |
| GitHub Actions | NOT RUN (prohibited) |

The new Node test file audits registry identity, nine exclusions, all source URLs, image SHA-256 and WebP headers/dimensions for any future approved artifacts, exactly five cited questions per approved variant, independent reviewer identities and gate-related shared-engine invariants. Authored tests are **not** reported as passing unless actually executed.

## Integration requirements and unresolved risks

- Existing Level 3 route already delegates to `<FinalBuildExam level={3} />`; leave it unchanged.
- Shared Level 1-style scanner appearance, 4.2-second entrance, uniform random selection (repeats allowed), variant choice, absolute 15-minute deadline, 4-of-5 self-report threshold, no late pass, retries and per-level persistence belong to integration worker. No shared source/route/timer/package/approval files were changed.
- `src/data/finalBuildApprovals.json` still has no approved references; the new per-level ledgers must **not** independently enable student examination.
- Integration worker must replace provisional generic checklists for approved Level 3 variants with actual PDF page-supported questions only after verified source SHA-256, authentic WebP extraction, independent visual checks and a passing Node/device QA run.
- Unresolved: Wix PDF byte access and actual version, interior rasterized Chinese, finished-model image identification (especially short variant PDFs), exact crop provenance, image hashes/legibility, real viewport checks, and build/integration regression.

**Merge/release decision: Hold. All uncertain robots stay blocked.**
