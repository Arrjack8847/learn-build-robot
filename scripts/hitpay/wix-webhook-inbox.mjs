// Durable sandbox event inbox. Never credits a membership from an event alone.
const collection="PaymentWebhookEvents";
const digestPattern=/^[a-f0-9]{64}$/;
export function createWebhookInbox({store,newVersion}){
  async function insertVerifiedEventOnce(entry){
    const key=entry?.payloadDigest;
    if(entry?.environment!=="sandbox"||!digestPattern.test(key??"")||entry.providerEventKey!==key||entry.processingStatus!=="pending"||!Number.isSafeInteger(entry.receivedAt)||!Number.isSafeInteger(entry.signatureVerifiedAt))throw Error("INVALID_EVENT");
    const row={environment:"sandbox",providerEventKey:key,eventType:entry.eventType,providerObjectId:entry.providerObjectId,payloadDigest:key,receivedAt:{$date:new Date(entry.receivedAt).toISOString()},signatureVerifiedAt:{$date:new Date(entry.signatureVerifiedAt).toISOString()},processingStatus:"pending",stateVersion:newVersion()};
    const saved=await store.insert(collection,key,row);
    if(saved===true)return row;
    // Conflict or duplicate must never reset processing status or replay side effects.
    if(saved!==false)throw Error("EVENT_WRITE_UNCONFIRMED");
    const previous=await store.get(collection,key);
    if(!previous||previous.environment!=="sandbox"||previous.providerEventKey!==key||previous.payloadDigest!==key||previous.providerObjectId!==row.providerObjectId)throw Error("EVENT_WRITE_UNCONFIRMED");
    return previous;
  }
  return {insertVerifiedEventOnce};
}
