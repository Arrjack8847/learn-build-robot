// Exact combined branch scope. Phase 1 deliberately has no live route activation.
export const COMBINED_BRANCH="integration/j12345-n12345-20261127";
export const COMBINED_SITE="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
export const COMBINED_RECORD="combined-scheduling-preview-v1";
export const COMBINED_SCOPE="combined-scheduling-preview-v1";
export const isCombinedBranch=e=>e?.VERCEL_GIT_COMMIT_REF===COMBINED_BRANCH;
export const combinedPreview=e=>isCombinedBranch(e)&&e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.WIX_DEV_SITE_ID===COMBINED_SITE;
export const combinedRepositoryEnabled=e=>combinedPreview(e)&&e.COMBINED_SCHEDULING_ENABLED==="1"&&e.NIZAR_FIXTURE_ENABLED!=="1"&&e.NIZAR_STAFF_FIXTURE_ENABLED!=="1";
