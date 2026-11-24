/**
 * Every course PDF is hosted by the Steam Wix site.
 * A missing mapping is a configuration error, never an invitation to serve a
 * tracked `public/` PDF or silently load an outdated local copy.
 */
const STEAM_WIX_PDF_URL =
  /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf$/i;

export function requireWixPdfUrl(path: string, value: string | undefined): string {
  if (typeof value !== "string" || !STEAM_WIX_PDF_URL.test(value)) {
    throw new Error("Missing or invalid Steam Wix PDF link for: " + path);
  }
  return value;
}
