/** Official Level 1–3 Learning PDFs use verified clean Wix Media Manager URLs. */
import { levelOneToThreeWixPdfUrls } from "./levelOneToThreeWixPdfUrls";

/** Original Level 1–3 Building manuals in public/ (repository root). */
export function staticPdfUrl(filename: string): string {
  return levelOneToThreeWixPdfUrls[filename] ?? "/" + encodeURIComponent(filename);
}

/**
 * Cleaned Learning PDFs for Levels 1–3 are hosted on Wix Studio to keep the
 * deployed application lightweight. Local files remain only as a fallback.
 */
export function levelOneToThreeLearningPdfUrl(level: 1 | 2 | 3, relativePath: string): string {
  const path = "Level " + level + "/Learning/" + relativePath;
  const localUrl = "/" + path.split("/").map(encodeURIComponent).join("/");
  return levelOneToThreeWixPdfUrls[path] ?? localUrl;
}
