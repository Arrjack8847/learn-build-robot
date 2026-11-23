import levelSixReferences from "@/data/finalBuild/level-6-references.json";
import levelSixChecklists from "@/data/finalBuild/level-6-checklists.json";
import levelSixWixImages from "@/data/finalBuild/level-6-wix-image-urls.json";
import type { FinalBuildVariant } from "@/data/finalBuildRegistry";
import type { VerifiedFinalBuildReference } from "@/data/finalBuildVerified";

type LevelSixEvidence = {
  reference: VerifiedFinalBuildReference;
  questions: readonly string[];
};

const refs = levelSixReferences.entries;
const checklists = levelSixChecklists.entries;
const urls: Record<string, string> = levelSixWixImages.urls;
const sha256 = /^[0-9a-f]{64}$/i;

function validCrop(crop: { x: number; y: number; width: number; height: number }): boolean {
  const { x, y, width, height } = crop;
  return [x, y, width, height].every(Number.isFinite) &&
    x >= 0 && y >= 0 && width > 0 && height > 0 &&
    x + width <= 1.000001 && y + height <= 1.000001;
}

function validHostedWebp(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && url.hostname === "static.wixstatic.com" &&
      /^\/media\/.+\.webp$/i.test(url.pathname);
  } catch {
    return false;
  }
}

/**
 * Source-evidenced, fail-closed Level 6 integration.
 * Exactly the 39 independently approved image/checklist pairs on Steam Wix
 * are selectable. The two blocked source candidates never receive a fallback.
 */
export function getLevelSixEvidence(
  projectId: string,
  variant: FinalBuildVariant,
): LevelSixEvidence | null {
  if (!variant.hostedOnWix || levelSixWixImages.approvedMapped !== 39 ||
    levelSixWixImages.blockedExcluded !== 2) return null;

  const reference = refs.find(item => item.projectId === projectId && item.variantId === variant.id);
  const checklist = checklists.find(item => item.projectId === projectId && item.variantId === variant.id);
  if (!reference || !checklist || reference.approved !== true || reference.status !== "approved" ||
    checklist.approved !== true || checklist.status !== "approved") return null;

  if (reference.sourceUrl !== variant.url ||
    !sha256.test(reference.sourcePdfSha256) ||
    !sha256.test(reference.imageWebpSha256) ||
    !reference.imageWebp.startsWith("public/final-build/level-6/") ||
    !reference.imageWebp.endsWith(".webp") ||
    !reference.independentReviewer?.trim() ||
    !Number.isInteger(reference.sourcePage) || reference.sourcePage < 1 ||
    !validCrop(reference.crop)) return null;

  if (checklist.sourcePdfSha256 !== reference.sourcePdfSha256 ||
    !Array.isArray(checklist.questions) || checklist.questions.length !== 5 ||
    !checklist.questions.every(question =>
      question.verified === true && question.text.trim().length > 0 &&
      Array.isArray(question.evidencePages) && question.evidencePages.length > 0 &&
      question.evidencePages.every(page => Number.isInteger(page) && page >= 1))) return null;

  const imageUrl = urls[variant.id];
  if (!imageUrl || !validHostedWebp(imageUrl)) return null;

  return {
    reference: {
      level: 6,
      projectId,
      variantId: variant.id,
      sourceUrl: reference.sourceUrl,
      pdfSha256: reference.sourcePdfSha256,
      page: reference.sourcePage,
      crop: { ...reference.crop },
      imageUrl,
    },
    questions: checklist.questions.map(question => question.text),
  };
}
