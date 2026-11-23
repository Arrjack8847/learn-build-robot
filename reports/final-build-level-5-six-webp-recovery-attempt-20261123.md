# Level 5 — final six robot WebP source recovery, Steam Wix Media Manager (2026-11-23)

**Result:** 6/6 exact official Building PDFs re-downloaded and SHA-256 verified, all 82 source pages viewed in page overviews. **3/6 authentic finished-model candidates extracted, validated, committed, and publicly hosted by Wix at READY; 3/6 remain blocked by visibly incomplete construction artwork. Zero new student approvals.**

> This report supersedes its first revision from earlier in the session, when the initial extraction runtime had no network access. The subsequent isolated Vercel sandbox had public source access; no production site was deployed.

## Six-variant decision table

| Robot | PDF page / crop (x0,y0,x1,y1) | WebP created | Wix READY | Student approval |
| --- | --- | --- | --- | --- |
| Remote Control Car | p20 / [0.06, 0.08, 0.56, 0.94] | yes, 550×669 | yes | blocked, 0/5 checklist questions |
| Crack Shot — Optimized | p4 inspected; no approved crop | no | no | blocked |
| Machine Gun | p29 inspected; no approved crop | no | no | blocked |
| Facial Recognition Time Clock | p7 inspected; no approved crop | no | no | blocked |
| Voice Control Snail | p12 / [0.30, 0.18, 0.83, 0.86] | yes, 550×397 | yes | blocked, 0/5 checklist questions |
| Voice Control Vehicle | p10 / [0.64, 0.52, 1.00, 0.94] | yes, 550×361 | yes | blocked, 0/5 checklist questions |

All crop coordinates are normalized top-left/bottom-right fractions of the exact source PDF page, **not** xywh. Each successful WebP was generated only from a raster crop of its own SHA-256 verified official PDF, preserving original assembly geometry and colors.

**Why three remain blocked:** Optimized Crack Shot p4 has a detached wheel and prior pages are earlier construction; Machine Gun p29 still instructs attaching a rubber band/connector with no subsequently assembled depiction; Facial Recognition Clock p7 has a detached camera with assembly alignment arrows and earlier pages omit it. No fictitious composite, retouch, basic/optimized substitution or guessed image was produced.

## Authentic WebPs and Wix upload verification

| File | WebP SHA-256 | Wix media ID | Hosted URL |
| --- | --- | --- | --- |
| `level-5-remote-control-car-basic.webp` | `75a25bad77af8968c6ce83bf9344ccba393b44e6933ea8fb5b11985b8a30ab6d` | `78042f_0c2947266eb7486381448607a8aa7b07~mv2.webp` | https://static.wixstatic.com/media/78042f_0c2947266eb7486381448607a8aa7b07~mv2.webp |
| `level-5-voice-control-snail-basic.webp` | `268a5d6a2fbb244da5871cd080bd7f4109980b731028f6aa87d1fce440fe503d` | `78042f_72ced3ae25a54a45b1815b9590380b6f~mv2.webp` | https://static.wixstatic.com/media/78042f_72ced3ae25a54a45b1815b9590380b6f~mv2.webp |
| `level-5-voice-control-vehicle-basic.webp` | `f627ccbb70fd03647d2135f0719fbea736ad9938b3c4397a1ef472f07a84b138` | `78042f_d36f964af5eb46b39673760192b53422~mv2.webp` | https://static.wixstatic.com/media/78042f_d36f964af5eb46b39673760192b53422~mv2.webp |

Image commit: `611de7f416539827d7eba93c2ac6cfd7bfec9f1b` (worker branch, three new images only). The Wix Media Manager returned `READY` for all three. **Independent re-query** by exact media IDs matched original displayName, original GitHub commit source URL, `private:false`, `state:OK`, dimensions, bytes, and associated Steam site `fe3fa828-9f74-45e8-97f7-8d00cbb7fba0`. **Independent CDN GET** returned HTTP 200, Content-Type `image/webp`, and byte-identical SHA-256 for all three.

## QA actually performed

- All six official Wix PDFs newly downloaded; each SHA-256 and page count matches the pre-existing Level 5 audit. 20+4+29+7+12+10 = **82 pages** assessed visually through contact-sheet overviews, with highest-priority final assembly pages viewed individually at higher size.
- Three WebPs independently decoded after encoding; dimensions matched; mean absolute source-raster pixel differences were **1.077**, **1.322**, and **2.251** respectively after resizing, under the 24-pixel threshold.
- Isolated sparse Git checkout at image commit `611de7f4`: `node --test tests/final-build-level-5.test.mjs` **5 passed, 0 failed**, including the 39 approved image hashes, 45 registered manual variants, 195 questions and fail-closed six.
- Original 39 Wix URL mapping file on integration branch remained at blob SHA `a91003d468226e4bf29f05ebf6342cb0bc9c04f1`; no existing mapped URL, WebP file or release approval modified.
- Separate manifest `src/data/finalBuild/level-5-wix-candidates.json` on integration draft PR #114 contains these **candidate-only** hosted URLs. No new image URL added to `level-5-wix-image-urls.json`.
- All six remain **student-scanner excluded** because none has five independently verified source-based questions; three also have no authentic isolated finished-model image.

Full machine-readable PDF SHA-256, crop points, WebP SHA-256, hosted URLs, Wix IDs, dimensions, QA and blocker details: `reports/final-build-level-5-six-webp-recovery-evidence-20261123.json`.

**No GitHub Actions, no Browser Use, no synthetic robot art, no production deployment, no main merge.** This is content recovery, not a Level 5 student release. Mobile Safari/physical 320–430 px browser functional QA was **not** performed.
