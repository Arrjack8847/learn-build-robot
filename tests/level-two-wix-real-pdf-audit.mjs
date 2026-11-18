#!/usr/bin/env node
/**
 * Level 2 real-PDF read-only QA. Not part of production build.
 * Uses the original 43 PDFs from this branch and Wix-hosted cleaned files.
 * Prints actual HTTP/PDF/English results. GitHub Actions not required.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
// PDF.js needs DOMMatrix at module evaluation time, even for text-only parsing.
// This isolated QA worker never renders pixels; browser matrix operations aren't used.
if (typeof globalThis.DOMMatrix === "undefined") {
  globalThis.DOMMatrix = class TextOnlyDOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1;
      this.e = 0; this.f = 0; this.is2D = true;
    }
  };
}
const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

const root = fileURLToPath(new URL("../", import.meta.url));
const registrySource = readFileSync(resolve(root, "src/data/levelOneToThreeWixPdfUrls.ts"), "utf8");
const registryMatch = registrySource.match(
  /export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/
);
assert.ok(registryMatch, "Missing PDF URL registry");
const urls = JSON.parse(registryMatch[1]);
const prefix = "Level 2/Learning/";
const rows = Object.entries(urls).filter(
  ([key]) => key.startsWith(prefix) && !key.endsWith("_Building_Powerpoint.pdf")
);
assert.equal(rows.length, 43);

const KNOWN_COVERS = new Set([
  "Characters & Structures/Tower crane/Tower crane_Powerpoint.pdf",
  "Action-Oriented/Rotating flying chair/Rotating flying chair_Powerpoint.pdf",
  "Interactive Mechanisms/Jumping machine/Jumping machine_Powerpoint.pdf"
]);
const EXCEPTIONS = new Map([
  ["Biomimicry/Chimpanzees.pdf", 13],
  ["Foundational Robots/Hammer robot.pdf", 21],
  ["Foundational Robots/The treadmill.pdf", 17],
  ["Manipulators/Cliff walk.pdf", 11],
  ["Manipulators/Ferris wheel.pdf", 20],
  ["Manipulators/Round-trip transportation.pdf", 14],
  ["Mechanisms and Concepts/Animal trap.pdf", 16],
  ["Mechanisms and Concepts/Headlights.pdf", 13]
]);
const INTRO_RE = /Intelligence\s+Storm\s+is\s+a\s+building\s+block\s+programming\s+robot\s+research/i;
const HAN_RE = /[\u3400-\u9fff\uf900-\ufaff]/g;

async function load(bytes) {
  const task = getDocument({
    data: new Uint8Array(bytes),
    useSystemFonts: true,
    isEvalSupported: false,
    disableFontFace: true,
    verbosity: 0
  });
  return task.promise;
}
async function pageInfo(doc, number) {
  const page = await doc.getPage(number);
  const viewport = page.getViewport({ scale: 1 });
  const content = await page.getTextContent();
  const lines = [];
  let current = "";
  for (const item of content.items) {
    if (typeof item.str !== "string") continue;
    current += item.str;
    if (item.hasEOL) {
      lines.push(current.trim());
      current = "";
    }
  }
  if (current.trim()) lines.push(current.trim());
  const text = lines.join(" ");
  const words = lines.filter(line =>
    !/^\s*(?:(?:Intelligen(?:t|ce)\s+Storm|Smart\s+Storm)(?:[\s()\-–—]*Series)?|BE STEM READY|Learning Series)\s*$/i.test(line)
  ).join(" ").replace(HAN_RE, "").replace(/\s+/g, " ").trim();
  return { width:viewport.width, height:viewport.height, text, words,
    han:(text.match(HAN_RE)??[]).length };
}
async function download(url) {
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(45000),
        headers: { "User-Agent": "BE-STEM-READY-Level2-ReadOnly-QA/1.0" }
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = Buffer.from(await response.arrayBuffer());
      if (data.subarray(0,5).toString("ascii") !== "%PDF-") {
        throw new Error("Response is not a PDF");
      }
      const cors = response.headers.get("access-control-allow-origin");
      return { data, cors, mime:response.headers.get("content-type"), bytes:data.length };
    } catch (error) {
      last = error;
    }
  }
  throw last;
}
async function checkOne([key,url]) {
  const relative = key.slice(prefix.length);
  const original = readFileSync(resolve(root, "public", key));
  assert.equal(original.subarray(0,5).toString("ascii"), "%PDF-");
  const hosted = await download(url);
  const old = await load(original);
  const newer = await load(hosted.data);
  const issues = [];
  let changedEnglish = 0;
  let widthHeightChanges = 0;
  let missingIntro = false;
  let exception = null;
  try {
    if (old.numPages !== newer.numPages) {
      issues.push("Page count changed " + old.numPages + " -> " + newer.numPages);
    }
    const pages = Math.min(old.numPages, newer.numPages);
    for (let i = 1; i <= pages; i++) {
      const a = await pageInfo(old,i);
      const b = await pageInfo(newer,i);
      if (Math.abs(a.width-b.width)>0.1 || Math.abs(a.height-b.height)>0.1) {
        widthHeightChanges++;
      }
      if (a.words !== b.words) {
        changedEnglish++;
        if (issues.length < 4) issues.push("Educational text changed on page " + i +
          " (source: " + a.words.slice(0,110) +
          "; hosted: " + b.words.slice(0,110) + ")");
      }
      if (i === 1 && KNOWN_COVERS.has(relative) &&
          INTRO_RE.test(a.text) && !INTRO_RE.test(b.text)) {
        missingIntro = true;
      }
      if (EXCEPTIONS.get(relative) === i) {
        exception = {
          page:i, sourceChinese:a.han, hostedChinese:b.han,
          retained:a.han > 0 && b.han === a.han
        };
      }
    }
    if (widthHeightChanges > 0) issues.push("Page geometry mismatch: " + widthHeightChanges);
    if (missingIntro) issues.push("Known cover intro English sentence was rewritten");
    const corsOK = hosted.cors === "*" ||
      (hosted.cors?.includes("learn-build-robot") ?? false);
    if (!corsOK) issues.push("Cross-origin PDF.js access not confirmed (CORS: " +
      String(hosted.cors) + ")");
    return {
      path:relative, pages:old.numPages, hostedPages:newer.numPages,
      bytes:hosted.bytes, sha256:createHash("sha256").update(hosted.data).digest("hex"),
      cors:hosted.cors, mime:hosted.mime,
      changedEnglishPages:changedEnglish,
      widthHeightChanges, missingIntro, exception, issues
    };
  } finally {
    await Promise.allSettled([old.destroy(),newer.destroy()]);
  }
}
const results = [];
for (let i=0; i<rows.length; i+=3) {
  const batch = rows.slice(i,i+3);
  const settled = await Promise.allSettled(batch.map(checkOne));
  settled.forEach((res,index) => {
    const relative = batch[index][0].slice(prefix.length);
    if (res.status === "fulfilled") {
      results.push(res.value);
      console.log("CHECKED", results.length + "/43",relative,
        "pages",res.value.pages,"text_changed_pages",res.value.changedEnglishPages,
        "issues",res.value.issues.length);
    } else {
      results.push({path:relative, error:String(res.reason)});
      console.error("FAILED",relative,String(res.reason));
    }
  });
}
const incomplete=results.filter(x=>x.error);
const wrongCounts=results.filter(x=>x.pages!==x.hostedPages);
const textRegressions=results.filter(x=>x.changedEnglishPages>0);
const knownIntro=results.filter(x=>x.missingIntro);
const cjk=results.filter(x=>x.exception).map(x=>({path:x.path,...x.exception}));
const totalPages=results.reduce((n,x)=>n+(x.pages||0),0);
const summary={
  checked:results.length,
  successfullyDownloaded:results.length-incomplete.length,
  originalPages:totalPages,
  contentDifferencesInDocuments:textRegressions.length,
  contentDifferencesInPages:results.reduce((n,x)=>n+(x.changedEnglishPages||0),0),
  pageCountMismatches:wrongCounts.length,
  knownCoverIntroRegressions:knownIntro.map(x=>x.path),
  chineseExceptionPages:cjk,
  inaccessible:incomplete,
  sampleEnglishChanges:textRegressions.slice(0,8).map(x=>({path:x.path,issues:x.issues})),
  allCorsVerified:results.every(x=>x.error===undefined && x.issues.every(i=>!i.startsWith("Cross-origin")))
};
console.log("LEVEL2_REAL_PDF_AUDIT",JSON.stringify(summary));
if (incomplete.length || wrongCounts.length || knownIntro.length || textRegressions.length ||
    results.length!==43 || totalPages!==787 || !summary.allCorsVerified) {
  console.error("LEVEL2_RELEASE_GATE_BLOCKED: Real-PDF integrity or delivery checks failed.");
  process.exitCode = 1;
}
