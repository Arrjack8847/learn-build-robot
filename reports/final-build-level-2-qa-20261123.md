# BE STEM READY — Level 2 Final Build QA — 2026-11-23

## Executive status
**Level 2 content package verified and delivered for integration. Not released to production.** This worker reconciled all **59 official syllabus projects** and **60 registered Building-source variants** against the current coordinated PR #108 registries. Each registered PDF was actually downloaded from its Wix URL, parsed and SHA-256 hashed.

- Reference coordinated PR [#108](https://github.com/Arrjack8847/learn-build-robot/pull/108), original inspected base SHA `1fe5c5336d45295e6e3252d0450b662337a1db50`.
- Isolated worker branch `feat/final-build-level-2`, [draft PR #109](https://github.com/Arrjack8847/learn-build-robot/pull/109) targeting `feat/final-build-exams-levels-1-6`, **not main**.
- **Approved: 30 variants / Blocked: 30 variants / Unresolved registration identity: 0**.
- **30 authentic source-cropped WebPs** committed at `public/final-build/level-2/` (644,268 total bytes), **150 model-specific source-page-cited questions**.
- **60/60 Wix PDF byte downloads** (415,126,706 bytes, **1,056 pages**), 60 real document SHA-256 values, 36/36 historical Wix remediated Git-blob SHA-1 cross-checks.
- No PDF binaries added to Git. No GitHub Actions or Browser Use. No shared scanner/timer/CSS/global approvals/other levels changed.

## Baseline discrepancy resolution
The syllabus registers 59 distinct projects but 60 variant-specific Building-source URLs because **See Saw** has `Balance.pdf` (V1) and `Balance_v2.pdf` (V2), separately reviewed. The two Crane IDs belong to different syllabus categories, not duplicate variants.

## Exact current PDF source inventory
This table lists the **SHA-256 of bytes fetched from the actual Wix URL**, not Git-object SHA-1. `Registered` means URL resolved; `Approved` additionally requires standalone Building-manual identity, an authentic finished-model illustration, direct WebP crop and five supported assessment checks.

| # | Registered variant | Source PDF file | Pages | Actual PDF SHA-256 | Outcome |
|---:|---|---|---:|---|---|
| 1 | `level-2-axe-robot` | Axe robot_Building.pdf | 15 | `8250029efc265fcc941b7ee7a02651a4f709aabc964ae0c3320477a5193961bf` | approved |
| 2 | `level-2-batting-robot` | Batting robot_Building.pdf | 10 | `c1b73230c01786302bf7fdec6686140efcadc99e2f76fa86a358284c1c1782ab` | approved |
| 3 | `level-2-fan-robot` | Fan robot_Building.pdf | 8 | `293fdf655243b43f4d5ac741c5340288cd1557e6fdad645e3164400f8879e478` | approved |
| 4 | `level-2-pirate-ship` | Pirate ship_Building.pdf | 15 | `7dc8bb070622e8cfcb6c9041bdb1f60721295134343458746e054a52809d90ce` | approved |
| 5 | `level-2-push-ups` | Push ups_building.pdf | 16 | `88bba93fe1cd79a112453d7f6456d15faa189208dbac9ce3026dc902b15cc323` | approved |
| 6 | `level-2-rotating-flying-chair` | Rotating flying chair_Building.pdf | 11 | `5a7da6074ef16a086d47cb086ad618dec4acf65b7223b9f7bb74d1ebdd1447f6` | approved |
| 7 | `level-2-throwing-robot` | Throwing robot_Building.pdf | 19 | `128a9eb5815e81447c29acf636f517b9f81b164162ba19f0cbd44b12c2aca9f1` | approved |
| 8 | `level-2-bee` | BEE.pdf | 20 | `2ebdc81b17279ab9cc7457324909fd8e4a28da7a3b0bb77c41542ae5ef60a9d6` | blocked |
| 9 | `level-2-chimpanzees` | Chimpanzees.pdf | 14 | `49e6960ad79bdeb4e8a4d0fa39def0b222b5422081626af07f3b65bfc97b6609` | blocked |
| 10 | `level-2-mechanical-dog` | Mechanical dog.pdf | 14 | `127735505bfd831b348d465630bc004f53ebdeaea5519e8ac7d8b0078181b902` | approved |
| 11 | `level-2-scaling-ladder` | Scaling ladder.pdf | 22 | `de6b34e6ef1359051b8d292f38a95b1268848b7df4fbed828a38062e1d4f1d04` | approved |
| 12 | `level-2-tower-crane` | Tower crane_Building.pdf | 18 | `1f78414ec590aa9ce037e302d9233ec6e3488dd87a258f5c21c967672f377b1e` | approved |
| 13 | `level-2-crane` | Crane.pdf | 20 | `145ac5a81795a54d64ee895bb6f1e76e9da4cd741bab320da1dcec8338fdaaa1` | blocked |
| 14 | `level-2-fare-gate` | Fare Gate.pdf | 14 | `71d5c5c47e08fa603f66c00d0a5050a01304a7888cbd11686d48c0149933b485` | blocked |
| 15 | `level-2-forklift` | Forklift.pdf | 24 | `c3b8d3e79e29494be57dcc232d10f0f5bf694b411246b0bcd712b9b38d883230` | blocked |
| 16 | `level-2-hammer-robot` | Hammer robot.pdf | 22 | `3119a370cdc0a1e280f2b66647922f65ff43130781e33726953783f794780622` | blocked |
| 17 | `level-2-lucky-turntable` | Lucky turntable.pdf | 22 | `50107e9622c1837747c766b05cc3e5b6e7b258d795e677eb065c01a588ca3680` | blocked |
| 18 | `level-2-the-treadmill` | The treadmill.pdf | 18 | `65c1da169137883128bf204f49f926cef89c9cbb45f4567c414986342059aa11` | blocked |
| 19 | `level-2-tightrope-walk` | Tightrope walk.pdf | 14 | `0e1454f6ffaeb0d8993f17a421df9b9649aa1dbf071464992267366e2f8efade` | blocked |
| 20 | `level-2-manual-flashlight` | Flashlight_Building.pdf | 15 | `c7734a79bca42a0cc95a94527d969b07a5bbccad8a0b6cbf1f76e82b7b567c1e` | approved |
| 21 | `level-2-jumping-machine` | Jumping machine_Building.pdf | 18 | `dd13ac2d24ea1960ddab8eca91a33f206973edb80fd131ec46551b67f0386176` | approved |
| 22 | `level-2-see-saw-v1` | Balance.pdf | 10 | `1c96a4cc6fe282faad3e5424141eb09d007a9a315e7020e01fa2f0a3a7e9ef56` | approved |
| 23 | `level-2-see-saw-v2` | Balance_v2.pdf | 10 | `b315e433675efca0cf50478b3d993203462f4002da0e8df8a6c76db658430aa6` | approved |
| 24 | `level-2-tongs` | Pliers.pdf | 13 | `f79cccd3bf5e1e6ee5ed0004d05bf9106e9d32d0a02ea76a2c46df7c6d9a7bb0` | approved |
| 25 | `level-2-automatic-window` | Automatic window.pdf | 19 | `6a1d48f4e86d79a72761aca63501ab0847a685cb9f0bd2919ae6e8b55bf25199` | blocked |
| 26 | `level-2-dung-beetle` | Dung Beetle.pdf | 26 | `6d356f3bcde8a5e57ea011964865bcc19a352c091f7ff74741213149d2eaabec` | blocked |
| 27 | `level-2-mobile-shot` | Mobile Shot.pdf | 20 | `39cf59febae7c02b3a69749278550a26de419f11e08f4d9928c652a042fb05d2` | blocked |
| 28 | `level-2-robot-war` | Robot war.pdf | 25 | `05c840802a4b7e2cdaf89063818ff69a85feb665f14879d26b222a27ebbe7b72` | blocked |
| 29 | `level-2-rolling-shutter` | Rolling Shutter.pdf | 16 | `4f290b057f636e84af730df984d3a773f01b752a43b8704d33e0435d5a37c05a` | blocked |
| 30 | `level-2-track-rickshaw` | Track Rickshaw.pdf | 18 | `c102ef8cd1fbc06091cd48caf69bc8821ed3dd266ab873a813ad25510148e50f` | blocked |
| 31 | `level-2-car-steering` | Car Steering.pdf | 22 | `7802134fbb5cc7caf8eef2541cc06c980df2c19d09ee33ec92c7984e28bf22a4` | blocked |
| 32 | `level-2-cliff-walk` | Cliff walk.pdf | 12 | `5c17ec40a85f3784da5dfc89be1cf2d9bc9d2289d28321f021de3a0252536045` | blocked |
| 33 | `level-2-ferris-wheel` | Ferris wheel.pdf | 22 | `ff9692aebe943797c03ccdda408589f0fa27345d67bc533c23bc702b524b0779` | blocked |
| 34 | `level-2-round-trip-transportation` | Round-trip transportation.pdf | 15 | `18fbac4a1217c841c42b72b1170d1a96880f34ab344899d531f4433573babfd9` | blocked |
| 35 | `level-2-shift-gears` | Shift gears.pdf | 19 | `0e640b29b17234bd8a16c9534f25aa25b820c28c18524478fec51a39da73a0c8` | blocked |
| 36 | `level-2-bridge` | Bridge_Building.pdf | 15 | `55f8aa6990c0e2be9ff06974da0decf76bdb2513176a578bf3fd440267d49eb9` | approved |
| 37 | `level-2-mechanisms-simulators-crane` | Crane_.pdf | 40 | `c004d69628ae6221a49118b976235047ed9385089e8c7a69e88ffbd37efdb9c8` | approved |
| 38 | `level-2-door` | Door_Building.pdf | 10 | `ebf35a2cb1bb4b7b83c34d5e85244921bcd27e3347fa05b242d900f3e49408d9` | approved |
| 39 | `level-2-double-beam-crane` | Double beam crane_Building.pdf | 22 | `9cdfb63a9508c5485626a6654493999692835c9ec0cd2eca95669b209c0a8f94` | approved |
| 40 | `level-2-gearbox` | Gearbox_Building.pdf | 20 | `749f6cc44d3217531184bc46ec6b3d10f7ad4cc550cf2b54498375b0f4e2d76f` | approved |
| 41 | `level-2-hand-crank` | Hand crank_Building.pdf | 11 | `7c868b6c28c29f49bb9f8dff630f3d8968e142e73582e5329d8cc6ca7a50e2ea` | approved |
| 42 | `level-2-spinning-bike` | Spinning bike_Building.pdf | 9 | `71e9424dcd6abadfa38976d2e742f6eabcf03f6340f27d58996c94ec0770d518` | approved |
| 43 | `level-2-swing` | Swing_Building.pdf | 8 | `27ea63b444bdfa7b78d6837db6c1f71f15740649a8a5f77ca5699963327d36b3` | approved |
| 44 | `level-2-treadmill` | Treadmill_Building.pdf | 21 | `78b5fb021bff9908e8d9e56b64143f9fba29a44b7cfc7004963b952fe1ebfae7` | approved |
| 45 | `level-2-animal-trap` | Animal trap.pdf | 18 | `a46e7c9d132603d2e210bb87e29140f44ef5966ede154e959983931aeb9047e4` | blocked |
| 46 | `level-2-headlights` | Headlights.pdf | 14 | `a67d05ec8d653b644a6ad213d60bdd74688e5b9ca69687c3f5e0464294f4134d` | blocked |
| 47 | `level-2-battery-robot` | Battery robot_Building.pdf | 23 | `75e1a4286f55616b1b7e31dbc8412dc3730eed77932760ea834ae35e00fb126f` | approved |
| 48 | `level-2-walking-robot` | Walking Robot.pdf | 35 | `18411a2fcc722e290aeb33decc56cf1a13692a36ea7599b8ae121af92a4912fa` | approved |
| 49 | `level-2-led-scrolling-screen` | LED Scrolling Screen.pdf | 10 | `00ef8962f3ff496c1d7b34ba3589c30ae44facd76ec244c17c493ced7e402b8b` | blocked |
| 50 | `level-2-led-signboard` | LED Signboard.pdf | 12 | `d0cc5f6549b63fc94555403441bf95ab2c74ddc4148aba4849ec1c78d8b2c632` | blocked |
| 51 | `level-2-reverse-parking` | Reverse Parking.pdf | 12 | `25bb429bec66e53a94622808c061fb70ecff343a2a6ce751fb21b9e7e143eac9` | blocked |
| 52 | `level-2-smart-window` | Smart Window.pdf | 18 | `b52d20afccc3905883ddc7388a4a1ce0867559eec3ca13fe8e76a92a2ea6faeb` | blocked |
| 53 | `level-2-spirograph` | Spirograph.pdf | 20 | `59c76e37ae12fbdf1db46c182df4fb0c42e830b8375bee87a3b26348d8827df0` | blocked |
| 54 | `level-2-harp` | Harp_Building.pdf | 10 | `94566ed8bea3ceaf16cd601adeed8a67ed3e7f0320999667e693211d2702765f` | approved |
| 55 | `level-2-helicopter` | Helicopter_Building.pdf | 35 | `b4fb3eafd3e7446bf6c2f4d2c39603ed428ce5b0be8b3211d50cde630d7c9871` | approved |
| 56 | `level-2-lifting-door` | Lifting door_Building.pdf | 27 | `edf0bdb7118f2198d4f22635baa8f37628069f82bec8bca9e6e183cec8d13998` | approved |
| 57 | `level-2-teeterboard` | Teeterboard.pdf | 10 | `d5f16824292f41f6ddff7c91dbc0badd0a1109c763b4956bdb8515df6eb8eda1` | approved |
| 58 | `level-2-four-wheel-drive` | Four-wheel Drive.pdf | 16 | `e3a551c87cc5e008d1b38062e62ae70cf4a6012e869b473f79c9b5b6d7555b44` | blocked |
| 59 | `level-2-pedal-waterwheel` | Pedal Waterwheel.pdf | 12 | `28195e267f57cfeb242db013a0ce9c072b0f5a0d187d201e475328f3a794c053` | blocked |
| 60 | `level-2-tank` | Tank.pdf | 32 | `705f39620b4d47afc4855b924c0d88d056cb59a2b850df77cfa7709808001655` | blocked |

## Approved finished-model WebP evidence
All 30 approved files were independently reopened after GitHub upload and compared by SHA-256 against their locally produced WebP bytes. Page references are 1-based original PDF page indexes. `xref` is the embedded PDF image object number; Hand Crank uses a rendered original-page pixel crop to avoid a compositing issue. Source images were not regenerated or redrawn.

| Project variant | Finished model PDF page | Image (px) | WebP SHA-256 | File size (bytes) |
|---|---:|---:|---|---:|
| `level-2-axe-robot` | 15 | 331×800 | `9f94a4d35c84fb97a78a805eb376ae34b3902a0cee7e6decc099eda7f1f05cfb` | 44168 |
| `level-2-batting-robot` | 10 | 447×480 | `eb80b44c20191e4839955fdccd912a4b9e2be793a4ceca40686dde5a1e771069` | 19048 |
| `level-2-fan-robot` | 8 | 480×445 | `e6142c90dd068af6489a2b1c8d81638267500891fb5571c154e2c74bfc429a98` | 19798 |
| `level-2-pirate-ship` | 15 | 366×420 | `c742a66b8ebe636419fc0165ee2491443685c9bae06ef8b4db01738ef1bfc583` | 19518 |
| `level-2-push-ups` | 16 | 336×720 | `76d77739ae9312af98935d68089145c0e7ab1ddae40a504bfd8ab09fbe24ac95` | 33682 |
| `level-2-rotating-flying-chair` | 11 | 525×628 | `072dd8a684787d5099e7a2c074fc427ca29c2d3763890494987760ea4a536a13` | 22722 |
| `level-2-throwing-robot` | 19 | 480×275 | `71fd59a7de1fb8baf183d2025ba2824b21b809f66cc614ce2a0db23535909e02` | 19380 |
| `level-2-mechanical-dog` | 14 | 485×326 | `062c61dd6523d5ae5348f48a8169d8009036af21219bf609aad5e35a743bb106` | 22712 |
| `level-2-scaling-ladder` | 22 | 682×389 | `15df71ad10abdf5b639d4bcdc48c186e6aa74337393ec90879ae5f7476210349` | 21282 |
| `level-2-tower-crane` | 18 | 511×800 | `60d1c2f7d7ccbfb8cab4ac77f20a7ccbfc786ff20fe8a118cb37f6bdb31f0850` | 21724 |
| `level-2-manual-flashlight` | 15 | 635×660 | `73bd63aa29370e34e8f75248c7c57d2d7446e996659b29a23b7e4fb7a42fad3b` | 22502 |
| `level-2-jumping-machine` | 18 | 335×660 | `5ecfa18e4cfae681ef4c63ae4ba17de415b04596950f99987b288c6dbb40bc2d` | 19388 |
| `level-2-see-saw-v1` | 10 | 610×378 | `0dee481af3c47284d4e7c7e20d95cd079e367ffc8621c4be83d2753d1524b09b` | 21050 |
| `level-2-see-saw-v2` | 10 | 600×372 | `c2a9ece12d807352f22cc8daa53122d95e55a4b93d0728325b9bbb9274de82c2` | 21660 |
| `level-2-tongs` | 13 | 476×360 | `e6eb06218bda234b1c42e0913a9c5cdeb279a2d1f0f0754f0198158fdf342617` | 10928 |
| `level-2-bridge` | 15 | 610×376 | `9bcd54a99e228ca96af4a197427c38591c6e2515f79fa34e4c41d4254a80164f` | 18712 |
| `level-2-mechanisms-simulators-crane` | 40 | 386×420 | `febae98726c032324f958305f6812156f943b95efd3444a4894dcd5ab83d5557` | 19426 |
| `level-2-door` | 10 | 610×541 | `ac2787fbf6aac2f0d0a4f497c73c2c00d2bf1cd5afcbc9d3ff9a6870c79658c7` | 21444 |
| `level-2-double-beam-crane` | 22 | 610×589 | `30d1ffd5596baabb1e5a4750c91646711bddfd5445c610dec03ab75e9225e59d` | 19340 |
| `level-2-gearbox` | 20 | 660×466 | `a32108ee56d4521d2cb17d8c9920b72c98ff3eaacf8edb2328d6fe84a1a79533` | 19736 |
| `level-2-hand-crank` | 11 | 478×637 | `25ce3d5d48938f9e89f43be664ebe2c18b2931847b54ae2f7373be8fcbea86ac` | 15032 |
| `level-2-spinning-bike` | 9 | 436×610 | `252f263a77db830e2b863b41b5fb59251bc32cd7328c629a380aef3755508ecc` | 38584 |
| `level-2-swing` | 8 | 480×337 | `ca3afce65723ab661856d3d3331396f3a8d5ffae8389487716a72cc7b0f8a8a3` | 19036 |
| `level-2-treadmill` | 21 | 354×360 | `e8b78f9932593366a30ce8bb15e501ef7846ce74877ea4c981a5a190fe348c66` | 18778 |
| `level-2-battery-robot` | 23 | 358×420 | `bb58e353388abcb90f28b50d72823fe53c32d53d1bfcf9bc2208dcc7dfeb066f` | 19020 |
| `level-2-walking-robot` | 35 | 462×510 | `9401a2f9a48d09098b96cdd850b754d18201ec7925bc7641704e958d3be5a7df` | 19772 |
| `level-2-harp` | 10 | 660×512 | `f61bb88fa426dceab16a159f6d2b1b644fd11ea2b9c228ef3f401ba237f9557a` | 18252 |
| `level-2-helicopter` | 35 | 360×329 | `706c06e66179ac0f3004ce066ff7947b89317d7b0dd436eaab70490632f0be94` | 19656 |
| `level-2-lifting-door` | 27 | 380×660 | `ad3668f036ca4f1b4165c53fb3ef0806670b1c3730435fbf63f7ef860c208a7d` | 19210 |
| `level-2-teeterboard` | 10 | 600×372 | `bca3ab4c1faebd7d9c2c451c7f22e1fc23213a67cc245658b1c00ecfdddeed90` | 18708 |

The separate `src/data/finalBuild/level-2-image-provenance.json` records each image's original PDF image XREF or rendered-page crop bounds, output dimensions, exact hashes, file sizes and source method. `level-2-references.json` includes approved links for the integration worker; every reference binds to the real PDF SHA-256. Two distinct passes were performed: source/image extraction and source-backed candidate review, followed by separate source-PDF byte/hash/page rechecks and reopening of the **committed GitHub WebPs**.

## Checklist and approval validation
- **30 checklists**, **exactly 5 page-grounded observable robot-specific questions each** (150 total).
- Each question has its actual completed-model PDF page reference and a claim-specific evidence note in `level-2-checklists.json`.
- The two See Saw variants have separately described construction details; their pages and image hashes are recorded separately.
- No generated, AI-reconstructed, stock or substituted robot imagery was used.
- 30 source registrations remain **blocked** because they appeared to be curriculum Learning presentations or did not yield a defensible independently isolated Building-manual finished-model picture and supported five-question checklist. A valid live PDF URL **does not** constitute an approval.

### Important language-check qualification
No extractable CJK codepoints were found in text layers across the 60 parsed PDFs, and the checked covers and final model pages used English-facing manual/lesson labels. This check cannot eliminate rasterized Chinese symbols or publisher logos on every unexamined interior page. Any publisher branding remained in original PDFs and is not copied into the cropped finished-model images. The 36 historical cleaned-upload mappings were byte-confirmed against their recorded Git objects.

## Executed tests — authorized isolated Node 24 sandbox
- `node --test tests/final-build-level-2.test.mjs tests/final-build-exams.test.mjs`:
  **17 reported tests: 14 PASS, 0 FAIL, 3 TODO, 0 skipped**.
- The Level 2 suite checked 59/60 registry identities, the two See Saw variants, exact Wix source mappings, 36 historical hashes, blocked-record exclusion, all 30 image file existence/dimensions/**actual WebP SHA-256**, 30 exact PDF source bindings, 150 page-cited questions, and source-scanned Level 1 parity constants.
- The shared Final Build regression suite checked route registration, unbiased scan index, unapproved Start gating, deadline persistence and self-assessment contracts.
- Executed no GitHub Actions.
- **Interactive viewport QA at 320/375/390/430 CSS pixels has not yet been completed in a rendered, deployed browser.** Do not equate component-source review with UI/device verification.

## Integration-worker required changes — shared files intentionally untouched
1. **Approved-only scanner discovery:** current shared pool selects registered candidates, while the Start button checks global approvals afterward. Modify central selection so unapproved projects never appear in discovery, with fair unbiased random sampling and repeats allowed.
2. **Level 2 approved WebP and checklist consumption:** shared `checkDescriptions(name)` title heuristics and dynamic PDF-page cropping must be replaced at the integration layer with exactly the `level-2-references.json` image path and 5 source-cited `level-2-checklists.json` entries keyed by variant ID.
3. **Strict 15-min + device QA:** independently exercise scanner 4.2 s, delayed timer Start, persistent absolute deadline across reloads, timeout auto-assessment with timed pass disabled, 4/5 threshold, unlimited retries and 320/375/390/430 px viewport UI.
4. **Global approvals:** integration worker, not Level 2 worker, must update global approvals only for these 30 independently approved records; preserve all 30 blocked IDs.

## QA scope and restrictions
All Level 2 work is limited to `src/data/finalBuild/level-2-*.json`, `public/final-build/level-2/`, `scripts/final-build-level-2-prepare.py`, `tests/final-build-level-2.test.mjs` and this report. No changes to production, shared exam engine, global CSS, package dependencies, main or other levels. **No independent merge.** Final release depends on integration worker resolving shared contracts, executing interactive viewport QA and merging eligible approved content.
