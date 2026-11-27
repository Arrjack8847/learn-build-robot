// New branch has a distinct checkout aggregate namespace, but provider ownership
// indexes remain global across both private branches to prevent duplicate charge claims.
import {isCombinedBranch} from "../combined/scope.mjs";
import {BILLING_COLLECTION} from "../j123/billing-records.mjs";
import {isJ1234Preview} from "./identity-scope.mjs";
import {isJ12345Preview,isCombinedIdentityPreview} from "../j12345/identity-scope.mjs";
export function scopeJ1234BillingStore(db,env){
 if(isCombinedBranch(env)&&!isCombinedIdentityPreview(env))throw Error("COMBINED_BILLING_DISABLED");
 const prefix=isCombinedIdentityPreview(env)?"combined-":isJ12345Preview(env)?"j12345-":isJ1234Preview(env)?"j1234-":null;
 if(!prefix)return db;
 const key=(collection,id)=>collection===BILLING_COLLECTION&&/^j123-checkout-v1-[a-f0-9]{64}$/.test(id)?prefix+id:id;
 return {...db,get:(c,id)=>db.get(c,key(c,id)),insert:(c,id,row)=>db.insert(c,key(c,id),row),replaceIfVersion:(c,id,v,row)=>db.replaceIfVersion(c,key(c,id),v,row)};
}
