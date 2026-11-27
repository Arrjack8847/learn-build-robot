import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig,loadEnv } from "vite";
import {isCombinedBranch} from "./scripts/combined/scope.mjs";
import {privateAssessmentBuildPlugin} from "./scripts/j12345/private-assessment-build.mjs";
import { j5PrivatePdfPlugin } from "./scripts/j5/private-pdf-build.mjs";

/** Standard TanStack Start / Vite setup with first-party build plugins. */
const {VERCEL_ENV,VERCEL_TARGET_ENV,VERCEL_GIT_COMMIT_REF}=process.env;
const combinedBuild=VERCEL_ENV==="preview"&&VERCEL_TARGET_ENV!=="production"&&isCombinedBranch(process.env);
const privatePreview=combinedBuild||VERCEL_ENV==="preview"&&VERCEL_TARGET_ENV!=="production"&&VERCEL_GIT_COMMIT_REF==="integration/j1-j2-j3-j4-j5-20261126";
export default defineConfig(({mode,command})=>{
  if((isCombinedBranch(process.env)||mode==="combined-private")&&(!combinedBuild||command!=="build"||process.env["COMBINED_PRIVATE_BUILD_PIPELINE"]!=="1"||mode!=="combined-private"))throw Error("Use npm run build:combined-private for the exact combined preview only");
  const env=loadEnv(mode,process.cwd(),"VITE_");
  if(privatePreview&&!combinedBuild&&(command!=="build"||process.env["J12345_PRIVATE_BUILD_PIPELINE"]!=="1"||mode!=="j12345-private"))throw Error("Use npm run build:j12345-private for the audited private preview");
  if(!privatePreview&&(mode==="j12345-private"||env["VITE_J5_PRIVATE_UI"]==="true"||process.env["VITE_J5_PRIVATE_UI"]==="true"))throw Error("Private J12345 UI requires the exact preview branch");
  return {
  // The old fixture dashboard must not be enabled in the integrated branch.
  define: { "import.meta.env.VITE_J5_PRIVATE_UI": JSON.stringify(privatePreview?"true":"false"), __J12345_STUDENT_PREVIEW__: JSON.stringify(privatePreview), __COMBINED_PREVIEW__: JSON.stringify(combinedBuild),
    __J1234_STUDENT_PREVIEW__: JSON.stringify(VERCEL_ENV === "preview" && VERCEL_TARGET_ENV !== "production" && VERCEL_GIT_COMMIT_REF === "integration/j1-j2-j3-j4-20261126"),
    __J4_FIXTURE_PREVIEW__: JSON.stringify(VERCEL_ENV === "preview" && VERCEL_TARGET_ENV !== "production" && VERCEL_GIT_COMMIT_REF === "feat/j4-private-staff-admin-20261126") },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    ...(privatePreview?[privateAssessmentBuildPlugin(),j5PrivatePdfPlugin()]:[]),
    tailwindcss(),
    tanstackStart({ server: { entry: "./server.ts" } }),
    viteReact(),
    nitro(),
  ],
  };
});
