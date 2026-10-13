# Marksmanship Step 5 — real connector model insertion

## Scope and source mapping

Keep the actual 11-hole beam empty; all four prepared connector units stay separate until Step 6. Existing Steps 1–4 and 6–31 remain untouched.

| Source STL | Runtime asset | Instances |
| --- | --- | --- |
| 3D for marksman/beams/11.stl | beam11.stl | 1 |
| 48989.stl (repository root) | bridge-48989.stl | 2 |
| 15100_fixed.stl (repository root) | hollow-15100.stl | 2 |
| 3D for marksman/connector/long connector.stl | pin-long-step5.stl | 4 |
| 3D for marksman/connector/pin_pin.stl | pin-pin-step5.stl | 2 |

All 11 source-part instances use byte-identical STL copies. Original root STLs are retained.

## Measured geometry, native millimetres

- 11-hole beam: bounds X -3.65 to 83.65, Y 0.007 to 7.293, Z 0 to 7.8. Hole centres X 0,8,16,24,32,40,48,56,64,72,80. Uniform scene conversion 1 unit per 8 mm.
- 48989: 49,514 triangles; bounds X -11.93 to 11.90, Y -8.01 to 15.92, Z -0.01 to 7.8. Two Z-through bores native (-8,4) and (+8,4), mid-plane bore radius ~2.5 mm. Integrated posts in STL are NOT duplicated.
- 15100: 5,130 triangles; bounds X -7.8 to 7.8, Y -3.6 to 3.6, Z 0 to 8. One hollow Z-through opening at native (-4,0). Radius at z=4 is approximately 2.2 mm along X and 2.4 mm along Y. The perpendicular projection is already integrated.
- Long pin: long connector.stl, ~24 mm total, stem radius ~2.4–2.45 mm, stop collar radius ~3.2 mm around source Z 8.5. Align reversed (-Z) on each 48989 hole centre; offset the connector body to keep its near face at the measured collar. The 7.8 mm body thickness leaves ~8 mm pin projection either side. This is a geometry-inferred stop, not an independently measured physical depth.
- Short pin chosen: pin_pin.stl, ~16 mm overall with retaining collar near Z=8 mm. The 9.6 mm pin_short.stl was not selected because it cannot provide the photographed ~8 mm exposed section after passing through the 8 mm body. Place the 16 mm pin on the 15100 hole Z axis, collar at body positive-Z face. About 8 mm is exposed.
- Mechanical caveat: the ~2.4 mm pin-pin stem radius is slightly greater than the minimum ~2.2 mm transverse 15100 bore clearance. This may be a flexible press-fit, but a real hardware fit test is REQUIRED. No STL is distorted, resized, or used to assert certified fit.

The full mesh audit is scripts/audit-step5-geometry.mjs (STL cross sections and radial samples).

## Eight manual animation phases

0. Inspect the eleven-hole beam and eleven separate components.
1. Align/insert bridge A long pin 1.
2. Align/insert bridge A long pin 2.
3. Align/insert bridge B long pin 1.
4. Align/insert bridge B long pin 2.
5. Align/insert hollow A pin_pin.
6. Align/insert hollow B pin_pin.
7. View the five separate prepared units, with the beam completely empty.

The scene uses measured hole axes, an approach/insertion path, insertion guide, bore highlight, camera focus, reversible Previous, replay, pause/resume, orbit/pinch/zoom and Reset View. All pins remain in child groups of their actual connector bodies. The prepared snapshot uses stable part identities in robot:marksmanship:step5:prepared:v2 and records beamUnattached=true and mechanicallyVerified=false. Returning to Step 4 does not modify its shooting mechanism snapshot.

Physical fit confirmation is required before navigating into Step 6; opening the 3D assembly never silently claims certified mechanical compatibility.

## Validation

Run npm run test:step5, npm run build, npx tsc --noEmit and npm run test:step4. CI checks the actual source mesh digests. Physical fit, seated depth, iPhone/Android/iPad rendering, UI touch controls and device frame rate must still be reviewed on real hardware.
