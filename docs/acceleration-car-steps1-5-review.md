# Acceleration Car — Steps 1–5 Guided Review

**Status:** Review prototype only. **Not mechanically certified.**
**Scope:** The Acceleration Car lesson, original manual Steps 1–5 only.
**Source guidance:** ZMROBO Acceleration Car teaching instructions supplied by the user.
**Technical reference:** Existing `feat/acceleration-car-steps1-5-20261020` preview.

## What changed

- Added an explicit student-facing transcript for **22 actions**: 6, 3, 5, 4, 4.
- Actions include source/target teaching-hole labels, insertion direction, connector/part, and a completion check.
- Added preparation/inspection phases in the scene instead of inventing extra connector movement.
- Kept a reversible action timeline and the existing Play/Pause, Previous Action, Replay, Next Action, step navigation and camera controls.
- Step 5 now depicts a small **yellow gear placeholder** (`Lego 8 teeth.stl`) instead of calling a bush a gear.
- Added static action-count and high-risk mapping assertions in `tests/acceleration-car-steps1-5.test.mjs`.
- No Marksman components, data or Steps 6–18 were edited in this branch.

## Files changed on top of preview branch

- `src/components/practical/AccelerationCarActionSpec.ts` — new 22-action specification
- `src/components/practical/AccelerationCarScene.tsx` — preview phases and visual part stage mapping
- `src/components/practical/AccelerationCarAssembly.tsx` — teaching labels, verification prompts and warning banner
- `tests/acceleration-car-steps1-5.test.mjs` — automated structural checks
- `.github/workflows/acceleration-car-steps1-5.yml` — CI for this review branch
- `docs/acceleration-car-steps1-5-review.md` — this report

## Existing assets reused (substitutes, not ZMROBO-certified)

| Rendered part | Source |
| --- | --- |
| Black lower gear | `3d components/Lego 20 teeth.stl` |
| Grey upper gear | `3d components/Lego 24 teeth.stl` |
| Yellow small gear | `3d components/Lego 8 teeth.stl` |
| Bushings and cross axles | `3d components/reform/lego-technic-axle-connectors-reformy/` |
| Two-hole connector | `60483_Beam_1x2_+O.stl` |
| Silver arm | `3d components/32184_fixed.stl` |
| Red and grey L supports | `3D for marksman/beams/L/` |
| Pins | Technic axle-pin and Marksman connector mesh |

**Missing as independently verified original kit CAD:** all ZMROBO-specific gear tooth profiles/hubs, measured bushings, exact two-hole block, mounting arm, red L supports, grey L bracket, joining pins and the lower-axle mount.

## Hole map: proposed only

| Join | Proposed label | Physical validation |
| --- | --- | --- |
| Black lower gear / lower bushing | BG1 / LB1 | Unverified |
| Vertical axle through bush and black gear | LB1 + BG1 | Unverified |
| Black two-hole block to shaft | B1 | Unverified |
| Upper bushing onto shaft | UB1 | Unverified |
| Silver mounting arm to bush and block | A1 / UB1; A2 / B2 | Unverified |
| Blue pin through arm / block | A2 + B2 | Unverified |
| Upper grey gear onto shaft | TG1 | Unverified |
| Red A / Silver arm / Red B | **Proposed R4 → A3 → R4** | **High risk; verify with real parts** |
| Grey L bracket to Red A | **G1 → proposed R1** | **High risk; verify with real parts** |
| Yellow gear to separate horizontal axle | Y1 | Unverified |
| Yellow gear axle to lower holder | **Receiver unknown** | **Do not use BG1**: original vertical axle occupies it |

Manufacturer IDs are not provided by the drawing; all alphabetic hole labels are teaching conventions.

## Known implementation limits

1. World coordinates and poses in `AccelerationCarScene.tsx` were inherited from an approximate STL preview. No authoritative hole-center measurements, axis vectors, or CAD transform tables were supplied. **Do not interpret them as verified fits.**
2. Preparation and alignment actions currently use inspection time/staging, rather than independently CAD-validated physical movements. The rendered parts can be viewed and replayed, but hole-target highlighting and exact seating remain future work.
3. The step 4 preview is **not a final pin/bracket joint simulation**. Pin/bracket relative transform needs measurement and a joint-group animation before mechanical approval.
4. The Step 5 eight-tooth gear, horizontal shaft mounting point and engagement with the lower gear remain approximate. No driven-gear meshing physics is simulated.
5. The source manual drawings were **not accessible in this working context**. The user-provided instruction transcript and pre-existing preview branch were available, but the PDF pages could not be measured/compared directly.
6. No 3D component shape has been modified to force an incorrect fit. No unrelated lessons were edited.

## Verification status

- Source structural check: action count **6/3/5/4/4** confirmed (22 total).
- High-risk hole labels are intentionally marked unverified.
- A GitHub workflow was configured to execute Node structural tests, TypeScript checking and Vite production build.
- The first GitHub Actions run for the review branch reported **failure** and returned no populated job steps/logs through the connector. Therefore **TypeScript success, bundle success and browser-level 3D QA are NOT confirmed**.
- Real-world verification still needed: every hole center and axis; proper axis orientation; insertion depth; mating surface; teeth/collar clearance; both directions of playback; touch interaction on iPhone and Android.

## Checklist to graduate from prototype to mechanically correct lesson

- [ ] Recover source `Acceleration car_Building.pdf` pages 2–6 and compare every installed assembly.
- [ ] Acquire measured original ZMROBO CAD or model the original parts from caliper dimensions.
- [ ] Record per connection: part IDs, actual source/target hole IDs, center XYZ, axes, opening/connector type, approach and installed transforms, and final pin visibility.
- [ ] Replace unsupported substitutes, especially the 3 gears and red/grey supports.
- [ ] Correct proposed R4 and R1 labels if the real geometry contradicts them.
- [ ] Validate grey bracket and black pin as a mechanically linked motion.
- [ ] Identify Step 5 receiver without repurposing occupied BG1.
- [ ] Add actual hole markers only where verified anchors exist.
- [ ] Pass automated tests, Vite build, phone/tablet QA and reference-frame comparisons.

**Do not merge into `main` on the assumption that these holes are physically correct.**
