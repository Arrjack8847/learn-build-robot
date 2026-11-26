import {test} from "node:test";
import {createJ5Http} from "../scripts/j5/http.mjs";
function httpCases(){
 const env={VERCEL_ENV:"preview",J5_PRIVATE_ENABLED:"true"};
 const makeRequest=(method="POST",body='{"code":"00123456"}',overrides={})=>{
  const map={"content-type":"application/json","origin":"https://preview.invalid","x-stem-j5":"1","sec-fetch-site":"same-origin",...overrides};
  let sent=false;const reader={read:async()=>sent?{done:true}:(sent=true,{done:false,value:Uint8Array.from([...body].map(c=>c.charCodeAt(0)))}),cancel:async()=>{},releaseLock:()=>{}};
  return {method,url:"https://preview.invalid/api/dev/j5/check-in",headers:{get:k=>map[k]??null},body:{getReader:()=>reader}};
 };
 function make(){
  const state={calls:0,last:null};
  const handler=createJ5Http({getServices:async()=>({overview:{load:async()=>({ok:true,profile:{displayName:"Fictional"},levels:[]})},checkIn:{verify:async(r,e,i)=>{state.calls++;state.last={r,i};return {ok:true,validUntil:3000,secret:"do-not-leak"}}}}),parseOrigin:()=>"https://preview.invalid",respond:(status,body,headers)=>({status,body,headers})});
  return {state,handler};
 }
 const eq=(a,b)=>{if(a!==b)throw Error(`Expected ${b}, got ${a}`)};
 const run=(f,r=makeRequest(),e=env,p="/api/dev/j5/check-in")=>f.handler(r,e,p);
 return [
 ["valid request forwards trusted original request",async()=>{let f=make(),q=makeRequest(),r=await run(f,q);eq(r.status,200);eq(f.state.last.r.originalRequest,q);eq(f.state.last.i.code,"00123456");eq("secret" in r.body,false);eq(r.headers["Cache-Control"],"private, no-store, max-age=0")}],
 ["disabled flag fails closed",async()=>{let f=make();eq((await run(f,makeRequest(),{VERCEL_ENV:"preview"})).status,404);eq(f.state.calls,0)}],
 ["production denied",async()=>eq((await run(make(),makeRequest(),{...env,VERCEL_ENV:"production"})).status,404)],
 ["wrong method",async()=>eq((await run(make(),makeRequest("GET"))).status,405)],
 ["cross origin rejected",async()=>{let f=make();eq((await run(f,makeRequest("POST",undefined,{origin:"https://evil.invalid"}))).status,403);eq(f.state.calls,0)}],
 ["missing custom header",async()=>eq((await run(make(),makeRequest("POST",undefined,{"x-stem-j5":null}))).status,403)],
 ["cross-site metadata",async()=>eq((await run(make(),makeRequest("POST",undefined,{"sec-fetch-site":"cross-site"}))).status,403)],
 ["extra identity field",async()=>eq((await run(make(),makeRequest("POST",'{"code":"00123456","studentId":"b"}'))).status,400)],
 ["oversize stream rejected",async()=>eq((await run(make(),makeRequest("POST"," ".repeat(257)))).status,400)],
 ["oversize declared rejected",async()=>eq((await run(make(),makeRequest("POST",undefined,{"content-length":"999"}))).status,400)],
 ["malformed JSON rejected",async()=>eq((await run(make(),makeRequest("POST","{"))).status,400)],
 ["overview GET",async()=>{let f=make();eq((await run(f,makeRequest("GET"),env,"/api/dev/j5/overview")).status,200);eq(f.state.calls,0)}],
 ["unknown endpoint",async()=>eq((await run(make(),makeRequest(),env,"/api/dev/j5/other")).status,404)]
 ];
}
for(const [name,run] of httpCases())test(name,run);
