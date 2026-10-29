# Level 3 Quiz Content Audit — 29 October 2026

**Repository:** `Arrjack8847/learn-build-robot`  
**Base:** `feat/quiz-studio-syllabus-question-banks-20261028`  
**Worker branch:** `feat/quiz-level3-content`

## Coverage summary

- **51 Level 3 registered projects**: 46 Learning-PDF entries in `scripts/quiz-learning-source-manifest.json`, plus 5 Building-PDF learning fallbacks from `src/data/levelThreeLectures.ts`.
- **2 pre-existing Level 3 banks**, unchanged: Clip Robot and Following Robot (registered in `src/data/quizStudio.ts`).
- **13 newly authored banks / 130 questions** in this directory, committed in two 5-project batches.
- **31 mapped Learning-PDF projects remain without banks**.
- **5 Building-PDF-only learning fallbacks are BLOCKED for syllabus-quiz authoring** until an educator inspects the Building manual or provides a dedicated Learning lesson.
- The 13 new banks are **not yet available in Quiz Studio** because the shared registry was intentionally not modified under this worker's isolation instructions.

## Source-slide verification for authored banks

PDF pages were counted from the actual GitHub PDF data and its text streams were extracted page by page. Questions were manually written against that extracted slide text; none requires interpreting an unreviewed visual diagram.

| Project ID | Bank file | PDF pages | Referenced 1-based slides | Questions | Objective pairs |
|---|---|---:|---|---:|---:|
| `level-3-automatic-seesaw` | `automaticSeesaw.ts` | 21 | 4, 6, 8, 10, 13, 14, 15 | 10 | 5 |
| `level-3-electric-guitar` | `electricGuitar.ts` | 21 | 7, 10, 11, 15, 17, 18 | 10 | 5 |
| `level-3-line-patrol-car` | `linePatrolCar.ts` | 12 | 2, 3, 4, 5, 10, 11, 12 | 10 | 5 |
| `level-3-obstacle-avoidance-robot-1` | `obstacleAvoidanceRobot1.ts` | 19 | 6, 7, 9, 12, 14, 15, 16 | 10 | 5 |
| `level-3-parking-gate` | `parkingGate.ts` | 16 | 2, 3, 14, 15, 16 | 10 | 5 |
| `level-3-security-door` | `securityDoor.ts` | 20 | 7, 9, 10, 11, 12, 16, 17 | 10 | 5 |
| `level-3-smart-audio` | `smartAudio.ts` | 21 | 2, 3, 7, 12, 17, 18 | 10 | 5 |
| `level-3-smart-door` | `smartDoor.ts` | 22 | 9, 11, 12, 17, 18, 19 | 10 | 5 |
| `level-3-sonometer` | `sonometer.ts` | 23 | 7, 9, 11, 12, 13, 18, 20 | 10 | 5 |
| `level-3-sunflower` | `sunflower.ts` | 19 | 6, 7, 9, 10, 11, 16 | 10 | 5 |

| `level-3-bumper-car-interactive-mechanisms` | `bumperCarInteractiveMechanisms.ts` | 18 | 2, 3, 7, 9, 10, 12, 14, 15 | 10 | 5 |

| `level-3-super-trajectory-robot-1` | `superTrajectoryRobot1.ts` | 19 | 6, 7, 10, 14, 15, 16 | 10 | 5 |

| `level-3-f1-racing-car` | `f1RacingCar.ts` | 20 | 2, 3, 7, 14, 15, 16, 17 | 10 | 5 |

## Full Level 3 project coverage

Status descriptions: **pre-existing** = already present in the base quiz registry; **authored** = file committed here, awaiting shared integration; **pending** = mapped Learning PDF exists but questions remain unreviewed; **blocked-fallback** = no dedicated Learning lecture, only a Building manual.

| Project ID | Status | Registered Learning source |
|---|---|---|
| `level-3-anti-fall-robot` | pending | `public/Level 3/Learning/Interactive Systems/Anti-fall Robot/11.Anti-fall Robot-Slides.pdf` |
| `level-3-automated-guided-vehicle` | pending | `public/Level 3/Learning/Display & Movement/Automated Guided Vehicle/24.Automated Guided Vehicle-Slides.pdf` |
| `level-3-automatic-door` | pending | `public/Level 3/Learning/Interactive Systems/Automatic Door/17.Automatic Door -Slides.pdf` |
| `level-3-automatic-seesaw` | authored | `public/Level 3/Learning/Automation & Security/Automatic Seesaw/24. Automatic Seesaw.pdf` |
| `level-3-blood-bank-centrifuge` | pending | `public/Level 3/Learning/Manipulators/Blood bank Centrifuge.pdf` |
| `level-3-bumper-car-foundational-robots` | pending | `public/Level 3/Learning/Foundational Robots/Bumper car.pdf` |
| `level-3-bumper-car-interactive-mechanisms` | authored | `public/Level 3/Learning/Interactive Mechanisms/Bumper car/Bumper car_Powerpoint-update.pdf` |
| `level-3-clip-robot` | pre-existing | `public/Level 3/Learning/Action-Oriented/Clip robot/Clip robot_Powerpoint.pdf` |
| `level-3-cycle-sport-basic` | pending | `public/Level 3/Learning/Action-Oriented/Cycle Sport/3. Cycle Sport - Slides.pdf` |
| `level-3-cycle-sport-optimized` | pending | `public/Level 3/Learning/Action-Oriented/Cycle Sport/3. Cycle Sport - Slides.pdf` |
| `level-3-disinfection-lamp` | pending | `public/Level 3/Learning/Illumination & Signals/Disinfection Lamp/13.Disinfection Lamp-Slides.pdf` |
| `level-3-drawbridge` | pending | `public/Level 3/Learning/Mechanisms and Concepts/Drawbridge.pdf` |
| `level-3-electric-bulldozer` | pending | `public/Level 3/Learning/Characters & Structures/Electric Bulldozer/23.Electric Bulldozer -Slides.pdf` |
| `level-3-electric-fan-characters-structures` | pending | `public/Level 3/Learning/Characters & Structures/Electric Fan/05.Electric Fan-Slides.pdf` |
| `level-3-electric-fan-mechanisms-and-concepts` | pending | `public/Level 3/Learning/Mechanisms and Concepts/Electric fan.pdf` |
| `level-3-electric-guitar` | authored | `public/Level 3/Learning/Sound & Voice Interaction/Electric guitar/10.Electric guitar_Powerpoint.pdf` |
| `level-3-electronic-scale` | pending | `public/Level 3/Learning/Manipulators/Electronic scale.pdf` |
| `level-3-f1-racing-car` | authored | `public/Level 3/Learning/Vehicles & Complex Movers/F1 racing car/F1 racing car_Powerpoint.pdf` |
| `level-3-fire-ladder` | pending | `public/Level 3/Learning/Mechanisms and Concepts/Fire ladder.pdf` |
| `level-3-flashlight-sensor` | pending | `public/Level 3/Learning/Illumination & Signals/Flashlight Sensor/04.Flashlight -Slides.pdf` |
| `level-3-following-robot` | pre-existing | `public/Level 3/Learning/Autonomous Navigation & Ranging/Following Robot/Following Robot_Powerpoint.pdf` |
| `level-3-gyro-transmitter` | pending | `public/Level 3/Learning/Manipulators/Gyro transmitter.pdf` |
| `level-3-juicer-machine` | pending | `public/Level 3/Learning/Interactive Systems/Juicer Machine/06.Juicer Machine-Slides.pdf` |
| `level-3-light-sensitive-curtains` | pending | `public/Level 3/Learning/Illumination & Signals/Light-sensitive Curtains/14.Light-sensitive Curtains -Slides.pdf` |
| `level-3-line-patrol-car` | authored | `public/Level 3/Learning/Foundational Robots/Line patrol car.pdf` |
| `level-3-long-lived-turtle` | pending | `public/Level 3/Learning/Vehicles & Complex Movers/Long-Lived Turtle/11. The Long-lived Turtle - Slides.pdf` |
| `level-3-money-detector` | pending | `public/Level 3/Learning/Machines & Mechanisms/Money detector.pdf` |
| `level-3-music-box` | pending | `public/Level 3/Learning/Sound & Voice Interaction/Music Box/29.Music Box -Slides.pdf` |
| `level-3-music-doorbell` | pending | `public/Level 3/Learning/Sound & Voice Interaction/Music Doorbell/07.Music Doorbell- Slides.pdf` |
| `level-3-obstacle-avoidance-robot-1` | authored | `public/Level 3/Learning/Autonomous Navigation & Ranging/Obstacle Avoidance Robot 1/Obstacle Avoidance Robot 1_Powerpoint.pdf` |
| `level-3-parking-gate` | authored | `public/Level 3/Learning/Machines & Mechanisms/Parking gate.pdf` |
| `level-3-race-walking-basic` | pending | `public/Level 3/Learning/Display & Movement/Race Walking/1. Race Walking - Slides.pdf` |
| `level-3-race-walking-optimized` | pending | `public/Level 3/Learning/Display & Movement/Race Walking/1. Race Walking - Slides.pdf` |
| `level-3-race-walking-optimized-ratchet` | pending | `public/Level 3/Learning/Display & Movement/Race Walking/1. Race Walking - Slides.pdf` |
| `level-3-safe` | pending | `public/Level 3/Learning/Characters & Structures/Safe/15.Safe -Slides.pdf` |
| `level-3-security-door` | authored | `public/Level 3/Learning/Automation & Security/Security door/Security door_Powerpoint-update.pdf` |
| `level-3-sign` | pending | `public/Level 3/Learning/Mechanisms and Concepts/Sign.pdf` |
| `level-3-smart-audio` | authored | `public/Level 3/Learning/Sound & Voice Interaction/Smart Audio/Smart Audio_Powerpoint.pdf` |
| `level-3-smart-door` | authored | `public/Level 3/Learning/Automation & Security/Smart door/Smart door_Powerpoint.pdf` |
| `level-3-smart-trash-bin` | pending | `public/Level 3/Learning/Characters & Structures/Smart Trash Bin/20.Smart Trash Bin-Slides.pdf` |
| `level-3-sonometer` | authored | `public/Level 3/Learning/Sound & Voice Interaction/Sonometer/Sonometer_Powerpoint-update.pdf` |
| `level-3-sound-level-meter` | pending | `public/Level 3/Learning/Sound & Voice Interaction/Sound Level Meter/16.Sound Level Meter -Slides.pdf` |
| `level-3-stag-beetle` | pending | `public/Level 3/Learning/Biomimicry/Stag beetle.pdf` |
| `level-3-sunflower` | authored | `public/Level 3/Learning/Biomimicry & Stimulus Response/Sunflower/09.Sunflower.pdf` |
| `level-3-super-trajectory-robot-1` | authored | `public/Level 3/Learning/Advanced Navigation & Control/Super Trajectory Robot 1/13.Super Trajectory Robot 1-update.pdf` |
| `level-3-washing-machine` | pending | `public/Level 3/Learning/Interactive Systems/Washing Machine/08.Washing Machine-Slides.pdf` |
| `level-3-lifting-maintenance-vehicle` | blocked-fallback | Building manual via `pdfActivityManuals` (no dedicated lecture) |
| `level-3-biting-monster` | blocked-fallback | Building manual via `pdfActivityManuals` (no dedicated lecture) |
| `level-3-electric-gyro-launcher` | blocked-fallback | Building manual via `pdfActivityManuals` (no dedicated lecture) |
| `level-3-responder` | blocked-fallback | Building manual via `pdfActivityManuals` (no dedicated lecture) |
| `level-3-lunar-rover` | blocked-fallback | Building manual via `pdfActivityManuals` (no dedicated lecture) |

## Review and test results

- **PASS:** 10/10 authored files have 10 questions each, five different topic IDs with two questions per topic, four unique choices, an in-range correct answer, a hint, an explanation, and a PDF slide within the verified page count.
- **PASS:** GitHub branch comparison for batches 1–2 shows only files under `src/data/quizBanks/level3/`; no shared UI, routes, or registries changed.
- **NOT RUN:** Full TypeScript compiler, ESLint, Vite build, and application tests, because this worker used the connected GitHub API and does not have a local checkout with dependencies.
- **LIMITATION:** The PDF text extraction verifies page count and searchable lesson text, **not image-only slide content**. Image-dependent questions must be held for human visual review. No quiz in the two new batches depends on a diagram-only claim.
- **SOURCE ACCESS:** Some larger PDFs cannot be extracted through GitHub's Contents API in this environment; the project's local `node scripts/extract-quiz-slides.mjs --level 3 --limit 5` workflow or downloaded files should be used for subsequent batches.

## Local checks after checking out this branch

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
```

The shared integration worker must import the new exports into `src/data/quizStudio.ts` **after** reviewing and merging this content branch. That integration is intentionally out of scope here.

## Commits

- Batch 1: `4339e56460a1ab1ef2b706779c456567658c130e` — five banks
- Batch 2: `41603721a140c8011095204f717e6ba874939d06` — five banks

## Continuation — 29 October 2026

- **Batch 3 partial:** three additional banks / 30 questions authored from verifiable PDFs: Bumper Car (Interactive Mechanisms), Super Trajectory Robot 1, and F1 Racing Car.
- **Source-access blocker:** GitHub Contents API returns empty content for Learning PDFs over approximately 1 MiB (tested on Cycle Sport, Race Walking, and Electric Fan). These remain pending, rather than receiving inferred questions. This means the five-project batch size could not be completed safely in this environment.
- The new three banks were structurally checked against the existing QuizBank requirements and manually mapped to extracted page text. No new diagrams were relied upon. Local TypeScript/build tests remain unrun.
