# BE STEM READY — Level 6 Final Build Challenge QA

**Audit:** 2026-11-23 · **Repository:** `Arrjack8847/learn-build-robot`  
**Draft PR:** [#112](https://github.com/Arrjack8847/learn-build-robot/pull/112) · **Branch:** `feat/final-build-level-6`  
**Shared base PR #108:** `1fe5c5336d45295e6e3252d0450b662337a1db50`  
**Release:** NOT YET. Level 6-specific approvals require final integration worker to wire global approvals and verified-only discovery.

## Verified inventory
| Item | Result |
|---|---:|
| Official syllabus activities | 43 |
| Projects with Building manuals | 39 |
| Separate registered Building variants | 41 |
| Syllabus activities without Building PDFs | 4 |
| Current Wix Building PDF files downloaded | 41/41 |
| Total PDF pages parsed | 1,007 |
| Hosted PDF bytes retrieved | 507,053,975 |
| Current Wix PDF SHA-256 values | 41/41 |
| Genuine source-extracted WebP candidates committed | 41/41 |
| Individually passed Level 6 verification | **39** |
| Correctly blocked from student pool | **2** |
| Project/variant-specific questions authored | 205 |
| Source-page-backed verified questions | **195** |
| Global student approvals modified | **0** |

## Source version fidelity
Original 2026-11-19 audit records 41 Git blob SHA-1 values, 1,007 original pages, and 507,066,535 original bytes. This worker freshly downloaded all **41 current Wix-hosted Building manuals**, computed SHA-256, and compared Git blob identities. **37 PDFs are byte-identical to the original Git sources; four are the intentionally repaired Wix replacements:** Red Light Warning Device, Pay by card, Product Search, and Rock-paper-scissors Robot.
The independent 2026-11-20 record of Red Light Warning Device includes an incomplete historical replacement blob prefix. The fresh current Wix byte hash and complete Git blob SHA-1 are authoritative; the defective historical prefix was not treated as a full SHA-1.
The Wix source URLs were preserved unchanged. Current URL, SHA-256, complete Git blob SHA-1, current byte count, page count, and replacement evidence are recorded for each variant in `src/data/finalBuild/level-6-audit.json`.
**Limitation:** These checks do not constitute a human page-by-page English-only certification of every image-only PDF page. The original note remains recorded.

## Full 41-variant review
Full WebP SHA-256, normalized crop, current PDF SHA-256, page count, source-page identity, independent source-vs-WebP pixel correlation, per-variant checklist, approval/block state and evidence notes are in the three Level 6 manifests.

| # | Project | Variant | Source page | WebP size | Approval |
|---:|---|---|---:|---|---|
| 1 | Gorilla | basic | 24/24 | 413 × 470 | Approved |
| 2 | Picture Projector | basic | 11/11 | 532 × 560 | Approved |
| 3 | The Flapping Pterosaur | basic | 70/70 | 472 × 560 | Approved |
| 4 | Code-scanning Gate | basic | 27/27 | 464 × 500 | Approved |
| 5 | Intelligent Passing Light | basic | 18/18 | 650 × 517 | Approved |
| 6 | Gesture-commanding Car | basic | 18/18 | 470 × 446 | Approved |
| 7 | Regional Weather Station | basic | 51/51 | 361 × 470 | Approved |
| 8 | Super Scorpion | basic | 42/42 | 470 × 414 | Approved |
| 9 | Super Scorpion | optimized | 1/3 | 530 × 414 | **Blocked** |
| 10 | Clown | basic | 20/20 | 650 × 644 | Approved |
| 11 | Accurate Shooting | basic | 30/30 | 500 × 487 | Approved |
| 12 | Digital Countdown | basic | 21/21 | 590 × 496 | Approved |
| 13 | Red Light Warning Device | basic | 12/12 | 560 × 465 | Approved |
| 14 | Smart Flashlight | basic | 15/15 | 500 × 451 | Approved |
| 15 | Traffic Lights Display | basic | 18/18 | 650 × 558 | Approved |
| 16 | Pinball Machine | basic | 24/24 | 500 × 416 | Approved |
| 17 | Smart Fan | basic | 37/37 | 470 × 385 | Approved |
| 18 | The Interesting Rotor | basic | 48/48 | 470 × 437 | Approved |
| 19 | Combination Lock | basic | 26/26 | 500 × 409 | Approved |
| 20 | Gibbon | basic | 16/16 | 421 × 450 | Approved |
| 21 | Gibbon | optimized | 10/10 | 449 × 450 | Approved |
| 22 | Pay by card | basic | 17/17 | 530 × 397 | Approved |
| 23 | Product Search | basic | 24/24 | 446 × 530 | Approved |
| 24 | Punch Hard | basic | 16/16 | 461 × 500 | Approved |
| 25 | RC Airplane | basic | 26/26 | 500 × 481 | Approved |
| 26 | Ring Toss Game | basic | 32/32 | 392 × 650 | Approved |
| 27 | Robotic Arm | basic | 37/37 | 540 × 378 | Approved |
| 28 | Vending Machine | basic | 23/23 | 349 × 500 | Approved |
| 29 | Autonomous Driving | basic | 17/17 | 470 × 461 | Approved |
| 30 | Minesweeper Robot | basic | 28/28 | 560 × 320 | Approved |
| 31 | Remote Control Lift | basic | 33/33 | 365 × 470 | Approved |
| 32 | Saluting Robot | basic | 20/20 | 345 × 500 | Approved |
| 33 | Smart Electric Drill | basic | 19/19 | 378 × 530 | Approved |
| 34 | Altimeter | basic | 13/13 | 438 × 450 | Approved |
| 35 | High Temperature Alarm | basic | 23/23 | 391 × 500 | Approved |
| 36 | Intelligent Sorting Machine | basic | 33/33 | 620 × 297 | Approved |
| 37 | Parcel Sorting Machine | basic | 39/39 | 530 × 310 | Approved |
| 38 | Colorblind Assistant Robot | basic | 14/14 | 530 × 296 | Approved |
| 39 | Rock-paper-scissors Robot | basic | 14/14 | 500 × 349 | **Blocked** |
| 40 | Smart Camera | basic | 14/14 | 399 × 500 | Approved |
| 41 | Tricycle | basic | 24/24 | 560 × 373 | Approved |

### Two correctly blocked records

**Super Scorpion — Optimized:** The three-page Optimized manual does not offer a reliable complete optimized-model image: the full-model illustration is a pre-optimization stage and subsequent pages show cropped detail. No stage mixing, invented parts, or fabricated final image is permitted. This variant remains blocked.

**Rock-paper-scissors Robot:** The full finished-model illustration has explanatory arrow/label artifacts intersecting the candidate crop. The file is preserved as a non-student candidate; it cannot be promoted without a clean, independently inspected crop. The revised Wix source itself is retained.

### Four syllabus projects excluded due to absent Building manuals
- **Matador** (`level-6-matador`): Learning slides not substituted for a separately verified Building manual.
- **Dancing Robot** (`level-6-dancing-robot`): Learning slides not substituted for a separately verified Building manual.
- **Finger-guessing Robot** (`level-6-finger-guessing-robot`): Learning slides not substituted for a separately verified Building manual.
- **Ball Tracking** (`level-6-ball-tracking`): Learning slides not substituted for a separately verified Building manual.

## WebP and assessment evidence
- Each WebP comes from the current Wix Building PDF rendered page. No synthetic robot geometry was generated.
- The secondary image pass re-rendered the source page, recomputed WebP SHA-256, validated RIFF/VP8 dimensions, crop geometry, visual composition, edge clipping, and pixel correlation. Lowest source-vs-image correlation: **0.95384**; the two identity/instruction issues above remain blocked.
- The Robotic Arm initially clipped part of the model; it was re-rendered from its actual source page and the stand-alone step number was removed outside the model. The corrected file was committed and rechecked.
- Forty-one sets of exactly five project-specific structural/observable questions were authored with page citations. Thirty-nine sets (195 items) passed the Level 6 evidence gate. The two blocked sets are not student-approved.
- Student release is controlled by the shared global approvals and engine, which this worker did not modify.

## Tests actually executed (isolated cloud Linux; no GitHub Actions)
| Check | Actual result |
|---|---|
| Dedicated `node --test tests/final-build-level-6.test.mjs` | **10 passed, 0 failed** |
| `npm run test:level56` | **21 passed, 0 failed** |
| `npm run test:final-build` (after restoring original sparse fixtures) | **38 passed, 0 failed** |
| WebP source/render, 41 SHA-256s, page count and post-conversion checks | **41 processed, 39 approval-gate pass, 2 held blocked** |
| Production-equivalent build | Follow-up build verification required; sparse checkout first lacked unrelated 3D Marksman assets |
| Browser visual QA at 320, 375, 390, 430 px | Not yet executed in this run |

The initial sparse-checkout regression/build attempts failed due to absent Level 2/4 PDF test fixtures and unrelated root `3D for marksman` binaries; these are **environment fixture gaps**, not Level 6 code failures. The original fixtures were restored locally without committing their files. Level Selection WebPs were regenerated locally from the repository's pre-existing artwork originals; those generation outputs were not committed.

## Shared Level 1 behavior / final integration gate
- Inspected shared engine retains 4.2-second scanner, unbiased cryptographic index selection, repeated draws, 15-minute timer, strict expiry failure, page reload persistence, 4-of-5 on-time self-reported pass, and retry choices.
- **Outstanding integration issue:** shared `getFinalBuildPool` currently checks registered Building sources, not Level 6's approved-only records. A final integration worker must filter discovery to globally approved variants; otherwise unapproved projects can appear even though the exam start button is guarded.
- **Outstanding integration issue:** shared checklist text is presently generic title-based. Final integration worker must wire the approved Level 6 variant-specific questions into the shared engine; do not create a separate Level 6 engine.
- **Global student approvals are unchanged.** The 39 Level 6 manifest approvals are *not* activated in the student experience until final integration QA passes.
- Mobile widths 320, 375, 390, 430 must be visually tested with a runnable authorized environment before production promotion.

## Scope isolation
The PR contains only Level 6 reference WebPs and Level 6 data, test, and QA-report files. **No merge to main, no production deployment, no GitHub Actions, no Browser Use, no cleaned PDF edits, no global approval changes, no shared engine edits, no other-level changes.**
