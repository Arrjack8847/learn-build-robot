# BE STEM READY — Level 2 independent PDF QA (incomplete)

**Date:** 2026-11-18  
**Repository:** `Arrjack8847/learn-build-robot`  
**Isolated branch:** `qa/level2-pdf-testing-20261118`  
**Source of scripts:** PR #78 (`a27ff20248744b9b5141ba0402785fe34f0f180b`)  
**PDF delivery:** PR #75 (`239204ff69c017aa6ced8f927e5bc297b4d7cdb4`)  
**Release decision:** **NOT READY — DO NOT MERGE**

## Scope and independent inventory checks

The connected GitHub repository trees for `main` and `fix/level2-pdf-cleanup` were inspected directly, including blob identifiers. They both contain 44 Level 2 Learning PDF files; 43 eligible files have changed blobs in PR #75 and no filenames were added or removed. The single excluded Building document is byte-identical by Git blob SHA:

`public/Level 2/Learning/Mechanisms & Simulators/Double Beam Crane/Double beam crane_Building_Powerpoint.pdf`

The expected **787 pages** among 43 eligible PDFs comes from the PR descriptions; page counts have **not** been independently checked in this QA run. PR #75's claim of 600 visibly changed pages is also historical, not newly confirmed. The complete 44-file blob comparison and sizes are in `reports/level2-local-qa-results.json`.

## Local tests actually performed

The three PR #78 Python scripts and original five-case English-protection regression suite were copied from GitHub into an isolated local test workspace. Python 3.13.5, PyMuPDF 1.26.7, Pillow 12.3.0, and NumPy 2.3.5 were available.

- Original five synthetic regression tests: **5 passed, 0 failed**. They cover standalone headings, exact English fingerprinting, intro preservation, split-font sentences, and visual masking.
- Two new adversarial synthetic tests on the unmodified PR #78 cleaner exposed **2 failures**: Chinese instructions without classification were redacted, and an unrelated 586×178 educational diagram was deleted merely because it matched presumed logo dimensions.
- On the isolated QA branch, changes now require exact reviewer-approved source-page/line entries before removing Chinese text, and reviewer-approved image SHA-256 values before deleting a purported logo. Unknown content triggers a hard stop, not a deletion.
- Retesting the guarded implementation: **7 passed, 0 failed**, with Python compilation successful. The new two tests explicitly assert fail-closed behavior.
- The QA validator was changed to render at 2× PDF page resolution, save before/after PNGs for every modified page in full mode, enforce the 787-page full-run expectation, and avoid unconditional success flags. **These full-mode changes have not been exercised against the real corpus.**

**These results only demonstrate behavior on synthetic samples; they are not independent validation of the delivered PDFs.**

## Five historical regression targets

| Target | Exact Level 2 Learning path / disposition | Actual before/after PDF comparison |
|---|---|---|
| Tower Crane | `public/Level 2/Learning/Characters & Structures/Tower crane/Tower crane_Powerpoint.pdf` | NOT RUN |
| Rotating Flying Chair | `public/Level 2/Learning/Action-Oriented/Rotating flying chair/Rotating flying chair_Powerpoint.pdf` | NOT RUN |
| Jumping Machine | `public/Level 2/Learning/Interactive Mechanisms/Jumping machine/Jumping machine_Powerpoint.pdf` | NOT RUN |
| Acceleration Car | Not present in the current 44-PDF Level 2 Learning inventory | OUT OF SCOPE; DO NOT ALTER ANOTHER LEVEL |
| Gyro Transmitter | Not present in the current 44-PDF Level 2 Learning inventory | OUT OF SCOPE; DO NOT ALTER ANOTHER LEVEL |

The code's text-fingerprint regression tests reject paraphrased synthetic examples, but none of the three present real introductory pages has been compared directly with its cleaned counterpart.

## Eight Chinese-text exceptions — direct review pending

All decisions below are **UNDETERMINED**. An exception cannot be marked removable without seeing the original page at full resolution, understanding its instructional/legal purpose, and recording explicit approval.

| PDF (path relative to `public/Level 2/Learning/`) | Page (1-based) | Decision |
|---|---:|---|
| `Biomimicry/Chimpanzees.pdf` | 13 | UNDETERMINED |
| `Foundational Robots/Hammer robot.pdf` | 21 | UNDETERMINED |
| `Foundational Robots/The treadmill.pdf` | 17 | UNDETERMINED |
| `Manipulators/Cliff walk.pdf` | 11 | UNDETERMINED |
| `Manipulators/Ferris wheel.pdf` | 20 | UNDETERMINED |
| `Manipulators/Round-trip transportation.pdf` | 14 | UNDETERMINED |
| `Mechanisms and Concepts/Animal trap.pdf` | 16 | UNDETERMINED |
| `Mechanisms and Concepts/Headlights.pdf` | 13 | UNDETERMINED |

## Real-PDF verification status

| Check | Result |
|---|---|
| Repo Level 2 Learning inventory and Building exclusion | **PASS** — GitHub blob metadata |
| Original five English-preservation synthetic tests | **PASS** — 5/5 |
| New fail-closed synthetic tests after isolated patch | **PASS** — 2/2 |
| PDFs locally processed and compared | **0 / 43 — NOT RUN** |
| Real PDF pages independently validated | **0 / 787 — NOT RUN** |
| Real edited page count | **UNKNOWN** (prior PR reports 600; not reverified) |
| Real instructional English verbatim preserved | **NOT VERIFIED** |
| Real manufacturer and legal attribution preserved | **NOT VERIFIED** |
| Real artwork, geometry, cropping, and image integrity | **NOT VERIFIED** |
| Real pages opened/rendered successfully | **NOT VERIFIED** |
| Full-resolution before/after pairs for real modified pages | **NOT GENERATED** |
| Eight Chinese-text exception determinations | **0 / 8 — PENDING** |

## Blocker and release gate

Although the private GitHub connector could read repository metadata and text scripts, the original and cleaned **binary PDF corpus was not available in the local execution workspace**; a direct `git ls-remote` attempt failed because the container could not resolve `github.com`. Therefore the 43-PDF cleanup, page-by-page rendering, text comparisons, Chinese exception classifications, and 787-page full verification were not possible in this run. Do not reinterpret a previous GitHub Actions success as new independent QA. GitHub Actions was not used.

The guarded cleaner intentionally stops on any CJK line or logo-sized image lacking exact approval. Before proceeding, obtain isolated local access to the PDF corpus; inspect source-page text and logo identities; record exact approvals; regenerate cleaned PDFs; run strict full-corpus validation; inspect full-resolution comparisons; then obtain human visual sign-off.

**Main, PR #75, PR #78, Building PDFs, all other levels, production website, quizzes, and Vercel deployments remain untouched.** This branch is testing-only and must remain unmerged until independent verification is complete.

**Ready for final review: NO.**
