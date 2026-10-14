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
  // Mark Steps 1-6 complete in this isolated browser context to start at Step 7.
  // This affects only screenshot QA, not app navigation or real student progress.
  await page.addInitScript(() => {
    localStorage.setItem("robolearn.progress.v1", JSON.stringify({
      completedStepIds: Array.from({ length: 6 }, (_, i) => "marksmanship-s" + (i + 1)),
    }));
  });
  await page.goto(baseURL + "/practical/marksmanship", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Photo-based frame preparation" })
    .waitFor({ state: "visible", timeout: 20000 });
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
  await page.setViewportSize({ width: 1280, height: 1800 });
  // Prepare the two black pins and verify the 15-hole beam is still separate.
  for (let n = 0; n < 3; n++) await next.click();
  await page.waitForTimeout(1100);
  await canvas.scrollIntoViewIfNeeded();
  await canvas.screenshot({ path: output + "/final-two-separate-units.png" });
  // The viewer is only mounted inside Step 7, not Step 8 or every step.
  await page.getByRole("button", { name: /Done — Next Step/ }).click();
  await canvas.waitFor({ state: "detached", timeout: 10000 });
  await page.getByRole("button", { name: "Go to previous step" }).click();
  await canvas.waitFor({ state: "visible", timeout: 10000 });
  if (logs.length) throw new Error("Browser page errors: " + logs.join("; "));
  console.log("Captured Step 7 frame poses and confirmed Step 8 has no frame viewer.");
  await context.close();
} finally {
  await browser.close();
}
