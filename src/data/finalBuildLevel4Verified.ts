import { getApprovedLevel4FinalBuildContent } from "@/data/finalBuild/level-4-approved-content";
import referenceData from "@/data/finalBuild/level-4-references.json";
import fallbackData from "@/data/finalBuild/level-4-source-limited-fallbacks.json";
import type { FinalBuildVariant } from "@/data/finalBuildRegistry";
import type { VerifiedFinalBuildReference } from "@/data/finalBuildVerified";

type Evidence = { reference: VerifiedFinalBuildReference; questions: readonly string[] };
const sha256 = /^[0-9a-f]{64}$/i;
const verifiedComplete = getApprovedLevel4FinalBuildContent();

function validCrop(crop: { x: number; y: number; width: number; height: number }): boolean {
  const { x, y, width, height } = crop;
  return [x, y, width, height].every(Number.isFinite) &&
    x >= 0 && y >= 0 && width > 0 && height > 0 &&
    x + width <= 1.000001 && y + height <= 1.000001;
}

/**
 * Strict Level 4 content dispatch:
 * 48 independently approved completed-model Wix WebPs, unchanged.
 * 2 explicitly owner-authorized *source-limited* PDF construction-stage views.
 * Those two do NOT have verified completed-model images or independently
 * reviewed mechanical-operation assessments; disclose that in student UI.
 */
export function getLevelFourEvidence(projectId: string, variant: FinalBuildVariant): Evidence | null {
  if (!variant.hostedOnWix) return null;
  const original = referenceData.records.find(r => r.variantId === variant.id && r.projectId === projectId);
  if (!original || original.source.wixUrl !== variant.url ||
      !original.source.hostedPdfIdentityVerified ||
      !sha256.test(original.source.hostedPdfSha256)) return null;

  const approved = verifiedComplete.find(r => r.variantId === variant.id && r.projectId === projectId);
  if (approved) {
    if (original.approval.status !== "approved" ||
        original.reference.status !== "approved" ||
        !validCrop(original.reference.cropNormalized) ||
        approved.sourcePdfUrl !== variant.url ||
        approved.sourcePdfSha256 !== original.source.hostedPdfSha256 ||
        approved.sourcePage !== original.reference.sourcePage ||
        approved.finishedModelWebpSha256 !== original.reference.webpSha256 ||
        approved.questions.length !== 5) return null;
    return {
      reference: {
        level: 4, projectId, variantId: variant.id, sourceUrl: variant.url,
        pdfSha256: original.source.hostedPdfSha256,
        page: approved.sourcePage, crop: { ...original.reference.cropNormalized },
        imageUrl: approved.finishedModelWebpUrl,
        referenceMode: "hosted-webp",
      },
      questions: approved.questions.map(q => q.text),
    };
  }

  // Two source-identical exceptions, not an unconditional unapproved image pool.
  const fallback = fallbackData.entries.find(r => r.variantId === variant.id && r.projectId === projectId);
  if (!fallback || fallbackData.entries.length !== 2 ||
      fallback.ownerAuthorizedForStudentInclusion !== true ||
      fallback.referenceMode !== "official-pdf-construction-stage" ||
      fallback.verifiedFinishedModel !== false || fallback.imageUrl !== null ||
      original.approval.status !== "blocked" ||
      original.reference.status !== "candidate" ||
      fallback.sourceUrl !== variant.url ||
      fallback.sourcePdfSha256 !== original.source.hostedPdfSha256 ||
      fallback.sourcePdfIdentityVerified !== true ||
      fallback.sourcePage !== original.reference.sourcePage ||
      fallback.sourcePdfPageCount !== original.source.hostedPdfPageCount ||
      !validCrop(fallback.normalizedCrop) ||
      fallback.limitation.trim().length < 30 ||
      fallback.questions.length !== 5 ||
      new Set(fallback.questions.map(q => q.id)).size !== 5 ||
      fallback.questions.some(q =>
        q.independentlyReviewed !== false ||
        q.sourcePdfSha256 !== fallback.sourcePdfSha256 ||
        !q.evidencePages.includes(fallback.sourcePage) ||
        !["source-visible", "practical-self-check"].includes(q.classification) ||
        q.text.trim().length < 30)) return null;
  return {
    reference: {
      level: 4, projectId, variantId: variant.id, sourceUrl: variant.url,
      pdfSha256: original.source.hostedPdfSha256,
      page: fallback.sourcePage, crop: { ...fallback.normalizedCrop },
      imageUrl: null, referenceMode: "registered-pdf-fallback",
      referenceNotice: fallback.limitation,
    },
    questions: fallback.questions.map(q => q.text),
  };
}
