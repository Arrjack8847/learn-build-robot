import test from "node:test";
import assert from "node:assert/strict";
import {handleJ3TestingCentre,isJ3TestingPreview} from "../scripts/hitpay/j3-testing-page.mjs";
const env={VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:"feat/j3-sandbox-payment-20261126"};
const req=new Request("https://fixture.vercel.app/dev/j3-testing-centre");
test("dedicated preview serves isolated simulation page with nonce CSP",async()=>{const r=handleJ3TestingCentre(req,env);assert.equal(r.status,200);assert.match(r.headers.get("content-security-policy"),/connect-src 'none'/);assert.match(r.headers.get("cache-control"),/no-store/);const s=await r.text();for(const label of ["Independent Testing Centre","Fictional payer","Individual student","Successful payment","Monthly renewal","Confirmation previews","createJ3FixtureCentre"])assert.ok(s.includes(label));const script=s.match(/<script nonce="([^"]+)">([\s\S]+)<\/script>/);assert.ok(script);assert.ok(r.headers.get("content-security-policy").includes(script[1]));assert.doesNotThrow(()=>new Function(script[2]));});
test("production, wrong branch and absent environment denied",()=>{for(const e of [{},{...env,VERCEL_ENV:"production"},{...env,VERCEL_TARGET_ENV:"production"},{...env,VERCEL_GIT_COMMIT_REF:"main"}]){assert.equal(isJ3TestingPreview(e),false);assert.equal(handleJ3TestingCentre(req,e).status,404)}});
test("non-GET and wrong path denied",()=>{assert.equal(handleJ3TestingCentre(new Request(req.url,{method:"POST"}),env).status,405);assert.equal(handleJ3TestingCentre(new Request("https://fixture.vercel.app/student/dashboard"),env).status,404)});

test("rendered client script executes full fictional workflow with DOM harness",async()=>{
 const {runInNewContext}=await import("node:vm");
 const html=await handleJ3TestingCentre(req,env).text();
 const script=html.match(/<script nonce="[^"]+">([\s\S]+)<\/script>/)[1];
 class Element{
  constructor(tag="div"){this.tag=tag;this.textContent="";this.value="";this.children=[];this.listeners={};this.disabled=false;this.hidden=false}
  replaceChildren(...items){this.children=items;if(this.tag==="select")this.value=items[0]?.value??""}
  addEventListener(type,cb){this.listeners[type]=cb}
  click(){if(!this.disabled)this.listeners.click?.()}
  change(value){this.value=value;this.listeners.change?.()}
 }
 const elements=new Map([...html.matchAll(/<(\w+)[^>]*\bid="([^"]+)"/g)].map(([,tag,id])=>[id,new Element(tag)]));
 const get=id=>{assert.ok(elements.has(id),"Missing DOM node "+id);return elements.get(id)};
 const document={getElementById:get,createElement:tag=>new Element(tag)};
 runInNewContext(script,{document,confirm:()=>true});
 assert.equal(get("payer").children.length,5);assert.equal(get("child").children.length,2);assert.equal(get("status").textContent,"inactive");
 get("membership").click();get("return").click();assert.match(get("message").textContent,/remains pending/);assert.equal(get("status").textContent,"inactive");
 get("success").click();assert.equal(get("status").textContent,"simulated active");assert.equal(get("history").children.length,1);assert.equal(get("notifications").children.length,1);
 get("replay").click();assert.equal(get("history").children.length,1);assert.equal(get("renew").disabled,true);
 get("advance").click();assert.equal(get("status").textContent,"simulated expired");assert.equal(get("renew").disabled,false);
 get("renew-failed").click();assert.equal(get("status").textContent,"simulated expired");get("renew").click();assert.equal(get("status").textContent,"simulated active");assert.equal(get("history").children.length,3);assert.equal(get("renew").disabled,true);
 const child=get("child").children[1].value;get("child").change(child);assert.equal(get("status").textContent,"inactive");assert.equal(get("history").children.length,0);
 get("deposit").click();get("success").click();assert.equal(get("status").textContent,"inactive");assert.match(get("history").children[0].textContent,/deposit/);
 const payer=get("payer").children[1].value;get("payer").change(payer);assert.equal(get("history").children.length,0);assert.equal(get("status").textContent,"inactive");
 get("membership").click();get("failed").click();assert.equal(get("status").textContent,"inactive");get("membership").click();get("success").click();assert.equal(get("status").textContent,"simulated active");
 get("reset").click();assert.equal(get("history").children.length,0);assert.equal(get("status").textContent,"inactive");
});
