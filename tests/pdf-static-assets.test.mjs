import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, openSync, readSync, closeSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const registry = readFileSync(resolve(root, "src/data/pdfActivityManuals.ts"), "utf8");
const acceleration = readFileSync(resolve(root, "src/data/accelerationCarManual.ts"), "utf8");
const urlSource = readFileSync(resolve(root, "src/data/staticPdfUrl.ts"), "utf8");

test("Level 1–3 original PDFs are static assets without duplicate root files", () => {
  const pdfs = readdirSync(resolve(root, "public")).filter(f => f.toLowerCase().endsWith(".pdf"));
  assert.equal(pdfs.length, 172);
  assert.ok(urlSource.includes("encodeURIComponent(filename)"));
  for (const filename of pdfs) {
    const fd = openSync(resolve(root, "public", filename), "r");
    const header = Buffer.alloc(5);
    try { assert.equal(readSync(fd, header, 0, 5, 0), 5); } finally { closeSync(fd); }
    assert.equal(header.toString("ascii"), "%PDF-", filename);
    assert.equal(existsSync(resolve(root, filename)), false, "Duplicate PDF at root: " + filename);
  }
});

test("All Level 1–3 PDF registry URLs reference public files", () => {
  const paths = [...registry.matchAll(/staticPdfUrl\("([^"]+\.pdf)"\)/g)].map(m => m[1]);
  assert.equal(paths.length, 168);
  for (const filename of paths) assert.ok(existsSync(resolve(root, "public", filename)), "Missing PDF: " + filename);
  assert.ok(acceleration.includes('staticPdfUrl("Acceleration car_Building.pdf")'));
  assert.ok(existsSync(resolve(root, "public", "Acceleration car_Building.pdf")));
});
