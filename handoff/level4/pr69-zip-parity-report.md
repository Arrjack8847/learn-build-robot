# Level 4 PR #69 — Local ZIP parity audit

**GitHub source commit:** `99a5cc0ec5346a6fc4ea7f1c361fb46f93c37ea3`

This report compares both previously generated local PDF ZIPs with the **exact PDF Git blobs** listed in [the PR #69 source manifest](handoff/level4/pr69-git-blob-manifest.tsv). It does **not** assert that the PDF pages render differently.

| Previously generated ZIP | PDFs present | Exact Git blob ID matches | Total extracted PDF bytes |
| --- | ---: | ---: | ---: |
| `BE_STEM_READY_Level4_Cleaned_Learning_PDFs.zip` | 56 | **0** | 71,894,322 |
| `BE_STEM_READY_Level4_Cleaned_Learning_PDFs_v2.zip` | 56 | **0** | 71,893,428 |
| **GitHub PR #69 PDF source** | **56** | **56 (self)** | **71,894,435** |

The two previous ZIPs differ from each other on **14 cover PDFs**. The comparison computed Git blob IDs from the uncompressed ZIP data as `SHA1("blob " + byte_count + NUL + pdf_bytes)` and compared each value against the 56 GitHub tree blob IDs. This is a complete byte-parity audit, not a 5-file spot check. No exact binary matches were found in either local ZIP.

**Release disposition:** The earlier ZIPs are QA/reference artifacts only. GitHub PR #69 remains the authoritative source. The export workflow at [Actions run #41789744248](https://github.com/Arrjack8847/learn-build-robot/actions/runs/41789744248) is intended to create an exact-byte ZIP and SHA-256 manifest from the pinned commit; it must report success before the archive can be called verified.

**No release authorized:** PR #69 needs editorial and copyright/licensing approval; the independent routing PR #73 must not merge until #69 has merged. The successful 9/9 combined integration rehearsal is [run #41788586830](https://github.com/Arrjack8847/learn-build-robot/actions/runs/41788586830). This audit does not change PDFs, main, or the deployed site.
