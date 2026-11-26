// One-time unsigned/forged sandbox receiver probe; no secrets, no payments.
const e=process.env;
if(e.VERCEL_ENV==='preview'&&e.VERCEL_TARGET_ENV!=='production'&&e.VERCEL_GIT_COMMIT_REF==='feat/j3-sandbox-payment-20261126'&&e.VERCEL_GIT_COMMIT_MESSAGE==='J3: harden eight-event receiver ownership and run unsigned probe'){
 const url='https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox';
 for(const [name,sig] of [['unsigned',null],['forged','0'.repeat(64)]]){
  try{const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json','hitpay-event-object':'qa_synthetic','hitpay-event-type':'ignored',...(sig?{'hitpay-signature':sig}:{})},body:JSON.stringify({id:'qa-j3-unsigned-probe'}),redirect:'error',cache:'no-store',signal:AbortSignal.timeout(10000)});console.log('[J3 receiver security] '+name+' HTTP '+r.status+' '+(r.status===401?'REJECTED':'UNVERIFIED'));}catch{console.log('[J3 receiver security] '+name+' UNAVAILABLE')}
 }
}
