/** Wix-hosted official PDFs for Levels 1–3; local originals remain available as fallbacks. */
import { levelOneToThreeWixPdfUrls } from "./levelOneToThreeWixPdfUrls";

/** Original Level 1–3 Building manuals in public/ (repository root). */
export function staticPdfUrl(filename: string): string {
  return levelOneToThreeWixPdfUrls[filename] ?? "/" + encodeURIComponent(filename);
}

/** Original Level 1–3 Learning presentations in public/Level N/Learning. */
export function levelOneToThreeLearningPdfUrl(level: 1 | 2 | 3, relativePath: string): string {
  const path = "Level " + level + "/Learning/" + relativePath;
  return levelOneToThreeWixPdfUrls[path] ?? "/" + path.split("/").map(encodeURIComponent).join("/");
}
