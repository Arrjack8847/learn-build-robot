// A separate capability for the protected fictional test preview. Not a staff account,
// role selector, production staff authorization, or bypass of deployment protection.
import {timingSafeEqual} from "node:crypto";
import {isJ1234Preview,createJ1234IdentityEnv} from "./identity-scope.mjs";
const valid=x=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x)&&new Set(Buffer.from(x,"hex")).size>=8;
export function operatorAccess(request,env){
 if(!isJ1234Preview(env)||env.J1234_TEST_OPERATOR_ENABLED!=="1")return 404;
 try{
  const identity=createJ1234IdentityEnv(env),key=env.J1234_TEST_OPERATOR_SECRET;
  if(!valid(key)||[env.J1234_AUTH_ROOT,env.PARENT_AUTH_SECRET,env.STUDENT_AUTH_SECRET,identity.PARENT_AUTH_SECRET,identity.STUDENT_AUTH_SECRET,env.J123_MEMBERSHIP_WORKER_SECRET].some(x=>typeof x==="string"&&x.toLowerCase()===key))return 503;
  // Header is not itself authority: exact secret and deployment scope are mandatory.
  // Reject mixed actor cookies as defense in depth, never as primary authorization.
  if((request.headers.get("cookie")??"").split(";").some(p=>/^__Host-bsr-(?:student|student-proof|parent-test)\s*=/.test(p.trim())))return 403;
  const supplied=request.headers.get("x-stem-j1234-operator");
  if(!valid(supplied)||!timingSafeEqual(Buffer.from(supplied,"hex"),Buffer.from(key,"hex")))return 403;
  return 200;
 }catch{return 503;}
}
