import {test} from "node:test";
import {createSessionLifecycle,createLogoutRequest} from "../src/lib/j5-session-lifecycle.mjs";
function cases(makeController){
 const eq=(a,b)=>{if(a!==b)throw Error(`Expected ${b}, got ${a}`)};
 const make=(sendLogout=async()=>({ok:true,status:"SIGNED_OUT"}),notify=()=>{})=>createSessionLifecycle({sendLogout,notify,makeController});
 return [
 ["invalidation aborts stale reads",async()=>{const s=make(),a=s.begin(),b=s.begin();s.invalidate();eq(a.signal.aborted,true);eq(b.current(),false);eq(s.begin().current(),true)}],
 ["old completion invalid after switch",async()=>{const s=make(),a=s.begin();s.invalidate(true);eq(a.current(),false);eq(s.begin().current(),false)}],
 ["logout locks and aborts",async()=>{let release;const s=make(()=>new Promise(r=>release=r));const a=s.begin(),p=s.logout();eq(a.current(),false);eq(s.isBlocked(),true);await Promise.resolve();release({ok:true,status:"SIGNED_OUT"});eq(await p,true)}],
 ["failed logout stays locked and permits retry",async()=>{let calls=0;const s=make(async()=>++calls===1?{ok:false,status:"AUTH_UNAVAILABLE"}:{ok:true,status:"SIGNED_OUT"});eq(await s.logout(),false);eq(s.begin().current(),false);eq(await s.logout(),true);eq(calls,2)}],
 ["incorrect success status refused",async()=>eq(await make(async()=>({ok:true,status:"VERIFIED"})).logout(),false)],
 ["network error not confirmation",async()=>eq(await make(async()=>{throw Error("network")}).logout(),false)],
 ["duplicate logout coalesced",async()=>{let count=0;const s=make(async()=>{count++;return {ok:true,status:"SIGNED_OUT"}});const a=s.logout(),b=s.logout();eq(a,b);eq(await a,true);eq(count,1)}],
 ["cross-tab signal locks",async()=>{const other=make(),a=other.begin(),s=make(undefined,()=>other.invalidate(true));await s.logout();eq(a.current(),false);eq(other.isBlocked(),true)}],
 ["notification failure preserves lock",async()=>{const s=make(undefined,()=>{throw Error()});eq(await s.logout(),true);eq(s.isBlocked(),true)}],
 ["unsubscribe stops updates",async()=>{const s=make();let n=0;const unsub=s.subscribe(()=>n++);s.invalidate();unsub();s.invalidate();eq(n,1)}],
 ["cancel only own request",async()=>{const s=make(),a=s.begin(),b=s.begin();a.cancel();eq(a.current(),false);eq(b.current(),true)}],
 ["J2 exact transport",async()=>{let captured;const f=createLogoutRequest(async(url,options)=>{captured={url,options};return {ok:true,json:async()=>({ok:true,status:"SIGNED_OUT"})}});eq((await f()).status,"SIGNED_OUT");eq(captured.url,"/api/dev/student-auth/logout");eq(captured.options.method,"POST");eq(captured.options.credentials,"same-origin");eq(captured.options.redirect,"error");eq(captured.options.headers["X-STEM-Student-Auth"],"1");eq("body" in captured.options,false)}],
 ["HTTP error not confirmation",async()=>{const f=createLogoutRequest(async()=>({ok:false,json:async()=>({ok:true,status:"SIGNED_OUT"})}));eq(await f(),null)}]
 ];
}
for(const [name,run] of cases(()=>new AbortController()))test(name,run);
