import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const read = p => readFileSync(new URL(p, root), "utf8");
const references = JSON.parse(read("src/data/finalBuild/level-4-references.json"));
const checklists = JSON.parse(read("src/data/finalBuild/level-4-checklists.json"));
const audit = JSON.parse(read("src/data/finalBuild/level-4-audit.json"));
const building = read("src/data/levelFourBuilding.ts");
const urlsSource = read("src/data/levelFourWixPdfUrls.ts");
const syllabusSource = read("src/data/advancedSyllabus.ts");
const sharedRegistry = read("src/data/finalBuildRegistry.ts");
const approvals = JSON.parse(read("src/data/finalBuildApprovals.json"));

function sourceRegistrations() {
  return [...building.matchAll(/\["(level-4-[^"]+)", "([^"]+\.pdf)", "(basic|optimized)"\]/g)]
    .map(([, projectId, relativePath, variant]) => ({
      projectId, relativePath, variant,
      variantId: projectId + (variant === "optimized" ? ":optimized" : "")
    }));
}
function wixMap() {
  const match = urlsSource.match(/export const levelFourWixPdfUrls:[\s\S]*?= (\{[\s\S]*?\});/);
  assert.ok(match, "Wix dictionary must be statically parseable");
  return JSON.parse(match[1]);
}
function syllabusProjects() {
  const match = syllabusSource.match(/export const ADVANCED_SYLLABUS = (\{[\s\S]*?\}) as const;/);
  assert.ok(match, "Syllabus must be statically parseable");
  return JSON.parse(match[1])["4"].flatMap(([category, ...names]) =>
    names.map(raw => ({ category, name: raw.replace(/\.(pdf|pptx)$/i, ""),
      id: "level-4-" + raw.replace(/\.(pdf|pptx)$/i, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    })));
}
const registrations = sourceRegistrations();
const records = references.records;
const byId = new Map(records.map(r => [r.variantId, r]));
const questionsById = new Map(checklists.records.map(r => [r.variantId, r]));
const toFile = p => resolve(new URL(".", root).pathname, p);

test("source registry reconciles exactly 56 / 48 / 50 / 8, with two optimized variants", () => {
  const syllabus = syllabusProjects();
  assert.equal(syllabus.length, 56);
  assert.equal(new Set(syllabus.map(x => x.id)).size, 56);
  assert.equal(registrations.length, 50);
  assert.equal(new Set(registrations.map(x => x.projectId)).size, 48);
  assert.equal(registrations.filter(x => x.variant === "optimized").length, 2);
  const eligible = new Set(registrations.map(x => x.projectId));
  const missing = syllabus.filter(x => !eligible.has(x.id)).map(x => x.id).sort();
  assert.equal(missing.length, 8);
  assert.deepEqual(audit.fallbackProjects.map(x => x.projectId).sort(), missing);
  assert.equal(new Set(audit.fallbackProjects.map(x => x.projectId)).size, 8);
  assert.equal(audit.counts.syllabus, 56);
  assert.equal(audit.counts.buildingSourceProjects, 48);
  assert.equal(audit.counts.buildingSourceVariants, 50);
});

test("each of the 50 records matches its registered canonical ID, Basic/Optimized and exact Wix PDF", () => {
  assert.equal(records.length, 50);
  assert.equal(byId.size, 50);
  const wix = wixMap();
  const syllabus = new Map(syllabusProjects().map(x => [x.id, x]));
  for (const reg of registrations) {
    const rec = byId.get(reg.variantId);
    assert.ok(rec, "Missing variant: " + reg.variantId);
    assert.equal(rec.projectId, reg.projectId);
    assert.equal(rec.variant, reg.variant);
    assert.equal(rec.projectName, syllabus.get(reg.projectId)?.name);
    assert.equal(rec.category, syllabus.get(reg.projectId)?.category);
    const relative = "Level 4/Building/" + reg.relativePath;
    assert.equal(rec.source.repositoryPath, "public/" + relative);
    assert.equal(rec.source.wixUrl, wix[relative]);
    assert.match(rec.source.wixUrl, /^https:\/\/[^/]+\.usrfiles\.com\/ugd\/[^/]+\.pdf$/);
    assert.equal(rec.source.kind, "official-building-registration");
  }
  assert.equal(new Set(records.map(r => r.source.wixUrl)).size, 50);
  for (const id of ["level-4-warrior-with-claws","level-4-dangerous-assassin"]) {
    const base = byId.get(id);
    const optimized = byId.get(id + ":optimized");
    assert.ok(base && optimized);
    assert.notEqual(base.source.wixUrl, optimized.source.wixUrl);
    assert.equal(base.variantLabel, "Basic");
    assert.equal(optimized.variantLabel, "Optimized");
  }
});

test("missing eight projects are blocked, never silently substituted with Learning material", () => {
  const fallbackMatch = building.match(/LEVEL_FOUR_LEARNING_AS_BUILDING_IDS = \[([\s\S]*?)\] as const;/);
  assert.ok(fallbackMatch);
  const fallbackIds = [...fallbackMatch[1].matchAll(/"(level-4-[^"]+)"/g)].map(m => m[1]).sort();
  assert.equal(fallbackIds.length, 8);
  assert.deepEqual(audit.fallbackProjects.map(x => x.projectId).sort(), fallbackIds);
  for (const f of audit.fallbackProjects) {
    assert.match(f.status, /^blocked/);
    assert.ok(!records.some(r => r.projectId === f.projectId));
  }
});

test("source evidence is typed honestly: historical Git SHA-1 does not masquerade as hosted SHA-256", () => {
  for (const r of records) {
    const old = r.source.priorRepositoryOriginal;
    assert.match(old.gitBlobSha1, /^[a-f0-9]{40}$/);
    assert.ok(Number.isInteger(old.pageCount) && old.pageCount > 0);
    if (r.source.priorRepairedEnglishWix) {
      assert.match(r.source.priorRepairedEnglishWix.gitBlobSha1, /^[a-f0-9]{40}$/);
      assert.ok(r.source.priorRepairedEnglishWix.pageCount > 0);
    }
    if (r.approval.status !== "approved") {
      assert.equal(r.source.hostedPdfSha256, null);
      assert.equal(r.source.hostedPdfPageCount, null);
      assert.equal(r.source.hostedPdfIdentityVerified, false);
      assert.equal(r.source.hostedPdfEnglishVerified, false);
    }
  }
  assert.equal(records.filter(r => r.source.priorRepairedEnglishWix !== null).length, 4);
});

test("checklist records are complete and source-backed only if approved", () => {
  assert.equal(checklists.records.length, 50);
  assert.equal(questionsById.size, 50);
  for (const r of records) {
    const checklist = questionsById.get(r.variantId);
    assert.ok(checklist);
    assert.equal(checklist.projectId, r.projectId);
    assert.equal(checklist.variant, r.variant);
    if (r.approval.status === "approved") {
      assert.equal(checklist.status, "approved");
      assert.equal(checklist.questions.length, 5);
      const unique = new Set();
      for (const q of checklist.questions) {
        assert.equal(q.approved, true);
        assert.ok(typeof q.text === "string" && q.text.trim().length >= 25);
        assert.ok(Array.isArray(q.evidencePages) && q.evidencePages.length > 0);
        assert.ok(q.evidencePages.every(p => Number.isInteger(p) && p > 0 &&
          p <= r.source.hostedPdfPageCount));
        assert.ok(typeof q.verificationNotes === "string" && q.verificationNotes.trim().length > 15);
        unique.add(q.text);
      }
      assert.equal(unique.size, 5);
      assert.ok(checklist.reviewer);
    } else {
      assert.equal(checklist.status, "blocked");
      assert.deepEqual(checklist.questions, []);
    }
  }
});

test("approved references require exact source hash, crop, image hash and actual WebP decoding", () => {
  const approved = records.filter(r => r.approval.status === "approved");
  assert.equal(audit.counts.approvedVariants, approved.length);
  assert.equal(references.summary.approvedVariants, approved.length);
  assert.equal(audit.counts.blockedVariants, 50-approved.length);
  for (const r of approved) {
    assert.equal(r.reference.status, "approved");
    assert.equal(r.source.hostedPdfIdentityVerified, true);
    assert.equal(r.source.hostedPdfEnglishVerified, true);
    assert.match(r.source.hostedPdfSha256, /^[a-f0-9]{64}$/);
    assert.ok(Number.isInteger(r.source.hostedPdfPageCount) && r.source.hostedPdfPageCount > 0);
    assert.ok(Number.isInteger(r.reference.sourcePage) && r.reference.sourcePage > 0 &&
      r.reference.sourcePage <= r.source.hostedPdfPageCount);
    const crop = r.reference.cropNormalized;
    assert.ok(crop && [crop.x,crop.y,crop.width,crop.height].every(Number.isFinite));
    assert.ok(crop.x>=0 && crop.y>=0 && crop.width>0 && crop.height>0 &&
      crop.x+crop.width<=1 && crop.y+crop.height<=1);
    assert.equal(r.reference.independentlyReviewed, true);
    assert.ok(r.approval.reviewer);
    assert.ok(typeof r.reference.path === "string" &&
      r.reference.path.startsWith("public/final-build/level-4/") &&
      r.reference.path.endsWith(".webp"));
    const filename = toFile(r.reference.path);
    assert.ok(existsSync(filename), "Approved WebP file must exist");
    const bytes = readFileSync(filename);
    assert.equal(bytes.toString("ascii",0,4),"RIFF");
    assert.equal(bytes.toString("ascii",8,12),"WEBP");
    assert.equal(createHash("sha256").update(bytes).digest("hex"),r.reference.webpSha256);
    // ffmpeg decodes pixels; checking only RIFF headers would be insufficient.
    execFileSync("ffmpeg",["-nostdin","-v","error","-i",filename,"-f","null","-"],
      {stdio:"pipe",timeout:15000});
    const probe = JSON.parse(execFileSync("ffprobe",
      ["-v","error","-select_streams","v:0","-show_entries","stream=width,height",
       "-of","json",filename],{encoding:"utf8",timeout:15000}));
    assert.equal(probe.streams[0].width,r.reference.width);
    assert.equal(probe.streams[0].height,r.reference.height);
  }
});

test("Level 4 approval state cannot silently authorize unreviewed records", () => {
  const approved = records.filter(r => r.approval.status === "approved");
  const globalApproved = approvals.references.filter(r => r.level === 4 && r.approved === true);
  for (const g of globalApproved) {
    assert.ok(approved.some(r => r.variantId === g.variantId && r.source.wixUrl === g.url),
      "Shared approval contains an unverified Level 4 entry: " + g.variantId);
  }
  if (approved.length === 0) {
    assert.equal(globalApproved.length, 0);
    assert.equal(audit.counts.approvedWebp, 0);
  }
  // This tests the fail-closed Level 4 content set, not the shared scanner's
  // student draw filter; integration must separately fix that known issue.
  assert.equal(approved.length, references.summary.approvedVariants);
  assert.match(sharedRegistry, /getFinalBuildPool/);
});
