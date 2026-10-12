# Marksmanship Step 4 — 3D implementation and calibration status

## Source of truth

- Official instructional images: `public/marksmanship/steps/3.png` and `4.png`.
- Original printable model source: `3D for marksman/`. Identical Git blob objects are exposed at `public/marksmanship/models/` so the browser can load them. The source STL meshes are not altered.
- Manual: connect the two short L-beams to the existing 15-hole beam connectors; face the L-beam connectors outward; insert the medium axle at the end; keep this assembly for later.

## What this branch actually implements

The existing Step 4 image area gains a real WebGL STL *inspection* panel with model orbit, zoom, reset, previous/next instructions, play/pause of the six instructional captions, replay of emphasis, and links back to Step 3 / ahead to Step 5. This is specific to the Marksmanship step number 4. Other 30 lesson steps and their underlying saved progress are unchanged.

The original imported STL mesh vertices are preserved. Only a *temporary exploded inspection layout* is used; its scene coordinates are **not** valid fastener poses and must not be treated as assembly coordinates. Until real attachment transforms are verified, the viewer purposely does not snap or insert parts, and does not report mechanical success.

## Preliminary measurements from source STL files (native STL coordinate units)

| Source STL | Bounds min | Bounds max |
| --- | --- | --- |
| `beams/15 beams.stl` | (-3.65, 0.007, 0) | (115.65, 7.293, 7.8) |
| `beams/L/beam L small.stl` | (-3.5, -27.5, 0) | (11.5, 3.5, 8) |
| `connector/long connector.stl` | (-3.197, -3.202, 0) | (3.197, 3.202, 23.99) |
| `connector/axle connector.stl` | (-3.6, -3.6, 0) | (3.598, 3.598, 7.998) |
| `axles/middle.stl` | (-32, -2.4, 0) | (32, 2.4, 4.78) |

These are bounding boxes, *not* verified hole centers or assembly constraints. They are insufficient to establish correct final world transforms.

## Required references before an actual connection animation

1. A clear close-up photograph of the **finished physical Step 3** from both sides, showing which exact holes receive the long connectors and how they are seated.
2. Confirmation of the exact pin STL used on each prepared small L-beam. This repository currently has no Step 3 3D scene or persisted connector-to-beam parent transforms.
3. A physical Step 4 end-on / side-on photograph to establish the mounting orientation, insertion depths, and the location and installation order of the grey axle connector.
4. Confirmation that the medium cross axle enters a matching cross-profile hole without interfering with the plastic beams.

Only after those constraints are measured should a verified pose map be created, with stable component identifiers, parent-relative matrices, mesh-intersection checks, and reversible GSAP/R3F animation. The resulting assembled object should be stored as `marksman-step4-shooting-assembly` for reuse in Steps 29–30.

## Developer checks

- Run `bun install` locally to regenerate `bun.lock` for the added WebGL dependencies before using a frozen-lockfile deployment.
- Run `bun run build` and `bun run lint`, then check Step 4 on desktop and touch devices.
- Inspect browser WebGL support and verify all 5 unique STL URLs load.
- Verify orbit, zoom, reset, previous/next, play/pause, replay focus, and Step 3/5 links.
- Confirm Steps 1–3 and 5–31 still show their previous official images.
- Do not label this step *mechanically verified* until the photos/constraints above are checked.
