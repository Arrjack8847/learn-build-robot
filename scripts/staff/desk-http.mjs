// J4 HTTP boundary. It is deliberately unavailable until an independently
// verified staff identity, company data adapter and approved policies are supplied.
// No production or personal-account family data is enabled here.
const json=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
const unavailable=()=>json(503,{ok:false,status:"STAFF_BACKEND_NOT_CONNECTED"});
async function readSmallJson(request){
  if(!request.headers.get("content-type")?.startsWith("application/json")||!request.body)throw Error("INVALID_INPUT");
  const reader=request.body.getReader(),chunks=[];let bytes=0;
  try{for(;;){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>4096){await reader.cancel();throw Error("INVALID_INPUT");}chunks.push(part.value);}}
  finally{reader.releaseLock();}
  const buffer=new Uint8Array(bytes);let offset=0;for(const c of chunks){buffer.set(c,offset);offset+=c.byteLength;}
  const body=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(buffer));
  if(!body||typeof body!=="object"||Array.isArray(body))throw Error("INVALID_INPUT");
  return body;
}
export function createDeskHttp({resolveServices}){
  return async function handle(request,env){
    // Scope to the existing authenticated development preview. Do not enable
    // until company hosting is confirmed. Preview protection is not staff auth.
    if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production")return json(404,{ok:false,status:"NOT_FOUND"});
    if(request.method!=="POST")return json(405,{ok:false,status:"METHOD_NOT_ALLOWED"});
    const expected=env.VERCEL_URL?"https://"+env.VERCEL_URL:"";
    if(!expected||new URL(request.url).origin!==expected||request.headers.get("origin")!==expected||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-staff")!=="1")return json(403,{ok:false,status:"REFUSED"});
    const route=new URL(request.url).pathname;
    if(!route.startsWith("/api/dev/staff/"))return json(404,{ok:false,status:"NOT_FOUND"});
    const action=route.slice("/api/dev/staff/".length);
    if(!["overview","correct","walk-in-options","walk-in","register","desk-payment","receipt","audit","sales"].includes(action))return json(404,{ok:false,status:"NOT_FOUND"});
    let services;
    try{services=await resolveServices(request,env);}catch{return unavailable();}
    if(!services)return unavailable();
    // All services independently resolve authenticated staff on every call.
    let input;try{input=await readSmallJson(request);}catch{return json(400,{ok:false,status:"INVALID_INPUT"});}
    try{
      const {admin,desk,registration,clock}=services;
      let result;
      switch(action){
        case "overview":result=await admin.overview(request,clock.localDay());break;
        case "correct":result=await admin.correct(request,input);break;
        case "walk-in-options":result=await desk.walkInOptions(request);break;
        case "walk-in":result=await desk.createWalkIn(request,input);break;
        case "register":result=await registration.registerChild(request,input);break;
        case "desk-payment":result=await registration.recordDeskPayment(request,input);break;
        case "receipt":result=await desk.receipt(request,input.receiptId);break;
        case "audit":result=await registration.auditHistory(request,input.day);break;
        case "sales":result=await admin.monthlySales(request,input.period);break;
      }
      if(!result||typeof result.ok!=="boolean")return unavailable();
      return json(result.ok?200:result.status==="POLICY_REQUIRED"?409:403,result);
    }catch{return unavailable();}
  };
}
// Fail closed: no database or staff session provider is connected.
export const handleStaffDesk=createDeskHttp({resolveServices:async()=>null});
