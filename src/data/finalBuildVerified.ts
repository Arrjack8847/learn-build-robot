import { getLevelTwoEvidence } from "@/data/finalBuildLevel2Verified";
import levelFiveReferences from "@/data/finalBuild/level-5-references.json";
import levelFiveChecklists from "@/data/finalBuild/level-5-checklists.json";
import levelFiveWixImages from "@/data/finalBuild/level-5-wix-image-urls.json";
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
};
type VerifiedEvidence = {
  reference: VerifiedFinalBuildReference;
  questions: readonly string[];
};

const referenceEntries = levelFiveReferences.items as ReferenceEntry[];
const checklistEntries = levelFiveChecklists.items as ChecklistEntry[];
const wixImages: Record<string, string> = levelFiveWixImages.urls;
const sha256Pattern = /^[0-9a-f]{64}$/i;

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
  if (level !== 5 || !variant.hostedOnWix) return null;
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
