import test from "node:test";
import assert from "node:assert/strict";
import {handleJ3TestingCentre,isJ3TestingPreview} from "../scripts/hitpay/j3-testing-page.mjs";
const env={VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:"feat/j3-sandbox-payment-20261126"};
const req=new Request("https://fixture.vercel.app/dev/j3-testing-centre");
test("dedicated preview serves isolated simulation page with nonce CSP",async()=>{const r=handleJ3TestingCentre(req,env);assert.equal(r.status,200);assert.match(r.headers.get("content-security-policy"),/connect-src 'none'/);assert.match(r.headers.get("cache-control"),/no-store/);const s=await r.text();for(const label of ["Independent Testing Centre","Fictional payer","Individual student","Successful payment","Monthly renewal","Confirmation previews","createJ3FixtureCentre"])assert.ok(s.includes(label));const script=s.match(/<script nonce="([^"]+)">([\s\S]+)<\/script>/);assert.ok(script);assert.ok(r.headers.get("content-security-policy").includes(script[1]));assert.doesNotThrow(()=>new Function(script[2]));});
test("production, wrong branch and absent environment denied",()=>{for(const e of [{},{...env,VERCEL_ENV:"production"},{...env,VERCEL_TARGET_ENV:"production"},{...env,VERCEL_GIT_COMMIT_REF:"main"}]){assert.equal(isJ3TestingPreview(e),false);assert.equal(handleJ3TestingCentre(req,e).status,404)}});
test("non-GET and wrong path denied",()=>{assert.equal(handleJ3TestingCentre(new Request(req.url,{method:"POST"}),env).status,405);assert.equal(handleJ3TestingCentre(new Request("https://fixture.vercel.app/student/dashboard"),env).status,404)});
