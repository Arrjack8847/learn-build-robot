import {randomBytes} from "node:crypto";
import {createWixStore} from "../../scripts/parent-auth/wix-store.mjs";
import {createWebhookInbox} from "../../scripts/hitpay/wix-webhook-inbox.mjs";
import {createSandboxWebhook} from "../../scripts/hitpay/sandbox-webhook-http.mjs";
// No public protection bypass is configured. Registration remains blocked until
// the endpoint can be safely reached by HitPay and its separate salt is set.
export const handleHitPaySandboxWebhook=createSandboxWebhook({
 resolveInbox:(env:NodeJS.ProcessEnv)=>createWebhookInbox({store:createWixStore(env),newVersion:()=>randomBytes(16).toString("hex")})
});
