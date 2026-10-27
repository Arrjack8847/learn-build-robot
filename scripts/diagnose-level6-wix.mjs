/**
 * Check whether Wix serves Level 6 PDFs with byte ranges and how quickly the
 * first 64 KiB arrives. Read-only: does not upload files or use an API key.
 *
 * Run: node scripts/diagnose-level6-wix.mjs
 */
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";

const source = readFileSync(new URL("../src/data/levelSixWixPdfUrls.ts", import.meta.url), "utf8");
const match = source.match(/export const levelSixWixPdfUrls: Readonly<Record<string, string>> = (\{[\s\S]*?\});/);
if (!match) throw new Error("Cannot find the Level 6 Wix URL registry.");
const urls = JSON.parse(match[1]);

const samples = [
  "Level 6/Building/Action-Oriented/Gorilla/04.Gorilla-Building Manual.pdf",
  "Level 6/Building/Biomimicry & Stimulus Response/Super Scorpion/16. Super Scorpion - Basic Building Manual.pdf",
  "Level 6/Learning/Sensor-Focused Robots/Smart Camera/22.Smart Camera-Slides.pdf",
];

for (const path of samples) {
  if (!urls[path]) throw new Error("Missing Wix URL: " + path);
  console.log("\n" + path);
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 25000);
  const start = performance.now();
  try {
    const response = await fetch(urls[path], {
      method: "GET",
      headers: { Range: "bytes=0-65535" },
      signal: abort.signal,
      cache: "no-store",
    });
    const headerMs = Math.round(performance.now() - start);
    const headers = response.headers;
    const reader = response.body?.getReader();
    let received = 0;
    let first = "";
    if (reader) {
      while (received < 65536) {
        const { value, done } = await reader.read();
        if (done) break;
        if (first.length < 4096) {
          first += Buffer.from(value.subarray(0, 4096 - first.length)).toString("latin1");
        }
        received += value.byteLength;
      }
      void reader.cancel().catch(() => {});
    }
    console.log("HTTP status:", response.status, "(206 = byte range supported, 200 = full-response fallback)");
    console.log("Time to response headers:", headerMs + " ms");
    console.log("Time to first 64 KiB:", Math.round(performance.now() - start) + " ms");
    console.log("Bytes received:", received);
    for (const name of [
      "content-length", "content-range", "accept-ranges", "cache-control",
      "content-type", "access-control-allow-origin", "access-control-expose-headers",
    ]) console.log(name + ":", headers.get(name) ?? "(not exposed)");
    console.log("Linearized PDF header:", /\/Linearized\s+\d/.test(first) ? "YES" : "NO / not detected");
    if (response.status !== 206) {
      console.log("WARNING: Byte-range GET was not honored; PDF.js may need a complete download.");
    }
  } catch (error) {
    console.log("FAILED:", error instanceof Error ? error.message : String(error));
  } finally {
    clearTimeout(timeout);
    abort.abort();
  }
}
console.log("\nThis is a network diagnostic, not a PDF.js render-speed benchmark.");
