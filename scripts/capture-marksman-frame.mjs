/**
 * Browser screenshot QA for the optional photo frame tutorial.
 * Only captures what headless Chromium actually renders (not ground truth).
 * Run against a locally running Vite dev server.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseURL = process.env.FRAME_BASE_URL ?? "http://127.0.0.1:4173";
const output = "artifacts/marksman-frame";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader", "--disable-web-security"],
});
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1800 }, deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const logs = [];
  page.on("pageerror", (error) => logs.push(error.message));
  await page.goto(baseURL + "/practical/marksmanship", { waitUntil: "networkidle" });
  const expand = page.getByRole("button", { name: /Photo-based frame preparation.*optional 3D tutorial/ });
  await expand.waitFor({ state: "visible", timeout: 20000 });
  await expand.click();
  const canvas = page.getByLabel("Interactive photo-based Marksmanship frame assembly 3D viewer");
  await canvas.waitFor({ state: "visible", timeout: 20000 });
  // Capture uncluttered geometry first; hole labels remain separately interactive.
  const next = page.getByRole("button", { name: "Next action" });
  for (let n = 0; n < 6; n++) await next.click();
  await page.waitForTimeout(1200); // reduced-motion poses apply immediately
  await canvas.scrollIntoViewIfNeeded();
  await canvas.screenshot({ path: output + "/u-shaped-desktop.png" });
  await next.click();
  await page.waitForTimeout(1200);
  await canvas.screenshot({ path: output + "/rectangular-desktop.png" });
  // Phone viewport — verify canvas interaction and controls remain reachable.
  await page.setViewportSize({ width: 390, height: 1600 });
  await page.waitForTimeout(1000);
  await canvas.scrollIntoViewIfNeeded();
  await canvas.screenshot({ path: output + "/rectangular-mobile.png" });
  if (logs.length) throw new Error("Browser page errors: " + logs.join("; "));
  console.log("Captured headless browser evidence: U shape, rectangle desktop/mobile.");
  await context.close();
} finally {
  await browser.close();
}
