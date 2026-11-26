// Dependency-injected private student authentication HTTP boundary.
const payerCookie="__Host-bsr-parent-test",proofCookie="__Host-bsr-student-proof",studentCookie="__Host-bsr-student";
const flags="; Path=/; Secure; HttpOnly; SameSite=Strict";
const cookie=(name,value,age)=>name+"="+value+"; Max-Age="+age+flags;
const read=(request,name)=>{const parts=(request.headers.get("cookie")??"").split(";").map(p=>p.trim()).filter(p=>p.startsWith(name+"="));return parts.length===1?parts[0].slice(name.length+1):"";};
const exact=(v,keys)=>!!v&&typeof v==="object"&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const tokenValid=(t)=>/^[a-zA-Z0-9_-]{43}$/.test(t);
export function createStudentAuthHttp({resolveContext}){
 return async function handleStudentAuth(request,env){
 const json=(status,data,cookies=[])=>{const headers=new Headers({"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});for(const c of cookies)headers.append("Set-Cookie",c);return new Response(JSON.stringify(data),{status,headers});};
 const fail=(status=401)=>json(status,{ok:false,status:"SIGN_IN_REFUSED"});
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production")return json(404,{ok:false,status:"PREVIEW_ONLY"});
 const origin=env.VERCEL_URL?"https://"+env.VERCEL_URL:"";
 if(request.method!=="POST"||!origin||new URL(request.url).origin!==origin||request.headers.get("origin")!==origin||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-student-auth")!=="1")return fail(403);
 const action=new URL(request.url).pathname.split("/").at(-1);
 if(!["request","verify","list","enroll","enrollment-status","sign-in","status","logout"].includes(action??""))return fail(404);
 // Deliberately disabled until dev schema, proof adapter and preview-only secret are verified.
 if(env.STUDENT_AUTH_ENABLED!=="true")return json(503,{ok:false,status:"CONFIGURATION_REQUIRED"});
 try{
  const {db,emails,context}=await resolveContext(env);
  const {identity,svc,locate,proof,familyFor,rate}=context;
  const p=read(request,payerCookie),v=read(request,proofCookie),s=read(request,studentCookie);
  if(action==="status"){const session=await identity.resolveStudentSession(s);if(!session)return json(200,{ok:true,status:"NOT_VERIFIED"},[cookie(studentCookie,"",0)]);const row=await db.get("Children",session.studentId);return json(200,{ok:true,status:"VERIFIED",student:{id:session.studentId,name:row.name},learningAccess:"UNAVAILABLE"});}
  if(action==="logout"){await identity.logout(s);const existing=await locate(v,true);if(existing)await existing.service.logout(v);return json(200,{ok:true,status:"SIGNED_OUT"},[cookie(studentCookie,"",0),cookie(proofCookie,"",0)]);}
  if(action==="list"){const identity=await proof(v);if(!identity)return fail();const r=await familyFor(identity.parentId).handle("internal","family-status");if(!r.ok||r.status!=="FAMILY_READY")return fail();return json(200,{ok:true,status:"SELECT_STUDENT",students:r.children.map((x)=>({id:x.id,name:x.name}))});}
  if(!request.headers.get("content-type")?.startsWith("application/json")||!request.body)return fail(400);
  const reader=request.body.getReader(),decoder=new TextDecoder("utf-8",{fatal:true});let bytes=0,raw="";
  try{while(true){const r=await reader.read();if(r.done)break;bytes+=r.value.byteLength;if(bytes>512){await reader.cancel();return fail(400);}raw+=decoder.decode(r.value,{stream:true});}raw+=decoder.decode();}finally{reader.releaseLock();}
  let body;try{body=JSON.parse(raw);}catch{return fail(400);}
  if(action==="request"||action==="verify"){
   if(!exact(body,action==="request"?["email"]:["email","code"])||typeof body.email!=="string")return fail(400);
   const email=body.email.trim().toLowerCase();if(!emails.includes(email))return fail(403);
   const candidate=svc(email,true);
   if(action==="request"){const r=await candidate.requestCode();return json(r.ok?200:["LOCKED","COOLDOWN","HOURLY_LIMIT"].includes(r.status)?429:503,r);}
   if(typeof body.code!=="string"||!/^\d{6}$/.test(body.code))return fail(400);
   const r=await candidate.verifyCode(body.code);if(!r.ok)return json(r.status==="LOCKED"?429:400,{ok:false,status:r.status});
   if(typeof r.token!=="string"||!tokenValid(r.token))return fail();
   try{const old=await locate(v,true);if(old)await old.service.logout(v);}
   catch{await candidate.logout(r.token);return fail(503);}
   return json(200,{ok:true,status:"EMAIL_VERIFIED"},[cookie(proofCookie,r.token,300)]);
  }
  if(action==="enrollment-status"){
   if(!exact(body,["studentId"])||typeof body.studentId!=="string")return fail(400);
   const r=await identity.enrollmentStatus(p,body.studentId);return json(r.ok?200:403,r);
  }
  if(!exact(body,["studentId","pin"])||typeof body.studentId!=="string"||typeof body.pin!=="string")return fail(400);
  if(action==="enroll"){if(!await rate.reserve("global","private-preview-enroll",20,60000))return fail(429);const r=await identity.enroll(p,body.studentId,body.pin);return json(r.ok?200:403,r);}
  if(action==="sign-in"){
   if(!await rate.reserve("global","private-preview-pin",60,60000))return fail(429);
   const r=await identity.signIn(v,body.studentId,body.pin);
   if(!r.ok||typeof r.token!=="string"||!tokenValid(r.token))return fail();
   try{const oldPayer=await locate(p,false);if(oldPayer)await oldPayer.service.logout(p);await identity.logout(s);}
   catch{await identity.logout(r.token);return fail(503);}
   return json(200,{ok:true,status:"VERIFIED"},[cookie(studentCookie,r.token,14400),cookie(proofCookie,"",0),cookie(payerCookie,"",0)]);
  }
  return fail(404);
 }catch{return json(503,{ok:false,status:"AUTH_UNAVAILABLE"});}
}
}
