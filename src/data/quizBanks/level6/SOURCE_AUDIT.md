# Level 6 quiz-bank source audit — 2026-10-29

Scope: `Arrjack8847/learn-build-robot`, base `feat/quiz-studio-syllabus-question-banks-20261028` at `e78b9e0f0d9b3b2feb6bf381726017adc7f1139d`, worker branch `feat/quiz-level6-content`. This report deliberately lives under `src/data/quizBanks/level6/` and does **not** integrate banks into shared Quiz Studio files.

## Verified inventory and boundaries

- 43 Level 6 entries in `scripts/quiz-learning-source-manifest.json`.
- 2 pre-existing question banks in the shared Quiz Studio directory: Altimeter (10 questions, 22 **previously recorded**, not independently re-counted pages); Ball Tracking (10 questions, 20 **previously recorded**, not independently re-counted pages).
- 41 project IDs without a published bank on the inspected base branch.
- Git tree metadata check: 43/43 manifest Learning PDFs exist under `public/Level 6/` (0 absent); directory tree was non-truncated with 84 Level 6 PDFs in Learning and Building combined.
- Existing-bank **schema-only** check (10 questions, 4 unique choices, 5 objectives x 2, nonempty hints/explanations, valid page bounds): level-6-altimeter: PASS; level-6-ball-tracking: PASS. This does not verify educational facts, actual slide imagery, or PDF page counts.
- **Source inspection blocker:** this session's GitHub connector exposes UTF-8 source files and PDF names/sizes, but does not supply PDF bytes or rendered PDF pages; the registered hosted PDFs also could not be opened by the available PDF reader. Accordingly there is no defensible source-slide evidence for the 41 unpublished projects. All new quizzes remain **blocked for source inspection**, not 'approved' or 'insufficient teaching content'.
- **Publishing restriction:** the user forbids editing `src/data/quizStudio.ts` and other shared registries. New files placed here would require a separate integration step before becoming playable.
- **Testing restriction:** runtime `npm`/TypeScript/test suites were not executed because a complete local repository is not mounted and the GitHub connector does not execute commands. No successful build/test is claimed.

## Existing banks (not modified)

| Project ID | Source PDF | Recorded pages | Questions | Schema check |
| --- | --- | ---: | ---: | --- |
| `level-6-altimeter` | `public/Level 6/Learning/Sensor Automation/Altimeter/18. Altimeter-Teaching Slides.pdf` | 22 | 10 | PASS (structural only) |
| `level-6-ball-tracking` | `public/Level 6/Learning/Sensor-Focused Robots/Ball Tracking/08.Ball Tracking.pdf` | 20 | 10 | PASS (structural only) |

## All registered sources and authoring blockers

For each source below, Git-tree presence is verified, **not** its instructional content, page count, diagram meaning, or scientific accuracy. `PENDING-SOURCE-INSPECTION` is a temporary workflow blocker, not a claim that the PDF itself is missing.

| # | Project ID | Exact source PDF path | Size (bytes) | Status |
| ---: | --- | --- | ---: | --- |
| 1 | `level-6-accurate-shooting` | `public/Level 6/Learning/Complex Mechanisms & Coordinated Motion/Accurate Shooting/13. Accurate Shooting-Teaching Slides.pdf` | 1584202 | PENDING-SOURCE-INSPECTION |
| 2 | `level-6-altimeter` | `public/Level 6/Learning/Sensor Automation/Altimeter/18. Altimeter-Teaching Slides.pdf` | 982925 | EXISTING BANK; factual QA pending |
| 3 | `level-6-autonomous-driving` | `public/Level 6/Learning/Programming & Precise Control/Autonomous Driving/18.Autonomous Driving -Slides.pdf` | 1175800 | PENDING-SOURCE-INSPECTION |
| 4 | `level-6-ball-tracking` | `public/Level 6/Learning/Sensor-Focused Robots/Ball Tracking/08.Ball Tracking.pdf` | 794881 | EXISTING BANK; factual QA pending |
| 5 | `level-6-clown` | `public/Level 6/Learning/Characters & Structures/Clown/05.Clown-Teaching slides.pdf` | 1176881 | PENDING-SOURCE-INSPECTION |
| 6 | `level-6-code-scanning-gate` | `public/Level 6/Learning/Automation & Security/Code-scanning Gate/04.Code-scanning Gate-Teaching Slides.pdf` | 1227800 | PENDING-SOURCE-INSPECTION |
| 7 | `level-6-colorblind-assistant-robot` | `public/Level 6/Learning/Sensor-Focused Robots/Colorblind Assistant Robot/25.Colorblind Assistant Robot-Slides.pdf` | 1193435 | PENDING-SOURCE-INSPECTION |
| 8 | `level-6-combination-lock` | `public/Level 6/Learning/Mechanisms & Simulators/Combination Lock/29.Combination Lock -Slides.pdf` | 1289549 | PENDING-SOURCE-INSPECTION |
| 9 | `level-6-dancing-robot` | `public/Level 6/Learning/Complex Mechanisms & Coordinated Motion/Dancing Robot/0.3Dancing Robot-update.pdf` | 815447 | PENDING-SOURCE-INSPECTION |
| 10 | `level-6-digital-countdown` | `public/Level 6/Learning/Display & Movement/Digital Countdown/07.Digital Countdown-Teaching Slides.pdf` | 1130637 | PENDING-SOURCE-INSPECTION |
| 11 | `level-6-finger-guessing-robot` | `public/Level 6/Learning/Interactive Mechanisms/Finger-guessing Robot/04.Finger-guessing Robot.pdf` | 749644 | PENDING-SOURCE-INSPECTION |
| 12 | `level-6-gesture-commanding-car` | `public/Level 6/Learning/Autonomous Navigation & Ranging/Gesture-commanding Car/23. Gesture-commanding Car-Teaching Slides.pdf` | 806846 | PENDING-SOURCE-INSPECTION |
| 13 | `level-6-gibbon` | `public/Level 6/Learning/Mechanisms & Simulators/Gibbon/14. Gibbon - Slides.pdf` | 1378375 | PENDING-SOURCE-INSPECTION |
| 14 | `level-6-gorilla` | `public/Level 6/Learning/Action-Oriented/Gorilla/04.Gorilla - Slides.pdf` | 2707906 | PENDING-SOURCE-INSPECTION |
| 15 | `level-6-high-temperature-alarm` | `public/Level 6/Learning/Sensor Automation/High Temperature Alarm/29. High Temperature Alarm-Teaching Slides.pdf` | 926817 | PENDING-SOURCE-INSPECTION |
| 16 | `level-6-intelligent-passing-light` | `public/Level 6/Learning/Automation & Security/Intelligent Passing Light/09. Intelligent Passing Light-Teaching Slides.pdf` | 1052564 | PENDING-SOURCE-INSPECTION |
| 17 | `level-6-intelligent-sorting-machine` | `public/Level 6/Learning/Sensor Automation/Intelligent Sorting Machine/24.Intelligent Sorting Machine-Slides.pdf` | 1400190 | PENDING-SOURCE-INSPECTION |
| 18 | `level-6-matador` | `public/Level 6/Learning/Biomimicry & Stimulus Response/Matador/02.Matador-update.pdf` | 895553 | PENDING-SOURCE-INSPECTION |
| 19 | `level-6-minesweeper-robot` | `public/Level 6/Learning/Programming & Precise Control/Minesweeper Robot/12.Minesweeper Robot -Slides.pdf` | 2801187 | PENDING-SOURCE-INSPECTION |
| 20 | `level-6-parcel-sorting-machine` | `public/Level 6/Learning/Sensor Automation/Parcel Sorting Machine/31. Parcel Sorting Machine-Teaching Slides.pdf` | 1288796 | PENDING-SOURCE-INSPECTION |
| 21 | `level-6-pay-by-card` | `public/Level 6/Learning/Mechanisms & Simulators/Pay by card/16.Pay by card -Slides.pdf` | 2030918 | PENDING-SOURCE-INSPECTION |
| 22 | `level-6-picture-projector` | `public/Level 6/Learning/Action-Oriented/Picture Projector/28. Picture Projector-Teaching Slides.pdf` | 1102107 | PENDING-SOURCE-INSPECTION |
| 23 | `level-6-pinball-machine` | `public/Level 6/Learning/Interactive Mechanisms/Pinball Machine/30. Pinball Machine-Teaching Slides.pdf` | 1278747 | PENDING-SOURCE-INSPECTION |
| 24 | `level-6-product-search` | `public/Level 6/Learning/Mechanisms & Simulators/Product Search/15.Product Search -Slides.pdf` | 2555447 | PENDING-SOURCE-INSPECTION |
| 25 | `level-6-punch-hard` | `public/Level 6/Learning/Mechanisms & Simulators/Punch Hard/7. Punch Hard - Slides.pdf` | 1204526 | PENDING-SOURCE-INSPECTION |
| 26 | `level-6-rc-airplane` | `public/Level 6/Learning/Mechanisms & Simulators/RC Airplane/11.RC Airplane - Slides.pdf` | 2494636 | PENDING-SOURCE-INSPECTION |
| 27 | `level-6-red-light-warning-device` | `public/Level 6/Learning/Illumination & Signals/Red Light Warning Device/12. Red Light Warning Device-Teaching Slides.pdf` | 1442001 | PENDING-SOURCE-INSPECTION |
| 28 | `level-6-regional-weather-station` | `public/Level 6/Learning/Biomimicry & Stimulus Response/Regional Weather Station/32.Regional Weather Station-Teaching Slides.pdf` | 1030600 | PENDING-SOURCE-INSPECTION |
| 29 | `level-6-remote-control-lift` | `public/Level 6/Learning/Programming & Precise Control/Remote Control Lift/22. Remote Control Lift-Teaching Slides.pdf` | 945805 | PENDING-SOURCE-INSPECTION |
| 30 | `level-6-ring-toss-game` | `public/Level 6/Learning/Mechanisms & Simulators/Ring Toss Game/15. Ring Toss Game-Teaching Slides.pdf` | 1353418 | PENDING-SOURCE-INSPECTION |
| 31 | `level-6-robotic-arm` | `public/Level 6/Learning/Mechanisms & Simulators/Robotic Arm/32. The Robotic Arm-Teaching Slides.pdf` | 1098316 | PENDING-SOURCE-INSPECTION |
| 32 | `level-6-rock-paper-scissors-robot` | `public/Level 6/Learning/Sensor-Focused Robots/Rock-paper-scissors Robot/30.Rock-paper-scissors Robot-Slides.pdf` | 1371312 | PENDING-SOURCE-INSPECTION |
| 33 | `level-6-saluting-robot` | `public/Level 6/Learning/Programming & Precise Control/Saluting Robot/26.Saluting Robot -Slides.pdf` | 1183644 | PENDING-SOURCE-INSPECTION |
| 34 | `level-6-smart-camera` | `public/Level 6/Learning/Sensor-Focused Robots/Smart Camera/22.Smart Camera-Slides.pdf` | 1326655 | PENDING-SOURCE-INSPECTION |
| 35 | `level-6-smart-electric-drill` | `public/Level 6/Learning/Programming & Precise Control/Smart Electric Drill/20. Smart Electric Drill-Teaching Slides.pdf` | 1158882 | PENDING-SOURCE-INSPECTION |
| 36 | `level-6-smart-fan` | `public/Level 6/Learning/Interactive Systems/Smart Fan/31.Smart Fan-Teaching Slides.pdf` | 1253499 | PENDING-SOURCE-INSPECTION |
| 37 | `level-6-smart-flashlight` | `public/Level 6/Learning/Illumination & Signals/Smart Flashlight/27.Lesson 27 Smart Flashlight-Teaching Slides.pdf` | 879817 | PENDING-SOURCE-INSPECTION |
| 38 | `level-6-super-scorpion` | `public/Level 6/Learning/Biomimicry & Stimulus Response/Super Scorpion/16. Super Scorpion - Slides.pdf` | 1302229 | PENDING-SOURCE-INSPECTION |
| 39 | `level-6-the-flapping-pterosaur` | `public/Level 6/Learning/Action-Oriented/The Flapping Pterosaur/17. The Flapping Pterosaur-Teaching Slides.pdf` | 1323747 | PENDING-SOURCE-INSPECTION |
| 40 | `level-6-the-interesting-rotor` | `public/Level 6/Learning/Interactive Systems/The Interesting Rotor/19. The Interesting Rotor-Teaching Slides.pdf` | 938396 | PENDING-SOURCE-INSPECTION |
| 41 | `level-6-traffic-lights-display` | `public/Level 6/Learning/Illumination & Signals/Traffic Lights Display/10. Traffic Lights-Teaching Slides.pdf` | 1305645 | PENDING-SOURCE-INSPECTION |
| 42 | `level-6-tricycle` | `public/Level 6/Learning/Vehicles & Complex Movers/Tricycle/29. Tricycle-Teaching Slides.pdf` | 1292939 | PENDING-SOURCE-INSPECTION |
| 43 | `level-6-vending-machine` | `public/Level 6/Learning/Mechanisms & Simulators/Vending Machine/27.Vending Machine-Slides.pdf` | 1223981 | PENDING-SOURCE-INSPECTION |

## Required next verification before authoring

1. Obtain the exact PDF files or slide-by-slide extracted text and rendered diagrams for each project, recording 1-based PDF page indexes and actual page totals.
2. For batches of five missing projects, write five distinct *source-grounded* objectives and two multiple-choice items each only when the teaching slides support them.
3. Cross-check every answer choice, hint, explanation, technical description, and reference against the source pages; flag unclear slides and visual-only mechanisms for diagram review.
4. Keep each finished bank in this `level6/` subtree. A separate integration worker must import and register banks in `src/data/quizStudio.ts` after approval; this worker must not modify that shared file.
5. Run structural validation, TypeScript and repository checks in a full local worktree and record commands/results; perform browser QA before release.

No speculative quiz-bank files have been authored.
