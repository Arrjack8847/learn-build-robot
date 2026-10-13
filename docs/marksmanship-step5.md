
# Marksmanship Robot — Step 5 asset audit and partial 3D inspection

**Step 5 is preparation only:** never attach any of its connector units
to the 11-hole beam. Step 6 performs that installation.

## Confirmed model inventory

- Genuine beam: `3D for marksman/beams/11.stl` (449884 bytes,
  8996 triangles). Original circular hole centers: x=0,8,...80 mm,
  so **11 holes**. Geometry reused unchanged.
- Four candidate long pins: `3D for marksman/connector/long connector.stl`,
  311684 bytes; single-axis connector, 23.99 mm end-to-end.
- Two candidate short pins: `3D for marksman/connector/pin_short.stl`,
  255584 bytes; single-axis connector, 9.6 mm end-to-end.
- **Missing two two-sided bridge bodies**: no source STL with two
  adjacent mounting axes and a connecting bridge.
- **Missing two hollow right-angle connector bodies**: no source STL
  with perpendicular mounting openings.

All ten checked-in connector STLs were geometry-audited; each has a
single narrow axis (X/Y extent no more than about 8 mm), so none is a
genuine double-hole bridge or right-angle body. Candidate pin identity
and seating depths remain unverified against the physical photo.

The official manual images at `public/marksmanship/steps/5.png` and
`6.png` show the parts separate, then installed in the NEXT step.

## What is safely implemented

- Genuine, unmodified 11-hole beam and six separate real-source
  candidate pin meshes in an orbitable Three.js viewer.
- Numbered holes 1–11 and six manually advanced inspection/instruction
  phases; pin lift/rotation for inspection, not fake insertion.
- Manual Step 5/6 comparison and a clear missing-asset warning.
- Completion only after the student checks that they **physically**
  assembled the four real connector units while keeping them off
  the beam. This is a manual self-confirmation, not a proof of fit.
- Step 4 snapshot `robot:marksmanship:step4:assembled:v1` is read
  only, never mutated. Step 5 stores
  `robot:marksmanship:step5:prepared:v1` with
  `mechanicallyVerified:false` and
  `full3DMeshesAvailable:false`.
- Step 6 and all previous tutorials are otherwise unchanged.

## Full tutorial blocker

To complete the user's intended six connector-insertion animations,
supply precise original STL/STEP/GLB meshes for the bridge and hollow
right-angle connector bodies, plus photos that establish insertion
orientation and seated depth. Never fabricate these missing bodies
by stretching existing straight pins.

## Validation

Run `npm run test:step5`, `npm run build`, and
`npx tsc --noEmit`. Manually inspect mobile/desktop orbit,
pin count, camera, manual comparison, Step 4 storage persistence
and the Step 5 physical-self-confirmation gate. All mechanical
insertion details require real-kit comparison.
