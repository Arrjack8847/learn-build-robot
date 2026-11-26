import type {WebhookInbox} from "./wix-webhook-inbox.mjs";
type Env=Record<string,string|undefined>;
export function createSandboxWebhook(input:{resolveInbox(env:Env):WebhookInbox|Promise<WebhookInbox>;clock?:{now():number}}):(request:Request,env:Env)=>Promise<Response>;
