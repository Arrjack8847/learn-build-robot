/** Static URLs for original Level 1–3 PDFs under public/. */
export function staticPdfUrl(filename: string): string {
  return "/" + encodeURIComponent(filename);
}
