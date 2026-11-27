// Explicit Codespaces-only diagnostics; no provider acceptance inferred, no writes, no email or payment creation.
import {spawnSync} from "node:child_process";
import {randomBytes} from "node:crypto";
import {pathToFileURL} from "node:url";
import {COMBINED_BRANCH,COMBINED_SITE,COMBINED_RECORD} from "./scope.mjs";
import {createWixStore} from "../parent-auth/wix-store.mjs";
import {createJ12345IdentityEnv} from "../j12345/identity-scope.mjs";
import {staffRoster} from "./staff-identity.mjs";
import {secret} from "./http-utils.mjs";
import {J123_ORIGIN,J123_PLAN} from "../j123/infrastructure.mjs";
import {J123_MERCHANT} from "../j123/membership-provider.mjs";
import {createSandboxTransport} from "../hitpay/j3-node-transport.mjs";
import {assignedPdfIds} from "../j5/pdf-course-catalog.mjs";
const configured=v=>typeof v==="string"&&v.trim().length>0;
const sentinel="DISABLED_J3_WIX_VAULT_ONLY";
const WIX="https://www.wixapis.com",VAULT=WIX+"/_api/cloud-secrets-vault-server/api/v1/secrets/name/HITPAY_SANDBOX_API_KEY";
const PLAN=J123_ORIGIN+"/v1/subscription-plan/"+J123_PLAN;
const WEBHOOK=J123_ORIGIN+"/v1/webhook-events";
const query=WIX+"/wix-data/v2/items/query";
const rowUrl=WIX+"/wix-data/v2/items/"+COMBINED_RECORD+"?dataCollectionId=NizarSchedulingPreview&consistentRead=true";
const domains="https://api.resend.com/domains";
const destination="https://designerbestemread.wixstudio.com/my-site-1/_functions/hitpaySandbox";
const events=["charge.created","charge.updated","recurring_billing.subscription_updated","recurring_billing.method_detached","payment_request.completed"];
const state=b=>b?"CONFIGURED":"NOT_CONFIGURED";
export async function inspectProviders(env,{probe=false,request=fetch}={}){
 const checks={};
 const out={checks,providerAcceptance:"NOT_VERIFIED",releaseReady:false,liveAcceptance:"NOT_RUN",privateDocumentsExpected:assignedPdfIds().length};
 if(env.CODESPACES!=="true"||env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||env.VERCEL_GIT_COMMIT_REF!==COMBINED_BRANCH||env.WIX_DEV_SITE_ID!==COMBINED_SITE||env.NIZAR_FIXTURE_ENABLED==="1"||env.NIZAR_STAFF_FIXTURE_ENABLED==="1"){checks.scope="REFUSED";return out;}
 checks.scope="PASS";
 const wix=configured(env.WIX_DEV_DATA_API_KEY),resend=configured(env.RESEND_API_KEY),sender=env.PARENT_PREVIEW_VERIFIED_SENDER==="noreply@mail.bestemready.edu.my";
 const hitpay=env.HITPAY_API_URL===J123_ORIGIN&&env.HITPAY_PLAN_ID===J123_PLAN&&env.HITPAY_CURRENCY==="MYR"&&env.HITPAY_MEMBERSHIP_AMOUNT==="360.00"&&env.HITPAY_SANDBOX_PAYMENT_METHOD==="touch_n_go"&&["HITPAY_API_KEY","HITPAY_SALT_KEY","HITPAY_API_BASE_URL"].every(k=>env[k]===sentinel);
 checks.wixCredential=state(wix);checks.resendCredential=state(resend);checks.resendSender=state(sender);checks.hitpaySandboxIsolation=state(hitpay);
 try{createJ12345IdentityEnv(env);checks.identity="CONFIGURED";}catch{checks.identity="NOT_CONFIGURED";}
 checks.staffRoster=state(staffRoster(env).some(r=>r.enabled));checks.workerKey=state(secret(env,"COMBINED_WORKER_KEY"));checks.checkinKey=state(secret(env,"COMBINED_CODE_SECRET"));
 checks.privateDocumentConfig=state(configured(env.COMBINED_PRIVATE_PDF_ORIGIN)&&configured(env.COMBINED_PRIVATE_PDF_TOKEN)&&/^[a-f0-9]{64}$/.test(env.COMBINED_PRIVATE_PDF_MANIFEST_SHA256??""));
 for(const k of ["wixRead","combinedScheduleRead","resendDomainRead","hitpayPlanRead","hitpayWebhookRead"])checks[k]="NOT_RUN";
 for(const k of ["wixConditionalWrite","otpInboxDelivery","noticeInboxDelivery","genuineTngPayment","signedWebhookDelivery","billingPeriodEvidence","failedRenewalEvidence","depositEvidence","privateDocumentAccess","staffLogin","workerExecution","securityReview","staticCurriculumPrivacy"])checks[k]="NOT_VERIFIED";
 if(!probe)return out;
 // Narrow transport: allow only exact URLs and GET, except a bounded read-only Wix query.
 const safe=async(url,options)=>{
  const method=options?.method;
  if(![VAULT,PLAN,WEBHOOK,rowUrl,domains,query].includes(url)||method!==(url===query?"POST":"GET")||options.redirect!=="error")throw Error("READ_ONLY_BOUNDARY");
  if(url===query){const b=JSON.parse(options.body);if(b.dataCollectionId!=="Children"||!/^qa-j2-[a-f0-9]{64}$/.test(b.query?.filter?.parentId??"")||b.query?.filter?.accountStatus!=="preview-test"||b.query?.paging?.limit!==50)throw Error("QUERY_REFUSED");}
  return request(url,options);
 };
 const get=(url,headers)=>safe(url,{method:"GET",headers,redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)});
 const wixHeaders={Authorization:env.WIX_DEV_DATA_API_KEY,"wix-site-id":COMBINED_SITE,Accept:"application/json"};
 const attempt=async(k,fn)=>{try{checks[k]=await fn();}catch{checks[k]="READ_UNCONFIRMED";}};
 if(wix){
  await attempt("wixRead",async()=>{const rows=await createWixStore(env,safe).listFixtureChildren("qa-j2-"+randomBytes(32).toString("hex"));return rows.length===0?"VERIFIED_READ_ONLY":"READ_UNCONFIRMED";});
  await attempt("combinedScheduleRead",async()=>{const r=await get(rowUrl,wixHeaders);if(r.status===404)return "ROW_NOT_FOUND_OR_COLLECTION_UNCONFIRMED";if(!r.ok)return "READ_UNCONFIRMED";const item=(await r.json()).dataItem;const d=item?.data;if(item?.id!==COMBINED_RECORD||item?.dataCollectionId!=="NizarSchedulingPreview"||d?.environment!=="private-preview"||typeof d.stateVersion!=="string"||typeof d.stateJson!=="string"||JSON.parse(d.stateJson)?.scope!==COMBINED_RECORD)return "READ_UNCONFIRMED";return "VERIFIED_READ_ONLY";});
 }
 if(resend&&sender)await attempt("resendDomainRead",async()=>{const r=await get(domains,{Authorization:"Bearer "+env.RESEND_API_KEY,Accept:"application/json"});if(!r.ok)return "READ_UNCONFIRMED";const d=await r.json();return Array.isArray(d.data)&&d.data.some(x=>x.name==="mail.bestemready.edu.my"&&x.status==="verified")?"VERIFIED_READ_ONLY":"READ_UNCONFIRMED";});
 if(wix&&hitpay){
  let key=null;
  try{const r=await get(VAULT,wixHeaders);if(r.ok){const v=(await r.json()).value;if(configured(v)&&v!==sentinel)key=v;}}catch{}
  if(key){
   await attempt("hitpayPlanRead",async()=>{const t=createSandboxTransport({...env,HITPAY_API_BASE_URL:J123_ORIGIN,HITPAY_API_KEY:key,HITPAY_SANDBOX_PLAN_ID:J123_PLAN},safe);const p=await t.getVerifiedFixturePlan();return p?.amountMinor===36000&&p.currency==="MYR"&&p.cycle==="monthly"?"VERIFIED_READ_ONLY":"READ_UNCONFIRMED";});
   await attempt("hitpayWebhookRead",async()=>{const r=await get(WEBHOOK,{"X-BUSINESS-API-KEY":key,"X-Requested-With":"XMLHttpRequest",Accept:"application/json"});if(!r.ok)return "READ_UNCONFIRMED";const d=await r.json();return Array.isArray(d)&&d.some(x=>x.business_id===J123_MERCHANT&&x.url===destination&&Array.isArray(x.event_types)&&events.every(e=>x.event_types.includes(e)))?"VERIFIED_READ_ONLY":"READ_UNCONFIRMED";});
  }else{checks.hitpayPlanRead="VAULT_UNCONFIRMED";checks.hitpayWebhookRead="VAULT_UNCONFIRMED";}
 }
 return out;
}
const git=(...args)=>{const r=spawnSync("git",args,{encoding:"utf8"});if(r.status!==0)throw Error("GIT_PREFLIGHT");return r.stdout.trim();};
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 try{
  const e=process.env,probe=process.argv.length===3&&process.argv[2]==="--probe";
  if(process.argv.length>2&&!probe||e.CODESPACES!=="true"||e.VERCEL_ENV==="production"||e.VERCEL_TARGET_ENV==="production"||git("rev-parse","--show-toplevel")!==process.cwd()||git("status","--porcelain")||git("rev-parse","HEAD")!==git("rev-parse","refs/remotes/origin/"+COMBINED_BRANCH))throw Error("PREFLIGHT_REFUSED");
  // Derive branch from checked-out exact ref, not a user-supplied deployment label. No runtime or acceptance flags are enabled.
  const result=await inspectProviders({...e,VERCEL_ENV:"preview",VERCEL_GIT_COMMIT_REF:COMBINED_BRANCH},{probe});
  console.log(JSON.stringify({commit:git("rev-parse","HEAD"),probe,...result},null,2));
  if(result.checks.scope!=="PASS"||probe&&Object.values(result.checks).some(v=>["READ_UNCONFIRMED","VAULT_UNCONFIRMED","ROW_NOT_FOUND_OR_COLLECTION_UNCONFIRMED","NOT_CONFIGURED"].includes(v)))process.exitCode=1;
 }catch{console.error("Phase 8 preflight refused; use clean combined Codespaces HEAD and approved development configuration only.");process.exitCode=1;}
}
