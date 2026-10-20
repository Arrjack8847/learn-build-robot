# Acceleration Car — fresh rebuild from original PDF

**Status:** planning only. The previous Project 2 prototype (including the incorrect silver arm, its approximate animations, and reused LEGO/Marksman meshes) has been removed from this branch. Acceleration Car is **not registered in the app** until the reference geometry is ready. Project 1 (Marksman Robot) remains unchanged.

## Authoritative reference

- Source supplied by project owner: `Acceleration car_Building.pdf`, 19 PDF pages.
- PDF page 1: finished-model cover illustration.
- PDF pages 2–19: illustrated assembly **Steps 1–18**, one manual step per page.
- Drawings establish appearances and assembly order; they **do not establish exact CAD dimensions, connector tolerances, shaft depths, or manufacturer hole numbers**. Those values must be measured or verified against authentic geometry before claiming mechanical accuracy.
- Do not treat old `3d components/32184_fixed.stl`, LEGO gears, or Marksman parts as the correct ZMROBO pieces simply because they resemble the illustrations.

## Step 1 — inventory directly visible in PDF page 2

1. Black toothed lower gear with central opening.
2. Long upright silver axle.
3. Lower silver bushing.
4. Black oval/two-opening connector block.
5. Upper silver bushing.
6. **Compact angled silver/grey connector arm with three visible openings** (old model incorrect; recreate to match PDF).
7. Blue joining pin/connector.

The finished Step 1 picture shows the gear at the bottom, vertical shaft and bushings, black block, angled silver arm extending to the side, and the blue pin at the arm/block joint.

### Proposed modelling/review order

1. Reconstruct each independent component shape from the illustrations. For accurate manufacture-level fit, obtain kit-specific dimensions/CAD or measure the physical parts.
2. Preview parts side by side against the manual, especially the angled silver arm **before animating**.
3. Label teaching holes as local project IDs, not official manufacturer numbers. Map each hole to measured 3D center and insertion axis.
4. Build Step 1 with **connector-first logic**: when joining arm to block, first align and partially seat blue pin in the loose arm; then align the exposed end with the block while positioning the arm on the upper bushing; move the prepared group into place together.
5. Animate physically straight approaches, a visible alignment pause, insertion, final seat, and reverse/previous-action playback. Never fade or hide installed connectors.
6. Get a visual approval of Step 1 against PDF page 2 before advancing to Step 2.

## Avoid the previous mistakes

- Do not restore `AccelerationCarScene.tsx`, `AccelerationCarAssembly.tsx`, or the old action-spec as the basis for new geometry.
- Do not use the 32184 silver-arm stand-in in the new Step 1.
- Do not claim Hole 1/2/3 positions or insertion depths are validated without checking the actual part.
- Keep the old prototype branches as recoverable git history only; do not merge their obsolete draft PR.
- Keep this document as a planning reference. Add Project 2 to the app only after the correct parts are signed off.

## Implementation gate

Before any new React/Three.js assembly code:
- [ ] Correct Step 1 component inventory visually matched to the PDF.
- [ ] Genuine component models (or explicitly labelled low-fidelity models for discussion) available.
- [ ] Shaft and connector geometry checked for hole alignment.
- [ ] Step 1 proposed action order reviewed with user.
