import type {WixStore,WixRow} from "../parent-auth/wix-store.mjs";
export interface VerifiedEvent{environment:"sandbox";providerEventKey:string;eventType:string;providerObjectId:string;payloadDigest:string;receivedAt:number;signatureVerifiedAt:number;processingStatus:"pending"}
export interface WebhookInbox{insertVerifiedEventOnce(entry:VerifiedEvent):Promise<WixRow>}
export function createWebhookInbox(input:{store:WixStore;newVersion():string}):WebhookInbox;
