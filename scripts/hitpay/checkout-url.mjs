// Exact HTTPS sandbox checkout origins observed in HitPay's authenticated API.
// Browser and server use the same rule; never allow wildcard fly.dev hosts.
export function isAllowedSandboxCheckoutUrl(value){
 if(typeof value!=="string")return false;
 try{const u=new URL(value);return u.protocol==="https:"&&["securecheckout.sandbox.hit-pay.com","hitpay-billing-sandbox.fly.dev"].includes(u.hostname)&&!u.username&&!u.password&&!u.port;}catch{return false}
}
