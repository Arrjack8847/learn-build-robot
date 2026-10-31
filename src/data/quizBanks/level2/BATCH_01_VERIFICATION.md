# Level 2 Batch 1 — PDF and Quiz Verification

Source: user-provided `level2-batch1.zip` containing each original PDF and its extraction JSON.
Scope: first five projects alphabetically from the Level 2 manifest.

| Project ID | Source pages | Visual-review flagged pages | Bank status |
|---|---:|---:|---|
| level-2-animal-trap | 18 | 8 | New 10-question bank |
| level-2-automatic-window | 19 | 11 | New 10-question bank |
| level-2-axe-robot | 19 | 6 | Existing bank, unchanged |
| level-2-battery-robot | 21 | 7 | New 10-question bank |
| level-2-batting-robot | 20 | 6 | New 10-question bank |
| **Total** | **97** | **38** | **40 new questions** |

Page counts verified by opening original PDFs, independently from the extractor JSON. Every slide was displayed on contact sheets, with text and visually flagged slides reviewed; focused detail review was performed for mechanism, coding, and building slides.

## Newly authored banks

- `src/data/quizBanks/level2/animalTrap.ts` — project `level-2-animal-trap`, source PDF `public/Level 2/Learning/Mechanisms and Concepts/Animal trap.pdf` (18 pages), verified referenced slides 3, 4, 5, 6, 7, 15, 17.
- `src/data/quizBanks/level2/automaticWindow.ts` — project `level-2-automatic-window`, source PDF `public/Level 2/Learning/Machines & Mechanisms/Automatic window.pdf` (19 pages), verified referenced slides 2, 4, 6, 7, 10, 17, 18.
- `src/data/quizBanks/level2/batteryRobot.ts` — project `level-2-battery-robot`, source PDF `public/Level 2/Learning/Programming & Precise Control/Battery robot/Battery robot_Powerpoint.pdf` (21 pages), verified referenced slides 7, 9, 10, 11, 12, 16, 18.
- `src/data/quizBanks/level2/battingRobot.ts` — project `level-2-batting-robot`, source PDF `public/Level 2/Learning/Action-Oriented/Batting robot/Batting robot_Powerpoint.pdf` (20 pages), verified referenced slides 6, 7, 9, 10, 14, 17.

All four banks follow `QuizBank`: `projectId`, `title`, `sourcePdfPath`, `sourcePageCount`, and 10 questions. Every question contains `id`, `topic`, `learningSlide`, `prompt`, a four-choice array, `correctIndex`, `explanation` and `hint`. All 40 question IDs are distinct, all 40 answer indices valid, all referenced pages in range; each bank has exactly five objective IDs with two questions each.

## Source integrity and translation notes

- Animal Trap: example spring trap (slide 5), gear acceleration (6), beam clip/drive (7), infrared motor condition (15), sensor explanation (17). No claim that the constructed robot includes the pictured spring trap.
- Automatic Window: two motor/axle starter parts (7), beam frame parts (10), touch sensors (17), one-sensor design challenge (18). The last slide (19) contains an unrelated treadmill instruction; it was deliberately excluded.
- Battery Robot: the file's cover calls it Battery Robot, while slide 7 describes the model as a turret. Questions use the actual depicted turret hardware and turning methods, without inventing an encoder formula not shown.
- Batting Robot: use slide 9's limited servo working range, slide 10's programmable angle and slide 14/17's demonstrated block progression; do not infer hidden Scratch execution behavior.
- Two See Saw Level 2 variants are outside this batch and share one Learning PDF; do not create conflicting fabricated source paths.

## Validation / integration boundaries

- PASS: manifest project ID and PDF path checks for all four authored banks.
- PASS: page counts and reference-page bounds against originals.
- PASS: structural `validateQuizBank`-equivalent checks (10 questions, five objectives × 2, distinct IDs/choices, answer ranges, hints, explanations).
- PASS: source review of questions and diagram-dependent answers against PDF slides.
- NOT RUN: full repository TypeScript build or runtime/Quiz Studio tests in this connector environment.
- NOT INTEGRATED: no changes to shared `quizStudio.ts`, imports, project registry, routes, or UI; these files are independent drafts awaiting authorized integration.
