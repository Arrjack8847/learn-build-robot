# Level 3 PDF presentation lessons — manual uploads

On 22 October 2026 the user uploaded **seven nonempty converted PowerPoint PDFs into the repository root** (not `public/learning-slides/level-3/`). Those seven original slide conversions are now imported using Vite's `?url` mechanism so they appear in the existing responsive one-page-at-a-time PDF.js presentation viewer; no move or extra GitHub Actions conversion is required.

## Uploaded PDF → Level 3 category

- `13.Super Trajectory Robot 1-update.pdf` → `level-3-super-trajectory-robot-1`
- `Stag beetle.pdf` → `level-3-stag-beetle`
- `Line patrol car.pdf` → `level-3-line-patrol-car`
- `Money detector.pdf` → `level-3-money-detector`
- `Parking gate.pdf` → `level-3-parking-gate`
- `Blood bank Centrifuge.pdf` → `level-3-blood-bank-centrifuge`
- `Fire ladder.pdf` → `level-3-fire-ladder`

## Unavailable

- `Sign.pdf` is **0 bytes**, so Sign is not exposed as a working slide lesson, although `Sign.pptx` remains uploaded. Convert and replace the zero-byte root file; after upload, add its source to `src/data/pdfActivityManuals.ts` and a presentation-only project registration in `src/data/practical.ts`.
- Flashlight Sensor, Drawbridge (empty `Drawbridge.pdf`) and Lunar Rover still lack a confirmed usable building or presentation PDF.

## Existing source / functionality

- All 37 existing Level 3 building PDF activities are unchanged.
- Seven additional slide-only projects (not certified building manuals) support Back/Next Slide, zoom, and independent `-slides-complete` progress.
- The original eight-entry PowerPoint manifest is retained for reference. GitHub Actions automated triggers are disabled, since automatic actions were blocked by GitHub billing. The workflow remains available for optional manual use if that restriction changes.
- New PDFs should be **nonempty valid PDF files**. For an already-registered activity, replace the root PDF by exactly the same filename and redeploy.

## Verify locally

```powershell
node --test tests/level-three-powerpoint-slides.test.mjs tests/level-three-uploaded-manuals.test.mjs
npx tsc --noEmit
npm run build
```
