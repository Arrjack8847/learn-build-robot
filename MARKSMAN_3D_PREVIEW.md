# Marksman 3D instruction preview (Steps 1–4)

The `/practical/marksmanship` guide preserves the original 31-step manual. For **steps 1–4 only**, it includes a **3D Preview (Beta)** toggle next to **Original manual**.

## What this preview does

- Renders the actual Marksman STL shapes from `3D for marksman/` and the uploaded `mortor.glb` using Three.js, `STLLoader`, and `GLTFLoader`.
- Normalizes the unexpectedly offset STL pin geometries and displays the models in one orbitable scene.
- Demonstrates exploded-to-illustrative connected poses for steps 2 and 4; parts-preparation layouts are shown for steps 1 and 3.
- Provides Play/Pause, Replay, timeline scrubbing, orbit and zoom, plus manual-image comparison and a fallback when WebGL/assets cannot load.
- Leaves steps 5–31 and their existing images and progress controls unchanged.

## Important limitations

**This is not a verified assembly animation yet.** The photos and instruction diagrams do not provide exact 3D transforms for every internal hole, connector and motor mount. All part end poses are manually authored illustrative placeholders in `src/components/practical/Marksman3DPreview.tsx`. They must be calibrated to the physical robot and approved against the actual guide **before** labeling them accurate instructions. The imported L-motor may not perfectly match the original hardware. The controller box is not yet modeled.

The player deliberately does **not** require users to drag components or auto-complete progress; it is an instruction player rather than a simulator game.

## Development and QA

```sh
npm install
npm run build
npm run dev
```

Open `/practical/marksmanship`, navigate to steps 1–4, click **3D Preview (Beta)**. Check step 1 and 3 model layouts, step 2 and 4 replay, orbit/zoom, timeline scrub, reference toggle, small screens, reduced-motion preference and manual fallback. Check steps 5–31 remain unaffected.

The branch changes `package.json` to add `three` and `@types/three`. **Regenerate and commit `bun.lock` if using frozen Bun installs; it has not been regenerated here.** GitHub Actions now confirms both `npm run build` and `npx tsc --noEmit` pass with `npm install`; real-browser and physical placement validation are still pending. Do not merge or ship to learners until those checks and physical placement verification pass.

## Next milestone

Map named anchors to 8 mm Technic hole pitch, validate each connector axis and individual part transform against physical photos/step diagrams, then replace illustrative poses with precise assembly snapshots. Only then extend the same animation engine to steps 5–31.

## Step 2 interactive storyboard (October 12, 2026)

The new `src/components/practical/MarksmanStep2Tutorial.tsx` replaces the old 4.5-second simultaneous motion for Step 2. It is deliberately **four user-controlled actions**, not one video:

1. Identify all five parts and read their labels/instruction.
2. Insert the short axle along the displayed motor-output axis (3 seconds).
3. Attach the disc to the first beam hole, then rotate/insert the pin along the beam-hole axis (3 seconds).
4. Translate the disc/beam/pin subassembly as one group toward the motor and inspect it (4 seconds).

The tutorial provides camera keyframes with manual-orbit override, optional sound, active-part highlight/dimming, dashed axis guides, connection-point rings, action-by-action Previous / Next / Replay / Pause, reduced-motion considerations, and a scrubber. The parent step-complete/next-step button is disabled while Step 2's 3D tutorial is unfinished; students can instead follow the original manual, which is always available. Animation NEVER automatically marks the build completed.

### Coordinate measurements and physical verification

The models in the uploaded STL pack give **8 mm centre-to-centre spacing** on the five-hole beam, and the small beam is **39.3 mm overall**. In the preview, all STLs use `0.05 scene units/mm`, so the first beam hole is `x = -16mm * 0.05 = -0.8` relative to the beam midpoint. The 24 mm short axle, 16 mm pin, and ~24 mm circular disc use the same scale.

The motor GLB was imported from an LDraw assembly and has its own object/cable transforms. Therefore **the exact motor axle socket position, orientation, beam-to-motor connection and final depth have not been physically verified**. The preview explicitly tells students to use the original manual for those dimensions. Don't promote it as exact until calibrated against the physical robot.

This new player changes **Step 2 only**. Steps 1, 3 and 4 retain the earlier illustrative preview; steps 5–31 retain the 2D manual. No media or STL/GLB files were modified.

### Remaining QA gates

- Run `npm install`, `npm run build`, and `npx tsc --noEmit`; check the branch GitHub Actions run.
- Test Step 2 on desktop and mobile in an actual browser: orbit/zoom, Next blocked during a running action, Replay, Previous, timeline, manual reference, optional sound, reduced motion, and error fallback.
- Photograph/reference the motor's exact output socket and beam anchor positions to make final coupling precise.
- Improve the GLB normalization so a long motor cable cannot affect body-only physical scaling; currently the bound includes the cable.
- Reuse the action engine for other steps only after geometry is calibrated.
