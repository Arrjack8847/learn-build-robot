import approvals from "./finalBuild/level-1-verified-references.json";
import wixImages from "./finalBuild/level-1-wix-image-urls.json";

export type LevelOneCrop = { x: number; y: number; width: number; height: number };
export type LevelOneCandidate = {
  filename: string;
  page: number;
  crop: LevelOneCrop;
  approved: boolean;
};
export type LevelOneQuestion = {
  prompt: string;
  sourcePage: number;
  observedFeature: string;
};
export type LevelOneVerifiedReference = {
  projectId: string;
  variantId: string;
  filename: string;
  officialPdfUrl: string;
  pdfSha256: string;
  sourcePage: number;
  crop: LevelOneCrop;
  approvedWebpPath?: string | null;
  approvedWebpUrl?: string | null;
  webpSha256?: string | null;
  webpWidth?: number | null;
  webpHeight?: number | null;
  independentValidationStatus: "passed";
  reviewer: string;
  reviewedAt: string;
  reviewEvidence: string;
  approvalDecision: "approved";
  assessmentQuestions: [LevelOneQuestion, LevelOneQuestion, LevelOneQuestion, LevelOneQuestion, LevelOneQuestion];
};

type ExpectedReference = {
  projectId: string;
  variantId: string;
  filename: string;
  officialPdfUrl: string | undefined;
  candidate: LevelOneCandidate | undefined;
};

// TS strict/noPropertyAccessFromIndexSignature: list every evidence field explicitly.
type EvidenceObject = Record<string, unknown> & {
  projectId?: unknown; variantId?: unknown; filename?: unknown;
  officialPdfUrl?: unknown; pdfSha256?: unknown; sourcePage?: unknown;
  crop?: unknown; approvedWebpPath?: unknown; approvedWebpUrl?: unknown;
  webpSha256?: unknown; webpWidth?: unknown; webpHeight?: unknown;
  independentValidationStatus?: unknown; reviewer?: unknown;
  reviewedAt?: unknown; reviewEvidence?: unknown;
  approvalDecision?: unknown; assessmentQuestions?: unknown;
  x?: unknown; y?: unknown; width?: unknown; height?: unknown;
  prompt?: unknown; observedFeature?: unknown;
};
function record(value: unknown): EvidenceObject | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as EvidenceObject : null;
}
function sha256(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value);
}
function validCrop(value: unknown): value is LevelOneCrop {
  const crop = record(value);
  if (!crop) return false;
  return ["x", "y", "width", "height"].every(key =>
    typeof crop[key] === "number" && Number.isFinite(crop[key]))
    && (crop.x as number) >= 0 && (crop.y as number) >= 0
    && (crop.width as number) > 0 && (crop.height as number) > 0
    && (crop.x as number) + (crop.width as number) <= 1
    && (crop.y as number) + (crop.height as number) <= 1;
}
function validQuestions(value: unknown): value is LevelOneVerifiedReference["assessmentQuestions"] {
  if (!Array.isArray(value) || value.length !== 5) return false;
  const prompts = new Set<string>();
  for (const item of value) {
    const q = record(item);
    if (!q || typeof q.prompt !== "string" || q.prompt.trim().length < 10
      || !Number.isSafeInteger(q.sourcePage) || (q.sourcePage as number) < 1
      || typeof q.observedFeature !== "string" || q.observedFeature.trim().length < 8) return false;
    prompts.add(q.prompt.trim().toLowerCase());
  }
  return prompts.size === 5;
}

/** Reject any missing, stale, mismatched, or merely provisional source evidence. */
export function validateLevelOneApproval(value: unknown, expected: ExpectedReference): value is LevelOneVerifiedReference {
  const item = record(value);
  const candidate = expected.candidate;
  if (!item || !candidate || candidate.approved !== true || !expected.officialPdfUrl) return false;
  if (item.projectId !== expected.projectId || item.variantId !== expected.variantId
    || item.filename !== expected.filename || candidate.filename !== expected.filename) return false;
  if (item.officialPdfUrl !== expected.officialPdfUrl
    || !/^https:\/\/[^/]+\.usrfiles\.com\/.+\.pdf(?:\?.*)?$/i.test(expected.officialPdfUrl)
    || !sha256(item.pdfSha256)) return false;
  if (item.approvalDecision !== "approved" || item.independentValidationStatus !== "passed"
    || typeof item.reviewer !== "string" || !item.reviewer.trim()
    || typeof item.reviewEvidence !== "string" || item.reviewEvidence.trim().length < 15
    || typeof item.reviewedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(item.reviewedAt)) return false;
  if (!Number.isSafeInteger(item.sourcePage) || (item.sourcePage as number) < 1
    || item.sourcePage !== candidate.page || !validCrop(item.crop)) return false;
  const crop = item.crop as LevelOneCrop;
  if (crop.x !== candidate.crop.x || crop.y !== candidate.crop.y
    || crop.width !== candidate.crop.width || crop.height !== candidate.crop.height) return false;
  if (!validQuestions(item.assessmentQuestions)) return false;
  const webp = item.approvedWebpPath != null || item.approvedWebpUrl != null;
  if (webp && (typeof item.approvedWebpPath !== "string"
    || !/^\/[^?#]+\.webp$/i.test(item.approvedWebpPath)
    || typeof item.approvedWebpUrl !== "string"
    || !/^https:\/\/static\.wixstatic\.com\/media\/[^?#]+\.webp(?:\?.*)?$/i.test(item.approvedWebpUrl)
    || (wixImages.images as Record<string, string>)[item.approvedWebpPath] !== item.approvedWebpUrl
    || !sha256(item.webpSha256)
    || !Number.isSafeInteger(item.webpWidth) || (item.webpWidth as number) < 1
    || !Number.isSafeInteger(item.webpHeight) || (item.webpHeight as number) < 1)) return false;
  return !webp || Boolean(item.approvedWebpPath && item.approvedWebpUrl);
}

/** Explicit signed-off records only. Do not infer approval from confidence, crop, or PDF success. */
export function getApprovedLevelOneReference(expected: ExpectedReference): LevelOneVerifiedReference | null {
  const records: unknown[] = approvals.references;
  const found = records.find(item => {
    const value = record(item);
    return value?.projectId === expected.projectId && value?.variantId === expected.variantId;
  });
  return validateLevelOneApproval(found, expected) ? found : null;
}
