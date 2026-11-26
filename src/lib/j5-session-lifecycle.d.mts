export type J5RequestTicket={signal:AbortSignal;current:()=>boolean;finish:()=>void;cancel:()=>void};
export function createSessionLifecycle(options:{sendLogout:()=>Promise<unknown>;notify:()=>void;makeController?:()=>AbortController}):{begin:()=>J5RequestTicket;invalidate:(lock?:boolean)=>void;logout:()=>Promise<boolean>;isBlocked:()=>boolean;subscribe:(listener:(state:{blocked:boolean;generation:number})=>void)=>()=>void};
export function createLogoutRequest(fetcher:typeof fetch):()=>Promise<unknown>;
