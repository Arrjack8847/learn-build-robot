# Level 3 PowerPoint slide lessons

The eight exact original `.pptx` files mapped in `.github/level-three-presentations.json` are preserved in the repository unchanged. These source files are **presentation lessons**: the app does not claim they are step-by-step building manuals.

## Automatic conversion

`.github/workflows/convert-level-three-powerpoints.yml` runs on `main` when its configuration or a root `.pptx` changes, and also supports manual `workflow_dispatch`. It installs LibreOffice, converts the eight registered sources into `public/learning-slides/level-3/<same base name>.pdf`, verifies each output using `pdfinfo`, and commits updated browser-ready PDFs into `main`.

Because the initial code changes may deploy before the workflow commits PDFs, the viewer shows a **slides not available yet** error with Retry when the generated PDF is not present. GitHub Actions must have `contents: write` permission, and the automated commit must be deployed for slides to load.

To add another presentation, upload `.pptx` to the GitHub root, add a record to `.github/level-three-presentations.json`, register its presentation in `src/data/pdfActivityManuals.ts` and `src/data/practical.ts`, then run conversion. Replacing a registered original PPTX on main automatically updates the PDF.

## User experience

Navigate to **Building Robot → Level 3 → category → robot → View slides**. A full-screen responsive PDF.js viewer presents one exported PowerPoint slide at a time, with Back, Next Slide, overview, zoom/pan, and a separate completed-presentation state. No animations are invented; native PowerPoint animations, transitions, audio, and video do not survive PDF conversion.

## Coverage

- 37/48 Level 3 syllabus activities have building PDFs (40 version-specific PDF registrations).
- 8 additional activities have actual PowerPoints ready **for conversion** (not building-manual guarantees): Super Trajectory Robot 1, Stag beetle, Line patrol car, Money detector, Parking gate, Blood bank Centrifuge, Fire ladder, Sign.
- 3 still have no verified working source: **Flashlight Sensor**, **Drawbridge** (0-byte PDF, PPTX missing), and **Lunar Rover** (PDF missing).

A local deployment sanity check should run:
```
node --test tests/level-three-uploaded-manuals.test.mjs tests/level-three-powerpoint-slides.test.mjs
npx tsc --noEmit
npm run build
```
