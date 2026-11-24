/**
 * Level 4 only: prevalidated content handoff for the existing Final Build engine.
 *
 * This module deliberately does NOT change the Level 1 scanner, clock,
 * animation choreography, grading, navigation or retry semantics.
 * Refuses to expose any variant unless ALL source, checklist and hosted-image
 * approval gates are satisfied. Incomplete Basic / Optimized variants are
 * independent entries and are never synthesized into one model.
 */
import referenceRegistry from "./level-4-references.json";
import checklistRegistry from "./level-4-checklists.json";
import mediaRegistry from "./level-4-wix-image-urls.json";

export interface Level4ApprovedChecklistQuestion {
  id: string;
  text: string;
  sourcePdfSha256: string;
  evidencePages: number[];
}

export interface Level4ApprovedChallenge {
  variantId: string;
  projectId: string;
  projectName: string;
  variant: "basic" | "optimized";
  variantLabel: string;
  sourcePdfUrl: string;
  sourcePdfSha256: string;
  sourcePage: number;
  finishedModelWebpUrl: string;
  finishedModelWebpSha256: string;
  finishedModelWidth: number;
  finishedModelHeight: number;
  questions: Level4ApprovedChecklistQuestion[];
}

export function getApprovedLevel4FinalBuildContent(): Level4ApprovedChallenge[] {
  const byVariant = new Map(checklistRegistry.records.map((set) => [set.variantId, set]));
  const imagesByVariant = new Map(mediaRegistry.records.map((image) => [image.variantId, image]));
  const seenVariants = new Set<string>();
  const seenUrls = new Set<string>();
  const eligible: Level4ApprovedChallenge[] = [];

  for (const record of referenceRegistry.records) {
    const { variantId, reference, source, approval } = record;
    if (seenVariants.has(variantId)) continue;
    if (approval.status !== "approved" || reference.status !== "approved") continue;
    if (reference.independentlyReviewed !== true || source.hostedPdfIdentityVerified !== true) continue;

    const checklist = byVariant.get(variantId);
    const media = imagesByVariant.get(variantId);
    if (!checklist || !media || checklist.status !== "approved") continue;
    if (checklist.questions.length !== 5 || new Set(checklist.questions.map((q) => q.id)).size !== 5) continue;
    if (checklist.questions.some((question) =>
      question.approved !== true ||
      question.verificationStatus !== "independently-reviewed-visual-assembly" ||
      question.sourcePdfSha256 !== source.hostedPdfSha256 ||
      !question.evidencePages.includes(reference.sourcePage) ||
      question.text.trim().length < 30
    )) continue;

    if (media.operationStatus !== "READY" || media.mediaType !== "IMAGE" ||
      media.mimeType !== "image/webp" || media.private !== false) continue;
    if (media.variantId !== variantId || media.sourcePdfSha256 !== source.hostedPdfSha256) continue;
    if (media.webpSha256 !== reference.webpSha256 ||
      media.hostedSha256 !== reference.webpSha256) continue;
    if (media.width !== reference.width || media.height !== reference.height ||
      media.sizeInBytes !== reference.byteLength) continue;
    if (media.filename !== reference.path.split("/").at(-1)) continue;
    if (!media.sourceGitHubUrl.endsWith("/" + reference.path)) continue;
    if (mediaRegistry.urls[variantId as keyof typeof mediaRegistry.urls] !== media.url) continue;
    if (!/^https:\/\/static\.wixstatic\.com\/media\/.+\.webp$/.test(media.url)) continue;
    if (seenUrls.has(media.url)) continue;

    seenVariants.add(variantId);
    seenUrls.add(media.url);
    eligible.push({
      variantId,
      projectId: record.projectId,
      projectName: record.projectName,
      variant: record.variant === "optimized" ? "optimized" : "basic",
      variantLabel: record.variantLabel,
      sourcePdfUrl: source.wixUrl,
      sourcePdfSha256: source.hostedPdfSha256,
      sourcePage: reference.sourcePage,
      finishedModelWebpUrl: media.url,
      finishedModelWebpSha256: media.webpSha256,
      finishedModelWidth: media.width,
      finishedModelHeight: media.height,
      questions: checklist.questions.map((question) => ({
        id: question.id,
        text: question.text,
        sourcePdfSha256: question.sourcePdfSha256,
        evidencePages: [...question.evidencePages],
      })),
    });
  }
  return eligible;
}

export function isLevel4FinalBuildVariantApproved(variantId: string): boolean {
  return getApprovedLevel4FinalBuildContent().some((item) => item.variantId === variantId);
}
