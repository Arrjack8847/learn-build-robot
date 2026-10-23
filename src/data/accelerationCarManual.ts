/**
 * Official manual mapping, verified from Acceleration car_Building.pdf.
 * PDF page 1 is the cover; pages 2–19 are illustrated build Steps 1–18.
 *
 * Never add extra operation names, hole numbers, part descriptions or
 * intermediate illustrations. Only original PDF pixels are shown.
 */
import { staticPdfUrl } from "./staticPdfUrl";

const officialPdfUrl = staticPdfUrl("Acceleration car_Building.pdf");

export const ACCELERATION_MANUAL_URL = officialPdfUrl;
export const ACCELERATION_EXPECTED_PAGES = 19;
export const ACCELERATION_STEP_COUNT = 18;
export const ACCELERATION_ILLUSTRATION_NOTE =
  "Follow the assembly illustration shown in the manual.";

export function pageForStep(step: number): number {
  if (!Number.isInteger(step) || step < 1 || step > ACCELERATION_STEP_COUNT) {
    throw new RangeError("Step must be a whole number between 1 and 18");
  }
  return step + 1;
}
export function stepForPage(page: number): number | null {
  if (!Number.isInteger(page) || page < 1 || page > ACCELERATION_EXPECTED_PAGES) {
    return null;
  }
  return page === 1 ? null : page - 1;
}
