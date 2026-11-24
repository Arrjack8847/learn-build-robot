# Level 2 Building — English restoration audit (2026-11-19)

**STATUS: PDF BINARIES NOT YET UPLOADED TO GITHUB — DO NOT MERGE AS COMPLETED DELIVERY.**

Scope: Level 2 **Building** PDFs only. The existing public paths are retained. Learning PDFs were excluded. No GitHub Actions or production deployment was used.

## Local execution results

- 60 original manuals, 1,056 pages, 996 interior pages; all 60 source Git blob SHAs verified against `main`.
- The existing 20 approved English cover PDFs were recovered and combined with interior corrections; 346 pages in those 20 manuals.
- 23 interior pages had extractable Chinese (22 instances of a controller-port question and 1 Tank page with two labels). Their Chinese text objects were removed and replaced with accurate English.
- Chinese manufacturer logo in image footer masked on 202 interior pages across 14 PDFs; existing English manufacturer name retained.
- Total interior pages changed: 225, in 30 manuals; 36 PDFs have changed either cover or interior; 24 remain byte-identical originals.
- Validation passed all 60: original page counts and dimensions retained, no remaining extractable Chinese on interiors, original English text preserved, all non-target interior pages pixel-identical at 72 DPI, targeted changes confined to repair bounding boxes.
- Local staging: sandbox `bsr-l2-full-english-20261119`, `/vercel/level2-final-english-20261119/`; modified PDF binaries total about 132 MB.
- Text/image OCR screening may have occasional false positives/negatives; this audit does not constitute manually signed-off page-by-page visual QA.
- **Blocker:** This connected GitHub interface cannot directly transfer sandbox-generated binary PDF files into repository blobs, and sandbox `git`/GitHub CLI has no authenticated write access. Final output Git blob hashes listed here are **local calculated**, not published GitHub hashes. Do not merge this PR until actual PDFs are committed and remote blob hashes verified.

## Per-file output integrity

| PDF file (under public/) | Pages | Approved cover | Interior pages edited | Original Git blob SHA | Local final Git blob SHA | QA |
|---|---:|:---:|---:|---|---|---|
| Animal trap.pdf | 18 | No | 2 | 3c1bfe3b2ebaa836dc54d581ed267fb4b57564cc | d3817c2e738575e30efa8646640aeab17b499de9 | PASS |
| Automatic window.pdf | 19 | No | 1 | 436e8bdaadc0f85d0101662efcf5c64d43cf99ef | 3a3995703be1fa8f6cc66c580f6dbe56c8c27244 | PASS |
| Axe robot_Building.pdf | 15 | No | 0 | 7773d60c3031e041fb6d590d2c3c79080c988477 | 7773d60c3031e041fb6d590d2c3c79080c988477 | PASS |
| Balance_v2.pdf | 10 | Yes | 0 | 21df7860ba63c17acc720bc69381d4cf41d34e76 | a94fc8f028b6936405f124b93e6b1fd8796a9164 | PASS |
| Balance.pdf | 10 | Yes | 7 | 953286e4ef78a9c375a054fb39a9d27bde3cbbf5 | fc3fa184708687887055bed12497c3f9be9cd515 | PASS |
| Battery robot_Building.pdf | 23 | No | 0 | ed758e45369c3d3c67ecb7e4018749bfb10dcf31 | ed758e45369c3d3c67ecb7e4018749bfb10dcf31 | PASS |
| Batting robot_Building.pdf | 10 | No | 0 | ecc67766a5b2b146e76712bb80b5bd0cae602649 | ecc67766a5b2b146e76712bb80b5bd0cae602649 | PASS |
| BEE.pdf | 20 | No | 3 | 14f650e83617d5aa17d5c5ebe3ed15a549bc17da | 1abea2a1902ff6a704a56aa0d5968bd9b406d7e8 | PASS |
| Bridge_Building.pdf | 15 | Yes | 14 | 8798795f26e5ce13efd4fff8b96fa21f6aebc33c | 823fab22170a2243a6593601350a7a5baedc2480 | PASS |
| Car Steering.pdf | 22 | No | 1 | 71d6652607982fe78dae04fad75dc482ae4f7be7 | cd9b60ba4d0d80e8160192fbe8ae7abc1a28c7cf | PASS |
| Chimpanzees.pdf | 14 | No | 1 | 1c6f7bc66a50a5d6289f30d5f2f016dae2c89d01 | 74b5b054951fac6bbb3c8fd96ce74237074a74a3 | PASS |
| Cliff walk.pdf | 12 | No | 1 | d4fc4797753b387dd6b0bf40b713ca8e706c37c7 | 997b01642531a48355a2abe5d1320a50b5a6c10b | PASS |
| Crane_.pdf | 40 | Yes | 35 | 6d67b0f8c9895428b9b7a38e6c90cddd1a396977 | 6df91bf8dd41076ed1026ee74be7070b3122f3f6 | PASS |
| Crane.pdf | 20 | No | 0 | 9d4ae2829532e9712e04be0d08215abd34f79fbd | 9d4ae2829532e9712e04be0d08215abd34f79fbd | PASS |
| Door_Building.pdf | 10 | Yes | 8 | 67668a7e64bc00f196cb7ff009a328d77bdb3090 | b784dbfd94d07c3142820d0e5d384370fd4fe159 | PASS |
| Double beam crane_Building.pdf | 22 | Yes | 20 | d48c08a547336a19d3765d8c7ccb24da13e15ecf | 08499d01d01ad8181ff70509175d0fabf8f7954d | PASS |
| Dung Beetle.pdf | 26 | No | 0 | c4bb864ddefa921ef5932938fd82abd959dbc8d0 | c4bb864ddefa921ef5932938fd82abd959dbc8d0 | PASS |
| Fan robot_Building.pdf | 8 | No | 0 | 9131a51ad4893541d91be8c1a07f3adacd00da0d | 9131a51ad4893541d91be8c1a07f3adacd00da0d | PASS |
| Fare Gate.pdf | 14 | No | 0 | 602d2dec9f2da62856ec9216c992a06314d5c857 | 602d2dec9f2da62856ec9216c992a06314d5c857 | PASS |
| Ferris wheel.pdf | 22 | No | 2 | 92a8ffdac55fe538042e20ba7cda47dbce50f834 | 75bec5b05105a9b87d3339ba10c4cd46b3110fa7 | PASS |
| Flashlight_Building.pdf | 15 | Yes | 14 | e14747c661a5eb3b8264d4f63ac1b8c270e0c89f | 3868875e6339b4e6713e7b074e98f713779dd629 | PASS |
| Forklift.pdf | 24 | No | 0 | 87f3e0fd9875afc9603614a159d3a4ac0143686e | 87f3e0fd9875afc9603614a159d3a4ac0143686e | PASS |
| Four-wheel Drive.pdf | 16 | No | 0 | 84b7453b8e1d0d4b0e30d4c043617b9b81d95547 | 84b7453b8e1d0d4b0e30d4c043617b9b81d95547 | PASS |
| Gearbox_Building.pdf | 20 | Yes | 17 | 152fdae6b1a305dbd7b8eb1b1dca97ab8d522cf3 | d36685c96cdddcb74ac98ea3f1751b9f55116faa | PASS |
| Hammer robot.pdf | 22 | No | 1 | 3289cba0dc5f248ee4ea637e5dc2bbae5fe4dfbe | d88e7aeef7235812336128d83a6120f66dc83039 | PASS |
| Hand crank_Building.pdf | 11 | Yes | 9 | aac537c905dafec17ce41d94a53450a866e212a1 | 42ffa3111761e2de0fe0024ff7345c95291ec08b | PASS |
| Harp_Building.pdf | 10 | Yes | 8 | 8fdc6663611b7aeb684afe9a756cfca658b58106 | 06e478e8223ad72672f696d169af5fd401d405c9 | PASS |
| Headlights.pdf | 14 | No | 1 | 961ea85e1cd52a18318791b874a8229cad743c23 | b881202ec518483feab50e6968e9dc3691a0d399 | PASS |
| Helicopter_Building.pdf | 35 | No | 0 | 7f6f3c37f213ffd954216fcc6e42fab93d3ec52a | 7f6f3c37f213ffd954216fcc6e42fab93d3ec52a | PASS |
| Jumping machine_Building.pdf | 18 | Yes | 15 | fdef944d28b23099fb20fd92139eaf2fd57c6608 | 59f644717ed7455240e0eacaabeb73ed0098a3d8 | PASS |
| LED Scrolling Screen.pdf | 10 | No | 0 | caecd4ddb7c02e6c315252e960a9e53c6d9f6280 | caecd4ddb7c02e6c315252e960a9e53c6d9f6280 | PASS |
| LED Signboard.pdf | 12 | No | 0 | 30771acaeda6a6fe9fe0ebd470578f3b197b8aa6 | 30771acaeda6a6fe9fe0ebd470578f3b197b8aa6 | PASS |
| Lifting door_Building.pdf | 27 | Yes | 24 | c9462f702c7602c40e1e53001500c2d107f87b7f | bcacb16aaa15caf58dbfcbce704dc7eb56f95c5d | PASS |
| Lucky turntable.pdf | 22 | No | 1 | 049c3292d095ae3eb9cc8d31d246b93934a007d8 | 90ecdd468a6e75504b37099ca6696d181382a12c | PASS |
| Mechanical dog.pdf | 14 | Yes | 0 | 0b40358a925639d5ffac13f551ac69c1aebc0f96 | 8dd115c7bdbc0dfd27a0d79244f7ec5db43e6b0b | PASS |
| Mobile Shot.pdf | 20 | No | 0 | 542ef439142804b41b71871dc9127650f7a6625b | 542ef439142804b41b71871dc9127650f7a6625b | PASS |
| Pedal Waterwheel.pdf | 12 | No | 0 | fe3f2245a7c5edf2ff2445b34e665879e2b3079b | fe3f2245a7c5edf2ff2445b34e665879e2b3079b | PASS |
| Pirate ship_Building.pdf | 15 | Yes | 13 | cae6cbbfa3b330627394b7b10e879b8dfc609313 | 742622419638d99be016e612ba5ba1eae4d76416 | PASS |
| Pliers.pdf | 13 | Yes | 0 | b87354730e587b2f22920041c60e61f960703463 | fb30842584028de64cf628cc0ccc3eebb12d0636 | PASS |
| Push ups_building.pdf | 16 | No | 0 | ea79f05e632be704113fb449b0e08ec70c2e1eee | ea79f05e632be704113fb449b0e08ec70c2e1eee | PASS |
| Reverse Parking.pdf | 12 | No | 0 | 18cf6c2c0651abacc04114de6e631176a292b994 | 18cf6c2c0651abacc04114de6e631176a292b994 | PASS |
| Robot war.pdf | 25 | No | 2 | 8a7f1760c9623ffa6e089c90701648c6e1aecbe3 | 79333498bf300bc3a3a452d7728296f83ecc842d | PASS |
| Rolling Shutter.pdf | 16 | No | 0 | cbaf3dda9daaa021a88238276dce24a4c2304d4f | cbaf3dda9daaa021a88238276dce24a4c2304d4f | PASS |
| Rotating flying chair_Building.pdf | 11 | Yes | 8 | 4291b8dd08df9c651e270e1f855d76b304ecb8d3 | 0eda57ae2bc959aca61c49703fc3373d131b7395 | PASS |
| Round-trip transportation.pdf | 15 | No | 1 | 4302e1cc92b1474f5abdef57a2de9736f42a5e0a | 443a39cbb547a8a9b491f1d532c4d69ecdb4231e | PASS |
| Scaling ladder.pdf | 22 | Yes | 0 | f001a8447b56b90a639b2b923b4a33774fa1e76c | b519581c67658ca7ed5943a038708ec06674211a | PASS |
| Shift gears.pdf | 19 | No | 2 | 3041120a52e8b7091c8796580670e2f5ae47dc8f | ec4a4e8428450ca2fd7db6a5ca5fc9fd8ee396b9 | PASS |
| Smart Window.pdf | 18 | No | 0 | 8944d7239b3d078676879a7ecbb6b4a1c35c7444 | 8944d7239b3d078676879a7ecbb6b4a1c35c7444 | PASS |
| Spinning bike_Building.pdf | 9 | No | 0 | 74a7f32abb7a93532c464e0f04a4ab0430fdf091 | 74a7f32abb7a93532c464e0f04a4ab0430fdf091 | PASS |
| Spirograph.pdf | 20 | No | 0 | e2dd8f8cda4179dc117acf7548e7fdd49aba7361 | e2dd8f8cda4179dc117acf7548e7fdd49aba7361 | PASS |
| Swing_Building.pdf | 8 | No | 0 | d7d3c926d6c880c73df4de9fe6565761c5133ebd | d7d3c926d6c880c73df4de9fe6565761c5133ebd | PASS |
| Tank.pdf | 32 | No | 1 | 529bccadbde1fc83b5f994d69e412e72e46410da | f086f4ffe0a71fb23e3b10b82981e3a1fac1b025 | PASS |
| Teeterboard.pdf | 10 | Yes | 0 | 21df7860ba63c17acc720bc69381d4cf41d34e76 | 66845acdc2468e72600bbd096ea1cc7ca69f3966 | PASS |
| The treadmill.pdf | 18 | No | 2 | 30f93ed7184c756294d27c60c6e71c7e88329285 | e9dba3aa4add16ae6a32a77e6d6ff17bc423705e | PASS |
| Throwing robot_Building.pdf | 19 | No | 0 | c6003825dc39d30193501ee58d6d97ce13836d4d | c6003825dc39d30193501ee58d6d97ce13836d4d | PASS |
| Tightrope walk.pdf | 14 | No | 1 | fc2a37c7bcfac70c0f1b2afb6ff68f7f21ce02a3 | 65c3e1c4d4f529e45f7cf6721682f1318664b79b | PASS |
| Tower crane_Building.pdf | 18 | Yes | 10 | 1a92c09b5a21f26a51b9868677eb283cd2e3605e | 929597f5dffba314146eb44862df26fad317dcb5 | PASS |
| Track Rickshaw.pdf | 18 | No | 0 | ee0fc85a36ec91eba42afab71e38e97e0504c50e | ee0fc85a36ec91eba42afab71e38e97e0504c50e | PASS |
| Treadmill_Building.pdf | 21 | No | 0 | a0a26bdfea53b51d433bffbf895b7d9c0ba2c8f5 | a0a26bdfea53b51d433bffbf895b7d9c0ba2c8f5 | PASS |
| Walking Robot.pdf | 35 | Yes | 0 | a12735eb2559ce9044880d77771eb99970216f09 | 0b9ade90acc26a3f8039a88def478349eff19683 | PASS |
