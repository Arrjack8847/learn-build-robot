# Level 1 Learning Studio — 45 lecture PDFs

All 45 PowerPoint lectures are now converted PDFs in `public/Level 1/Learning/` with original category/project folders and filenames, including the corrected Motorcycle folder placement.

- The project overview keeps **Home → Level → Category → Project → Learning/Building**.
- **Learning** navigates to `/practical/:projectId?mode=learning`, displaying one PDF slide at a time in the distinct Learning Studio.
- **Building** navigates to `/practical/:projectId?mode=building`, retaining the existing building manuals, Acceleration Car viewer and Marksman 3D experience.
- Legacy links without a mode keep their building experience, except slide-only projects (which now open their Learning Studio).
- Each of the 45 original lectures is mapped in `src/data/levelOneLectures.ts`. Crawl Slowly Basic and Optimized both use its single lecture.
- 15 projects with only lecture PowerPoints do not show a misleading Building action.
- Slide navigation: previous/next, jump-to-slide, fullscreen, progress indicator and keyboard left/right arrows.
- PDF pages are displayed directly from the uploaded originals. No invented lesson content or building steps are added.

The URL path is encoded by segment to preserve filenames with spaces and symbols.

## Manual smoke tests

1. Open Acceleration Car from Level 1 and choose Learning; inspect first and last slides, then choose Building and confirm the original 18-step PDF viewer remains.
2. Open Ferocious Snake and confirm Learning is enabled and Building is unavailable.
3. Open Crawl Slowly and check both Basic/Optimized project overviews share the same Learning PDF but have separate Building manuals.
4. Open Motorcycle and confirm `/Vehicles%20%26%20Complex%20Movers/Motorcycle/` resolves rather than nested under Pull back car.
5. Check arrows, slide picker, fullscreen, landscape mobile and PDF loading/error states.
