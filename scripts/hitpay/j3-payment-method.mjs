// Explicit provider fields only; do not infer actual charge method from a configured wallet.
export function normalizePaymentMethod(value){
 if(typeof value!=="string")return null;
 const name=value.toLowerCase().replace(/[^a-z0-9]/g,"");
 if(["touchngo","tng","touchngoewallet","touchngowallet"].includes(name))return "touch_n_go";
 return name||null;
}
export function reconcilePaymentMethod(charge){
 const p=charge?.payment_method, candidates=[typeof p==="string"?p:null,p?.name,p?.code,p?.method,p?.type,p?.method_logo?.method,p?.display_logo?.method,charge?.payment_provider?.charge?.method,charge?.method,charge?.payment_method_type].map(normalizePaymentMethod).filter(Boolean);
 const explicit=candidates.filter(x=>!["wallet","ewallet","onlinewallet","paymentmethod","card","other","unknown"].includes(x));
 return {verified:explicit.length>0&&explicit.every(x=>x==="touch_n_go"),hasExplicit:explicit.length>0,conflict:explicit.some(x=>x!=="touch_n_go")};
}
export function legacyIsolated(env){
 return ["HITPAY_API_KEY","HITPAY_SALT_KEY","HITPAY_API_BASE_URL"].every(k=>env[k]==="DISABLED_J3_WIX_VAULT_ONLY");
}
