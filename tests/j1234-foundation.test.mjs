import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createJ4FixtureHttp} from "../scripts/staff/j4-fixture-http.mjs";
import {createIntegratedCheckoutHttp} from "../scripts/j123/checkout-http.mjs";
import {createMembershipWorkerHttp} from "../scripts/j123/membership-worker-http.mjs";
import {isJ123Preview} from "../scripts/j123/infrastructure.mjs";
const cfg={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:"integration/j1-j2-j3-j4-20261126",VERCEL_URL:"fixture.vercel.app",WIX_DEV_SITE_ID:"09d613aa-3a95-42ff-9ee3-2aa0c706c447",WIX_DEV_DATA_API_KEY:"fixture",J4_FIXTURE_WIX_ENABLED:"1",J123_CHECKOUT_ENABLED:"true",J123_GENUINE_WEBHOOK_ACCEPTED:"true",J123_MEMBERSHIP_WORKER_ENABLED:"true"};
const request=path=>new Request("https://fixture.vercel.app"+path,{method:"POST",headers:{"content-type":"application/json",origin:"https://fixture.vercel.app","sec-fetch-site":"same-origin","x-stem-j4-fixture":"1","x-stem-j123":"1"},body:"{}"});
test("J1234 branch foundation cannot use standalone fixture or J123 payment runtime",async()=>{
 let calls=0;const deny=()=>{calls++;throw Error("UNEXPECTED_SIDE_EFFECT");};
 assert.equal(isJ123Preview(cfg),false);
 assert.equal((await createJ4FixtureHttp({makeStore:deny})(request("/api/dev/j4-fixture/session"),cfg)).status,404);
 assert.equal((await createIntegratedCheckoutHttp({resolvePayer:deny,storeFactory:deny,requestFn:deny})(request("/api/dev/j123/checkout"),cfg)).status,404);
 assert.equal((await createMembershipWorkerHttp({storeFactory:deny,requestFn:deny})(request("/api/dev/j123/membership-worker"),cfg)).status,404);
 assert.equal(calls,0);
});
test("server keeps J123 routes and denies unfinished J1234 API; fixture UI stays standalone-only",()=>{
 const server=readFileSync(new URL("../src/server.ts",import.meta.url),"utf8"),vite=readFileSync(new URL("../vite.config.ts",import.meta.url),"utf8");
 for(const route of ["/api/dev/j1/readiness","/api/dev/student-auth/","/api/dev/parent-otp/","/api/dev/j123/checkout","/api/dev/j123/membership-worker","/api/dev/j4-fixture/","/api/dev/staff-private/","/api/dev/j1234/"])assert.ok(server.includes(route),route);
 assert.match(server,/startsWith\("\/api\/dev\/j1234\/"\).*status:404/);
 assert.match(vite,/__J4_FIXTURE_PREVIEW__.*feat\/j4-private-staff-admin-20261126/);
 assert.doesNotMatch(vite,/__J4_FIXTURE_PREVIEW__.*integration\/j1-j2-j3-j4/);
});
