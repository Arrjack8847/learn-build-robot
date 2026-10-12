# Marksmanship Step 3 — interactive STL preparation

Open the Marksmanship Robot project and navigate to **Step 3**. Its static image is replaced by a 3D assembly using the actual repository STL files. Steps 1, 2 and 4 remain unchanged.

## Verified geometry

| Component | STL dimensions |
| --- | --- |
| 15-hole beam | 119.30 × 7.29 × 7.80 mm |
| Small L-beam (two) | 15 × 31 × 8 mm |
| Long connector | approximately 6.4 × 6.4 × 24 mm |
| Alternate pin-long-pin | approximately 6.4 × 6.4 × 24 mm |
| L-beam pin-pin | approximately 6.2 × 6.2 × 16 mm |
| Medium axle | 64 × 4.8 × 4.78 mm |
| Axle connector | approximately 7.2 × 7.2 × 8 mm |

The original straight beam contains holes at x=0,8,...112 mm. The small L-beam includes x=0,8 and y=0,-8,-16,-24 mm hole positions. The viewer uses **8 mm per world unit**, uniformly scaled, with mesh origins normalized.

## Interactive flow

Intro → first long connector → second long connector → first L-beam connector → second L-beam connector → medium axle inspection → axle connector inspection → final overview. Advance each action manually. The viewer supports Previous, Replay, Pause/Resume, orbit, zoom and Reset Camera. The main Step 4 button is locked until the final preparation state.

The scene retains individual part IDs and poses; snapshots are stored in localStorage under "robot:marksmanship:step3:prepared:v1". The function getPreparedStepThreeTransforms exports a reusable record for future Step 4 development and explicitly marks step4Applied as false.

## Items requiring physical validation

The 3D meshes verify dimensions and hole center spacing. They **cannot establish** exactly which adjacent holes and which of two similar 24 mm pin meshes match the physical reference photograph. The defaults (holes 1–2 and long connector) are **provisional**, not confirmed. The user may select another adjacent hole pair, alternate long pin, and the corner or next-leg L hole. Changing the choice resets Step 3.

Before treating Step 3 as a mechanically accepted build, compare the actual physical photo with the existing manual Step 3 image, verify hole counts and stopper faces, and dry-fit the real pins. Saved state deliberately includes mechanicallyVerified = false.

## Checks

Run "npm install", "npm run test:step3", and "npm run build". Check desktop/mobile rotation and zoom, replay/previous after each insertion, resume after refresh, full final inspection, and regression of Steps 1–2. Step 4 has not been implemented by this feature.
