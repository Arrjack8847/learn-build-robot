// Build-time URL replacement. Never import migration inventory into browser code.
import {readFileSync} from "node:fs";
const origin=/https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf/gi;
export function createPdfRewriter(documents){
 if(!Array.isArray(documents)||documents.length===0)throw Error("Missing J5 PDF migration inventory");
 const urls=new Map(),ids=new Set();
 for(const d of documents){
  if(!/^pdf-\d{4}$/.test(d.id)||ids.has(d.id)||typeof d.legacyUrl!=="string"||!/^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/i.test(d.legacyUrl)||urls.has(d.legacyUrl))throw Error("Invalid J5 PDF migration inventory");
  ids.add(d.id);urls.set(d.legacyUrl,"/api/dev/j5/pdf/"+d.id);
 }
 return function rewrite(source){
  return source.replace(origin,url=>{const replacement=urls.get(url);if(!replacement)throw Error("Unclassified legacy PDF origin in private build");return replacement;});
 };
}
export function j5PrivatePdfPlugin(){
 const manifest=JSON.parse(readFileSync(new URL("./pdf-migration-inventory.json",import.meta.url),"utf8"));
 const rewrite=createPdfRewriter(manifest.documents);
 return {name:"j5-private-pdf-rewrite",enforce:"pre",transform(code,id){
  const path=id.split("?")[0].replace(/\\/g,"/");
  if(!/\/src\/.*\.[cm]?[jt]sx?$/.test(path)||path.includes("/node_modules/"))return null;
  if(path.endsWith("/src/data/requireWixPdfUrl.ts"))return {code:'export function requireWixPdfUrl(path: string, value: string | undefined): string { if (typeof value !== "string" || !/^\\/api\\/dev\\/j5\\/pdf\\/pdf-\\d{4}$/.test(value)) throw new Error("Missing private PDF mapping: " + path); return value; }',map:null};
  let next=rewrite(code);
  if(path.endsWith("/src/routes/__root.tsx"))next=next.replace(/^\s*\{\s*rel:\s*"preconnect",\s*href:\s*"https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com",\s*crossOrigin:\s*"anonymous"\s*\},\s*$/m,"");
  if(path.endsWith("/src/components/practical/PdfActivityViewer.tsx"))next=next.replaceAll('manual.url.includes(".usrfiles.com/")','false');
  return next===code?null:{code:next,map:null};
 }};
}
