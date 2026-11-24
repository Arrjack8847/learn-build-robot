/**
 * Level 1 owner-approved Final Build start policy.
 *
 * The owner authorized all 60 registered robot variants to be used with their
 * authentic Wix-hosted Building PDF reference crops. `approved` on each crop
 * describes *independent visual source verification*, not owner authorization.
 * Do not use that legacy review flag to disable the student's Start button.
 *
 * A valid selected crop, successfully rendered PDF reference, and official
 * Wix-hosted source URL are still required. PDF load errors remain blocking.
 */
export type LevelOneReferenceForStart = {
  filename: string;
  approved?: boolean;
};

const WIX_PDF_URL =
  /^https:\/\/fe3fa828-9f74-45e8-97f7-8d00cbb7fba0\.usrfiles\.com\/ugd\/[a-z0-9_]+\.pdf(?:[?#].*)?$/i;

export function canStartLevelOneBuild(
  reference: LevelOneReferenceForStart | undefined,
  modelReady: boolean,
  manualUrl: string | undefined,
): boolean {
  return Boolean(
    reference?.filename &&
    modelReady &&
    typeof manualUrl === "string" &&
    WIX_PDF_URL.test(manualUrl),
  );
}
