// Private server-to-server object gateway contract. No public origin, redirect, or URL supplied by a student.
// A company-owned gateway must be provisioned and independently verified before enabling.
// Request-local verified bytes only; no process-wide cache or public artifact.
import {createHash} from "node:crypto";
import {runtimeEnabled} from "./http-utils.mjs";
import {lookupPrivatePdf} from "../j5/pdf-course-catalog.mjs";
const hash=x=>createHash("sha256").update(x).digest("hex");
const sha=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
const docId=x=>typeof x==="string"&&/^pdf-\d{4}$/.test(x);
const ver=x=>typeof x==="string"&&/^[a-zA-Z0-9_-]{1,128}$/.test(x);
const MAX=32*1024*1024,MANIFEST_MAX=1024*1024;
export function createCombinedPrivateDocuments({env,authorize,request=fetch}){
 if(!runtimeEnabled(env)||env.COMBINED_PRIVATE_PDF_ENABLED!=="1"||env.COMBINED_PRIVATE_PDF_ACCEPTED!=="1"||typeof authorize!=="function")return null;
 try{
  const origin=env.COMBINED_PRIVATE_PDF_ORIGIN,key=env.COMBINED_PRIVATE_PDF_TOKEN,manifestHash=env.COMBINED_PRIVATE_PDF_MANIFEST_SHA256,u=new URL(origin);
  if(u.protocol!=="https:"||u.origin!==origin||u.port||u.username||u.password||!u.hostname.includes(".")||u.hostname==="localhost"||u.hostname.endsWith(".local")||/^[\d.]+$/.test(u.hostname)||u.hostname.includes(":")||typeof key!=="string"||! /^[a-zA-Z0-9_-]{32,256}$/.test(key)||!sha(manifestHash)||Object.entries(env).some(([k,v])=>k!=="COMBINED_PRIVATE_PDF_TOKEN"&&typeof v==="string"&&v===key&&/(KEY|SECRET|ROOT|TOKEN)/.test(k)))return null;
  const verified=new Map();
  let manifest=null;
  async function read(path,limit,signal,contentType){
   const r=await request(origin+path,{method:"GET",headers:{Authorization:"Bearer "+key,Accept:contentType,"Accept-Encoding":"identity"},cache:"no-store",redirect:"error",signal:signal?AbortSignal.any([signal,AbortSignal.timeout(15000)]):AbortSignal.timeout(15000)});
   if(r.status!==200||r.redirected||r.url&&r.url!==origin+path||r.headers.get("content-type")?.split(";")[0]?.trim()!==contentType||!r.body||! /(?:^|,)\s*no-store\s*(?:,|$)/i.test(r.headers.get("cache-control")??""))throw Error("PRIVATE_DOCUMENT_UNAVAILABLE");
   const len=r.headers.get("content-length");if(len!==null&&(!/^\d+$/.test(len)||Number(len)>limit))throw Error("PRIVATE_DOCUMENT_UNAVAILABLE");
   const reader=r.body.getReader(),parts=[];let size=0;
   try{for(;;){const p=await reader.read();if(p.done)break;size+=p.value.byteLength;if(size>limit){await reader.cancel();throw Error("PRIVATE_DOCUMENT_UNAVAILABLE");}parts.push(Buffer.from(p.value));}}finally{reader.releaseLock();}
   if(len!==null&&Number(len)!==size)throw Error("PRIVATE_DOCUMENT_UNAVAILABLE");
   return Buffer.concat(parts,size);
  }
  async function catalog(signal){
   if(manifest)return manifest;
   const bytes=await read("/v1/manifest.json",MANIFEST_MAX,signal,"application/json");
   if(hash(bytes)!==manifestHash)throw Error("MANIFEST_UNVERIFIED");
   const m=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes));
   if(!m||Object.keys(m).length!==2||m.scope!=="combined-private-pdf-v1"||!Array.isArray(m.documents)||m.documents.length>1000)throw Error("MANIFEST_UNVERIFIED");
   const result=new Map();
   for(const d of m.documents){
    if(!d||Object.keys(d).length!==4||!docId(d.documentId)||!lookupPrivatePdf(d.documentId)||!ver(d.version)||!sha(d.sha256)||!Number.isSafeInteger(d.size)||d.size<5||d.size>MAX||result.has(d.documentId))throw Error("MANIFEST_UNVERIFIED");
    result.set(d.documentId,d);
   }
   manifest=result;return manifest;
  }
  async function describe({documentId,signal}){
   if(!docId(documentId))throw Error("PRIVATE_DOCUMENT_UNAVAILABLE");
   const d=(await catalog(signal)).get(documentId);if(!d)throw Error("PRIVATE_DOCUMENT_UNAVAILABLE");
   const bytes=await read("/v1/documents/"+documentId+"/"+d.version,d.size,signal,"application/pdf");
   if(bytes.length!==d.size||bytes.subarray(0,5).toString("ascii")!=="%PDF-"||hash(bytes)!==d.sha256)throw Error("DOCUMENT_UNVERIFIED");
   verified.set(documentId,{d,bytes});
   return {...d,private:true,verified:true};
  }
  async function readChunk({documentId,version,start,end,signal}){
   const v=verified.get(documentId);
   if(signal?.aborted||!v||v.d.version!==version||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||end<start||end>=v.d.size||end-start+1>256*1024)throw Error("PRIVATE_DOCUMENT_UNAVAILABLE");
   return {version,bytes:new Uint8Array(v.bytes.subarray(start,end+1))};
  }
  return {authorize,describe,readChunk};
 }catch{return null;}
}
