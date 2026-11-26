import {createHmac} from "node:crypto";
import {createAuthCrypto,validPreviewEmail} from "../parent-auth/secure-auth-transport.mjs";
import {createStudentAuthCrypto} from "../student-auth/crypto.mjs";
import {validStudent} from "../j123/billing-records.mjs";
export const J1234_BRANCH="integration/j1-j2-j3-j4-20261126",J1234_SITE="09d613aa-3a95-42ff-9ee3-2aa0c706c447";
export const isJ1234Preview=e=>e.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF===J1234_BRANCH;
export function createJ1234IdentityEnv(e){
 if(!isJ1234Preview(e)||e.J1234_REGISTRATION_ENABLED!=="1"||e.STUDENT_AUTH_ENABLED!=="true"||e.WIX_DEV_SITE_ID!==J1234_SITE||!e.WIX_DEV_DATA_API_KEY?.trim()||!e.RESEND_API_KEY?.trim()||e.PARENT_PREVIEW_VERIFIED_SENDER!=="noreply@mail.bestemready.edu.my")throw Error("J1234_IDENTITY_DISABLED");
 const root=e.J1234_AUTH_ROOT;
 if(!/^[a-fA-F0-9]{64}$/.test(root??"")||new Set(Buffer.from(root,"hex")).size<8||[e.PARENT_AUTH_SECRET,e.STUDENT_AUTH_SECRET].some(x=>typeof x==="string"&&x.toLowerCase()===root.toLowerCase()))throw Error("ISOLATED_ROOT_REQUIRED");
 const emails=(e.J1234_TEST_EMAILS??"").split(",").map(x=>x.trim().toLowerCase());
 if(emails.length>5||new Set(emails).size!==emails.length||!emails.every(validPreviewEmail))throw Error("TEST_INBOXES_REQUIRED");
 const derive=d=>createHmac("sha256",Buffer.from(root,"hex")).update("j1234-private-test-v1/"+d).digest("hex");
 const cfg={...e,PARENT_AUTH_SECRET:derive("payer"),STUDENT_AUTH_SECRET:derive("student"),RESEND_TEST_RECIPIENT:emails[0],PARENT_PREVIEW_RECIPIENTS:emails.slice(1).join(","),PARENT_PREVIEW_OPEN_EMAIL:"0"};
 createAuthCrypto(cfg);createStudentAuthCrypto(cfg);return cfg;
}
export function scopeJ1234StudentCredentials(db){
 const key=(c,id)=>{if(c!=="StudentAuthCredentials")return id;if(!validStudent(id))throw Error("INVALID_STUDENT_ID");return "j1234-pin-v1-"+id;};
 return {...db,get:(c,id)=>db.get(c,key(c,id)),insert:(c,id,row)=>db.insert(c,key(c,id),row),replaceIfVersion:(c,id,v,row)=>db.replaceIfVersion(c,key(c,id),v,row)};
}
