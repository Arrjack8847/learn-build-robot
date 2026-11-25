// Run: node tests/parent-preview-otp.test.mjs
import {createPreviewOtp} from "../scripts/parent-auth/preview-otp.mjs";
async function scenarios(createPreviewOtp){
 const db=new Map(),mail=[],checks=[];let now=1795560000000,version=0,codes=0,tokens=0;const clone=x=>JSON.parse(JSON.stringify(x));const key=(c,id)=>c+":"+id;
 const store={async get(c,id){const row=db.get(key(c,id));return row?clone(row):null},async insert(c,id,row){if(db.has(key(c,id)))return false;db.set(key(c,id),clone(row));return true},async replaceIfVersion(c,id,v,row){if(db.get(key(c,id))?.stateVersion!==v)return false;db.set(key(c,id),clone(row));return true}};
 const crypto={identityDigest:(type,email)=>type+"-fixture",codeDigest:(i,c,code)=>"digest:"+i+":"+c+":"+code,constantTimeEqual:(a,b)=>a===b,sixDigits:()=>String(++codes).padStart(6,"0"),newVersion:()=>String(++version).padStart(32,"0"),sessionToken:()=>String(++tokens).padStart(43,"0"),sessionDigest:token=>"hashed-"+token};
 const svc=createPreviewOtp({store,crypto,mailer:{async sendParentCode(email,code,ttl,id){mail.push({email,code,ttl,id})}},clock:{now:()=>now},recipient:"test@example.invalid"});
 const check=(cond,label)=>{if(!cond)throw Error(label);checks.push(label)};
 check((await svc.status("")).status==="NOT_VERIFIED","no session by default");
 let res=await Promise.all([svc.requestCode(),svc.requestCode()]);
 check(mail.length===1&&res.filter(r=>r.status==="CODE_SENT").length===1,"concurrent code request sends once");
 check(!Object.hasOwn(res.find(r=>r.ok),"code"),"OTP not returned to client");
 check((await svc.requestCode()).status==="COOLDOWN","resend cooldown");
 check((await svc.verifyCode("999999")).status==="INVALID_OR_EXPIRED","invalid code rejected");
 now+=61000;await svc.requestCode();check(mail.length===2,"resend after cooldown");
 check((await svc.verifyCode(mail[0].code)).status==="INVALID_OR_EXPIRED","previous code invalidated");
 for(let i=0;i<2;i++)await svc.verifyCode("999999");
 check((await svc.verifyCode("999999")).status==="LOCKED","five total wrong attempts across resend lock");
 check((await svc.verifyCode(mail[1].code)).status==="LOCKED","correct code refused during lock");
 check((await svc.requestCode()).status==="LOCKED","resend cannot bypass lock");
 now+=900001;check((await svc.requestCode()).ok,"request after lock expires");
 const latest=mail.at(-1).code;
 const results=await Promise.all([svc.verifyCode(latest),svc.verifyCode(latest)]);
 check(results.filter(r=>r.status==="VERIFIED").length===1,"parallel verification consumes code once");
 const token=results.find(r=>r.ok).token;
 check((await svc.status(token)).status==="VERIFIED","persisted test session resolves");
 check([...db.entries()].filter(([k])=>k.startsWith("AuthSessions:")).every(([k,row])=>!k.endsWith(":"+token)&&row.sessionDigest!==token&&row.accountType==="parent-test"),"only hashed isolated session stored");
 check((await svc.status("x".repeat(43))).status==="NOT_VERIFIED","forged session refused");
 check((await svc.logout(token)).status==="SIGNED_OUT"&&(await svc.status(token)).status==="NOT_VERIFIED","logout revokes stored session");
 now+=61000;await svc.requestCode();now+=61000;await svc.requestCode();now+=61000;
 check((await svc.requestCode()).status==="HOURLY_LIMIT"&&mail.length===5,"global hourly quota enforced");
 now+=3600001;await svc.requestCode();now+=300001;
 check((await svc.verifyCode(mail.at(-1).code)).status==="INVALID_OR_EXPIRED","expired code refused");
 await svc.requestCode();const next=await svc.verifyCode(mail.at(-1).code);check(next.ok,"new challenge succeeds");
 now+=43200001;check((await svc.status(next.token)).status==="NOT_VERIFIED","session expiry enforced");
 return checks;
}
const checks=await scenarios(createPreviewOtp);for(const c of checks)console.log("PASS "+c);console.log(checks.length+" fixture checks passed");
