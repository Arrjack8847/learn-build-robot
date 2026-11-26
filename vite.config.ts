import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import { j5PrivatePdfPlugin } from "./scripts/j5/private-pdf-build.mjs";

/** Standard TanStack Start / Vite setup with first-party build plugins. */
export default defineConfig(({mode,command}) => {
  const env=loadEnv(mode,process.cwd(),"VITE_");
  const privateBuild=mode==="j5-private";
  if(privateBuild&&(command!=="build"||process.env["J5_PRIVATE_BUILD_PIPELINE"]!=="1"))throw new Error("Use npm run build:j5-private; private dev serving is not permitted");
  if(!privateBuild&&(env["VITE_J5_PRIVATE_UI"]==="true"||process.env["VITE_J5_PRIVATE_UI"]==="true"))throw new Error("Private J5 UI requires the audited private-build pipeline");
  return {
  ...(privateBuild?{define:{"import.meta.env.VITE_J5_PRIVATE_UI":JSON.stringify("true")}}:{}),
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    ...(privateBuild?[j5PrivatePdfPlugin()]:[]),
    tailwindcss(),
    tanstackStart({ server: { entry: "./server.ts" } }),
    viteReact(),
    nitro(),
  ],
  };
});
