import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createPdfRewriter,j5PrivatePdfPlugin} from "../scripts/j5/private-pdf-build.mjs";
import {lookupPrivatePdf,assignedPdfCount} from "../scripts/j5/pdf-course-catalog.mjs";
const manifest=JSON.parse(readFileSync(new URL("../scripts/j5/pdf-migration-inventory.json",import.meta.url),"utf8"));
test("all 590 primary and eight supplemental source mappings accounted for, no invented migrated bytes",()=>{
 const d=manifest.documents;assert.equal(d.length,598);assert.equal(d.filter(x=>x.sourcePath.startsWith("public/")).length,590);assert.equal(new Set(d.map(x=>x.id)).size,598);assert.equal(new Set(d.map(x=>x.legacyUrl)).size,598);assert.equal(new Set(d.map(x=>x.sourcePath)).size,598);assert.ok(d.every(x=>x.privateObject===null&&x.migrationStatus==="not-migrated"));
});
test("server catalog grants only explicit project associations and leaves unassigned documents blocked",()=>{
 assert.equal(assignedPdfCount,590);
 for(const d of manifest.documents){const row=lookupPrivatePdf(d.id);if(!d.projectIds.length)assert.equal(row,null);else assert.deepEqual(row,{id:d.id,coursePaths:d.projectIds.map(p=>"/projects/"+p)});}
 assert.equal(lookupPrivatePdf("pdf-9999"),null);
});
test("each legacy mapping replaced by exact same-origin ID; unknown origin refused",()=>{
 const rewrite=createPdfRewriter(manifest.documents);
 for(const d of manifest.documents)assert.equal(rewrite(JSON.stringify(d.legacyUrl)),JSON.stringify("/api/dev/j5/pdf/"+d.id));
 assert.throws(()=>rewrite("https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com/ugd/unknown.pdf"),/Unclassified/);
});
test("duplicate document IDs or source URLs refused",()=>{
 const d=manifest.documents[0];assert.throws(()=>createPdfRewriter([d,d]));assert.throws(()=>createPdfRewriter([d,{...d,id:"pdf-9999"}]));
});
test("private validator and root preconnect transform remove legacy origin",()=>{
 const plugin=j5PrivatePdfPlugin();
 const v=plugin.transform("old validator","/repo/src/data/requireWixPdfUrl.ts");
 assert.match(v.code,/api/);assert.doesNotMatch(v.code,/usrfiles/);
 const p=plugin.transform('links: [\n { rel: "preconnect", href: "https://fe3fa828-9f74-45e8-97f7-8d00cbb7fba0.usrfiles.com", crossOrigin: "anonymous" },\n]',"/repo/src/routes/__root.tsx");
 assert.doesNotMatch(p.code,/usrfiles/);
});
