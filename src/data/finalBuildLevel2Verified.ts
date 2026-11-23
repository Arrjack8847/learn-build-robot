import levelTwoReferences from "@/data/finalBuild/level-2-references.json";
import levelTwoChecklists from "@/data/finalBuild/level-2-checklists.json";
import levelTwoWixImages from "@/data/finalBuild/level-2-wix-image-urls.json";
import type { FinalBuildVariant } from "@/data/finalBuildRegistry";
import type { VerifiedFinalBuildReference } from "@/data/finalBuildVerified";

type LevelTwoEvidence = {
  reference: VerifiedFinalBuildReference;
  questions: readonly string[];
};

const references = levelTwoReferences.references;
const checklists = levelTwoChecklists.checklists;
const blocked = new Set(levelTwoReferences.blockedVariantIds);
const wixImages: Record<string, string> = levelTwoWixImages.urls;
const sha256Pattern = /^[0-9a-f]{64}$/i;

function validWixWebpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "static.wixstatic.com" &&
      /^\/media\/.+\.webp$/i.test(url.pathname);
  } catch {
    return false;
  }
}

/**
 * Level 2 is image-only: every eligible variant MUST have its independently
 * approved source WebP already hosted and verified on Steam Wix. Never expose
 * an unreviewed PDF crop or a registered-but-blocked presentation to students.
 */
export function getLevelTwoEvidence(
  projectId: string,
  variant: FinalBuildVariant,
): LevelTwoEvidence | null {
  if (!variant.hostedOnWix || blocked.has(variant.id) ||
      levelTwoChecklists.blockedVariantIds.includes(variant.id)) return null;

  const reference = references.find(item =>
    item.variantId === variant.id && item.projectId === projectId);
  const checklist = checklists.find(item => item.variantId === variant.id);
  if (!reference || !checklist || !reference.approved || !checklist.approved ||
      reference.verifiedPasses < 2) return null;

  if (reference.sourceUrl !== variant.url ||
      !sha256Pattern.test(reference.sourceSha256) ||
      !sha256Pattern.test(reference.imageSha256) ||
      reference.imageFilename !== variant.id + ".webp" ||
      reference.imagePath !== "/final-build/level-2/" + reference.imageFilename ||
      !Number.isInteger(reference.pdfPage) || reference.pdfPage < 1 ||
      !Array.isArray(reference.pdfCrop) || reference.pdfCrop.length !== 4 ||
      !reference.pdfCrop.every(Number.isFinite) ||
      reference.pdfCrop[2] <= reference.pdfCrop[0] ||
      reference.pdfCrop[3] <= reference.pdfCrop[1]) return null;

  if (checklist.sourcePdfSha256 !== reference.sourceSha256 ||
      checklist.imageSha256 !== reference.imageSha256 ||
      checklist.approvalPasses < 2 ||
      !Array.isArray(checklist.questions) || checklist.questions.length !== 5 ||
      !checklist.questions.every(question =>
        question.text.trim().length > 0 &&
        question.pdfPage >= 1 && Number.isInteger(question.pdfPage) &&
        question.evidenceNote.trim().length > 0)) return null;

  const imageUrl = wixImages[variant.id];
  if (!imageUrl || !validWixWebpUrl(imageUrl)) return null;

  return {
    reference: {
      level: 2,
      projectId,
      variantId: variant.id,
      sourceUrl: reference.sourceUrl,
      pdfSha256: reference.sourceSha256,
      page: reference.pdfPage,
      // Unused in hosted-WebP mode. Deliberately do NOT turn an absolute
      // PDF-coordinate crop into an unverified normalized PDF fallback.
      crop: { x: 0, y: 0, width: 1, height: 1 },
      imageUrl,
    },
    questions: checklist.questions.map(question => question.text),
  };
}
