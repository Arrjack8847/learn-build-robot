// Compatibility only: the obsolete dashboard never renders, even with legacy query strings.
import {createFileRoute,redirect} from "@tanstack/react-router";
export const Route=createFileRoute("/parent/dashboard")({beforeLoad:()=>{throw redirect({to:"/parent/sign-in",replace:true});},head:()=>({meta:[{title:"Student registration | BE STEM READY"},{name:"robots",content:"noindex, nofollow"}]})});
