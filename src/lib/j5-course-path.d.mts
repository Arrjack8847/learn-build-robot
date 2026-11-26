export type CoursePath={scope:"invalid"|"outside"|"shell"}|{scope:"protected";kind:"level"|"category"|"challenge"|"activity"|"project"|"quiz";level?:number;categoryId?:string;projectId?:string};
export function classifyCoursePath(path:string):CoursePath;
