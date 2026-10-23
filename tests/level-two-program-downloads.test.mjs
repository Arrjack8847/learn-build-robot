import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = path => readFileSync(resolve(root, path), "utf8");
const source = read("src/data/levelTwoProgrammingFiles.ts");
const learning = read("src/components/practical/LevelOneLearningStudio.tsx");
const lectureData = read("src/data/levelTwoLectures.ts");

const expected = [
  ["level-2-axe-robot","Action-Oriented/Axe robot/Axe robot_program.sb2","54182daedb00fd4187c810fe4c40a7031ce090dd"],
  ["level-2-batting-robot","Action-Oriented/Batting robot/Batting robot - program.sb2","2f941d2b4bfd0d978c40a4c5db306ef2d3c7bd38"],
  ["level-2-fan-robot","Action-Oriented/Fan robot/Fan robot_program.sb2","b6fa0aaf2c253db3cc1e24dd31911c7b45666980"],
  ["level-2-push-ups","Action-Oriented/Push ups/Push ups_program.sb2","65ab2cd0f856327c1df46788adf85a00cf787f10"],
  ["level-2-throwing-robot","Action-Oriented/Throwing robot/Throwing robot_program.sb2","d55d49db6576c0a82c3f27bfbfc4da3f55fe1abb"],
  ["level-2-spinning-bike","Mechanisms & Simulators/Spinning bike/Spinning bike_program.sb2","2070df248504fa742ff641e06ae0f436fc6f8db8"],
  ["level-2-swing","Mechanisms & Simulators/Swing/Swing-program.sb2","438b1b880228635f7e8d996dc212097b7942ad96"],
  ["level-2-treadmill","Mechanisms & Simulators/Treadmill/Treadmill-program.sb2","a327ec0261e63faae027d80968a18621fedad345"],
  ["level-2-battery-robot","Programming & Precise Control/Battery robot/Battery robot_program.sb2","d4c78b73e48d5331682e39aa8fb90288a53d8870"],
  ["level-2-helicopter","Vehicles & Complex Movers/Helicopter/Helicopter_program.sb2","7b9f5320dabca652d136a3f569fc776032621eed"],
];

// Execute the real TypeScript registry, not a duplicated list of URLs.
const module = { exports: {} };
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
vm.runInNewContext(code, { module, exports: module.exports }, { filename: "levelTwoProgrammingFiles.ts" });
const { getLevelTwoProgrammingFiles, levelTwoProgrammingFiles } = module.exports;

function allSb2(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? allSb2(path) : entry.isFile() && entry.name.endsWith(".sb2") ? [path] : [];
  });
}

test("all ten Level 2 programs are correctly mapped and belong to real lecture projects", () => {
  const mapped = [...source.matchAll(/\["(level-2-[^"]+)", "([^"]+\.sb2)"\]/g)];
  assert.deepEqual(mapped.map(([, id, path]) => [id, path]), expected.map(([id, path]) => [id, path]));
  assert.equal(Object.keys(levelTwoProgrammingFiles).length, 10);
  assert.equal(new Set(expected.map(([id]) => id)).size, 10);
  assert.equal(new Set(expected.map(([, path]) => path)).size, 10);
  for (const [id] of expected) {
    assert.ok(lectureData.includes('["' + id + '",'), "Lecture mapping missing for " + id);
  }
});

test("download URLs resolve to the original named .sb2 assets and their exact GitHub blob bytes", () => {
  const base = resolve(root, "public/Level 2/Programming");
  assert.equal(allSb2(base).length, 10);
  for (const [id, relativePath, originalBlobSha] of expected) {
    const files = getLevelTwoProgrammingFiles(id);
    assert.equal(files.length, 1, "One program per project: " + id);
    const file = files[0];
    const expectedFileName = relativePath.split("/").at(-1);
    assert.equal(file.fileName, expectedFileName);
    assert.equal(file.url, "/Level%202/Programming/" + relativePath.split("/").map(encodeURIComponent).join("/"));
    const onDisk = resolve(root, "public", decodeURIComponent(file.url).slice(1));
    assert.equal(onDisk, resolve(base, relativePath));
    assert.ok(statSync(onDisk).isFile());
    const bytes = readFileSync(onDisk);
    assert.ok(bytes.length > 100, "Program must not be empty: " + id);
    assert.equal(bytes.subarray(0, 4).toString("hex"), "504b0304", "Scratch 2 program is a ZIP archive");
    const sha = createHash("sha1").update("blob " + bytes.length + "\\0").update(bytes).digest("hex");
    assert.equal(sha, originalBlobSha, "Original GitHub file content changed: " + id);
  }
});

test("only the ten matching Level 2 lectures show the optional download section", () => {
  assert.ok(learning.includes("level === 2 ? getLevelTwoProgrammingFiles(projectId) : []"));
  assert.ok(learning.includes("programmingFiles.length > 0"));
  assert.ok(learning.includes('aria-label="Programming File"'));
  assert.ok(learning.includes("Download Program (.sb2)"));
  assert.ok(learning.includes("download={file.fileName}"));
  assert.ok(learning.includes("href={file.url}"));
  assert.ok(!getLevelTwoProgrammingFiles("level-2-pirate-ship").length);
  assert.ok(!getLevelTwoProgrammingFiles("level-3-clip-robot").length);
  assert.ok(!getLevelTwoProgrammingFiles("level-4-dangerous-assassin").length);
  assert.ok(learning.includes("onClick={() => setPage(current => Math.min(total, current + 1))}"));
  assert.ok(learning.includes("onClick={() => setPage(current => Math.max(1, current - 1))}"));
  assert.ok(learning.includes("Finish <ChevronRight"));
});

test("Building Studio and all Learning routes remain intact", () => {
  const viewer = read("src/components/practical/PdfActivityViewer.tsx");
  const route = read("src/routes/practical/$projectId.tsx");
  const overview = read("src/routes/projects.$projectId.tsx");
  assert.ok(viewer.includes("export function PdfActivityViewer"));
  assert.ok(route.includes("getLevelTwoLecture(project.id)"));
  assert.ok(route.includes('mode === "learning"'));
  assert.ok(route.includes("PdfActivityViewer key={project.id} manual={pdfManual}"));
  assert.ok(overview.includes('search={{ mode: "learning" }}'));
  assert.ok(overview.includes('search={{ mode: "building" }}'));
});
