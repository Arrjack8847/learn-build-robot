// Server-only company configuration. No defaults or legacy fallback for new runtime.
export const REQUIRED_SETTINGS=Object.freeze(["HITPAY_API_URL","HITPAY_API_KEY","HITPAY_SALT","HITPAY_PLAN_ID","HITPAY_CURRENCY","HITPAY_MEMBERSHIP_AMOUNT","HITPAY_DEPOSIT_AMOUNT"]);
export function minorUnits(value){
 if(typeof value!=="string"||!/^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/.test(value))throw Error("INVALID_AMOUNT");
 const [whole,frac=""]=value.split(".");const n=Number(whole)*100+Number(frac.padEnd(2,"0"));
 if(!Number.isSafeInteger(n)||n<=0)throw Error("INVALID_AMOUNT");
 return n;
}
export const decimal=n=>{if(!Number.isSafeInteger(n)||n<=0)throw Error("INVALID_AMOUNT");return Math.floor(n/100)+"."+String(n%100).padStart(2,"0");};
export function readCompanyHitPayConfig(env){
 for(const key of REQUIRED_SETTINGS)if(typeof env[key]!=="string"||!env[key].trim()||env[key]!==env[key].trim())throw Error("MISSING_OR_INVALID_"+key);
 const sandbox=env.HITPAY_API_URL==="https://api.sandbox.hit-pay.com",live=env.HITPAY_API_URL==="https://api.hit-pay.com";
 if(!sandbox&&!live)throw Error("INVALID_API_ORIGIN");
 if(sandbox&&env.HITPAY_CURRENCY!=="SGD"||live&&env.HITPAY_CURRENCY!=="MYR")throw Error("CURRENCY_ENVIRONMENT_MISMATCH");
 if(!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(env.HITPAY_PLAN_ID))throw Error("INVALID_PLAN_ID");
 return Object.freeze({environment:sandbox?"sandbox":"live",apiUrl:env.HITPAY_API_URL,apiKey:env.HITPAY_API_KEY,webhookSalt:env.HITPAY_SALT,planId:env.HITPAY_PLAN_ID,currency:env.HITPAY_CURRENCY,membershipMinor:minorUnits(env.HITPAY_MEMBERSHIP_AMOUNT),depositMinor:minorUnits(env.HITPAY_DEPOSIT_AMOUNT)});
}
