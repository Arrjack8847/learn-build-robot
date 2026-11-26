import {createFileRoute} from "@tanstack/react-router";
import {useEffect} from "react";
import {DashboardWalkthrough} from "../components/parent-dashboard-walkthrough";
export const Route=createFileRoute("/parent/dashboard")({validateSearch:(search:Record<string,unknown>)=>({walkthrough:search.walkthrough==="1"||search.walkthrough===1?"1":undefined}),component:Entry,head:()=>({meta:[{title:"Student registration and payment | BE STEM READY"},{name:"robots",content:"noindex, nofollow"}]})});
function RedirectToRegistration(){useEffect(()=>{window.location.replace("/parent/sign-in");},[]);return <main className="grid min-h-[100dvh] place-items-center bg-[#f3faff] p-4"><a href="/parent/sign-in" className="font-bold text-sky-700">Continue to student registration or payment</a></main>;}
function Entry(){return Route.useSearch().walkthrough==="1"?<DashboardWalkthrough/>:<RedirectToRegistration/>;}
