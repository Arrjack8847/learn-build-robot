# Phase 3 — official Building PDF fallback inventory (Level 1)

Phase 3 targets **14** Level 1 projects without separate Learning slides. The app already displays their **official Building manuals** in its Learning Studio. The exact local PDF paths and matching Wix-hosted URLs were cross-checked against GitHub's `public/` directory and `src/data/levelOneToThreeWixPdfUrls.ts`.

## What is committed

- `scripts/level1-quiz-phase3-building-sources.json`: 14 verified repository source paths and hosting URLs; *source exists* is NOT evidence that a quiz question is correct.
- `src/data/quizBanks/`: 14 **unreviewed, unpublished** ten-question skeletons, intentionally invalid until their source content is read.
- `scripts/extract-phase3-level1-building-slides.mjs`: page-by-page extraction from actual official PDFs, with image-heavy pages flagged.
- `tests/quiz-level1-phase3.test.mjs`: source coverage and safeguards preventing unfinished banks from being treated as published.

## Extract locally

Run this on `feat/quiz-level1-phase1-standard-20261029` with npm dependencies installed:

```powershell
npm run quiz:extract-level1-phase3
Compress-Archive -Path ".\\quiz-research\\phase3\\*.json" -DestinationPath ".\\level1-phase3-research.zip" -Force
```

The zip should be located in the repository's root folder and may be uploaded to ChatGPT to review each PDF's extracted text. For manuals with almost no text, **also provide relevant actual PDF pages or PDFs**: illustrations may be necessary to create valid questions.

## Question approval gate

Each project requires five genuine, source-supported learning objectives and two questions per objective, totaling ten questions, each with four choices, a unique answer, hint, explanation, and **verified 1-based PDF page**. Building instructions may lack enough conceptual teaching content for ten good questions; do not pad with guesswork. If the manual is too visual or too short, defer question authoring and request the original teaching notes or teacher material.

**No quiz registration or UI changes:** the official ledger remains 27 ready / 33 pending (19 already authored but not approved + these 14 needing source review). Do not merge into `main` before source and content QA.
