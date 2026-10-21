import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const catalogSource = read("src/data/advancedSyllabus.ts");
const raw = catalogSource.match(/export const ADVANCED_SYLLABUS = ([\s\S]*?) as const;/)?.[1];
assert.ok(raw, "Original level syllabus catalog must remain available");
const syllabus = JSON.parse(raw)["2"];
const pdfConfig = read("src/data/pdfActivityManuals.ts");
const practical = read("src/data/practical.ts");
const levelRoute = read("src/routes/practical/levels.$levelNumber.$categoryId.tsx");
const pptxConfig = read("src/data/levelTwoPowerPointSources.ts");

const pdfManuals = [
  ["level-2-axe-robot", "Axe robot_Building.pdf", "action-oriented", "Axe robot"],
  ["level-2-batting-robot", "Batting robot_Building.pdf", "action-oriented", "Batting robot"],
  ["level-2-fan-robot", "Fan robot_Building.pdf", "action-oriented", "Fan robot"],
  ["level-2-pirate-ship", "Pirate ship_Building.pdf", "action-oriented", "Pirate ship"],
  ["level-2-push-ups", "Push ups_building.pdf", "action-oriented", "Push ups"],
  ["level-2-rotating-flying-chair", "Rotating flying chair_Building.pdf", "action-oriented", "Rotating flying chair"],
  ["level-2-throwing-robot", "Throwing robot_Building.pdf", "action-oriented", "Throwing robot"],
  ["level-2-bee", "BEE.pdf", "biomimicry", "Bee"],
  ["level-2-chimpanzees", "Chimpanzees.pdf", "biomimicry", "Chimpanzees"],
  ["level-2-mechanical-dog", "Mechanical dog.pdf", "characters-structures", "Mechanical dog"],
  ["level-2-scaling-ladder", "Scaling ladder.pdf", "characters-structures", "Scaling ladder"],
  ["level-2-tower-crane", "Tower crane_Building.pdf", "characters-structures", "Tower crane"],
  ["level-2-crane", "Crane.pdf", "construction-industry", "Crane"],
  ["level-2-fare-gate", "Fare Gate.pdf", "construction-industry", "Fare Gate"],
  ["level-2-forklift", "Forklift.pdf", "construction-industry", "Forklift"],
  ["level-2-hammer-robot", "Hammer robot.pdf", "foundational-robots", "Hammer robot"],
  ["level-2-lucky-turntable", "Lucky turntable.pdf", "foundational-robots", "Lucky turntable"],
  ["level-2-tightrope-walk", "Tightrope walk.pdf", "foundational-robots", "Tightrope walk"],
  ["level-2-manual-flashlight", "Flashlight_Building.pdf", "illumination-signals", "Manual Flashlight"],
  ["level-2-jumping-machine", "Jumping machine_Building.pdf", "interactive-mechanisms", "Jumping machine"],
  ["level-2-dung-beetle", "Dung Beetle.pdf", "machines-mechanisms", "Dung Beetle"],
  ["level-2-mobile-shot", "Mobile Shot.pdf", "machines-mechanisms", "Mobile Shot"],
  ["level-2-rolling-shutter", "Rolling Shutter.pdf", "machines-mechanisms", "Rolling Shutter"],
  ["level-2-track-rickshaw", "Track Rickshaw.pdf", "machines-mechanisms", "Track Rickshaw"],
  ["level-2-car-steering", "Car Steering.pdf", "manipulators", "Car Steering"],
  ["level-2-cliff-walk", "Cliff walk.pdf", "manipulators", "Cliff walk"],
  ["level-2-ferris-wheel", "Ferris wheel.pdf", "manipulators", "Ferris wheel"],
  ["level-2-round-trip-transportation", "Round-trip transportation.pdf", "manipulators", "Round-trip transportation"],
  ["level-2-shift-gears", "Shift gears.pdf", "manipulators", "Shift gears"],
  ["level-2-bridge", "Bridge_Building.pdf", "mechanisms-simulators", "Bridge"],
  ["level-2-mechanisms-simulators-crane", "Crane_.pdf", "mechanisms-simulators", "Crane"],
  ["level-2-door", "Door_Building.pdf", "mechanisms-simulators", "Door"],
  ["level-2-double-beam-crane", "Double beam crane_Building.pdf", "mechanisms-simulators", "Double Beam Crane"],
  ["level-2-gearbox", "Gearbox_Building.pdf", "mechanisms-simulators", "Gearbox"],
  ["level-2-hand-crank", "Hand crank_Building.pdf", "mechanisms-simulators", "Hand crank"],
  ["level-2-spinning-bike", "Spinning bike_Building.pdf", "mechanisms-simulators", "Spinning bike"],
  ["level-2-swing", "Swing_Building.pdf", "mechanisms-simulators", "Swing"],
  ["level-2-treadmill", "Treadmill_Building.pdf", "mechanisms-simulators", "Treadmill"],
  ["level-2-animal-trap", "Animal trap.pdf", "mechanisms-and-concepts", "Animal trap"],
  ["level-2-headlights", "Headlights.pdf", "mechanisms-and-concepts", "Headlights"],
  ["level-2-battery-robot", "Battery robot_Building.pdf", "programming-precise-control", "Battery robot"],
  ["level-2-walking-robot", "Walking Robot.pdf", "sensor-focused-robots", "Walking robot"],
  ["level-2-led-scrolling-screen", "LED Scrolling Screen.pdf", "sensors", "LED Scrolling Screen"],
  ["level-2-led-signboard", "LED Signboard.pdf", "sensors", "LED Signboard"],
];
const powerpointFiles = ["Car Steering.pptx","Cliff walk.pptx","Ferris wheel.pptx","Round-trip transportation.pptx","Shift gears.pptx"];

test("Level 2 retains all 18 categories and all 59 authentic syllabus entries", () => {
  assert.equal(syllabus.length, 18);
  assert.equal(syllabus.reduce((sum, cat) => sum + cat.length - 1, 0), 59);
  assert.ok(levelRoute.includes("project.level === level && project.categoryId === category.id"));
});

test("44 Level 2 PDF building lessons map exactly to nonempty original uploads", async () => {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const seen = new Set();
  const keys = new Set();
  for (const [id, filename, category, title] of pdfManuals) {
    assert.ok(!seen.has(id), "Duplicate Level 2 id " + id);
    seen.add(id);
    const source = readFileSync(new URL("../" + filename, import.meta.url));
    assert.equal(source.subarray(0, 5).toString("ascii"), "%PDF-", filename);
    assert.ok(source.length > 5, "Missing PDF pages: " + filename);
    const task = getDocument({ data: new Uint8Array(source) });
    const document = await task.promise;
    try { assert.ok(document.numPages > 0, "Empty PDF: " + filename); }
    finally { await task.destroy(); }
    assert.ok(pdfConfig.includes("../../" + filename + "?url"), "Missing imported original " + filename);
    assert.ok(pdfConfig.includes('"' + id + '": {'), "Missing manual " + id);
    const key = id + "-manual-complete";
    assert.ok(!keys.has(key), "Duplicate completion " + id);
    keys.add(key);
    assert.ok(pdfConfig.includes('completionStepId: "' + key + '"'));
    assert.ok(practical.includes('pdfManualProject("' + id + '", "' + title + '",'), "Missing practical registration " + id);
    assert.ok(practical.includes('"' + category + '", 2)'), "Missing Level 2 placement " + category);
    const normalize = value => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const row = syllabus.find(cat => normalize(cat[0]) === category);
    assert.ok(row?.slice(1).some(entry => normalize(entry.replace(/\.(pptx|pdf)$/i, "")) === normalize(title)),
      "Project not found in original syllabus category: " + title);
  }
  assert.equal(seen.size, 44);
});

test("5 Level 2 Manipulators PowerPoints retain original files and download links", () => {
  const row = syllabus.find(entry => entry[0] === "Manipulators");
  assert.ok(row);
  for (const filename of powerpointFiles) {
    assert.ok(row.includes(filename), "Missing syllabus item " + filename);
    const bytes = readFileSync(new URL("../" + filename, import.meta.url));
    assert.equal(bytes.subarray(0, 2).toString("ascii"), "PK", "Not a PPTX ZIP: " + filename);
    assert.ok(pptxConfig.includes("../../" + filename + "?url"), "Missing original PPTX " + filename);
    assert.ok(pptxConfig.includes('"' + filename + '":'), "Missing source lookup " + filename);
  }
  assert.match(levelRoute, /Download original PowerPoint/);
  assert.match(levelRoute, /PowerPoint available/);
  assert.match(levelRoute, /pptxUrl \?/);
  assert.ok(levelRoute.includes("liveProject && pptxUrl"), "Manipulator card must offer both source types");
  for (const filename of powerpointFiles) {
    const id = "level-2-" + filename.replace(/\.pptx$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    assert.ok(pdfManuals.some(([projectId, pdf]) => projectId === id &&
      pdf === filename.replace(/\.pptx$/i, ".pdf")), "Missing corresponding original PDF " + filename);
  }
});

test("corrupted and unmatched uploads must not be labeled ready to build", () => {
  for (const filename of ["Automatic window.pdf", "Robot war.pdf", "The treadmill.pdf",
    "Balance.pdf", "Pliers.pdf"]) {
    assert.ok(!pdfConfig.includes("../../" + filename + "?url"), "Invalid/ambiguous source registered " + filename);
  }
  assert.ok(!practical.includes('pdfManualProject("level-2-robot-war"'));
  assert.ok(!practical.includes('pdfManualProject("level-2-automatic-window"'));
  assert.ok(!practical.includes('pdfManualProject("level-2-the-treadmill"'));
});
