import test from "node:test";
import assert from "node:assert/strict";
import {approvedAliases,runJ1ProviderAcceptance} from "../scripts/j1/provider-acceptance.mjs";
import {createAuthCrypto} from "../scripts/parent-auth/secure-auth-transport.mjs";
const env={VERCEL_ENV:"preview",VERCEL_TARGET_ENV:"preview",VERCEL_GIT_COMMIT_REF:"feat/wix-lms-integration-20261125",PARENT_PREVIEW_OPEN_EMAIL:"1",PARENT_PREVIEW_VERIFIED_SENDER:"noreply@mail.bestemready.edu.my",RESEND_API_KEY:"fixture-only",RESEND_TEST_RECIPIENT:"fixture@gmail.com",PARENT_PREVIEW_RECIPIENTS:[2,3,4,5].map(n=>"fixture+stemlab-parent"+n+"@gmail.com").join(","),PARENT_AUTH_SECRET:"0123456789abcdef".repeat(4)};
const fixture=()=>{const rows=new Map();return {async get(c,id){return structuredClone(rows.get(c+":"+id)??null)},async insert(c,id,row){const key=c+":"+id;if(rows.has(key))return false;rows.set(key,structuredClone(row));return true},async replaceIfVersion(c,id,version,row){const key=c+":"+id;if(rows.get(key)?.stateVersion!==version)return false;rows.set(key,structuredClone(row));return true}}};
test("only exact configured Gmail aliases permitted; production refused",async()=>{
 assert.equal(approvedAliases(env).length,4);
 assert.deepEqual(approvedAliases({...env,PARENT_PREVIEW_RECIPIENTS:env.PARENT_PREVIEW_RECIPIENTS.replace("fixture+stemlab-parent5","someone")}),[]);
 const result=await runJ1ProviderAcceptance({env:{...env,VERCEL_ENV:"production"},store:fixture(),crypto:createAuthCrypto(env),clock:{now:()=>Date.now()},request:()=>{throw Error("unexpected")}});
 assert.equal(result.scope,"REFUSED");
});
test("four mocked transports, CAS, replay, isolated revocation, durable no-repeat marker",async()=>{
 const store=fixture(),crypto=createAuthCrypto(env),clock={now:()=>1795708800000};let sends=0;const request=async(url,opts)=>{assert.equal(url,"https://api.resend.com/emails");const body=JSON.parse(opts.body);assert.ok(approvedAliases(env).includes(body.to[0]));sends++;return new Response(JSON.stringify({id:"fixture-"+sends}));};
 const result=await runJ1ProviderAcceptance({env,store,crypto,clock,request});
 assert.equal(result.oneShot,"COMPLETE");assert.equal(result.databaseWrite,true);assert.equal(result.conditionalUpdate,true);assert.equal(result.staleWriteRejected,true);assert.equal(result.providerAccepted,4);assert.equal(result.otpVerified,4);assert.equal(result.replayRejected,4);assert.equal(result.sessionRevoked,4);assert.equal(result.crossIdentityRejected,3);assert.equal(result.failed,0);assert.equal(sends,4);
 const again=await runJ1ProviderAcceptance({env,store,crypto,clock,request});assert.equal(again.oneShot,"ALREADY_RESERVED");assert.equal(sends,4);
 assert.doesNotMatch(JSON.stringify(result),/@gmail|fixture-only/);
});
