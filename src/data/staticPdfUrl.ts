/** Official PDFs for Levels 1–3. Level 1 Learning uses verified Wix uploads. */
import { levelOneToThreeWixPdfUrls } from "./levelOneToThreeWixPdfUrls";

/** Original Level 1–3 Building manuals in public/ (repository root). */
export function staticPdfUrl(filename: string): string {
  return levelOneToThreeWixPdfUrls[filename] ?? "/" + encodeURIComponent(filename);
}

/**
 * Level 1 Learning uses the 45 verified cleaned Wix uploads.
 * Levels 2–3 retain their existing Wix-first behavior.
 * Source PDFs remain unchanged and local paths are fallbacks.
 */
export function levelOneToThreeLearningPdfUrl(level: 1 | 2 | 3, relativePath: string): string {
  const path = "Level " + level + "/Learning/" + relativePath;
  const localUrl = "/" + path.split("/").map(encodeURIComponent).join("/");
  return levelOneToThreeWixPdfUrls[path] ?? localUrl;
}
