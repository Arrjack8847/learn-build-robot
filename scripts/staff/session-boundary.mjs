// J4 session resolution and revocation boundary; no credentials or fixture login are mounted.
export function createStaffSessionBoundary({env,store,crypto,clock}){
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production")throw Error("PREVIEW_ONLY");
 const name="__Host-stem-staff";
 const tokenPattern=/^[A-Za-z0-9_-]{43}$/;
 const digestPattern=/^[a-f0-9]{64}$/;
 const staffIdPattern=/^qa-j4-[A-Za-z0-9_-]{1,100}$/;
 const roles=["admin","staff","finance"];
 const readToken=request=>{
   const cookie=request?.headers?.get("cookie");
   if(typeof cookie!=="string"||cookie.length>8192)return null;
   const values=cookie.split(";").map(x=>x.trim()).filter(x=>x.startsWith(name+"="));
   if(values.length!==1)return null;
   const token=values[0].slice(name.length+1);
   return tokenPattern.test(token)?token:null;
 };
 const clearCookie=()=>name+"=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0";
 async function sessionFor(request){
   const token=readToken(request);
   if(!token)return null;
   const digest=crypto.staffSessionDigest(token);
   if(!digestPattern.test(digest))throw Error("INVALID_SESSION_DIGEST");
   const session=await store.readStaffSession(digest);
   if(!session||session.sessionDigest!==digest||session.accountType!=="staff-test"||!staffIdPattern.test(session.staffId)||session.revokedAt!=null||!Number.isSafeInteger(session.expiresAt)||session.expiresAt<=clock.now())return null;
   const account=await store.readStaffAccount(session.staffId);
   if(!account||account.staffId!==session.staffId||account.accountType!=="staff-test"||account.accountStatus!=="active"||!roles.includes(account.role)||typeof account.displayName!=="string"||!account.displayName.trim()||typeof account.authVersion!=="string"||!account.authVersion||account.authVersion!==session.authVersion)return null;
   return {session,account,digest};
 }
 async function resolveStaff(request){
   const state=await sessionFor(request);
   if(!state)return null;
   const {account,session}=state;
   return {subjectType:"staff",staffId:account.staffId,displayName:account.displayName,role:account.role,accountStatus:"active",expiresAt:session.expiresAt,revokedAt:null};
 }
 async function logout(request){
   const state=await sessionFor(request);
   if(!state)return {ok:true,status:"SIGNED_OUT",cookie:clearCookie()};
   // Adapter must atomically revoke the session and append an immutable audit event.
   const committed=await store.revokeStaffSessionAudited({sessionDigest:state.digest,staffId:state.account.staffId,authVersion:state.account.authVersion,occurredAt:clock.now()});
   if(committed?.committed!==true)return {ok:false,status:"REVOCATION_UNCONFIRMED"};
   return {ok:true,status:"SIGNED_OUT",cookie:clearCookie()};
 }
 return {resolveStaff,logout};
}
