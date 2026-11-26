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

for(const typeHint of ['completed','failed'])test('signed payment request '+typeHint+' with exact merchant is pending only',async()=>{const f=fixture();assert.equal(await f.run({objectHint:'payment_request',typeHint}),200);assert.equal([...f.inbox.values()][0].processingStatus,'pending');});
test('payment request without merchant requires authenticated provider lookup',async()=>{const f=fixture();const b=Buffer.from(JSON.stringify({id:'fixture-request'}));assert.equal(await f.run({raw:b,signature:sign(b),objectHint:'payment_request',typeHint:'completed'}),503);assert.equal(f.inbox.size,0)});

for(const [objectHint,typeHint] of [['charge','created'],['charge','updated'],['charge','failed'],['recurring_billing','method_attached'],['recurring_billing','method_detached'],['recurring_billing','subscription_updated'],['payment_request','completed'],['payment_request','failed']])test('allowlisted signed '+objectHint+'.'+typeHint+' goes to pending inbox only',async()=>{const f=fixture();assert.equal(await f.run({objectHint,typeHint}),200);assert.equal(f.inbox.size,1);const e=[...f.inbox.values()][0];assert.equal(e.eventType,objectHint+'.'+typeHint);assert.equal(e.processingStatus,'pending');assert.equal(e.status,undefined)});
const merchant='a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7';
const requestRaw=Buffer.from(JSON.stringify({id:'fixture-request'}));
function requestPatch(extra={}){return {raw:requestRaw,signature:sign(requestRaw),objectHint:'payment_request',typeHint:'completed',...extra};}
test('missing merchant accepted only after exact authenticated location owner proof',async()=>{const f=fixture();let n=0;assert.equal(await f.run(requestPatch({lookupPaymentRequest:async id=>{n++;return {id,location:{business_id:merchant}}}})),200);assert.equal(n,1);assert.equal([...f.inbox.values()][0].processingStatus,'pending')});
test('wrong owner, mismatched id, conflicting proof and absent owner fail closed',async()=>{for(const proof of [{id:'fixture-request',business_id:'other'},{id:'other',business_id:merchant},{id:'fixture-request',business_id:merchant,location:{business_id:'other'}},{id:'fixture-request'}]){const f=fixture();assert.equal(await f.run(requestPatch({lookupPaymentRequest:async()=>proof})),401);assert.equal(f.inbox.size,0)}});
test('lookup network failure retriable and forged signatures never invoke lookup',async()=>{const f=fixture();assert.equal(await f.run(requestPatch({lookupPaymentRequest:async()=>{throw Error('offline')}})),503);let n=0;assert.equal(await f.run(requestPatch({signature:'0'.repeat(64),lookupPaymentRequest:async()=>{n++}})),401);assert.equal(n,0);assert.equal(f.inbox.size,0)});
test('explicit wrong merchant never overridden by lookup',async()=>{const f=fixture();const b=Buffer.from(JSON.stringify({id:'fixture-request',business_id:'other'}));let n=0;assert.equal(await f.run(requestPatch({raw:b,signature:sign(b),lookupPaymentRequest:async()=>{n++;return {id:'fixture-request',business_id:merchant}}})),401);assert.equal(n,0);assert.equal(f.inbox.size,0)});
