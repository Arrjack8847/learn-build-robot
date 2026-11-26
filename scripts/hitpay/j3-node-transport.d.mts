import {isAllowedSandboxCheckoutUrl} from "./checkout-url.mjs";
export interface SandboxTransport {
 createHostedSubscription(input:{planId:string;customerEmail:string;reference:string}):Promise<{subscriptionId:string;url:string}>;
 isAllowedCheckoutUrl:typeof isAllowedSandboxCheckoutUrl;
 getVerifiedFixturePlan():Promise<{planId:string;amountMinor:number;currency:string;cycle:string;chargeCount:number}|null>;
 confirmNoMatchingSubscription(reference:string):Promise<boolean>;
}
export function createSandboxTransport(env:Record<string,string|undefined>,request?:typeof fetch):SandboxTransport;
export const signatures:{verify(raw:Uint8Array,signature:string,salt:string):boolean};
