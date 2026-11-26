// J2 payer-only HTTP boundary. Provider dependencies are injected by the server wrapper.
import {createPreviewOtp} from "./preview-otp.mjs";
import {createFamilyPreview} from "./family-preview.mjs";
const P="__Host-bsr-parent-test",S="__Host-bsr-student",V="__Host-bsr-student-proof";
const flags="; Path=/; Secure; HttpOnly; SameSite=Strict";
const cookie=(name,value,age)=>name+"="+value+"; Max-Age="+age+flags;
const read=(r,name)=>{const matches=(r.headers.get("cookie")??"").split(";").map(x=>x.trim()).filter(x=>x.startsWith(name+"="));return matches.length===1?matches[0].slice(name.length+1):"";};
const validToken=t=>typeof t==="string"&&/^[a-zA-Z0-9_-]{43}$/.test(t);
const exact=(v,keys)=>v&&typeof v==="object"&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
async function readJson(request,limit){
 if(!request.headers.get("content-type")?.startsWith("application/json")||!request.body)throw Error("INVALID_INPUT");
 const reader=request.body.getReader(),decoder=new TextDecoder("utf-8",{fatal:true});let size=0,raw="";
 try{for(;;){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>limit){await reader.cancel();throw Error("INVALID_INPUT");}raw+=decoder.decode(part.value,{stream:true});}return JSON.parse(raw+decoder.decode());}finally{reader.releaseLock();}
}
export function createParentAuthHttp({resolveContext}){
 return async function handle(request,env){
  const json=(status,data,cookies=[])=>{const h=new Headers({"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});for(const c of cookies)h.append("Set-Cookie",c);return new Response(JSON.stringify(data),{status,headers:h});};
  const fail=(status,reason)=>json(status,{ok:false,status:reason});
  if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production")return fail(404,"PREVIEW_ONLY");
  if(request.method!=="POST")return fail(405,"METHOD_NOT_ALLOWED");
  const expected=env.VERCEL_URL?"https://"+env.VERCEL_URL:"",url=new URL(request.url);
  if(!expected||url.origin!==expected||request.headers.get("origin")!==expected||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-otp-test")!=="1")return fail(403,"INVALID_REQUEST");
  const prefix="/api/dev/parent-otp/";
  if(!url.pathname.startsWith(prefix))return fail(404,"NOT_FOUND");
  const action=url.pathname.slice(prefix.length);
  if(!["request","verify","request-email","verify-email","status","logout","family-status","family-consent","family-child-get","family-child-create"].includes(action))return fail(404,"NOT_FOUND");
  try{
   const cfg=await resolveContext(env);if(!cfg)return fail(503,"CONFIGURATION_REQUIRED");
   const {db,crypto,clock,approved,recipient,mailerFor,revokeStudent}=cfg;
   if(!approved.includes(recipient))return fail(503,"CONFIGURATION_REQUIRED");
   const svc=email=>createPreviewOtp({store:db,crypto,clock,recipient:email,mailer:mailerFor(email)});
   const token=read(request,P);
   async function session(t){if(!validToken(t))return null;for(const email of approved){const s=svc(email);if(await s.resolveIdentity(t))return s;}return null;}
   const family=createFamilyPreview({db,crypto,clock,resolveSession:async t=>{const s=await session(t);return s?await s.resolveIdentity(t):null;}});
   const verify=async(s,code)=>{
    const r=await s.verifyCode(code);if(!r.ok)return fail(r.status==="LOCKED"?429:400,r.status);
    if(!validToken(r.token))return fail(503,"SESSION_UNCONFIRMED");
    try{const previous=await session(token);if(previous)await previous.logout(token);const student=read(request,S),proof=read(request,V);if(student||proof){if(typeof revokeStudent!=="function")throw Error("STUDENT_REVOCATION_REQUIRED");await revokeStudent(student,proof);}}
    catch{await s.logout(r.token);return fail(503,"SESSION_UNCONFIRMED");}
    return json(200,{ok:true,status:"VERIFIED"},[cookie(P,r.token,43200),cookie(S,"",0),cookie(V,"",0)]);
   };
   const send=async s=>{const r=await s.requestCode();return json(r.ok?200:["LOCKED","HOURLY_LIMIT","COOLDOWN"].includes(r.status)?429:503,r);};
   if(action==="status")return json(200,{ok:true,status:await session(token)?"VERIFIED":"NOT_VERIFIED"});
   if(action==="logout"){const s=await session(token);if(s)await s.logout(token);return json(200,{ok:true,status:"SIGNED_OUT"},[cookie(P,"",0)]);}
   if(action==="family-status"){const r=await family.handle(token,action);return json(r.ok?200:401,r);}
   if(action==="request")return send(svc(recipient));
   let body;try{body=await readJson(request,action.startsWith("family-")?1024:512);}catch{return fail(400,"INVALID_INPUT");}
   if(action==="request-email"||action==="verify-email"){
    if(!exact(body,action==="request-email"?["email"]:["email","code"])||typeof body.email!=="string")return fail(400,"INVALID_INPUT");
    const email=body.email.trim().toLowerCase();if(!approved.includes(email))return fail(403,"PREVIEW_EMAIL_NOT_APPROVED");
    if(action==="request-email")return send(svc(email));
    if(typeof body.code!=="string"||!/^\d{6}$/.test(body.code))return fail(400,"INVALID_INPUT");
    return await verify(svc(email),body.code);
   }
   if(action.startsWith("family-")){const r=await family.handle(token,action,body);return json(r.ok?200:r.status==="NOT_AUTHORIZED"?401:r.status==="NOT_FOUND"?404:r.status==="CONSENT_REQUIRED"?403:r.status.endsWith("CONFLICT")||r.status==="DUPLICATE_REVIEW_REQUIRED"?409:400,r);}
   if(!exact(body,["code"])||typeof body.code!=="string"||!/^\d{6}$/.test(body.code))return fail(400,"INVALID_INPUT");
   return await verify(svc(recipient),body.code);
  }catch{return fail(503,"AUTH_UNAVAILABLE");}
 };
}
