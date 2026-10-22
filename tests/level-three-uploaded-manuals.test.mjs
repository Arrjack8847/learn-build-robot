import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const syllabusSource = read("src/data/advancedSyllabus.ts");
const match = syllabusSource.match(/export const ADVANCED_SYLLABUS = ([\\s\\S]*?) as const;/);
assert.ok(match, "Official syllabus catalog is required");
const syllabus = JSON.parse(match[1])["3"];
const manualRegistry = read("src/data/pdfActivityManuals.ts");
const practical = read("src/data/practical.ts");
const route = read("src/routes/practical/levels.$levelNumber.$categoryId.tsx");
const catalog = [
  [
    "level-3-clip-robot",
    "Clip robot_Building.pdf",
    "action-oriented",
    "Clip robot"
  ],
  [
    "level-3-cycle-sport-basic",
    "3. Cycle Sport-Basic Building Manual.pdf",
    "action-oriented",
    "Cycle Sport"
  ],
  [
    "level-3-cycle-sport-optimized",
    "3. Cycle Sport-Optimized Building Manual.pdf",
    "action-oriented",
    "Cycle Sport"
  ],
  [
    "level-3-automatic-seesaw",
    "24. Automatic Seesaw -Building Manual.pdf",
    "automation-security",
    "Automatic Seesaw"
  ],
  [
    "level-3-security-door",
    "Security door_Building.pdf",
    "automation-security",
    "Security door"
  ],
  [
    "level-3-smart-door",
    "Smart door_Building.pdf",
    "automation-security",
    "Smart door"
  ],
  [
    "level-3-following-robot",
    "Following Robot_Building.pdf",
    "autonomous-navigation-ranging",
    "Following Robot"
  ],
  [
    "level-3-obstacle-avoidance-robot-1",
    "Obstacle Avoidance Robot 1_Building.pdf",
    "autonomous-navigation-ranging",
    "Obstacle Avoidance Robot 1"
  ],
  [
    "level-3-sunflower",
    "Sunflower.pdf",
    "biomimicry-stimulus-response",
    "Sunflower"
  ],
  [
    "level-3-electric-bulldozer",
    "23.Electric Bulldozer -Building Manual.pdf",
    "characters-structures",
    "Electric Bulldozer"
  ],
  [
    "level-3-electric-fan-characters-structures",
    "05.Electric Fan-Building Manual.pdf",
    "characters-structures",
    "Electric Fan"
  ],
  [
    "level-3-safe",
    "15.Safe -Building Manual.pdf",
    "characters-structures",
    "Safe"
  ],
  [
    "level-3-smart-trash-bin",
    "20.Smart Trash Bin-Building Manual.pdf",
    "characters-structures",
    "Smart Trash Bin"
  ],
  [
    "level-3-lifting-maintenance-vehicle",
    "Lifting Maintenance Vehicle.pdf",
    "construction-industry",
    "Lifting Maintenance Vehicle"
  ],
  [
    "level-3-automated-guided-vehicle",
    "24.Automated Guided Vehicle-Building Manual.pdf",
    "display-movement",
    "Automated Guided Vehicle"
  ],
  [
    "level-3-race-walking-basic",
    "1. Race Walking - Basic Building Manual.pdf",
    "display-movement",
    "Race Walking"
  ],
  [
    "level-3-race-walking-optimized",
    "1. Race Walking - Optimized Building Manual.pdf",
    "display-movement",
    "Race Walking"
  ],
  [
    "level-3-race-walking-optimized-ratchet",
    "1. Race Walking - Optimized Building Manual - Added Ratchet.pdf",
    "display-movement",
    "Race Walking"
  ],
  [
    "level-3-bumper-car-foundational-robots",
    "Bumper car_Building.pdf",
    "foundational-robots",
    "Bumper car"
  ],
  [
    "level-3-disinfection-lamp",
    "13.Disinfection Lamp-Building Manual.pdf",
    "illumination-signals",
    "Disinfection Lamp"
  ],
  [
    "level-3-light-sensitive-curtains",
    "14.Light-sensitive Curtains -Building Manual.pdf",
    "illumination-signals",
    "Light-sensitive Curtains"
  ],
  [
    "level-3-bumper-car-interactive-mechanisms",
    "Bumper car_Building.pdf",
    "interactive-mechanisms",
    "Bumper car"
  ],
  [
    "level-3-anti-fall-robot",
    "11.Anti-fall Robot-Building Manual.pdf",
    "interactive-systems",
    "Anti-fall Robot"
  ],
  [
    "level-3-automatic-door",
    "17.Automatic Door -Building Manual.pdf",
    "interactive-systems",
    "Automatic Door"
  ],
  [
    "level-3-juicer-machine",
    "06..Juicer Machine-Building Manual.pdf",
    "interactive-systems",
    "Juicer Machine"
  ],
  [
    "level-3-washing-machine",
    "08.Washing Machine-Building Manual.pdf",
    "interactive-systems",
    "Washing Machine"
  ],
  [
    "level-3-electronic-scale",
    "Electronic scale.pdf",
    "manipulators",
    "Electronic scale"
  ],
  [
    "level-3-gyro-transmitter",
    "Gyro transmitter_Building.pdf",
    "manipulators",
    "Gyro transmitter"
  ],
  [
    "level-3-electric-fan-mechanisms-and-concepts",
    "05.Electric Fan-Building Manual.pdf",
    "mechanisms-and-concepts",
    "Electric fan"
  ],
  [
    "level-3-biting-monster",
    "Biting Monster.pdf",
    "sensors",
    "Biting Monster"
  ],
  [
    "level-3-electric-gyro-launcher",
    "Electric Gyro Launcher.pdf",
    "sensors",
    "Electric Gyro Launcher"
  ],
  [
    "level-3-responder",
    "Responder.pdf",
    "sensors",
    "Responder"
  ],
  [
    "level-3-electric-guitar",
    "10.Electric guitar_Building.pdf",
    "sound-voice-interaction",
    "Electric guitar"
  ],
  [
    "level-3-music-box",
    "29.Music Box -Building Manual.pdf",
    "sound-voice-interaction",
    "Music Box"
  ],
  [
    "level-3-music-doorbell",
    "07.Music Doorbell-Building Manual.pdf",
    "sound-voice-interaction",
    "Music Doorbell"
  ],
  [
    "level-3-smart-audio",
    "Smart Audio_Building.pdf",
    "sound-voice-interaction",
    "Smart Audio"
  ],
  [
    "level-3-sonometer",
    "Sonometer_Building.pdf",
    "sound-voice-interaction",
    "Sonometer"
  ],
  [
    "level-3-sound-level-meter",
    "16.Sound Level Meter -Building Manual.pdf",
    "sound-voice-interaction",
    "Sound Level Meter"
  ],
  [
    "level-3-f1-racing-car",
    "F1 racing car_Building.pdf",
    "vehicles-complex-movers",
    "F1 racing car"
  ],
  [
    "level-3-long-lived-turtle",
    "11. The Long-lived Turtle - Basic Building Manual.pdf",
    "vehicles-complex-movers",
    "Long-Lived Turtle"
  ]
];
const normalize = value => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

test("Level 3 preserves all 20 categories and 48 official syllabus entries", () => {
  assert.equal(syllabus.length, 20);
  assert.equal(syllabus.reduce((count, row) => count + row.length - 1, 0), 48);
});

test("Level 3 registers 40 independent original-source PDF lessons across 37 syllabus activities", async () => {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const ids = new Set(), keys = new Set(), activities = new Set(), checkedFiles = new Set();
  for (const [id, filename, category, title] of catalog) {
    assert.ok(!ids.has(id), "Duplicate project ID " + id);
    ids.add(id);
    assert.ok(manualRegistry.includes('"'+ id + '": {'), "Unregistered source " + id);
    assert.ok(manualRegistry.includes('../../' + filename + '?url'), "Missing source import " + filename);
    const key = id + "-manual-complete";
    assert.ok(!keys.has(key), "Duplicate progress key " + key);
    keys.add(key);
    assert.ok(manualRegistry.includes('completionStepId: "' + key + '"'));
    assert.ok(practical.includes('pdfManualProject("' + id + '", "' + title + '",'), "Missing practical project " + id);
    assert.ok(practical.includes('"' + category + '", 3)'), "Wrong Level 3 category " + id);
    const syllabusRow = syllabus.find(row => normalize(row[0]) === category);
    assert.ok(syllabusRow?.slice(1).some(entry => normalize(entry.replace(/\\.(pdf|pptx)$/i,"")) === normalize(title)),
      "Original syllabus placement mismatch: " + id);
    activities.add(category + ":" + normalize(title));
    if (!checkedFiles.has(filename)) {
      checkedFiles.add(filename);
      const data = readFileSync(new URL("../" + filename, import.meta.url));
      assert.equal(data.subarray(0, 5).toString("ascii"), "%PDF-", "Not a PDF: " + filename);
      const task = getDocument({data: new Uint8Array(data)});
      const document = await task.promise;
      try { assert.ok(document.numPages > 0, "No PDF pages: " + filename); }
      finally { await task.destroy(); }
    }
  }
  assert.equal(ids.size, 40);
  assert.equal(activities.size, 37);
  assert.equal(checkedFiles.size, 38);
});

test("Cycle Sport has two choices and Race Walking has three; existing See Saw stays intact", () => {
  for (const id of ["level-3-cycle-sport-basic","level-3-cycle-sport-optimized",
    "level-3-race-walking-basic","level-3-race-walking-optimized","level-3-race-walking-optimized-ratchet",
    "level-2-see-saw-v1","level-2-see-saw-v2"]) {
    assert.ok(route.includes('projectId: "' + id + '"'), "Missing version button " + id);
  }
  assert.ok(route.includes('versions.map(version =>'));
  assert.ok(route.includes('versions.length ? ('));
  assert.ok(route.includes("manualVersionChoices"));
  assert.ok(route.includes("project.level === level && project.categoryId === category.id"));
});

test("Unavailable or ambiguous Level 3 manuals are not falsely marked ready to build", () => {
  const absent = [
    ["advanced-navigation-control","Super Trajectory Robot 1"],
    ["biomimicry","Stag beetle"],
    ["foundational-robots","Line patrol car"],
    ["illumination-signals","Flashlight Sensor"],
    ["machines-mechanisms","Money detector"],
    ["machines-mechanisms","Parking gate"],
    ["manipulators","Blood bank Centrifuge"],
    ["mechanisms-and-concepts","Drawbridge"],
    ["mechanisms-and-concepts","Fire ladder"],
    ["mechanisms-and-concepts","Sign"],
    ["vehicles-motion","Lunar Rover"],
  ];
  for (const [category,title] of absent) {
    assert.ok(!catalog.some(([, , cat, name]) => cat===category && normalize(name)===normalize(title)),
      "Unverified source accidentally assigned to " + title);
  }
  assert.equal(absent.length, 11);
  assert.ok(!manualRegistry.includes("../../Drawbridge.pdf?url"), "Zero-byte PDF must not be linked");
  assert.ok(practical.includes('pdfManualProject("level-3-bumper-car-foundational-robots"'));
  assert.ok(practical.includes('pdfManualProject("level-3-bumper-car-interactive-mechanisms"'));
});
