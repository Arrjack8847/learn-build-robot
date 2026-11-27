import {createHmac} from "node:crypto";
import {validPreviewEmail} from "../parent-auth/secure-auth-transport.mjs";
export const J12345_BRANCH="integration/j1-j2-j3-j4-j5-20261126";
export const isJ12345Preview=e=>e?.VERCEL_ENV==="preview"&&e.VERCEL_TARGET_ENV!=="production"&&e.VERCEL_GIT_COMMIT_REF===J12345_BRANCH;
export function createJ12345IdentityEnv(e){
 if(!isJ12345Preview(e)||e.J12345_REGISTRATION_ENABLED!=="1"||e.STUDENT_AUTH_ENABLED!=="true"||e.WIX_DEV_SITE_ID!=="09d613aa-3a95-42ff-9ee3-2aa0c706c447"||!e.WIX_DEV_DATA_API_KEY?.trim()||!e.RESEND_API_KEY?.trim()||e.PARENT_PREVIEW_VERIFIED_SENDER!=="noreply@mail.bestemready.edu.my")throw Error("J12345_IDENTITY_DISABLED");
 const root=e.J12345_AUTH_ROOT;
 if(!/^[a-fA-F0-9]{64}$/.test(root??"")||new Set(Buffer.from(root,"hex")).size<8||[e.J1234_AUTH_ROOT,e.PARENT_AUTH_SECRET,e.STUDENT_AUTH_SECRET,e.J1234_TEST_OPERATOR_SECRET,e.J123_MEMBERSHIP_WORKER_SECRET].some(x=>typeof x==="string"&&x.toLowerCase()===root.toLowerCase()))throw Error("ISOLATED_ROOT_REQUIRED");
 const emails=(e.J12345_TEST_EMAILS??"").split(",").map(x=>x.trim().toLowerCase());
 if(emails.length>5||new Set(emails).size!==emails.length||!emails.every(validPreviewEmail))throw Error("TEST_INBOXES_REQUIRED");
 const derive=d=>createHmac("sha256",Buffer.from(root,"hex")).update("j12345-private-test-v1/"+d).digest("hex");
 return {...e,PARENT_AUTH_SECRET:derive("payer"),STUDENT_AUTH_SECRET:derive("student"),RESEND_TEST_RECIPIENT:emails[0],PARENT_PREVIEW_RECIPIENTS:emails.slice(1).join(","),PARENT_PREVIEW_OPEN_EMAIL:"0"};
}
export const validJ12345Student=x=>typeof x==="string"&&/^qa-j2-[a-f0-9]{64}$/.test(x);
export function scopeJ12345StudentCredentials(db){
 const key=(c,id)=>{if(c!=="StudentAuthCredentials")return id;if(!validJ12345Student(id))throw Error("INVALID_STUDENT_ID");return "j12345-pin-v1-"+id;};
 return {...db,get:(c,id)=>db.get(c,key(c,id)),insert:(c,id,row)=>db.insert(c,key(c,id),row),replaceIfVersion:(c,id,v,row)=>db.replaceIfVersion(c,key(c,id),v,row)};
}
