import {useEffect,useState} from "react";
type Child={id:string;name:string;birthYear:number;version:string};
type Result={ok:boolean;status:string;noticeVersion?:string;children?:Child[];child?:Child};
async function call(action:string,body?:object):Promise<Result>{
 const r=await fetch("/api/dev/parent-otp/"+action,{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"X-STEM-OTP-Test":"1",...(body?{"Content-Type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})});
 return r.json();
}
const button="rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-40";
export function ParentFamilyTest(){
 const [state,setState]=useState<Result|null>(null),[busy,setBusy]=useState(true),[error,setError]=useState(""),[accepted,setAccepted]=useState(false),[name,setName]=useState("Test Child"),[year,setYear]=useState("2018"),[edit,setEdit]=useState<Child|null>(null),[requestKey,setRequestKey]=useState("");
 async function refresh(){const r=await call("family-status");setState(r);if(!r.ok)setError("Session unavailable. Sign in again.");}
 useEffect(()=>{refresh().catch(()=>setError("Could not load Wix profiles.")).finally(()=>setBusy(false));},[]);
 async function act(action:string,body:object){if(busy)return;setBusy(true);setError("");try{const r=await call(action,body);if(!r.ok){setError(r.status==="EDIT_CONFLICT"?"Profile changed. Reload and try again.":r.status);return;}await refresh();setEdit(null);setRequestKey("");setName("Test Child");}catch{setError("Request unconfirmed. Reload before retrying.");}finally{setBusy(false);}}
 return <section className="space-y-4 rounded-2xl border border-sky-100 bg-sky-50 p-4">
  <h2 className="text-lg font-black">Wix family test</h2><p className="text-xs text-slate-600">Verified test session only. Fictional data, no real children or live payment access.</p>
  {state?.status==="CONSENT_REQUIRED"&&<><p className="text-sm">Development notice: fictional parent and child details are stored in the private Wix development database for testing. This is not the company-approved privacy notice.</p><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/>Accept fictional test notice</label><button className={button} disabled={busy||!accepted} onClick={()=>act("family-consent",{accepted:true,noticeVersion:state.noticeVersion})}>Save test consent</button></>}
  {state?.status==="FAMILY_READY"&&<><div className="space-y-2">{state.children?.map(c=><div key={c.id} className="flex items-center justify-between rounded-xl bg-white p-3"><div><strong>{c.name}</strong><p className="text-xs">{c.birthYear}</p></div><button className="text-sm font-bold text-sky-700" disabled={busy} onClick={()=>{setEdit(c);setName(c.name);setYear(String(c.birthYear));}}>Edit</button></div>)}</div>
   <form className="space-y-2" onSubmit={e=>{e.preventDefault();if(edit){void act("family-child-edit",{childId:edit.id,version:edit.version,name,birthYear:Number(year)});}else{const key=requestKey||crypto.randomUUID();setRequestKey(key);void act("family-child-create",{name,birthYear:Number(year),requestKey:key});}}}><label className="block text-sm font-bold">Fictional child name<input className="mt-1 w-full rounded-lg border bg-white p-2" value={name} onChange={e=>setName(e.target.value)} required maxLength={48}/></label><label className="block text-sm font-bold">Birth year<input className="mt-1 w-full rounded-lg border bg-white p-2" value={year} onChange={e=>setYear(e.target.value)} inputMode="numeric" maxLength={4} required/></label><button type="submit" className={button} disabled={busy}>{edit?"Save changes":"Add test child"}</button>{edit&&<button type="button" className="ml-2 text-sm" onClick={()=>{setEdit(null);setName("Test Child");}}>Cancel</button>}</form></>}
  {busy&&<p className="text-sm">Loading…</p>}{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
 </section>;
}
