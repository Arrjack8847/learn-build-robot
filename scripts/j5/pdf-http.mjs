// Private storage transport. No public-origin fetch or signed-URL redirect.
const prefix="/api/dev/j5/pdf/";
const chunkSize=256*1024;
const headers={"Cache-Control":"private, no-store, max-age=0","Vary":"Cookie","X-Content-Type-Options":"nosniff","Cross-Origin-Resource-Policy":"same-origin","X-Robots-Tag":"noindex, nofollow"};
const token=x=>typeof x==="string"&&/^[A-Za-z0-9_-]{1,128}$/.test(x);
export function parsePdfRange(header,size){
 if(!Number.isSafeInteger(size)||size<1)return null;
 if(header===null)return {start:0,end:size-1,partial:false};
 const m=/^bytes=(\d*)-(\d*)$/.exec(header);
 if(!m||(!m[1]&&!m[2]))return null;
 const a=m[1]?Number(m[1]):null,b=m[2]?Number(m[2]):null;
 if((a!==null&&!Number.isSafeInteger(a))||(b!==null&&!Number.isSafeInteger(b)))return null;
 if(a===null)return b>0?{start:Math.max(0,size-b),end:size-1,partial:true}:null;
 if(a>=size||(b!==null&&b<a))return null;
 return {start:a,end:b===null?size-1:Math.min(b,size-1),partial:true};
}
export function createPrivatePdfHttp({lookupDocument,getServices,now=Date.now}){
 return async function handle(request,env){
  const fail=(status,extra={})=>new Response(request.method==="HEAD"?null:JSON.stringify({ok:false,code:"PDF_UNAVAILABLE"}),{status,headers:{...headers,...extra,"Content-Type":"application/json; charset=utf-8"}});
  if(env?.VERCEL_ENV!=="preview"||env?.VERCEL_TARGET_ENV==="production"||env?.J5_PRIVATE_ENABLED!=="true")return fail(404);
  if(request.method!=="GET"&&request.method!=="HEAD")return fail(405,{Allow:"GET, HEAD"});
  try{
   const url=new URL(request.url),origin=request.headers.get("origin"),site=request.headers.get("sec-fetch-site");
   if(url.protocol!=="https:"||(origin!==null&&origin!==url.origin)||(site!==null&&site!=="same-origin"&&site!=="none"))return fail(403);
   if(!url.pathname.startsWith(prefix)||url.search||!/^pdf-\d{4}$/.test(url.pathname.slice(prefix.length)))return fail(404);
   const documentId=url.pathname.slice(prefix.length),doc=await lookupDocument(documentId);
   if(doc?.id!==documentId||!Array.isArray(doc.coursePaths)||doc.coursePaths.length===0||doc.coursePaths.some(p=>typeof p!=="string"||!/^\/projects\/[a-z0-9_-]+$/.test(p)))return fail(404);
   const svc=await getServices(env);
   if(typeof svc?.authorize!=="function"||typeof svc?.describe!=="function"||typeof svc?.readChunk!=="function")return fail(503);
   let chosen=null,denied=403;
   async function allowed(path){
    const r=await svc.authorize(request,env,path);
    if(r?.ok===true&&r.code==="COURSE_AUTHORIZED"&&r.status===200&&Number.isSafeInteger(r.validUntil)&&r.validUntil>now())return true;
    if(r?.status===401)denied=401;else if(r?.status===503&&denied!==401)denied=503;
    return false;
   }
   for(const path of doc.coursePaths){if(await allowed(path)){chosen=path;break;}if(denied===401)break;}
   if(!chosen)return fail(denied);
   // Only a server-owned immutable, independently verified private copy may be served.
   const meta=await svc.describe({documentId,signal:request.signal});
   if(meta?.documentId!==documentId||meta.private!==true||meta.verified!==true||!token(meta.version)||! /^[a-f0-9]{64}$/.test(meta.sha256)||!Number.isSafeInteger(meta.size)||meta.size<5)return fail(503);
   if(!await allowed(chosen))return fail(denied);
   const range=parsePdfRange(request.headers.get("range"),meta.size);
   if(!range)return fail(416,{"Content-Range":"bytes */"+meta.size});
   const length=range.end-range.start+1;
   const responseHeaders={...headers,"Content-Type":"application/pdf","Content-Disposition":"inline; filename=\"learning-manual.pdf\"","Accept-Ranges":"bytes","Content-Length":String(length),...(range.partial?{"Content-Range":`bytes ${range.start}-${range.end}/${meta.size}`}:{})};
   if(request.method==="HEAD")return new Response(null,{status:range.partial?206:200,headers:responseHeaders});
   const aborter=new AbortController();
   const onAbort=()=>aborter.abort();
   if(request.signal.aborted)aborter.abort();else request.signal.addEventListener("abort",onAbort,{once:true});
   let position=range.start;
   const cleanup=()=>{request.signal.removeEventListener("abort",onAbort);aborter.abort();};
   const stream=new ReadableStream({
    async pull(controller){
     try{
      if(aborter.signal.aborted||!await allowed(chosen))throw Error("PDF access ended");
      const end=Math.min(position+chunkSize-1,range.end);
      const part=await svc.readChunk({documentId,version:meta.version,start:position,end,signal:aborter.signal});
      if(part?.version!==meta.version||!(part.bytes instanceof Uint8Array)||part.bytes.byteLength!==end-position+1)throw Error("PDF unavailable");
      if(position===0&&part.bytes.byteLength>=5&&String.fromCharCode(...part.bytes.subarray(0,5))!=="%PDF-")throw Error("PDF unavailable");
      if(aborter.signal.aborted||!await allowed(chosen))throw Error("PDF access ended");
      controller.enqueue(part.bytes);position=end+1;
      if(position>range.end){cleanup();controller.close();}
     }catch{cleanup();controller.error(Error("PDF access unavailable"));}
    },cancel(){cleanup();}
   },{highWaterMark:0});
   return new Response(stream,{status:range.partial?206:200,headers:responseHeaders});
  }catch{return fail(503);}
 };
}
// Deliberately disabled until reviewed identity/booking and private storage providers are wired.
export const handleJ5PdfRequest=createPrivatePdfHttp({lookupDocument:async()=>null,getServices:async()=>null});
