// Shared course URL classification; no curriculum content or secrets.
export function classifyCoursePath(path){
 const invalid={scope:"invalid"},outside={scope:"outside"};
 if(typeof path!=="string"||path.length>512||!path.startsWith("/"))return invalid;
 let probe=path;
 for(let i=0;i<3;i++){try{const decoded=decodeURIComponent(probe);if(decoded===probe)break;probe=decoded;}catch{break;}}
 probe=probe.replace(/\\/g,"/").replace(/\/+/g,"/").toLowerCase();
 if(!/^\/(?:practical|projects|quiz)(?:\/|$)/.test(probe))return outside;
 if(!/^\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\/?$/.test(path))return invalid;
 const normalized=path.replace(/\/$/,""),parts=normalized.slice(1).split("/");
 const [root,a,b,c]=parts;
 if(root==="practical"&&(parts.length===1||(parts.length===2&&a==="levels")))return {scope:"shell"};
 if(root==="practical"){
  if(/^level-[1-6]$/.test(a??"")){
   const level=Number(a.slice(6));
   if(parts.length===3&&b==="final-build")return {scope:"protected",kind:"challenge",level};
   if(level===1&&parts.length===2)return {scope:"protected",kind:"level",level};
   if(level===1&&parts.length===3)return {scope:"protected",kind:"category",level,categoryId:b};
   return invalid;
  }
  if(a==="levels"){
   if(!/^[2-6]$/.test(b??""))return invalid;
   const level=Number(b);
   if(parts.length===3)return {scope:"protected",kind:"level",level};
   if(parts.length===4)return {scope:"protected",kind:"category",level,categoryId:c};
   return invalid;
  }
  if(parts.length===2)return {scope:"protected",kind:"activity",projectId:a};
 }
 if((root==="projects"||root==="quiz")&&parts.length===2)return {scope:"protected",kind:root==="quiz"?"quiz":"project",projectId:a};
 return invalid;
}
