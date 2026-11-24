# Level 4 Final Build — Independent Delivery QA

Date: 2026-11-23
Scope: Level 4 worker branch, draft PR #111; handoff to draft integration PR #114.

## Verified content

| Gate | Verified result |
|---|---:|
| Registered official Building variants reconciled | 50 |
| Independently downloaded official source PDF SHA-256/page agreements | 50/50 |
| Total authenticated source PDF pages | 1,029 |
| Source PDFs downloaded and checked | 477,428,407 bytes |
| Candidate WebPs visually inspected against their PDF final/penultimate assembly views | 50/50 |
| Source-only image crops repaired across the worker audit passes | 9 |
| Approved complete-model artwork | 48/50 |
| Five-question sets reviewed | 50/50 |
| Static mechanical questions reviewed | 250/250 |
| Static PDF-visible assembly questions approved | 240/250 |
| Wix Media Manager READY public WebPs, unique original filenames | 48/48 |
| Independently fetched Wix public image MIME, SHA-256, pixel dimensions, byte lengths | 48/48 |
| Isolated Level 4 Node regression (clean branch checkout) | 11 passed, 0 failed |
| Built/bundled Level 4 approved-content adapter and executed gate assertions | PASS: 48 entries, 240 questions, 2 exclusions |

## Source-limited exclusions (fail closed)

- level-4-horizontal-bar — the official final model illustration cuts off the lower support feet; the preceding view is not the completed rod-installed configuration.
- level-4-dangerous-assassin (Basic) — official last page depicts a detached long angular side assembly rather than one unambiguously attached finished robot. The Optimized variant is distinct and approved.
- Eight syllabus activities without separately registered Building PDF manuals remain outside the Final Build candidate pool.

## Software / release verification

- All artwork and checklists are Level 4-owned. The shared Level 1 scanner identity, transitions, animation timing, 15-minute deadline, scoring threshold, assessment navigation and retry rules were unchanged.
- The new src/data/finalBuild/level-4-approved-content.ts safely returns the 48 eligible entries only when artwork, five questions and Wix READY/identity/hash/dimension/filename checks all match. An isolated esbuild bundle ran successfully and returned 48 entries with 240 question records. Basic Dangerous Assassin and Horizontal Bar were excluded; Optimized Dangerous Assassin was included.
- npx tsc --noEmit was attempted in an isolated environment after installing 466 project dependencies. It found 11 existing shared-code errors (in FinalBuildExam.tsx, finalBuildRegistry.ts and the Level 1–6 route files); none were in the new Level 4 adapter. Full shared-engine release typechecking is therefore NOT PASSING.
- Interactive mobile browser layout verification at 320, 375, 390 and 430 CSS px was not performed, because Browser Use was explicitly prohibited. Static source/regression checks are not represented as an actual mobile browser pass.
- No GitHub Actions, production deployment, merge or edits to the shared scanner/other levels. PR #114 is a coordination handoff only, not a code merge.

## Approval limitations

Approval is limited to independent AI-assisted visual comparison of genuine finished-model source illustrations and five static, observable mechanical geometry questions per eligible variant. It does not establish that a real robot was physically built or that sensor inputs, power, motion or stability were empirically tested. No external human signoff is claimed.

Files: src/data/finalBuild/level-4-references.json, src/data/finalBuild/level-4-checklists.json, src/data/finalBuild/level-4-wix-image-urls.json, reports/final-build-level-4-completion-signoff-20261123.json, reports/final-build-level-4-source-repairs-20261123.json.

## Integration-owned remaining actions

Use only the verified manifest from Level 4 approved-content adapter in PR #114; ensure generic pool discovery does not reintroduce either blocked variant. Integrate five evidence-backed static questions into the existing Level 1 scanner without changing UX/clock/grading/retry behavior. Resolve the shared TypeScript errors and execute interactive responsive QA before any production release.