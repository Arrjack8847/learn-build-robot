import {createSessionLifecycle,createLogoutRequest} from "./j5-session-lifecycle.mjs";
const marker="bsr.j5.session.invalidate.v1";
export const j5Session=createSessionLifecycle({
 sendLogout:createLogoutRequest((...args)=>fetch(...args)),
 notify:()=>{if(typeof window!=="undefined")window.localStorage.setItem(marker,crypto.randomUUID());}
});
// Non-secret marker only. Focus and visibility rechecks are fallbacks.
export function attachJ5SessionSignals(){
 const storage=(e:StorageEvent)=>{if(e.key===marker)j5Session.invalidate(true);};
 const hide=()=>j5Session.invalidate();
 const show=(e:PageTransitionEvent)=>{if(e.persisted){window.location.reload();return;}j5Session.invalidate();};
 const visible=()=>j5Session.invalidate();
 window.addEventListener("storage",storage);window.addEventListener("pagehide",hide);window.addEventListener("pageshow",show);
 document.addEventListener("visibilitychange",visible);window.addEventListener("focus",visible);
 return()=>{window.removeEventListener("storage",storage);window.removeEventListener("pagehide",hide);window.removeEventListener("pageshow",show);document.removeEventListener("visibilitychange",visible);window.removeEventListener("focus",visible);};
}
