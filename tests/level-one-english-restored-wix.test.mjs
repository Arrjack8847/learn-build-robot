import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
function mapping(path){
 const source=read(path),match=source.match(/Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
 assert.ok(match,path);
 return JSON.parse(match[1].replace(/,(\s*)}/g,"$1}"));
}
const report=JSON.parse(read("reports/level1-english-cover-restoration-20261124.json"));
const cleaned=mapping("src/data/levelOneBuildingCleanStatus.ts");
const direct=mapping("src/data/levelOneToThreeWixPdfUrls.ts");
test("English-restored Level 1 covers use eight hash-checked Wix PDFs",()=>{
 assert.equal(report.manuals.length,8);
 assert.equal(Object.keys(cleaned).length,43);
 assert.equal(Object.keys(direct).length,304);
 assert.equal(report.sourceVerification.originalAssemblyPagesPixelIdentical,147);
 assert.equal(report.wixVerification.byteForByteSha256Matches,8);
 for(const file of report.manuals){
  assert.equal(cleaned[file.filename],file.url);
  assert.equal(direct[file.filename],file.url);
  assert.match(file.url,/^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/78042f_[a-f0-9]+\.pdf$/i);
  assert.match(file.sha256,/^[a-f0-9]{64}$/);
  assert.equal(file.wixReady,true);
  assert.equal(file.sha256Verified,true);
  assert.equal(file.pages-1,file.unchangedInteriorPages);
 }
});
test("Four pictorial manuals retain original valid Wix URLs",()=>{
 const untouched=report.sourceVerification.unchangedEnglishPictorialManuals;
 assert.equal(untouched.length,4);
 for(const filename of untouched){
  assert.ok(direct[filename],filename);
  assert.ok(!report.manuals.some(file=>file.filename===filename));
 }
});
