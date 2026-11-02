# Level 2 — Live Source Audit Checkpoint (29 October 2026)

> Non-destructive checkpoint for `feat/quiz-level2-content`. Supersedes the completion counts in `SOURCE_AUDIT.md`; preserves that document's original notes and prior source-review evidence. This checkpoint does **not** claim any new PDF page was opened or any new bank was authored.

## Current verified repository state

- Registered Level 2 projects: **60**.
- Registered Quiz Studio banks: **20** (two original banks plus 18 in `quizBanks/level2`).
- Registered bank questions: **200**, exactly ten per bank.
- Still unbanked: **40 projects / 400 questions**.
- Pending with dedicated Learning PDFs: **25**.
- Pending with Building-PDF Learning fallback: **15**.
- Source registry: **45 Learning mappings (44 unique Learning PDFs)** + **15 Building fallbacks** = **60 paths (59 distinct)**.
- Prior Git tree inspection confirms **60/60 paths tracked**. Tracked paths are not a substitute for PDF content/diagram review.
- Rechecked existing 20 bank modules in this continuation: all ten-question structures, unique answer options, correct-answer indexes, 1-based slide bounds, hints, explanations, and 5 topics × 2 questions passed static content inspection. This is NOT a passing TypeScript build or verified educational QA.
- Previously reported GitHub Actions run `40827960743` failed before runner steps began; **build, tests, and browser playback remain unverified**.
- Two original banks (`Axe Robot`, `Fan Robot`) are marked for additional visual QA. Several new banks are marked for visual QA of sparse/diagram pages in `source-audit.json`.

## Ready and imported (20)

| Project | Pages | Recorded slide review |
|---|---:|---|
| `level-2-axe-robot` | 19 | previously-drafted-needs-visual-QA |
| `level-2-batting-robot` | 20 | source-text-and-diagrams-reviewed |
| `level-2-fan-robot` | 19 | previously-drafted-needs-visual-QA |
| `level-2-pirate-ship` | 15 | source-slide-text-and-page-verified |
| `level-2-push-ups` | 20 | source-text-reviewed; visual-flagged-pages-require-QA |
| `level-2-rotating-flying-chair` | 15 | source-slide-text-and-pages-verified |
| `level-2-throwing-robot` | 18 | source-text-reviewed; visual-flagged-pages-require-QA |
| `level-2-bee` | 20 | source-text-reviewed; visual-flagged-pages-require-QA |
| `level-2-chimpanzees` | 14 | source-slide-text-and-page-verified |
| `level-2-scaling-ladder` | 18 | source-text-verified |
| `level-2-mechanisms-simulators-crane` | 18 | source-slide-text-and-pages-verified |
| `level-2-double-beam-crane` | 16 | source-slide-text-and-pages-verified |
| `level-2-spinning-bike` | 17 | source-text-and-reference-verified |
| `level-2-swing` | 20 | source-text-and-reference-verified |
| `level-2-animal-trap` | 18 | source-text-and-diagrams-reviewed |
| `level-2-battery-robot` | 21 | source-text-and-diagrams-reviewed |
| `level-2-harp` | 14 | source-slide-text-and-pages-verified |
| `level-2-helicopter` | 17 | source-text-and-reference-verified |
| `level-2-automatic-window` | 19 | source-text-and-diagrams-reviewed |
| `level-2-the-treadmill` | 18 | source-slide-text-and-page-verified |

## Unbanked dedicated Learning PDFs (25)

| Project | Exact tracked PDF path |
|---|---|
| `level-2-mechanical-dog` | `public/Level 2/Learning/Characters & Structures/Mechanical dog/Mechanical dog_PowerPoint-R.pdf` |
| `level-2-tower-crane` | `public/Level 2/Learning/Characters & Structures/Tower crane/Tower crane_Powerpoint.pdf` |
| `level-2-hammer-robot` | `public/Level 2/Learning/Foundational Robots/Hammer robot.pdf` |
| `level-2-lucky-turntable` | `public/Level 2/Learning/Foundational Robots/Lucky turntable.pdf` |
| `level-2-tightrope-walk` | `public/Level 2/Learning/Foundational Robots/Tightrope walk.pdf` |
| `level-2-manual-flashlight` | `public/Level 2/Learning/Illumination & Signals/Manual Flashlight/Flashlight_Powerpoint.pdf` |
| `level-2-jumping-machine` | `public/Level 2/Learning/Interactive Mechanisms/Jumping machine/Jumping machine_Powerpoint.pdf` |
| `level-2-car-steering` | `public/Level 2/Learning/Manipulators/Car Steering.pdf` |
| `level-2-cliff-walk` | `public/Level 2/Learning/Manipulators/Cliff walk.pdf` |
| `level-2-ferris-wheel` | `public/Level 2/Learning/Manipulators/Ferris wheel.pdf` |
| `level-2-round-trip-transportation` | `public/Level 2/Learning/Manipulators/Round-trip transportation.pdf` |
| `level-2-shift-gears` | `public/Level 2/Learning/Manipulators/Shift gears.pdf` |
| `level-2-bridge` | `public/Level 2/Learning/Mechanisms & Simulators/Bridge/Bridge_Powerpoint.pdf` |
| `level-2-door` | `public/Level 2/Learning/Mechanisms & Simulators/Door/Door_Powerpoint.pdf` |
| `level-2-gearbox` | `public/Level 2/Learning/Mechanisms & Simulators/Gearbox/Gearbox_Powerpoint.pdf` |
| `level-2-hand-crank` | `public/Level 2/Learning/Mechanisms & Simulators/Hand crank/Hand crank_Powerpoint.pdf` |
| `level-2-treadmill` | `public/Level 2/Learning/Mechanisms & Simulators/Treadmill/Treadmill_Powerpoint.pdf` |
| `level-2-headlights` | `public/Level 2/Learning/Mechanisms and Concepts/Headlights.pdf` |
| `level-2-walking-robot` | `public/Level 2/Learning/Sensor-Focused Robots/Walking robot/Walking robot_PowerPoint -R.pdf` |
| `level-2-lifting-door` | `public/Level 2/Learning/Vehicles & Complex Movers/Lifting door/Lifting door_Powerpoint.pdf` |
| `level-2-teeterboard` | `public/Level 2/Learning/Vehicles & Complex Movers/Teeterboard/13.Teeterboard_PowerPoint.pdf` |
| `level-2-see-saw-v1` | `public/Level 2/Learning/Interactive Systems/See Saw/Balance_PowerPoint-R.pdf` |
| `level-2-see-saw-v2` | `public/Level 2/Learning/Interactive Systems/See Saw/Balance_PowerPoint-R.pdf` |
| `level-2-tongs` | `public/Level 2/Learning/Interactive Systems/Tongs/Pliers_PowerPoint -R .pdf` |
| `level-2-robot-war` | `public/Level 2/Learning/Machines & Mechanisms/Robot war.pdf` |

## Unbanked Building-PDF fallbacks (15)

| Project | Exact tracked PDF path |
|---|---|
| `level-2-crane` | `public/Crane.pdf` |
| `level-2-fare-gate` | `public/Fare Gate.pdf` |
| `level-2-forklift` | `public/Forklift.pdf` |
| `level-2-dung-beetle` | `public/Dung Beetle.pdf` |
| `level-2-mobile-shot` | `public/Mobile Shot.pdf` |
| `level-2-rolling-shutter` | `public/Rolling Shutter.pdf` |
| `level-2-track-rickshaw` | `public/Track Rickshaw.pdf` |
| `level-2-led-scrolling-screen` | `public/LED Scrolling Screen.pdf` |
| `level-2-led-signboard` | `public/LED Signboard.pdf` |
| `level-2-four-wheel-drive` | `public/Four-wheel Drive.pdf` |
| `level-2-pedal-waterwheel` | `public/Pedal Waterwheel.pdf` |
| `level-2-tank` | `public/Tank.pdf` |
| `level-2-reverse-parking` | `public/Reverse Parking.pdf` |
| `level-2-smart-window` | `public/Smart Window.pdf` |
| `level-2-spirograph` | `public/Spirograph.pdf` |

## Source-review and publication gate

1. Open each corresponding PDF and inspect every lesson page (including diagrams and low-text pages); record actual page count and five **supported** learning objectives.
2. Write ten questions across five objective topics (two each), with four distinct choices, one correct answer, a hint, explanation, and the exact **1-based Learning Studio page**.
3. Confirm those pages and claims against the PDF itself; never invent teaching objectives from a filename. For Building-only fallbacks, confirm the source genuinely supports assessable objectives; otherwise leave the bank blocked and document why.
4. Integrate only complete banks in `src/data/quizStudio.ts`, preserve all existing imports and progress semantics, run structural tests, TypeScript/build and student Learning → Quiz browser flow.
5. Keep a distinction between **registered/playable** quizzes and **source/visual/browser verified** quizzes. Do not claim 60 completed until all 60 banks pass their gates.

### Ordering recommendation

Complete the remaining 25 official Learning PDF sources before tackling the 15 Building-only fallbacks. The two See Saw variants share one Learning PDF and can reuse extracted source analysis but require two distinct registered project-bank IDs.

## Audit provenance

- Reconciled against `src/data/quizBanks/level2/source-audit.json`, the current 18 Level 2 bank modules, original Axe/Fan bank modules, and the shared `src/data/quizStudio.ts` imports.
- The older `SOURCE_AUDIT.md` contains inconsistent snapshot counts (6, 9, and 54/51), so use this checkpoint and machine-readable `source-audit.json` for current inventory.
- No PDF bytes were newly fetched in this continuation: the GitHub connector exposed a binary blob read limitation, and the registered public PDF URL was unavailable through the external browser. Prior source-review evidence is retained, not independently re-established here.
