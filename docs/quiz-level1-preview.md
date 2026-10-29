# Level 1 — Local Quiz Studio preview (33 unpublished banks)

A local-only **development** preview is available for testing the 33 pending banks inside the real 5-question Quiz Studio flow. It uses `?preview=1` on the existing project quiz route. **This is not a release or educational approval.** All 33 banks remain absent from the `quizBanks` production registry and the official readiness ledger remains 27 ready / 33 pending.

## Test locally

```powershell
git pull --ff-only origin feat/quiz-level1-phase1-standard-20261029
npm run test:quiz
npm run dev
```

Open the URL printed by Vite (normally localhost:3000 or 5173) and add the following paths:

- `/quiz/ferocious-snake?preview=1` (Phase 2)
- `/quiz/caged-bird?preview=1` (Phase 3)
- `/quiz/old-fashioned-telephone?preview=1` (Phase 3)

The unmodified `/quiz/ferocious-snake` remains unavailable until teacher approval. Production builds ignore the preview flag entirely. The local preview loads the questions dynamically only in development, shows an unreviewed-question warning, and stores test progress under `bsr.quiz-preview.v1:` rather than the real student key `bsr.quiz-studio.v1:`.

The page tests standard question navigation, choice selection, hints, leave/resume, retry variation, results and Learning PDF deep links. Preview results never become real student achievements.

The 330 new questions still require a teacher's review against official PDF pages and diagrams. Use `npm run quiz:review-level1` to generate the separate source comparison and export teacher comments. Do not merge the draft banks to `main` or add them to the published registry until educational approval and UI/browser checks are complete.
