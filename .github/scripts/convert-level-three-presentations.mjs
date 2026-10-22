import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync, rmSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, ".github/level-three-presentations.json"), "utf8"));
const output = path.join(root, "public/learning-slides/level-3");
mkdirSync(output, {recursive: true});

for (const item of manifest.presentations) {
  const source = path.join(root, item.pptx);
  const expected = path.join(output, item.pdf);
  const check = readFileSync(source).subarray(0, 4);
  if (check[0] !== 0x50 || check[1] !== 0x4b) {
    throw new Error(`PowerPoint is not a valid PPTX ZIP: ${item.pptx}`);
  }
  rmSync(expected, {force: true});
  execFileSync("libreoffice", [
    "-env:UserInstallation=file:///tmp/bsr-level3-lo",
    "--headless", "--convert-to", "pdf:impress_pdf_Export",
    "--outdir", output, source
  ], {stdio: "inherit", timeout: 180000});
  if (statSync(expected).size <= 100) throw new Error(`PDF is empty: ${item.pdf}`);
  if (readFileSync(expected).subarray(0,5).toString("ascii") !== "%PDF-") {
    throw new Error(`Conversion is not a PDF: ${item.pdf}`);
  }
  const pdfInfo = execFileSync("pdfinfo", [expected], {encoding: "utf8"});
  const numPages = Number(pdfInfo.match(/^Pages:\s+(\d+)/m)?.[1] ?? 0);
  if (numPages <= 0) throw new Error(`Conversion has no slides: ${item.pdf}`);
  console.log(`Converted ${item.pptx}: ${numPages} slides, ${statSync(expected).size} bytes`);
}
