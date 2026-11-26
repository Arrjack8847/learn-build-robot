import test from "node:test";
import assert from "node:assert/strict";
import {createStudentRateLimit} from "../scripts/student-auth/rate-limit.mjs";
test("rate limit reserves exactly five attempts under a concurrent burst, independently across proofs",async()=>{
 const rows=new Map();let now=1000000,seq=0;
 const db={get:async(c,id)=>structuredClone(rows.get(id)??null),insert:async(c,id,row)=>{if(rows.has(id))return false;rows.set(id,structuredClone(row));return true;},replaceIfVersion:async(c,id,v,row)=>{if(rows.get(id)?.stateVersion!==v)return false;rows.set(id,structuredClone(row));return true;}};
 const rate=createStudentRateLimit({db,crypto:{rateDigest:(kind,subject)=>kind+":"+subject,newVersion:()=>String(++seq)},clock:{now:()=>now}});
 const results=await Promise.all(Array.from({length:50},()=>rate.reserve("proof","a",5,300000)));
 assert.equal(results.filter(Boolean).length,5);
 assert.equal(await rate.reserve("proof","a",5,300000),false);
 assert.equal(await rate.reserve("proof","b",5,300000),true);
 assert.equal(await rate.reserve("payer","a",10,900000),true);
 now+=300000;assert.equal(await rate.reserve("proof","a",5,300000),true);
});
