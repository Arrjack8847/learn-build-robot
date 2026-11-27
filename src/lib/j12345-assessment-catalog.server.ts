import {getQuizBank} from "@/data/quizStudio";
import {getProject} from "@/data/practical";
import {getVerifiedFinalBuildPool,getVerifiedFinalBuildReference,getVerifiedFinalBuildQuestions} from "@/data/finalBuildVerified";
import {LEVEL_ONE_CATEGORIES} from "@/data/levelOneCategories";
import {getLevelOneProjects} from "@/data/levelOneProjects";
import {pdfActivityManuals} from "@/data/pdfActivityManuals";
import {levelOneToThreeWixPdfUrls} from "@/data/levelOneToThreeWixPdfUrls";
import {LEVEL_ONE_CLEANED_BUILDING_WIX_URLS} from "@/data/levelOneBuildingCleanStatus";
import {ACCELERATION_MANUAL_URL} from "@/data/accelerationCarManual";
import prototypeCrops from "@/data/levelOnePrototypeCrops.json";
type Candidate={projectId:string;variantId:string;title:string;sourceUrl:string;imageUrl:string|null;page:number;crop:{x:number;y:number;width:number;height:number};checks:readonly string[];sourceLimited?:boolean};
export function resolveAssessmentQuiz(id:string,level:number){
 if(getProject(id)?.level!==level)return null;
 return getQuizBank(id)?.questions??null;
}
const originalByUrl=new Map(Object.entries(levelOneToThreeWixPdfUrls).filter(([filename])=>!filename.includes("/")).map(([name,url])=>[url.split("?")[0],name]));
const refs=new Map(prototypeCrops.references.map(c=>[c.filename,c]));
export function resolveAssessmentCandidates(level:number,requirement:unknown):Candidate[]{
 if(level>=2&&level<=6)return getVerifiedFinalBuildPool(level).flatMap(p=>p.variants.flatMap(v=>{const r=getVerifiedFinalBuildReference(level,p.id,v),checks=getVerifiedFinalBuildQuestions(level,p.id,v);return r&&checks.length===5?[{projectId:p.id,variantId:v.id,title:p.name,sourceUrl:r.sourceUrl,imageUrl:r.imageUrl,page:r.page,crop:r.crop,checks,sourceLimited:r.referenceMode==="registered-pdf-fallback"}]:[];}));
 if(level!==1||!requirement||typeof requirement!=="object")return [];
 // Four exact owner-approved self-assessment prompts must come from the pinned policy.
 // Do not silently convert the five provisional legacy checklist items into approved content.
 const checkMap=(requirement as {levelOneChecks?:Record<string,readonly string[]>}).levelOneChecks;
 if(!checkMap)return [];
 return LEVEL_ONE_CATEGORIES.flatMap(category=>getLevelOneProjects(category.id).flatMap(p=>{
  const variants=p.availableProjectId?[p.availableProjectId]:p.availableProjectVariants?.map(v=>v.projectId)??[];
  return variants.flatMap(id=>{
   const source=p.name==="Acceleration car"?ACCELERATION_MANUAL_URL:pdfActivityManuals[id]?.url;
   if(!source)return [];
   const filename=p.name==="Acceleration car"?"Acceleration car_Building.pdf":originalByUrl.get(source.split("?")[0])??decodeURIComponent(source.split("?")[0]?.split("/").pop()??"");
   const r=refs.get(filename),url=LEVEL_ONE_CLEANED_BUILDING_WIX_URLS[filename]??source,checks=checkMap[id];
   return r&&Array.isArray(checks)&&checks.length===4?[{projectId:p.id,variantId:id,title:p.name,sourceUrl:url,imageUrl:null,page:r.page,crop:r.crop,checks}]:[];
  });
 }));
}
