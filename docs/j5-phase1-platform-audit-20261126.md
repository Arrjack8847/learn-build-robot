# J5 Phase 1 — Existing platform source audit
Date: 2026-11-26. Scope: J5.1 only, on isolated branch. Read-only review of the Wix backend; no J1–J4 changes or integration, no deployment, no artwork/content edits.

## Evidence and completion boundary
Frontend snapshot: `a53a630285ad704fa8ae09f36295e4bab1d179ca` (tree `59c71d45005f2dfa52854fb9f107e085c3fed5b2`, non-truncated recursive listing). Backend snapshot: `6783c1e8a57df0e4f033885e6f9c59a05ca9eb82` on feat/lms-backend-foundation. The companion j5-phase1-source-inventory-20261126.json records every tracked public PDF path, blob SHA and size, all route files and generated-tree presence, the four URL-registry SHAs and exact artwork source SHAs. This is a completed repository-source inventory and risk assessment, not a full runtime audit or a claim that J5.1 has passed live acceptance. Source inspection, exact path comparison and URL syntax checks were executed; no build, HTTP download, browser, real DB or penetration test was run here.

## Platform and curriculum inventory
| Level | Categories | Catalog entries |
|---|---:|---:|
| 1 | 14 | 59 |
| 2 | 18 | 59 |
| 3 | 20 | 48 |
| 4 | 20 | 56 |
| 5 | 16 | 51 |
| 6 | 15 | 43 |
| Total | 103 | 316 |

Counts are derived directly from levelOneProjects.ts and advancedSyllabus.ts, not inferred from PDF counts. Each catalog entry is not necessarily one PDF, one distinct robot or one published quiz. All six level routes and all six Final Build route files exist. The catalog and materials should be reused, not rebuilt.

### Original J5.1 checklist
| Area | Source result | Remaining runtime evidence |
|---|---|---|
| Level selection, levels 1–6 | Six level cards, counts above, catalog/category/detail routes; private mode adds projected availability | Six-card rendering, all category/project navigation and genuine availability |
| Learning / Building PDFs | 590 tracked public PDFs, 590 unique Wix mappings; exact set equality, no invalid format, no orphan or unmapped path | HTTP status, PDF MIME/magic, correct file identity, contents and actual authorization for all links |
| Quiz | Client registry and banks exist; 319 tracked TypeScript bank files, not a published-quiz count | Approved question coverage, server-only answers, backend grading and saved attempts |
| Final Build | Six route files, existing candidate registry, Level 1 component and Level 2–6 shared exam; existing verified/fallback registries should be preserved | Candidate approval, exam behavior, server persistence, accepted grading rules |
| Level progression | Backend lmsLevelReadiness reports unlockEnabled:false; J5 overview projects authority flags without calculating invented thresholds | Approved progression and live locked/unlocked enforcement |
| Learning routes | 18 course route files inspected; 32 total route files inventoried; 12 omitted by checked-in generated route tree | Regenerate via authorized build, exercise every route and dynamic parameter |
| Mobile/desktop | 2×3 portrait, 3×2 landscape CSS, centered width, fixed viewport; profile scroll fix | Actual touch/keyboard/viewport tests; overflow with new status row |
| Artwork | All 8 source assets found, exact conversion pairs and SHAs recorded; generated WebPs not tracked, prebuild generation exists | Actual WebP build, dimensions, screenshot comparison |
| Wix links / routing | Four registries match all public PDFs exactly; valid expected host/path syntax | Live links and download availability; separate origin permissions |
| Progress tracking | Legacy demo state, Wix member-scoped APIs, J5 server projection exist | Student-scoped durable records, account switching, reload/resume |
| Authentication | Legacy Wix OAuth + sessionStorage; J5 preview HTTP gate and injected identity contract | J2 student session adapter, real isolation, expiry/logout |
| Local storage | Global progress key, project quiz drafts, per-level challenge state; browser-editable | Remove/segregate from authoritative records; same-device sibling tests |
| Database | Backend uses Wix Data, member IDs and suppressAuth in scoped handlers; prior release report records admin-only collections | Current dev collection configuration, child/profile mapping and actual read/write concurrency/security |
| Automated tests | 78 tracked .test.mjs files, 5 J5 files; prior report 76 direct fixture checks, not rerun in this audit; ordinary prebuild does not include J5 suite | Isolated suite, TypeScript build, browser, security and database acceptance |

## Verified source defects and risks (not claims of live exploitation)
| ID | Priority | Finding and evidence | Remediation phase |
|---|---|---|---|
| A01 | Release blocker | src/routeTree.gen.ts imports 20 route files, omits 12 tracked files (including both student pages and both auth pages); not evidence of deployed 404s because generator may run on build. Exact names in inventory. | 9: regenerate and verify |
| A02 | Release blocker | src/server.ts dispatches J5 APIs but not course authorization. All 18 course route sources reviewed; only practical/index.tsx has beforeLoad (legacy redirect), level selection only UI gating. Direct project, quiz, category and Final Build navigation is not server restricted by J5. | 6 |
| A03 | Release blocker | src/data/requireWixPdfUrl.ts and the four registries return direct external URL strings. PdfActivityViewer.tsx passes manual.url to PDF.js and has an external fallback link; AccelerationCarPdfViewer.tsx directly fetches its source. Page authorization cannot secure an independently accessible origin. Actual remote permissions unverified. | 7 |
| A04 | Release blocker | 590 PDFs under public/ remain tracked; .gitignore does not remove them. Standard postbuild cleanup exists but dev serving and alternative build paths need review. 10 public SB2 program files and 13 STL models also require access classification; not automatically designated protected. Audit script only diagnostic, not invoked by normal build. | 6–7,9 |
| A05 | Release blocker | scripts/j5/http.mjs default getServices returns null; private UI/API flag defaults off, so no real student overview/check-in is available yet. Pure fixture modules not provider-connected. | 2–5 |
| A06 | High | src/lib/wix-auth.ts stores browser-readable tab tokens and auth routes call Wix member auth. No J2 individual student session mounted in J5; member ID is not proof of child identity. | 2–3 |
| A07 | High | ProgressContext.tsx uses shared robolearn.progress.v1; quizStudio and Final Build components use browser-editable local state; activity sync defaults off and returns true without persistence. No shared-browser student isolation guarantee. | 2–4; later J5 progress work |
| A08 | High | quizStudio.ts imports local banks containing correctIndex; quiz route imports local bank and client scoring even alongside optional server mode. Bundled answer exposure must be removed for protected assessments, verify actual output. | 6 and later quiz work |
| A09 | High | Existing backend challenge-rules.js uses 4/5 checks and time condition, while approved Level 1 contract is 3/4, overtime recorded, not automatic failure. Isolated Level 1 evaluator exists but is not wired; do not change other level policy without approval. | Later challenge work |
| A10 | Release blocker | Reviewed Nov 24 code/pass design and shared N3 booking authority unavailable in earlier searches; no durable limiter, atomic attendance, revocation or authorized PDF origin confirmed. No guessed grace period. | 5–7 |
| A11 | High | Existing backend read-only unlock, old LMS member identity, partial imports per release gate; do not represent readiness as persisted unlock. J5 level cards rely on validated projection only. | 2,8 and later progression |
| A12 | Medium | Generated WebP artifacts not tracked; source mapping complete, but no rendered assets/viewport evidence. New membership status labels may affect small-height layout. | 8–9 |
| A13 | High | Existing source-pattern UI tests and 78 test files present but no J5 test script in package.json, and no browser test dependency listed in package.json. Standard prebuild includes other journeys' tests; independent validation must be explicit. | 9 |
| A14 | High | PdfManualPage.tsx caches rendered pages in memory per document. Revocation/expiry must close viewers, abort outstanding requests and remove cache; previously downloaded content cannot be clawed back. | 6–7 |

### Broken links and route checks
Exact comparison of all 590 keys with all 590 tracked public PDF paths: 0 missing mappings, 0 orphan mappings, 0 duplicate paths, 0 duplicate URLs, 0 invalid URL patterns. This verifies mapping integrity only: no live link has been declared working or broken. Checked-in route tree omissions are confirmed source drift, not a live routing verdict. All generated imports reference existing files; no unexpected import paths in generated tree.

### Preserve vs change
Preserve existing six-level catalog, existing project/category routes and educational assets, all eight artwork source blobs, existing reviewed manual and quiz content. Do not regenerate artwork, delete source PDFs, change membership/payment policy, change progression weights, or touch other journeys in Phase 1. Fix findings in subsequent phases with isolated fixtures and real acceptance evidence; do not treat fixture success as production readiness.

## Acceptance gates not executed
- Authorized build and generated route tree; all student navigation and invalid parameters.
- 590 live PDF origin checks with correct content and authorized/unauthorized delivery; actual public artifact scan.
- Browser matrices at mobile portrait/landscape and desktop, keyboard and account switching.
- Real development Wix membership, identity, booking and progress persistence/permissions; concurrency and revocation.
- Confirm reviewed booking design, allowed public demos and secure private document storage before release.

Phase 1 repository-source audit deliverables complete. J5.1 full runtime acceptance remains open; no other workstream declared 100%.