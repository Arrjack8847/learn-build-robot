# Phase 3 — fourteen Level 1 source-anchored question banks (140 authored)

## Source

The 14 official Building PDFs are reused as Learning sources in the app. We used the user-uploaded `level1-phase3-research.zip` extracted on October 29, 2026 to prepare these banks. All 14 registered Building PDFs and their Wix URLs were previously cross-checked against GitHub.

The ZIP contains **208 PDF pages**, of which **159 pages were flagged for visual review** because they contain fewer than 70 extractable text characters. Most useful teaching text comes from pages 3–6; the numbered assembly pages rely heavily on diagrams. Text alone does not prove diagram-dependent assembly details.

## Implemented

- 14 TypeScript banks in `src/data/quizBanks/`, with **10 source-text-grounded multiple choice questions each**, and 5 topics with 2 alternative questions per topic.
- Each question has 4 answer choices, a single answer key, a hint, explanation, and one-based original PDF page reference.
- `scripts/level1-quiz-phase3-building-sources.json` maps the actual official fallback manuals.
- `scripts/level1-quiz-phase3-page-counts.json` records exact page counts and text/visual-review status from the uploaded extraction report.
- `tests/quiz-level1-phase3.test.mjs` checks all 140 banks for structure, source paths, page ranges, topic coverage, answer distribution, absence of placeholders, five-question selection, retry variation, and unpublished state.

## Release status

**Authored does not mean approved.** All 14 banks are deliberately **unregistered** in `src/data/quizStudio.ts`, and the Level 1 status ledger is unchanged: 27 ready / 33 pending. Phase 2 separately has 19 authored but unapproved banks. The total 33 new banks therefore contain 330 draft questions, but are not yet available to students.

The sources are largely teaching-plan outlines, not detailed lecture slides. Many questions test lesson context or named concepts rather than diagram-based engineering reasoning. This is intentionally conservative; a human educator should improve distractors, assess the five-objective breadth, review diagrams and wording, and resolve any ambiguous explanations before publishing. Hints for some of the Phase 3 banks are deliberately general and need pedagogical refinement.

The Pocket Pistol bank focuses on elastic-force concepts and safety awareness. It does not contain instructions to construct, aim or optimize a weapon/projectile launcher.

## Validation and next steps

```powershell
git pull --ff-only origin feat/quiz-level1-phase1-standard-20261029
npm run test:quiz
npm run build
```

After automated checks, review each source PDF and quiz bank together. Check students' source-page deep links and browser interactions. Update the status ledger and registry **only after manual educational approval**; `main` is untouched.
