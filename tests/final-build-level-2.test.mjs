import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const load = path => JSON.parse(read(path));
const audit = load("src/data/finalBuild/level-2-audit.json");
const refs = load("src/data/finalBuild/level-2-references.json");
const checks = load("src/data/finalBuild/level-2-checklists.json");
const syllabus = read("src/data/advancedSyllabus.ts");
const projects = read("src/data/practical.ts");
const manualSource = read("src/data/pdfActivityManuals.ts");
const wixSource = read("src/data/levelOneToThreeWixPdfUrls.ts");
const history = load("reports/building-english-levels1-4-wix-links-20261119.json");
const wixMatch = wixSource.match(/export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\\{[\\s\\S]*?\\});/);
assert.ok(wixMatch, "Wix registry must be parseable");
const wix = JSON.parse(wixMatch[1]);
const variants = audit.variants;

test("59 official Level 2 syllabus projects reconcile with 60 registered variants", () => {
  const m = syllabus.match(/export const ADVANCED_SYLLABUS = (\\{[\\s\\S]*?\\}) as const;/);
  assert.ok(m);
  const official = JSON.parse(m[1])["2"];
  assert.equal(official.reduce((s, category) => s + category.length - 1, 0), 59);
  assert.equal(audit.counts.syllabusProjects, 59);
  assert.equal(audit.counts.registeredBuildingProjects, 59);
  assert.equal(audit.counts.registeredManualVariants, 60);
  assert.equal(variants.length, 60);
  assert.equal(new Set(variants.map(v => v.projectId)).size, 59);
  assert.equal(new Set(variants.map(v => v.variantId)).size, 60);
  assert.equal(new Set(variants.map(v => v.source.url)).size, 60);
  assert.deepEqual(variants.filter(v => v.officialName === "See Saw").map(v => v.variantLabel).sort(), ["Version 1", "Version 2"]);
});

test("all source URLs, manual filenames and canonical IDs match exact registries", () => {
  const variables = Object.fromEntries([...manualSource.matchAll(/const (\\w+) = staticPdfUrl\\("([^"]+)"\\)/g)].map(m => [m[1], m[2]]));
  const manualNames = new Map([...manualSource.matchAll(/"(level-2-[^"]+)": \\{\\s*id: "[^"]+", title: "[^"]+", url: (\\w+)/g)].map(m => [m[1], variables[m[2]]]));
  for (const v of variants) {
    assert.equal(v.level, 2);
    assert.match(v.projectId, /^level-2-/);
    assert.ok(projects.includes('pdfManualProject("'+v.variantId+'",'), "Unregistered "+v.variantId);
    assert.equal(manualNames.get(v.variantId), v.source.registryFilename);
    assert.equal(wix[v.source.registryFilename], v.source.url);
    assert.match(v.source.url, /^https:\\/\\/[^/]+\\.usrfiles\\.com\\/ugd\\/[a-z0-9_]+\\.pdf$/);
    assert.equal(v.source.type, "registered-building-manual");
    assert.ok(v.officialName && v.category && v.categoryId);
  }
});

test("36 repaired Wix mapping histories are SHA-1 evidence, not fabricated SHA-256", () => {
  const restored = new Map(history.urls.filter(x => x.level === 2).map(x => [x.path.slice(7), x]));
  assert.equal(restored.size, 36);
  for (const v of variants) {
    const recorded = restored.get(v.source.registryFilename);
    if (recorded) {
      assert.equal(v.source.priorEvidence.gitBlobSha1, recorded.approvedGitBlob);
      assert.equal(v.source.url, recorded.updatedUrl);
      assert.match(v.source.priorEvidence.gitBlobSha1, /^[a-f0-9]{40}$/);
    } else {
      assert.equal(v.source.priorEvidence, null);
    }
    if (v.source.sha256 === null) assert.equal(v.status, "blocked");
  }
});

test("blocked records have explicit reasons and never appear in approval lists", () => {
  const approved = variants.filter(v => v.status === "approved");
  const blocked = variants.filter(v => v.status === "blocked");
  assert.equal(audit.counts.approved, approved.length);
  assert.equal(audit.counts.blocked, blocked.length);
  assert.equal(audit.counts.unresolved, variants.length-approved.length-blocked.length);
  const refIds = new Set(refs.references.map(x=>x.variantId));
  const checklistIds = new Set(checks.checklists.map(x=>x.variantId));
  for (const v of blocked) {
    assert.ok(v.blockedReason.length > 25);
    assert.ok(!refIds.has(v.variantId));
    assert.ok(!checklistIds.has(v.variantId));
    assert.equal(v.validation.pass1, false);
    assert.equal(v.validation.pass2, false);
  }
});

function webpDimensions(buffer) {
  assert.equal(buffer.toString("ascii",0,4),"RIFF");
  assert.equal(buffer.toString("ascii",8,12),"WEBP");
  const kind=buffer.toString("ascii",12,16);
  if(kind==="VP8X") return [buffer.readUIntLE(24,3)+1,buffer.readUIntLE(27,3)+1];
  if(kind==="VP8L") return [1 + (((buffer[22]&0x3f)<<8)|buffer[21]),1+(((buffer[24]&15)<<10)|(buffer[23]<<2)|((buffer[22]&0xc0)>>6))];
  if(kind==="VP8 ") return [buffer.readUInt16LE(26)&0x3fff,buffer.readUInt16LE(28)&0x3fff];
  throw Error("Unsupported WebP: "+kind);
}

test("every future approval requires image bytes, dimensions, SHA-256, two passes and five cited questions", () => {
  const byRef = new Map(refs.references.map(x=>[x.variantId,x]));
  const byCheck = new Map(checks.checklists.map(x=>[x.variantId,x]));
  for (const v of variants.filter(x=>x.status==="approved")) {
    assert.match(v.source.sha256,/^[0-9a-f]{64}$/);
    assert.ok(Number.isInteger(v.source.pageCount)&&v.source.pageCount>0);
    assert.equal(v.validation.pass1,true);
    assert.equal(v.validation.pass2,true);
    const ref=byRef.get(v.variantId);
    assert.ok(ref&&ref.approved===true);
    assert.equal(ref.sourceSha256,v.source.sha256);
    const path="public/final-build/level-2/"+v.image.filename;
    assert.ok(existsSync(new URL(path,root)),"Missing "+path);
    const [width,height]=webpDimensions(readFileSync(new URL(path,root)));
    assert.equal(width,v.image.width);
    assert.equal(height,v.image.height);
    assert.ok(width>=320&&height>=200);
    const items=byCheck.get(v.variantId)?.questions;
    assert.equal(items?.length,5);
    assert.equal(new Set(items.map(q=>q.text)).size,5);
    for(const q of items) {
      assert.ok(q.text.length>12&&q.evidenceNote.length>15);
      assert.ok(Number.isInteger(q.pdfPage)&&q.pdfPage>=1&&q.pdfPage<=v.source.pageCount);
    }
  }
});

test("Level 2 reuses shared exam source; static 4.2-second/15-minute constants survive", () => {
  const route=read("src/routes/practical/level-2.final-build.tsx");
  const exam=read("src/components/practical/FinalBuildExam.tsx");
  assert.match(route,/FinalBuildExam level=\\{2\\}/);
  assert.match(exam,/const SCAN_MS = 4200/);
  assert.match(exam,/const LIMIT_MS = 15 \\* 60 \\* 1000/);
  assert.match(exam,/prev\\.checks\\.filter\\(Boolean\\)\\.length >= 4/);
  assert.match(exam,/window\\.localStorage/);
  assert.match(exam,/Retry Same Robot/);
});

test.todo("INTEGRATION: scanner discovery must draw only approved projects, not merely registered Building PDFs");
test.todo("INTEGRATION: replace generic title-heuristic checklist and dynamic PDF crop with verified variant checklist and WebP");
test.todo("DEVICE QA: verify 320/375/390/430px interactive scanner, timer and results in authorized runtime");
