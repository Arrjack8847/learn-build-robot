# Level 3 Quiz Studio — Complete Syllabus Coverage Report
Updated: 29 October 2026

## Final scope and status

- **51 of 51 registered Level 3 projects have integrated QuizBank entries (510 questions)** on `feat/quiz-level3-content`.
- **49 new question banks** are in `src/data/quizBanks/level3/`; **2 existing banks** (Clip Robot and Following Robot) are preserved in `src/data/quizBanks/`.
- **46** projects use dedicated official Learning PDFs; **5** projects reuse their official Building/teacher manual PDFs as Learning sources. There are **48 unique PDFs** due to shared Learning sources for Cycle Sport and Race Walking variants.
- All 48 distinct PDF URLs were downloaded successfully in an isolated Vercel *development sandbox*, and PDF page counts and searchable lesson text were extracted page by page with PyMuPDF.
- The shared `src/data/quizStudio.ts` registry imports all 49 new Level 3 banks. The website's existing project route enables its Quiz card whenever `getQuizBank` passes structural validation; no Learning/Building route was changed.
- Each bank provides 10 four-answer questions on 5 teaching objectives (two questions each), one correct answer, a hint, explanation, official source path, page count and 1-based Learning slide reference.
- Playable features reuse the Acceleration Car engine: select 5 randomized questions (one from each topic), 4/5 pass threshold, fixed navigation, hints, save/resume, retry, results, and return to a Learning slide.
- Quiz questions are authored against extracted PDF *text*, including teacher-manual learning objectives. **Visual-only diagrams were not independently verified**, so no image-only answer claim is relied upon. Original teacher manuals include extensive low-text assembly diagrams, which remain unchanged.
- No main merge or intentional deployment.

## Complete project inventory

| Project | Source role | Official pages | Bank questions | Status |
|---|---|---:|---:|---|
| `level-3-anti-fall-robot` | Learning PDF | 33 | 10 | Integrated |
| `level-3-automated-guided-vehicle` | Learning PDF | 36 | 10 | Integrated |
| `level-3-automatic-door` | Learning PDF | 34 | 10 | Integrated |
| `level-3-automatic-seesaw` | Learning PDF | 21 | 10 | Integrated |
| `level-3-blood-bank-centrifuge` | Learning PDF | 28 | 10 | Integrated |
| `level-3-bumper-car-foundational-robots` | Learning PDF | 12 | 10 | Integrated |
| `level-3-bumper-car-interactive-mechanisms` | Learning PDF | 18 | 10 | Integrated |
| `level-3-clip-robot` | Learning PDF | 17 | 10 | Integrated |
| `level-3-cycle-sport-basic` | Learning PDF | 28 | 10 | Integrated |
| `level-3-cycle-sport-optimized` | Learning PDF | 28 | 10 | Integrated |
| `level-3-disinfection-lamp` | Learning PDF | 30 | 10 | Integrated |
| `level-3-drawbridge` | Learning PDF | 21 | 10 | Integrated |
| `level-3-electric-bulldozer` | Learning PDF | 34 | 10 | Integrated |
| `level-3-electric-fan-characters-structures` | Learning PDF | 31 | 10 | Integrated |
| `level-3-electric-fan-mechanisms-and-concepts` | Learning PDF | 14 | 10 | Integrated |
| `level-3-electric-guitar` | Learning PDF | 21 | 10 | Integrated |
| `level-3-electronic-scale` | Learning PDF | 27 | 10 | Integrated |
| `level-3-f1-racing-car` | Learning PDF | 20 | 10 | Integrated |
| `level-3-fire-ladder` | Learning PDF | 25 | 10 | Integrated |
| `level-3-flashlight-sensor` | Learning PDF | 29 | 10 | Integrated |
| `level-3-following-robot` | Learning PDF | 22 | 10 | Integrated |
| `level-3-gyro-transmitter` | Learning PDF | 21 | 10 | Integrated |
| `level-3-juicer-machine` | Learning PDF | 29 | 10 | Integrated |
| `level-3-light-sensitive-curtains` | Learning PDF | 38 | 10 | Integrated |
| `level-3-line-patrol-car` | Learning PDF | 12 | 10 | Integrated |
| `level-3-long-lived-turtle` | Learning PDF | 24 | 10 | Integrated |
| `level-3-money-detector` | Learning PDF | 17 | 10 | Integrated |
| `level-3-music-box` | Learning PDF | 34 | 10 | Integrated |
| `level-3-music-doorbell` | Learning PDF | 26 | 10 | Integrated |
| `level-3-obstacle-avoidance-robot-1` | Learning PDF | 19 | 10 | Integrated |
| `level-3-parking-gate` | Learning PDF | 16 | 10 | Integrated |
| `level-3-race-walking-basic` | Learning PDF | 29 | 10 | Integrated |
| `level-3-race-walking-optimized` | Learning PDF | 29 | 10 | Integrated |
| `level-3-race-walking-optimized-ratchet` | Learning PDF | 29 | 10 | Integrated |
| `level-3-safe` | Learning PDF | 33 | 10 | Integrated |
| `level-3-security-door` | Learning PDF | 20 | 10 | Integrated |
| `level-3-sign` | Learning PDF | 20 | 10 | Integrated |
| `level-3-smart-audio` | Learning PDF | 21 | 10 | Integrated |
| `level-3-smart-door` | Learning PDF | 22 | 10 | Integrated |
| `level-3-smart-trash-bin` | Learning PDF | 31 | 10 | Integrated |
| `level-3-sonometer` | Learning PDF | 23 | 10 | Integrated |
| `level-3-sound-level-meter` | Learning PDF | 34 | 10 | Integrated |
| `level-3-stag-beetle` | Learning PDF | 24 | 10 | Integrated |
| `level-3-sunflower` | Learning PDF | 19 | 10 | Integrated |
| `level-3-super-trajectory-robot-1` | Learning PDF | 19 | 10 | Integrated |
| `level-3-washing-machine` | Learning PDF | 30 | 10 | Integrated |
| `level-3-lifting-maintenance-vehicle` | Building-manual Learning fallback | 22 | 10 | Integrated |
| `level-3-biting-monster` | Building-manual Learning fallback | 24 | 10 | Integrated |
| `level-3-electric-gyro-launcher` | Building-manual Learning fallback | 12 | 10 | Integrated |
| `level-3-responder` | Building-manual Learning fallback | 12 | 10 | Integrated |
| `level-3-lunar-rover` | Building-manual Learning fallback | 24 | 10 | Integrated |

## Validation

- Source maps: `scripts/quiz-learning-source-manifest.json` (46) and `scripts/quiz-level3-building-fallbacks.json` (5).
- Automated test: `tests/level-three-quiz-coverage.test.mjs` now checks 51 project IDs, all 510 question structures, PDF file/page count via PDF.js, slide bounds, ten-item bank schema, five objective pairs, answer distribution, retry variety and route references.
- Static type and application build checks are independent of source/structural checks and should be reported from actual run results. GitHub Actions has experienced runs failing before job steps were exposed.
- PR: https://github.com/Arrjack8847/learn-build-robot/pull/58 (draft until successful validation).
