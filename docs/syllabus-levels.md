# Six-level syllabus catalog

## Source of truth
The user's uploaded directory tree `E:/new_Sylabus_(Sorted)/` supplies the **exact names and hierarchy** for each level, category and immediate project/lesson entry.

| Level | Category folders | Project/lesson entries |
| --- | ---: | ---: |
| 1 | 14 | 59 |
| 2 | 18 | 59 |
| 3 | 20 | 48 |
| 4 | 20 | 56 |
| 5 | 16 | 51 |
| 6 | 15 | 43 |
| **Total** | **103** | **316** |

Project/lesson entries are the immediate folders or `.pdf`/`.pptx` files within a category. Sibling exams, copyright notices and standalone `unit ... programming` resource directories are not counted as categories or independent building lessons. Those resource folders remain in the user's original source tree.

## Routes
- `/choose` → Build a Robot → `/practical/levels`
- Level 1 preserves `/practical/level-1` and `/practical/level-1/{categoryId}` to avoid breaking existing links.
- Levels 2–6 use `/practical/levels/{levelNumber}` and `/practical/levels/{levelNumber}/{categoryId}`.
- `/practical` stays the original robot picker and existing full Building Studio.

## Files
- Level 1: `src/data/levelOneCategories.ts`, `src/data/levelOneProjects.ts`.
- Levels 2–6: `src/data/advancedSyllabus.ts`. Every level has its actual categories; no forced "14 categories per level" schema.
- UI: `src/routes/practical/levels.*.tsx`, shared `src/components/practical/SyllabusHeader.tsx`.
- Building screens: `src/components/practical/BuildingStudio.tsx` remain unchanged by this feature.

## Availability and correctness
- File/folder names are **metadata only**. Uploading a directory tree does not upload the assets on `E:`.
- Only existing implemented projects are active; the others are clearly marked `Lesson not added yet`, with no fake links.
- Acceleration Car is verified as Level 1 / Autonomous Navigation & Ranging and remains accessible.
- Funny Cat is correctly cataloged as Level 1 / Biomimicry, but it does not get an active Building Studio until the lesson has been implemented.
- To make a future project available, import its official source file(s), build the lesson with the shared studio, register a `PracticalProject` with verified `level`, `categoryId`, and matching title. Never derive hole numbers or construction instructions from folder names.

## Validation
`npm run test:ui` runs structural regression tests for Level 1, Levels 2–6 and the shared Building Studio. Run `npx tsc --noEmit`, `npm run build`, then manually test mobile and desktop navigation before merging.
