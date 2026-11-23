import { getLevelTwoEvidence } from "@/data/finalBuildLevel2Verified";
import { getLevelSixEvidence } from "@/data/finalBuildLevel6Verified";
import levelFiveReferences from "@/data/finalBuild/level-5-references.json";
import levelFiveChecklists from "@/data/finalBuild/level-5-checklists.json";
import levelFiveWixImages from "@/data/finalBuild/level-5-wix-image-urls.json";
import levelFiveWixCandidates from "@/data/finalBuild/level-5-wix-candidates.json";
import levelFiveOwnerPdfFallbacks from "@/data/finalBuild/level-5-owner-authorized-pdf-fallbacks.json";
import { getFinalBuildPool, type FinalBuildProject, type FinalBuildVariant } from "@/data/finalBuildRegistry";
import type { PrototypeClip } from "@/components/practical/FinalBuildPrototype";

type ReferenceEntry = {
  variantId: string;
  projectId: string;
  sourceUrl: string;
  pdfSha256: string | null;
  imageSha256: string | null;
  imagePath: string | null;
  page: number | null;
  normalizedCrop: number[] | null;
  reviewer: string | null;
  independentValidator: string | null;
  approved: boolean;
  status: string;
};
type ChecklistEntry = {
  variantId: string;
  projectId: string;
  approved: boolean;
  status: string;
  questions: Array<{ text: string; evidencePage: number; sourcePdfSha256: string }>;
};
export type VerifiedFinalBuildReference = {
  level: number;
  projectId: string;
  variantId: string;
  sourceUrl: string;
  pdfSha256: string;
  page: number;
  crop: PrototypeClip;
  imageUrl: string | null;
  referenceMode?: "hosted-webp" | "registered-pdf-fallback";
  /** For source-limited original pages, expressly disclaims a full model image. */
  referenceNotice?: string;
};
type VerifiedEvidence = {
  reference: VerifiedFinalBuildReference;
  questions: readonly string[];
};

const referenceEntries = levelFiveReferences.items as ReferenceEntry[];
const checklistEntries = levelFiveChecklists.items as ChecklistEntry[];
const wixImages: Record<string, string> = levelFiveWixImages.urls;

type CandidateImageRecord = {
  variantId: string;
  requiredFileName: string;
  officialBuildingPdfUrl: string;
  historicalPdfSha256: string;
  image: { webpCreated: boolean; sha256: string | null; dimensions: number[] | null; decoded?: boolean };
  wix: { mediaId: string | null; hostedUrl: string | null; operationStatus: string; mediaState?: string; mimeType: string | null; dimensions?: number[]; sourceUrl?: string; siteId?: string; publicVisibilityVerified: boolean; cdnHttpStatus?: number; cdnByteForByteSha256Verified?: boolean };
  assessment: { independentlyApprovedQuestions: number; studentApproved: boolean; selectable: boolean };
};
const levelFiveCandidateImages = (levelFiveWixCandidates as unknown as { candidates: CandidateImageRecord[] }).candidates;

const sha256Pattern = /^[0-9a-f]{64}$/i;

type OwnerPdfFallback = {
  variantId: string;
  projectId: string;
  status: string;
  ownerApprovedForStudentSelection: boolean;
  independentlyVerifiedCompletedImage: boolean;
  sourceUrl: string;
  pdfSha256: string;
  sourcePage: number;
  sourcePageCount: number;
  crop: number[];
  questions: Array<{ id: string; text: string; evidenceKind: string; independentlyVerified: boolean }>;
};
const ownerPdfFallbacks = levelFiveOwnerPdfFallbacks.items as OwnerPdfFallback[];

/** Three exactly identified owner-authorized instructional PDFs, not finished-model WebPs. */
function getOwnerAuthorizedPdfEvidence(
  projectId: string, variant: FinalBuildVariant,
): VerifiedEvidence | null {
  const matching = ownerPdfFallbacks.filter(item => item.variantId === variant.id);
  if (matching.length !== 1) return null;
  const item = matching[0];
  const reference = referenceEntries.find(ref => ref.variantId === variant.id && ref.projectId === projectId);
  const checklist = checklistEntries.find(check => check.variantId === variant.id && check.projectId === projectId);
  if (!variant.hostedOnWix || item.projectId !== projectId ||
      item.status !== "owner-authorized-pdf-fallback" ||
      item.ownerApprovedForStudentSelection !== true || item.independentlyVerifiedCompletedImage !== false ||
      !reference || reference.approved !== false || reference.status !== "blocked" ||
      !checklist || checklist.approved !== false || checklist.questions.length !== 0 ||
      item.sourceUrl !== variant.url || item.sourceUrl !== reference.sourceUrl ||
      !sha256Pattern.test(item.pdfSha256) || item.pdfSha256 !== reference.pdfSha256 ||
      !Number.isInteger(item.sourcePage) || item.sourcePage < 1 ||
      item.sourcePage !== reference.page ||
      !Number.isInteger(item.sourcePageCount) || item.sourcePage > item.sourcePageCount ||
      !validCrop(item.crop) || item.crop.some((value, index) => value !== [0, 0, 1, 1][index]) ||
      wixImages[variant.id] != null || !Array.isArray(item.questions) || item.questions.length !== 5 ||
      new Set(item.questions.map(q => q.id)).size !== 5 ||
      !item.questions.every(q => typeof q.id === "string" && q.id.length > 0 &&
        typeof q.text === "string" && q.text.trim().length > 0 &&
        q.evidenceKind === "general-construction-self-assessment" && q.independentlyVerified === false))
    return null;
  return {
    reference: {
      level: 5, projectId, variantId: variant.id,
      sourceUrl: item.sourceUrl, pdfSha256: item.pdfSha256,
      page: item.sourcePage, crop: { x: 0, y: 0, width: 1, height: 1 },
      imageUrl: null, referenceMode: "registered-pdf-fallback",
    },
    questions: item.questions.map(question => question.text),
  };
}


function validCrop(values: number[] | null): values is [number, number, number, number] {
  return Array.isArray(values) && values.length === 4 &&
    values.every(value => Number.isFinite(value)) &&
    values[0] >= 0 && values[1] >= 0 && values[2] > 0 && values[3] > 0 &&
    values[0] + values[2] <= 1 && values[1] + values[3] <= 1;
}

/** Only accept direct image URLs from Wix's static-media CDN, never local/public WebP paths. */
function validWixWebpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "static.wixstatic.com" &&
      url.pathname.startsWith("/media/") && /\.webp$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function getEvidence(level: number, projectId: string, variant: FinalBuildVariant): VerifiedEvidence | null {
  // Other levels stay closed until their own independently approved records are integrated.
  if (level === 2) return getLevelTwoEvidence(projectId, variant);
  if (level === 6) return getLevelSixEvidence(projectId, variant);
  if (level !== 5 || !variant.hostedOnWix) return null;
  // Explicit source-authorized PDF-only exception. Does not loosen 42 approved WebP gates.
  if (ownerPdfFallbacks.some(item => item.variantId === variant.id)) {
    return getOwnerAuthorizedPdfEvidence(projectId, variant);
  }
  const reference = referenceEntries.find(item => item.variantId === variant.id && item.projectId === projectId);
  const checklist = checklistEntries.find(item => item.variantId === variant.id && item.projectId === projectId);
  if (!reference || !checklist || !reference.approved || reference.status !== "approved" ||
      !checklist.approved || checklist.status !== "approved") return null;
  if (reference.sourceUrl !== variant.url || !reference.pdfSha256 ||
      !sha256Pattern.test(reference.pdfSha256) ||
      !reference.imageSha256 || !sha256Pattern.test(reference.imageSha256) ||
      !reference.imagePath?.startsWith("public/final-build/level-5/") ||
      !reference.reviewer?.trim() || !reference.independentValidator?.trim() ||
      !Number.isInteger(reference.page) || (reference.page ?? 0) < 1 ||
      !validCrop(reference.normalizedCrop)) return null;
  if (!Array.isArray(checklist.questions) || checklist.questions.length !== 5 ||
      !checklist.questions.every(question => typeof question.text === "string" &&
        question.text.trim().length > 0 && Number.isInteger(question.evidencePage) &&
        question.evidencePage >= 1 && question.sourcePdfSha256 === reference.pdfSha256)) return null;

  // An empty Wix URL mapping deliberately falls back to the already verified Wix Building PDF crop.
  const candidateUrl = wixImages[variant.id];
  if (candidateUrl != null && candidateUrl !== "" && !validWixWebpUrl(candidateUrl)) return null;

  // Independent additional-variant gate. Original 39 references have no candidate record,
  // so their Wix URLs, PDFs and scanner behaviour remain untouched.
  const candidateRows = levelFiveCandidateImages.filter(item => item.variantId === variant.id);
  if (candidateRows.length > 1) return null;
  const candidate = candidateRows[0];
  if (candidate) {
    const media = candidate.wix;
    const approved = candidate.assessment;
    if (!approved.studentApproved || !approved.selectable ||
        approved.independentlyApprovedQuestions !== 5 ||
        !candidate.image.webpCreated || candidate.image.decoded !== true ||
        candidate.image.sha256 !== reference.imageSha256 ||
        candidate.officialBuildingPdfUrl !== variant.url ||
        candidate.historicalPdfSha256 !== reference.pdfSha256 ||
        !Array.isArray(candidate.image.dimensions) || candidate.image.dimensions.length !== 2 ||
        !candidate.image.dimensions.every(n => Number.isInteger(n) && n > 0) ||
        !Array.isArray(media.dimensions) || media.dimensions.length !== 2 ||
        media.dimensions.some((n, i) => n !== candidate.image.dimensions![i]) ||
        media.operationStatus !== "READY" || media.mediaState !== "OK" ||
        media.mimeType !== "image/webp" || !media.publicVisibilityVerified ||
        !media.cdnByteForByteSha256Verified || media.cdnHttpStatus !== 200 ||
        media.siteId !== "fe3fa828-9f74-45e8-97f7-8d00cbb7fba0" ||
        media.mediaId === null || media.mediaId === "" ||
        media.hostedUrl !== "https://static.wixstatic.com/media/" + media.mediaId ||
        media.hostedUrl !== candidateUrl ||
        !media.sourceUrl?.endsWith("/" + candidate.requiredFileName)) return null;
  }
  const [x, y, width, height] = reference.normalizedCrop;
  return {
    reference: {
      level,
      projectId,
      variantId: variant.id,
      sourceUrl: reference.sourceUrl,
      pdfSha256: reference.pdfSha256,
      page: reference.page!,
      crop: { x, y, width, height },
      imageUrl: candidateUrl || null,
    },
    questions: checklist.questions.map(question => question.text),
  };
}

export function getVerifiedFinalBuildReference(
  level: number, projectId: string, variant: FinalBuildVariant,
): VerifiedFinalBuildReference | null {
  return getEvidence(level, projectId, variant)?.reference ?? null;
}

export function getVerifiedFinalBuildQuestions(
  level: number, projectId: string, variant: FinalBuildVariant,
): readonly string[] {
  return getEvidence(level, projectId, variant)?.questions ?? [];
}

/** Random discovery is uniform over eligible *projects*, not over their variants. */
export function getVerifiedFinalBuildPool(level: number): FinalBuildProject[] {
  return getFinalBuildPool(level).map(project => ({
    ...project,
    variants: project.variants.filter(variant => getEvidence(level, project.id, variant) !== null),
  })).filter(project => project.variants.length > 0);
}
