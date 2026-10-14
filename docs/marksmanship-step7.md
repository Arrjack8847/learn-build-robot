# Custom Marksman Step 7 — Rectangular frame and central beam

This branch upgrades only interactive Step 7 and does not rewrite the original 31-step manual. Manual Step 7 still says "Prepare two 15-hole beams"; its image and wording are preserved in the collapsible manual reference.

## Parts (11 original STLs, no proxies)

| Part | Quantity | Original model |
| --- | ---: | --- |
| 5-hole beams | 2 | 3D for marksman/beams/5.stl |
| 7-hole beams | 2 | 3D for marksman/beams/7.stl |
| 15-hole beam | 1 | 3D for marksman/beams/15 beams.stl |
| Blue long pins | 4 | 3D for marksman/connector/long connector.stl |
| Black pins | 2 | 3D for marksman/connector/pin_pin.stl (candidate, NOT identified from real photo) |

Meshes are recentred and uniformly scaled from original millimetre geometry at 8 mm per scene unit; originals are unchanged.

## Seven guided substeps (12 reversible microactions)

1. 7.1 Prepare 11 loose parts.
2. 7.2 Insert blue pins separately into first 5-hole beam holes 2 and 4.
3. 7.3 Insert blue pins separately into second 5-hole beam holes 2 and 4.
4. 7.4 Connect first 7-hole beam underneath.
5. 7.5 Connect second 7-hole beam underneath, closing the frame.
6. 7.6 Insert two black pins into the separate 15-hole beam.
7. 7.7 Align, insert and inspect the long beam along the centreline, with both pins moving as a rigid unit.

Step 8 does not start automatically. Step 7 has simple lesson-completion controls and no additional physical-confirmation checkbox.

## Candidate mechanical mapping (NOT physically verified)

- Confirmed written requirement: blue pins at holes 2 and 4 on each 5-hole beam.
- Candidate receiving holes on each 7-hole beam: 2 and 6, with alternatives 1/5 and 3/7 available.
- Candidate black pins: 15-hole beam holes 6 and 10, selectable as any four-pitch-separated valid pair.
- Candidate black pin receiving holes: centre hole 3 in each 5-hole beam.
- Part body thickness approximated at 7.8 mm from source STL; 1.5 mm additional clearance is a teaching placeholder.
- The 16 mm pin_pin.stl has NOT been matched against the photographed black locking component.

Real source photos IMG_1688.jpeg, IMG_1690.jpeg, IMG_1692.jpeg through IMG_1696.jpeg were not available via verified repository paths at implementation. Receiving indices, insertion axes, pin model, collar depth, physical clearances and overhangs have NOT been verified against the user's reference photos. The lesson warns the student prominently and provides a local photo-upload comparison control.

These poses are geometrically coaxial at genuine STL hole centres. This is not sufficient to claim physical press-fit or mechanical rigidity. The 3D scene groups the 11 parts as one inspection assembly but only physical fit checks can establish a working lock.

The custom photo-based Step 7 conflicts with original manual Steps 7–14; manual content and numbering remain intact, and Steps 8–31 have not been rewritten.

## Local checkout and checks

Git fetch origin; git switch feat/marksman-step7-final-frame; npm install; npm run dev.

Run npm run test:step7, node --test tests/marksmanship-frame.test.mjs, npm run test:step3, npm run test:step4, npm run test:step5, npm run test:step6, npm run build, and npx tsc --noEmit.

Review branch CI and desktop/mobile screenshots if available. Browser screenshots are not mechanical validation. Do not merge until photos and physical kit can verify both black locking joints.