# Marksman 3D Motor Unit — Steps 1 and 2

This is a **beta interactive instruction player** in the existing `/practical/marksmanship` page. Use the **3D Preview (Beta)** tab on Steps 1 or 2. The **Original manual** tab remains available.

## Implementation

- `src/components/practical/MarksmanMotorAssembly.tsx`: **shared WebGL scene** for Steps 1 and 2. It keeps the original loaded GLB/STL models alive when switching between those steps, provides labels, orbit, pinch/zoom, Reset View, timeline, forward/pause, reverse Previous, replay, manual comparison and a final camera-only orbit.
- `src/components/practical/marksmanAssemblyGeometry.ts`: measured geometry and explicitly identified calibration assumptions, separate from UI.
- `src/components/practical/Marksman3DPreview.tsx`: wrapper retains the previous beta scenes for Steps 3 and 4, which are **not** changed by this correction.
- `src/routes/practical/$projectId.tsx`: connects **Start Assembly** to Step 2 while preserving the WebGL subtree, and retains the physical-step progress controls. Merely finishing animation never marks the physical robot completed.
- `scripts/verify-marksman-assets.mjs`: validates original asset files, STL dimensions, pin flange thickness and that the motor GLB contains an output hub and cable.

The previous `MarksmanStep2Tutorial.tsx` remains in source as a historical prototype but is no longer rendered.

## Correct mechanical teaching order

1. **Step 1:** Five separate genuine assets: motor, short axle, circular disc, 5-hole beam, connector.
2. **2.1:** Short axle aligns to the candidate motor output face, slides axially toward motor, ends with visible exposed shaft.
3. **2.2:** Circular disc's central X-shaped opening aligns coaxially with the exposed shaft; disc slides along that same axle, leaving a visible gap from motor.
4. **2.3a:** Connector is inserted into a disc **outer round hole**, not the central X-shaped axle socket.
5. **2.3b:** The beam's first end hole is aligned to the connector and slides onto its other side. The connector has a **middle stop collar**, which physically prevents pushing the same connector completely through two flush parts after the parts are mated. This two-stage docking is intentional and differs from some simplified illustrated wording.
6. **2.4:** Rotate only the camera around the fixed connected subassembly. Keep the unit for Step 26.

## Measured from supplied STLs

| Physical part | Measured geometry |
| --- | --- |
| 24 mm short axle | Axis local +X; exact cross section in the STL |
| Round disc | ~23.846 mm diameter × 4 mm thick, local +Z through-axis |
| Round disc outer holes | **6** outer circles centred on 8 mm radius: (0, ±8), (±6.928, ±4) mm |
| 5-hole beam | 39.3 × 7.286 × 7.8 mm; through-holes at local X 0, 8, 16, 24, 32 mm before re-centring |
| `pin_pin.stl` | 16 mm long, Z-axis; centre stop collar **~1.4934 mm** thick |
| Motor `mortor.glb` | GLB metadata units **metres**; contains motor housing, output hub `10091.dat`, and cable nodes `u9190` |

All STL models use one uniform factor `0.05 units/mm`. The motor model uses `50 units/metre`, **never fitted by its cable-inclusive bounding box**.

## DO NOT CONSIDER PHYSICALLY VERIFIED

- The exact motor socket plane and insertion depth remain **unverified**. The motor GLB's 10091.dat hub node suggests a front plane at GLB local `[-0.0076, 0.0158, 0.01134]` metres, with native output -Z rotated to tutorial +Z. This is a candidate transform inferred from GLB hierarchy, not a measured socket-hole surface.
- The motor-axle insertion depth **8 mm** and disc rear-face spacing **8 mm** are **provisional**. They are shown as beta teaching positions, not certified against the physical assembly.
- A lower-left disc outer hole `(-6.928,-4)` mm was chosen based on the visual reference and measured hole geometry; this specific mounting hole and beam orientation are not yet confirmed by a calibrated front-side reference.
- `pin_pin.stl` is a **candidate**, not proven to be the gold-coloured connector shown in the illustrated reference; its underlying model is displayed neutral-grey. Do not colour a potentially incorrect part gold to hide the mismatch.
- The manual inconsistently labels the axle a "3-hole long axle" in Step 1 and a short axle in Step 2. The Step 2 brief requests `axles/short.stl`; confirm the actual physical component.
- Sampled STL cross-sections show the short axle has approximately 2.40 mm half-height versus about 2.35 mm of clearance in one direction of the disc central cross opening. This is a possible ~0.05 mm **press-fit/interference** in the static meshes. It must be checked on the real components; neither source mesh was stretched or edited.
- No automated proof of non-intersection against the motor GLB or physically exact assembly exists. **Do not use this as an authoritative final instruction until reviewed against the real kit.**

## QA checklist

Run `npm install`, `npm run build`, `npx tsc --noEmit`, `node scripts/verify-marksman-assets.mjs` and targeted ESLint. Check GitHub Actions for exact run results.

In an actual desktop and mobile browser, verify GLB/STL loads, Step 1 → Step 2 **without canvas remount**, all five actions, reverse path, replay, timeline, manual comparison, orbit, zoom, Reset View and reduced-motion behavior. Confirm the final connection from front, side and angled physical-photo views. Browser/device tests must be reported separately; passing CI does not prove their results.

The **main branch remains untouched** and the pull request should remain a draft until mechanical and live-browser verification is completed. All original STL, GLB, PNG and MP4 files are preserved.
