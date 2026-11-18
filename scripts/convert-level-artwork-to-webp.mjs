#!/usr/bin/env node
/**
 * Generates the eight BE STEM READY Level Selection WebP assets on Windows,
 * macOS, or Linux. Originals are preserved; no deployment is involved.
 */
import sharp from "sharp";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = fileURLToPath(new URL("../public/assets/level-artwork/", import.meta.url));
export const assets = [
  ["level-1-bulb.jpg", "level-1.webp"],
  ["level-2-gears.jpeg", "level-2.webp"],
  ["level-3-rocket-repaired.svg", "level-3.webp"],
  ["level-4-laptop.jpeg", "level-4.webp"],
  ["level-5-globe.jpeg", "level-5.webp"],
  ["level-6-robot.jpeg", "level-6.webp"],
  ["blue-wave-header.jpeg", "header-wave.webp"],
  ["level-landscape-repaired.svg", "landscape.webp"],
];

await mkdir(dir, { recursive: true });
const force = process.argv.includes("--force");
for (const [source, target] of assets) {
  const from = path.join(dir, source);
  const to = path.join(dir, target);
  const old = await stat(from);
  let existing;
  try { existing = await stat(to); } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  if (!force && existing && existing.mtimeMs >= old.mtimeMs) {
    const bytes = await readFile(to);
    if (bytes.toString("ascii", 0, 4) === "RIFF" &&
        bytes.toString("ascii", 8, 12) === "WEBP") {
      console.log("VERIFIED " + target);
      continue;
    }
  }
  const encoded = await sharp(from, { density: 96 }).webp(
    source.endsWith(".svg")
      ? { lossless: true, effort: 5 }
      : { quality: 91, effort: 5 }
  ).toBuffer();
  if (encoded.toString("ascii", 0, 4) !== "RIFF" ||
      encoded.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error("Invalid WebP output for " + target);
  }
  const meta = await sharp(encoded).metadata();
  if (meta.format !== "webp" || !meta.width || !meta.height) {
    throw new Error("Generated WebP is unreadable: " + target);
  }
  await writeFile(to, encoded);
  console.log("CREATED " + target + " (" + meta.width + "×" + meta.height + ", " + encoded.length + " bytes)");
}
console.log("SUCCESS: all eight Level Selection images are real WebP files.");
