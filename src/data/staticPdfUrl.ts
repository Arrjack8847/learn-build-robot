/** Official PDFs for Levels 1–3. Level 1 Learning uses the cleaned local copies. */
import { levelOneToThreeWixPdfUrls } from "./levelOneToThreeWixPdfUrls";

/** Original Level 1–3 Building manuals in public/ (repository root). */
export function staticPdfUrl(filename: string): string {
  return levelOneToThreeWixPdfUrls[filename] ?? "/" + encodeURIComponent(filename);
}

/**
 * Level 1 Learning must serve the cleaned PDFs committed under public/Level 1/Learning.
 * The Wix links are old original copies and MUST NOT override those local editions.
 * Preserve existing Wix-first behavior for Levels 2 and 3.
 */
export function levelOneToThreeLearningPdfUrl(level: 1 | 2 | 3, relativePath: string): string {
  const path = "Level " + level + "/Learning/" + relativePath;
  const localUrl = "/" + path.split("/").map(encodeURIComponent).join("/");
  if (level === 1) return localUrl;
  return levelOneToThreeWixPdfUrls[path] ?? localUrl;
}
