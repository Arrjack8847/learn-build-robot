# Level 2 Quiz Source Audit — Content Worker

> Batch 1 is integrated: six Level 2 banks are now registered in shared Quiz Studio (two previously existing, four newly authored). The other 54 are **not** playable because their source slides have not been reviewed.

- Base branch: `feat/quiz-studio-syllabus-question-banks-20261028`
- Work branch: `feat/quiz-level2-content`
- Syllabus projects: **60**
- Already published: **2** (Axe Robot, Fan Robot; 10 questions each), maintained in the existing shared registry.
- Playable and bank-registered in this branch: **6 banks / 60 questions**. Remaining: **54 banks / 540 questions**. Four of the six were newly authored and integrated in this branch.
- Official Learning mappings: **45 project IDs / 44 unique PDFs**. Two See Saw variants point to one shared source.
- Building-only Learning fallbacks: **15**; inspect source carefully before deciding it supports a real lesson quiz.
- PDF file paths: **all 60 mapped sources present in Git**. Batch 1 PDFs (Animal Trap, Automatic Window, Axe Robot, Battery Robot, Batting Robot) were opened and reviewed page-by-page. Other sources still need review.

## Blocker and quality gate

The GitHub connection cannot decode binary PDF blobs. Batch 1's five original PDFs and their extracted JSON were subsequently supplied as an upload, enabling direct page and diagram inspection and four verified bank drafts. The other 54 missing banks remain blocked until their corresponding PDFs are inspected. Generating questions from filenames would violate source-based authoring requirements.

For each pending project: open the exact PDF; read every page and diagram; record the real page count and five distinct objectives if supported; write two questions per objective with four unique choices, answer, hint, explanation and 1-based slide number; run `validateQuizBank`; manually check the correctness of every reference.

The shared Quiz Studio now imports four new Level 2 bank modules, while preserving its original UI and all other bank registrations. Pending Level 2 projects still show their normal unavailable status.

## Full 60-project inventory

| Project ID | Source kind | Source PDF (repository-relative) | Bank status | Verified pages |
| --- | --- | --- | --- | ---: |
| `level-2-axe-robot` | Learning | `public/Level 2/Learning/Action-Oriented/Axe robot/Axe robot_Powerpoint.pdf` | Existing (10) | 19 |
| `level-2-batting-robot` | Learning | `public/Level 2/Learning/Action-Oriented/Batting robot/Batting robot_Powerpoint.pdf` | Integrated (10) | 20 |
| `level-2-fan-robot` | Learning | `public/Level 2/Learning/Action-Oriented/Fan robot/Fan robot_Powerpoint.pdf` | Existing (10) | 19 |
| `level-2-pirate-ship` | Learning | `public/Level 2/Learning/Action-Oriented/Pirate ship/Pirate ship__Powerpoint.pdf` | Pending review | — |
| `level-2-push-ups` | Learning | `public/Level 2/Learning/Action-Oriented/Push ups/Push ups_Powerpoint.pdf` | Pending review | — |
| `level-2-rotating-flying-chair` | Learning | `public/Level 2/Learning/Action-Oriented/Rotating flying chair/Rotating flying chair_Powerpoint.pdf` | Pending review | — |
| `level-2-throwing-robot` | Learning | `public/Level 2/Learning/Action-Oriented/Throwing robot/Throwing robot_Powerpoint.pdf` | Pending review | — |
| `level-2-bee` | Learning | `public/Level 2/Learning/Biomimicry/Bee.pdf` | Pending review | — |
| `level-2-chimpanzees` | Learning | `public/Level 2/Learning/Biomimicry/Chimpanzees.pdf` | Pending review | — |
| `level-2-mechanical-dog` | Learning | `public/Level 2/Learning/Characters & Structures/Mechanical dog/Mechanical dog_PowerPoint-R.pdf` | Pending review | — |
| `level-2-scaling-ladder` | Learning | `public/Level 2/Learning/Characters & Structures/Scaling ladder/Scaling ladder_PowerPoint -R.pdf` | Pending review | — |
| `level-2-tower-crane` | Learning | `public/Level 2/Learning/Characters & Structures/Tower crane/Tower crane_Powerpoint.pdf` | Pending review | — |
| `level-2-crane` | Building fallback | `public/Crane.pdf` | Pending review | — |
| `level-2-fare-gate` | Building fallback | `public/Fare Gate.pdf` | Pending review | — |
| `level-2-forklift` | Building fallback | `public/Forklift.pdf` | Pending review | — |
| `level-2-hammer-robot` | Learning | `public/Level 2/Learning/Foundational Robots/Hammer robot.pdf` | Pending review | — |
| `level-2-lucky-turntable` | Learning | `public/Level 2/Learning/Foundational Robots/Lucky turntable.pdf` | Pending review | — |
| `level-2-tightrope-walk` | Learning | `public/Level 2/Learning/Foundational Robots/Tightrope walk.pdf` | Pending review | — |
| `level-2-manual-flashlight` | Learning | `public/Level 2/Learning/Illumination & Signals/Manual Flashlight/Flashlight_Powerpoint.pdf` | Pending review | — |
| `level-2-jumping-machine` | Learning | `public/Level 2/Learning/Interactive Mechanisms/Jumping machine/Jumping machine_Powerpoint.pdf` | Pending review | — |
| `level-2-dung-beetle` | Building fallback | `public/Dung Beetle.pdf` | Pending review | — |
| `level-2-mobile-shot` | Building fallback | `public/Mobile Shot.pdf` | Pending review | — |
| `level-2-rolling-shutter` | Building fallback | `public/Rolling Shutter.pdf` | Pending review | — |
| `level-2-track-rickshaw` | Building fallback | `public/Track Rickshaw.pdf` | Pending review | — |
| `level-2-car-steering` | Learning | `public/Level 2/Learning/Manipulators/Car Steering.pdf` | Pending review | — |
| `level-2-cliff-walk` | Learning | `public/Level 2/Learning/Manipulators/Cliff walk.pdf` | Pending review | — |
| `level-2-ferris-wheel` | Learning | `public/Level 2/Learning/Manipulators/Ferris wheel.pdf` | Pending review | — |
| `level-2-round-trip-transportation` | Learning | `public/Level 2/Learning/Manipulators/Round-trip transportation.pdf` | Pending review | — |
| `level-2-shift-gears` | Learning | `public/Level 2/Learning/Manipulators/Shift gears.pdf` | Pending review | — |
| `level-2-bridge` | Learning | `public/Level 2/Learning/Mechanisms & Simulators/Bridge/Bridge_Powerpoint.pdf` | Pending review | — |
| `level-2-mechanisms-simulators-crane` | Learning | `public/Level 2/Learning/Mechanisms & Simulators/Crane/Crane_Powerpoint.pdf` | Pending review | — |
| `level-2-door` | Learning | `public/Level 2/Learning/Mechanisms & Simulators/Door/Door_Powerpoint.pdf` | Pending review | — |
| `level-2-double-beam-crane` | Learning | `public/Level 2/Learning/Mechanisms & Simulators/Double Beam Crane/Double beam crane_Building_Powerpoint.pdf` | Pending review | — |
| `level-2-gearbox` | Learning | `public/Level 2/Learning/Mechanisms & Simulators/Gearbox/Gearbox_Powerpoint.pdf` | Pending review | — |
| `level-2-hand-crank` | Learning | `public/Level 2/Learning/Mechanisms & Simulators/Hand crank/Hand crank_Powerpoint.pdf` | Pending review | — |
| `level-2-spinning-bike` | Learning | `public/Level 2/Learning/Mechanisms & Simulators/Spinning bike/Spinning bike_Powerpoint.pdf` | Pending review | — |
| `level-2-swing` | Learning | `public/Level 2/Learning/Mechanisms & Simulators/Swing/Swing_powerpoint.pdf` | Pending review | — |
| `level-2-treadmill` | Learning | `public/Level 2/Learning/Mechanisms & Simulators/Treadmill/Treadmill_Powerpoint.pdf` | Pending review | — |
| `level-2-animal-trap` | Learning | `public/Level 2/Learning/Mechanisms and Concepts/Animal trap.pdf` | Integrated (10) | 18 |
| `level-2-headlights` | Learning | `public/Level 2/Learning/Mechanisms and Concepts/Headlights.pdf` | Pending review | — |
| `level-2-battery-robot` | Learning | `public/Level 2/Learning/Programming & Precise Control/Battery robot/Battery robot_Powerpoint.pdf` | Integrated (10) | 21 |
| `level-2-walking-robot` | Learning | `public/Level 2/Learning/Sensor-Focused Robots/Walking robot/Walking robot_PowerPoint -R.pdf` | Pending review | — |
| `level-2-led-scrolling-screen` | Building fallback | `public/LED Scrolling Screen.pdf` | Pending review | — |
| `level-2-led-signboard` | Building fallback | `public/LED Signboard.pdf` | Pending review | — |
| `level-2-harp` | Learning | `public/Level 2/Learning/Sound & Voice Interaction/Harp/Harp_Powerpoint.pdf` | Pending review | — |
| `level-2-helicopter` | Learning | `public/Level 2/Learning/Vehicles & Complex Movers/Helicopter/Helicopter_Powerpoint.pdf` | Pending review | — |
| `level-2-lifting-door` | Learning | `public/Level 2/Learning/Vehicles & Complex Movers/Lifting door/Lifting door_Powerpoint.pdf` | Pending review | — |
| `level-2-teeterboard` | Learning | `public/Level 2/Learning/Vehicles & Complex Movers/Teeterboard/13.Teeterboard_PowerPoint.pdf` | Pending review | — |
| `level-2-four-wheel-drive` | Building fallback | `public/Four-wheel Drive.pdf` | Pending review | — |
| `level-2-pedal-waterwheel` | Building fallback | `public/Pedal Waterwheel.pdf` | Pending review | — |
| `level-2-tank` | Building fallback | `public/Tank.pdf` | Pending review | — |
| `level-2-see-saw-v1` | Learning | `public/Level 2/Learning/Interactive Systems/See Saw/Balance_PowerPoint-R.pdf` | Pending review | — |
| `level-2-see-saw-v2` | Learning | `public/Level 2/Learning/Interactive Systems/See Saw/Balance_PowerPoint-R.pdf` | Pending review | — |
| `level-2-tongs` | Learning | `public/Level 2/Learning/Interactive Systems/Tongs/Pliers_PowerPoint -R .pdf` | Pending review | — |
| `level-2-reverse-parking` | Building fallback | `public/Reverse Parking.pdf` | Pending review | — |
| `level-2-smart-window` | Building fallback | `public/Smart Window.pdf` | Pending review | — |
| `level-2-spirograph` | Building fallback | `public/Spirograph.pdf` | Pending review | — |
| `level-2-automatic-window` | Learning | `public/Level 2/Learning/Machines & Mechanisms/Automatic window.pdf` | Integrated (10) | 19 |
| `level-2-robot-war` | Learning | `public/Level 2/Learning/Machines & Mechanisms/Robot war.pdf` | Pending review | — |
| `level-2-the-treadmill` | Learning | `public/Level 2/Learning/Foundational Robots/The treadmill.pdf` | Pending review | — |

## Five-project authoring batches (missing banks only)

**Batch 1:** `level-2-batting-robot`, `level-2-pirate-ship`, `level-2-push-ups`, `level-2-rotating-flying-chair`, `level-2-throwing-robot` — 1 of 5 banks integrated; remaining sources pending.
**Batch 2:** `level-2-bee`, `level-2-chimpanzees`, `level-2-mechanical-dog`, `level-2-scaling-ladder`, `level-2-tower-crane` — source review pending.
**Batch 3:** `level-2-crane`, `level-2-fare-gate`, `level-2-forklift`, `level-2-hammer-robot`, `level-2-lucky-turntable` — source review pending.
**Batch 4:** `level-2-tightrope-walk`, `level-2-manual-flashlight`, `level-2-jumping-machine`, `level-2-dung-beetle`, `level-2-mobile-shot` — source review pending.
**Batch 5:** `level-2-rolling-shutter`, `level-2-track-rickshaw`, `level-2-car-steering`, `level-2-cliff-walk`, `level-2-ferris-wheel` — source review pending.
**Batch 6:** `level-2-round-trip-transportation`, `level-2-shift-gears`, `level-2-bridge`, `level-2-mechanisms-simulators-crane`, `level-2-door` — source review pending.
**Batch 7:** `level-2-double-beam-crane`, `level-2-gearbox`, `level-2-hand-crank`, `level-2-spinning-bike`, `level-2-swing` — source review pending.
**Batch 8:** `level-2-treadmill`, `level-2-animal-trap`, `level-2-headlights`, `level-2-battery-robot`, `level-2-walking-robot` — 2 of 5 banks integrated; remaining sources pending.
**Batch 9:** `level-2-led-scrolling-screen`, `level-2-led-signboard`, `level-2-harp`, `level-2-helicopter`, `level-2-lifting-door` — source review pending.
**Batch 10:** `level-2-teeterboard`, `level-2-four-wheel-drive`, `level-2-pedal-waterwheel`, `level-2-tank`, `level-2-see-saw-v1` — source review pending.
**Batch 11:** `level-2-see-saw-v2`, `level-2-tongs`, `level-2-reverse-parking`, `level-2-smart-window`, `level-2-spirograph` — source review pending.
**Batch 12:** `level-2-automatic-window`, `level-2-robot-war`, `level-2-the-treadmill` — 1 of 3 banks integrated; remaining sources pending.

## Validation result

- Registry-to-manifest match: 45 / 45 mapped Level 2 Learning entries.
- Building fallback coverage: 15 / 15 matched to actual Building PDF file paths.
- Git tree source existence: 60 / 60 project references point to tracked PDFs (59 unique source paths).
- Quiz content checks: four integrated bank files pass the existing `validateQuizBank` structural rules (10 questions, five 2-question objectives, valid slide bounds, unique choices, hints and explanations), plus manual checks against original PDF pages. App/runtime test not run because banks are deliberately unimported.
- Type-check/build: GitHub Actions run 40827960743 failed before any runner started (zero executed steps). Full TS/build/UI test results are unavailable; direct repository-data checks passed for the six registered banks.

## Batch 1 completion

- `level-2-animal-trap`: 10 source-reviewed questions, 18 PDF pages, five objectives, slides 3, 4, 5, 6, 7, 15, 17.
- `level-2-automatic-window`: 10 source-reviewed questions, 19 PDF pages, five objectives, slides 2, 4, 6, 7, 10, 17, 18.
- `level-2-battery-robot`: 10 source-reviewed questions, 21 PDF pages, five objectives, slides 7, 9, 10, 11, 12, 16, 18.
- `level-2-batting-robot`: 10 source-reviewed questions, 20 PDF pages, five objectives, slides 6, 7, 9, 10, 14, 17.

The fifth inspected project, `level-2-axe-robot`, already had a bank and was deliberately not rewritten. See `BATCH_01_VERIFICATION.md`.

**Queue-order note:** This 12-group authoring queue uses the practical project registry order. The first five extracted PDF files followed the source manifest order and included Axe Robot (already authored). Consequently, the first extracted PDF group and `Batch 1` in this authoring queue are not the same list.

## Current CI and extraction blocker

GitHub Actions run [40827960743](https://github.com/Arrjack8847/learn-build-robot/actions/runs/40827960743) failed before any job steps started; the run supplied no downloadable logs. Both `verify` and `extract-all-sources` jobs have failed conclusions and blank runner names. Hence the all-60 extraction, TypeScript checks, test execution and build did **not** run. CI workflow is saved to this branch for later retries once GitHub runners become available; do not report its checks as passing. Current direct repository-data checks validate all six banks structurally and confirm correct source manifest IDs and paths. Another 54 banks still need source-based authoring.
