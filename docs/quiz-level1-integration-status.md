# Level 1 Learning → Quiz Studio implementation status

Branch: `feat/quiz-level1-content`; base: `feat/quiz-studio-syllabus-question-banks-20261028`.

## Implemented and wired (46 registered project IDs)
- The 3 existing published banks (Acceleration Car, Big Head Robot and Clock) are left unchanged.
- 24 previously written Level 1 banks were reconciled from `feat/quiz-level1-phase1-standard-20261029` without overwriting original authoring. Crawl Slowly Basic and Optimized have separate project IDs but share a teaching PDF.
- 19 additional banks with independently indexed Level 1 Learning PDFs are now registered.
- Total playable at the source/schema level: **46 project IDs with 460 multiple-choice questions**, 5 questions per attempt using the existing Acceleration Car engine.
- The 5-objective randomization, no-repetition immediate retry, hints, Previous/Next, saved best/draft score, pass at 4/5, and linked source slide navigation use the existing Quiz Studio and Learning Studio; no second engine was introduced.

## Gated and blocked — missing independent teaching slides (14)
The following official Level 1 sources are **Building manuals reused as Learning fallbacks**, not separately validated teaching lectures:
- caged-bird
- propeller-aircraft
- balanced-bird
- dancing-music-box
- hand-cranking-fan
- old-fashioned-telephone
- wiper
- hand-cranking-giant-stride
- hermit-crab
- little-owl
- oscillating-fan
- pocket-pistol
- pullback-bicycle
- rotating-coffee-cup

The 13 existing content drafts for these fallback projects remain preserved in `src/data/quizBanks/level1` but are **not registered** and therefore cannot be played. Pocket Pistol is blocked without a suitably limited, developmentally appropriate and source-supported STEM assessment.

The Level 1 Learning Studio explicitly labels these 14 sources **Construction Manual** and explains that official teaching slides are unavailable. It does not claim that the fallback is a lecture.

## Exact source investigation
- `scripts/quiz-learning-source-manifest.json`: 46 source-indexed project IDs, some sharing a PDF; all 46 have project-matching source mapping.
- `scripts/level1-quiz-phase3-building-sources.json`: exact source mapping for all 14 fallback projects.
- `node scripts/extract-quiz-slides.mjs --level 1 --limit 46 --local-only`: extract all 46 indexed Level 1 Learning documents. Do not omit `--limit 46`; the script defaults to only 5 for a level.
- `node scripts/extract-phase3-level1-building-slides.mjs`: extract all 14 official fallback manuals, distinctly marked as construction reference.
- Extracted slide text and page-count records are evidence, **not visual educational approval**.

## Automated verification
`tests/quiz-level1-coverage.test.mjs` asserts:
1. The Level 1 inventory contains 60 unique project IDs and 46 indexed sources;
2. All 46 eligible sources resolve to a valid `QuizBank` and the exact registered Learning URL;
3. Fourteen Building-manual-only projects remain gated;
4. Each playable bank has ten valid questions grouped by five objectives, and five-question selection/retry works;
5. All 46 indexed PDFs open and match their recorded page counts using `pdfjs-dist`;
6. The shared Quiz route retains hints, Previous/Next, retry and Learning-slide deep links.

`.github/workflows/quiz-level1-validation.yml` runs the full 60-source extraction, tests, TypeScript, UI tests, and build **when a runner executes**.

**Verification blocker:** The first GitHub Actions push and pull-request runs failed with an empty runner name and zero job steps (before `npm ci`, tests or build). Thus no successful TypeScript/build/browser run has been observed. Investigate runner/account/workflow availability and re-run; do not claim a test pass from this failed workflow.

## Educational and release gates
- Visual inspection of PDF illustrations, mechanisms and all referenced pages;
- Human/qualified educational quality review of ambiguous answer keys and distractors;
- A successful GitHub Actions run, production build **without deployment**, and live browser smoke tests of Learning → Quiz → Results → Review Slide;
- Only then mark the draft PR as review-ready.

No `main` merge or production deployment was performed. Building routes, Building manuals and existing student progress storage remain unchanged.
