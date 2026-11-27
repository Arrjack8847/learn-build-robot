import {classifyCoursePath} from "../../src/lib/j5-course-path.mjs";
const api="/api/dev/j5/course-access";
const headers={"Cache-Control":"private, no-store, max-age=0","Vary":"Cookie","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex, nofollow"};
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{...headers,"Content-Type":"application/json; charset=utf-8"}});
const page=(status,code)=>new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Learning access</title><main style="font-family:system-ui;max-width:32rem;margin:3rem auto;padding:1rem"><h1>Learning access</h1><p>${code==="STUDENT_AUTH_REQUIRED"?"Please sign in to continue.":code==="MEMBERSHIP_REQUIRED"?"An active membership is required.":code==="CHECK_IN_REQUIRED"?"Please check in at the Lab.":code==="LEVEL_LOCKED"?"This level is not available yet.":code==="LEARNING_POLICY_REQUIRED"?"Learning access is awaiting the approved session policy.":"This learning page is not available right now."}</p><p><a href="/student/dashboard">My profile</a> · <a href="/practical/levels">Learning levels</a> · <a href="/auth/">Sign in</a></p></main></html>`,{status,headers:{...headers,"Content-Type":"text/html; charset=utf-8"}});
export function createCourseHttp({getAuthority}){
 return async function handle(request,env,next){
  const url=new URL(request.url),isApi=url.pathname===api;
  const route=classifyCoursePath(url.pathname);
  const configured=env?.J5_PRIVATE_ENABLED==="true"||env?.VITE_J5_PRIVATE_UI==="true";
  if(!isApi&&(!configured||route.scope==="outside"||route.scope==="shell"))return next();
  const refuse=(status,code)=>isApi?json(status,{ok:false,code}):page(status,code);
  if(env?.VERCEL_ENV!=="preview"||env?.VERCEL_TARGET_ENV==="production"||env?.J5_PRIVATE_ENABLED!=="true")return refuse(404,"NOT_AVAILABLE");
  if(request.method!=="GET"&&(!isApi&&request.method!=="HEAD"))return refuse(405,"METHOD_NOT_ALLOWED");
  if(isApi&&request.method!=="GET")return refuse(405,"METHOD_NOT_ALLOWED");
  let path=url.pathname;
  if(isApi){
   const origin=request.headers.get("origin"),site=request.headers.get("sec-fetch-site");
   if(url.protocol!=="https:"||(origin!==null&&origin!==url.origin)||(site!==null&&site!=="same-origin"&&site!=="none")||request.headers.get("x-stem-j5")!=="1")return refuse(403,"REQUEST_REFUSED");
   if(url.searchParams.size!==1||!url.searchParams.has("path"))return refuse(400,"REQUEST_REFUSED");
   path=url.searchParams.get("path");
  }
  if(classifyCoursePath(path).scope!=="protected")return refuse(404,"COURSE_UNAVAILABLE");
  try{
   const authorize=await getAuthority(env);
   if(typeof authorize!=="function")return refuse(503,"COURSE_UNAVAILABLE");
   const result=await authorize(request,env,path);
   const allowed=result?.ok===true&&result.status===200&&result.code==="COURSE_AUTHORIZED"&&Number.isSafeInteger(result.validUntil)&&result.validUntil>0;
   if(!allowed)return refuse([401,403,404,503].includes(result?.status)?result.status:503,["STUDENT_AUTH_REQUIRED","MEMBERSHIP_REQUIRED","CHECK_IN_REQUIRED","LEVEL_LOCKED","LEARNING_POLICY_REQUIRED","COURSE_UNAVAILABLE"].includes(result?.code)?result.code:"COURSE_UNAVAILABLE");
   if(isApi)return json(200,{ok:true,code:"COURSE_AUTHORIZED",validUntil:result.validUntil});
   const response=await next();
   const responseHeaders=new Headers(response.headers);
   for(const [key,value] of Object.entries(headers))responseHeaders.set(key,key==="Vary"&&responseHeaders.has(key)?responseHeaders.get(key)+", Cookie":value);
   return new Response(request.method==="HEAD"?null:response.body,{status:response.status,statusText:response.statusText,headers:responseHeaders});
  }catch{return refuse(503,"COURSE_UNAVAILABLE");}
 };
}
export const handleJ5CourseRequest=createCourseHttp({getAuthority:async()=>null});
