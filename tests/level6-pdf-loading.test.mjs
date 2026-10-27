import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const building = read("../src/components/practical/PdfActivityViewer.tsx");
const learning = read("../src/components/practical/LevelOneLearningStudio.tsx");
const root = read("../src/routes/__root.tsx");
const diagnostic = read("../scripts/diagnose-level6-wix.mjs");

test("Wix PDFs use 256 KiB range chunks with streaming defaults preserved", () => {
  for (const source of [building, learning]) {
    assert.match(source, /rangeChunkSize: 256 \* 1024/);
    assert.match(source, /\.usrfiles\.com\//);
    assert.doesNotMatch(source, /disableStream: true|disableRange: true|disableAutoFetch: true/);
  }
});

test("The PDF loading state surfaces download progress and a direct PDF link", () => {
  for (const source of [building, learning]) {
    assert.match(source, /task\.onProgress/);
    assert.match(source, /Downloaded \{/);
    assert.match(source, /Open original PDF in a new tab/);
    assert.match(source, /pdfDebug/);
  }
});

test("Early Wix preconnect and read-only CDN diagnostics are available", () => {
  assert.match(root, /rel: "preconnect"/);
  assert.match(root, /usrfiles\.com/);
  assert.match(diagnostic, /Range: "bytes=0-65535"/);
  assert.match(diagnostic, /response\.status !== 206/);
});
