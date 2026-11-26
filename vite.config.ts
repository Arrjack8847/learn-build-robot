import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

/** Standard TanStack Start / Vite setup with first-party build plugins. */
const {VERCEL_ENV,VERCEL_TARGET_ENV,VERCEL_GIT_COMMIT_REF}=process.env;
export default defineConfig({
  // The old fixture dashboard must not be enabled in the integrated branch.
  define: { __J1234_STUDENT_PREVIEW__: JSON.stringify(VERCEL_ENV === "preview" && VERCEL_TARGET_ENV !== "production" && VERCEL_GIT_COMMIT_REF === "integration/j1-j2-j3-j4-20261126"),
    __J4_FIXTURE_PREVIEW__: JSON.stringify(VERCEL_ENV === "preview" && VERCEL_TARGET_ENV !== "production" && VERCEL_GIT_COMMIT_REF === "feat/j4-private-staff-admin-20261126") },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({ server: { entry: "./server.ts" } }),
    viteReact(),
    nitro(),
  ],
});
