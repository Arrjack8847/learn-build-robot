import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

/** Standard TanStack Start / Vite setup with first-party build plugins. */
export default defineConfig({
  define: { __J4_FIXTURE_PREVIEW__: JSON.stringify(process.env.VERCEL_ENV === "preview" && process.env.VERCEL_TARGET_ENV !== "production" && process.env.VERCEL_GIT_COMMIT_REF === "feat/j4-private-staff-admin-20261126") },
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
