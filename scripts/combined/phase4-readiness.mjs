// Offline, read-only release evidence checks. Never creates policy approval or provider acceptance.
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {assignedPdfIds} from "../j5/pdf-course-catalog.mjs";
const sha=x=>createHash("sha256").update(x).digest("hex");
const hash=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const id=x=>typeof x==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(x);
export function inspectPhase4Evidence({policyText,manifestText}={}){
 const expected=assignedPdfIds(),wanted=new Set(expected);let policy={status:"missing"},manifest={status:"missing",expected:expected.length};
 if(typeof policyText==="string"){
  try{
   const p=JSON.parse(policyText),rows=p.requirements;
   if(!id(p.version)||p.initialLevel!==1||p.progression!=="all-required-and-final-build-v1"||!Array.isArray(rows)||rows.length>2000||rows.some(r=>!r||!["learning","building","quiz","challenge"].includes(r.mode)||!id(r.resourceId)||!Number.isInteger(r.level)||r.level<1||r.level>6||typeof r.title!=="string"||!r.title.trim()||r.title.length>160||["learning","building"].includes(r.mode)&&(!Number.isSafeInteger(r.maxPosition)||r.maxPosition<1||r.maxPosition>10000))||new Set(rows.map(r=>r.mode+":"+r.resourceId)).size!==rows.length)throw Error("INVALID_POLICY");
   const levels=Array.from({length:6},(_,i)=>{const r=rows.filter(x=>x.level===i+1);return {level:i+1,learning:r.filter(x=>x.mode==="learning").length,building:r.filter(x=>x.mode==="building").length,quiz:r.filter(x=>x.mode==="quiz").length,challenge:r.filter(x=>x.mode==="challenge").length};});
   const coverage=levels.every(l=>l.learning>0&&l.building>0&&l.challenge===1);
   policy={status:coverage&&p.approved===true?"declared-approved-structure":"review-required",version:p.version,sha256:sha(policyText),levels};
  }catch{policy={status:"invalid"};}
 }
 if(typeof manifestText==="string"){
  try{
   const m=JSON.parse(manifestText),docs=m.documents;if(m.scope!=="combined-private-pdf-v1"||!Array.isArray(docs)||docs.length>1000)throw Error("INVALID_MANIFEST");
   const found=new Set();for(const d of docs){if(!d||!/^pdf-\d{4}$/.test(d.documentId)||!id(d.version)||!hash(d.sha256)||!Number.isSafeInteger(d.size)||d.size<5||d.size>32*1024*1024||found.has(d.documentId))throw Error("INVALID_MANIFEST");found.add(d.documentId);}
   const missing=expected.filter(x=>!found.has(x)),unexpected=[...found].filter(x=>!wanted.has(x));
   manifest={status:missing.length||unexpected.length?"review-required":"inventory-matched",expected:expected.length,declared:found.size,missing,unexpected,sha256:sha(manifestText)};
  }catch{manifest={status:"invalid",expected:expected.length};}
 }
 return {policy,manifest,securityReview:"NOT_VERIFIED",runtimeTests:"NOT_RUN",providerAcceptance:"NOT_VERIFIED",releaseReady:false};
}
if(process.argv[1]&&new URL(import.meta.url).pathname===process.argv[1]){
 try{
  if(process.env.CODESPACES!=="true")throw Error("Run in the approved Codespaces worktree");
  const [policyPath,manifestPath]=process.argv.slice(2);
  console.log(JSON.stringify(inspectPhase4Evidence({policyText:policyPath?readFileSync(policyPath,"utf8"):undefined,manifestText:manifestPath?readFileSync(manifestPath,"utf8"):undefined}),null,2));
 }catch{console.error("Phase 4 evidence could not be inspected");process.exitCode=1;}
}
