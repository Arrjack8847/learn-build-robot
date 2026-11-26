// Sandbox inbox only. Event headers are untrusted routing hints, not payment proof.
import crypto from 'crypto';
const allowed = new Set(['payment_request.completed','payment_request.failed','charge.created','charge.updated','charge.failed','recurring_billing.subscription_updated','recurring_billing.method_attached','recurring_billing.method_detached']);
const merchant = 'a34ebd5e-6bd2-4c62-a13d-b19f58f68fd7';
const LIMIT = 262144;
const id = v => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(v);
export async function receiveSandboxEvent({raw,signature,objectHint,typeHint,salt,insertOnce,now=()=>new Date()}) {
  if(typeof salt !== 'string' || !salt.trim()) return 503;
  if(typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return 401;
  if(!Buffer.isBuffer(raw) && !(raw instanceof Uint8Array)) return 400;
  if(raw.byteLength > LIMIT) return 413;
  const expected = crypto.createHmac('sha256',salt).update(raw).digest();
  if(!crypto.timingSafeEqual(expected,Buffer.from(signature,'hex'))) return 401;
  let body;
  try { body=JSON.parse(Buffer.from(raw).toString('utf8')); } catch { return 400; }
  if(!body || !id(body.id) || body.business_id !== merchant) return 401;
  const hint=String(objectHint)+'.'+String(typeHint);
  if(!allowed.has(hint)) return 200;
  const digest=crypto.createHash('sha256').update(raw).digest('hex');
  const received=now();
  const entry={_id:digest,environment:'sandbox',providerEventKey:digest,eventType:hint,providerObjectId:body.id,payloadDigest:digest,receivedAt:received,signatureVerifiedAt:received,processingStatus:'pending',stateVersion:crypto.randomBytes(16).toString('hex')};
  try { return await insertOnce(entry) === true ? 200 : 503; } catch { return 503; }
}
