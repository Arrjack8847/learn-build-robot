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
- The five Biomimicry entries (Caged Bird, Ferocious snake, Funny cat, Shy penguin and Sled dog) now link to their original GitHub-uploaded PDF building manuals. Source entry filenames in the syllabus are preserved even when the uploaded building file has a .pdf extension.
- All nine Characters & Structures entries now link to their corresponding original GitHub-uploaded PDF building manuals.
- All five Display & Movement entries (Clock, Drawing board, Hello World, Mechanical masks, Primitive robot) are linked to their original GitHub-uploaded PDF manuals.
- The six Foundational Robots entries (Athlete, Basic programming, Drummer robot, Propeller Aircraft, Sailboat, The lawn mower) now link to their original GitHub-uploaded PDF manuals. Original syllabus filename metadata is preserved.
- All six Manipulators entries (Car, Dynamic screen, Pendulum ride, Rotating flying chair, Skating, The windmill kingdom) now link to their original GitHub-uploaded PDF manuals; original syllabus filename metadata is preserved.
- Mechanisms & Simulators now contains three available activities: Crawl Slowly (two separately selectable PDF versions, Basic and Optimized), Mechanical Arm and Shock Absorber. The two Crawl Slowly manuals are independent original files and maintain separate completion records.
- All seven Illumination & Signals activities, both Interactive Systems activities, Wiper (Mechanisms and Concepts), Gyro transmitter (Sensor-Focused Robots), Motorcycle and Pull back car (Vehicles & Complex Movers), and all seven Vehicles & Motion activities are now linked to their exact uploaded PDFs. This connects both the latest 11 uploaded manuals and 9 earlier uploaded-but-unlinked manuals.
- All four Machines & Mechanisms activities (Balanced Bird, Dancing Music Box, Hand-cranking Fan and Old-fashioned Telephone) now link to their exact source PDFs.
- **All 59 Level 1 syllabus activities are now linked to original source PDF Building Studio lessons**. The app also supports two separate Crawl Slowly PDF variants (Basic and Optimized), so it has 59 registered generic PDF manuals plus the separately implemented Acceleration Car PDF viewer.

## Navigation

`/choose` → Build a Robot → `/practical/level-1` → select category → select implemented lesson if available.

The category cards show the verified project count. Category detail lists every syllabus entry with a source-type label, and only shows the **Open Building Studio** link when an actual registered `getProject` target exists. Crawl Slowly offers **Basic Version** and **Optimized Version** buttons within the same syllabus card.
The existing robot picker remains at `/practical`.

## Future levels

Levels 2–6 are now audited and implemented in `src/data/advancedSyllabus.ts` with their own categories: 18, 20, 20, 16 and 15 respectively. The six-level navigation is at `/practical/levels`. See `docs/syllabus-levels.md` for full counts and source-material safeguards.

## Adding a new working project

1. Import the actual source files into the project under a stable repository path.
2. Review the manual/slides and identify real building pages; avoid inventing instructions. The five Biomimicry viewers navigate original PDF pages without assuming that each page is an assembly step.
3. Register the `PracticalProject` with a verified `level` and `categoryId`.
4. Link the matching entry via `availableProjectId` in `src/data/levelOneProjects.ts`.
5. Reuse `BuildingStudioHeader`, `BuildingStepDrawer` and the universal PDF/3D viewer.
6. Run TypeScript, project UI tests, production build and manual mobile/desktop checks.
