// Shared J5 client request lifecycle. No token, student ID or auth provider stored.
export function createSessionLifecycle({sendLogout,notify,makeController=()=>new AbortController()}){
 let generation=0,blocked=false,inFlight=null;
 const pending=new Set(),listeners=new Set();
 function invalidate(lock=false){
  if(lock)blocked=true;
  generation++;
  for(const controller of pending)controller.abort();
  pending.clear();
  for(const listener of [...listeners])listener({blocked,generation});
 }
 function begin(){
  const controller=makeController(),epoch=generation;
  if(blocked)controller.abort();else pending.add(controller);
  return {signal:controller.signal,current:()=>!blocked&&!controller.signal.aborted&&epoch===generation,finish:()=>pending.delete(controller),cancel:()=>{controller.abort();pending.delete(controller);}};
 }
 function logout(){
  if(inFlight)return inFlight;
  invalidate(true);
  try{notify();}catch{}
  inFlight=Promise.resolve().then(sendLogout).then(result=>result?.ok===true&&result.status==="SIGNED_OUT").catch(()=>false).finally(()=>{inFlight=null;});
  return inFlight;
 }
 return {begin,invalidate,logout,isBlocked:()=>blocked,subscribe:listener=>{listeners.add(listener);return ()=>{listeners.delete(listener);};}};
}
export function createLogoutRequest(fetcher){
 return async()=>{
  const response=await fetcher("/api/dev/student-auth/logout",{method:"POST",credentials:"same-origin",cache:"no-store",redirect:"error",headers:{"X-STEM-Student-Auth":"1"}});
  if(!response.ok)return null;
  return await response.json();
 };
}
