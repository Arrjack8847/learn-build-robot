import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const read = (p) => readFileSync(resolve(root, p), "utf8");
const audit = JSON.parse(read("src/data/finalBuild/level-5-audit.json"));
const refs = JSON.parse(read("src/data/finalBuild/level-5-references.json"));
const lists = JSON.parse(read("src/data/finalBuild/level-5-checklists.json"));
const source = read("src/data/levelFiveSixContent.ts");
const wixText = read("src/data/levelFiveWixPdfUrls.ts");
const sourceMatch = source.match(/export const levelFiveSixLessons: readonly AdvancedLessonAsset\[\] = \[([\s\S]*?)\n\];/);
const wixMatch = wixText.match(/export const levelFiveWixPdfUrls: Readonly<Record<string, string>> = \{([\s\S]*?)\n\};/);
assert.ok(sourceMatch && wixMatch, "Canonical Level 5 registrations must remain parseable");
const lessons = JSON.parse("[" + sourceMatch[1] + "]").filter(x => x.level === 5);
const wix = JSON.parse("{" + wixMatch[1].replace(/,\s*$/, "") + "}");
const manualVariants = lessons.flatMap(p =>
  [["basic",p.buildingBasic],["optimized",p.buildingOptimized]]
    .filter(([,path]) => Boolean(path))
    .map(([variant,path]) => ({id:p.id+(variant==="optimized"?":optimized":""),path,project:p,variant}))
);
const mapById = new Map(audit.variants.map(x => [x.variantId,x]));
const refById = new Map(refs.items.map(x => [x.variantId,x]));
const checklistById = new Map(lists.items.map(x => [x.variantId,x]));

function webpSize(path) {
  const bytes=readFileSync(path);
  assert.equal(bytes.toString("ascii",0,4),"RIFF");
  assert.equal(bytes.toString("ascii",8,12),"WEBP");
  const chunk=bytes.toString("ascii",12,16);
  if(chunk==="VP8X")return {width:1+bytes.readUIntLE(24,3),height:1+bytes.readUIntLE(27,3)};
  if(chunk==="VP8L") {
    const bits=bytes.readUInt32LE(21);
    return {width:1+(bits&0x3fff),height:1+((bits>>>14)&0x3fff)};
  }
  if(chunk==="VP8 ")return {width:bytes.readUInt16LE(26)&0x3fff,height:bytes.readUInt16LE(28)&0x3fff};
  throw new Error("Unsupported WebP chunk "+chunk+" for "+path);
}

test("Level 5 inventory and 45 variants reconcile to official source paths",()=>{
  assert.equal(lessons.length,51);
  assert.equal(lessons.filter(p=>!p.buildingBasic&&!p.buildingOptimized).length,8);
  assert.equal(new Set(manualVariants.map(x=>x.project.id)).size,43);
  assert.equal(manualVariants.length,45);
  assert.equal(new Set(manualVariants.map(x=>x.path)).size,45);
  assert.equal(audit.variants.length,45);
  assert.equal(refs.items.length,45);
  assert.equal(lists.items.length,45);
  assert.equal(mapById.size,45);
  assert.equal(refById.size,45);
  assert.equal(checklistById.size,45);
  for(const item of manualVariants) {
    const row=mapById.get(item.id);
    assert.ok(row, "Missing "+item.id);
    assert.equal(row.registeredSourcePath,"public/"+item.path);
    assert.equal(row.wixBuildingPdfUrl,wix[item.path]);
    assert.match(row.registeredGitObject.gitBlobSha1,/^[0-9a-f]{40}$/);
    assert.match(row.hostedPdfVerification.sha256,/^[0-9a-f]{64}$/);
    assert.ok(Number.isSafeInteger(row.hostedPdfVerification.pageCount)&&row.hostedPdfVerification.pageCount>0);
    assert.ok(row.registeredGitObject.sizeBytes>0);
    assert.equal(row.projectTitle,item.project.title);
    assert.ok(refById.has(item.id) && checklistById.has(item.id));
  }
  assert.equal(audit.studentScannerSelectableVariantIds.length,audit.counts.approvedVariants);
  assert.equal(audit.counts.approvedVariants,41);
  assert.equal(audit.counts.blockedVariants,4);
  assert.equal(refs.renderableApprovedReferences.length,41);
  assert.equal(lists.approvedChecklists.length,41);
});

test("five repaired Wix URLs still use the authoritative repaired mapping",()=>{
  const repairs=JSON.parse(read("reports/level5-building-english-wix-links-20261119.json"));
  const newer=JSON.parse(read("reports/level5-6-building-independent-verification-20261120.json"))
    .verifiedNewCorrections.find(c=>c.level===5&&c.name==="Chairoplane");
  assert.equal(repairs.changes.length,5);
  assert.ok(newer);
  for(const repair of repairs.changes){
    const path=repair.path.replace(/^public\//,"");
    assert.equal(wix[path],repair.path===newer.path?newer.newWixUrl:repair.newWixUrl);
  }
});

test("Basic and Optimized variants stay separate",()=>{
  for(const title of ["Curling Game","Crack Shot"]){
    const variants=audit.variants.filter(x=>x.projectTitle===title);
    assert.equal(variants.length,2,title);
    assert.equal(new Set(variants.map(x=>x.registeredSourcePath)).size,2,title);
    assert.ok(variants.some(x=>x.variant==="basic"));
    assert.ok(variants.some(x=>x.variant==="optimized"));
  }
});

test("all approval records are fail-closed until complete evidence exists",()=>{
  const sha256=/^[0-9a-f]{64}$/;
  const approvedIds=[];
  for(const record of audit.variants){
    const img=refById.get(record.variantId);
    const check=checklistById.get(record.variantId);
    assert.ok(img && check);
    if(!record.release.approved){
      assert.equal(record.release.status,"blocked");
      assert.equal(img.approved,false);
      assert.equal(check.approved,false);
      assert.equal(img.imagePath,null);
      assert.ok(img.page === null || Number.isInteger(img.page));
      assert.equal(check.questions.length,0);
      continue;
    }
    approvedIds.push(record.variantId);
    assert.equal(img.approved,true);
    assert.equal(check.approved,true);
    assert.equal(img.sourceUrl,record.wixBuildingPdfUrl);
    assert.match(img.pdfSha256,sha256);
    assert.match(img.imageSha256,sha256);
    assert.ok(Number.isSafeInteger(img.page)&&img.page>=1);
    assert.ok(Array.isArray(img.normalizedCrop)&&img.normalizedCrop.length===4);
    const [x,y,w,h]=img.normalizedCrop;
    assert.ok([x,y,w,h].every(v=>typeof v==="number"&&Number.isFinite(v)));
    assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=1&&y+h<=1);
    assert.ok(img.reviewer&&img.independentValidator);
    assert.equal(check.questions.length,5);
    const ids=new Set();
    for(const question of check.questions){
      assert.ok(typeof question.text==="string"&&question.text.trim().length>12);
      assert.ok(Number.isInteger(question.evidencePage)&&question.evidencePage>0);
      assert.equal(question.sourcePdfSha256,img.pdfSha256);
      assert.ok(question.id&&!ids.has(question.id));
      ids.add(question.id);
    }
    assert.ok(img.imagePath.startsWith("public/final-build/level-5/"));
    assert.ok(img.imagePath.endsWith(".webp") && existsSync(resolve(root,img.imagePath)));
    assert.deepEqual(Object.values(webpSize(resolve(root,img.imagePath))),img.dimensions);
    assert.equal(createHash("sha256").update(readFileSync(resolve(root,img.imagePath))).digest("hex"),img.imageSha256);
    assert.equal(record.hostedPdfVerification.sha256,img.pdfSha256);
    assert.equal(record.hostedPdfVerification.pageCount>=img.page,true);
  }
  assert.deepEqual([...approvedIds].sort(),[...audit.studentScannerSelectableVariantIds].sort());
  assert.equal(approvedIds.length,audit.counts.approvedVariants);
  assert.equal(lists.items.reduce((sum,item)=>sum+item.questions.length,0),205);
  assert.equal(audit.counts.blockedVariants,45-approvedIds.length);
});

test("Level 5 data stays isolated from common Final Build behavior",()=>{
  assert.equal(audit.level,5);
  assert.equal(refs.level,5);
  assert.equal(lists.level,5);
  assert.equal(audit.baseCommitSha,"1fe5c5336d45295e6e3252d0450b662337a1db50");
  assert.equal(audit.sourceValidation.actualHostedPdfBytesReverified,true);
  assert.equal(audit.sourceValidation.sha256ForAllVariants,true);
  assert.equal(audit.sourceValidation.individualFinishedModelVisuallyReviewed,false);
});

