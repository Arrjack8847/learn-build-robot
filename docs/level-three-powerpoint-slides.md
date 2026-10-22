# Level 3 PDF presentation lessons — manually uploaded sources

On 22 October 2026, eight converted PowerPoint PDFs were uploaded as nonempty files directly into the **repository root**, not `public/learning-slides/level-3/`. All eight are imported using Vite's `?url` mechanism, so PDF.js displays the original slides one at a time. No GitHub Actions conversion is required.

## Uploaded PDF → Level 3 category

- `13.Super Trajectory Robot 1-update.pdf` — Advanced Navigation & Control / Super Trajectory Robot 1
- `Stag beetle.pdf` — Biomimicry / Stag beetle
- `Line patrol car.pdf` — Foundational Robots / Line patrol car
- `Money detector.pdf` — Machines & Mechanisms / Money detector
- `Parking gate.pdf` — Machines & Mechanisms / Parking gate
- `Blood bank Centrifuge.pdf` — Manipulators / Blood bank Centrifuge
- `Fire ladder.pdf` — Mechanisms and Concepts / Fire ladder
- `Sign.pdf` — Mechanisms and Concepts / Sign (initially 0-byte, reuploaded as a nonempty PDF in commit `7d963985ba92aac7d7ed08e332a9617d7a70a7c7`)

## Still missing source data

- Flashlight Sensor — no verified matching building PDF.
- Drawbridge — `Drawbridge.pdf` remains zero bytes, no matching PowerPoint available.
- Lunar Rover — PDF not present.

## Unchanged functionality

- All 37 original Level 3 building PDF activities (40 versions) remain unchanged.
- Eight additional slide-only projects support Back/Next Slide, zoom, and independent `-slides-complete` progress, with no claim that they are original assembly manuals.
- Existing automatic PowerPoint conversion `push` trigger is disabled because GitHub Actions could not start due to a billing restriction; optional manual workflow dispatch remains configured but is not necessary.
- To update a registered presentation, upload a valid replacement PDF in the repository root with **the same exact filename**. Then redeploy the website.

## Local validation

```powershell
node --test tests/level-three-powerpoint-slides.test.mjs tests/level-three-uploaded-manuals.test.mjs
npx tsc --noEmit
npm run build
```

Connector checks establish nonempty GitHub files and code references; browser rendering and builds still need local execution.
