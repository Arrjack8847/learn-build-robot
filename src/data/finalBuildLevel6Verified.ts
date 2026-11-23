import levelSixReferences from "@/data/finalBuild/level-6-references.json";
import levelSixChecklists from "@/data/finalBuild/level-6-checklists.json";
import levelSixWixImages from "@/data/finalBuild/level-6-wix-image-urls.json";
import levelSixPdfFallbacks from "@/data/finalBuild/level-6-owner-authorized-pdf-fallbacks.json";
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
 * 39 independently verified WebP/checklist pairs are selectable, plus exactly
 * two owner-authorized genuine PDF construction-page fallbacks. Their cropped
 * model WebPs remain blocked and are never claimed to be finished-model images.
 */
export function getLevelSixEvidence(
  projectId: string,
  variant: FinalBuildVariant,
): LevelSixEvidence | null {
  if (!variant.hostedOnWix || levelSixWixImages.approvedMapped !== 39 ||
    levelSixWixImages.blockedExcluded !== 2) return null;

  const reference = refs.find(item => item.projectId === projectId && item.variantId === variant.id);
  const checklist = checklists.find(item => item.projectId === projectId && item.variantId === variant.id);
  const fallback = levelSixPdfFallbacks.entries.find(item =>
    item.projectId === projectId && item.variantId === variant.id);
  if (fallback) {
    // Owner-approved exception: the PDF page is an authentic construction
    // reference, explicitly NOT a certified picture of a completed model.
    // The two original image candidates remain blocked and unmapped.
    if (levelSixPdfFallbacks.ownerAuthorized !== true ||
      levelSixPdfFallbacks.level !== 6 ||
      levelSixPdfFallbacks.wixSiteId !== "fe3fa828-9f74-45e8-97f7-8d00cbb7fba0" ||
      fallback.status !== "owner-authorized-source-limited-fallback" ||
      fallback.referenceKind !== "official-pdf-construction" ||
      !reference || !checklist ||
      reference.approved !== false || reference.status !== "blocked" ||
      checklist.approved !== false || checklist.status !== "blocked" ||
      urls[variant.id] !== undefined ||
      !/^https:\/\/[^/]+\.usrfiles\.com\/ugd\/.+\.pdf$/i.test(variant.url) ||
      fallback.sourceUrl !== variant.url ||
      reference.sourceUrl !== variant.url ||
      reference.sourcePdfSha256 !== fallback.sourcePdfSha256 ||
      checklist.sourcePdfSha256 !== fallback.sourcePdfSha256 ||
      !sha256.test(fallback.sourcePdfSha256) ||
      !Number.isInteger(fallback.sourcePageCount) ||
      fallback.sourcePageCount < 1 ||
      !Number.isInteger(fallback.page) || fallback.page < 1 ||
      fallback.page > fallback.sourcePageCount ||
      !validCrop(fallback.crop) ||
      !fallback.notice.includes("not") && !fallback.notice.includes("NOT") ||
      !Array.isArray(checklist.questions) || checklist.questions.length !== 5 ||
      !checklist.questions.every(question => question.verified === false) ||
      !Array.isArray(fallback.questions) || fallback.questions.length !== 5 ||
      !fallback.questions.every(question =>
        typeof question.text === "string" && question.text.trim().length > 0 &&
        ["official-page-observation", "general-construction-self-assessment"].includes(question.classification) &&
        Array.isArray(question.evidencePages) &&
        question.evidencePages.every(page => Number.isInteger(page) &&
          page >= 1 && page <= fallback.sourcePageCount) &&
        (question.classification === "official-page-observation" ?
          question.evidencePages.length > 0 : question.evidencePages.length === 0))) return null;

    return {
      reference: {
        level: 6,
        projectId,
        variantId: variant.id,
        sourceUrl: reference.sourceUrl,
        pdfSha256: fallback.sourcePdfSha256,
        page: fallback.page,
        crop: { ...fallback.crop },
        imageUrl: null,
        referenceKind: "official-pdf-construction",
        referenceNotice: fallback.notice,
      },
      questions: fallback.questions.map(question => question.text),
    };
  }
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
