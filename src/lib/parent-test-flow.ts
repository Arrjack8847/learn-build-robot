// Fictional UI test data only. Never use this store for authentication, billing,
// booking or course authorization. No network, real email, or real payment.
export type TestStatus = "unpaid" | "pending" | "paid" | "failed" | "cancelled";
export type TestChild = {id:string;name:string;birthYear:number;status:TestStatus;cycle:number;history:number[]};
export type TestFamily = {email:string;children:TestChild[];selectedId:string};
const key="bsr.parent.test-flow.v2";
export const validTestEmail=(value:string)=>/^[a-z0-9][a-z0-9._+-]{0,63}@example\.invalid$/i.test(value);
export const validTestName=(value:string)=>/^(?:Test|Sample|Demo)(?: [A-Za-z0-9 -]{1,40})?$/i.test(value);
export const validTestYear=(value:number)=>Number.isInteger(value)&&value>=1900&&value<=new Date().getFullYear();
export function newTestChild(name:string,birthYear:number):TestChild{
  if(!validTestName(name)||!validTestYear(birthYear))throw Error("Invalid fictional child");
  return {id:crypto.randomUUID(),name,birthYear,status:"unpaid",cycle:1,history:[]};
}
export function readTestFamily():TestFamily|null{
  if(typeof window==="undefined")return null;
  try{
    const v=JSON.parse(sessionStorage.getItem(key)||"null") as TestFamily|null;
    if(!v||typeof v.email!=="string"||!validTestEmail(v.email)||!Array.isArray(v.children)||v.children.length<1||v.children.length>6)return null;
    if(v.children.some(c=>!c||typeof c.id!=="string"||!validTestName(c.name)||!validTestYear(c.birthYear)||!["unpaid","pending","paid","failed","cancelled"].includes(c.status)||![1,2].includes(c.cycle)||!Array.isArray(c.history)||c.history.some(x=>![1,2].includes(x))||new Set(c.history).size!==c.history.length))return null;
    if(new Set(v.children.map(c=>c.id)).size!==v.children.length||!v.children.some(c=>c.id===v.selectedId))return null;
    return v;
  }catch{return null;}
}
export function saveTestFamily(family:TestFamily){sessionStorage.setItem(key,JSON.stringify(family));}
export function clearTestFamily(){sessionStorage.removeItem(key);}
export function createTestFamily(email:string,name:string,birthYear:number):TestFamily{
  if(!validTestEmail(email))throw Error("Invalid fictional email");
  const child=newTestChild(name,birthYear);
  const family={email:email.toLowerCase(),children:[child],selectedId:child.id};
  saveTestFamily(family);return family;
}
export function updateTestChild(family:TestFamily,child:TestChild):TestFamily{
  if(!family.children.some(c=>c.id===child.id))throw Error("Unknown fictional child");
  const next={...family,children:family.children.map(c=>c.id===child.id?child:c)};
  saveTestFamily(next);return next;
}
export type TestEvent="open"|"abandon"|"return"|"success"|"duplicate"|"fail-renewal"|"cancel"|"reset";
export function testPayment(child:TestChild,event:TestEvent):TestChild{
  switch(event){
    case "open":return child.status==="unpaid"?{...child,status:"pending"}:child;
    case "abandon":return child.status==="pending"?{...child,status:"unpaid"}:child;
    case "return":case "duplicate":return child;
    case "success":return (child.status==="pending"||child.status==="failed")&&!child.history.includes(child.cycle)?{...child,status:"paid",history:[...child.history,child.cycle]}:child;
    case "fail-renewal":return child.status==="paid"&&child.cycle===1?{...child,cycle:2,status:"failed"}:child;
    case "cancel":return child.status!=="unpaid"?{...child,status:"cancelled"}:child;
    case "reset":return {...child,status:"unpaid",cycle:1,history:[]};
  }
}
