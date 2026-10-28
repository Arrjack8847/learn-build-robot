# Level 1 Quiz Rollout — source-grounded status

## Implemented: 10 playable quiz banks

Every published bank follows the Quiz Studio contract: 10 source-specific questions, 5 learning objectives with 2 questions each, a 5-question attempt, 4/5 passing score, retry diversity, hints, short explanations and an actual 1-based Learning PDF page per question.

| Project | PDF pages | Status |
| --- | ---: | --- |
| Acceleration Car | 17 | Quiz bank registered |
| Big Head Robot | 16 | Quiz bank registered |
| Clock | 16 | Quiz bank registered |
| Funny Cat | 21 | Quiz bank registered |
| Sled Dog | 17 | Quiz bank registered |
| Bird | 16 | Quiz bank registered |
| House | 16 | Quiz bank registered |
| SpongeBob | 20 | Quiz bank registered |
| Wali Robot | 14 | Quiz bank registered |
| Blinking Robot | 19 | Quiz bank registered |

Seven of these were added in `feat/quiz-studio-level1-pdf-batch-20261028`; three were already complete in the parent branch.

**Content QA status:** Source PDF text inspected and referenced slide by slide; code structure validated; final student-device testing, review of visual slide diagrams and classroom pedagogy remain open.

## Remaining: 50 registered Level 1 projects

**36 have a source entry** in `scripts/quiz-learning-source-manifest.json`. They need actual PDF text/diagram review and a manually authored, validated 10-question bank each.

**14 do not yet have a separately indexed Learning PDF:** Caged Bird; Propeller Aircraft; Wiper; Hand-Cranking Giant Stride; Hermit Crab; Little Owl; Oscillating Fan; Pocket Pistol; Pullback Bicycle; Rotating Coffee Cup; Balanced Bird; Dancing Music Box; Hand-Cranking Fan; Old-Fashioned Telephone. These may have Building PDF replacements; check existing Learning Studio fallback and verify source before authoring.

Some GitHub-hosted PDFs resolve to an empty or inaccessible response from the connected GitHub file API even though the syllabus index has a hosted URL. Retrieve these through the original verified asset source before writing quizzes. Do not publish invented content or guessed slide numbers.

## Testing this branch

In the isolated local test worktree, fetch `feat/quiz-studio-level1-pdf-batch-20261028`, update the checked-out files and run:

```bash
node --experimental-strip-types --test tests/quiz-studio.test.mjs
npm run build
npm run dev -- --host 127.0.0.1 --port 5173
```

Then check `/projects/funny-cat`, `/projects/bird`, `/projects/house`, `/projects/sled-dog`, `/projects/spongebob`, `/projects/wali-robot`, `/projects/blinking-robot`, and the existing three. Verify each incorrect answer's slide deep link.

Keep `main` and the existing working Vercel deployment unchanged until local tests pass.
