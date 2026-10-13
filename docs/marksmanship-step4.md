# Marksmanship Robot — Step 4 (confirmed attachment holes)

This feature extends the **existing Step 3 STL viewer on main**, not the earlier experimental Step 4 inspection-only branch.

## Physical build order (user-supplied close-up photos)

1. Prepare the medium black axle: insert it through the **one cross-shaped hole** of the short grey axle connector, leaving the connector **at the midpoint** of the axle.
2. Take the 15-hole beam prepared in Step 3, with two blue pins through **white beam holes 1 and 2**, counted from the assembled end.
3. Fit the first prepared grey L-beam to the two blue pins using the **first two round holes along the long arm, starting at the corner**:
   - L circular hole 1 = **corner** (local STL x=0, y=0 mm) → white beam hole 2
   - L circular hole 2 = **next round hole** (local x=0, y=-8 mm) → white beam hole 1
   - The following L round hole (local y=-16 mm) is **not used** for connection to the white beam.
   - Keep the black pin at the end of the short arm, attached during Step 3.
4. Slide the prepared black axle unit through the **far X-shaped hole** of the mounted L-beam (local x=0, y=-24 mm).
5. Slide the opposite prepared L-beam onto the axle, simultaneously seating those same two round corner-side holes onto the remaining exposed blue connector portions on the other side of the white beam.
6. Check both grey L-beams are parallel, both existing L-beam pins face outward, and the black axle passes across both X-holes with the grey connector near its middle. Keep the entire unit separate for Steps 29–30.

This order comes from the user's later real assembly photos and replaces the earlier speculative 'attach both L-beams, then insert the axle' animation order.

## Attachment geometry

- Original model paths stay in `public/marksmanship/models/` and the existing Step 3 viewer continues to use them.
- Native 15-hole STL circular centers are at x=0,8,...112 mm, with 8 mm pitch. The Step 3 scene centers the beam at x=56 mm.
- White holes 1,2 become world x=-7,-6, respectively (units = 8 mm).
- Rotate each original grey L-beam -90° around its STL Z axis. Place its corner hole at world x=-6; the adjacent round hole becomes world x=-7.
- The far X-hole becomes world x=-9. Center the axle along that transverse world-Z axis. Use STL axle connector as a rigid unit with the black axle after the midpoint preparation.
- The original Step 3 L-pin attachment at local x=8,y=0 mm remains parented to each L-beam; its relative transform never changes.
- Mount L-beam centers on opposite faces of the white beam (world z=+1 and z=-1 in the demonstration scene).
- A two-stage insertion motion first rotates/repositions each L-beam clear of the connection, then slides it along the connector axis. 'Previous' follows the reverse path.

## Saved state / guard

- The existing Step 3 preparation snapshot is `robot:marksmanship:step3:prepared:v1`. Step 4 checks that it exists and that the selected white beam hole pair is [1,2]. If not, it shows a prompt to return to Step 3 rather than claiming compatibility.
- The Step 4 lesson is complete only after all five manual actions and the last inspection phase.
- It stores `robot:marksmanship:step4:assembled:v1` with a stable assembly ID `marksman-step4-shooting-assembly`, part transforms, and `mechanicallyVerified: false`.
- Steps 1–3 and 5–31 keep their original lesson content and visuals; Step 4 alone renders this new viewer.

## Verification

This is a geometrically placed **photo-informed 3D instructional animation**. The exact hole center spacing and model dimensions are grounded in the original STLs, but no full mesh collision analysis or physical fit verification has been run for the assembled mechanism. Avoid claiming a physically certified assembly until a full fit test against the physical model.

Run locally:

```powershell
npm install
npm run test:step3
npm run test:step4
npm run build
npm run dev
```

Review the Step 3 → Step 4 handoff, holes 1/2 on the white beam and both grey L-beams, outward-facing preinstalled pins, midpoint grey axle connector, first/second L-beam insertion depth, Previous, Replay, Pause/Resume, orbit/zoom, camera reset, localStorage refresh, and desktop/mobile viewports.
