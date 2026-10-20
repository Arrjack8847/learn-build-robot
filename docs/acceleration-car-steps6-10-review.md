# Acceleration Car — Steps 6–10 Review

**Status: Interactive review prototype; NOT mechanically certified.**  
**Base branch:** feat/acceleration-car-guided-actions-20261020  
**Review branch:** feat/acceleration-car-steps6-10-20261020  
**Reference:** User-supplied implementation brief for original ZMROBO manual Steps 6–10 (PDF pages 7–11).

## Implemented
- Extended original Steps 1–5 with Steps 6–10, adding **24 new guided actions**: 4 + 7 + 5 + 4 + 4. The Steps 1–10 lesson now has 46 actions.
- Each new action provides a simple instruction, source/target proposed hole IDs, connector, insertion direction and completion check.
- Reused existing mobile-friendly 3D stage and previous/next step, previous/next action, replay, pause, and camera-reset controls.
- Retained all prior installed parts, including the Step 5 silver axle and yellow gear when advancing into Step 6.
- Step 6: second grey support, and a linked action where its black pin is inserted in the loose bracket before the pin and bracket move together.
- Step 7: long/short silver axles, one black two-hole block, blue pin, white 5-hole beam A, white 7-hole beam A.
- Step 8: second 5-hole and 7-hole white beams, preserving the assembled Step 7 chassis.
- Step 9: Red Upright A and its separately inserted blue pin.
- Step 10: mirrored Red Upright B and its separately inserted blue pin.
- Added structural tests and CI for this review branch. Main and original Steps 11–18 were not edited.

## Asset reuse
| Part | Existing asset | Accuracy |
|---|---|---|
| Grey support | 3D for marksman/beams/L/BEAM L_.stl | Unverified kit substitute |
| Red upright | 3D for marksman/beams/L/beam L small.stl | Unverified kit substitute |
| White 5-hole beam | 3d components/reform/lego-technic-beams/32316_beam_5.stl | Reused twice, unverified |
| White 7-hole beam | 3d components/reform/lego-technic-beams/32524_beam_7.stl | Reused twice, unverified |
| Axles | 3705_axle_4.stl and 3706_axle_6.stl | Reused, unverified lengths |
| Black two-hole connector | 60483_Beam_1x2_+O.stl | Reused, unverified B2 fit |
| Blue and black pins | Existing Technic / Marksman pin assets | Reused, unverified fits |
| Step 5 yellow gear | Existing 8-tooth gear placeholder | Previously provisional |

No new STL/CAD mesh was authored; new objects are instances of existing meshes.

## Proposed connection labels — all **unverified**
| Step | Nominal mapping | Validation required |
|---|---|---|
| 6 | GREY_SUPPORT_B G1 → RED_SUPPORT_B proposed R1 (black pin) | Actual red hole and center |
| 6 | GREY_SUPPORT_B proposed G5 → Step 5 lower axle | Actual lower bracket hole |
| 7 | BLACK_CONNECTOR_A B1 → shorter silver axle | Actual bore geometry |
| 7 | BLACK_CONNECTOR_A B2 → blue pin | Blue-pin compatibility |
| 7 | WHITE_5_A / WHITE_7_A H-numbered receiving holes → exposed axles and pin | Exact indices, axes, depths |
| 8 | WHITE_5_B / WHITE_7_B H-numbered receiving holes → remaining axle and pin ends | Exact indices, axes, depths |
| 9 | RED_UPRIGHT_A proposed U1 → upper axle; candidate U3 → inner support (blue pin) | Both upper/lower mounts |
| 10 | RED_UPRIGHT_B proposed U1 → opposite axle; candidate U3 → opposite inner support (blue pin) | Mirrored mounting direction |

The diagrams do not provide an official measured hole map. Local XYZ hole centers, connector axes, insertion depths, swept collision clearances, and exact fits remain unresolved. Do not report any mapping as mechanically validated yet.

## Important limits
1. The added scene coordinates are **illustrative staging poses**, not CAD-validated attachment transforms.
2. Hole IDs are visible in the action detail panel, but accurately anchored 3D hole-center markers and guides are not yet implemented.
3. The source PDF pages were not independently inspected or dimensionally measured in this run; the supplied implementation brief was used.
4. No unexplained internal black block was added in Step 8. Inspect the actual central connection geometry before adding one.
5. The final Step 10 silhouette, accurate gear mesh, and all pin/axle clearances still require visual comparison and physical-kit measurements.
6. No validation on actual phones/tablets was performed.

## Checks
- Direct GitHub source inspection: **9/9 static structure checks passed** (including action counts, STL imports, retention of Step 5 parts and route registration). These checks are not equivalent to runtime verification.
- Node structural regression tests added in tests/acceleration-car-steps6-10.test.mjs alongside Steps 1–5 tests.
- GitHub Actions workflow created for Node tests, TypeScript and Vite build. Its first run **failed**. Logs were unavailable from the GitHub connector, so the failing command and TypeScript/build results remain undetermined.
- No unverified geometry is marked as confirmed.

## Local review commands
1. git fetch origin
2. git switch --track origin/feat/acceleration-car-steps6-10-20261020
3. npm install --legacy-peer-deps --no-audit --no-fund
4. node --test tests/acceleration-car-steps1-5.test.mjs
5. node --test tests/acceleration-car-steps6-10.test.mjs
6. npx tsc --noEmit
7. npm run build
8. npm run dev

**Do not merge into main until the source manual, CAD joints, build and device tests are validated.**
