# Marksman interactive Step 7 and Step 8 migration — review notes

This feature branch is **not a mechanical certification**. Source 3D meshes are preserved.

## Interactive step mapping

- 1–6: unchanged lesson sequence; Step 6 completes the 11-hole connector support.
- 7: **Connect Two 15-Hole Side Beams**, combining original manual Steps 7 and 8 as Assembly A. It loads the Step 5 + 6 saved model states.
- 8: **Assemble and Lock the Rectangular Frame**, the previously custom frame lesson. Eleven original STL component meshes are used to construct Assembly B; four blue connectors enter the two 5-hole beams at holes 2 and 4.
- 9: Join the already finished Step 7 (Assembly A) and Step 8 (Assembly B) structures. User-supplied photographs from October 15 identify two receiving holes on each 15-hole Step 7 rail (holes 7/11 counted from the existing blue-pinned free end), the four existing Step 8 blue pins, and the longest Step 8 beam as front-facing. This is a photo-guided fitting demonstration, not a measured press-fit certification.
- 10–32: historic manual Steps 9–31; the illustrations keep their **original** source filenames and manual numbers. Interactive Steps 10–15 (manual 9–14) are flagged for mapping review because those operations may duplicate frame preparation or mount it differently than the custom photographs.

The 32-entry count includes the photographed two-assembly mounting operation at Step 9. The four receiving holes are now photo-marked, but exact seating depths remain unmeasured. Interactive display numbers differ from immutable original-manual numbers.

## Mechanical evidence and verification status

1. Source STLs: 11-hole beam, both bridge 48989, both hollow 15100, existing original long and short pins from the Step 5 asset paths, two 15-hole beam STLs, and long blue connector candidate.
2. For the custom frame: `5.stl`, `7.stl`, `15 beams.stl`, `long connector.stl`, `pin_pin.stl` (last is a provisional black-connector candidate).
3. The 8 mm native beam hole pitch is established by existing model normalization. This does **not** establish elastic press-fit, connector collar depth, or exact engagement.
4. Current **user-approved viewer settings** (October 14 screenshot) are vertical mounting offset **0.9 scene units**, first rail grey receiving holes **13/15** (black connector **hole 6**), and second rail grey receiving holes **8/10** (black connector **hole 5**) with the pictured Step 6 mounting configuration. These values are visual calibration, **not measured physical press-fit clearance**.
5. Both *additional* Step 7 blue connectors install only AFTER both white beams are attached: one at Hole 1 of each beam's exposed RIGHT end (actual STL hole index 1, not 15), entering from the SAME face as the black mounting pins. The connector shoulders and seating depths remain unmeasured.
6. Step 8's 7-hole receiving pairs, 15-hole black-pin positions, insertion axes, connector identity, and seating depth are candidates. They require IMG_1688, IMG_1690, IMG_1692–IMG_1696 and real kit inspection. The final frame is presented as a **demonstration** with learner confirmation required.
7. The source images named above were not found as verified accessible repository files in the integration process. The UI accepts local image upload for comparison; uploaded photos remain on the learner's device.

## State isolation and progress migration

- The Step 6 result is required before loading interactive Step 7. It is read from the existing `STEP5_SNAPSHOT_KEY` and `STEP_SIX_RESULT` keys.
- Assembly A: `robot:marksmanship:step7:assembly-a:v1` / `marksman-assembly-a-side-rails-v1`.
- Assembly B: `robot:marksmanship:step8:assembly-b:v1` / `marksman-assembly-b-rectangular-frame-v1`.
- A physical **self-confirmation** is required to save each assembly. Neither self-attestation nor a theoretical STL coincidence asserts certified mechanical verification.
- Legacy progress IDs `marksmanship-s7` and `marksmanship-s8` are kept in `legacyStepCompletionIds` but **not** automatically credited to either new assembly. Historic Step 9+ IDs retain their meaning despite the new displayed numbering.
- Step 9 requires both independent saved Step 7 and Step 8 results and animates joining them without altering either saved source assembly. It records an additional physical self-check and warns about saved geometry collisions instead of concealing them.

## Before main-branch merge

- Verify original side-rail hole indices, connector orientation, actual locking connector part, seating depths, and physical fit using clear orthographic photos or the kit.
- Confirm whether manual Steps 9–14 describe the same exact work as interactive Step 8. Decide whether they should remain review-only or become new non-duplicate construction steps.
- Test on an actual iPhone, Android phone, and tablet; validate all touch controls and compare final 3D images with the physical photos.
- Run the branch-specific GitHub Actions validation job. No screenshot is mechanical fit proof by itself.

The original 31-step manual and source STL meshes are not changed by this feature branch.

## Previous photo-aligned Step 7 revision (superseded by three-point correction below)

- Earlier placeholder mounting pairs 6/8 and 11/13 have been replaced by photo-aligned **6/8 for the beam on the later bridge** and **1/3 for the opposite beam on the earlier bridge**. Count from the grey/bridge-connector end. These pairs must not be confused with the holes used to fix the 11-hole central support.
- The two rails share the same longitudinal positioning relative to the bridge pairs when Step 6 uses the photographed 4/6 and 9/11 bridge placements.
- Each additional blue long pin now animates into **hole 15 from the bridge end** (the endmost hole, hole 1 when counted from the opposite free end). Original six Step 5/6 pins remain untouched.
- Guided actions now separate approach, seating and insertion of each end pin (eight actions). Step 9 renders the completed eight-action state.
- The actual 24-mm-long blue connector mesh is retained. Rail-to-center clearance and pin shoulder seating are still scene estimates, **not a measured mechanical fit**. No geometry should be marked certified until tested on the physical kit.

## Previous Step 7 motion revision (retained for history; hole-pair guesses superseded)

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

## Connector insertion face (IMG_1732–1734), corrected right-end index below

- The physical confirmation is specifically about the **side** of each additional blue connector, not just its free-end hole: install both blue pins **from the black-connector face** of the white beam.
- Count Hole 1 at the exposed RIGHT end of each white rail in the app screenshot. The correct STL local index is **1** (x=-7 hole pitches); the assembly root rotates 180° around Z, so index 15 (x=+7) had incorrectly placed both pins on the LEFT. The pins still enter from the black-connector face.
- Step 7 local coordinates: black connector insertion face = **-local Y**; each blue long pin approaches from **-local Y** and travels **+local Y** into its hole. The scene's 180-degree Z rotation does not change this material-relative side.
- The scene highlights the corrected RIGHT-end hole on the black-facing beam surface during actions 7.6 and 7.7, and animates both extra pins along this axis. Existing blue pins projecting laterally from the Step 6 grey units must not be moved.
- Both rails are attached via one black pin and two grey shafts BEFORE either extra blue end pin installs. The user-visible steps remain eight actions. Exact mechanical seating depth is still provisional and must be compared with the physical kit.

## Right-hand end-pin placement fix (user's October 14 screenshot)

- The displayed Step 7 had both added blue long pins at the **left** ends, contrary to the user's real assembly photos and confirmation that they belong at the **right** exposed ends.
- Root cause: the scene root rotates 180° about Z, reversing the direction of the STL beam's X axis. The earlier index 15 (local x=+7 pitch units) is the left end after that rotation; the correct right exposed end is index **1** (local x=-7).
- Updated only `STEP_SEVEN_END_PIN_HOLE`, its corresponding saved completion metadata, and documentation/regression tests. All beam placement and three-point black/grey connector transforms are deliberately unchanged. Scene pin transforms, ring highlights and camera focus already derive from this shared constant and therefore target the new right-hand holes.
- Both extra pins retain the user's confirmed insertion face: **black-connector side**. Physical pin shoulder depth remains provisional; screenshot/kit visual review is still needed.

## User-approved Step 7 calibration (October 14, later screenshot)

- Persist new starting/default controls: **vertical mounting offset = 0.9**, **first rail first grey hole = 13**, **second rail first grey hole = 8**.
- Derived grey receiving pairs: **13/15** and **8/10**. The corresponding black-pin holes are **6** and **5**, with the user's saved Step 6 assembly shown in the screenshot.
- Do not adjust either rail's 3D transform formula, grey/black connector model, or completed Step 8 frame as part of this change.
- The two additional long blue pins remain at **STL Hole 1**, at the exposed RIGHT ends of both white rails, entering from the **black-connector face**.
- The pin-insertion camera uses a wider target between the rail midpoint and end-pin hole. It stays on one side for both insertions to avoid clipping the complete assembly during the camera change. No physical component position is changed by this camera improvement.
- These are accepted lesson-viewer coordinates; measured connector seating depth and real device visual confirmation remain separate QA tasks.

## October 15: Step 9 user-photographed four-pin join

- Reference photos: IMG_1769 (Action 0 side-by-side preparation), IMG_1773 (black-arrow target hole positions), IMG_1774 and IMG_1775 (joined side and close-up angles).
- Five zero-based actions: 0 prepare both; 1 rotate/lift Step 8 with the 15-hole white beam frontward; 2 align four original Step 8 blue pins; 3 insert all four together; 4 inspect final orientation.
- The marked target pair on **each** Step 7 rail is hole 7 and hole 11 counted from the free blue-pin end. These are not the two end pins installed during Step 7; they are new receiving holes for Step 8 pins.
- New Step 9 scene renders Step 7 and Step 8 together using the genuine existing STL geometry, with no manual reconstruction of a new proxy part. Step 8 is transformed as ONE rigid unit. The Step 8 local +Z blue pin axis is mapped to the new Step 7 mounting axis.
- There is an outstanding issue: Step 7's locked saved calibration may occupy a photo-marked receiving hole (particularly the second rail's selected hole 7). This is surfaced as a warning, not solved by moving the older connectors. The user must visually/physically compare the new combined demo with the real structure. 3D seating depth is provisional, mechanical fit is not certified.
- The previous Step 9 *separate-only* checkpoint was intentionally superseded by the user's October 15 assembly photos. Old Step 7/8 completion keys remain unchanged, while the newly joined result is independently stored at `robot:marksmanship:step9:joined:v1`.

## Horizontal Step 7 turn in Step 9 (October 15 follow-up)

- User correction: Step 7 must be turned **180 degrees horizontally**, not flipped upside down, before the four Step 8 blue pins attach. Step 8 remains in its approved front-facing orientation.
- The turn is local to the completed Step 7 group inside Step 9: `rotation={[0,Math.PI,0]}` via shared `STEP_NINE_STEP_SEVEN_YAW`. No Step 7 source mesh, installed grey/black connector, or Step 7 lesson animation is changed.
- A horizontal turn reverses the Step 7 side-rail Z positions and the longitudinal X hole order in the Step 9 shared frame. Recalculate all four world target points and the Step 8-to-Step 7 pin index mapping, without moving an individual blue pin: BLUE_1 -> second rail hole 7; BLUE_2 -> first rail hole 7; BLUE_3 -> second rail hole 11; BLUE_4 -> first rail hole 11. Counting remains from the existing blue-pinned free end.
- Residual checks warn if stored Step 7 rail offsets cannot be matched by a rigid Step 8 transform, and existing overlapping Step 7 connector positions remain visible rather than secretly modified.
