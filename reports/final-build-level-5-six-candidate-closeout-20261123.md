# Level 5 — six official-robot image recovery, Wix media, and checklist preparation

**Report date:** 2026-11-23 (Malaysia). **Status:** partial source-constrained recovery, not production-ready. This report supersedes the earlier source-access failure notes for the current state.

## Verified outcome

| Variant | Authentic finished-model WebP | Steam Wix status | Questions | Student scanner |
|---|---|---|---|---|
| Remote Control Car | Recovered from official PDF page 20 | READY, public, HTTP 200 | 5 source-anchored drafts | Excluded |
| Crack Shot — Optimized | **Blocked:** final page shows separated/uninstalled wheel and construction steps | NOT_UPLOADED | 5 instruction-stage drafts; final model not verified | Excluded |
| Machine Gun | **Blocked:** page 29 shows rubber band and connector still to be attached | NOT_UPLOADED | 5 instruction-stage drafts; final model not verified | Excluded |
| Facial Recognition Time Clock | **Blocked:** page 7 shows separate camera with attachment arrows | NOT_UPLOADED | 5 instruction-stage drafts; final model not verified | Excluded |
| Voice Control Snail | Recovered from official PDF page 12 | READY, public, HTTP 200 | 5 source-anchored drafts | Excluded |
| Voice Control Vehicle | Recovered from official PDF page 10, step 23 | READY, public, HTTP 200 | 5 source-anchored drafts | Excluded |

The six original official Wix Building PDFs were downloaded in an isolated network-enabled QA environment, each checked against its registered SHA-256 and page count. All 82 pages were rendered for page-overview inspection in the artwork-recovery pass. Full manual content certification was **not** claimed.

The three missing completed-model views cannot be invented, cropped from unrelated manual steps, or substituted with the already-approved basic Crack Shot. An official finished-assembly image or corrected exact-variant Building PDF is required before those three image cases can be cleared.

## Source-backed WebPs and hosted CDN records

| Variant | Source PDF page | Normalized crop [left, top, right, bottom] | WebP dimensions | WebP SHA-256 |
|---|---:|---|---|---|
| Remote Control Car | 20 | `[0.06, 0.08, 0.56, 0.94]` | 550×669 | `75a25bad77af8968c6ce83bf9344ccba393b44e6933ea8fb5b11985b8a30ab6d` |
| Voice Control Snail | 12 | `[0.30, 0.18, 0.83, 0.86]` | 550×397 | `268a5d6a2fbb244da5871cd080bd7f4109980b731028f6aa87d1fce440fe503d` |
| Voice Control Vehicle | 10 | `[0.64, 0.52, 1.00, 0.94]` | 550×361 | `f627ccbb70fd03647d2135f0719fbea736ad9938b3c4397a1ef472f07a84b138` |

- Remote Control Car: [Wix-hosted WebP](https://static.wixstatic.com/media/78042f_0c2947266eb7486381448607a8aa7b07~mv2.webp), media ID `78042f_0c2947266eb7486381448607a8aa7b07~mv2.webp`.
- Voice Control Snail: [Wix-hosted WebP](https://static.wixstatic.com/media/78042f_72ced3ae25a54a45b1815b9590380b6f~mv2.webp), media ID `78042f_72ced3ae25a54a45b1815b9590380b6f~mv2.webp`.
- Voice Control Vehicle: [Wix-hosted WebP](https://static.wixstatic.com/media/78042f_d36f964af5eb46b39673760192b53422~mv2.webp), media ID `78042f_d36f964af5eb46b39673760192b53422~mv2.webp`.

All three were uploaded only once during the recovery. They were re-queried using Wix Media Manager Get File Descriptors, confirming `operationStatus=READY`, `state=OK`, `private=false`, exact filenames and source URLs, and recorded image dimensions. Separate public CDN HTTP requests returned `200`, `image/webp`, and byte-for-byte SHA-256 equality with the original WebPs.

**Crop clarification:** The final stored and hosted Voice Control Vehicle is the 550×361 source crop ending at normalized page Y=0.94. A previously tested 550×327 experimental crop cut off part of the model and was **rejected**; it was never committed or uploaded. The hosted version was visually rechecked to retain the complete visible assembly and exclude the printed page number.

## 30 source-anchored preliminary questions

Source: `src/data/finalBuild/level-5-six-question-candidates.json` on worker PR #113.

- Exactly five unique question candidates per each of the six variants, all with exact official PDF SHA-256, source URL, source page and evidence kind.
- 15 prompts refer to the three independently extractable completed-model views.
- 15 prompts refer only to instructional pages for the three image-blocked variants. Those are **not** certification of a completed model.
- Every prompt is **DRAFT_REQUIRES_INDEPENDENT_VISUAL_CONFIRMATION**. The zero-question-approval count is intentional until a separate, accountable second visual review is complete.
- No 30 draft questions were inserted into `level-5-checklists.json`, and none can make a variant selectable.

## Regression tests actually executed locally (not GitHub Actions)

| Command | Executed results |
|---|---|
| `node --test tests/final-build-level-5-wix-candidates.test.mjs` | **3 passed / 0 failed** |
| `node --test tests/final-build-level-5-six-question-candidates.test.mjs` | **4 passed / 0 failed** |
| `node --test tests/final-build-exams.test.mjs` | **8 passed / 0 failed** |
| **Total** | **15 passed / 0 failed** |

The tests were executed using Node.js in an isolated Vercel sandbox against exact GitHub commit snapshots, fetching only the files required by the suites. These are structural, data-provenance, scanner-invariant and deadline-code checks. **No complete TypeScript build, end-to-end interactive browser test, or real mobile device test was performed**, so production readiness and full UI functionality are not claimed.

## Isolation and future gate

- Existing **39 approved** Level 5 robot WebPs and `src/data/finalBuild/level-5-wix-image-urls.json` remain untouched. Approved mapping Git blob SHA: `a91003d468226e4bf29f05ebf6342cb0bc9c04f1`.
- Candidate status and actual hosted media are recorded only in integration PR #114 at `src/data/finalBuild/level-5-wix-candidates.json`.
- Three source-authentic candidates were committed to worker PR #113 at image commit `611de7f416539827d7eba93c2ac6cfd7bfec9f1b`.
- All six remain excluded by the approved-only student scanner; no scanner, timer, animation, route, production or main changes were made in this recovery.
- **No** GitHub Actions, Browser Use, PR merge or production deployment.

**Release gate:** To make any of these six student-selectable, require both an unambiguous completed-model source image and five independently confirmed exact-variant assessment questions, followed by full scanner/integration and device QA. For the three image-blocked projects, the current approved official PDF sources do not contain a verified stand-alone completed-model illustration. Obtain corrected official source material rather than inventing robot parts.

## Links

- [Worker PR #113](https://github.com/Arrjack8847/learn-build-robot/pull/113)
- [Integration PR #114](https://github.com/Arrjack8847/learn-build-robot/pull/114)
- [Detailed original six-image provenance](../reports/final-build-level-5-six-webp-recovery-evidence-20261123.json)
