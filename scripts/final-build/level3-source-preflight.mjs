#!/usr/bin/env node
/**
 * BE STEM READY — Level 3 source/artwork preflight.
 * Run: node scripts/final-build/level3-source-preflight.mjs
 * Options: --offline (use previously downloaded PDFs), --render-boundaries
 *
 * This is an evidence collection tool, never an approval mechanism.
 * It does not edit student-visible references, checklists or shared scanner code.
 */
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile, mkdir, rename, stat } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const references = JSON.parse(await readFile(join(root, "src/data/finalBuild/level-3-references.json"), "utf8"));
const visual = JSON.parse(await readFile(join(root, "reports/final-build-level-3-visual-candidate-review-20261123.json"), "utf8"));
const reviewByVariant = new Map(visual.records.map((record) => [record.variantId, record]));
const offline = process.argv.includes("--offline");
const renderBoundaries = process.argv.includes("--render-boundaries");
const cacheRoot = join(root, ".cache/final-build/level-3/pdf");
const previewRoot = join(root, ".cache/final-build/level-3/source-page-previews");
const reportPath = join(root, "reports/final-build-level-3-source-preflight.json");
const maxPdfBytes = 60 * 1024 * 1024;

if (references.level !== 3 || references.references.length !== 42 || reviewByVariant.size !== 42) {
  throw new Error("Level 3 reference/visual manifest counts do not match; aborting");
}

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
function verifiedSourceIdentity(source) {
  if (source.kind !== "registered-official-building-pdf" || !source.wixMediaId || !source.wixUrl) {
    throw new Error("Missing registered official Building PDF identity");
  }
  const url = new URL(source.wixUrl);
  if (url.protocol !== "https:" || !url.hostname.endsWith(".usrfiles.com") ||
      !url.pathname.endsWith("/" + source.wixMediaId) || !source.wixMediaId.endsWith(".pdf")) {
    throw new Error("Wix source identity mismatch: " + source.wixUrl);
  }
  if (/learning/i.test(source.filename) || /learning/i.test(source.repositoryPath)) {
    throw new Error("Learning PDF was substituted for a Building source");
  }
}
async function fetchPdf(source, target) {
  if (offline) return readFile(target);
  const signal = AbortSignal.timeout(120000);
  const response = await fetch(source.wixUrl, { signal, redirect: "follow" });
  if (!response.ok) throw new Error("HTTP " + response.status);
  const size = Number(response.headers.get("content-length") || 0);
  if (size > maxPdfBytes) throw new Error("PDF exceeds size cap");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > maxPdfBytes) throw new Error("PDF exceeds size cap");
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") throw new Error("Non-PDF response");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target + ".tmp", bytes);
  await rename(target + ".tmp", target);
  return bytes;
}
async function pageCount(target) {
  const { stdout } = await run("pdfinfo", [target], { timeout: 30000, maxBuffer: 1024 * 1024 });
  const match = stdout.match(/^Pages:\s+(\d+)\s*$/m);
  if (!match) throw new Error("pdfinfo returned no page count");
  return Number(match[1]);
}
async function renderBoundaryPages(target, mediaId, pages) {
  await mkdir(previewRoot, { recursive: true });
  const basename = mediaId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const output = [];
  for (const page of [...new Set([1, pages])]) {
    const prefix = join(previewRoot, basename + "-page-" + page);
    await run("pdftoppm", ["-f", String(page), "-l", String(page),
      "-scale-to", "1100", "-singlefile", "-png", target, prefix],
      { timeout: 90000, maxBuffer: 1024 * 1024 });
    output.push(prefix + ".png");
  }
  return output;
}

const uniqueSources = new Map();
for (const r of references.references) {
  verifiedSourceIdentity(r.source);
  const previous = uniqueSources.get(r.source.wixMediaId);
  if (previous && previous.wixUrl !== r.source.wixUrl) {
    throw new Error("One Wix PDF ID maps to multiple source URLs");
  }
  uniqueSources.set(r.source.wixMediaId, r.source);
}
if (uniqueSources.size !== 40) throw new Error("Expected 40 distinct registered PDF identities");

await mkdir(cacheRoot, { recursive: true });
const sources = [];
for (const [mediaId, source] of uniqueSources) {
  const target = join(cacheRoot, mediaId);
  const entry = { fileId: mediaId, filename: source.filename, url: source.wixUrl,
    expectedHistoricalPageCount: source.historicalPageCount,
    downloadedSha256: null, verifiedCurrentPageCount: null,
    pageCountMatchesHistorical: null, fileSizeBytes: null,
    renderedBoundaryPages: [], status: "blocked", error: null };
  try {
    const bytes = await fetchPdf(source, target);
    if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") throw new Error("Not a PDF");
    entry.fileSizeBytes = bytes.length;
    entry.downloadedSha256 = sha256(bytes);
    entry.verifiedCurrentPageCount = await pageCount(target);
    entry.pageCountMatchesHistorical = entry.verifiedCurrentPageCount === source.historicalPageCount;
    if (!entry.pageCountMatchesHistorical) throw new Error("PDF page count differs from historical registry");
    if (renderBoundaries) entry.renderedBoundaryPages = await renderBoundaryPages(target, mediaId, entry.verifiedCurrentPageCount);
    entry.status = "byte-and-page-preflight-pass-not-visual-approval";
  } catch (error) {
    entry.error = String(error?.message || error);
    entry.status = "blocked";
  }
  sources.push(entry);
  console.log("[level-3 PDF]", mediaId, entry.status);
}

const sourceById = new Map(sources.map((source) => [source.fileId, source]));
const images = [];
for (const r of references.references) {
  const current = sourceById.get(r.source.wixMediaId);
  const review = reviewByVariant.get(r.variantId);
  if (!review || review.registeredSourcePdfId !== r.source.wixMediaId) {
    throw new Error("Visual audit source mismatch: " + r.variantId);
  }
  const path = join(root, "public/final-build/level-3", r.variantId + ".webp");
  const entry = { variantId: r.variantId, sourceFileId: r.source.wixMediaId,
    candidatePath: "public/final-build/level-3/" + r.variantId + ".webp",
    candidateSha256: null, candidateBytes: null, width: null, height: null,
    format: null, decoded: false, visualFlags: review.observedIssues,
    pdfBytesPreflightPass: current?.status === "byte-and-page-preflight-pass-not-visual-approval",
    finishedModelPageVerified: false, approved: false, error: null };
  try {
    const bytes = await readFile(path);
    const image = sharp(bytes, { failOn: "error" });
    const info = await image.metadata();
    if (info.format !== "webp" || !info.width || !info.height ||
        info.width < 160 || info.height < 160) throw new Error("Invalid WebP format/dimensions");
    // metadata alone can succeed on a truncated image. Force a full decode.
    await image.resize({ width: 32, withoutEnlargement: true }).raw().toBuffer();
    entry.format = info.format;
    entry.width = info.width;
    entry.height = info.height;
    entry.candidateBytes = bytes.length;
    entry.candidateSha256 = sha256(bytes);
    entry.decoded = true;
  } catch (error) {
    entry.error = String(error?.message || error);
  }
  images.push(entry);
}
const result = {
  schemaVersion: 1, level: 3, generatedAt: new Date().toISOString(),
  offline, renderBoundaries, counts: {
    registeredVariants: 42, sourcePdfs: sources.length,
    pdfBytePagePreflightPassed: sources.filter((x) => x.status === "byte-and-page-preflight-pass-not-visual-approval").length,
    pdfBlocked: sources.filter((x) => x.status === "blocked").length,
    webpDecoded: images.filter((x) => x.decoded).length,
    imageCandidatesWithVisualFlags: images.filter((x) => x.visualFlags.length).length,
    independentlyApproved: 0, studentUploadsAuthorized: 0
  },
  policy: "Preflight is not finished-model image approval. Require source-page visual inspection, authentic image crop, 5 PDF-cited questions, two independent reviewers, and scanner gate before any upload.",
  sources, images
};
await writeFile(reportPath, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ reportPath, counts: result.counts }, null, 2));
if (result.counts.pdfBlocked || result.counts.webpDecoded !== 42) process.exitCode = 1;
