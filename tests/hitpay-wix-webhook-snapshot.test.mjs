import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../scripts/hitpay/qa/wix-webhook-core-snapshot.js',import.meta.url),'utf8');
const {receiveSandboxEvent}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const salt='fixture-only-secret';
const raw=Buffer.from(JSON.stringify({id:'fixture-charge',business_id:'a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7',status:'succeeded'}));
const sign=b=>crypto.createHmac('sha256',salt).update(b).digest('hex');
function fixture(){
 const inbox=new Map();
 const input={raw,signature:sign(raw),objectHint:'charge',typeHint:'created',salt,insertOnce:async e=>{if(!inbox.has(e._id))inbox.set(e._id,e);return true}};
 return {input,inbox,run:patch=>receiveSandboxEvent({...input,...patch})};
}
test('signed event stored once, pending only',async()=>{const f=fixture();assert.equal(await f.run(),200);assert.equal(await f.run(),200);assert.equal(f.inbox.size,1);const e=[...f.inbox.values()][0];assert.equal(e.processingStatus,'pending');assert.equal(e.environment,'sandbox');assert.equal(e.status,undefined);assert.equal(e.raw,undefined)});
test('forged signature rejected',async()=>{const f=fixture();assert.equal(await f.run({signature:'0'.repeat(64)}),401);assert.equal(f.inbox.size,0)});
test('wrong merchant rejected',async()=>{const f=fixture();const b=Buffer.from(JSON.stringify({id:'fixture',business_id:'other'}));assert.equal(await f.run({raw:b,signature:sign(b)}),401);assert.equal(f.inbox.size,0)});
test('missing salt and malformed body fail closed',async()=>{const f=fixture();assert.equal(await f.run({salt:''}),503);const b=Buffer.from('{');assert.equal(await f.run({raw:b,signature:sign(b)}),400)});
test('unknown event ignored',async()=>{const f=fixture();assert.equal(await f.run({objectHint:'payout'}),200);assert.equal(f.inbox.size,0)});
test('unconfirmed persistence retriable',async()=>{const f=fixture();assert.equal(await f.run({insertOnce:async()=>false}),503)});
test('oversized request refused',async()=>{const f=fixture();assert.equal(await f.run({raw:Buffer.alloc(262145)}),413)});
