// One-time sandbox-only network probe; no valid signatures or payment data.
const e=process.env;
if(e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF==="feat/wix-lms-integration-20261125"&&e.VERCEL_GIT_COMMIT_MESSAGE==="J3: verify published Wix receiver and exact webhook core fixtures"){
 const url="https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox";
 for(const [label,method,signature] of [["GET","GET",null],["unsigned","POST",null],["forged","POST","0".repeat(64)]]){
  try{const res=await fetch(url,{method,headers:{Accept:"application/json",...(method==="POST"?{"Content-Type":"application/json"}:{}),...(signature?{"hitpay-signature":signature}:{})},...(method==="POST"?{body:'{"id":"qa-unsigned-probe"}'}:{}),redirect:"manual",cache:"no-store",signal:AbortSignal.timeout(15000)});let okFalse=false;try{const body=await res.json();okFalse=body?.ok===false}catch{}console.log("[J3 Wix probe] "+label+" HTTP "+res.status+" rejected="+okFalse)}catch{console.log("[J3 Wix probe] "+label+" UNAVAILABLE")}
 }
}
