# Level 1 Phase 2 — indexed Learning PDF quiz drafts

These **19 draft TypeScript banks** are mapped to the exact source files from `scripts/quiz-learning-source-manifest.json`, but the PDF pages could not be read through the available GitHub binary-file connection or the hosted PDF links during this session.

**Nothing in this folder is newly published.** Each draft deliberately uses `sourcePageCount: 0`, `learningSlide: 0`, `correctIndex: -1`, and `TODO` text so that `validateQuizBank` rejects it. Do not import draft banks into `quizStudio.ts`.

Current official accounting remains **27 authored / 33 pending quiz IDs** out of 60 registered Level 1 entries. Creating draft files does not change that accounting.

## Source-indexed Phase 2 drafts

1. `ferocious-snake` → `src/data/quizBanks/ferociousSnake.ts` — `public/Level 1/Learning/Biomimicry/Ferocious snake.pdf`
2. `shy-penguin` → `src/data/quizBanks/shyPenguin.ts` — `public/Level 1/Learning/Biomimicry/Shy penguin.pdf`
3. `first-robot-model` → `src/data/quizBanks/firstRobotModel.ts` — `public/Level 1/Learning/Characters & Structures/First Robot Model/First Robot Model.pdf`
4. `rex-robot` → `src/data/quizBanks/rexRobot.ts` — `public/Level 1/Learning/Characters & Structures/REX robot/REX robot_PowerPoint-R.pdf`
5. `spider` → `src/data/quizBanks/spider.ts` — `public/Level 1/Learning/Characters & Structures/Spider/Spider_PowerPoint- R.pdf`
6. `drawing-board` → `src/data/quizBanks/drawingBoard.ts` — `public/Level 1/Learning/Display & Movement/Drawing board/Drawing board_Powerpoint.pdf`
7. `hello-world` → `src/data/quizBanks/helloWorld.ts` — `public/Level 1/Learning/Display & Movement/Hello World/01.Hello World-Slides.pdf`
8. `mechanical-masks` → `src/data/quizBanks/mechanicalMasks.ts` — `public/Level 1/Learning/Display & Movement/Mechanical masks/Mechanical masks_PowerPoint-R.pdf`
9. `athlete` → `src/data/quizBanks/athlete.ts` — `public/Level 1/Learning/Foundational Robots/Athlete.pdf`
10. `basic-programming` → `src/data/quizBanks/basicProgramming.ts` — `public/Level 1/Learning/Foundational Robots/Basic programming.pdf`
11. `drummer-robot` → `src/data/quizBanks/drummerRobot.ts` — `public/Level 1/Learning/Foundational Robots/Drummer robot.pdf`
12. `sailboat` → `src/data/quizBanks/sailboat.ts` — `public/Level 1/Learning/Foundational Robots/Sailboat.pdf`
13. `dynamic-screen` → `src/data/quizBanks/dynamicScreen.ts` — `public/Level 1/Learning/Manipulators/Dynamic screen.pdf`
14. `pendulum-ride` → `src/data/quizBanks/pendulumRide.ts` — `public/Level 1/Learning/Manipulators/Pendulum ride.pdf`
15. `the-windmill-kingdom` → `src/data/quizBanks/theWindmillKingdom.ts` — `public/Level 1/Learning/Manipulators/The windmill kingdom.pdf`
16. `mechanical-arm` → `src/data/quizBanks/mechanicalArm.ts` — `public/Level 1/Learning/Mechanisms & Simulators/Mechanical arm/Mechanical arm_PowerPoint-R.pdf`
17. `color-changing-light` → `src/data/quizBanks/colorChangingLight.ts` — `public/Level 1/Learning/Illumination & Signals/Color-changing Light/02.Color- changing Light -Slides.pdf`
18. `corridor-lamp` → `src/data/quizBanks/corridorLamp.ts` — `public/Level 1/Learning/Illumination & Signals/Corridor lamp/Corridor lamp_Powerpoint.pdf`
19. `motorcycle` → `src/data/quizBanks/motorcycle.ts` — `public/Level 1/Learning/Vehicles & Complex Movers/Motorcycle/Motorcycle_Powerpoint.pdf`

## Approval gate for EACH draft

1. Open the exact PDF and verify the actual page count, including all important visual/diagram pages.
2. Extract 5 distinct learning objectives and write 2 source-grounded questions for each (10 total).
3. Provide 4 plausible options and verify the one correct answer. Include a helpful hint and factual explanation.
4. Record real one-based `learningSlide` references; avoid translation errors and inferred page numbers.
5. Replace all TODO fields; run `validateQuizBank` and the quiz tests, then manually review answers/figures.
6. Only then import into `quizStudio.ts`, move its record from pending to completed in the status ledger and run browser QA.

No source PDF was changed, and no quiz UI or `main` branch changes were made.
