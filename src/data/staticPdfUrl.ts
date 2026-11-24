/** Official PDFs for Levels 1–3. Level 1 Learning uses verified Wix uploads. */
import { levelOneToThreeWixPdfUrls } from "./levelOneToThreeWixPdfUrls";
import { requireWixPdfUrl } from "./requireWixPdfUrl";

/** Original Level 1–3 Building manuals in public/ (repository root). */
export function staticPdfUrl(filename: string): string {
  return requireWixPdfUrl(filename, levelOneToThreeWixPdfUrls[filename]);
}

/**
 * Level 1 Learning uses the 45 verified cleaned Wix uploads.
 * Levels 2–3 retain their existing Wix-first behavior.
 * No local PDF fallback: a missing Wix entry fails explicitly.
 */
export function levelOneToThreeLearningPdfUrl(level: 1 | 2 | 3, relativePath: string): string {
  const path = "Level " + level + "/Learning/" + relativePath;
  return requireWixPdfUrl(path, levelOneToThreeWixPdfUrls[path]);
}
