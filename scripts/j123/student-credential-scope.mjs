// J123 is a separate private testing environment. Stable logical student IDs are unchanged.
// Only the physical PIN credential keys are isolated; J12's old branch and existing hashes are untouched.
// Session and rate-limit keys are already independent, via the branch-specific student cryptography key.
import {validStudent} from "./billing-records.mjs";
const COLLECTION="StudentAuthCredentials";
const scoped=(collection,id)=>{
 if(collection!==COLLECTION)return id;
 if(!validStudent(id))throw Error("INVALID_STUDENT_CREDENTIAL_KEY");
 return "j123-pin-v1-"+id;
};
export function scopeJ123StudentCredentials(db){
 return {...db,get:(c,id)=>db.get(c,scoped(c,id)),insert:(c,id,row)=>db.insert(c,scoped(c,id),row),replaceIfVersion:(c,id,v,row)=>db.replaceIfVersion(c,scoped(c,id),v,row)};
}
