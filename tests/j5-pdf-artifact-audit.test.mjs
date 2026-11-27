import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,symlinkSync,rmSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {gzipSync,brotliCompressSync} from "node:zlib";
import {auditPublicOutput} from "../scripts/security/audit-j5-public-output.mjs";
function fixture(t){const root=mkdtempSync(join(tmpdir(),"j5-public-"));t.after(()=>rmSync(root,{recursive:true,force:true}));return {root,write:(name,data)=>writeFileSync(join(root,name),data),audit:()=>auditPublicOutput([root])};}
test("private URL and ordinary assets pass",t=>{const f=fixture(t);f.write("bundle.js",'const path="/api/dev/j5/pdf/pdf-0001"');f.write("art.webp","fictional artwork");assert.deepEqual(f.audit(),{scanned:2,findings:[],passed:true});});
test("PDF name and disguised bytes fail",t=>{const f=fixture(t);f.write("manual.pdf","fictional PDF");f.write("art.bin","%PDF-1.7");assert.deepEqual(new Set(f.audit().findings.map(x=>x.kind)),new Set(["PUBLIC_PDF","PUBLIC_PDF_BYTES"]));});
test("compressed origin, escaped host and source maps fail",t=>{const f=fixture(t);f.write("script.js.gz",gzipSync("https://fixture.usrfiles.com/ugd/document.pdf"));f.write("other.js.br",brotliCompressSync("https://fixture.usrfiles.com/ugd/another.pdf"));f.write("escaped.js",String.raw`const u="usrfiles\u002ecom"`);f.write("chunk.js.map","{}");const r=f.audit();assert.equal(r.passed,false);assert.equal(r.findings.filter(x=>x.kind==="DIRECT_WIX_ORIGIN_REFERENCE").length,3);assert.ok(r.findings.some(x=>x.kind==="PUBLIC_SOURCE_MAP_REVIEW_REQUIRED"));});
test("invalid and empty roots fail",t=>{const f=fixture(t);assert.throws(f.audit,/No public artifacts/);assert.throws(()=>auditPublicOutput([join(f.root,"absent")]),/Missing or invalid/);});
test("symlink and invalid compressed artifact fail",t=>{const f=fixture(t);f.write("clean.js","const x=1;");symlinkSync(join(f.root,"clean.js"),join(f.root,"link.js"));f.write("broken.js.gz","not gzip");assert.deepEqual(new Set(f.audit().findings.map(x=>x.kind)),new Set(["SYMLINK_REVIEW_REQUIRED","COMPRESSED_REVIEW_REQUIRED"]));});
