import levelTwoReferences from "@/data/finalBuild/level-2-references.json";
import levelTwoChecklists from "@/data/finalBuild/level-2-checklists.json";
import levelTwoWixImages from "@/data/finalBuild/level-2-wix-image-urls.json";
import levelTwoOwnerFallbacks from "@/data/finalBuild/level-2-owner-approved-pdf-fallbacks.json";
import recoveredLevelTwoImages from "@/data/finalBuild/level-2-recovered-model-images.json";
import type { FinalBuildVariant } from "@/data/finalBuildRegistry";
import type { VerifiedFinalBuildReference } from "@/data/finalBuildVerified";

type LevelTwoEvidence = {
  reference: VerifiedFinalBuildReference;
  questions: readonly string[];
};

const references = levelTwoReferences.references;
const checklists = levelTwoChecklists.checklists;
const previousBlocks = new Set(levelTwoReferences.blockedVariantIds);
const fallbackRecords = levelTwoOwnerFallbacks.records;
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
 * Owner authorization changes Level 2 eligibility, NOT independent Building-manual
 * or completed-model approval. Preserve every pre-verified WebP and the 150
 * source-backed questions. Remaining registered variants expose their exact
 * hashed original PDF and five clearly marked general-observable checks.
 */
export function getLevelTwoEvidence(
  projectId: string,
  variant: FinalBuildVariant,
): LevelTwoEvidence | null {
  if (!variant.hostedOnWix) return null;

  const fallback = fallbackRecords.find(item =>
    item.variantId === variant.id && item.projectId === projectId);
  if (fallback) {
    const source = fallback.reference;
    const assessment = fallback.assessment;
    if (!previousBlocks.has(variant.id) ||
        !levelTwoChecklists.blockedVariantIds.includes(variant.id) ||
        references.some(item => item.variantId === variant.id) ||
        checklists.some(item => item.variantId === variant.id) ||
        wixImages[variant.id] != null ||
        fallback.ownerAuthorized !== true || fallback.independentlySourceApproved !== false ||
        fallback.studentInclusionMode !== "registered-pdf-fallback" ||
        source.mode !== "original-registered-pdf" ||
        source.url !== variant.url || !/^https:\/\/[^/]+\.usrfiles\.com\/.+\.pdf(?:\?|$)/i.test(source.url) ||
        !sha256Pattern.test(source.sha256) ||
        !Number.isInteger(source.pageCount) || source.pageCount < 1 ||
        source.sourcePdfBytesPreviouslyHashed !== true ||
        source.sourceKindIndependentlyConfirmed !== false ||
        fallback.image.approvedWebp !== false || fallback.image.webpUrl !== null ||
        assessment.ownerAuthorized !== true || assessment.independentlyPdfVerified !== false ||
        assessment.provenance !== "general-observable-not-pdf-page-verified" ||
        assessment.questions.length !== 5 ||
        !assessment.questions.every(question =>
          question.text.trim().length > 0 &&
          question.evidenceType === "general-observable-not-pdf-verified" &&
          question.pdfPage === null)) return null;

    const recovered = recoveredLevelTwoImages.records.find(item => item.variantId === variant.id && item.projectId === projectId);
    const hasRecoveredImage = recovered && recovered.sourceUrl === source.url && recovered.pdfSha256 === source.sha256 &&
      recovered.sourcePdfHashVerified && recovered.visuallyInspected && recovered.wixReady && recovered.cdnBytesVerified &&
      recovered.sourceKind === "original-registered-pdf-illustration" && recovered.independentFinishedModelCertification === false &&
      Number.isInteger(recovered.page) && recovered.page > 0 && recovered.page <= source.pageCount &&
      sha256Pattern.test(recovered.imageSha256) && recovered.imageBytes > 0 && recovered.dimensions.length === 2 && recovered.dimensions.every(n => Number.isInteger(n) && n > 0) &&
      recovered.pdfCrop.length === 4 && recovered.pdfCrop.every(Number.isFinite) && recovered.pdfCrop[2]! > recovered.pdfCrop[0]! && recovered.pdfCrop[3]! > recovered.pdfCrop[1]! &&
      validWixWebpUrl(recovered.wixUrl) && recovered.wixUrl === "https://static.wixstatic.com/media/" + recovered.mediaId;
    return {
      reference: {
        level: 2,
        projectId,
        variantId: variant.id,
        sourceUrl: source.url,
        pdfSha256: source.sha256,
        page: hasRecoveredImage ? recovered.page : 1,
        crop: { x: 0, y: 0, width: 1, height: 1 },
        imageUrl: hasRecoveredImage ? recovered.wixUrl : null,
        referenceMode: hasRecoveredImage ? "hosted-webp" : "registered-pdf-fallback",
        ...(hasRecoveredImage ? { referenceNotice: "Original robot illustration from the registered PDF; use the five construction self-checks." } : {}),
      },
      questions: assessment.questions.map(question => question.text),
    };
  }

  // The original 30 remain under their stricter independent approval gate.
  if (previousBlocks.has(variant.id) ||
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
      reference.pdfCrop[2]! <= reference.pdfCrop[0]! ||
      reference.pdfCrop[3]! <= reference.pdfCrop[1]!) return null;

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
      crop: { x: 0, y: 0, width: 1, height: 1 },
      imageUrl,
      referenceMode: "hosted-webp",
    },
    questions: checklist.questions.map(question => question.text),
  };
}
