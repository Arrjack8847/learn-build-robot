/**
 * Resolve the extraction batch size without accepting Infinity or invalid values.
 * Single-project extraction always defaults to one source. Broad searches
 * default to five so accidental bulk extraction is avoided.
 */
export function resolveQuizExtractionLimit({ limitArg, projectId, all, level }) {
  const fallback = projectId ? 1 : 5;
  const limit = limitArg === undefined ? fallback : Number(limitArg);
  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("--limit must be a positive integer");
  }
  return limit;
}
