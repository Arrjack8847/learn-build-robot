import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const read = path => JSON.parse(readFileSync(root + path, "utf8"));
const refs = read("src/data/finalBuild/level-3-references.json");
const checks = read("src/data/finalBuild/level-3-checklists.json");
const pages = read("reports/final-build-level-3-candidate-source-page-summary-20261123.json");
const sourceManifest = read("reports/final-build-level-3-pdf-byte-integrity-20261123.json");
const proposalManifest = read("reports/final-build-level-3-extracted-source-artwork-proposals-20261123.json");
const refMap = new Map(refs.references.map(r=>[r.variantId,r]));
const pageMap = new Map(pages.records.map(r=>[r.variantId,r]));
const sourceMap = new Map(sourceManifest.records.map(r=>[r.id,r]));
test("40 authenticated PDFs have verified SHA256, actual source identity and consistent page counts",()=>{
 assert.equal(sourceManifest.records.length,40);
 for(const source of sourceManifest.records){
  assert.match(source.sha256,/^[a-f0-9]{64}$/);
  assert.equal(source.sourceIdentityVerified,true);
  assert.equal(source.structuralPageCountVerified,true);
 }
 assert.equal(sourceMap.size,40);
});
test("42 registered robot candidates strongly match actual PDF source pages but are NOT independently approved",()=>{
 assert.equal(refs.references.length,42);assert.equal(pageMap.size,42);
 for(const ref of refs.references){
  const p=pageMap.get(ref.variantId);assert.ok(p,ref.variantId);
  const pdf=sourceMap.get(ref.source.wixMediaId);assert.ok(pdf);
  assert.equal(ref.source.pdfSha256,pdf.sha256);
  assert.equal(ref.source.currentPdfByteStatus,"verified");
  assert.ok(p.matchedPage>=1&&p.matchedPage<=ref.source.currentPageCount);
  assert.ok(p.inliers>=14);
  assert.equal(ref.candidateSourcePageEvidence.status,"strong-automated-match-not-independent-artwork-approval");
  assert.equal(ref.approved,false);
 }
});
test("210 unique project-specific draft questions retain five-page-cited evidence and fail closed",()=>{
 assert.equal(checks.entries.length,42);
 const texts=[];
 for(const item of checks.entries){
  const r=refMap.get(item.variantId),p=pageMap.get(item.variantId);
  assert.ok(r&&p);
  assert.equal(item.status,"blocked");
  assert.deepEqual(item.questions,[]);
  assert.equal(item.draftQuestions.length,5);
  for(const [i,q] of item.draftQuestions.entries()){
   assert.equal(q.questionId,item.variantId+"-q"+(i+1));
   assert.equal(q.pdfPage,p.matchedPage);
   assert.equal(q.sourcePdfHash,r.source.pdfSha256);
   assert.ok(q.text.length>25);
   assert.equal(q.independentApprovalStatus,"pending");
   assert.equal(q.status,"draft-not-student-visible");
   texts.push(q.text);
  }
 }
 assert.equal(texts.length,210);assert.equal(new Set(texts).size,210);
 assert.equal(checks.draftQuestionCount,210);assert.equal(checks.approvedQuestionCount,0);
});
test("42 re-extraction proposals are source-derived but blocked pending review and never mapped",()=>{
 assert.equal(proposalManifest.count,42);
 assert.equal(proposalManifest.records.length,42);
 assert.equal(proposalManifest.approved,0);
 for(const p of proposalManifest.records){
  assert.equal(p.sourceAuthentic,true);
  assert.equal(p.completedModelAndCropApproval,false);
  assert.equal(p.status,"staging-review-required");
  assert.ok(p.sourcePage>=1);
  assert.ok(p.width>=160&&p.height>=160);
  assert.match(p.sha256,/^[a-f0-9]{64}$/);
  assert.equal(p.sourcePdfSha256,refMap.get(p.variantId).source.pdfSha256);
 }
});
