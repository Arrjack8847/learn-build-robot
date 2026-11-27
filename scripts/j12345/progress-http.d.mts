type Env=Record<string,string|undefined>;
export function createProgressHttp(options:{resolveStudent:(r:Request,e:Env)=>Promise<unknown>;readVerifiedChild:(id:string,e:Env)=>Promise<unknown>;authorizeCourse:(r:Request,e:Env,path:string)=>Promise<unknown>}):(r:Request,e:Env)=>Promise<Response>;
