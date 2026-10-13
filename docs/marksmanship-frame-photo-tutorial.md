# Marksmanship — supplementary photo-based frame preparation (feature branch)

This is an **optional interactive frame tutorial** attached below the existing
Marksmanship practical page. It does not replace, rename, unlock, reorder, or
write progress for the **31 official manual steps**.

## Original STL assets

All meshes are imported with Vite `?url` from the original repository folder,
not modeled as boxes or scaled to fake fit:

| Part | Count | Original |
|---|---:|---|
| 7-hole beams | 2 | `3D for marksman/beams/7.stl` |
| 5-hole beams | 2 | `3D for marksman/beams/5.stl` |
| Long connectors | 4 | `3D for marksman/connector/long connector.stl` |
| Alternative long connector | optional variant | `3D for marksman/connector/pin_long_pin.stl` |
| Separate 15-hole beam | 1 | `3D for marksman/beams/15 beams.stl` |
| Black connector candidates | 2 | `3D for marksman/connector/pin_pin.stl` |

The 5/7/15 beams share an 8 mm center-to-center round-hole pitch (as
documented in the existing Step 3/4 geometry). The 5-hole end holes are 32 mm
apart. Placing two parallel 7-hole rails 32 mm apart makes both end holes of
each crossbeam coaxial with the rail connectors.

### Explicitly **unverified** fit details

- The photographed 7-hole rail near-end hole *appears to be Hole 1*;
  official **Step 9** requires Holes **2 and 5**. This tutorial defaults to
  provisional photo pattern **1 and 5**, with a switch to **2 and 5**.
  Official Step 9 data is unchanged.
- The two black pins on the separate 15-hole beam have not been photo-counted.
  The UI offers provisional **Holes 5 and 8** based on official Step 11 as
  individually adjustable selections, **not** as a claim about the photographed unit.
- `pin_pin.stl` is a candidate for the two black pins. Their actual physical
  type has not been matched to the photograph.
- An **approximate 1.5 mm connector collar clearance** is used only for the
  educational animation. Source STL 24 mm/16 mm axial bounds can be tested,
  but collar engagement and press-fit depth still require physical dry-fit.
- Even with matching center axes, no collision solver or certified tolerancing
  has been run. Do not certify the assembled frame's material-intersection
  or snap fit from a render alone.

### Need original photo files in the repository

The original conversation photographs were **not present under a verified
repository file path** at implementation time. The React component accepts
`photoUrls` for real images in five states:
`inventory`, `pins`, `firstCrossbeam`, `uShape`, `rectangle`.

Until those real photographs are uploaded and mapped, the "View reference photos"
panel says the photo references are unavailable and separately displays the
genuine **official manual** Step 9/11 images. It does not invent or display
AI-generated mechanical reference photos.

## Action and pose semantics

0. All parts loose, separately inspectable.
1–2. Install long pins into first 7-hole rail at candidate Hole 1 and Hole 5.
3–4. Install the same pattern in the second 7-hole rail.
5. Lower first 5-hole crossbeam along two coaxial pins; U-shaped frame.
6. Inspect U without inserting the second crossbeam.
7. Lower the second 5-hole crossbeam; completed frame with rail tails.
8–9. Prepare the **separate** 15-hole beam with two independently selected black pins.
10. Inspect both units independently.

`marksmanFrameGeometry.ts` calculates rail, crossbeam, and pin poses from
named hole anchors; native meshes are centered and converted uniformly from
millimetres to 8 mm scene units. Insertion is an above-hole alignment followed
by travel along +/−Z. Previous and Replay calculate states from the same
stable 11 part IDs rather than cloning or incrementally accumulating meshes.

## Review / local testing

```powershell
git fetch origin
git switch feat/marksman-photo-frame-tutorial-20261013
npm install
npm run dev
```

Open the Marksmanship practical page via the app's Practical Projects list.
Expand **Photo-based frame preparation · optional 3D tutorial** below the
official step content. Test Next/Previous/Replay/Pause, auto-rotate,
zoom, reset, explosion, labels, and reference panel.

For automated checks:

```powershell
node --test tests/marksmanship-frame.test.mjs
npm run test:step3
npm run test:step4
npm run build
npx tsc --noEmit
```

If an old branch is checked out with local changes, first commit or stash those
changes instead of overwriting them.

### Acceptance / screenshot status

- **U-frame screenshot:** requires browser-rendered capture and comparison to
  the real photo. Not included in this commit; no screenshot is fabricated.
- **Rectangular-frame screenshot:** same.
- **Mobile/tablet touch controls:** implemented, physical-device test pending.
- **Physical fit, exact hole numbering, connector seating:** unresolved as above.
- **CI:** see branch's `marksmanship-frame.yml` run and PR checks;
  do not treat pending checks as passed.

The feature remains on its own branch for review. Do **not** merge without
reviewing the actual photos, inspecting physical connector positions, and
testing on at least one narrow phone screen.
