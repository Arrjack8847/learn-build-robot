export type Child={id:string;name:string;birthYear:number;version:string};
export type PortalResult={ok:boolean;status:string;noticeVersion?:string;children?:Child[];child?:Child};
export async function portal(action:string,body?:object):Promise<PortalResult>{
 const r=await fetch("/api/dev/parent-otp/"+action,{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"X-STEM-OTP-Test":"1",...(body?{"Content-Type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})});
 return r.json();
}
export const errorMessage=(status:string)=>({
 PREVIEW_EMAIL_NOT_APPROVED:"This preview is using restricted test mode. Open the latest development deployment.",
 INVALID_EMAIL:"Enter a valid email address.",
 PREVIEW_EMAIL_BUDGET:"The private testing email limit has been reached. Try again later.",
 COOLDOWN:"Please wait 60 seconds before requesting another code.",
 LOCKED:"Too many incorrect codes. Try again in 15 minutes.",
 HOURLY_LIMIT:"Too many code requests. Try again later.",
 INVALID_OR_EXPIRED:"Incorrect, expired or already used code.",
 INVALID_INPUT:"Check the information you entered.",
 INVALID_NAME:"Enter a name of 1–48 characters using letters, spaces, apostrophes, periods or hyphens.",
 INVALID_BIRTH_YEAR:"Enter a valid birth year (1900 to the current year).",
 DELIVERY_UNCONFIRMED:"Email delivery could not be confirmed. Please wait before retrying.",
 NOT_AUTHORIZED:"Your session has ended. Please sign in again.",
 CONSENT_REQUIRED:"Please accept the test privacy notice.",
 EDIT_CONFLICT:"This profile changed. Reload and try again.",
 REQUEST_CONFLICT:"This request conflicts with an existing profile. Reload before trying again.",
 PREVIEW_ONLY:"Parent registration is not available outside the private preview.",
 CONFIGURATION_REQUIRED:"The private preview is not configured.",
 INVALID_REQUEST:"Please open the exact preview deployment link.",
 AUTH_UNAVAILABLE:"The authentication service is temporarily unavailable."
} as Record<string,string>)[status]??"We couldn't confirm the request. Please try again.";
