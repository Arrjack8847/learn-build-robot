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
4. **First-rail upward trial:** The first white 15-hole beam now begins below the grey Step 6 structure, aligns beneath its pins (Action 7.2), then rises straight upward (Action 7.3). Rotating the entire Step 7 presentation by +90 degrees around X turns the existing local -Z press-fit direction into upward world +Y without changing the original STLs or connector-axis alignment. This is an orientation trial for user review; hole indices and insertion depth are not certified. Second-rail actions are unchanged.
5. Step 7 **candidate** receiving hole pairs default to first long rail 6/8 and second long rail 11/13, matched in the scene to the two Step 6 bridge mounting pairs. The user photograph set IMG_1707, IMG_1709 and IMG_1712 must be inspected to confirm actual indices and beam extension. The rail layer gap is adjustable; its default is **not physically measured**.
6. IMG_1716 confirms the two *additional* blue connectors enter the exposed endmost holes (one per 15-hole rail). The final interactive action now inserts both real STL parts in sequence, with the same facing direction. Exact pin seating depth and local axis sign still need mechanical calibration.
7. Step 8's 7-hole receiving pairs, 15-hole black-pin positions, insertion axes, connector identity, and seating depth are candidates. They require IMG_1688, IMG_1690, IMG_1692–IMG_1696 and real kit inspection. The final frame is presented as a **demonstration** with learner confirmation required.
8. The source images named above were not found as verified accessible repository files in the integration process. The UI accepts local image upload for comparison; uploaded photos remain on the learner's device.

## State isolation and progress migration

- The Step 6 result is required before loading interactive Step 7. It is read from the existing `STEP5_SNAPSHOT_KEY` and `STEP_SIX_RESULT` keys.
- Assembly A: `robot:marksmanship:step7:assembly-a:v1` / `marksman-assembly-a-side-rails-v1`.
- Assembly B: `robot:marksmanship:step8:assembly-b:v1` / `marksman-assembly-b-rectangular-frame-v1`.
- A physical **self-confirmation** is required to save each assembly. Neither self-attestation nor a theoretical STL coincidence asserts certified mechanical verification.
- Legacy progress IDs `marksmanship-s7` and `marksmanship-s8` are kept in `legacyStepCompletionIds` but **not** automatically credited to either new assembly. Historic Step 9+ IDs retain their meaning despite the new displayed numbering.
- Step 9 requires both independent saved assembly results and never combines them. The Assembly A preview shows both end pins installed.

## Before main-branch merge

- Verify original side-rail hole indices, connector orientation, actual locking connector part, seating depths, and physical fit using clear orthographic photos or the kit.
- Confirm whether manual Steps 9–14 describe the same exact work as interactive Step 8. Decide whether they should remain review-only or become new non-duplicate construction steps.
- Test on an actual iPhone, Android phone, and tablet; validate all touch controls and compare final 3D images with the physical photos.
- Run the branch-specific GitHub Actions validation job. No screenshot is mechanical fit proof by itself.

The original 31-step manual and source STL meshes are not changed by this feature branch.
