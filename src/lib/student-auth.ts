export type StudentChoice={id:string;name:string};
type Reply={ok:boolean;status:string;students?:StudentChoice[];student?:StudentChoice};
export async function studentAuth(action:string,body?:object):Promise<Reply>{
 try{const response=await fetch("/api/dev/student-auth/"+action,{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"X-STEM-Student-Auth":"1",...(body?{"Content-Type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(typeof data?.ok!=="boolean"||typeof data.status!=="string")throw Error();return data;}
 catch{return {ok:false,status:"AUTH_UNAVAILABLE"};}
}
export function studentAuthError(status:string){return ({CONFIGURATION_REQUIRED:"Student sign-in is not enabled in this private test yet.",AUTH_UNAVAILABLE:"The service is temporarily unavailable.",COOLDOWN:"Wait 60 seconds before requesting another code.",LOCKED:"Too many attempts. Try again later.",ALREADY_ENROLLED:"This student's PIN has already been set.",INVALID_INPUT:"Choose a six-digit PIN that is not a common sequence.",SIGN_IN_REFUSED:"Unable to verify. Check your details or sign in again."} as Record<string,string>)[status]??"Request could not be confirmed. Please retry.";}
