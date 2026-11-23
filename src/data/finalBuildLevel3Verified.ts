import ownerData from "@/data/finalBuild/level-3-owner-authorized.json";
import type { FinalBuildProject, FinalBuildVariant } from "@/data/finalBuildRegistry";
import type { VerifiedFinalBuildReference } from "@/data/finalBuildVerified";

/**
 * Level 3 is an explicit OWNER-AUTHORIZED content tier, not an assertion that
 * two independent reviewers certified 42 completed-model images.
 *
 * All media are unchanged cropped illustrations extracted from authenticated
 * official Building PDFs and delivered by Steam Wix. Keep this strictly
 * isolated from other levels' independent review/approval gates.
 */
type Source = {
  url: string; pdfSha256: string; pageCount: number; sourcePage: number;
  cropNormalized: { x: number; y: number; width: number; height: number };
  completedAssemblyIndependentlyConfirmed: boolean;
};
type WixImage = {
  sourceGitUrl: string; hostedUrl: string; mediaId: string;
  operationStatus: string; mediaState: string; mimeType: string;
  publicVisibility: boolean; siteId: string; width: number; height: number;
  hostedSha256: string; hostedBytes: number; hostedHttpStatus: number;
  originalGitWebpSha256: string; sourceGitByteLength: number;
  sourceGitCdnByteEqualityVerified: boolean;
  sourceFromOfficialPdfPage: boolean; completedAssemblyIndependentlyConfirmed: boolean;
};
type Question = {
  text: string; evidencePage: number; sourcePdfSha256: string;
  reviewStatus: string;
};
type OwnerRecord = {
  variantId: string; projectId: string; variantLabel: string;
  ownerAuthorized: boolean; independentImageApproval: boolean;
  independentQuestionApproval: boolean; source: Source; image: WixImage;
  questions: Question[];
};
const manifest = ownerData as unknown as {
  schemaVersion: number; level: number; wixSiteId: string;
  counts: { variants: number; ownerAuthorizedWebpUrls: number; questions: number };
  records: OwnerRecord[];
};
const sha = /^[0-9a-f]{64}$/;
const siteId = "fe3fa828-9f74-45e8-97f7-8d00cbb7fba0";

function cropIsValid(c: Source["cropNormalized"]): boolean {
  return Boolean(c) && [c.x, c.y, c.width, c.height].every(Number.isFinite) &&
    c.x >= 0 && c.y >= 0 && c.width > 0 && c.height > 0 &&
    c.x + c.width <= 1.000001 && c.y + c.height <= 1.000001;
}
function manifestIsValid(): boolean {
  const rows = manifest.records;
  return manifest.schemaVersion === 1 && manifest.level === 3 &&
    manifest.wixSiteId === siteId && manifest.counts.variants === 42 &&
    manifest.counts.ownerAuthorizedWebpUrls === 42 &&
    manifest.counts.questions === 210 && Array.isArray(rows) && rows.length === 42 &&
    new Set(rows.map(row => row.variantId)).size === 42 &&
    new Set(rows.map(row => row.projectId)).size === 39 &&
    rows.reduce((sum, row) => sum + row.questions.length, 0) === 210;
}
const validOwnerManifest = manifestIsValid();
const registered = manifest.records;

/** Expand the two multi-manual project registrations into all 42 exam variants,
 * preserving the existing syllabus project names, categories and shared scanner.
 */
export function withLevelThreeOwnerAuthorizedVariants(
  inventory: FinalBuildProject[],
): FinalBuildProject[] {
  if (!validOwnerManifest) return [];
  const validProjects = new Set(inventory.filter(p => p.variants.length > 0).map(p => p.id));
  return inventory.filter(project => validProjects.has(project.id)).map(project => ({
    ...project,
    variants: registered.filter(record => record.projectId === project.id)
      .map(record => ({
        id: record.variantId,
        label: record.variantLabel,
        url: record.source.url,
        filename: record.source.url.split("?")[0].split("/").pop() ?? "",
        hostedOnWix: true,
      })),
  }));
}

export function getLevelThreeEvidence(
  projectId: string,
  variant: FinalBuildVariant,
): { reference: VerifiedFinalBuildReference; questions: readonly string[] } | null {
  if (!validOwnerManifest || !variant.hostedOnWix) return null;
  const matching = registered.filter(record =>
    record.projectId === projectId && record.variantId === variant.id);
  if (matching.length !== 1) return null;
  const row = matching[0];
  const { source: s, image: m } = row;
  if (!row.ownerAuthorized || row.independentImageApproval !== false ||
      row.independentQuestionApproval !== false ||
      !/^https:\/\/[^/]+\.usrfiles\.com\/.+\.pdf$/i.test(s.url) ||
      variant.url !== s.url || !sha.test(s.pdfSha256) ||
      !Number.isInteger(s.pageCount) || s.pageCount < 1 ||
      !Number.isInteger(s.sourcePage) || s.sourcePage < 1 ||
      s.sourcePage > s.pageCount || !cropIsValid(s.cropNormalized) ||
      s.completedAssemblyIndependentlyConfirmed !== false ||
      m.sourceFromOfficialPdfPage !== true ||
      m.completedAssemblyIndependentlyConfirmed !== false ||
      m.operationStatus !== "READY" || m.mediaState !== "OK" ||
      m.mimeType !== "image/webp" || m.publicVisibility !== true ||
      m.siteId !== siteId || m.hostedHttpStatus !== 200 ||
      !Number.isInteger(m.width) || m.width < 160 ||
      !Number.isInteger(m.height) || m.height < 160 ||
      !Number.isInteger(m.hostedBytes) || m.hostedBytes <= 0 ||
      !sha.test(m.hostedSha256) ||
      !sha.test(m.originalGitWebpSha256) ||
      m.originalGitWebpSha256 !== m.hostedSha256 ||
      m.sourceGitByteLength !== m.hostedBytes ||
      m.sourceGitCdnByteEqualityVerified !== true ||
      m.hostedUrl !== "https://static.wixstatic.com/media/" + m.mediaId ||
      !/^78042f_[a-f0-9]{32}~mv2\.webp$/.test(m.mediaId) ||
      m.sourceGitUrl !== "https://raw.githubusercontent.com/Arrjack8847/learn-build-robot/" +
        ownerData.sourceWorkerHead + "/assets/final-build/level-3/unapproved-source-crops/" +
        row.variantId + "-source-proposal.webp" ||
      row.questions.length !== 5 ||
      new Set(row.questions.map(q => q.text)).size !== 5 ||
      !row.questions.every(q => q.text.trim().length > 20 &&
        q.sourcePdfSha256 === s.pdfSha256 && Number.isInteger(q.evidencePage) &&
        q.evidencePage >= 1 && q.evidencePage <= s.pageCount &&
        q.reviewStatus === "owner-authorized-candidate-not-independently-validated"))
    return null;
  return {
    reference: {
      level: 3, projectId, variantId: variant.id,
      sourceUrl: s.url, pdfSha256: s.pdfSha256, page: s.sourcePage,
      crop: { ...s.cropNormalized },
      imageUrl: m.hostedUrl,
      referenceMode: "hosted-webp",
      referenceNotice: "Original Building-PDF illustration, owner-authorized for self-assessment; finished assembly not independently certified.",
    },
    questions: row.questions.map(q => q.text),
  };
}
