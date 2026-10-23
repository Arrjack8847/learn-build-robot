# Level 3 source audit — 22 October 2026

Official Level 3 syllabus: **20 categories, 48 activities**.

## Current connected coverage

- **39 activities** use original source PDF lessons via PDF Building Studio (with assets served from `public/`), with **42 independent PDF project registrations** due to multiple Cycle Sport and Race Walking versions.
- **9 activities** use PDF slides derived from uploaded PowerPoints or provided as a slideshow-compatible PDF: eight original PPTX conversions plus Drawbridge.
- **All 48 Level 3 activities are connected.**
- The existing per-page PDF.js viewer, Back/Next controls, and separate completion keys are reused. Slides are **not** represented as verified mechanical assembly instructions.

## Latest source additions

- `Drawbridge.pdf` (1,518,257 bytes): its old zero-byte file was replaced. The official syllabus lists `Drawbridge.pptx`, but only this PDF was found, so it is registered as a **slide-based learning resource**, not claimed to be an original physical assembly manual.
- `Lunar Rover.pdf` (7,810,384 bytes): exact match for `Vehicles & Motion / Lunar Rover.pdf`, registered as a PDF lesson.
- **Flashlight Sensor is connected.** The user confirmed that `04.Flashlight-Building Manual.pdf` is the Level 3 Illumination & Signals / Flashlight Sensor source. The separate `Flashlight_Building.pdf` Level 2 Manual Flashlight lesson remains unchanged.

## Verification

The repository tree confirms the PDF sources exist in `public/` and are nonempty. The added automated Node tests parse each new PDF to verify the PDF header and at least one accessible page, but they must be executed locally (GitHub Actions is currently blocked by a billing restriction).

```powershell
node --test tests/level-three-uploaded-manuals.test.mjs tests/level-three-powerpoint-slides.test.mjs
npx tsc --noEmit
npm run build
```

Historical caution: the original root `Electronic scale.pdf` upload has a suspiciously round byte size (1,048,576 bytes); PDF readability should be checked by the existing test. No other lesson mapping has been altered.
