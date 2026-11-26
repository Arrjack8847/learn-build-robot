import {randomBytes} from "node:crypto";
import {createJ3FixtureCentre} from "./j3-fixture-centre.mjs";

// Browser-only fictional test environment. No network, cookies or storage.
function boot(createCentre){
 const by=id=>document.getElementById(id);
 let time=Date.UTC(2026,10,26,12),centre=createCentre({clock:()=>time}),payer,student,attempt=null,sequence=0,lastEvent=null;
 const options=(el,rows)=>{el.replaceChildren(...rows.map(x=>{const o=document.createElement("option");o.value=x.id;o.textContent=x.name??x.email;return o}));};
 const msg=s=>{by("message").textContent=s};
 const next=()=>String(++sequence);
 const fmt=n=>new Intl.NumberFormat("en-MY",{style:"currency",currency:"MYR"}).format(n/100);
 function show(){
  const profile=centre.studentProfile(student), history=centre.payerReceipts(payer,by("child").value);
  by("student-name").textContent=profile.student.name;
  by("status").textContent=profile.membershipStatus.replaceAll("_"," ");
  by("coverage").textContent=profile.membership?new Date(profile.membership.validUntil).toISOString().slice(0,10):"—";
  by("date").textContent=new Date(time).toISOString().slice(0,10);
  by("attempt").textContent=attempt?attempt.kind+" · "+fmt(attempt.amountMinor)+" · "+attempt.status:"No checkout selected";
  by("history").replaceChildren(...history.receipts.map(r=>{const li=document.createElement("li");li.textContent=r.kind+" · "+fmt(r.amountMinor)+" · "+r.outcome+" · cycle "+r.cycle;return li}));
  by("notifications").replaceChildren(...history.notifications.map(r=>{const li=document.createElement("li");li.textContent="Example "+r.kind+" "+r.outcome+" confirmation — not sent";return li}));
  by("empty").hidden=history.receipts.length>0;
  by("no-notifications").hidden=history.notifications.length>0;
  const pending=attempt?.status==="pending";
  const canRenew=attempt?.kind==="membership"&&["paid","renewal_failed"].includes(attempt.status)&&profile.membership?.cycle===1&&profile.membership.validUntil<=time;
  by("success").disabled=!pending;by("failed").disabled=!pending;by("return").disabled=!pending;by("replay").disabled=!lastEvent;by("renew").disabled=!canRenew;by("renew-failed").disabled=!canRenew;
 }
 function switchStudent(){
  if(student)centre.closeSession(student);
  student=centre.openSession("student",by("child").value);attempt=null;lastEvent=null;msg("Individual student selected.");show();
 }
 function switchPayer(){
  if(payer)centre.closeSession(payer);
  payer=centre.openSession("payer",by("payer").value);
  options(by("child"),centre.listStudents(payer).students);switchStudent();
 }
 function checkout(kind){
  const r=centre.startCheckout(payer,{studentId:by("child").value,kind,requestKey:"req"+next(),...(kind==="deposit"?{bookingId:"booking-fixture-1"}:{})});
  if(!r.ok){msg(r.error);return}attempt=r.attempt;lastEvent=null;msg(r.duplicate?"Existing checkout reused.":"Simulated checkout opened. No payment confirmed.");show();
 }
 function apply(outcome,cycle=1){
  if(!attempt)return;
  const e={attemptId:attempt.id,eventId:"event"+next(),paymentId:"payment"+next(),outcome,cycle};
  const r=centre.simulate(payer,e);
  if(r.ok){lastEvent=e;attempt=r.attempt??attempt}
  msg(r.ok?"Simulated "+outcome+" outcome recorded.":r.error);show();
 }
 by("payer").addEventListener("change",switchPayer);
 by("child").addEventListener("change",switchStudent);
 by("membership").addEventListener("click",()=>checkout("membership"));
 by("deposit").addEventListener("click",()=>checkout("deposit"));
 by("success").addEventListener("click",()=>apply("paid"));
 by("failed").addEventListener("click",()=>apply("failed"));
 by("renew").addEventListener("click",()=>apply("paid",2));
 by("renew-failed").addEventListener("click",()=>apply("failed",2));
 by("return").addEventListener("click",()=>{if(attempt?.status==="pending"){msg("Returned from fictional checkout. Payment remains pending; no membership granted.");show()}});
 by("replay").addEventListener("click",()=>{if(lastEvent){const r=centre.simulate(payer,lastEvent);msg(r.ok&&r.duplicate?"Duplicate ignored; no extra payment or notification.":r.error??"Unexpected result");show()}});
 by("advance").addEventListener("click",()=>{const d=new Date(time);d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+1);d.setUTCDate(Math.min(new Date(time).getUTCDate(),new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate()));time=d.getTime();msg("Fictional clock advanced one month.");show()});
 by("reset").addEventListener("click",()=>{if(!confirm("Reset all fictional payments in this tab?"))return;time=Date.UTC(2026,10,26,12);centre=createCentre({clock:()=>time});payer=undefined;student=undefined;attempt=null;lastEvent=null;sequence=0;options(by("payer"),centre.fixtures().payers);switchPayer()});
 options(by("payer"),centre.fixtures().payers);switchPayer();
}
export function isJ3TestingPreview(env){
 return env?.VERCEL_ENV==="preview"&&env.VERCEL_TARGET_ENV!=="production"&&env.VERCEL_GIT_COMMIT_REF==="feat/j3-sandbox-payment-20261126";
}
export function handleJ3TestingCentre(request,env){
 const base={"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","X-Frame-Options":"DENY"};
 if(!isJ3TestingPreview(env)||new URL(request.url).pathname!=="/dev/j3-testing-centre")return new Response("Not found",{status:404,headers:base});
 if(request.method!=="GET")return new Response("Method not allowed",{status:405,headers:{...base,Allow:"GET"}});
 const nonce=randomBytes(18).toString("base64");
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>J3 Testing Centre | BE STEM READY</title>
 <style nonce="${nonce}">*{box-sizing:border-box}body{margin:0;background:#f2f8ff;color:#132654;font:16px system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:24px 16px 48px}header{display:flex;align-items:center;gap:12px}header img{width:132px;height:auto}h1{font-size:clamp(26px,5vw,38px);margin:24px 0 8px}h2{font-size:19px;margin:0 0 16px}p{line-height:1.5}small,.muted{color:#52647e}.notice{background:#fff3d6;border:1px solid #e4c78b;border-radius:14px;padding:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}.panel{border:1px solid #dce8f5;background:white;border-radius:22px;padding:20px}label{display:block;font-weight:650;margin:12px 0 6px}select,button{font:inherit;min-height:46px;border-radius:12px;border:1px solid #c5d8ea;padding:10px 12px;background:white;color:#132654}select{width:100%}button{cursor:pointer;font-weight:650}button.primary{background:#096cc0;color:white;border-color:#096cc0}button:disabled{opacity:.45;cursor:not-allowed}button:focus-visible,select:focus-visible{outline:3px solid #1b82db;outline-offset:2px}.actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.price{font-size:25px;font-weight:750}.status{text-transform:capitalize;font-size:24px;font-weight:750}.message{padding:12px;border-radius:12px;background:#e8f4ff;min-height:48px}li{padding:8px 0;overflow-wrap:anywhere}ul{padding-left:20px}.full{grid-column:1/-1}@media(max-width:620px){.grid{grid-template-columns:1fr}.actions{grid-template-columns:1fr}.panel{padding:16px}main{padding-top:16px}}</style></head><body><main><header><img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY"><span class="muted">Private development · J3</span></header><h1>Independent Testing Centre</h1><p class="muted">Touch ’n Go · MYR · Membership &amp; deposit scenarios</p><p class="notice"><strong>Simulation only.</strong> Fictional accounts and payments in this tab. No HitPay requests, real wallet, emails, student access or persistent records. Refresh resets all test data.</p>
 <div class="grid"><section class="panel"><h2>1. Select test identities</h2><label for="payer">Fictional payer</label><select id="payer"></select><label for="child">Individual student</label><select id="child"></select><p class="muted">Five payers, two students each. Payer selection is a test operator control, not a parent dashboard.</p></section>
 <section class="panel"><h2>2. Student membership profile</h2><p id="student-name"></p><p id="status" class="status"></p><p>Valid until: <strong id="coverage"></strong></p><small>Real learning access is always disabled.</small></section>
 <section class="panel"><h2>3. Open fictional checkout</h2><p class="price">RM360 <small>/ month</small></p><p>RM50 booking deposit</p><div class="actions"><button class="primary" id="membership">Membership</button><button id="deposit">Deposit</button></div><p id="attempt"></p></section>
 <section class="panel"><h2>4. Simulate outcomes</h2><div class="actions"><button id="success">Successful payment</button><button id="failed">Failed payment</button><button id="replay">Replay last event</button><button id="return">Return without payment</button><button id="renew">Monthly renewal</button><button id="renew-failed">Failed renewal</button></div><p>Test date: <strong id="date"></strong></p><button id="advance">Advance one month</button></section>
 <div class="message full" role="status" aria-live="polite" id="message"></div>
 <section class="panel"><h2>5. Student-specific payment history</h2><p id="empty" class="muted">No simulated payments.</p><ul id="history"></ul></section>
 <section class="panel"><h2>6. Confirmation previews</h2><p id="no-notifications" class="muted">No confirmation previews.</p><ul id="notifications"></ul><small>Never sent to an email address.</small></section></div><p><button id="reset">Reset all fictional data</button></p></main>
 <script nonce="${nonce}">(${boot.toString()})(${createJ3FixtureCentre.toString()});</script></body></html>`;
 return new Response(html,{status:200,headers:{...base,"Content-Type":"text/html; charset=utf-8","Content-Security-Policy":"default-src 'none'; script-src 'nonce-"+nonce+"'; style-src 'nonce-"+nonce+"'; img-src 'self'; connect-src 'none'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'"}});
}
