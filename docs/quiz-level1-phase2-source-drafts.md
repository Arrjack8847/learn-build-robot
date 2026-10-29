# Level 1 Phase 2 — 19 authored PDF-indexed quiz banks (190 questions)

## What is finished

The 19 indexed Learning PDF projects now each have an authored ten-question TypeScript bank under `src/data/quizBanks/`, on the feature branch only. The questions were written from the uploaded `level1-quiz-research.zip` page-text extracts, and include 1-based slide references, 4 choices, verified-on-text answer keys, explanations, and non-revealing hints. Each bank contains 5 different objectives with 2 questions per objective. The correct-answer positions have been balanced across A–D.

The actual page counts read from the extraction records are stored in `scripts/level1-quiz-phase2-page-counts.json`.

## Current status — authored does not mean reviewed

The new 19 banks have **not** been registered in `src/data/quizStudio.ts` and therefore must remain unavailable to students until PDF image and pedagogical QA. `scripts/level1-quiz-status.json` deliberately remains **27 ready, 33 pending, 60 registered**.

- 27 previously authored banks are connected on the development branch, subject to their own release QA.
- 19 *new* banks have been authored against text extracted from PDFs but are still awaiting visual/teacher review.
- 14 further Level 1 projects lack indexed Learning PDFs, and need official Building/Learning source review.

## Release checklist

1. Inspect the source PDFs, particularly image-heavy pages flagged by the extraction tool, for correct diagrams and context. Extracted text alone cannot verify diagrams.
2. Check the correctness and uniqueness of each answer and improve incorrect options to be plausible for Level 1 students, especially for short source lessons.
3. Review student-friendly wording, possible unwanted hints, repetitions and translations.
4. Run `npm run test:quiz` and `npm run build` on a local checkout. Test all slide review links and retries in the browser.
5. Only after approval should banks be imported/registered in `quizStudio.ts` and moved out of pending status.

Do not merge into `main` until test, content and visual checks pass. No production UI or PDF source files were changed by this phase.
