export function validateSandboxCheckoutRequest(request:Request,env:Record<string,string|undefined>):Promise<{ok:true;expected:string;action:"status"|"open"}|{ok:false;status:number;reason:string}>;
