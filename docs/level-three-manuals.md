# Level 3 original PDF building manuals — upload audit

## Source
- Audited GitHub `main` at `37d6a917bd8fe5c42377df02f6cd8f268a085ddd` on 22 October 2026, against the unchanged official Level 3 syllabus in `src/data/advancedSyllabus.ts`.
- Level 3 contains **20 categories and 48 official activities**.
- **37 of 48 distinct syllabus activities** now link to **40 PDF Building Studio registrations**. Cycle Sport has two original versions and Race Walking has three, each independently tracked.
- All 40 project mappings use **38 distinct nonempty GitHub PDF source files**, without invented assembly steps.
- Every Level 3 building lesson uses the existing one-PDF-page-at-a-time viewer. The Level 2 See Saw two-version choice remains intact.

## Outstanding 11 activities (no independently verified building PDF)

- **Advanced Navigation & Control** — Super Trajectory Robot 1
- **Biomimicry** — Stag beetle.pptx
- **Foundational Robots** — Line patrol car.pptx
- **Illumination & Signals** — Flashlight Sensor
- **Machines & Mechanisms** — Money detector.pptx
- **Machines & Mechanisms** — Parking gate.pptx
- **Manipulators** — Blood bank Centrifuge.pptx
- **Mechanisms and Concepts** — Drawbridge.pptx
- **Mechanisms and Concepts** — Fire ladder.pptx
- **Mechanisms and Concepts** — Sign.pptx
- **Vehicles & Motion** — Lunar Rover.pdf

- `Drawbridge.pdf` is **0 bytes**, so it must not be linked.
- `Lunar Rover.pdf` was absent in the audited repository.
- **Flashlight Sensor** is not automatically mapped to `04.Flashlight-Building Manual.pdf`: the two titles are not an exact match and the building manual's identity has not been verified.
- Several missing activities have `.pptx` files, but a PowerPoint is **not treated as an assembly PDF**.

## Source reuse and accuracy cautions
- `Bumper car_Building.pdf` is reused for both official Level 3 Bumper car placements in **Foundational Robots** and **Interactive Mechanisms** with different project/completion IDs.
- `05.Electric Fan-Building Manual.pdf` is reused for the two official Electric Fan entries in **Characters & Structures** and **Mechanisms and Concepts**.
- `Gyro transmitter_Building.pdf` is already an original-source PDF for Level 1 Gyro transmitter. Level 3 Manipulators / Gyro transmitter now references that same file, with independent completion.
- `11. The Long-lived Turtle - Basic Building Manual.pdf` is associated with Level 3's syllabus item `Long-Lived Turtle` based on its source name.
- `Electronic scale.pdf` is present at exactly **1,048,576 bytes**; its integrity and successful PDF rendering must be tested.
- GitHub tree size checks prove files are present and nonempty, **not** that every PDF fully renders. Run the Node test, TypeScript and production build after fetching the merged commit.

## Run locally

```powershell
node --test tests/level-three-uploaded-manuals.test.mjs
node --test tests/level-two-uploaded-manuals.test.mjs
npx tsc --noEmit
npm run build
```
