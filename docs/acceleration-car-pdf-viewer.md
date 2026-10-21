# Acceleration Car — original PDF instruction viewer

## Source of truth

The only instruction source is `Acceleration car_Building.pdf` at the repository root. Its Git object matches the PDF uploaded by the project owner as `Acceleration car_Building(3).pdf`.

The original PDF was independently inspected: **19 landscape pages, no extractable selectable text**.
- Page 1 is the manual cover.
- PDF pages 2 through 19 correspond to the **18 numbered assembly steps**.
- The viewer renders whole original PDF pages unchanged. It does **not** describe holes, rename parts, recreate illustrations, or animate robot components.
- Illustration-only instruction text: "Follow the assembly illustration shown in the manual."

## Application integration

- The Acceleration Car is Project 2 in `src/data/practical.ts`.
- Its route is `/practical/acceleration-car`.
- The existing TanStack route selects the standalone `AccelerationCarPdfViewer` for Project 2 and keeps the existing `BuildSession` for Marksman.
- Robot selection displays a neutral official-PDF card, not substitute robot artwork.
- Cover and 18 real steps may be selected individually.

## Controls

- Desktop: step list, large source-PDF page, instruction note, Previous/Next, cover, restart, fit-width, fit-page, zoom in/out/reset and Ctrl-wheel zoom.
- Mobile/tablet: step dropdown, collapsible instruction note, sticky Previous/Next, touch drag pan and two-finger pinch zoom.
- PDF.js loads once and uses the matching bundled local worker.
- Only the current page is rasterized. Canvas output is capped to about 8 million backing pixels; cancellation and off-screen rendering prevent obsolete renders and flashing.

## Validation checklist

Automated verification script: `node --test tests/acceleration-car-pdf-viewer.test.mjs`

Run locally:

```powershell
git fetch origin
git switch --track origin/feat/acceleration-car-pdf-viewer-20261020
npm install --legacy-peer-deps
node --test tests/acceleration-car-pdf-viewer.test.mjs
npx tsc --noEmit
npm run build
npm run dev
```

If this branch already exists locally, use `git switch feat/acceleration-car-pdf-viewer-20261020` then `git pull --ff-only`.

Acceptance checks before merge:
1. Open /practical and verify both Project 1 (Marksman) and Project 2 (Acceleration Car) appear.
2. Verify Step 1 opens **page 2**; Step 18 opens **page 19**; cover opens **page 1**.
3. Navigate both directions, select step 8 directly, and restart to Step 1.
4. Compare every viewer page with the original PDF; no added or removed illustration.
5. Check zoom, pan and responsive layout on narrow mobile, tablet and desktop, including long touch interactions.
6. Check console logs, run TypeScript and production build; confirm Marksman still operates.
7. Do not merge until reviewed and approved.

## Limitations

- The PDF contains illustrations rather than machine-readable step instructions. **No OCR or invented explanations are shown** in the viewer.
- Student progress bar represents the currently viewed page, **not proof a student completed the mechanical assembly**.
- The PDF itself does not provide interactive component animations or separate images for each individual part.
- Automated checks cannot replace actual browser/mobile visual QA; they must be run before merging.
