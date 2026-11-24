import { getAdvancedLevel, syllabusSlug } from "@/data/advancedSyllabus";
import { practicalProjects } from "@/data/practical";
import { pdfActivityManuals } from "@/data/pdfActivityManuals";
import { getLevelFourBuildingManual, hasLevelFourOptimizedManual } from "@/data/levelFourBuilding";
import { getLevelFiveSixBuildingManual, hasLevelFiveSixOptimizedManual } from "@/data/levelFiveSixContent";

/** The syllabus supplies titles/categories; existing project records supply canonical IDs. */
export type FinalBuildVariant = {
  id: string;
  label: string;
  url: string;
  filename: string;
  hostedOnWix: boolean;
};
export type FinalBuildProject = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  variants: FinalBuildVariant[];
};

function sourceFilename(url: string): string {
  try { return decodeURIComponent(url.split("?")[0]?.split("/").pop() || ""); }
  catch { return ""; }
}
function makeVariant(id: string, label: string, url: string | undefined): FinalBuildVariant | null {
  if (!url || !/^https:\/\/[^/]+\.usrfiles\.com\/.+\.pdf(?:\?|$)/i.test(url)) return null;
  return { id, label, url, filename: sourceFilename(url), hostedOnWix: true };
}
function labelFor(id: string, index: number, count: number): string {
  if (/optimized-ratchet/i.test(id)) return "Optimized + Ratchet";
  if (/optimized/i.test(id)) return "Optimized";
  if (/basic/i.test(id)) return "Basic";
  if (/v1/i.test(id)) return "Version 1";
  if (/v2/i.test(id)) return "Version 2";
  return count > 1 ? "Version " + (index + 1) : "Official Building Manual";
}
function collectVariants(level: number, records: typeof practicalProjects): FinalBuildVariant[] {
  const result: FinalBuildVariant[] = [];
  for (const [index, project] of records.entries()) {
    const basic = level === 4 ? getLevelFourBuildingManual(project.id)
      : level >= 5 ? getLevelFiveSixBuildingManual(project.id)
      : pdfActivityManuals[project.id];
    // A Learning slideshow, PowerPoint conversion or fallback is never an official Building PDF.
    if (!basic?.learningFallback && basic?.sourceKind !== "powerpoint") {
      const variant = makeVariant(project.id, labelFor(project.id, index, records.length), basic?.url);
      if (variant) result.push(variant);
    }
    if (level === 4 && hasLevelFourOptimizedManual(project.id)) {
      const variant = makeVariant(project.id + ":optimized", "Optimized", getLevelFourBuildingManual(project.id, "optimized")?.url);
      if (variant) result.push(variant);
    }
    if (level >= 5 && hasLevelFiveSixOptimizedManual(project.id)) {
      const variant = makeVariant(project.id + ":optimized", "Optimized", getLevelFiveSixBuildingManual(project.id, "optimized")?.url);
      if (variant) result.push(variant);
    }
  }
  return [...new Map(result.map(v => [v.url, v])).values()];
}

/** Each syllabus activity appears once, regardless of number of manual variants. */
export function getFinalBuildInventory(level: number): FinalBuildProject[] {
  if (!Number.isInteger(level) || level < 2 || level > 6) return [];
  return getAdvancedLevel(level).flatMap(category => category.entries.map(entry => {
    const matching = practicalProjects.filter(project =>
      project.level === level &&
      project.categoryId === category.id &&
      syllabusSlug(project.title) === syllabusSlug(entry.name)
    );
    return {
      id: matching[0]?.id ?? entry.id,
      name: entry.name,
      category: category.name,
      categoryId: category.id,
      variants: collectVariants(level, matching),
    };
  }));
}
/** Only source-registered, Wix-addressable Building projects enter the draw.
 * The remaining reference approval gate is checked separately before starting.
 */
export function getFinalBuildPool(level: number): FinalBuildProject[] {
  return getFinalBuildInventory(level).filter(p => p.variants.length > 0);
}

/** Uniform rejection sampling avoids modulo bias and does not couple selection to animation frames. */
export function secureRandomIndex(length: number): number {
  if (!Number.isSafeInteger(length) || length <= 0 || length > 0x100000000)
    throw new RangeError("Empty or unsupported Final Build pool");
  const limit = Math.floor(0x100000000 / length) * length;
  const array = new Uint32Array(1);
  let value: number;
  do {
    globalThis.crypto.getRandomValues(array);
    value = array[0]!;
  } while (value >= limit);
  return value % length;
}
