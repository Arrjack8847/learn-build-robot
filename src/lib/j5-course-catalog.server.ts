import { getProject } from "@/data/practical";
import { findLevelOneCategory } from "@/data/levelOneCategories";
import { getAdvancedLevel } from "@/data/advancedSyllabus";
import type {CoursePath} from "@/lib/j5-course-path.mjs";
import {resolveCourseResource} from "../../scripts/j5/course-authority.mjs";

// Exact catalog lookup; never infer level from browser-provided ID prefixes.
export function resolveJ5CourseResource(route:CoursePath){
 return resolveCourseResource(route,{getProjectLevel:(id:string)=>getProject(id)?.level,hasCategory:(level:number,id:string)=>level===1?Boolean(findLevelOneCategory(id)):getAdvancedLevel(level).some(category=>category.id===id)});
}
