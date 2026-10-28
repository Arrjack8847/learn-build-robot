# BE STEM READY — Quiz Studio across the syllabus

## Status and scope

**Quiz Studio can now be represented for registered projects in Levels 1–6.**
The six-level curriculum registry is shared with the existing Learning / Building routes, and the same quiz engine, source-slide deep link behavior, hints, results, best scores, and resume logic will be reused for each published project.

**Do not confuse infrastructure with completed learning content.** There are currently **seven published project banks (70 questions)**, each grounded in its Learning PDF's extracted slide text and carrying page references. Their full interactive browser tests and any diagram-based questions still need human visual QA. Other project cards show **Quiz coming soon** rather than fabricated quizzes.

### Published question banks

| Level | Project | Verified PDF pages | Bank questions |
| --- | --- | ---: | ---: |
| 1 | Acceleration Car | 17 | 10 |
| 1 | Big Head Robot | 16 | 10 |
| 2 | Axe Robot | 19 | 10 |
| 3 | Clip Robot | 17 | 10 |
| 4 | Acoustic Control Lamp | 20 | 10 |
| 5 | Barometric Sensor | 26 | 10 |
| 6 | Altimeter | 22 | 10 |

The underlying source PDFs are the only basis for the project-specific questions. Their slides can contain poor translations, so ambiguous claims should be resolved against the actual illustrations and teacher notes before a release. The published question banks use 5 objectives × 2 questions, and attempt selection presents 5 questions covering all five. Other project cards show **Quiz coming soon** until their own content is checked against the actual lesson.

## Source coverage

- `src/data/quizSyllabus.ts`: runtime inventory of registered syllabus projects and Learning sources, including existing Building-PDF fallback sources.
- `scripts/quiz-learning-source-manifest.json`: **287 distinct registered project-to-Learning-PDF mappings** for Levels 1–6, with source paths and Wix URLs. These are **unreviewed** entries and are not quiz banks.
- Sources must be checked page by page, including diagrams and illustrations. A registered PDF URL does not prove an educational claim.

Approximate registered project inventory at the time of authoring, based on the current `practicalProjects` registry:
Level 1: 60; Level 2: 60; Level 3: 51; Level 4: 56; Level 5: 51; Level 6: 43; total: **321**. Count uses registered project IDs; variant projects can represent the same syllabus entry.

Some projects do not have a distinct Learning-PDF entry; their Learning source may reuse a Building PDF, or it may be missing. Use `getQuizSyllabusEntry(projectId)` to check the actual registration.

## Extract real lesson text (offline authoring aid)

The project uses `pdfjs-dist` already. After `npm install` in an isolated test worktree:

```powershell
node scripts/extract-quiz-slides.mjs --project acceleration-car
node scripts/extract-quiz-slides.mjs --level 2 --limit 5
node scripts/extract-quiz-slides.mjs --level 6 --limit 5
```

This writes `quiz-research/<projectId>.json` containing page text and flags for pages needing visual review. It reads local PDFs when present or streams the registered hosted source into memory one file at a time; it never rewrites source PDFs. Avoid extracting all 287 without checking connectivity and bandwidth. The extraction output is research evidence, **not** a completed quiz or source verification.

For projects using a Building PDF as their Learning fallback, inspect `getQuizLearningUrl(projectId)` and the project's Learning Studio manually. Do not invent a Learning URL.

## Publish one source-verified project quiz

1. Open that exact lesson Learning PDF, inspect **all** slides and illustrations, and verify the title and total page count.
2. Identify **five distinct teaching objectives**. Write **two questions per objective**, exactly 10 questions.
3. Each question needs four distinct plausible choices, one correct answer, a short factual explanation, an optional one- or two-sentence hint that does not reveal the answer, and a verified 1-based `learningSlide` number.
4. If there is a diagram question, validate correct gear or mechanism orientation, physical relationships, and labeling. Do not rely on decorative concept illustrations as technical evidence.
5. Add the bank to `src/data/quizStudio.ts` (or split project banks into imported modules when the registry grows). Include `projectId`, `title`, `sourcePdfPath`, `sourcePageCount`, and the 10 questions.
6. Run `validateQuizBank`; it enforces source path and page bounds, exact choice count, unique IDs, five 2-question objectives, hints and explanations. It cannot establish factual correctness — review the actual source.
7. Confirm the project's Quiz tile activates automatically, while untouched projects remain `Quiz coming soon`. Category cards display **Passed** only after a score >=4/5.
8. Browser test: welcome, centered responsive layout, hint, skipping, answer review, scoring, retry variety, local resume, exit confirmation, and a wrong answer's **Review Learning Slide N** link opening exactly the referenced PDF page.

## Development safety

Use the separate feature branch `feat/quiz-studio-all-levels-20261028`. Do not merge into `main` or deploy to Vercel before local build and interactive tests. The original working lightweight folder must remain untouched.
