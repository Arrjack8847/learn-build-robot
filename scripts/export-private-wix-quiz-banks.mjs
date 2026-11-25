// Run in a trusted development environment with Node 22.18+.
// Output contains answer keys. Never commit output to this public repository.
import assert from "node:assert/strict";
import { writeFile, realpath } from "node:fs/promises";
import { resolve, dirname, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { quizBanks, getQuizBank, validateQuizBank, selectQuizQuestions } from "../src/data/quizStudio.ts";

const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
const output = process.argv[2];
assert.ok(output, "Supply an output file OUTSIDE this public repository.");
const parent = await realpath(dirname(resolve(output)));
const destination = resolve(parent, resolve(output).split(/[\\/]/).at(-1));
const rel = relative(root, destination);
assert.ok(rel && (rel === ".." || rel.startsWith(".." + (process.platform === "win32" ? "\\" : "/")) || isAbsolute(rel)), "Do not write answer keys into the public repo.");

const banks = {};
const counts = new Map();
const ids = Object.keys(quizBanks).sort();
assert.equal(ids.length, 321, "Unexpected quiz registry count; review curriculum revision.");
for (const id of ids) {
  const bank = getQuizBank(id);
  assert.ok(bank, id + ": unavailable bank");
  assert.equal(bank.projectId, id);
  assert.deepEqual(validateQuizBank(bank), [], id);
  const initial = selectQuizQuestions(bank, [], () => 0);
  const retry = selectQuizQuestions(bank, initial.map(q => q.id), () => 0);
  assert.equal(initial.length, 5);
  assert.equal(retry.length, 5);
  assert.equal(new Set(initial.map(q => q.topic)).size, 5);
  assert.ok(retry.every(q => !initial.some(p => p.id === q.id)), id + ": retry overlap");
  const level = Number(id.match(/^level-([2-6])-/)?.[1] ?? 1);
  counts.set(level, (counts.get(level) ?? 0) + 1);
  banks[id] = bank;
}
assert.deepEqual([...counts.entries()].sort((a,b) => a[0]-b[0]), [[1,60],[2,60],[3,51],[4,56],[5,51],[6,43]]);
const revision = execFileSync("git", ["rev-parse","HEAD"], {cwd:root, encoding:"utf8"}).trim();
const source = "// Private Wix backend quiz registry from source revision " + revision + "\n" +
  "const BANKS = " + JSON.stringify(banks, null, 2) + ";\n" +
  "export function getQuizBank(projectId) {\n" +
  "  return Object.prototype.hasOwnProperty.call(BANKS, projectId) ? BANKS[projectId] : null;\n}\n";
await writeFile(destination, source, {encoding:"utf8", flag:"wx", mode:0o600});
console.log("Validated " + ids.length + " banks; " + ids.length * 10 + " questions exported to a private destination.");
