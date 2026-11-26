export function createPrivatePdfHttp(options:{lookupDocument:(id:string)=>unknown|Promise<unknown>;getServices:(env:Record<string,string|undefined>)=>unknown|Promise<unknown>;now?:()=>number}):(request:Request,env:Record<string,string|undefined>)=>Promise<Response>;
export function handleJ5PdfRequest(request:Request,env:Record<string,string|undefined>):Promise<Response>;
