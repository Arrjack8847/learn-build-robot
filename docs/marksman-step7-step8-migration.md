# Marksman interactive Step 7 and Step 8 migration — review notes

This feature branch is **not a mechanical certification**. Source 3D meshes are preserved.

## Interactive step mapping

- 1–6: unchanged lesson sequence; Step 6 completes the 11-hole connector support.
- 7: **Connect Two 15-Hole Side Beams**, combining original manual Steps 7 and 8 as Assembly A. It loads the Step 5 + 6 saved model states.
- 8: **Assemble and Lock the Rectangular Frame**, the previously custom frame lesson. Eleven original STL component meshes are used to construct Assembly B; four blue connectors enter the two 5-hole beams at holes 2 and 4.
- 9: Inspect the two independent finished assemblies (Assembly A and Assembly B). Neither is joined to the other without a verified next-step mounting layout.
- 10–32: historic manual Steps 9–31; the illustrations keep their **original** source filenames and manual numbers. Interactive Steps 10–15 (manual 9–14) are flagged for mapping review because those operations may duplicate frame preparation or mount it differently than the custom photographs.

The 32-entry count includes the real photographed two-assembly handoff at Step 9, **not** a fabricated joint operation. Interactive display numbers differ from immutable original-manual numbers.

## Mechanical evidence and verification status

1. Source STLs: 11-hole beam, both bridge 48989, both hollow 15100, existing original long and short pins from the Step 5 asset paths, two 15-hole beam STLs, and long blue connector candidate.
2. For the custom frame: `5.stl`, `7.stl`, `15 beams.stl`, `long connector.stl`, `pin_pin.stl` (last is a provisional black-connector candidate).
3. The 8 mm native beam hole pitch is established by existing model normalization. This does **not** establish elastic press-fit, connector collar depth, or exact engagement.
4. Step 7 **candidate** receiving hole pairs default to first long rail 6/8 and second long rail 11/13, matched in the scene to the two Step 6 bridge mounting pairs. The user photograph set IMG_1707, IMG_1709 and IMG_1712 must be inspected to confirm actual indices and beam extension. The rail layer gap is adjustable; its default is **not physically measured**.
5. Step 7's two *additional* blue connectors remain loose in the demonstration because their true connection locations are not verified.
6. Step 8's 7-hole receiving pairs, 15-hole black-pin positions, insertion axes, connector identity, and seating depth are candidates. They require IMG_1688, IMG_1690, IMG_1692–IMG_1696 and real kit inspection. The final frame is presented as a **demonstration** with learner confirmation required.
7. The source images named above were not found as verified accessible repository files in the integration process. The UI accepts local image upload for comparison; uploaded photos remain on the learner's device.

## State isolation and progress migration

- The Step 6 result is required before loading interactive Step 7. It is read from the existing `STEP5_SNAPSHOT_KEY` and `STEP_SIX_RESULT` keys.
- Assembly A: `robot:marksmanship:step7:assembly-a:v1` / `marksman-assembly-a-side-rails-v1`.
- Assembly B: `robot:marksmanship:step8:assembly-b:v1` / `marksman-assembly-b-rectangular-frame-v1`.
- A physical **self-confirmation** is required to save each assembly. Neither self-attestation nor a theoretical STL coincidence asserts certified mechanical verification.
- Legacy progress IDs `marksmanship-s7` and `marksmanship-s8` are kept in `legacyStepCompletionIds` but **not** automatically credited to either new assembly. Historic Step 9+ IDs retain their meaning despite the new displayed numbering.
- Step 9 requires both independent saved assembly results and never combines them.

## Before main-branch merge

- Verify original side-rail hole indices, connector orientation, actual locking connector part, seating depths, and physical fit using clear orthographic photos or the kit.
- Confirm whether manual Steps 9–14 describe the same exact work as interactive Step 8. Decide whether they should remain review-only or become new non-duplicate construction steps.
- Test on an actual iPhone, Android phone, and tablet; validate all touch controls and compare final 3D images with the physical photos.
- Run the branch-specific GitHub Actions validation job. No screenshot is mechanical fit proof by itself.

The original 31-step manual and source STL meshes are not changed by this feature branch.

## Photo-aligned Step 7 revision (IMG_1713, IMG_1714, IMG_1716)

- Earlier placeholder mounting pairs 6/8 and 11/13 have been replaced by photo-aligned **6/8 for the beam on the later bridge** and **1/3 for the opposite beam on the earlier bridge**. Count from the grey/bridge-connector end. These pairs must not be confused with the holes used to fix the 11-hole central support.
- The two rails share the same longitudinal positioning relative to the bridge pairs when Step 6 uses the photographed 4/6 and 9/11 bridge placements.
- Each additional blue long pin now animates into **hole 15 from the bridge end** (the endmost hole, hole 1 when counted from the opposite free end). Original six Step 5/6 pins remain untouched.
- Guided actions now separate approach, seating and insertion of each end pin (eight actions). Step 9 renders the completed eight-action state.
- The actual 24-mm-long blue connector mesh is retained. Rail-to-center clearance and pin shoulder seating are still scene estimates, **not a measured mechanical fit**. No geometry should be marked certified until tested on the physical kit.

## Step 7 photo-guided animation correction (IMG_1729–1733)

- Updated interactive Step 7 has eight actions: prepare, align first rail, press grey core onto first rail, align second rail, press grey core (with already-attached first rail) onto second rail, insert first free-end blue pin, insert second free-end blue pin, inspect.
- Unlike the earlier side-sliding demonstration, the grey Step 6 support moves along the candidate connector axis onto a supported white beam. Both attachments use the same press-fit motion and previously mounted parts move rigidly with the central support during the second press.
- Receiving-hole pairs 6/8 and 1/3 remain photo-based candidates, not certified geometry. Both blue end pins install only after both beams are attached, in the exposed free-end holes (hole 15 counted from the opposite end).
- The stepSevenCoreOffsetZ() approach clearance of 1.65 scene units is provisional, not a measurement of penetration or collar seating; grey/black shafts require physical kit calibration.
- Reconstructed deterministic step poses ensure reliable reverse, replay and restart behavior after React Three Fiber updates the scene.
- The Step 8 frame lesson and original Step 1–6 mechanics, models and manual files remain unchanged.


## Three-point Step 7 attachment correction (October 14)

- IMG_1729/1731 show each white 15-hole beam receiving **one existing black pin plus two native grey bridge shafts**, pressed together in the downward direction. Both beams use the SAME method; outward-facing original blue pins remain untouched.
- The older presumed grey pairs 6/8 and 1/3 do not also accommodate the black pin for the saved Step 6 geometry. New **coaxial demonstration candidates** are grey 11/13 plus black 4 on the later bridge, and grey 6/8 plus black 3 on the earlier bridge (for the Step 6 photo preset). The selected black hole is always derived from the Step 6 source hole displacement; a black pin falling outside the white rail is blocked. These numbers are *not certified from a measured kit*.
- The source assembly is rotated in the teaching scene so native black and grey +Y shafts face down. Both 15-hole rail meshes rotate 90 degrees to expose vertical hole axes, and the core presses down; the first beam travels rigidly with the grey assembly when seating the second.
- Both end blue pins insert last, into the exposed free-end holes. Step 8 and the original STL parts and Step 1–6 lessons are unchanged.
- Hole fit, shaft collar depth and vertical separation remain provisional and require testing on the physical kit.
