// Runs only on the designated preview build; no repeat sends.
import {isJ1Preview,getJ1Readiness} from "./readiness.mjs";
import {runJ1ProviderAcceptance} from "./provider-acceptance.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {createAuthCrypto} from "../parent-auth/secure-auth-transport.mjs";
const message=process.env.VERCEL_GIT_COMMIT_MESSAGE;
const selected="J1: verify private provider and database acceptance [skip ci]";
if(isJ1Preview(process.env)&&["J1: private readiness centre and safe acceptance audit [skip ci]",selected].includes(message)){
 const checks=await getJ1Readiness(process.env,{probe:true});
 console.log("[J1 readiness audit] "+JSON.stringify(checks));
 if(message===selected&&checks.wixRead==="VERIFIED_READ_ONLY"){
  try{const env=process.env;const result=await runJ1ProviderAcceptance({env,store:createWixStore(env),crypto:createAuthCrypto(env),clock:{now:()=>Date.now()}});console.log("[J1 provider acceptance] "+JSON.stringify(result));}
  catch{console.log("[J1 provider acceptance] "+JSON.stringify({status:"UNCONFIRMED_NO_RETRY"}));}
 }
}
