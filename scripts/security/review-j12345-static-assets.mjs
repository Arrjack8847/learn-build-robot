// Diagnostic inventory only. Does not delete, publish, fetch, or approve content.
import {lstatSync,readdirSync,existsSync} from "node:fs";
import {resolve,relative,sep,extname} from "node:path";
const reviewExtensions=new Set([".sb2",".sb3",".stl",".obj",".glb",".gltf",".ppt",".pptx",".doc",".docx",".zip",".7z",".mp4",".webm",".mov",".xlsx",".xls"]);
export function reviewStaticAssets(roots){
 if(!Array.isArray(roots)||!roots.length)throw Error("No public artifact roots");
 const entries=[];
 for(const arg of roots){
  const root=resolve(arg);
  if(!existsSync(root)||!lstatSync(root).isDirectory()||lstatSync(root).isSymbolicLink())throw Error("Invalid public artifact root");
  function walk(path){
   const stat=lstatSync(path),name=relative(root,path).split(sep).join("/");
   if(stat.isSymbolicLink()){entries.push({root:arg,path:name,kind:"symlink"});return;}
   if(stat.isDirectory()){for(const child of readdirSync(path))walk(resolve(path,child));return;}
   const ext=extname(name.replace(/\.(?:gz|br)$/i,"")).toLowerCase();
   if(reviewExtensions.has(ext))entries.push({root:arg,path:name,kind:ext.slice(1),bytes:stat.size});
  }
  walk(root);
 }
 return {reviewRequired:entries.length>0,entries,scope:"extension-based diagnostic; images, JS and disguised files need separate review"};
}
