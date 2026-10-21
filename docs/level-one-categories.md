# Level 1 syllabus project catalog

## Source and accuracy

Category and project names were transcribed from the user's complete directory tree:
`E:/new_Sylabus_(Sorted)/Level 1`.

- **14 Level 1 category folders** (see `src/data/levelOneCategories.ts`)
- **59 immediate project/lesson entries** across those categories (see `src/data/levelOneProjects.ts`)
- Entries may be an individual `.pptx`/`.pdf` lesson or a folder with multiple materials.
- Directory paths are metadata, **not uploaded web assets**. Do not serve local-drive files by guessing URLs.
- Do not infer construction steps or code from filenames; use the actual manuals before implementing activities.

## Verified examples

- `Level 1/Autonomous Navigation & Ranging/Acceleration car` maps to existing `acceleration-car` PDF Building Studio. This lesson is linked as ready.
- `Level 1/Biomimicry/Funny cat.pptx` is a listed lesson; source content for a Funny Cat presentation/PDF was also shared in conversation, but no Funny Cat lesson has been committed to the repository. It is **not** marked ready.
- Remaining 57 entries are cataloged but not linked as working building lessons.

## Navigation

`/choose` → Build a Robot → `/practical/level-1` → select category → select implemented lesson if available.

The category cards show the verified project count. Category detail lists every syllabus entry with a source-type label, and only shows the **Open Building Studio** link when an actual registered `getProject` target exists.
The existing robot picker remains at `/practical`.

## Future levels

The same tree contains Level 2–6. It does not give every level the same category taxonomy.
For example Level 2 has 18 immediate category folders; later levels also contain separate `unit ... programming` folders.
**Do not assume all six levels have 14 categories.** Audit each level's official syllabus structure separately before populating its catalog.

## Adding a new working project

1. Import the actual source files into the project under a stable repository path.
2. Review the manual/slides and identify real building pages; avoid inventing instructions.
3. Register the `PracticalProject` with a verified `level` and `categoryId`.
4. Link the matching entry via `availableProjectId` in `src/data/levelOneProjects.ts`.
5. Reuse `BuildingStudioHeader`, `BuildingStepDrawer` and the universal PDF/3D viewer.
6. Run TypeScript, project UI tests, production build and manual mobile/desktop checks.
