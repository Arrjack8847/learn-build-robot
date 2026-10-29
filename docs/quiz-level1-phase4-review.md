# Phase 4 — Level 1 Quiz Educational Review

## Status

Level 1 currently has 60 authored question-bank entries:
- 27 already registered in Quiz Studio (unchanged).
- 19 Phase 2 banks with 190 questions awaiting content and PDF diagram review.
- 14 Phase 3 banks with 140 questions awaiting content and PDF diagram review.

**No Phase 2 or Phase 3 questions are published or approved.** This review workflow deliberately does not modify the registry, the release status ledger, or the `main` branch.

## Quality pass

The initial Phase 4 audit found 100 generic/repeated hints in ten Phase 3 banks. These have been replaced by 100 distinct, question-specific prompts that do not state the answer.

Content review still matters: some questions test introductory stories, blackboard tasks, or peripheral facts rather than STEM concepts; several incorrect options are obvious because they are unrelated to the question. Structural tests cannot determine whether a child's reasoning is being tested. These items are flagged for a teacher to strengthen or replace rather than blindly approved.

From the previously extracted official PDF sources, Phase 3 has **159 of 208 pages** with little extractable text. Phase 2 also has many pages requiring diagram inspection. The original PDFs, not just the extracted JSON, are needed to judge diagram content.

## Open the offline review page

From the root of the local feature branch, with the same generated research JSON used in Phases 2 and 3:

```powershell
git pull --ff-only origin feat/quiz-level1-phase1-standard-20261029
npm run test:quiz
npm run quiz:review-level1
explorer ".\quiz-research\level1-phase4-review.html"
```

The report contains all 330 questions with source page links, correct answers, hints, explanations and the extracted PDF text. Review warnings highlight:
- a missing/mismatched source report;
- an image-heavy or unreadable referenced PDF page;
- questions likely testing stories/classroom details instead of STEM understanding;
- repeated hints or invalid references if any are reintroduced.

The review page is **local only**. Mark a question as “Answer and page checked” or “Needs revision” and add comments. Click “Export teacher review JSON” to save `level1-phase4-teacher-review.json`. These are notes, **not release approvals**. PDF links open local curriculum files; the page must be viewed on the computer that has the PDFs.

If the research JSON files are missing from the local checkout, rerun:
```powershell
npm run quiz:extract-level1
npm run quiz:extract-level1-phase3
npm run quiz:review-level1
```

## Definition of “approved to publish”

Each of the 330 questions must receive:
1. Evidence check against the actual source page (including visible illustrations).
2. Exactly one defensible answer; all other options plausible and objectively wrong.
3. Meaningful STEM relevance and age-appropriate wording, not a story-memory quiz.
4. A helpful hint that does not give away the answer.
5. Correct 1-based source link and proof that the target PDF displays in the student's Learning Studio.
6. A review note for any exceptions or revisions, and a separate explicit release decision.

Only reviewed-and-approved banks should be registered into `src/data/quizStudio.ts`, followed by status ledger updates, full tests, a production build, and a browser smoke test. No automatic publication from the reviewer JSON is supported.

## Next command

```powershell
npm run test:quiz
npm run build
```
