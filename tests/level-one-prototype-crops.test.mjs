import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readJson = path => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const map = readJson("../src/data/levelOnePrototypeCrops.json");
const audit = readJson("../audits/level1-prototype-page-candidates-20261119.json");

test("all 60 Level 1 source manuals have one matching candidate crop", () => {
  assert.equal(map.references.length, 60);
  assert.equal(audit.candidatePages.length, 60);
  const byFile = new Map(map.references.map(x => [x.filename, x]));
  assert.equal(byFile.size, 60);
  for (const source of audit.candidatePages) {
    const entry = byFile.get(source.filename);
    assert.ok(entry, `Missing prototype for ${source.filename}`);
    assert.equal(entry.page, source.page);
    assert.equal(entry.kind, source.kind);
    assert.equal(typeof entry.approved, "boolean", "Approval must be explicit");
    if (entry.approved) {
      assert.ok(entry.approvedAt && entry.approvedBy,
        "Any approved reference must record who verified the crop and when");
    }
    const { x, y, width, height } = entry.crop;
    for (const v of [x, y, width, height]) assert.ok(Number.isFinite(v));
    assert.ok(x >= 0 && y >= 0 && width > 0 && height > 0, entry.filename);
    assert.ok(x + width <= 1 && y + height <= 1, entry.filename);
  }
});

test("Crawl Slowly retains two independent official PDF candidate references", () => {
  const filenames = map.references.filter(x => /Crawl Slowly/.test(x.filename)).map(x => x.filename);
  assert.deepEqual(filenames.sort(), [
    "9. Crawl Slowly - Basic Building Manual.pdf",
    "9. Crawl Slowly - Optimized Building Manual.pdf",
  ]);
});

test("PDF reference viewer displays a crop only and never offers step navigation", () => {
  const component = readFileSync(new URL("../src/components/practical/FinalBuildPrototype.tsx", import.meta.url), "utf8");
  assert.match(component, /document\.getPage\(pageNumber\)/);
  assert.match(component, /viewport\.width \* crop\.x/);
  assert.match(component, /viewport\.height \* crop\.y/);
  assert.doesNotMatch(component, /<iframe|<object|<embed|window\.open|download=/);
});

test("Final Build stays on the same page with the robot-only PDF crop and 15-minute timer", () => {
  const route = readFileSync(new URL("../src/routes/practical/level-1.final-build.tsx", import.meta.url), "utf8");
  assert.match(route, /const canStart = Boolean\(candidate\?\.approved && modelReady && manualUrl\)/);
  assert.match(route, /disabled=\{!canStart\}/);
  assert.match(route, /<FinalBuildPrototype/);
  assert.match(route, /onStatusChange=\{onModelStatus\}/);
  assert.match(route, /Start My 15-Minute Build/);
  assert.match(route, /Test 15-Minute Timer \(review only\)/);
  assert.doesNotMatch(route, /Open Building Studio|mode=building|View Original Building PDF \(Wix\)/);
});

test("Acceleration Car has a dedicated official PDF reference", () => {
  const route = readFileSync(new URL("../src/routes/practical/level-1.final-build.tsx", import.meta.url), "utf8");
  assert.match(route, /ACCELERATION_MANUAL_URL/);
  assert.match(route, /Acceleration car_Building\.pdf/);
});

test("Robot Discovery Scanner replaces carnival wheel without changing equal selection", () => {
  const route = readFileSync(new URL("../src/routes/practical/level-1.final-build.tsx", import.meta.url), "utf8");
  const scanner = readFileSync(new URL("../src/components/practical/FinalBuildScanner.tsx", import.meta.url), "utf8");
  assert.match(route, /FinalBuildScanner/);
  assert.doesNotMatch(route, /<FinalBuildWheel/);
  assert.ok(route.includes("Math.floor(Math.random() * PROJECTS.length)"));
  assert.match(route, /SPIN_DURATION_MS = 4200/);
  assert.ok(route.includes("onClick={discover}"));
  assert.match(route, /Skip animation/);
  assert.match(scanner, /prefers-reduced-motion: reduce/);
  assert.match(scanner, /bsr-scanner-beam/);
});

test("all 35 published English-cleaned Level 1 Building PDFs have Wix-hosted routes", () => {
  const urls = readFileSync(new URL("../src/data/levelOneBuildingCleanStatus.ts", import.meta.url), "utf8");
  const entries = [...urls.matchAll(/^  "([^"]+[.]pdf)": "(https:[^"]+)",?$/gm)];
  assert.equal(entries.length, 35);
  assert.equal(new Set(entries.map(x => x[1])).size, 35);
  assert.ok(entries.every(([, , url]) => url.includes(".usrfiles.com/ugd/") && url.endsWith(".pdf")));
  const mustInclude = [
    "FUNNY CAT.pdf",
    "Ferocious snake.pdf",
    "Shy penguin.pdf",
    "Sled dog.pdf",
    "Athlete.pdf",
    "Basic programming.pdf",
    "Drummer robot.pdf",
    "Sailboat.pdf",
    "The lawn mower.pdf",
    "Car.pdf",
    "Dynamic screen.pdf",
    "Pendulum ride.pdf",
    "Rotating flying chair.pdf",
    "Skating.pdf",
    "The windmill kingdom.pdf",
    "Little Owl.pdf",
    "Hand-cranking Fan.pdf",
    "Oscillating Fan.pdf",
    "First Robot Model.pdf"
  ];
  const names = new Set(entries.map(x => x[1]));
  for (const name of mustInclude) assert.ok(names.has(name), `Missing cleaned PDF: ${name}`);
  const route = readFileSync(new URL("../src/routes/practical/level-1.final-build.tsx", import.meta.url), "utf8");
  assert.ok(route.includes("LEVEL_ONE_CLEANED_BUILDING_WIX_URLS[manualFilename]"));
  assert.doesNotMatch(route, /Cleaned model reference pending|cleanUploadPending|Open Building Studio|mode=building/);
});
