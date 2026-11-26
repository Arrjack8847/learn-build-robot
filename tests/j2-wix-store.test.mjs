import test from "node:test";
import assert from "node:assert/strict";
import {createWixStore} from "../scripts/parent-auth/wix-store.mjs";
const site="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
const env={VERCEL_ENV:"preview",WIX_DEV_SITE_ID:site,WIX_DEV_DATA_API_KEY:"fixture-not-a-real-key"};
const collection="StudentRegistrationRequests",id="a".repeat(64),row={parentId:"qa-j2-"+"b".repeat(64),requestDigest:id,inputDigest:"c".repeat(64),childId:"qa-j2-"+"d".repeat(64)};
test("Wix store is pinned to development and refuses invalid collections before network access",async()=>{
 let calls=0;const request=async()=>{calls++;throw Error("UNEXPECTED_FETCH");};
 assert.throws(()=>createWixStore({...env,VERCEL_ENV:"production"},request));
 assert.throws(()=>createWixStore({...env,VERCEL_TARGET_ENV:"production"},request));
 assert.throws(()=>createWixStore({...env,WIX_DEV_SITE_ID:"wrong-site"},request));
 assert.throws(()=>createWixStore({...env,WIX_DEV_DATA_API_KEY:""},request));
 const db=createWixStore(env,request);await assert.rejects(db.get("UnknownCollection",id),/INVALID_RECORD_ID/);await assert.rejects(db.get(collection,"../other"),/INVALID_RECORD_ID/);
 assert.equal(calls,0);
});
test("Wix registration and session operations use create-only insert, consistent read and conditional updates",async()=>{
 const root="https://www.wixapis.com/wix-data/v2/items",requests=[];
 const responses=[new Response(JSON.stringify({dataItem:{id,dataCollectionId:collection,data:row}})),new Response(null,{status:409}),new Response(JSON.stringify({dataItem:{id,dataCollectionId:collection,data:row}})),new Response(null,{status:428}),new Response(JSON.stringify({dataItem:{id,dataCollectionId:"StudentAuthSessions",data:{stateVersion:"next"}}})),new Response(JSON.stringify({dataItem:{id:"different",dataCollectionId:collection,data:row}}))];
 const db=createWixStore(env,async(url,options)=>{requests.push({url,...options});assert.equal(options.headers["wix-site-id"],site);assert.equal(options.redirect,"error");assert.equal(options.cache,"no-store");return responses.shift();});
 assert.equal(await db.insert(collection,id,row),true);assert.equal(await db.insert(collection,id,row),false);
 assert.deepEqual(await db.get(collection,id),row);
 assert.equal(await db.replaceIfVersion("StudentAuthSessions",id,"previous",{stateVersion:"next"}),false);
 assert.equal(await db.replaceIfVersion("StudentAuthSessions",id,"previous",{stateVersion:"next"}),true);
 await assert.rejects(db.get(collection,id),/INVALID_WIX_RESPONSE/);
 assert.equal(requests[0].url,root);assert.equal(requests[0].method,"POST");assert.deepEqual(JSON.parse(requests[0].body),{dataCollectionId:collection,dataItem:{id,data:row}});
 assert.equal(requests[2].url,root+"/"+id+"?dataCollectionId="+collection+"&consistentRead=true");
 assert.deepEqual(JSON.parse(requests[3].body).condition,{filter:{stateVersion:{$eq:"previous"}}});
});
