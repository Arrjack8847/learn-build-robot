import type {WixStore} from "../parent-auth/wix-store.mjs";
import type {SandboxTransport} from "./j3-node-transport.mjs";
type Result={ok:boolean;status:string;checkoutUrl?:string};
export function createSandboxTrial(input:{store:WixStore;provider:SandboxTransport;planId:string;newVersion():string;clock:{now():number}}):{status():Promise<Result>;open():Promise<Result>};
