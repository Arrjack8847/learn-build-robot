# Level 3 PowerPoint / PDF presentation lessons

The website now has **nine** slide-style lessons within Level 3: eight converted PowerPoints (all already uploaded as PDFs in the repository root) plus the now-nonempty `Drawbridge.pdf`.

All nine lessons reuse the existing responsive PDF.js viewer with **Back**, **Next Slide**, zoom and separate `-slides-complete` progress. They are presentation resources and must not be misrepresented as verified building assembly manuals.

The eight converted original PowerPoint PDFs are:

- `13.Super Trajectory Robot 1-update.pdf` — Advanced Navigation & Control
- `Stag beetle.pdf` — Biomimicry
- `Line patrol car.pdf` — Foundational Robots
- `Money detector.pdf`, `Parking gate.pdf` — Machines & Mechanisms
- `Blood bank Centrifuge.pdf` — Manipulators
- `Fire ladder.pdf`, `Sign.pdf` — Mechanisms and Concepts

Additional slide-based entry:

- `Drawbridge.pdf` — Mechanisms and Concepts; matches the activity listed as `Drawbridge.pptx` in the official syllabus, but no actual matching PPTX exists in the repository. Its source is treated as a PDF presentation.

In addition, **Lunar Rover.pdf** (Vehicles & Motion) was uploaded and connected as an original-name PDF lesson, bringing Level 3 coverage to 47/48. The only unlinked activity is **Flashlight Sensor** (Illumination & Signals), since its identity has not been confirmed against existing Flashlight manuals.

The `.github/level-three-presentations.json` manifest retains the eight known PPTX originals. GitHub Actions automatic conversion is disabled due to billing, so upload replacement converted PDFs with the exact same root filenames.

Run `node --test tests/level-three-powerpoint-slides.test.mjs tests/level-three-uploaded-manuals.test.mjs`, `npx tsc --noEmit`, and `npm run build` locally to confirm PDF parseability and build.
