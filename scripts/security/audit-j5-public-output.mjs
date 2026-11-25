#!/usr/bin/env node
// J5 release diagnostic, not an access control mechanism.
// Usage: node scripts/security/audit-j5-public-output.mjs .vercel/output/static
// Pass the actual generated PUBLIC artifact root(s), never the server bundle.
// Not invoked by the ordinary build while the reviewed design is unavailable.
import {lstatSync,readdirSync,readFileSync,existsSync} from "node:fs";
import {resolve,relative,sep} from "node:path";
import {fileURLToPath} from "node:url";
import {gunzipSync,brotliDecompressSync} from "node:zlib";
const TEXT=/\.(?:js|mjs|cjs|json|html|htm|css|map|txt|xml|svg|webmanifest|wasm)$/i;
const DIRECT=/usrfiles(?:\\u002e|\\x2e|\.)com|fe3fa828-9f74-45e8-97f7-8d00cbb7fba0/i;
const MAX=128*1024*1024;
export function auditPublicOutput(roots){
  const findings=[];let scanned=0;
  if(!Array.isArray(roots)||roots.length===0)throw Error("Supply explicit public build directories");
  for(const rootArg of roots){
    const root=resolve(rootArg);
    if(!existsSync(root)||!lstatSync(root).isDirectory()||lstatSync(root).isSymbolicLink())throw Error("Missing or invalid public build root: "+rootArg);
    function walk(file){
      const stat=lstatSync(file),name=relative(root,file).split(sep).join("/");
      const add=kind=>findings.push({root:rootArg,path:name,kind});
      if(stat.isSymbolicLink()){add("SYMLINK_REVIEW_REQUIRED");return;}
      if(stat.isDirectory()){for(const child of readdirSync(file))walk(resolve(file,child));return;}
      if(!stat.isFile()){add("UNSUPPORTED_ENTRY");return;}
      scanned++;
      const logical=name.replace(/\.(gz|br)$/i,"");
      if(/\.pdf$/i.test(logical)){add("PUBLIC_PDF");return;}
      // Check file magic even on oddly named binaries. For compressed text,
      // inspect decompressed bytes. Never silently skip oversized candidates.
      const compressed=/\.(gz|br)$/i.test(name);
      if(stat.size>MAX){add("OVERSIZED_REVIEW_REQUIRED");return;}
      let bytes=readFileSync(file);
      if(compressed){try{bytes=/\.gz$/i.test(name)?gunzipSync(bytes,{maxOutputLength:MAX}):brotliDecompressSync(bytes,{maxOutputLength:MAX});}catch{add("COMPRESSED_REVIEW_REQUIRED");return;}}
      if(bytes.subarray(0,1024).includes(Buffer.from("%PDF-"))){add("PUBLIC_PDF_BYTES");return;}
      if(!TEXT.test(logical))return;
      if(/\.map$/i.test(logical))add("PUBLIC_SOURCE_MAP_REVIEW_REQUIRED");
      if(DIRECT.test(bytes.toString("utf8")))add("DIRECT_WIX_ORIGIN_REFERENCE");
    }
    walk(root);
  }
  if(scanned===0)throw Error("No public artifacts inspected");
  return {scanned,findings,passed:findings.length===0};
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
  try{const report=auditPublicOutput(process.argv.slice(2));console.log(JSON.stringify(report,null,2));process.exitCode=report.passed?0:1;}
  catch(error){console.error(error instanceof Error?error.message:"Audit unavailable");process.exitCode=2;}
}
