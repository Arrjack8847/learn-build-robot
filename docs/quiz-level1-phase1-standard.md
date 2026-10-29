# BE STEM READY — Level 1 quiz authoring standard (Phase 1)

This branch prepares **question-bank content work only**. It does not change the Quiz Studio UI, publish drafts, change Learning PDFs, or merge to `main`.

## Existing inventory

- Level 1 has **59 syllabus projects / 60 registered quiz IDs** (Crawl Slowly has Basic and Optimized variants).
- **27** quiz IDs already have authored ten-question banks. These still require PDF visual review and browser testing before release.
- **33** quiz IDs are pending: **19** have indexed Learning PDFs; **14** require locating and reviewing an appropriate official source, which may be the existing Building PDF fallback.
- Canonical source/queue: `scripts/quiz-learning-source-manifest.json` and `scripts/level1-quiz-status.json`. Do not count an unreviewed draft as completed.

## Required format for each project bank

Use the `QuizBank` type in `src/data/quizStudio.ts`. A bank is a TypeScript module in `src/data/quizBanks/<camelCaseProject>.ts`, exporting `<camelCaseProject>Bank`.

| Field | Requirement |
| --- | --- |
| `projectId` | Exact ID registered in syllabus, never a guessed slug |
| `title` | Lesson title |
| `sourcePdfPath` | Exact official PDF path, matching the source manifest when indexed |
| `sourcePageCount` | Count actually checked in source PDF |
| `questions` | Exactly 10, with unique question IDs |
| `topic` | Exactly 5 meaningful learning objectives, 2 questions each |
| `prompt` | Answerable from the actual lesson |
| `choices` | Four distinct plausible choices, no ambiguity |
| `correctIndex` | Zero-based answer index (0–3), source checked |
| `learningSlide` | Verified one-based page number in the same Learning PDF |
| `explanation` | Explains correct answer, grounded in that slide |
| `hint` | Helps without giving away the answer |
| `diagram` | Optional; use only after technical illustration has been checked |

The shared engine picks **one random question per objective**, **five per attempt**, and requires **4/5** correct to pass. A retry prefers the unshown paired question. Do not change these rules during question authoring.

## Create safe drafts for the 19 indexed projects

For one registered pending project:

```powershell
node scripts/scaffold-level1-quiz.mjs --project ferocious-snake
```

For all 19 indexed pending projects:

```powershell
node scripts/scaffold-level1-quiz.mjs --all-indexed
```

The generator writes to `src/data/quizBanks/`, using the exact indexed project ID, title and PDF path. **Every question remains a TODO draft**, with intentionally invalid page counts/answer indexes so it cannot pass validation. The generator refuses to overwrite existing files or scaffold an unindexed project. It never edits `quizStudio.ts`.

Do **not** auto-generate answers or use filename/topic guesses as educational evidence. Open the actual PDF, including illustrations. Write ten source-supported questions, verify the page number and answer of each, replace all TODOs, and check age appropriateness.

For the 14 projects without an indexed Learning PDF, first inspect the fallback Learning/Building source and confirm it genuinely teaches the objective. Record the official source path and reviewed page count. Never fill a fake source path to satisfy the validator.

## Review, register, validate

After a project bank is fully authored:

1. Import its bank from `src/data/quizBanks/` into `src/data/quizStudio.ts` and register it using `[bank.projectId]: bank`. A draft must **not** be registered.
2. Move that ID from `pendingWithIndexedLearningPdf` or `pendingWithoutIndexedLearningPdf` to `completed` in `scripts/level1-quiz-status.json`, adjusting `ready` and `pending` to match. Do not change the overall `registered` count.
3. Run `npm run test:quiz` (Node.js with TypeScript type stripping), then `npm run build`.
4. Open the project's Quiz card, finish an attempt, verify hints, scoring, retry variety, saved progress, mobile layout, and *Review Learning Slide N* links.
5. Review any diagram-based question visually and confirm the teaching content, not just the structure.

**Validation is not content verification.** The tests catch malformed banks, mismatched status and source metadata, and broken question distribution. They cannot prove the correct answer follows from a slide or that a translated diagram is accurate.

Keep all quiz development off `main` until the questions, tests, and browser checks have passed.
