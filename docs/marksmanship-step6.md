# Marksmanship Step 6 — calibrated connector beam attachment

## State continuity and scope

This feature branch is based on the Step 5 3D testing branch, not main.
Step 6 loads localStorage key robot:marksmanship:step5:prepared:v2.
It requires version 2, exactly 11 measured original part identities, and the
Step 5 learner's explicit physical-fit self-confirmation. It preserves the
original connector body, both long-pin child transforms, and short pin child
transform using the snapshot. The Step 5 browser 3D canvas is unmounted by
the lesson route, so mesh instances are rehydrated under the **same IDs**
and cached source models; this does not recreate any additional loose pins.

**No edit to Step 1–5 implementation, no edit to Step 7.**

## Source models, unaltered

The public STL URLs are reused directly from Step 5:
- beam11.stl: beams/11.stl; eleven holes at x=0,8,...,80 mm native.
- bridge-48989.stl: two instances; original two native bore centres
  (-8,4) and (8,4) mm, 16 mm separation (not adjacent beam holes).
- hollow-15100.stl: two instances; original right-angle molded
  projection on source +X; hollow pin bore at source x=-4,y=0 mm.
- pin-long-step5.stl: four pins already installed in prepared bridges.
- pin-pin-step5.stl: two 16 mm pins already installed in prepared hollows.

No new 3D primitives are used to represent real connector parts; highlights
are separate overlay guidance only.

## Mechanical placement logic

- Beam is kept fixed in its source Step 5 position (x=0,y=4.1,z=0)
  and retains hole centres x=-5..+5 in 1-world-unit increments
  (8 mm per unit).
- Hollow A installs in numbered hole 1; hollow B installs in hole 2.
  These hole numbers are stated in the official original manual.
  User chooses opposing beam faces according to the real photo.
- Original 15100's built-in +X mounting peg is rotated into the
  selected beam face's Z insertion axis using ±90 degrees Y rotation.
  Short black pin stays fixed in its original child frame.
- Bridge A and B each have original 48989 opening centres ±8 mm about
  its middle, so valid beam holes must be (h,h+2), **not** (h,h+1).
  The exact two indices on each bridge are *not proven* by the manual
  or the accessible conversation reference. No arbitrary positions are
  preselected. Student must select hole numbers and near/far beam faces
  by inspecting their physical reference before the insertion controls work.
- Beam nominal thickness = 7.8 mm. Bridge body nominal thickness = 7.8 mm.
  Bridge centre is placed 7.8 mm away from beam centre on its selected
  Z face, so the two bodies meet with faces flush. Original preinserted
  24 mm long pins enter both beam holes together. The original bridge's
  integrated posts are NOT duplicated.
- A 15100's native +X peg reaches about 8 mm from the mounting shoulder,
  centred on hole 1 or 2. Its body shoulder is positioned at the selected
  beam face; its 16 mm original black pin is retained on the side.
- Numeric connector target locations use measured model origins and
  beam hole centres; exact solid intersection/press fit, shoulder surface,
  internal pin tolerances and the photo's final orientation have **not**
  been certified, so final snapshot mechanicallyVerified remains false.
  Real-device/hardware confirmation is required before finalizing.

## Animation actions and UI

0. Load saved Step 5 parts and label 11 holes.
1. Hollow A: initial loose to coaxial approach to installed hole 1.
2. Hollow B: same, opposite side, hole 2.
3. Bridge A: identify selected two holes, align rigid bridge to approach.
4. Bridge A: insert both already installed pins simultaneously.
5. Bridge B: identify selected far-end holes, align rigid bridge.
6. Bridge B: insert both pins simultaneously.
7. Inspect the completed beam from orbitable angles.

Navigation uses reversible pose interpolation (including the same approach
on Previous), replay per current action, pause, zoom, orbit, camera reset,
reduced-motion preference, mobile camera distance adaptation, manual Step 6
image and Return to Step 5. Returning to Step 5 leaves its saved connector
preparation unchanged and removes any Step 6 completed-state claim.
The final checkbox explicitly asks the student to compare to their REAL
physical build. The handoff snapshot is:
robot:marksmanship:step6:assembled:v1
and carries assemblyId marksman-step6-main-connector-beam, logical
attachment IDs, relative fit assumptions, and readyForStep8 true.

## Unresolved validation

The prompt demands *photographically confirmed* bridge hole pairs and the
opposing 15100 mount orientation. Original full-resolution real photographs
are not included in the inspectable repository and were not available as
image bytes in this implementation turn. Therefore **those exact indices
and mounting-face choices are not marked verified by code**. Do not turn
manually selected calibration into a claim of independent physical proof.
No whole-mesh Boolean collision analysis or iPhone/Android browser capture
has been completed. Do not merge as a mechanically verified build.

## QA commands

npm run test:step6
npm run test:step5
npm run test:step4
npm run build
npx tsc --noEmit

Test manually with prepared Step 5 browser state, long/short connector
orientation, bridge span, previous/replay without duplicate children,
Step 5 return state, narrow-screen controls and real hardware photos.
