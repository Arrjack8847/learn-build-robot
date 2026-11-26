// Vercel-protected private preview only. No real family records or payment permissions.
import {createPreviewOtp} from "../../scripts/parent-auth/preview-otp.mjs";
import {createFamilyPreview} from "../../scripts/parent-auth/family-preview.mjs";
import {createWixStore} from "../../scripts/parent-auth/wix-store.mjs";
import {createAuthCrypto,createTestOtpMailer} from "../../scripts/parent-auth/secure-auth-transport.mjs";
const cookie="__Host-bsr-parent-test";
const cookieFlags="; Path=/; Secure; HttpOnly; SameSite=Strict";
const readCookie=(r:Request)=>{
  const parts=(r.headers.get("cookie")??"").split(";").map(x=>x.trim()).filter(x=>x.startsWith(cookie+"="));
  return parts.length===1?parts[0].slice(cookie.length+1):"";
};
export async function handleParentOtpTest(request:Request,env:NodeJS.ProcessEnv):Promise<Response>{
  const json=(status:number,data:object,setCookie?:string)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff",...(setCookie?{"Set-Cookie":setCookie}:{})}});
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production")return json(404,{ok:false,status:"PREVIEW_ONLY"});
  if(request.method!=="POST")return json(405,{ok:false,status:"METHOD_NOT_ALLOWED"});
  const expected=env.VERCEL_URL?"https://"+env.VERCEL_URL:"";
  if(!expected||new URL(request.url).origin!==expected||request.headers.get("origin")!==expected||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-otp-test")!=="1")return json(403,{ok:false,status:"INVALID_REQUEST"});
  const action=new URL(request.url).pathname.split("/").at(-1);
  if(!["request","verify","status","logout","family-status","family-consent","family-child-get","family-child-create","family-child-edit"].includes(action??""))return json(404,{ok:false,status:"NOT_FOUND"});
  const recipient=env.RESEND_TEST_RECIPIENT?.trim().toLowerCase();
  if(!recipient||!env.WIX_DEV_DATA_API_KEY?.trim()||!env.PARENT_AUTH_SECRET?.trim())return json(503,{ok:false,status:"CONFIGURATION_REQUIRED"});
  try{
    const db=createWixStore(env),crypto=createAuthCrypto(env),clock={now:()=>Date.now()};
    const service=createPreviewOtp({store:db,crypto,mailer:createTestOtpMailer(env),clock,recipient});
    const family=createFamilyPreview({db,crypto,clock,resolveSession:service.resolveIdentity});
    if(action==="family-status"){const result=await family.handle(readCookie(request),action);return json(result.ok?200:401,result);}
    if(action==="status")return json(200,await service.status(readCookie(request)));
    if(action==="logout"){
      const result=await service.logout(readCookie(request));
      return json(200,result,cookie+"=; Max-Age=0"+cookieFlags);
    }
    if(action==="request"){
      const result=await service.requestCode();
      return json(result.ok?200:["LOCKED","HOURLY_LIMIT","COOLDOWN"].includes(result.status)?429:503,result);
    }
    // Read at most 128 bytes, even if Content-Length is omitted.
    if(!request.headers.get("content-type")?.startsWith("application/json")||!request.body)return json(400,{ok:false,status:"INVALID_INPUT"});
    const reader=request.body.getReader();let n=0;const chunks:Uint8Array[]=[];
    try{while(true){const part=await reader.read();if(part.done)break;n+=part.value.byteLength;if(n>(action?.startsWith("family-")?1024:128)){await reader.cancel();return json(400,{ok:false,status:"INVALID_INPUT"});}chunks.push(part.value);}}finally{reader.releaseLock();}
    let body:unknown;try{const bytes=new Uint8Array(n);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.byteLength;}body=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes));}catch{return json(400,{ok:false,status:"INVALID_INPUT"});}
    if(action?.startsWith("family-")){const result=await family.handle(readCookie(request),action,body);return json(result.ok?200:result.status==="NOT_AUTHORIZED"?401:result.status==="NOT_FOUND"?404:result.status==="CONSENT_REQUIRED"?403:result.status.endsWith("CONFLICT")?409:400,result);}
    if(!body||typeof body!=="object"||Array.isArray(body)||Object.keys(body).length!==1||!("code" in body)||typeof body.code!=="string"||!/^\d{6}$/.test(body.code))return json(400,{ok:false,status:"INVALID_INPUT"});
    const result=await service.verifyCode(body.code);
    if(!result.ok)return json(result.status==="LOCKED"?429:400,{ok:false,status:result.status});
    if(!/^[a-zA-Z0-9_-]{43}$/.test(result.token))return json(503,{ok:false,status:"SESSION_UNCONFIRMED"});
    return json(200,{ok:true,status:"VERIFIED"},cookie+"="+result.token+"; Max-Age=43200"+cookieFlags);
  }catch{return json(503,{ok:false,status:"AUTH_UNAVAILABLE"});}
}
