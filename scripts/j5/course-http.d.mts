export function createCourseHttp(options:{getAuthority:(env:Record<string,string|undefined>)=>unknown|Promise<unknown>}):(request:Request,env:Record<string,string|undefined>,next:()=>Promise<Response>)=>Promise<Response>;
export function handleJ5CourseRequest(request:Request,env:Record<string,string|undefined>,next:()=>Promise<Response>):Promise<Response>;
