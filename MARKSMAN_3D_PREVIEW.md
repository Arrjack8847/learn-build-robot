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
