import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve, sep } from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(resolve(root,path),"utf8");
const refs = JSON.parse(read("src/data/finalBuild/level-3-references.json"));
const checks = JSON.parse(read("src/data/finalBuild/level-3-checklists.json"));
const audit = JSON.parse(read("src/data/finalBuild/level-3-audit.json"));
const slug = (x) => x.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const syllabus = JSON.parse(read("src/data/advancedSyllabus.ts").match(/export const ADVANCED_SYLLABUS = (\{[\s\S]*?\}) as const;/)[1])["3"];
const projects = [...read("src/data/practical.ts").matchAll(/pdfManualProject\("([^"]+)",\s*"([^"]+)",\s*\d+,\s*"([^"]+)",\s*3(?:,\s*"([^"]+)")?\)/g)].map(m=>({id:m[1],name:m[2],category:m[3],kind:m[4]||"building"}));
const pdf = read("src/data/pdfActivityManuals.ts");
const pdfNames=Object.fromEntries([...pdf.matchAll(/const (\w+) = staticPdfUrl\("([^"]+)"\);/g)].map(m=>[m[1],m[2]]));
const wix=Object.fromEntries([...read("src/data/levelOneToThreeWixPdfUrls.ts").matchAll(/"([^"]+)": "(https:\/\/[^"]+)"/g)].map(m=>[m[1],m[2]]));
const manual=(id)=>{const m=pdf.match(new RegExp('"'+id+'"\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\}'));assert.ok(m,"missing registered manual "+id);return m[1]};
const canonical=[],excluded=[];
for(const [category,...names] of syllabus)for(const source of names){
 const name=source.replace(/\.(pptx|pdf)$/i,"");
 const matching=projects.filter(x=>x.category===slug(category)&&slug(x.name)===slug(name));
 assert.ok(matching.length,"unmatched syllabus project "+name);
 const eligible=matching.filter(x=>x.kind!=="powerpoint"&&!/sourceKind:\s*"powerpoint"/.test(manual(x.id))&&!/learningFallback:\s*true/.test(manual(x.id)));
 if(!eligible.length){excluded.push({name,id:matching[0].id});continue;}
 for(const x of eligible){const variable=manual(x.id).match(/url:\s*(\w+)/)?.[1];const filename=pdfNames[variable];assert.ok(wix[filename]);canonical.push({projectId:matching[0].id,variantId:x.id,filename,url:wix[filename]});}
}
const references=new Map(refs.references.map(x=>[x.variantId,x])),quizzes=new Map(checks.entries.map(x=>[x.variantId,x])),audits=new Map(audit.variants.map(x=>[x.variantId,x]));
test("canonical Level 3 syllabus and manual inventory",()=>{
 assert.equal(syllabus.reduce((sum,cat)=>sum+cat.length-1,0),48);
 assert.equal(canonical.length,42);
 assert.equal(new Set(canonical.map(x=>x.projectId)).size,39);
 assert.equal(new Set(canonical.map(x=>x.url)).size,40);
 assert.equal(excluded.length,9);
 assert.equal(refs.counts.mappedManualVariants,42);
 assert.deepEqual(refs.counts,audit.counts);
});
test("nine known PowerPoint-only activities remain excluded",()=>{
 assert.deepEqual(excluded.map(x=>x.name).sort(),["Super Trajectory Robot 1","Stag beetle","Line patrol car","Money detector","Parking gate","Blood bank Centrifuge","Drawbridge","Fire ladder","Sign"].sort());
 assert.deepEqual(audit.excluded.map(x=>x.projectId).sort(),excluded.map(x=>x.id).sort());
 for(const e of excluded)assert.ok(!references.has(e.id),"ineligible PowerPoint source in approved candidate ledger");
});
test("42 records reconcile with exact Wix URLs, variant IDs, and historic PDF evidence",()=>{
 assert.equal(references.size,42);assert.equal(quizzes.size,42);assert.equal(audits.size,42);
 for(const c of canonical){const r=references.get(c.variantId),a=audits.get(c.variantId),q=quizzes.get(c.variantId);
  assert.ok(r&&a&&q,"missing record "+c.variantId);
  assert.equal(r.projectId,c.projectId);assert.equal(q.projectId,c.projectId);
  assert.equal(r.source.filename,c.filename);assert.equal(r.source.wixUrl,c.url);assert.equal(a.wixUrl,c.url);
  assert.match(c.url,/^https:\/\/[^/]+\.usrfiles\.com\/.+\.pdf$/);
  assert.ok(Number.isInteger(r.source.historicalPageCount)&&r.source.historicalPageCount>0);
  assert.match(r.source.historicalGitBlobSha1,/^[a-f0-9]{40}$/);
 }
});
test("unverified sources and images fail closed; approval requires evidence and actual WebP",()=>{
 const imageRoot=resolve(root,"public/final-build/level-3");
 for(const r of refs.references){const q=quizzes.get(r.variantId),a=audits.get(r.variantId);
  if(!r.approved){assert.equal(r.image.status,"blocked");assert.match(r.status,/^blocked/);assert.match(a.status,/^blocked/);assert.equal(q.status,"blocked");assert.deepEqual(q.questions,[]);continue;}
  assert.match(r.source.pdfSha256,/^[a-f0-9]{64}$/);
  assert.equal(r.source.currentPdfByteStatus,"verified");assert.equal(r.source.englishOnlyStatus,"verified");
  assert.equal(r.reviewerPass1.status,"approved");assert.equal(r.reviewerPass2.status,"approved");
  assert.ok(r.reviewerPass1.reviewer&&r.reviewerPass2.reviewer&&r.reviewerPass1.reviewer!==r.reviewerPass2.reviewer);
  assert.ok(Number.isInteger(r.image.sourcePage)&&r.image.sourcePage>0&&r.image.sourcePage<=r.source.currentPageCount);
  const c=r.image.normalizedCrop;assert.ok(c&&[c.x,c.y,c.width,c.height].every(Number.isFinite));assert.ok(c.x>=0&&c.y>=0&&c.width>0&&c.height>0&&c.x+c.width<=1&&c.y+c.height<=1);
  assert.match(r.image.path,/^public\/final-build\/level-3\/[a-z0-9-]+\.webp$/);
  const path=resolve(root,r.image.path);assert.ok(path.startsWith(imageRoot+sep));assert.ok(existsSync(path));
  const b=readFileSync(path);assert.equal(b.toString("ascii",0,4),"RIFF");assert.equal(b.toString("ascii",8,12),"WEBP");
  assert.equal(createHash("sha256").update(b).digest("hex"),r.image.sha256);
  const tag=b.toString("ascii",12,16);let w,h;
  if(tag==="VP8X"&&b.length>=30){w=b.readUIntLE(24,3)+1;h=b.readUIntLE(27,3)+1;}
  else if(tag==="VP8 "&&b.length>=30){w=b.readUInt16LE(26)&0x3fff;h=b.readUInt16LE(28)&0x3fff;}
  else if(tag==="VP8L"&&b.length>=25){const n=b.readUInt32LE(21);w=(n&0x3fff)+1;h=((n>>>14)&0x3fff)+1;}
  else assert.fail("unrecognized or damaged WebP");
  assert.equal(w,r.image.width);assert.equal(h,r.image.height);assert.ok(w>=160&&h>=160);
  assert.equal(q.status,"approved");assert.equal(q.questions.length,5);
  for(const check of q.questions){assert.ok(check.text?.trim().length>=8);assert.ok(check.evidence?.trim().length>=12);assert.ok(Number.isInteger(check.pdfPage)&&check.pdfPage>0&&check.pdfPage<=r.source.currentPageCount);}
 }
});
test("shared exam architecture is unchanged and preserves student gate",()=>{
 const route=read("src/routes/practical/level-3.final-build.tsx"),exam=read("src/components/practical/FinalBuildExam.tsx");
 assert.match(route,/FinalBuildExam level=\{3\}/);assert.match(exam,/const SCAN_MS = 4200/);
 assert.match(exam,/const LIMIT_MS = 15 \* 60 \* 1000/);
 assert.match(exam,/secureRandomIndex\(pool\.length\)/);
 assert.match(exam,/a\.approved === true/);
 assert.match(exam,/"be-stem-ready-final-build-level-" \+ level/);
 assert.match(exam,/Retry Same Robot/);
 assert.equal(refs.references.filter(x=>x.approved).length,refs.counts.approved);
});
test("browser viewport QA is explicitly not claimed",()=>{
 assert.deepEqual([320,375,390,430],[320,375,390,430]);
 assert.ok(audit.checks.some(x=>x.name==="browser-320-375-390-430"&&x.status==="not-run"));
});
