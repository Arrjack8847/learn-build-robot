import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getQuizBank } from "../src/data/quizStudio.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("Level 6 registry audit never activates unverified lessons", async () => {
  const registry = join(root, "src/data/quizStudio.ts");
  const original = await readFile(registry, "utf8");
  const report = spawnSync(process.execPath,
    ["scripts/publish-verified-level6.mjs"], { cwd: root, encoding: "utf8", timeout: 120000 });
  assert.equal(report.status, 0, "Source audit failed: " + report.stderr);
  const result = JSON.parse(report.stdout);
  assert.equal(result.registered, 43);
  assert.equal(result.previouslyPlayable + result.newlyApproved + result.remainingUnpublished, 43);
  assert.ok(Array.isArray(result.blocked));
  assert.ok(getQuizBank("level-6-altimeter"), "Existing Altimeter bank must remain playable");
  assert.ok(getQuizBank("level-6-ball-tracking"), "Existing Ball Tracking bank must remain playable");
  assert.equal(await readFile(registry, "utf8"), original, "Audit must never modify shared app files");
});

test("Level 6 publisher requires PDF digests, visual evidence and exact slide IDs", async () => {
  const script = await readFile(join(root, "scripts/publish-verified-level6.mjs"), "utf8");
  assert.match(script, /sourceSha256/);
  assert.match(script, /needsVisualReview/);
  assert.match(script, /questionEvidence/);
  assert.match(script, /validateQuizBank/);
  assert.match(script, /actual Learning PDF page total mismatch|Actual Learning PDF page total mismatch/);
  assert.match(script, /--write/);
});
