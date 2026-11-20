/**
 * Read-only Level 1 Wix Learning PDF content audit for an isolated Vercel
 * preview build. Does not modify or upload any PDFs and is not GitHub Actions.
 */
import { readFileSync } from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const registrySource = readFileSync(
  new URL("../../src/data/levelOneToThreeWixPdfUrls.ts", import.meta.url),
  "utf8",
);
const match = registrySource.match(
  /export const levelOneToThreeWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/,
);
if (!match) throw new Error("Level 1 Wix registry not parseable");
const registry = JSON.parse(match[1]);
const selected = Object.entries(registry).filter(([key]) =>
  key.startsWith("Level 1/Learning/"),
);
if (selected.length !== 45) throw new Error("Expected exactly 45 Level 1 Learning entries");

const han = /[\u3400-\u9fff\uf900-\ufaff]/u;
const branding = /Intelligent\s*Storm|智能风暴|智\s*能\s*风\s*暴/i;
let totalPages = 0;
let opened = 0;
let extractedPages = 0;
const failures = [];
const findings = [];
const records = [];

for (const [path, url] of selected) {
  const name = path.split("/").at(-1);
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(40000),
      headers: { Accept: "application/pdf" },
    });
    if (!response.ok) throw new Error("GET HTTP " + response.status);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const validHeader = new TextDecoder().decode(bytes.subarray(0, 5)) === "%PDF-";
    if (!validHeader) throw new Error("Response is not a PDF");
    const loading = getDocument({
      data: bytes,
      isEvalSupported: false,
      disableFontFace: true,
      useSystemFonts: true,
      stopAtErrors: true,
    });
    const pdf = await loading.promise;
    opened++;
    totalPages += pdf.numPages;
    let latinPageCount = 0;
    let chinesePageCount = 0;
    let brandPageCount = 0;
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items.map(item => item.str || "").join(" ");
      extractedPages++;
      if (/[A-Za-z]{3}/.test(text)) latinPageCount++;
      if (han.test(text)) {
        chinesePageCount++;
        findings.push({ file: name, page: pageNumber, kind: "Chinese text", excerpt: text.slice(0, 250) });
      }
      if (branding.test(text)) {
        brandPageCount++;
        findings.push({ file: name, page: pageNumber, kind: "Unwanted branding", excerpt: text.slice(0, 250) });
      }
      page.cleanup();
    }
    records.push({ file: name, pages: pdf.numPages, pagesWithEnglish: latinPageCount, pagesWithChinese: chinesePageCount, pagesWithBranding: brandPageCount });
    await pdf.destroy();
    console.log("[L1-PDFQA] OK " + name + ": " + records.at(-1).pages + " pages; Chinese="+chinesePageCount+"; branding="+brandPageCount);
  } catch(error) {
    failures.push({ file: name, reason: String(error) });
    console.error("[L1-PDFQA] FAIL " + name + ": " + String(error));
  }
}
const summary = {
  source: "Vercel build with pdfjs-dist",
  registered: selected.length,
  opened,
  totalPages,
  extractedPages,
  filesWithChineseText: new Set(findings.filter(f=>f.kind === "Chinese text").map(f=>f.file)).size,
  filesWithUnwantedBranding: new Set(findings.filter(f=>f.kind === "Unwanted branding").map(f=>f.file)).size,
  failures,
  findings: findings.slice(0, 100),
};
console.log("[L1-PDFQA] FINAL " + JSON.stringify(summary));
if (opened !== 45 || failures.length || findings.length || extractedPages !== totalPages) {
  process.exitCode = 1;
}
