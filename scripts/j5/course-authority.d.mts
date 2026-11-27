import type {CoursePath} from "../../src/lib/j5-course-path.mjs";
export function resolveCourseResource(route:CoursePath, catalog:{getProjectLevel:(id:string)=>number|undefined;hasCategory:(level:number,id:string)=>boolean}):{kind:string;level:number;checkInRequired:true}|null;
