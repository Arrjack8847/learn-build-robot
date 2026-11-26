// J5 private HTTP adapter factory. No credential or provider implementation.
export function createJ5Http({getServices,parseOrigin,respond}){
 const out=(status,body)=>respond(status,body,{"Cache-Control":"private, no-store, max-age=0","Content-Type":"application/json; charset=utf-8","X-Content-Type-Options":"nosniff","Vary":"Cookie"});
 const fail=(status,code)=>out(status,{ok:false,code});
 async function readCode(request){
  if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type")??""))return null;
  const declared=request.headers.get("content-length");
  if(declared!==null&&(!/^\d+$/.test(declared)||Number(declared)>256))return null;
  const reader=request.body?.getReader();
  if(!reader)return null;
  let size=0,bytes=[];
  try{
   while(true){const r=await reader.read();if(r.done)break;size+=r.value.byteLength;if(size>256){await reader.cancel();return null;}bytes.push(...r.value);}
   if(bytes.some(x=>x>127))return null;
   const parsed=JSON.parse(String.fromCharCode(...bytes));
   if(!parsed||typeof parsed!=="object"||Array.isArray(parsed)||Object.keys(parsed).length!==1||typeof parsed.code!=="string"||!/^\d{8}$/.test(parsed.code))return null;
   return parsed;
  }catch{return null;}finally{reader.releaseLock();}
 }
 return async function handle(request,env,path){
  if(env?.VERCEL_ENV!=="preview"||env?.VERCEL_TARGET_ENV==="production"||env?.J5_PRIVATE_ENABLED!=="true")return fail(404,"NOT_AVAILABLE");
  try{
   if(path!=="/api/dev/j5/overview"&&path!=="/api/dev/j5/check-in")return fail(404,"NOT_AVAILABLE");
   const check=path.endsWith("/check-in");
   if(request.method!==(check?"POST":"GET"))return fail(405,"METHOD_NOT_ALLOWED");
   const origin=parseOrigin(request.url);
   const header=request.headers.get("origin");
   const site=request.headers.get("sec-fetch-site");
   if(!origin||!origin.startsWith("https://")||(header!==null&&header!==origin)||(site!==null&&!["same-origin","none"].includes(site))||(check&&(header!==origin||request.headers.get("x-stem-j5")!=="1")))return fail(403,"REQUEST_REFUSED");
   const input=check?await readCode(request):null;
   if(check&&!input)return fail(400,"CHECK_IN_REFUSED");
   const svc=await getServices(env);
   if(!svc)return fail(503,"SERVICE_UNAVAILABLE");
   // Pass the original Request to the trusted identity resolver (cookie headers intact).
   // The boundary receives a server-created wrapper, not arbitrary JSON fields.
   const result=check?await svc.checkIn.verify({method:"POST",sameOrigin:true,originalRequest:request},env,input):await svc.overview.load(request,env);
   if(result?.ok===true){
    if(check)return out(200,{ok:true,code:"CHECK_IN_VERIFIED",validUntil:result.validUntil});
    return out(200,{ok:true,profile:result.profile,levels:result.levels});
   }
   const status=[400,401,403,404,503].includes(result?.status)?result.status:503;
   const code=check?(status===401?"STUDENT_AUTH_REQUIRED":status===503?"CHECK_IN_UNAVAILABLE":"CHECK_IN_REFUSED"):(status===401?"STUDENT_AUTH_REQUIRED":status===403?"STUDENT_UNAVAILABLE":"SERVICE_UNAVAILABLE");
   return fail(status,code);
  }catch{return fail(503,"SERVICE_UNAVAILABLE");}
 };
}
export const handleJ5Http=createJ5Http({getServices:async()=>null,parseOrigin:url=>new URL(url).origin,respond:(status,body,headers)=>new Response(JSON.stringify(body),{status,headers})});
