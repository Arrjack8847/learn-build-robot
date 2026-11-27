import test from "node:test";
import assert from "node:assert/strict";
import {inspectPhase4Evidence} from "../scripts/combined/phase4-readiness.mjs";
import {assignedPdfIds} from "../scripts/j5/pdf-course-catalog.mjs";
test("readiness cannot mistake declarations for verified approval or acceptance",()=>{
 const p={approved:true,version:"fixture-v1",initialLevel:1,progression:"all-required-and-final-build-v1",requirements:Array.from({length:6},(_,i)=>["learning","building","challenge"].map(mode=>({level:i+1,mode,resourceId:mode+"-"+i,title:"Fixture",maxPosition:10}))).flat()};
 const manifest={scope:"combined-private-pdf-v1",documents:assignedPdfIds().map(documentId=>({documentId,version:"v1",sha256:"a".repeat(64),size:10}))};
 const r=inspectPhase4Evidence({policyText:JSON.stringify(p),manifestText:JSON.stringify(manifest)});
 assert.equal(r.policy.status,"declared-approved-structure");assert.equal(r.manifest.status,"inventory-matched");assert.equal(r.releaseReady,false);
 p.approved=false;manifest.documents.pop();
 const missing=inspectPhase4Evidence({policyText:JSON.stringify(p),manifestText:JSON.stringify(manifest)});
 assert.equal(missing.policy.status,"review-required");assert.equal(missing.manifest.missing.length,1);assert.equal(missing.releaseReady,false);
});
